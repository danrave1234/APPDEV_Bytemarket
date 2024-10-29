import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/AddToCart.css';
import PageLayout from "./components/Layout.jsx";
import { useAuth } from "./components/AuthProvider.jsx";

function AddToCart() {
    const { userid } = useAuth(); // Assuming user ID comes from context
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch cart items for the user when the component mounts
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/cart/getAllCart`);
                setCartItems(response.data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCartItems();
    }, [userid]);

    const handleQuantityChange = async (cartItem, newQuantity) => {
        if (newQuantity < 1) return; // Prevent setting quantity less than 1

        const updatedCartItem = {
            ...cartItem,
            quantity: newQuantity,
            customer: { userid: cartItem.customer.userid }, // Ensure proper structure
            product: { productid: cartItem.product.productid }
        };

        try {
            await axios.put(
                `http://localhost:8080/api/cart/updateCart/${cartItem.cartid}`,
                updatedCartItem
            );
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.cartid === cartItem.cartid ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            console.error('Error updating cart quantity:', error);
        }
    };

    const handleRemoveItem = async (cartId) => {
        try {
            await axios.delete(`http://localhost:8080/api/cart/deleteCart/${cartId}`);
            setCartItems((prevItems) =>
                prevItems.filter((item) => item.cartid !== cartId)
            );
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
        </PageLayout>
    );
}

export default AddToCart;
