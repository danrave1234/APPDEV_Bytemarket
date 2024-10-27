import {Route, Routes} from "react-router-dom";
import LandingPage from "./LandingPage.jsx";
import UserProfile from "./UserProfile.jsx";
import OrderHistory from "./OrderHistory.jsx";

export default function TheRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />}/>
            <Route path="/customer/userProfile" element={<UserProfile />}/>
            <Route path="/customer/orderHistory" element={<OrderHistory />}/>
        </Routes>
    )

    //import {useNavigate } from "react-router-dom";
    //const navigate = useNavigate(); // Initialize navigate using the hook
    // const handleNext = () => {           change handleNext into something that fits kung asa nimo ibutang, like handleHome
    //     navigate("/summaryinfo");        Ilisan ang /summaryinfo into the path like "/perinfo" based sa example sa line 5
    // };
    //
    // const handlePrevious = () => {       Same Here
    //     navigate("/educbg");
    // };
}