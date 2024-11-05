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
    const [selectedItems, setSelectedItems] = useState([]);
    const [sortBy, setSortBy] = useState('default');
    const [totalPrice, setTotalPrice] = useState(0); // Track the total price in state
    const navigate = useNavigate();

    const handleCheckOut = () => {
        navigate('/customer/CheckOut');
    };

    useEffect(() => {
        if (isLoggedIn && userid) {
            const fetchCartItems = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/cart/getAllCart`);
                    const userCartItems = response.data.filter(item => item.customer.userid === parseInt(userid));
                    setCartItems(userCartItems);
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

    // Update total price when cart items or selected items change
    useEffect(() => {
        const calculateTotal = () => {
            const total = selectedItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
            setTotalPrice(total.toFixed(2));
        };
        calculateTotal();
    }, [selectedItems]);

    const handleQuantityChange = async (cartItem, newQuantity) => {
        // Default to 0 if the input is empty or not a valid number
        if (!newQuantity || isNaN(newQuantity) || newQuantity < 0) {
            newQuantity = 0;
        }

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

            // Update selected items if the item is already selected
            if (selectedItems.some(selected => selected.cartid === cartItem.cartid)) {
                setSelectedItems(prevSelected =>
                    prevSelected.map(item =>
                        item.cartid === cartItem.cartid ? { ...item, quantity: newQuantity } : item
                    )
                );
            }
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

    const handleSelectItem = (cartItem) => {
        setSelectedItems(prevSelected => {
            if (prevSelected.some(item => item.cartid === cartItem.cartid)) {
                return prevSelected.filter(item => item.cartid !== cartItem.cartid);
            }
            return [...prevSelected, cartItem];
        });
    };

    const sortedCartItems = [...cartItems].sort((a, b) => {
        if (sortBy === 'priceLow') return a.product.price - b.product.price;
        if (sortBy === 'priceHigh') return b.product.price - a.product.price;
        if (sortBy === 'alpha') return a.product.productname.localeCompare(b.product.productname);
        return 0;
    });

    if (loading) return <p>Loading your cart...</p>;

    return (
        <PageLayout>
            <div className="cart-container">
                <h2>Your Cart</h2>
                <div className="sort-buttons">
                    <button onClick={() => setSortBy('default')} className={sortBy === 'default' ? 'active' : ''}>Default</button>
                    <button onClick={() => setSortBy('priceLow')} className={sortBy === 'priceLow' ? 'active' : ''}>Price Lowest</button>
                    <button onClick={() => setSortBy('priceHigh')} className={sortBy === 'priceHigh' ? 'active' : ''}>Price Highest</button>
                    <button onClick={() => setSortBy('alpha')} className={sortBy === 'alpha' ? 'active' : ''}>Alphabetical</button>
                </div>
                {sortedCartItems.length === 0 ? (
                    <p>Your cart is empty. Add some products to get started!</p>
                ) : (
                    sortedCartItems.map((item) => (
                        <div className="cart-item" key={item.cartid}>
                            <input
                                type="checkbox"
                                onChange={() => handleSelectItem(item)}
                                checked={selectedItems.some(selectedItem => selectedItem.cartid === item.cartid)}
                            />
                            <div className="image-placeholder">Image</div>
                            <div className="product-info">
                                <h3 className="product-name">{item.product.productname}</h3>
                                <p className="product-category">Category: {item.product.category}</p>
                                <p className="product-stock">Stock: {item.product.quantity}</p>
                                <p className="product-price">Price: ${item.product.price.toFixed(2)}</p>
                            </div>
                            <div className="quantity-box">
                                <button onClick={() => handleQuantityChange(item, item.quantity - 1)}>-</button>
                                <input
                                    type="number"
                                    value={item.quantity || 0} // Default to 0 if quantity is falsy
                                    onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                                />
                                <button onClick={() => handleQuantityChange(item, item.quantity + 1)}>+</button>
                            </div>
                            <button className="remove-button" onClick={() => handleRemoveItem(item.cartid)}>Remove</button>
                        </div>
                    ))
                )}
                <div className="checkout-summary">
                    <p className="total-price">Total: ${totalPrice}</p>
                    <button className="checkout-button" onClick={handleCheckOut} disabled={selectedItems.length === 0}>Proceed to Checkout</button>
                </div>
            </div>
        </PageLayout>
    );
}

export default AddToCart;
