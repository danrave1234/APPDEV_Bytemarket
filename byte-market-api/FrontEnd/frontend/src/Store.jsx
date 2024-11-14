import React, { useState, useEffect } from "react";
import axios from "axios";
import './styles/Store.css';
import PageLayout from "./components/Layout.jsx";
import { useAuth } from "./components/AuthProvider.jsx";
import AddProductModal from "./components/AddProductModal.jsx";
import EditProductModal from "./components/EditProductModal.jsx";
import DeleteProductModal from "./components/DeleteProductModal.jsx"; // Import Delete modal

function Store() {
  const { userid } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);  // Loading state to track data fetching
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for Delete Modal
  const [productToDelete, setProductToDelete] = useState(null); // Product to be deleted
  const [seller, setSeller] = useState(null);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/product/getAllProduct');
      const userProducts = response.data.filter((product) => product.seller.userid === userid);
      setProducts(userProducts);  // Update the state with the new products
      // Verify the API URL with userid
      console.log(`Fetching seller info with userid: ${userid}`);
      const sellerResponse = await axios.get(`http://localhost:8080/api/seller/getSellerById/${userid}`);
      setSeller(sellerResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  if (userid) {
    fetchProducts();
  } else {
    console.error("No user ID available.");
    setLoading(false);
  }
}, [userid]);


  const openAddModal = () => {
    setIsAddModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const openEditModal = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product); // Set product to be deleted
    setIsDeleteModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleProductAdded = async () => {
    setProducts([]);  // Clear the current products in the state

    try {
      // Fetch the updated list of products
      const response = await axios.get("http://localhost:8080/api/product/getAllProduct");
      const userProducts = response.data.filter((product) => product.seller.userid === userid);
      setProducts(userProducts);  // Update the state with the new products
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleProductUpdated = async (updatedProduct) => {
    try {
      console.log("Updating product with ID:", productToEdit.productid); // Log product ID
      console.log("Payload being sent:", updatedProduct); // Log the payload for the PUT request

      const response = await axios.put(
        `http://localhost:8080/api/product/updateProduct/${productToEdit.productid}`,
        updatedProduct
      );

      console.log("Response from server:", response.data); // Log the server response

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productid === response.data.productid ? response.data : product
        )
      );
      closeEditModal(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating product:", error.response ? error.response.data : error.message); // Log error details
    }
  };

  const handleProductDeleted = async () => {
    if (productToDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/product/deleteProduct/${productToDelete.productid}`);
        setProducts((prevProducts) => prevProducts.filter((product) => product.productid !== productToDelete.productid));
        closeDeleteModal(); // Close the modal after deletion
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <PageLayout>
      <div className="store-container">
        <div className="store-header">
          <div className="store-info">
            {seller ? (
                <div>
                  <h2>Store: {seller.storename}</h2>
                  <p>Seller: {seller.sellername}</p>
                </div>
            ) : (
                <div>
                  <h2>Loading store information...</h2>
                  <p>Please wait while we fetch the seller details.</p>
                </div>
            )}
          </div>


          <button className="add-product-btn" onClick={openAddModal}>Add Product</button>
        </div>

        <div className="product-grid">
          {products.map((product) => (
              <div key={product.productid} className="product-card">
                <div className="product-image-placeholder">
                  <img src={`data:image/jpeg;base64,${product.image}`} alt="Product"/>
                </div>
              <div className="productDetails">
                <h3>{product.productname}</h3>
                <p className="price">₱{product.price}</p>
                <p className="quanitity">Stock: {product.quantity}</p>
                <p className="category">Category: {product.category}</p>
                <p className="description">Description: {product.description}</p>
              </div>
              <div className="product-actions">
                <button className="edit-btn" onClick={() => openEditModal(product)}>Edit</button>
                <button className="delete-btn" onClick={() => openDeleteModal(product)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onProductAdded={handleProductAdded}
        />

        {/* Edit Product Modal */}
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSave={handleProductUpdated}
          product={productToEdit}
        />

        {/* Delete Product Modal */}
        <DeleteProductModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={handleProductDeleted}
          productname={productToDelete?.productname}
        />
      </div>
    </PageLayout>
  );
}

export default Store;
