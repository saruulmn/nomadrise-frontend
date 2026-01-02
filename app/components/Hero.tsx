"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Hero() {
  const sliderImages = [
    "/images/slider/1.jpg",
    "/images/slider/2.jpg",
    "/images/slider/3.jpg",
  ];

  return (
    <section className="hero">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
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
