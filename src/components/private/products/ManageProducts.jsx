import axios from "axios";
import React, { useEffect, useState } from "react";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/v1/products");
        setProducts(res.data || []);
        setError("");
      } catch (error) {
        setError("Failed to fetch products from backend.");
      }
      setLoading(false);
    };
    fetchProducts();
  }, [message]);

  const handleDelete = (id) => {
    alert("Delete functionality is not available in Demo Mode.");
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setEditForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stockQuantity: product.stockQuantity,
      unit: product.unit || "liter",
      expiryDate: product.expiryDate ? product.expiryDate.slice(0, 10) : "",
      brand: product.brand || "",
      isOrganic: product.isOrganic || false,
      description: product.description || "",
    });
  };

  const closeEditModal = () => {
    setEditProduct(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setMessage("");
    setError("");
    try {
      await axios.put(`/api/v1/products/${editProduct._id}`, editForm);
      setMessage("Product updated successfully!");
      closeEditModal();
    } catch (err) {
      setError("Failed to update product. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md overflow-x-auto">
      <h2 className="text-3xl font-bold text-blue-800 mb-4">Manage Dairy Products</h2>
      {error && <p className="text-blue-600 bg-blue-50 p-3 rounded-lg mb-4">{error}</p>}
      {message && <p className="text-green-600 bg-green-50 p-3 rounded-lg mb-4">{message}</p>}
      {loading ? (
        <div className="text-center py-10"><div className="dairy-spinner mx-auto"></div></div>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Image</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Price (Rs.)</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Stock</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                  </td>
                  <td className="p-3 text-gray-800 font-medium">{product.name}</td>
                  <td className="p-3 text-gray-600">{product.category}</td>
                  <td className="p-3 text-gray-600">{product.price}</td>
                  <td className="p-3 text-gray-600">{product.stockQuantity}</td>
                  <td className="p-3">
                    <button onClick={() => openEditModal(product)} className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
            <button onClick={closeEditModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">&times;</button>
            <h3 className="text-2xl font-bold mb-4">Edit Product</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Product Name</label>
                <input type="text" name="name" value={editForm.name || ""} onChange={handleEditChange} required className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Category</label>
                <input type="text" name="category" value={editForm.category || ""} onChange={handleEditChange} required className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Price (Rs.)</label>
                <input type="number" name="price" value={editForm.price || ""} onChange={handleEditChange} required className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Stock Quantity</label>
                <input type="number" name="stockQuantity" value={editForm.stockQuantity || ""} onChange={handleEditChange} required className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Unit</label>
                <input type="text" name="unit" value={editForm.unit || ""} onChange={handleEditChange} required className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Expiry Date</label>
                <input type="date" name="expiryDate" value={editForm.expiryDate || ""} onChange={handleEditChange} required className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Brand</label>
                <input type="text" name="brand" value={editForm.brand || ""} onChange={handleEditChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Is Organic?</label>
                <select name="isOrganic" value={editForm.isOrganic} onChange={handleEditChange} className="w-full p-2 border rounded">
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Description</label>
                <textarea name="description" value={editForm.description || ""} onChange={handleEditChange} className="w-full p-2 border rounded" />
              </div>
              <button type="submit" disabled={editLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
