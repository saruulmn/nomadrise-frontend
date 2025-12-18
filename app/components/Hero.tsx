"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Hero() {
  const sliderImages = [
    "/images/slider/1.jpg",
    "/images/slider/2.jpg",
    "/images/slider/3.jpg",
  ];

  return (
    <section className="hero">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="hero-swiper"
      >
        {sliderImages.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image} alt={`Hero banner ${index + 1}`} className="hero-banner" />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
