import axios from "axios";
import React, { useEffect, useState } from "react";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Placeholder data for dairy products
  const placeholderProducts = [
    { _id: "1", title: "Fresh Milk", category: "Milk", price: 50, stock: 100, image: "https://via.placeholder.com/80" },
    { _id: "2", title: "Cheddar Cheese", category: "Cheese", price: 250, stock: 50, image: "https://via.placeholder.com/80" },
    { _id: "3", title: "Greek Yogurt", category: "Yogurt", price: 75, stock: 80, image: "https://via.placeholder.com/80" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // const res = await axios.get("http://localhost:3000/api/v1/products");
        // setProducts(res.data);
        throw new Error("Backend not available");
      } catch (error) {
        console.error("Using placeholder data as backend is not available.");
        setProducts(placeholderProducts);
        setError("Demo Mode: Showing sample products. Backend not connected.");
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleDelete = (id) => {
    alert("Delete functionality is not available in Demo Mode.");
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
                    <img src={product.image} alt={product.title} className="w-16 h-16 object-cover rounded-md" />
                  </td>
                  <td className="p-3 text-gray-800 font-medium">{product.title}</td>
                  <td className="p-3 text-gray-600">{product.category}</td>
                  <td className="p-3 text-gray-600">{product.price}</td>
                  <td className="p-3 text-gray-600">{product.stock}</td>
                  <td className="p-3">
                    <button onClick={() => alert('Edit not available in Demo Mode')} className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600">
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
    </div>
  );
};

export default ManageProducts;
