import React, { useState, useEffect } from "react";
import axios from "axios";
import './styles/Store.css';
import PageLayout from "./components/Layout.jsx";
import { useAuth } from "./components/AuthProvider.jsx";
import AddProductModal from "./components/AddProductModal.jsx";
import EditProductModal from "./components/EditProductModal.jsx";
import DeleteProductModal from "./components/DeleteProductModal.jsx";

function Store() {
  const { userid } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [seller, setSeller] = useState();
  const [isHovered, setIsHovered] = useState(false); // State to manage hover
  const [storeImage, setStoreImage] = useState({
    storeimage: ""
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productResponse = await axios.get('http://localhost:8080/api/product/getAllProduct');
        const userProducts = productResponse.data.filter((product) => product.seller.userid === parseInt(userid));
        setProducts(userProducts);

        // Verify the API URL with userid
        console.log(`Fetching seller info with userid: ${userid}`);
        const sellerResponse = await axios.get(`http://localhost:8080/api/seller/getSellerById/${userid}`);
        setSeller(sellerResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }};
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
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleProductAdded = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/product/getAllProduct");
      const userProducts = response.data.filter((product) => product.seller.userid === userid);
      setProducts(userProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleProductUpdated = async (updatedProduct) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/product/updateProduct/${productToEdit.productid}`,
        updatedProduct
      );
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productid === response.data.productid ? response.data : product
        )
      );
      closeEditModal();
    } catch (error) {
      console.error("Error updating product:", error.response ? error.response.data : error.message);
    }
  };

  const handleProductDeleted = async () => {
    if (productToDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/product/deleteProduct/${productToDelete.productid}`);
        setProducts((prevProducts) => prevProducts.filter((product) => product.productid !== productToDelete.productid));
        closeDeleteModal();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

const handleStoreImageUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    console.log("Selected file for upload:", file);
    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        let image = reader.result;
        console.log("Uncleaned Image:", image);
        let cleanedImage = image.replace(/^data:image\/[a-z]+;base64,/, "");
        console.log("Cleaned image:", cleanedImage);
        setStoreImage({
            storeimage: cleanedImage,
        });
        const response = await axios.put(
          `http://localhost:8080/api/seller/updateSellerStoreImage/${userid}`, {storeimage: cleanedImage});
        setSeller((prevSeller) => ({
          ...prevSeller,
          storeimage: cleanedImage,
        }));
      } catch (error) {
        console.error("Error response:", error.response?.data);
        console.error("Error uploading store image:", error);
      }
    };
    reader.readAsDataURL(file); // Read as Base64
  }
};

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <PageLayout>
      <div className="stores-container">
        <div className="store-info-container">
          <div
              className="store-profile-image"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
          >
            {seller?.storeimage ? (
                // console.log("Seller store image:", seller.storeimage),
                <img src={`data:image/jpeg;base64,${seller.storeimage}`} alt={seller.storename}/>
            ) : (
                <div className="store-placeholder-image">No image available</div>
            )}
            {isHovered && (
                <div className="edit-overlay">
                  <button
                      className="edit-image-btn"
                      onClick={() => document.getElementById("store-image-input").click()}
                  >
                    Edit Image
                  </button>
                </div>
            )}
            <input
                id="store-image-input"
                type="file"
                style={{display: "none"}}
                onChange={handleStoreImageUpload}
            />
          </div>
          <div className="store-details">
            {seller ? (
                <>
                  <h1>{seller.storename}</h1>
                  <div className="store-description">Seller: {seller.sellername}</div>
                </>
            ) : (
                <>
                  <h1>Loading store...</h1>
                  <div className="store-description">Please wait while we fetch the seller details.</div>
                </>
            )}
          </div>
          <button className="add-product-btn" onClick={openAddModal}>Add Product</button>
        </div>

        <div className="products-container">
          <div className="products-grid">
            {products.map((product) => (
                <div key={product.productid} className="product-card">
                  <div className="product-image">
                    <img src={`data:image/jpeg;base64,${product.image}`} alt={product.productname}/>
                  </div>
                  <div className="product-details">
                    <h3 className="product-title" title={product.productname}>{product.productname}</h3>
                    <div className="product-price">₱{product.price}</div>
                    <div><b>Stock:</b> {product.quantity}</div>
                    <div><b>Category:</b> {product.category}</div>
                    <div className="product-actions">
                      <button className="buy-now-btn" onClick={() => openEditModal(product)}>Edit</button>
                      <button className="cart-btn" onClick={() => openDeleteModal(product)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onProductAdded={handleProductAdded}
        />

        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSave={handleProductUpdated}
          product={productToEdit}
        />

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