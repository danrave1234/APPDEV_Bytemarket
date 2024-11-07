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

  useEffect(() => {
    if (userid) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await axios.get("http://localhost:8080/api/product/getAllProduct");
          const userProducts = response.data.filter((product) => product.seller.userid === userid);
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

  const handleProductAdded = () => {
    localStorage.removeItem("userProducts");
    setProducts([]);
    fetchProducts();
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.productid === updatedProduct.productid ? updatedProduct : product
      )
    );
    localStorage.setItem("userProducts", JSON.stringify(products));
    closeEditModal();
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
  if (!products.length) return <p>No products available.</p>;

  return (
    <PageLayout>
      <div className="store-container">
        <div className="store-header">
          <div className="store-info">
            {products.length > 0 && (
              <div>
                <h2>Store: {products[0].seller.storename}</h2>
                <p>Seller: {products[0].seller.sellername}</p>
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
