import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/UserProfile.css';
import PageLayout from "./components/Layout.jsx";
import { useAuth } from "./components/AuthProvider.jsx";

function UserProfile() {
    const [customer, setCustomer] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const { userid } = useAuth();

    useEffect(() => {
        if (userid) {
            const fetchCustomer = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`http://localhost:8080/api/customer/getCustomerById/${userid}`);
                    setCustomer(response.data);
                } catch (error) {
                    console.error('Error fetching customer data:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchCustomer();
        }
    }, [userid]);

    const handleEditToggle = () => setEditMode(!editMode);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    const handleSave = async () => {
        try {
            await axios.put(`/api/customer/updateCustomer/${customer.userid}`, customer);
            setEditMode(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating customer:', error);
            alert('Failed to update profile.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!customer) return <p>No customer data available.</p>;

    return (
        <PageLayout>
            <div className="profile-container">
                <h2>User Profile</h2>
                <section className="profile-details">
                    <div className="profile-field">
                        <label>Full Name:</label>
                        {editMode ? (
                            <input type="text" name="fullname" value={customer.fullname} onChange={handleInputChange}/>
                        ) : (
                            <p>{customer.fullname}</p>
                        )}
                    </div>
                    <div className="profile-field">
                        <label>Email:</label>
                        {editMode ? (
                            <input type="email" name="email" value={customer.email} onChange={handleInputChange}/>
                        ) : (
                            <p>{customer.email}</p>
                        )}
                    </div>
                    <div className="profile-field">
                        <label>Phone Number:</label>
                        {editMode ? (
                            <input type="tel" name="phonenumber" value={customer.phonenumber}
                                   onChange={handleInputChange}/>
                        ) : (
                            <p>{customer.phonenumber}</p>
                        )}
                    </div>
                    <div className="profile-field">
                        <label>Address:</label>
                        {editMode ? (
                            <input type="text" name="address" value={customer.address} onChange={handleInputChange}/>
                        ) : (
                            <p>{customer.address}</p>
                        )}
                    </div>
                    <div className="profile-field">
                        <label>Date Of Birth:</label>
                        {editMode ? (
                            <input type="date" name="dateofbirth" value={customer.dateofbirth}
                                   onChange={handleInputChange}/>
                        ) : (
                            <p>{customer.dateofbirth}</p>
                        )}
                    </div>
                    <div className="profile-field">
                        <label>Password:</label>
                        {editMode ? (
                            <input type="password" name="password" value={customer.password}
                                   onChange={handleInputChange}/>
                        ) : (
                            <p>{customer.password}</p>
                        )}
                    </div>
                    {editMode ? (
                        <button onClick={handleSave}>Save Changes</button>
                    ) : (
                        <button onClick={handleEditToggle}>Edit Profile</button>
                    )}
                </section>
            </div>
        </PageLayout>
    );
}

export default UserProfile;
