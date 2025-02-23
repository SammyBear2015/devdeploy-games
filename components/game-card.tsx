"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Users, Star, Eye } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  image: string;
  stats: {
    players: string;
    rating: string;
    visits: string;
  };
}

export function GameCard({ title, description, image, stats }: GameCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden bg-black/40 backdrop-blur-sm border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
        <div
          className="h-48 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
        <div className="p-6 relative">
          <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            {title}
          </h3>
          <p className="text-gray-400 mb-4">{description}</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-gray-300">{stats.players}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300">{stats.rating}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">{stats.visits}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}