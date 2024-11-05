import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/AddToCart.css';
import PageLayout from "./components/Layout.jsx";
import { useAuth } from "./components/AuthProvider.jsx";

function AddToCart() {
    const { userid, isLoggedIn } = useAuth();
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem('cartItems');
        return storedCart ? JSON.parse(storedCart) : [];
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleCheckOut = () => {
        navigate('/customer/CheckOut');
    };

    useEffect(() => {
        if (isLoggedIn && userid) {
            const fetchCartItems = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/cart/getAllCart`);
                    // Filter only items that belong to the logged-in user
                    const userCartItems = response.data.filter(item => item.customer.userid === parseInt(userid));
                    setCartItems(userCartItems);
                    // Store user's cart items in localStorage
                    localStorage.setItem('cartItems', JSON.stringify(userCartItems));
                } catch (error) {
                    console.error('Error fetching cart items:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCartItems();
        }
    }, [userid, isLoggedIn]);

    const handleQuantityChange = async (cartItem, newQuantity) => {
        if (newQuantity < 1) return; // Prevent setting quantity less than 1

        const updatedCartItem = {
            ...cartItem,
            quantity: newQuantity,
            customer: { userid: cartItem.customer.userid },
            product: { productid: cartItem.product.productid }
        };

        try {
            await axios.put(
                `http://localhost:8080/api/cart/updateCart/${cartItem.cartid}`,
                updatedCartItem
            );
            const updatedCartItems = cartItems.map(item =>
                item.cartid === cartItem.cartid ? { ...item, quantity: newQuantity } : item
            );
            setCartItems(updatedCartItems);
            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        } catch (error) {
            console.error('Error updating cart quantity:', error);
        }
    };

    const handleRemoveItem = async (cartId) => {
        try {
            await axios.delete(`http://localhost:8080/api/cart/deleteCart/${cartId}`);
            const updatedCartItems = cartItems.filter(item => item.cartid !== cartId);
            setCartItems(updatedCartItems);
            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        } catch (error) {
            console.error('Error removing cart item:', error);
        }
    };

    if (loading) return <p>Loading your cart...</p>;

    return (
        <PageLayout>
            <div className="cart-container">
                <h2>Your Cart</h2>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty. Add some products to get started!</p>
                ) : (
                    cartItems.map((item) => (
                        <div className="cart-item" key={item.cartid}>
                            <h3 className="product-name">{item.product.productname}</h3>
                            <p className="product-category">Category: {item.product.category}</p>
                            <p className="product-stock">Stock: {item.product.quantity}</p>
                            <p className="product-price">Price: ${item.product.price.toFixed(2)}</p>
                            <div className="quantity-box">
                                <button
                                    onClick={() =>
                                        handleQuantityChange(item, item.quantity - 1)
                                    }
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) =>
                                        handleQuantityChange(item, parseInt(e.target.value))
                                    }
                                />
                                <button
                                    onClick={() =>
                                        handleQuantityChange(item, item.quantity + 1)
                                    }
                                >
                                    +
                                </button>
                            </div>
                            <button
                                className="remove-button"
                                onClick={() => handleRemoveItem(item.cartid)}
                            >
                                Remove
                            </button>
                        </div>
                    ))
                )}
            </div>
            <button className="checkout-button" onClick={handleCheckOut}>Proceed to Checkout</button>
        </PageLayout>
    );
}

export default AddToCart;
