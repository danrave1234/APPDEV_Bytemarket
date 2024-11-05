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
    const [showPassword, setShowPassword] = useState(false); // Add state for password visibility
    const { userid, role, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (userid) {
            const fetchUser = async () => {
                try {
                    setLoading(true);
                    let response;
                    if (role === 'Admin') {
                        response = await axios.get(`http://localhost:8080/api/admin/getAdminById/${userid}`);
                    } else if (role === 'Seller') {
                        response = await axios.get(`http://localhost:8080/api/seller/getSellerById/${userid}`);
                    } else {
                        response = await axios.get(`http://localhost:8080/api/customer/getCustomerById/${userid}`);
                    }
                    setUser(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        }
    }, [userid, role]);

    const handleEditToggle = () => setEditMode(!editMode);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSave = async () => {
        try {
            if (role === 'Admin') {
                await axios.put(`http://localhost:8080/api/admin/updateAdmin/${userid}`, user);
            } else if (role === 'Seller') {
                await axios.put(`http://localhost:8080/api/seller/updateSeller/${userid}`, user);
            } else {
                await axios.put(`http://localhost:8080/api/customer/updateCustomer/${userid}`, user);
            }
            setEditMode(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update profile.');
        }
    };

    const handleDelete = async () => {
        const deleteApiUrl = role === 'Admin'
            ? `http://localhost:8080/api/admin/deleteAdmin/${userid}`
            : role === 'Seller'
                ? `http://localhost:8080/api/seller/deleteSeller/${userid}`
                : `http://localhost:8080/api/customer/deleteCustomer/${userid}`;

        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await axios.delete(deleteApiUrl);
                alert('Account deleted successfully.');
                logout();
                navigate('/');
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('Failed to delete account. Please try again later.');
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>No user data available.</p>;

    const today = new Date();
    today.setDate(today.getDate() - 1);
    const formattedToday = today.toISOString().split('T')[0];
    return (
        <PageLayout>
            <div className="profile-container">
                <h2>User {role} Profile</h2>
                <section className="profile-details">
                    <div className="profile-field">
                        <label>Full Name:</label>
                        {editMode ? (
                            <input type="text" name="fullname" value={user.fullname} onChange={handleInputChange} />
                        ) : (
                            <p>{user.fullname}</p>
                        )}
                    </div>
                    <div className="profile-field">
                        <label>Email:</label>
                        {editMode ? (
                            <input type="email" name="email" value={user.email} onChange={handleInputChange} />
                        ) : (
                            <p>{user.email}</p>
                        )}
                    </div>
                    <div className="profile-field">
                        <label>Phone Number:</label>
                        {editMode ? (
                            <input type="tel" name="phonenumber" value={user.phonenumber} onChange={handleInputChange} />
                        ) : (
                            <p>{user.phonenumber}</p>
                        )}
                    </div>
                    <div className="profile-field">
                        <label>Address:</label>
                        {editMode ? (
                            <input type="text" name="address" value={user.address} onChange={handleInputChange} />
                        ) : (
                            <p>{user.address}</p>
                        )}
                    </div>
                    <div className="profile-field">
                        <label>Date Of Birth:</label>
                        {editMode ? (
                            <input
                                type="date"
                                name="dateofbirth"
                                value={user.dateofbirth} // Use formData for controlled input
                                onChange={handleInputChange}
                                max={formattedToday} // Prevent selection of future dates
                                required
                            />) : (
                            <p>{user.dateofbirth}</p>
                        )}
                    </div>
                    {role === 'Seller' && (
                        <>
                            <div className="profile-field">
                                <label>Store Name:</label>
                                {editMode ? (
                                    <input type="text" name="storename" value={user.storename} onChange={handleInputChange} />
                                ) : (
                                    <p>{user.storename}</p>
                                )}
                            </div>
                            <div className="profile-field">
                                <label>Seller Name:</label>
                                {editMode ? (
                                    <input type="text" name="sellername" value={user.sellername} onChange={handleInputChange} />
                                ) : (
                                    <p>{user.sellername}</p>
                                )}
                            </div>
                            <div className="profile-field">
                                <label>Balance:</label>
                                {editMode ? (
                                    <input type="number" name="balance" value={user.balance} onChange={handleInputChange} />
                                ) : (
                                    <p>{user.balance}</p>
                                )}
                            </div>
                        </>
                    )}
                    <div className="profile-field">
                        <label>Password:</label>
                        {editMode ? (
                            <div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={user.password}
                                    onChange={handleInputChange}
                                />
                                <button onClick={() => setShowPassword(!showPassword)} type="button">
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        ) : (
                            <p>{'*'.repeat(user.password.length)}</p>
                        )}
                    </div>
                    {editMode ? (
                        <button onClick={handleSave}>Save Changes</button>
                    ) : (
                        <button onClick={handleEditToggle}>Edit Profile</button>
                    )}
                    <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white', marginTop: '10px' }}>
                        Delete Account
                    </button>
                </section>
            </div>
        </PageLayout>
    );
}

export default UserProfile;
