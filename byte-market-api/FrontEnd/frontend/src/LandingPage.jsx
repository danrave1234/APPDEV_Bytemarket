import {useNavigate} from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();
    const handleRegister = () => {
        navigate("/registerpage");
    };
    return (
        <>
            <h1>Hello, this is our landing page</h1>
            <button onClick={handleRegister}><b>REGISTER NOW!!!!</b></button>
        </>
    )
}   