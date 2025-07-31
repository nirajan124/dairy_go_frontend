import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../components/common/customer/Footer";
import Navbar from "../../components/common/customer/Navbar";

const Checkout = () => {
  const { id } = useParams(); // Get package ID from URL
  const [packageData, setPackageData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    quantity: 1,
    paymentMethod: "credit-card",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/v1/products/${id}`);
        setPackageData(res.data);
      } catch (err) {
        setError("Failed to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardPayment = async () => {
    if (!packageData) return;
    
    // Validate form data
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    // Validate card details
    if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv) {
      alert("Please fill in all card details.");
      return;
    }

    // Simple card validation
    if (formData.cardNumber.length < 13 || formData.cardNumber.length > 19) {
      alert("Please enter a valid card number.");
      return;
    }

    if (formData.cardCvv.length < 3 || formData.cardCvv.length > 4) {
      alert("Please enter a valid CVV.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const orderData = {
            packageId: id,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
        quantity: formData.quantity,
        pickupLocation: "",
        paymentMethod: "credit-card",
        paymentId: `CARD_${Date.now()}` // Generate a unique payment ID
      };

      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          orderData.customerId = decodedToken.id;
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }

      const response = await axios.post("http://localhost:3001/api/v1/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Order created successfully:", response.data);
      alert("Order placed successfully with card payment! 🚀");
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        quantity: 1,
        paymentMethod: "credit-card",
        cardNumber: "",
        cardExpiry: "",
        cardCvv: "",
      });
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const handleCashOnDelivery = async () => {
    try {
      const token = localStorage.getItem("token");
      const orderData = {
        packageId: id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        quantity: formData.quantity,
        pickupLocation: "",
        paymentMethod: "cash_on_delivery",
        paymentId: null
      };

      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          orderData.customerId = decodedToken.id;
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }

      const response = await axios.post("http://localhost:3001/api/v1/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Order created successfully:", response.data);
      alert("Order placed successfully! You can pay on delivery.");
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        quantity: 1,
        paymentMethod: "credit-card",
        cardNumber: "",
        cardExpiry: "",
        cardCvv: "",
      });
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  if (loading) return <p className="text-center py-10 text-lg">Loading checkout details...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;
  if (!packageData) return <p className="text-center py-10 text-lg">Product not found.</p>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">🛒 Checkout</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Package Summary */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">📌 Booking Summary</h3>
            <div className="flex flex-col items-center">
              <img 
                src={`http://localhost:3001/uploads/${packageData.image}`} 
                alt={packageData.name} 
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
              <div className="mt-4 w-full">
                <h4 className="text-xl font-semibold text-gray-700">{packageData.name}</h4>
                <p className="text-gray-800 font-bold mt-2 text-lg">₹{packageData.price}</p>
                <p className="text-gray-600 mt-2">{packageData.description}</p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">📝 Enter Details</h3>
            <form className="space-y-4">
              <div className="mt-6">
                <label className="block text-gray-800 font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-red-400"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-800 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-red-400"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-800 font-semibold mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-red-400"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-800 font-semibold mb-2">Number of Product</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Number of product"
                  value={formData.quantity}
                  min="1"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-red-400"
                  required
                />
              </div>

              {/* Payment Method Selection */}
              <div className="mt-4">
                <label className="block text-gray-800 font-semibold mb-2">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-red-400"
                  required
                >
                  <option value="credit-card">Credit Card</option>
                  <option value="debit-card">Debit Card</option>
                  <option value="cash_on_delivery">Cash on Delivery</option>
                </select>
              </div>

              {/* Card Details (shown only when card payment is selected) */}
              {formData.paymentMethod.includes('card') && (
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-gray-800 font-semibold mb-2">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-red-400"
                      maxLength="19"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-800 font-semibold mb-2">Expiry Date</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-red-400"
                        maxLength="5"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-800 font-semibold mb-2">CVV</label>
                      <input
                        type="password"
                        name="cardCvv"
                        placeholder="123"
                        value={formData.cardCvv}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-red-400"
                        maxLength="4"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Buttons */}
              <div className="space-y-3 mt-6">
                {formData.paymentMethod.includes('card') ? (
              <button
                type="button"
                    onClick={handleCardPayment}
                className="w-full bg-red-800 text-white py-3 rounded-lg text-lg hover:bg-red-700 transition duration-300"
              >
                    Pay with Card
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCashOnDelivery}
                    className="w-full bg-gray-600 text-white py-3 rounded-lg text-lg hover:bg-gray-500 transition duration-300"
                  >
                    Cash on Delivery
              </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
