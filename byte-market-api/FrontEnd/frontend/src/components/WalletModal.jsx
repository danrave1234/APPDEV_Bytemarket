import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthProvider.jsx';
import './WalletModal.css';

const WalletModal = ({ show, closeModal }) => {
    const { userid, role } = useAuth();
    const [userData, setUserData] = useState(null);
    const [cashInAmount, setCashInAmount] = useState('');
    const [cashOutAmount, setCashOutAmount] = useState('');

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
                    // Ensure balance is a number
                    const data = { ...response.data, balance: Number(response.data.balance || 0) };
                    setUserData(data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUserData();
        }
    }, [userid, role]);

    const handleCashIn = async () => {
        const amount = parseFloat(cashInAmount);
        if (!cashInAmount || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount greater than 0.');
            return;
        }

        try {
            if (role === 'Seller') {
                await axios.put(`http://localhost:8080/api/seller/addBalanceSeller/${userid}`, null, {
                    params: { balance: amount },
                });
            } else {
                await axios.put(`http://localhost:8080/api/customer/addBalanceCustomer/${userid}`, null, {
                    params: { balance: amount },
                });
            }
            setUserData((prev) => ({
                ...prev,
                balance: (parseFloat(prev.balance) + amount).toFixed(2),
            }));
            setCashInAmount('');
            alert('Balance updated successfully!');
        } catch (error) {
            console.error('Error adding balance:', error);
            alert('Failed to update balance.');
        }
    };

    const handleCashOut = async () => {
        const amount = parseFloat(cashOutAmount);
        if (!cashOutAmount || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount greater than 0.');
            return;
        }

        if (amount > userData.balance) {
            alert('Insufficient balance for this transaction.');
            return;
        }

        try {
            if (role === 'Seller') {
                await axios.put(`http://localhost:8080/api/seller/subtractBalanceSeller/${userid}`, null, {
                    params: { balance: amount },
                });
            } else {
                await axios.put(`http://localhost:8080/api/customer/subtractBalanceCustomer/${userid}`, null, {
                    params: { balance: amount },
                });
            }
            setUserData((prev) => ({
                ...prev,
                balance: (parseFloat(prev.balance) - amount).toFixed(2),
            }));
            setCashOutAmount('');
            alert('Balance deducted successfully!');
        } catch (error) {
            console.error('Error deducting balance:', error);
            alert('Failed to deduct balance.');
        }
    };


    if (!show || !userData) return null;

    return (
        <div className="modal-overlay-wallet">
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
                        <p className="balance-amount" title={`₱${Number(userData.balance).toFixed(2)}`}>
                            ₱{Number(userData.balance).toFixed(2)}
                        </p>
                        <p className="balance-label">Current Balance</p>
                    </div>
                </div>
                <div className="cash-in-input">
                    <input
                        type="number"
                        placeholder="Enter amount to Cash In"
                        value={cashInAmount}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 9 && !isNaN(value)) {
                                setCashInAmount(value);
                            }
                        }}
                    />
                    <button onClick={handleCashIn} className="cash-in">Cash In</button>
                </div>
                <div className="cash-out-input">
                    <input
                        type="number"
                        placeholder="Enter amount to Cash Out"
                        value={cashOutAmount}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 9 && !isNaN(value)) {
                                setCashOutAmount(value);
                            }
                        }}
                    />
                    <button onClick={handleCashOut} className="cash-out">Cash Out</button>
                </div>
            </div>
        </div>
    );
};

export default WalletModal;