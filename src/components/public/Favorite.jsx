import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Footer from "../../components/common/customer/Footer";
import Navbar from "../../components/common/customer/Navbar";
import { Link } from "react-router-dom";

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token"); 
        
        if (!token) {
          setFavorites([]);
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3001/api/v1/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data); // Debug API response

        if (response.data && response.data.success) {
          if (response.data.wishlist && Array.isArray(response.data.wishlist.products)) {
            setFavorites(response.data.wishlist.products);
          } else {
            setFavorites([]);
          }
        } else {
          console.error("Unexpected API response format:", response.data);
          setFavorites([]); 
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        if (error.response?.status === 401) {
          // User not authenticated
          setFavorites([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (id) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert('Please login to manage your wishlist');
        return;
      }

      await axios.delete(`http://localhost:3001/api/v1/wishlist/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Update UI by filtering out the removed package
      setFavorites((prevFavorites) => prevFavorites.filter((pkg) => pkg._id !== id));
      alert('Removed from wishlist!');
    } catch (error) {
      console.error("Error removing wishlist item:", error);
      if (error.response?.status === 401) {
        alert('Please login to manage your wishlist');
      } else {
        alert('Failed to remove from wishlist. Please try again.');
      }
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-25 h-[500px]">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Your Favorite Packages ❤️</h1>

        {loading ? (
          <p className="text-center text-gray-800 text-lg">Loading favorites...</p>
        ) : favorites.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-800 text-lg mb-4">No favorite products yet.</p>
            <Link to="/products" className="dairy-btn bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {favorites.map((pkg) => (
              <div key={pkg._id} className="bg-white shadow-lg rounded-lg flex items-center p-4">
                <img src={`http://localhost:3001/uploads/${pkg.image}`} alt={pkg.name} className="w-32 h-32 object-cover rounded-md" />
                <div className="ml-6 flex-grow">
                  <h3 className="text-2xl font-bold text-gray-800">{pkg.name}</h3>
                  <p className="text-gray-800 mt-1">{pkg.description}</p>
                  <p className="text-lg font-semibold text-red-800 mt-2">₹{pkg.price}</p>
                </div>
                <button
                  onClick={() => removeFavorite(pkg._id)}
                  className="bg-red-800 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <FaTrash /> Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
    
  );
};

export default Favorite; 
