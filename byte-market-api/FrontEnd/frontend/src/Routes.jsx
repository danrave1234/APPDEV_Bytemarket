import {Route, Routes} from "react-router-dom";
import LandingPage from "./LandingPage.jsx";
import RegisterPage from "./RegisterPage.jsx";
import LoginPage from "./LoginPage.jsx";

export default function TheRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />}/>
            <Route path="/registerpage" element={<RegisterPage />}/>
            <Route path="/loginpage" element={<LoginPage />}/>
        </Routes>
    )
    // const handleNext = () => {           change handleNext into something that fits kung asa nimo ibutang, like handleHome
    //     navigate("/summaryinfo");        Ilisan ang /summaryinfo into the path like "/perinfo" based sa example sa line 5
    // };
    //
    // const handlePrevious = () => {       Same Here
    //     navigate("/educbg");
    // };
}