import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/UserProfile.css';
import PageLayout from "./components/Layout.jsx";
import { useAuth } from "./components/AuthProvider.jsx";

function UserProfile() {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const { userid, role, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("UserProfile component mounted.");
        if (userid) {
            const fetchUser = async () => {
                try {
                    setLoading(true);
                    console.log("Fetching user data for userId:", userid, "with role:", role);
                    let response;
                    if (role === 'Admin') {
                        response = await axios.get(`http://localhost:8080/api/admin/getAdminById/${userid}`);
                    } else if (role === 'Seller') {
                        response = await axios.get(`http://localhost:8080/api/seller/getSellerById/${userid}`);
                    } else {
                        response = await axios.get(`http://localhost:8080/api/customer/getCustomerById/${userid}`);
                    }
                    console.log("Fetched user data:", response.data);
                    setUser(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                } finally {
                    setLoading(false);
                    console.log("Finished fetching user data.");
                }
            };
            fetchUser();
        }
    }, [userid, role]);

    const handleEditToggle = () => {
        console.log("Toggling edit mode. Current state:", editMode);
        setEditMode(!editMode);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("Changing input:", name, "to value:", value);
        setUser({ ...user, [name]: value });
    };

const handleSave = async () => {
    console.log("Saving profile for userId:", userid, "with role:", role);
    try {
        console.log("Payload being sent:", user);
        let response;
        if (role === 'Admin') {
            response = await axios.put(`http://localhost:8080/api/admin/updateAdmin/${userid}`, user);
        } else if (role === 'Seller') {
            response = await axios.put(`http://localhost:8080/api/seller/updateSeller/${userid}`, user);
        } else {
            response = await axios.put(`http://localhost:8080/api/customer/updateCustomer/${userid}`, user);
        }
        setEditMode(false);
        console.log("Profile updated successfully.");
        alert('Profile updated successfully!');
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.response && error.response.data) {
            alert(`Error: ${error.response.data.message || 'Failed to update profile.'}`);
        } else {
            alert('Failed to update profile.');
        }
    }
};


    const handleDelete = async () => {
        const deleteApiUrl = role === 'Admin'
            ? `http://localhost:8080/api/admin/deleteAdmin/${userid}`
            : role === 'Seller'
                ? `http://localhost:8080/api/seller/deleteSeller/${userid}`
                : `http://localhost:8080/api/customer/deleteCustomer/${userid}`;
        console.log("Delete URL:", deleteApiUrl);

        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                console.log("Deleting account for userId:", userid);
                await axios.delete(deleteApiUrl);
                alert('Account deleted successfully.');
                logout();
                navigate('/');
            } catch (error) {
                console.error('Error deleting account:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    alert(`Error: ${error.response.data.message || 'An error occurred while deleting the account.'}`);
                } else if (error.request) {
                    console.error('Request made but no response received:', error.request);
                    alert('No response from the server. Please try again later.');
                } else {
                    console.error('Error setting up request:', error.message);
                    alert('An unexpected error occurred. Please try again.');
                }
            }
        }
    };

    const handleCancel = () => {
        console.log("Canceling edit mode. Reverting changes.");
        setEditMode(false);
    };

    if (loading) {
        console.log("Loading user data...");
        return <p>Loading...</p>;
    }
    if (!user) {
        console.log("No user data available.");
        return <p>No user data available.</p>;
    }

    const today = new Date();
    today.setDate(today.getDate() - 1);
    const formattedToday = today.toISOString().split('T')[0];
    return (
        <PageLayout>
            <div className="profile-container">
                <h2 className="profile-title">User {role} Profile</h2>
                <section className="profile-details">
                    <div className="profile-field">
                        <label>Full Name:</label>
                        <input
                            type="text"
                            name="fullname"
                            value={user.fullname}
                            onChange={handleInputChange}
                            readOnly={!editMode}
                        />
                    </div>
                    <div className="profile-field">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                            readOnly={!editMode}
                        />
                    </div>
                    <div className="profile-field">
                        <label>Phone Number:</label>
                        <input
                            type="tel"
                            name="phonenumber"
                            value={user.phonenumber}
                            onChange={handleInputChange}
                            readOnly={!editMode}
                        />
                    </div>
                    <div className="profile-field">
                        <label>Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={user.address}
                            onChange={handleInputChange}
                            readOnly={!editMode}
                        />
                    </div>
                    <div className="profile-field">
                        <label>Date Of Birth:</label>
                        <input
                            type="date"
                            name="dateofbirth"
                            value={user.dateofbirth}
                            onChange={handleInputChange}
                            max={formattedToday}
                            readOnly={!editMode}
                        />
                    </div>
                    {role === 'Seller' && (
                        <>
                            <div className="profile-field">
                                <label>Store Name:</label>
                                <input
                                    type="text"
                                    name="storename"
                                    value={user.storename}
                                    onChange={handleInputChange}
                                    readOnly={!editMode}
                                />
                            </div>
                            <div className="profile-field">
                                <label>Seller Name:</label>
                                <input
                                    type="text"
                                    name="sellername"
                                    value={user.sellername}
                                    onChange={handleInputChange}
                                    readOnly={!editMode}
                                />
                            </div>
                        </>
                    )}
                    <div className="profile-field">
                        <label>Password:</label>
                        <div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={user.password}
                                onChange={handleInputChange}
                                readOnly={!editMode}
                            />
                            <button onClick={() => {
                                console.log("Toggling password visibility. Current state:", showPassword);
                                setShowPassword(!showPassword);
                            }}>
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                </section>
                <div className="button-group">
                    {!editMode ? (
                        <>
                            <button className="edit-button" onClick={handleEditToggle}>Edit</button>
                            <button className="delete-button" onClick={handleDelete}>Delete</button>
                        </>
                    ) : (
                        <>
                            <button className="save-button" onClick={handleSave}>Save</button>
                            <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                        </>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}

export default UserProfile;
