"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Slider({
  images,
  height,
  width,
  spaceBetween = 20,
  autoplay = {
    delay: 3000,
  },
  slidesPerView = 1,
  pagination = {
    clickable: true,
  },
  loop = true,
  className,
}: {
  slidesPerView: number;
  images: string[];
  height: string;
  width: string;
  spaceBetween: number;
  className?: string;
  pagination?: {
    clickable: boolean;
  };
  navigation?: boolean;
  autoplay?: {
    delay: number;
  };
  loop?: boolean;
}) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      navigation
      pagination={{ ...pagination }}
      autoplay={{ ...autoplay }}
      loop={loop}
      className={cn("w-full h-[500px]", className)}
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <Image
            alt="slide"
            width={Number(width)}
            height={Number(height)}
            src={image}
            priority
            className="w-full h-full object-cover rounded-xl"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
