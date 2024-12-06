import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./components/AuthProvider";

function Inventory() {
    const { userid } = useAuth();
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/customer/${userid}/inventory`
                );
                setInventory(response.data);
            } catch (error) {
                console.error("Error fetching inventory:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, [userid]);

    if (loading) return <p>Loading inventory...</p>;

    return (
        <div className="inventory-container">
            <h1>My Inventory</h1>
            {inventory.length === 0 ? (
                <p>No items in inventory.</p>
            ) : (
                <ul>
                    {inventory.map((item) => (
                        <li key={item.inventoryid}>
                            <h2>{item.product.productname}</h2>
                            <p>Quantity: {item.quantity}</p>
                            <p>Date Added: {new Date(item.dateadded).toLocaleDateString()}</p>
                            <p>Transaction Reference: {item.transactionReferenceNumber}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Inventory;
