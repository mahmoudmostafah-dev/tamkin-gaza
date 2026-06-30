"use client";

import React from "react";

const bannerSrc =
  "https://images.unsplash.com/photo-1647264943610-1f1420b28ccc?w=1600&h=800&fit=crop";

const ReelsSection = () => {
  return (
    <section className="py-6">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-md">
          <img
            src={
              "http://localhost:3200/_next/image?url=https%3A%2F%2Fmedia.istockphoto.com%2Fid%2F1285484294%2Fphoto%2Flittle-child-boy-hiding-in-old-vintage-suitcase-in-the-attic.webp%3Fa%3D1%26b%3D1%26s%3D612x612%26w%3D0%26k%3D20%26c%3DcM2PBmrv26qpy3evJcpjEtRwA8gmf_P3mo4S7QtjU6I%3D&w=1080&q=75"
            }
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default ReelsSection;
