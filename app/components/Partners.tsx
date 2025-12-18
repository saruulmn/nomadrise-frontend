"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";

export default function Partners() {
  // Replace these with your logo images later if available
  const partners = [
    "Google", "Microsoft", "OpenAI", "NVIDIA", "Amazon", "Meta",
    "BASF", "Siemens", "ABB", "IBM", "Intel", "Huawei"
  ];

  return (
    <section className="partners-wrap">
      <div className="site-content center text-center">
        <h3 className="partners-title">Түнш байгууллагууд</h3>
      </div>

      <div className="partners-container">
        <Swiper
          modules={[Autoplay, FreeMode]}
          freeMode={true}
          loop={true}
          speed={600}
          autoplay={{ delay: 0, disableOnInteraction: false }}
          slidesPerView={5}
          spaceBetween={18}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 12 },
            480: { slidesPerView: 3, spaceBetween: 14 },
            768: { slidesPerView: 4, spaceBetween: 16 },
            1024: { slidesPerView: 5, spaceBetween: 18 },
            1280: { slidesPerView: 6, spaceBetween: 20 },
          }}
        >
          {partners.map((name, idx) => (
            <SwiperSlide key={idx}>
              <div className="partner-chip" title={name}>{name}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
