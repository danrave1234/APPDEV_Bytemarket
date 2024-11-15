import {Navigate, Route, Routes} from "react-router-dom";
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
import Reviews from "./Reviews.jsx"
import Storepage from"./Storepage.jsx"
import {useAuth} from "./components/AuthProvider.jsx";

function ProtectedRoute({ children, allowedRoles }) {
        const { role } = useAuth(); // Get the role from the context
    return allowedRoles.includes(role) ? children : <Navigate to="/" />; // Redirect if not authorized
}

export default function TheRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />}/>
            <Route path="/customer/userProfile" element={
                    <ProtectedRoute allowedRoles={["Customer" , "Seller", "Admin"]}>
                        <UserProfile />
                    </ProtectedRoute>}/>
            <Route path="/customer/orderHistory" element={
                    <ProtectedRoute allowedRoles={["Customer"]}>
                                <OrderHistory />
                    </ProtectedRoute>}/>
            <Route path="/admin/dashboard" element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <AdminDashboard />
                    </ProtectedRoute>}/>
            <Route path="/seller/store" element={
                    <ProtectedRoute allowedRoles={["Seller"]}>
                        <Store />
                    </ProtectedRoute>}/>
            <Route path="seller/CheckOut" element={
                    <ProtectedRoute allowedRoles={["Seller"]}>
                        <CheckOut />
                    </ProtectedRoute>}/>
            <Route path="/customer/addToCart" element={
                    <ProtectedRoute allowedRoles={["Customer"]}>
                        <AddToCart />
                    </ProtectedRoute>}/>
            <Route path="/customer/wishlists" element={
                    <ProtectedRoute allowedRoles={["Customer"]}>
                        <Wishlist />
                    </ProtectedRoute>}/>
            <Route path="/customer/rating" element={
                    <ProtectedRoute allowedRoles={["Customer"]}>
                        <Rating />
                    </ProtectedRoute>}/>
            <Route path="/productdetail/:productid" element={<Product />}/>
            <Route path="/productdetail/:productid/reviews" element={
                    <ProtectedRoute allowedRoles={["Customer", "Seller", "Admin"]}>
                        <Reviews/>
                    </ProtectedRoute>}/>
            <Route path="/productlisting" element={<ProductListing />}/>
            <Route path="/store/:userid" element={
                    <ProtectedRoute allowedRoles={["Customer", "Seller", "Admin"]}>
                        <Storepage />
                    </ProtectedRoute>}/>
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