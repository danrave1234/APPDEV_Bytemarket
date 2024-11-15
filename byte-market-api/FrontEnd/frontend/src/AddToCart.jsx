import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/AddToCart.css';
import PageLayout from "./components/Layout.jsx";
import { useAuth } from "./components/AuthProvider.jsx";
import OrderProductModal from './components/OrderProductModal.jsx';


function AddToCart() {
    const { userid, isLoggedIn } = useAuth();
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem('cartItems');
        return storedCart ? JSON.parse(storedCart) : [];
    });
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0); // Total price state
    const [selectedCount, setSelectedCount] = useState(0); // Selected items count
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [modalItems, setModalItems] = useState([]);

    const navigate = useNavigate();

    const openOrderModal = (items) => {
        console.log('Opening Order Modal with items:', items);
        setModalItems(items);
        setShowOrderModal(true);
    };

    const closeOrderModal = () => {
        setShowOrderModal(false);
        setModalItems([]);
    };

    useEffect(() => {
        console.log('OrderProductModal items:', modalItems);
    }, [modalItems]);

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

    useEffect(() => {
        const calculateTotal = () => {
            const total = selectedItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
            setTotalPrice(total.toFixed(2));
            setSelectedCount(selectedItems.length);
        };
        calculateTotal();
    }, [selectedItems]);

    const handleQuantityChange = async (cartItem, newQuantity) => {
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
            setSelectedItems(prevSelected =>
                prevSelected.filter(item => item.cartid !== cartId)
            );
        } catch (error) {
            console.error('Error removing cart item:', error);
        }
    };

    const handleSelectItem = (cartItem) => {
        const currentStore = selectedItems.length > 0
            ? selectedItems[0].product.seller.storename
            : null;

        if (currentStore && currentStore !== cartItem.product.seller.storename) {
            const confirmChange = window.confirm(
                "Selecting another store will deselect your current selected products. Do you want to continue?"
            );

            if (!confirmChange) return;

            // Clear previously selected items
            setSelectedItems([]);
        }

        setSelectedItems(prevSelected => {
            if (prevSelected.some(item => item.cartid === cartItem.cartid)) {
                return prevSelected.filter(item => item.cartid !== cartItem.cartid);
            }
            return [...prevSelected, cartItem];
        });
    };

    const handleSelectStore = (storeName, products) => {
        const allSelected = products.every(item => selectedItems.some(selected => selected.cartid === item.cartid));

        const currentStore = selectedItems.length > 0
            ? selectedItems[0].product.seller.storename
            : null;

        if (currentStore && currentStore !== storeName) {
            const confirmChange = window.confirm(
                "Selecting another store will deselect your current selected products. Do you want to continue?"
            );

            if (!confirmChange) return;

            // Clear previously selected items
            setSelectedItems([]);
        }

        setSelectedItems(prevSelected => {
            if (allSelected) {
                return prevSelected.filter(item => !products.some(product => product.cartid === item.cartid));
            } else {
                const newItems = products.filter(item => !prevSelected.some(selected => selected.cartid === item.cartid));
                return [...prevSelected, ...newItems];
            }
        });
    };

    const groupByStore = (items) => {
        return items.reduce((groups, item) => {
            const storeName = item.product?.seller?.storename || "Unknown Store";
            if (!groups[storeName]) {
                groups[storeName] = [];
            }
            groups[storeName].push(item);
            return groups;
        }, {});
    };

    const groupedCartItems = groupByStore(cartItems);

    const handleCheckOut = () => {
        if (selectedItems.length > 0) {
            const formattedItems = selectedItems.map((item) => ({
                productid: item.product.productid,
                quantity: item.quantity,
                price: item.product.price,
                productname: item.product.productname,
                image: item.product.image,
                seller: item.product.seller, // Ensure seller is passed
            }));
            console.log('Formatted items:', formattedItems);
            openOrderModal(formattedItems); // Trigger the modal with selected cart items
        }
    };


    if (loading) return <p>Loading your cart...</p>;

    return (
        <PageLayout>
            <div className="cart-container">
                <h2>Your Cart</h2>
                {Object.keys(groupedCartItems).length === 0 ? (
                    <p>Your cart is empty. Add some products to get started!</p>
                ) : (
                    Object.entries(groupedCartItems).map(([storeName, products]) => (
                        <div key={storeName} className="store-group">
                            <h3 className="store-name">
                                <input
                                    type="checkbox"
                                    onChange={() => handleSelectStore(storeName, products)}
                                    checked={products.every(item => selectedItems.some(selected => selected.cartid === item.cartid))}
                                />
                                {storeName}
                            </h3>
                            <div className="store-products">
                                {products.map((item) => (
                                    <div className="cart-item" key={item.cartid}>
                                        <input
                                            type="checkbox"
                                            onChange={() => handleSelectItem(item)}
                                            checked={selectedItems.some(selectedItem => selectedItem.cartid === item.cartid)}
                                        />
                                        <div className="image-placeholder">
                                            <img src={`data:image/jpeg;base64,${item.product.image}`} alt="Product" />
                                        </div>
                                        <div className="product-info">
                                            <h3 className="product-name">{item.product.productname}</h3>
                                            <p className="product-category">Category: {item.product.category}</p>
                                            <p className="product-stock">Stock: {item.product.quantity}</p>
                                            <p className="product-price">Price: ₱{item.product.price.toFixed(2)}</p>
                                            {selectedItems.some(selected => selected.cartid === item.cartid) && (
                                                <p className="product-subprice">Sub-total: ₱{(item.quantity * item.product.price).toFixed(2)}</p>
                                            )}
                                        </div>
                                        <div className="quantity-box">
                                            <button onClick={() => handleQuantityChange(item, item.quantity - 1)}>-</button>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                                            />
                                            <button onClick={() => handleQuantityChange(item, item.quantity + 1)}>+</button>
                                        </div>
                                        <button className="remove-button" onClick={() => handleRemoveItem(item.cartid)}>Remove</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
                <div className="checkout-summary sticky-summary">
                    <p className="total-price">Total ({selectedCount}): ₱{totalPrice}</p>
                    <button className="checkout-button" onClick={handleCheckOut} disabled={selectedItems.length === 0}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>

            {showOrderModal && (
                <OrderProductModal
                    show={showOrderModal}
                    selectedProducts={modalItems}
                    onClose={closeOrderModal}
                />
            )}

        </PageLayout>

);
}

export default AddToCart;
