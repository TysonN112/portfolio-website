import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './Scene';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export function ThankYou() {
  return (
    <section className="h-screen relative">
      {/* Sand Animation Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <Scene color="#4a4a4a" />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4"
        >
          <div className="bg-white/30 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3 
              }}
              className="flex justify-center mb-6"
            >
              <Heart 
                className="w-16 h-16 text-red-500 animate-pulse" 
                fill="currentColor"
              />
            </motion.div>
            
            <h2 className="text-3xl pixel-font text-[#2c2c2c] mb-6">
              Thank You for Visiting!
            </h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm pixel-font text-[#4c4c4c] mb-8 leading-relaxed"
            >
              I appreciate you taking the time to explore my portfolio. 
              Feel free to reach out if you'd like to collaborate or just chat!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center gap-4"
            >
              <a
                href="mailto:your.email@example.com"
                className="px-6 py-3 bg-[#2c2c2c] text-white pixel-font text-sm rounded-lg hover:bg-[#4c4c4c] transition-colors duration-300"
              >
                Get in Touch
              </a>
              <a
                href="#"
                className="px-6 py-3 bg-white/50 text-[#2c2c2c] pixel-font text-sm rounded-lg hover:bg-white/70 transition-colors duration-300"
              >
                Resume
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}