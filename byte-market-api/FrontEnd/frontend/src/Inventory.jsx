import React, { useState, useEffect } from "react";
import axios from "axios";
import PageLayout from "./components/Layout.jsx";
import ClaimConfirmInventoryModal from "./components/ClaimConfirmInventoryModal";
import DeleteInventoryItemModal from "./components/DeleteInventoryItemModal";
import { useAuth } from "./components/AuthProvider";
import closeIcon from "./assets/close-icon.png"; // Importing the close icon
import "./styles/Inventory.css";

function Inventory() {
    const { userid } = useAuth();
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);

    const openClaimModal = (id) => {
        setCurrentItemId(id);
        setShowClaimModal(true);
    };

    const openDeleteModal = (id) => {
        setCurrentItemId(id);
        setShowDeleteModal(true);
    };

    const handleClaim = async () => {
        if (currentItemId) {
            await claimItem(currentItemId);
        }
        setShowClaimModal(false);
    };

    const handleDelete = async () => {
        if (currentItemId) {
            await deleteItem(currentItemId);
        }
        setShowDeleteModal(false);
    };

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

    const deleteItem = async (id) => {
        console.log(`Deleting inventory item with ID: ${id}`);
        try {
            await axios.delete(`http://localhost:8080/api/inventory/deleteInventoryItem/${id}`);
            console.log(`Successfully deleted item with ID: ${id}`);
            setInventory((prev) => prev.filter((item) => item.inventoryid !== id));
        } catch (error) {
            console.error("Error deleting inventory item:", error);
        }
    };

    const filteredInventory = inventory.filter((item) => {
        if (
            searchQuery &&
            !(
                item.product?.productname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.transactionReferenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
            )
        ) {
            return false;
        }
        if (filter === "claimed" && !item.claimed) {
            return false;
        }
        if (filter === "unclaimed" && item.claimed) {
            return false;
        }
        return true;
    });

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

                    {/* Search and Filter Controls */}
                    <div className="inventory-controls">
                        <input
                            type="text"
                            placeholder="Search for product or reference number"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="inventory-search"
                        />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="inventory-filter"
                        >
                            <option value="all">All</option>
                            <option value="claimed">Claimed</option>
                            <option value="unclaimed">Unclaimed</option>
                        </select>
                    </div>

                    {filteredInventory.length === 0 ? (
                        <p>No items match your search or filter.</p>
                    ) : (
                        <div className="inventory-grid">
                            {filteredInventory.map((item) => (
                                <div key={item.inventoryid} className="inventory-card">
                                    <div className="product-image">
                                        {item.claimed && (
                                            <div className="delete-icon" onClick={() => openDeleteModal(item.inventoryid)}>
                                                <img src={closeIcon} alt="Delete"/>
                                            </div>
                                        )}
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
                                        <h2 className="product-name">
                                            {item.product?.productname || "Unknown Product"}
                                        </h2>
                                        <p className="product-category">
                                            {item.product?.category || "No Category"}
                                        </p>
                                        <p>Date Added: {new Date(item.dateadded).toLocaleDateString()}</p>
                                        <div className="product-reference-number">
                                            <p>Transaction Reference: {item.transactionReferenceNumber}</p>
                                        </div>
                                        <button
                                            className="claim-button"
                                            onClick={() => openClaimModal(item.inventoryid)}
                                            disabled={item.claimed}
                                            style={{
                                                backgroundColor: item.claimed ? "#d1d5db" : "",
                                                cursor: item.claimed ? "not-allowed" : "pointer",
                                            }}
                                        >
                                            {item.claimed ? "Claimed" : "Claim"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Rest of your component */}
                <ClaimConfirmInventoryModal
                    showModal={showClaimModal}
                    onClose={() => setShowClaimModal(false)}
                    onConfirm={handleClaim}
                />
                <DeleteInventoryItemModal
                    showModal={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                />
            </div>
        </PageLayout>
    );
}

export default Inventory;
