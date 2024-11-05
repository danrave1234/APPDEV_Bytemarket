import React, { useEffect, useState } from 'react';
import './styles/AdminDashboard.css';
import PageLayout from './components/Layout.jsx';
import { useAuth } from './components/AuthProvider.jsx';
import axios from "axios";

function AdminDashboard() {
    const { userid } = useAuth();
    const [selectedOption, setSelectedOption] = useState('Products');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    useEffect(() => {
        fetchData();
    }, [selectedOption]);

    const fetchData = () => {
        setLoading(true);
        setError(null);
        let endpoint = '';

        switch (selectedOption) {
            case 'Products':
                endpoint = 'http://localhost:8080/api/admin/getAllProduct';
                break;
            case 'Customers':
                endpoint = 'http://localhost:8080/api/admin/getAllCustomer';
                break;
            case 'Sellers':
                endpoint = 'http://localhost:8080/api/admin/getAllSellers';
                break;
            case 'Orders':
                endpoint = 'http://localhost:8080/api/admin/getAllOrder';
                break;
            default:
                break;
        }

        axios.get(endpoint)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    };

    const handleEdit = (item) => {
        setCurrentItem(item);
        setShowModal(true);
    };

    const handleDelete = (itemId) => {
        const deleteEndpoint = `http://localhost:8080/api/admin/delete${selectedOption}/${itemId}`;
        axios.delete(deleteEndpoint)
            .then(() => fetchData())
            .catch((error) => setError(error));
    };

    const handleUpdate = () => {
        const updateEndpoint = `http://localhost:8080/api/admin/update${selectedOption}`;
        axios.put(updateEndpoint, currentItem)
            .then(() => {
                setShowModal(false);
                fetchData();
            })
            .catch((error) => setError(error));
    };

    const renderTableContent = () => {
        return data.map(item => {
            switch (selectedOption) {
                case 'Products':
                    return (
                        <tr key={item.productid}>
                            <td>{item.productid}</td>
                            <td>{item.productname}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.category}</td>
                            <td>{item.seller?.storename}</td>
                            <td>
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete(item.productid)}>Delete</button>
                            </td>
                        </tr>
                    );
                case 'Customers':
                    return (
                        <tr key={item.userid}>
                            <td>{item.userid}</td>
                            <td>{item.fullname}</td>
                            <td>{item.username}</td>
                            <td>{item.email}</td>
                            <td>{item.phonenumber}</td>
                            <td>{item.address}</td>
                            <td>{item.balance}</td>
                            <td>
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete(item.userid)}>Delete</button>
                            </td>
                        </tr>
                    );
                case 'Sellers':
                    return (
                        <tr key={item.userid}>
                            <td>{item.userid}</td>
                            <td>{item.fullname}</td>
                            <td>{item.username}</td>
                            <td>{item.email}</td>
                            <td>{item.phonenumber}</td>
                            <td>{item.address}</td>
                            <td>{item.sellername}</td>
                            <td>{item.storename}</td>
                            <td>{item.balance}</td>
                            <td>
                                <ul>
                                    {Array.isArray(item.products) && item.products.length > 0 ? (
                                        item.products.map(product => (
                                            <li key={product.productid}>
                                                {product.productname} - Qty: {product.quantity} - Price: {product.price} - Rating: {product.ratings?.score || 'N/A'}
                                            </li>
                                        ))
                                    ) : (
                                        <li>No products available</li>
                                    )}
                                </ul>
                            </td>
                            <td>
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete(item.userid)}>Delete</button>
                            </td>
                        </tr>
                    );
                case 'Orders':
                    return (
                        <tr key={item.orderid}>
                            <td>{item.orderid}</td>
                            <td>{item.totalprice}</td>
                            <td>{item.orderstatus}</td>
                            <td>
                                {item.customer?.fullname} <br />
                                {item.customer?.email}
                            </td>
                            <td>
                                <ul>
                                    {Array.isArray(item.orderItems) && item.orderItems.length > 0 ? (
                                        item.orderItems.map(orderItem => (
                                            <li key={orderItem.orderitemid}>
                                                {orderItem.product.productname} - Qty: {orderItem.quantity} - Price: {orderItem.price}
                                            </li>
                                        ))
                                    ) : (
                                        <li>No items in this order</li>
                                    )}
                                </ul>
                            </td>
                            <td>
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete(item.orderid)}>Delete</button>
                            </td>
                        </tr>
                    );
                default:
                    return null;
            }
        });
    };

    return (
        <PageLayout>
            <div className="admin-dashboard">
                <div className="sidebar">
                    <h2>Menu</h2>
                    <ul>
                        {['Products', 'Customers', 'Sellers', 'Orders'].map(option => (
                            <li
                                key={option}
                                className={selectedOption === option ? 'active' : ''}
                                onClick={() => setSelectedOption(option)}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="main-content">
                    <header>
                        <h1>{selectedOption} Management</h1>
                        <input type="text" placeholder="Search" className="search-bar" />
                    </header>
                    <div className="table-container">
                        {loading && <p>Loading...</p>}
                        {error && <p>Error loading data: {error.message}</p>}
                        {!loading && !error && (
                            <table>
                                <thead>
                                    {/* Add headers for each option */}
                                </thead>
                                <tbody>
                                    {renderTableContent()}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {showModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Edit {selectedOption.slice(0, -1)}</h2>
                                {/* Dynamically render fields based on `selectedOption` */}
                                <button onClick={handleUpdate}>Save</button>
                                <button onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}

export default AdminDashboard;
