"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Card className="p-8 text-center bg-black/40 backdrop-blur-sm border-indigo-500/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Message Sent!
          </h3>
          <p className="text-gray-400">
            We'll get back to you as soon as possible.
          </p>
        </motion.div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-black/40 backdrop-blur-sm border-indigo-500/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            placeholder="Your Name"
            className="bg-black/30 border-indigo-500/20 focus:border-indigo-500/40"
            required
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="Your Email"
            className="bg-black/30 border-indigo-500/20 focus:border-indigo-500/40"
            required
          />
        </div>
        <div>
          <Textarea
            placeholder="Your Message"
            className="bg-black/30 border-indigo-500/20 focus:border-indigo-500/40 min-h-[150px]"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Card>
  );
}