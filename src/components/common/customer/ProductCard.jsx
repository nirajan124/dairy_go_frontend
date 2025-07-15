import React from "react";
import { Link } from "react-router-dom";
import { FaTag, FaStar, FaStore } from "react-icons/fa";

const ProductCard = ({ packageData }) => {
  const { _id, title, description, price, image } = packageData;

  // Use a default dairy product image if none is provided
  const imageUrl = image 
    ? `http://localhost:3001/uploads/${image}`
    : "https://images.unsplash.com/photo-1628038455746-932b734d3154?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1 border border-gray-100 dairy-fade-in">
      <div className="relative">
        <img src={imageUrl} alt={title} className="w-full h-56 object-cover" />
        <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold fresh-badge">
          100% Organic
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 dairy-heading">{title}</h3>
        <p className="text-gray-600 mt-2 line-clamp-3 mb-4 dairy-text h-20">{description}</p>
        
        <div className="flex items-center text-gray-700 mb-4">
          <FaStore className="text-blue-600 mr-2" />
          <span className="text-sm font-medium">Sold by Dairy Go</span>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <FaTag className="text-blue-600 mr-2" />
            <span className="text-blue-800 font-bold text-xl">Rs.{price}</span>
          </div>
          <Link to={`/products/${_id}`} className="dairy-btn bg-blue-800 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition duration-300">
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
