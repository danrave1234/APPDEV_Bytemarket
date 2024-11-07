import {Route, Routes} from "react-router-dom";
import LandingPage from "./LandingPage.jsx";
import UserProfile from "./UserProfile.jsx";
import OrderHistory from "./OrderHistory.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import Store from "./Store.jsx";
import CheckOut from "./CheckOut.jsx";
import AddToCart from "./AddToCart.jsx";
import Wishlist from "./Wishlist.jsx"
import Rating from "./Rating.jsx"
import Product from "./Product.jsx"
import ProductListing from "./ProductListing.jsx"

export default function TheRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />}/>
            <Route path="/customer/userProfile" element={<UserProfile />}/>
            <Route path="/customer/orderHistory" element={<OrderHistory />}/>
            <Route path="/admin/dashboard" element={<AdminDashboard />}/>
            <Route path="/seller/store" element={<Store />}/>
            <Route path="/customer/CheckOut" element={<CheckOut />}/>
            <Route path="/customer/addToCart" element={<AddToCart />}/>
            <Route path="/customer/wishlists" element={<Wishlist />}/>
            <Route path="/customer/rating" element={<Rating />}/>
            <Route path="/productdetail/:productid" element={<Product />} />
            <Route path="/productlisting" element={<ProductListing />} />
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