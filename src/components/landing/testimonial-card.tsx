"use client";

import React from "react";
import { motion } from "framer-motion";
import { Testimonial } from "@/components/landing/testimonial-section";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:text-gray-100"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-800 dark:bg-blue-700 flex items-center justify-center text-white font-bold text-xl">
          {testimonial.avatar}
        </div>
        <div>
          <h4 className="font-bold text-lg text-gray-900 dark:text-white">
            {testimonial.name}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {testimonial.role}
          </p>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-100 italic">
        &quot;{testimonial.content}&quot;
      </p>
    </motion.div>
  );
};
