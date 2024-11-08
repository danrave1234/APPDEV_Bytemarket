import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthProvider.jsx';
import './WalletModal.css';

const WalletModal = ({ show, closeModal }) => {
    const { userid, role } = useAuth();
    const [userData, setUserData] = useState(null);
    const [cashInAmount, setCashInAmount] = useState('');

    useEffect(() => {
        if (userid) {
            const fetchUserData = async () => {
                try {
                    let response;
                    if (role === 'Seller') {
                        response = await axios.get(`http://localhost:8080/api/seller/getSellerById/${userid}`);
                    } else {
                        response = await axios.get(`http://localhost:8080/api/customer/getCustomerById/${userid}`);
                    }
                    setUserData(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUserData();
        }
    }, [userid, role]);

    const handleCashIn = async () => {
        if (!cashInAmount || isNaN(cashInAmount)) {
            alert('Please enter a valid amount.');
            return;
        }

        try {
            if (role === 'Seller') {
                await axios.put(`http://localhost:8080/api/seller/addBalanceSeller/${userid}`, null, {
                    params: { balance: parseFloat(cashInAmount) },
                });
            } else {
                await axios.put(`http://localhost:8080/api/customer/addBalanceCustomer/${userid}`, null, {
                    params: { balance: parseFloat(cashInAmount) },
                });
            }
            setUserData((prev) => ({
                ...prev,
                balance: prev.balance + parseFloat(cashInAmount),
            }));
            setCashInAmount('');
            alert('Balance updated successfully!');
        } catch (error) {
            console.error('Error adding balance:', error);
            alert('Failed to update balance.');
        }
    };

    if (!show || !userData) return null;

    return (
        <div className="modal-overlay">
            <div className="wallet-modal">
                <button className="close-button" onClick={closeModal}>X</button>
                <h2>Wallet</h2>
                <div className="wallet-content">
                    <div className="user-card">
                        <h3>{userData.fullname}</h3>
                        {role === 'Seller' && (
                            <>
                                <p className="role-text">{userData.sellername}</p>
                                <p>{userData.storename}</p>
                            </>
                        )}
                        <p>{role}</p>
                        <p>{userData.email}</p>
                        <p>{userData.phonenumber}</p>
                        <p>{new Date(userData.dateofbirth).toLocaleDateString()}</p>
                    </div>
                    <div className="balance-info">
                        <p className="balance-amount">${userData.balance.toFixed(2)}</p>
                        <p className="balance-label">Current Balance</p>
                    </div>
                </div>
                <div className="cash-in-input">
                    <input
                        type="number"
                        placeholder="Enter amount to Cash In"
                        value={cashInAmount}
                        onChange={(e) => setCashInAmount(e.target.value)}
                    />
                    <button onClick={handleCashIn} className="cash-in">Cash In</button>
                </div>
                <div className="wallet-buttons">
                    <input
                        type="number"
                        placeholder="Enter amount to Cash Out"
                    />
                    <button className="cash-out">Cash Out</button>
                </div>
            </div>
        </div>
    );
};

export default WalletModal;
