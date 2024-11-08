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
  const [products, setProducts] = useState(() => {
    const cachedProducts = localStorage.getItem("userProducts");
    return cachedProducts ? JSON.parse(cachedProducts) : [];
  });
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for Delete Modal
  const [productToDelete, setProductToDelete] = useState(null); // Product to be deleted
    const [seller, setSeller] = useState(null);

  useEffect(() => {
    if (userid) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await axios.get("http://localhost:8080/api/product/getAllProduct");
          const userProducts = response.data.filter((product) => product.seller.userid === userid);
          const sellerResponse = await axios.get(`http://localhost:8080/api/seller/getSellerById/${userid}`);
                setSeller(sellerResponse.data); // Set seller data
          if (userProducts.length > 0) {
            setProducts(userProducts);
            localStorage.setItem("userProducts", JSON.stringify(userProducts));
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [userid]);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  const openDeleteModal = (product) => {
    setProductToDelete(product); // Set product to be deleted
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

const handleProductAdded = async () => {
  localStorage.removeItem("userProducts");
  setProducts([]);  // Clear the current products in the state

  try {
    // Fetch the updated list of products
    const response = await axios.get("http://localhost:8080/api/product/getAllProduct");
    const userProducts = response.data.filter((product) => product.seller.userid === userid);

    setProducts(userProducts);  // Update the state with the new products
    localStorage.setItem("userProducts", JSON.stringify(userProducts));  // Save the updated list in localStorage
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};


const handleProductUpdated = async (updatedProduct) => {
  try {
    // Call the API to update the product on the server
    const response = await axios.put(`http://localhost:8080/api/product/updateProduct/${productToEdit.productid}`, updatedProduct);

    // Update the product in local state with the server's response
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.productid === response.data.productid ? response.data : product
      )
    );

    localStorage.setItem("userProducts", JSON.stringify(products)); // Update local storage with the modified products list
    closeEditModal(); // Close the modal after successful update
  } catch (error) {
    console.error("Error updating product:", error);
  }
};


  const handleProductDeleted = async () => {
    if (productToDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/product/deleteProduct/${productToDelete.productid}`);
        setProducts((prevProducts) => prevProducts.filter((product) => product.productid !== productToDelete.productid));
        localStorage.setItem("userProducts", JSON.stringify(products));
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
                <h2>No Store Name</h2>
                <p>No Seller Name</p>
              </div>
            )}
          </div>
          <button className="add-product-btn" onClick={openAddModal}>Add Product</button>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <div key={product.productid} className="product-card">
              <div className="product-image-placeholder">
                <p>Image Placeholder</p>
              </div>
              <div className="productDetails">
                <h3>{product.productname}</h3>
                <p className="price">${product.price}</p>
                <p className="quanitity">${product.quantity}</p>
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
