import React, { useState, useEffect } from "react";
import axios from "axios";
import PageLayout from "./components/Layout.jsx";
import { useAuth } from "./components/AuthProvider";
import './styles/Inventory.css';

function Inventory() {
    const { userid } = useAuth();
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInventory = async () => {
        console.log("Fetching inventory for user:", userid);
        try {
            const response = await axios.get(
                `http://localhost:8080/api/inventory/getCustomerInventory/${userid}`
            );
            console.log("Inventory fetched successfully:", response.data);
            setInventory(response.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, [userid]);

    const claimItem = async (id) => {
        console.log(`Claiming inventory item with ID: ${id}`);
        try {
            await axios.put(`http://localhost:8080/api/inventory/claimInventoryItem/${id}`);
            console.log(`Successfully claimed item with ID: ${id}`);
            await fetchInventory();
        } catch (error) {
            console.error("Error claiming inventory item:", error);
        }
    };

    if (loading) {
        console.log("Loading inventory...");
        return <p>Loading inventory...</p>;
    }

    console.log("Rendering inventory items:", inventory);

    return (
        <PageLayout>
            <div className="inventory-inventory-component">
                <div className="inventory-container">
                    <h1>My Inventory</h1>
                    {inventory.length === 0 ? (
                        <p>No items in inventory.</p>
                    ) : (
                        <div className="inventory-grid">
                            {inventory.map((item) => (
                                <div key={item.inventoryid} className="inventory-card">
                                    <div className="product-image">
                                        {item.product?.image ? (
                                            <img
                                                src={`data:image/jpeg;base64,${item.product.image}`}
                                                alt={item.product.productname || "Product Image"}
                                            />
                                        ) : (
                                            <div className="image-placeholder">No Image Available</div>
                                        )}
                                    </div>
                                    <div className="product-details">
                                        <h2 className="product-name">{item.product?.productname || "Unknown Product"}</h2>
                                        <p className="product-category">{item.product?.category || "No Category"}</p>
                                        <p>Date Added: {new Date(item.dateadded).toLocaleDateString()}</p>
                                        <div className="product-reference-number">
                                            <p>Transaction Reference: {item.transactionReferenceNumber}</p>
                                        </div>
                                        <button
                                            className="claim-button"
                                            onClick={() => claimItem(item.inventoryid)}
                                            disabled={item.claimed}
                                        >
                                            {item.claimed ? "Claimed" : "Claim"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}

export default Inventory;