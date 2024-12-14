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
    const [modal, setModal] = useState({type: '', message: '', isVisible: false, action: null});
    const {userid, role, logout} = useAuth();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
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
                }
            };
            fetchUser();
        }
    }, [userid, role]);

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUser({...user, [name]: value});
    };

    const handleSave = async () => {
        try {
            let response;
            if (role === 'Admin') {
                response = await axios.put(`http://localhost:8080/api/admin/updateAdmin/${userid}`, user);
            } else if (role === 'Seller') {
                const {products, ...updatedUser} = user;
                response = await axios.put(`http://localhost:8080/api/seller/updateSeller/${userid}`, updatedUser);
            } else {
                response = await axios.put(`http://localhost:8080/api/customer/updateCustomer/${userid}`, user);
            }
            setEditMode(false);
            setModal({type: 'success', message: 'Profile updated successfully!', isVisible: true});
        } catch (error) {
            console.error('Error updating user:', error);
            setModal({
                type: 'error',
                message: error.response?.data?.message || 'Failed to update profile.',
                isVisible: true
            });
        }
    };

    const handleDelete = async () => {
        const deleteApiUrl = role === 'Admin'
            ? `http://localhost:8080/api/admin/deleteAdmin/${userid}`
            : role === 'Seller'
                ? `http://localhost:8080/api/seller/deleteSeller/${userid}`
                : `http://localhost:8080/api/customer/deleteCustomer/${userid}`;

        setModal({
            type: 'confirm',
            message: 'Are you sure you want to delete your account? This action cannot be undone.',
            isVisible: true,
            action: async () => {
                try {
                    await axios.delete(deleteApiUrl);
                    setModal({type: 'success', message: 'Account deleted successfully.', isVisible: true});
                    logout();
                    navigate('/');
                } catch (error) {
                    console.error('Error deleting account:', error);
                    setModal({
                        type: 'error',
                        message: error.response?.data?.message || 'An error occurred while deleting the account.',
                        isVisible: true
                    });
                }
            }
        });
    };

    const handleCancel = () => {
        setEditMode(false);
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = async () => {
                try {
                    const image = reader.result;
                    const cleanedImage = image.replace(/^data:image\/[a-z]+;base64,/, "");

                    setProfilePic({profilepic: cleanedImage});

                    await axios.put(`http://localhost:8080/api/user/updateUserProfile/${userid}`, {
                        profilepic: cleanedImage
                    });

                    setUser((prevUser) => ({
                        ...prevUser,
                        profilepic: cleanedImage
                    }));

                    setModal({type: 'success', message: 'Profile image updated successfully!', isVisible: true});
                } catch (error) {
                    console.error('Error uploading profile image:', error);
                    setModal({type: 'error', message: 'Failed to upload profile image.', isVisible: true});
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const renderModal = () => {
        if (!modal.isVisible) return null;

        return (
            <div className="modal-overlay">
                <div className="modal">
                    <p>{modal.message}</p>
                    {modal.type === 'confirm' ? (
                        <div className="modal-buttons">
                            <button onClick={() => {
                                modal.action();
                                setModal({...modal, isVisible: false});
                            }}>Yes
                            </button>
                            <button onClick={() => setModal({...modal, isVisible: false})}>No</button>
                        </div>
                    ) : (
                        <button onClick={() => setModal({...modal, isVisible: false})}>Close</button>
                    )}
                </div>
            </div>
        );
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

    return (
        <PageLayout>
            {modal.isVisible && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderRadius: "8px",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            textAlign: "center",
                            maxWidth: "400px",
                            width: "90%",
                        }}
                    >
                        <p style={{ marginBottom: "20px", fontSize: "16px" }}>
                            {modal.message}
                        </p>
                        {modal.type === "confirm" ? (
                            <div style={{ display: "flex", justifyContent: "space-around" }}>
                                <button
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#007BFF",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        modal.action();
                                        setModal({ ...modal, isVisible: false });
                                    }}
                                >
                                    Yes
                                </button>
                                <button
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#DC3545",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setModal({ ...modal, isVisible: false })}
                                >
                                    No
                                </button>
                            </div>
                        ) : (
                            <button
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#28A745",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    marginTop: "10px",
                                }}
                                onClick={() => setModal({ ...modal, isVisible: false })}
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            )}
            <div className="profile-container">
                <h2 className="profile-title">User {role} Profile</h2>
                <div
                    className="profile-image"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {user?.profilepic ? (
                        <img
                            src={`data:image/jpeg;base64,${user.profilepic}`}
                            alt={user.fullname}
                        />
                    ) : (
                        <div className="profile-placeholder-image">No image available</div>
                    )}
                    {isHovered && (
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "50%",
                            }}
                        >
                            <button
                                style={{
                                    padding: "10px 15px",
                                    backgroundColor: "#007BFF",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                                onClick={() =>
                                    document.getElementById("profile-image-input").click()
                                }
                            >
                                Edit Image
                            </button>
                        </div>
                    )}
                    <input
                        id="profile-image-input"
                        type="file"
                        style={{ display: "none" }}
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
                        <label>Date of Birth:</label>
                        <input
                            type="date"
                            name="dob"
                            value={user.dateofbirth}
                            onChange={handleInputChange}
                            max={formattedToday}
                            readOnly={!editMode}
                        />
                    </div>
                    {role === "Seller" && (
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
                                <textarea
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
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={user.password}
                            onChange={handleInputChange}
                            readOnly={!editMode}
                        />
                        <button
                            style={{
                                padding: "5px 10px",
                                backgroundColor: "#17A2B8",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                marginLeft: "10px",
                            }}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </section>
                <div className="profile-actions">
                    {!editMode ? (
                        <button
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#007BFF",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                marginRight: "10px",
                            }}
                            onClick={handleEditToggle}
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            <button
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#28A745",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    marginRight: "10px",
                                }}
                                onClick={handleSave}
                            >
                                Save
                            </button>
                            <button
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#DC3545",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    marginRight: "10px",
                                }}
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </>
                    )}
                    <button
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#FFC107",
                            color: "#212529",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                        onClick={handleDelete}
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </PageLayout>
    );

}

    export default UserProfile;
