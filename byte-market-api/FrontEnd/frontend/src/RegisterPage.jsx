import {useNavigate} from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();
    const handlewelcome = () => {
        navigate("/");
    };
    const handlelogin = () => {
        navigate("/loginpage");
    };
    return(
        <>
            <h1>Hello this is our sign up page</h1>
            <button onClick={handlewelcome}><b>Back to Welcome Page</b></button>
            <button onClick={handlelogin}><b>ALREADY HAVE AN ACCOUNT? LOGIN!!</b></button>
        </>
    )
}