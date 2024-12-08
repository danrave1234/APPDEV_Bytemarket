import React, { useEffect, useState } from 'react';
import './styles/AdminDashboard.css';
import PageLayout from './components/Layout.jsx';
import { useAuth } from './components/AuthProvider.jsx';
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ShoppingCart, Users, Store, Package, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function AdminDashboard() {
    const { userid } = useAuth();
    const [selectedOption, setSelectedOption] = useState('Dashboard');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dashboardStats, setDashboardStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
    });

    useEffect(() => {
        if (selectedOption === 'Dashboard') {
            fetchDashboardStats();
        } else {
            fetchData();
        }
    }, [selectedOption]);

    const fetchDashboardStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:8080/api/admin/dashboardStats');
            setDashboardStats(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    const fetchData = async () => {
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

        try {
            const response = await axios.get(endpoint);
            setData(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setCurrentItem(item);
        setShowModal(true);
    };

    const handleDelete = async (itemId) => {
        const deleteEndpoint = `http://localhost:8080/api/admin/delete${selectedOption}/${itemId}`;
        try {
            await axios.delete(deleteEndpoint);
            fetchData();
        } catch (error) {
            setError(error);
        }
    };

    const handleUpdate = async () => {
        const updateEndpoint = `http://localhost:8080/api/admin/update${selectedOption}`;
        try {
            await axios.put(updateEndpoint, currentItem);
            setShowModal(false);
            fetchData();
        } catch (error) {
            setError(error);
        }
    };

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
            case 'Sellers':
                return (
                    <>
                        <label>
                            Seller Name:
                            <input
                                type="text"
                                value={currentItem.sellername || ''}
                                onChange={(e) =>
                                    setCurrentItem({...currentItem, sellername: e.target.value})
                                }
                            />
                        </label>
                        <label>
                            Store Name:
                            <input
                                type="text"
                                value={currentItem.storename || ''}
                                onChange={(e) =>
                                    setCurrentItem({...currentItem, storename: e.target.value})
                                }
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                value={currentItem.email || ''}
                                onChange={(e) =>
                                    setCurrentItem({...currentItem, email: e.target.value})
                                }
                            />
                        </label>
                    </>
                );
            case 'Orders':
                return (
                    <>
                        <label>
                            Customer Name:
                            <input
                                type="text"
                                value={currentItem.customer?.fullname || ''}
                                onChange={(e) =>
                                    setCurrentItem({
                                        ...currentItem,
                                        customer: { ...currentItem.customer, fullname: e.target.value }
                                    })
                                }
                            />
                        </label>
                        <label>
                            Status:
                            <select
                                value={currentItem.orderstatus || ''}
                                onChange={(e) =>
                                    setCurrentItem({ ...currentItem, orderstatus: e.target.value })
                                }
                            >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </label>
                    </>
                );
            default:
                return null;
        }
    };

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
        return data
            .filter(item => {
                if (selectedOption === 'Products') {
                    return item.productname?.toLowerCase().includes(searchTerm.toLowerCase());
                } else if (selectedOption === 'Customers' || selectedOption === 'Sellers') {
                    return item.fullname?.toLowerCase().includes(searchTerm.toLowerCase());
                } else if (selectedOption === 'Orders') {
                    return item.customer?.fullname.toLowerCase().includes(searchTerm.toLowerCase());
                }
                return true;
            })
            .map(item => (
                <tr key={item.id}>
                    {selectedOption === 'Products' && (
                        <>
                            <td>{item.productid}</td>
                            <td>{item.productname}</td>
                            <td>₱{item.price.toFixed(2)}</td>
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
                            <td>{item.userid}</td>
                            <td>{item.sellername}</td>
                            <td>{item.storename}</td>
                            <td>{item.email}</td>
                        </>
                    )}
                    {selectedOption === 'Orders' && (
                        <>
                            <td>{item.orderid}</td>
                            <td>{item.customer?.fullname}</td>
                            <td>₱{item.totalprice.toFixed(2)}</td>
                            <td>
                                <span className={`status-badge status-${item.orderstatus?.toLowerCase()}`}>
                                    {item.orderstatus}
                                </span>
                            </td>
                        </>
                    )}
                    <td>
                        <button className="edit-button" onClick={() => handleEdit(item)}>Edit</button>
                        <button className="delete-button" onClick={() => handleDelete(item.id)}>Delete</button>
                    </td>
                </tr>
            ));
    };

    const renderDashboard = () => {
        const chartData = {
            labels: ['Revenue', 'Orders', 'Customers', 'Products'],
            datasets: [
                {
                    label: 'Dashboard Statistics',
                    data: [
                        dashboardStats.totalRevenue,
                        dashboardStats.totalOrders,
                        dashboardStats.totalCustomers,
                        dashboardStats.totalProducts
                    ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };

        const chartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Dashboard Overview',
                },
            },
        };

        return (
            <div className="dashboard-overview">
                <div className="stats-grid">
                    <div className="stat-card">
                        <span>₱</span>
                        <h3>Total Revenue</h3>
                        <p>₱{dashboardStats.totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="stat-card">
                        <ShoppingCart size={24} />
                        <h3>Total Orders</h3>
                        <p>{dashboardStats.totalOrders}</p>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card">
                            <Users size={24} />
                            <h3>Total Customers</h3>
                            <p>{dashboardStats.totalCustomers}</p>
                        </div>
                        <div className="stat-card">
                            <Package size={24} />
                            <h3>Total Products</h3>
                            <p>{dashboardStats.totalProducts}</p>
                        </div>
                    </div>
                    <div className="chart-container">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                    <div className="recent-activity">
                        <h3>Recent Activity</h3>
                        <ul>
                            <li><TrendingUp size={16} /> New order #1234 received</li>
                            <li><Store size={16} /> New seller "Fashion Trends" registered</li>
                            <li><AlertCircle size={16} /> Low stock alert for product "Wireless Earbuds"</li>
                        </ul>
                    </div>
                </div>
            </div>
                );
                };

                return (
                <PageLayout>
                    <div className="admin-dashboard">
                        <div className="sidebar">
                            <h2>Main Menu</h2>
                            <ul>
                                {['Dashboard', 'Products', 'Customers', 'Sellers', 'Orders'].map(option => (
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
                                {selectedOption !== 'Dashboard' && (
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="search-bar"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                )}
                            </header>
                            {selectedOption === 'Dashboard' ? (
                                renderDashboard()
                            ) : (
                                <div className="table-container">
                                    {loading &&
                                        <div className="spinner"></div>
                                    }
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
                            )}

                            {showModal && (
                                <div className="modal">
                                    <div className="modal-content">
                                        <h2>Edit {selectedOption.slice(0, -1)}</h2>
                                        {renderEditFields()}
                                        <div className="button-group">
                                            <button className="save-button" onClick={handleUpdate}>Save</button>
                                            <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </PageLayout>
                );
                }

                export default AdminDashboard;