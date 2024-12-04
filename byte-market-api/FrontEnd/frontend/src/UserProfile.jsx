import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/UserProfile.css';
import PageLayout from "./components/Layout.jsx";
import {useAuth} from "./components/AuthProvider.jsx";

function UserProfile() {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const { userid, role, logout } = useAuth();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false); // State to manage hover
    const [profilePic, setProfilePic] = useState({
        profilepic: ""
    });
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
                    console.log("Finished fetching user data.");
                }
            };
            fetchUser();
        }
    }, [userid, role]);

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSave = async () => {
        try {
            let response;
            if (role === 'Admin') {
                response = await axios.put(`http://localhost:8080/api/admin/updateAdmin/${userid}`, user);
            } else if (role === 'Seller') {
                const { products, ...updatedUser } = user;
                response = await axios.put(`http://localhost:8080/api/seller/updateSeller/${userid}`, updatedUser);
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

        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await axios.delete(deleteApiUrl);
                alert('Account deleted successfully.');
                logout();
                navigate('/');
            } catch (error) {
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
        setEditMode(false);
    };

    if (loading) {
        return (
            <PageLayout>
                <div className="spinner"></div>
            </PageLayout>
        );
    }
    if (!user) {
        return (
            <PageLayout>
                <p>No user data available.</p>
            </PageLayout>
        );
    }


    const today = new Date();
    today.setDate(today.getDate() - 1);
    const formattedToday = today.toISOString().split('T')[0];

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Selected file for upload:", file);
            const reader = new FileReader();

            reader.onloadend = async () => {
                try {
                    const image = reader.result; // base64 string of the image
                    console.log("Base64 Image Data:", image);

                    // Send the base64 image to the server to update the profile
                    const cleanedImage = image.replace(/^data:image\/[a-z]+;base64,/, ""); // Clean the base64 string

                    setProfilePic({
                        profilepic: cleanedImage,
                    });

                    // Make the API request to update the profile picture
                    const response = await axios.put(
                        `http://localhost:8080/api/user/updateUserProfile/${userid}`,
                        { profilepic: cleanedImage }
                    );


                    // Update the user state to reflect the new profile picture
                    setUser((prevUser) => ({
                        ...prevUser,
                        profilepic: cleanedImage, // Assuming the response contains the updated image data
                    }));

                    alert('Profile image updated successfully!');
                } catch (error) {
                    console.error("Error uploading profile image:", error);
                    alert('Failed to upload profile image.');
                }
            };

            // Start reading the file as a base64 string
            reader.readAsDataURL(file);
        }
    };

    return (
        <PageLayout>
            <div className="profile-container">
                <h2 className="profile-title">User {role} Profile</h2>
                <div className="profile-image"
                     onMouseEnter={() => setIsHovered(true)}
                     onMouseLeave={() => setIsHovered(false)}
                >
                    {user?.profilepic ? (
                        <img src={`data:image/jpeg;base64,${user.profilepic}`} alt={user.fullname}/>
                    ) : (
                        <div className="profile-placeholder-image">No image available</div>
                    )}
                    {isHovered && (
                        <div className="edit-overlay">
                            <button
                                className="edit-profileimage-btn"
                                onClick={() => document.getElementById("profile-image-input").click()}
                            >
                                Edit Image
                            </button>
                        </div>
                    )}
                    <input
                        id="profile-image-input"
                        type="file"
                        style={{display: "none"}}
                        onChange={handleImageChange}
                    />
                </div>
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