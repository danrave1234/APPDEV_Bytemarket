import {useNavigate} from "react-router-dom";

export default function LoginPage(props) {
    const navigate = useNavigate();
    const handleregister = () => {
        navigate("/registerpage");
    };
    const handlewelcome = () => {
        navigate("/");
    };
    return (
        <>
            <h1>Login Bitch ass</h1>
            <button onClick={handleregister}><b>NO ACCOUNT?? REGISTER NOW!!!!</b></button>
            <button onClick={handlewelcome}><b>SUBMIT!</b></button>
        </>
    )
};