import axios from "axios";
import React, { useState } from "react";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Milk", // Default category
    stock: "",
    netWeight: "",
    image: null,
    ingredients: [""], // Ingredients start with one empty entry
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayField = (field, index) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Simulate backend submission
    setTimeout(() => {
      try {
        // This is where you would normally send data to the backend
        console.log("Form Data Submitted (Demo):", formData);

        // Simulate success
        setMessage("Demo Mode: Product added successfully!");
        setError("");
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          price: "",
          category: "Milk",
          stock: "",
          netWeight: "",
          image: null,
          ingredients: [""],
        });
        // Clear the file input if you have a ref to it
        // e.g., fileInputRef.current.value = null;

      } catch (error) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }, 1500); // Simulate network delay
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Add New Dairy Product</h2>
      {message && <p className="text-green-600 bg-green-50 p-3 rounded-lg">{message}</p>}
      {error && <p className="text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Product Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Fresh Organic Milk" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400">
              <option value="Milk">Milk</option>
              <option value="Cheese">Cheese</option>
              <option value="Yogurt">Yogurt</option>
              <option value="Butter">Butter</option>
              <option value="Cream">Cream</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Price (Rs.)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g., 50" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Stock Quantity</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="e.g., 100" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
          </div>
          
          {/* Net Weight */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Net Weight</label>
            <input type="text" name="netWeight" value={formData.netWeight} onChange={handleChange} placeholder="e.g., 1L or 250g" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Detailed product description..." required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 h-32"></textarea>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Product Image</label>
          <input type="file" name="image" onChange={handleFileChange} required className="w-full p-3 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>

        {/* Ingredients Fields */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Ingredients</h3>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center gap-4 mb-3">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleArrayChange("ingredients", index, e.target.value)}
                placeholder={`Ingredient ${index + 1}`}
                className="p-3 border rounded-lg flex-grow focus:ring-2 focus:ring-blue-400"
              />
              {formData.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField("ingredients", index)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField("ingredients")}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            + Add Ingredient
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-lg font-bold disabled:bg-blue-300"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

