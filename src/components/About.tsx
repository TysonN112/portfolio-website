import React from 'react';
import { motion } from 'framer-motion';

export function About() {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-white/30 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl pixel-font text-[#2c2c2c] mb-12">About Me</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 text-left">
                <p className="text-[#2c2c2c] text-sm pixel-font leading-relaxed">
                  As a Computer Science student at the University of Arkansas, I'm passionate about exploring 
                  the endless possibilities that technology offers.
                </p>
                <p className="text-[#2c2c2c] text-sm pixel-font leading-relaxed">
                  I'm particularly interested in software development and its potential to create meaningful 
                  impact. Through my coursework and personal projects, I continue to expand my knowledge and 
                  skills in various programming languages and technologies.
                </p>
              </div>
              <div className="relative h-80 w-full">
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80"
                    alt="Coding workspace"
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}