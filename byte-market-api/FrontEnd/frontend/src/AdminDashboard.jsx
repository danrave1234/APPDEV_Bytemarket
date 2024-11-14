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

    // Renders specific fields based on selectedOption for editing
    const renderEditFields = () => {
        if (!currentItem) return null;

        switch (selectedOption) {
            case 'Products':
                return (
                    <>
                        <label>
                            Product Name:
                            <input
                                type="text"
                                value={currentItem.productname || ''}
                                onChange={(e) =>
                                    setCurrentItem({ ...currentItem, productname: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            Price:
                            <input
                                type="number"
                                value={currentItem.price || ''}
                                onChange={(e) =>
                                    setCurrentItem({ ...currentItem, price: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            Quantity:
                            <input
                                type="number"
                                value={currentItem.quantity || ''}
                                onChange={(e) =>
                                    setCurrentItem({ ...currentItem, quantity: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            Category:
                            <input
                                type="text"
                                value={currentItem.category || ''}
                                onChange={(e) =>
                                    setCurrentItem({ ...currentItem, category: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                value={currentItem.description || ''}
                                onChange={(e) =>
                                    setCurrentItem({ ...currentItem, description: e.target.value })
                                }
                                />
                        </label>
                    </>
                );
            case 'Customers':
                return (
                    <>
                        <label>
                            Full Name:
                            <input
                                type="text"
                                value={currentItem.fullname || ''}
                                onChange={(e) =>
                                    setCurrentItem({ ...currentItem, fullname: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                value={currentItem.email || ''}
                                onChange={(e) =>
                                    setCurrentItem({ ...currentItem, email: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            Address:
                            <input
                                type="text"
                                value={currentItem.address || ''}
                                onChange={(e) =>
                                    setCurrentItem({ ...currentItem, address: e.target.value })
                                }
                            />
                        </label>
                    </>
                );
            // Add similar fields for 'Sellers' and 'Orders' based on the attributes.
            default:
                return null;
        }
    };

    // Render headers and row cells dynamically based on selectedOption
const renderTableHeaders = () => {
    switch (selectedOption) {
        case 'Products':
            return (
                <>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Category</th>
                    <th>Seller name</th>
                    <th>Store</th>
                    <th>Actions</th>
                </>
            );
        case 'Customers':
            return (
                <>
                    <th>Customer ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Actions</th>
                </>
            );
        case 'Sellers':
            return (
                <>
                    <th>Seller ID</th>
                    <th>Seller Name</th>
                    <th>Store Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </>
            );
        case 'Orders':
            return (
                <>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                </>
            );
        default:
            return null;
    }
};

const renderTableRows = () => {
    return data.map(item => (
        <tr key={item.id}>
            {selectedOption === 'Products' && (
                <>
                    <td>{item.productid}</td>
                    <td>{item.productname}</td>
                    <td>{item.price}</td>
                    <td>{item.quantity}</td>
                    <td>{item.category}</td>
                    <td>{item.seller?.sellername || 'N/A'}</td>
                    <td>{item.seller?.storename || 'N/A'}</td>
                </>
            )}
            {selectedOption === 'Customers' && (
                <>
                <td>{item.userid}</td>
                    <td>{item.fullname}</td>
                    <td>{item.email}</td>
                    <td>{item.address}</td>
                </>
            )}
            {selectedOption === 'Sellers' && (
                <>
                    <th>{item.userid}</th>
                    <td>{item.sellername}</td>
                    <td>{item.storename}</td>
                    <td>{item.email}</td>
                </>
            )}
            {selectedOption === 'Orders' && (
                <>
                    <td>{item.orderid}</td>
                    <td>{item.customer?.fullname}</td>
                    {/*<td>{item.orderItems.product.seller.sellername}</td>*/}
                    <td>{item.totalprice}</td>
                    <td>{item.orderstatus}</td>
                </>
            )}
            <td>
                <button className="edit-button" onClick={() => handleEdit(item)}>EDIT</button>
                <button className="delete-button" onClick={() => handleDelete(item.id)}>DELETE</button>
            </td>
        </tr>
    ));
};

return (
    <PageLayout>
        <div className="admin-dashboard">
            <div className="sidebar">
                <h2>Main Menu</h2>
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
                                <tr>{renderTableHeaders()}</tr>
                            </thead>
                            <tbody>{renderTableRows()}</tbody>
                        </table>
                    )}
                </div>

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Edit {selectedOption.slice(0, -1)}</h2>
                            {renderEditFields()}
                            <button className="save-button" onClick={handleUpdate}>SAVE</button>
                            <button className="cancel-button" onClick={() => setShowModal(false)}>CANCEL</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </PageLayout>
);

}

export default AdminDashboard;
