import React, { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaClock, FaTruck } from "react-icons/fa";
import axios from "axios";
import Footer from "../../components/common/customer/Footer";
import Navbar from "../../components/common/customer/Navbar";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!form.name || !form.email || !form.message) {
      setError("Name, Email, and Message are required.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/v1/contact", form);
      setSuccess("Message sent successfully!");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-blue-800 text-center mb-6">Contact Us</h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Have questions about our dairy products? We'd love to hear from you.
        </p>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <div className="flex justify-center mb-4">
              <FaPhone className="text-blue-800 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-blue-800">Phone</h3>
            <p className="text-gray-700 mt-2">+1 (555) 123-4567</p>
            <p className="text-sm text-gray-500 mt-1">24/7 Customer Support</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <div className="flex justify-center mb-4">
              <FaEnvelope className="text-blue-800 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-blue-800">Email</h3>
            <p className="text-gray-700 mt-2">info@dairygo.com</p>
            <p className="text-sm text-gray-500 mt-1">support@dairygo.com</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <div className="flex justify-center mb-4">
              <FaMapMarkerAlt className="text-blue-800 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-blue-800">Address</h3>
            <p className="text-gray-700 mt-2">123 Dairy Farm Road</p>
            <p className="text-sm text-gray-500 mt-1">Fresh Valley, CA 90210</p>
          </div>
        </div>

        {/* Business Hours & Delivery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-green-50 p-6 rounded-lg border border-green-100">
            <div className="flex items-center mb-4">
              <FaClock className="text-green-600 text-2xl mr-3" />
              <h3 className="text-xl font-semibold text-green-800">Business Hours</h3>
            </div>
            <div className="space-y-2 text-gray-700">
              <p><strong>Monday - Friday:</strong> 6:00 AM - 8:00 PM</p>
              <p><strong>Saturday:</strong> 7:00 AM - 6:00 PM</p>
              <p><strong>Sunday:</strong> 8:00 AM - 4:00 PM</p>
            </div>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <div className="flex items-center mb-4">
              <FaTruck className="text-blue-600 text-2xl mr-3" />
              <h3 className="text-xl font-semibold text-blue-800">Delivery Schedule</h3>
            </div>
            <div className="space-y-2 text-gray-700">
              <p><strong>Morning Delivery:</strong> 6:00 AM - 10:00 AM</p>
              <p><strong>Afternoon Delivery:</strong> 2:00 PM - 6:00 PM</p>
              <p><strong>Same Day Orders:</strong> Before 2:00 PM</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-12 bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto border border-gray-100">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4 text-center">
            Send Us a Message
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-gray-800 font-semibold mb-2">Full Name</label>
                <input type="text" id="name" name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-800 font-semibold mb-2">Email Address</label>
                <input type="email" id="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-800 font-semibold mb-2">Phone Number</label>
              <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
            </div>
            <div>
              <label htmlFor="subject" className="block text-gray-800 font-semibold mb-2">Subject</label>
              <select id="subject" name="subject" value={form.subject} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                <option value="">Select a subject</option>
                <option value="order">Order Inquiry</option>
                <option value="delivery">Delivery Question</option>
                
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-800 font-semibold mb-2">Message</label>
              <textarea id="message" name="message" value={form.message} onChange={handleChange} rows="5" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400" placeholder="Tell us how we can help you..."></textarea>
            </div>
            {success && <div className="bg-green-100 text-green-700 p-3 rounded">{success}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
            <button type="submit" className="w-full bg-blue-800 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300 font-semibold" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact; 
