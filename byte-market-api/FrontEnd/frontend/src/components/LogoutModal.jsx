import {useAuth} from "./AuthProvider.jsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import './LogoutModal.css';

const LogoutModal = ({show, closeModal}) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/");
        closeModal();
    };
    const handleClose = () =>{
        closeModal();
    }
    if (!show) return null;
    return (
        <>
            <div className="logout-modal-overlay">
                <div className="logout-modal-box">
                    <h1>Logout</h1>
                    <p>Are you sure you want to logout?</p>
                    <button className="logout-logoutButton" onClick={handleLogout}>
                        Logout
                    </button>
                    <button className="logout-logoutCancelButton" onClick={handleClose}>
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}
export default LogoutModal;