"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Share2, Eye } from "lucide-react";
import AppButton from "../buttons/AppButton";

type CampaignCardProps = {
  name: string;
  image: string;
  tags: string[];
  status: "active" | "paused" | "completed";
  totalPaid: number;
  requiredAmount: number;
  rating?: number;
};

const statusStyles = {
  active: "bg-green-500/10 text-green-600 border-green-200",
  paused: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  completed: "bg-blue-500/10 text-blue-600 border-blue-200",
};

const CampaignCard: React.FC<CampaignCardProps> = ({
  name,
  image,
  tags,
  status,
  totalPaid,
  requiredAmount,
  rating = 4,
}) => {
  const [liked, setLiked] = useState(false);

  const remaining = requiredAmount - totalPaid;

  return (
    <Card className="group w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-md p-0">
      {/* IMAGE (TRUE TOP EDGE) */}
      <div className="relative h-52 w-full overflow-hidden rounded-t-2xl">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* TOP ACTIONS */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <button
            onClick={() => setLiked(!liked)}
            className="rounded-full bg-white/90 p-2 shadow-sm hover:bg-white"
          >
            <Heart
              size={16}
              className={liked ? "fill-red-500 text-red-500" : "text-gray-600"}
            />
          </button>

          <button className="rounded-full bg-white/90 p-2 shadow-sm hover:bg-white">
            <Share2 size={16} className="text-gray-600" />
          </button>
        </div>

        {/* QUICK VIEW */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium">
            <Eye size={16} />
            Quick View
          </button>
        </div>

        {/* STATUS */}
        <div className="absolute bottom-3 left-3">
          <span
            className={`text-xs px-2 py-1 rounded-full border backdrop-blur-sm ${statusStyles[status]}`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-3">
        {/* TITLE */}
        <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <Badge key={i} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        {/* MONEY */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Paid</span>
          <span className="font-semibold">
            {totalPaid.toLocaleString()} EGP
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Remaining</span>
          <span
            className={`font-semibold ${
              remaining > 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {remaining.toLocaleString()} EGP
          </span>
        </div>

        {/* STARS */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }
            />
          ))}
        </div>

        {/* BUTTON */}
        <AppButton variant="outline" className="w-full rounded-xl">
          View Campaign
        </AppButton>
      </div>
    </Card>
  );
};

export default CampaignCard;
