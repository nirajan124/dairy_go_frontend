import axios from "axios";
import React, { useEffect, useState } from "react";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editImage, setEditImage] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  // Add state for dismissing alerts
  const [showMessage, setShowMessage] = useState(true);
  const [showError, setShowError] = useState(true);

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

  useEffect(() => {
    if (message) setShowMessage(true);
    if (error) setShowError(true);
  }, [message, error]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await axios.delete(`/api/v1/products/${id}`);
      setMessage("Product deleted successfully!");
    } catch (err) {
      setError("Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
    }
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
      nutritionalInfo: product.nutritionalInfo || {
        calories: "",
        protein: "",
        fat: "",
        carbohydrates: "",
        calcium: ""
      },
    });
    setEditImage(null);
  };

  const closeEditModal = () => {
    setEditProduct(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };
  const handleEditImageChange = (e) => {
    setEditImage(e.target.files[0]);
  };
  const handleEditNutritionalChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      nutritionalInfo: {
        ...editForm.nutritionalInfo,
        [name]: value
      }
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setMessage("");
    setError("");
    try {
      const form = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (key === "nutritionalInfo") {
          form.append(key, JSON.stringify(value));
        } else {
          form.append(key, value);
        }
      });
      if (editImage) {
        form.append("image", editImage);
      }
      await axios.put(`/api/v1/products/${editProduct._id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
      {error && showError && (
        <div className="flex items-center justify-between bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow mb-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" /></svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setShowError(false)} className="ml-4 text-lg font-bold text-red-400 hover:text-red-700">&times;</button>
        </div>
      )}
      {message && showMessage && (
        <div className="flex items-center justify-between bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg shadow mb-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span>{message}</span>
          </div>
          <button onClick={() => setShowMessage(false)} className="ml-4 text-lg font-bold text-green-400 hover:text-green-700">&times;</button>
        </div>
      )}
      {loading ? (
        <div className="text-center py-10"><div className="dairy-spinner mx-auto"></div></div>
      ) : (
        <table className="w-full border-collapse border border-gray-200 min-w-max rounded-xl overflow-hidden">
          <thead className="bg-blue-100 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left text-sm font-bold text-blue-800">Image</th>
              <th className="p-3 text-left text-sm font-bold text-blue-800">Title</th>
              <th className="p-3 text-left text-sm font-bold text-blue-800">Category</th>
              <th className="p-3 text-left text-sm font-bold text-blue-800">Brand</th>
              <th className="p-3 text-left text-sm font-bold text-blue-800">Unit</th>
              <th className="p-3 text-left text-sm font-bold text-blue-800">Expiry Date</th>
              <th className="p-3 text-left text-sm font-bold text-blue-800">Is Organic</th>
              <th className="p-3 text-left text-sm font-bold text-blue-800">Price (Rs.)</th>
              <th className="p-3 text-left text-sm font-bold text-blue-800">Stock</th>
              <th className="p-3 text-left text-sm font-bold text-blue-800">Nutritional Info</th>
              <th className="p-3 text-left text-sm font-bold text-blue-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, idx) => (
                <tr key={product._id} className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition`}>
                  <td className="p-3">
                    <img src={product.image && !product.image.startsWith('http') ? `/uploads/${product.image}` : product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm" onError={e => e.target.style.display='none'} />
                  </td>
                  <td className="p-3 text-gray-900 font-semibold">{product.name}</td>
                  <td className="p-3 text-gray-700">{product.category}</td>
                  <td className="p-3 text-gray-700">{product.brand}</td>
                  <td className="p-3 text-gray-700">{product.unit}</td>
                  <td className="p-3 text-gray-700">{product.expiryDate ? product.expiryDate.slice(0, 10) : ''}</td>
                  <td className="p-3 text-gray-700">{product.isOrganic ? 'Yes' : 'No'}</td>
                  <td className="p-3 text-blue-700 font-bold">{product.price}</td>
                  <td className="p-3 text-gray-700">{product.stockQuantity}</td>
                  <td className="p-3 text-gray-600 whitespace-pre-line text-xs">
                    {product.nutritionalInfo ? (
                      <>
                        Cal: {product.nutritionalInfo.calories || '-'}\n
                        Prot: {product.nutritionalInfo.protein || '-'}g\n
                        Fat: {product.nutritionalInfo.fat || '-'}g\n
                        Carb: {product.nutritionalInfo.carbohydrates || '-'}g\n
                        Ca: {product.nutritionalInfo.calcium || '-'}mg
                      </>
                    ) : '-'}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => openEditModal(product)} className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-600 transition">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-red-600 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center p-6 text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl relative overflow-y-auto max-h-[90vh] border border-blue-200">
            <button onClick={closeEditModal} className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700 focus:outline-none" aria-label="Close">&times;</button>
            <h3 className="text-3xl font-bold mb-6 text-blue-700 text-center">Edit Product</h3>
            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Product Name</label>
                  <input type="text" name="name" value={editForm.name || ""} onChange={handleEditChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Category</label>
                  <input type="text" name="category" value={editForm.category || ""} onChange={handleEditChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Price (Rs.)</label>
                  <input type="number" name="price" value={editForm.price || ""} onChange={handleEditChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Stock Quantity</label>
                  <input type="number" name="stockQuantity" value={editForm.stockQuantity || ""} onChange={handleEditChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Unit</label>
                  <input type="text" name="unit" value={editForm.unit || ""} onChange={handleEditChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Expiry Date</label>
                  <input type="date" name="expiryDate" value={editForm.expiryDate || ""} onChange={handleEditChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Brand</label>
                  <input type="text" name="brand" value={editForm.brand || ""} onChange={handleEditChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Is Organic?</label>
                  <select name="isOrganic" value={editForm.isOrganic} onChange={handleEditChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400">
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                  </select>
                </div>
              </div>
              {/* Image Upload */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Product Image</label>
                {editProduct.image && (
                  <img src={editProduct.image && !editProduct.image.startsWith('http') ? `/uploads/${editProduct.image}` : editProduct.image} alt="Current Product" className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow mb-2" />
                )}
                <input type="file" name="image" onChange={handleEditImageChange} className="w-full p-3 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              {/* Nutritional Info */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Nutritional Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <input type="number" name="calories" value={editForm.nutritionalInfo?.calories || ""} onChange={handleEditNutritionalChange} placeholder="Calories" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
                  <input type="number" name="protein" value={editForm.nutritionalInfo?.protein || ""} onChange={handleEditNutritionalChange} placeholder="Protein (g)" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
                  <input type="number" name="fat" value={editForm.nutritionalInfo?.fat || ""} onChange={handleEditNutritionalChange} placeholder="Fat (g)" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
                  <input type="number" name="carbohydrates" value={editForm.nutritionalInfo?.carbohydrates || ""} onChange={handleEditNutritionalChange} placeholder="Carbohydrates (g)" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
                  <input type="number" name="calcium" value={editForm.nutritionalInfo?.calcium || ""} onChange={handleEditNutritionalChange} placeholder="Calcium (mg)" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Description</label>
                <textarea name="description" value={editForm.description || ""} onChange={handleEditChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 h-28" />
              </div>
              <button type="submit" disabled={editLoading} className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors">
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Add fade-in animation */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ManageProducts;
