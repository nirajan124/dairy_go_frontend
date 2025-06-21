import React from "react";
import { useNavigate } from "react-router-dom";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)` }}>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 dairy-fade-in">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight dairy-heading">Fresh Dairy Delivered</h1>
        <p className="mt-4 text-xl md:text-2xl max-w-3xl dairy-text">
          Premium quality dairy products delivered fresh to your doorstep. From farm to table, we ensure the best for your family.
        </p>
        <div className="mt-8">
          <button onClick={() => navigate("/products")} className="dairy-btn bg-blue-800 text-white py-3 px-8 text-xl rounded-lg hover:bg-blue-600 transition duration-300">
            Shop Products
          </button>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, description, buttonText, image, imagePosition = "left", onButtonClick }) => (
  <div className={`flex flex-col md:flex-row items-center justify-between py-12 ${imagePosition === "right" ? "md:flex-row-reverse" : ""}`}>
    <div className="md:w-1/2 p-6">
      <h2 className="text-4xl font-bold mb-4 text-blue-800 dairy-heading">{title}</h2>
      <p className="text-lg text-gray-700 mb-6 dairy-text">{description}</p>
      <button onClick={onButtonClick} className="dairy-btn bg-blue-800 text-white py-3 px-8 text-xl rounded-lg hover:bg-blue-600 transition duration-300">
        {buttonText}
      </button>
    </div>
    <div className="md:w-1/2">
      <img src={image} alt={title} className="w-full h-auto rounded-lg shadow-lg" />
    </div>
  </div>
);

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div>
      <HeroSection />

      <div className="container mx-auto px-6">
        <Section
          title="Explore Our Products"
          description="From fresh milk to artisanal cheese, we offer a wide range of premium dairy products sourced from the finest farms."
          buttonText="View All Products"
          image="https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
          onButtonClick={() => navigate("/products")}
        />
        <Section
          title="Contact Us for Bulk Orders"
          description="Need dairy products for your business or special events? Contact us for custom orders and bulk pricing."
          buttonText="Get in Touch"
          image="https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          imagePosition="right"
          onButtonClick={() => navigate("/contact")}
        />
      </div>
    </div>
  );
};

export default Hero;