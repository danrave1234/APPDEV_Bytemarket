import './styles/Product.css'
import PageLayout from "./components/Layout.jsx";
import { useAuth } from "./components/AuthProvider.jsx";

function Product() {
    const {userid} = useAuth();

    return (
        <>
            <PageLayout>
                <div className="container">
                    {/*
                    IMPORTANT:
                    This component uses a standardized PageLayout to maintain consistency across pages.
                    Please do NOT modify the layout structure or any elements within PageLayout itself.
                    Add or edit content only within this <div className="container"> for injected data.
                    */}
                </div>
            </PageLayout>
        </>
    )
}
export default Product;