import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { Navigation } from './components/Navigation';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { ThankYou } from './components/ThankYou';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Github, Linkedin, Lightbulb } from 'lucide-react';
import { useTypewriter } from './hooks/useTypewriter';
import { LoadingScreen } from './components/LoadingScreen';

export default function App() {
  const [sandColor, setSandColor] = useState('#0a0a0a');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [entered, setEntered] = useState(false);
  const [lampOn, setLampOn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lightIntensity, setLightIntensity] = useState(0);
  
  const typedName = useTypewriter('Tyson Nguyen', 150);
  const typedMajor = useTypewriter('Computer Science Student at the University of Arkansas', 50);

  const colors = [
    '#0a0a0a', '#4a4a4a', '#8B4513', '#D2691E', '#DAA520', 
    '#CD853F', '#DEB887', '#F4A460', '#D2B48C', '#BC8F8F', 
    '#4169E1', '#1E90FF', '#00CED1', '#20B2AA', '#8A2BE2', '#9370DB'
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLampClick = () => {
    setLampOn(true);
    let startTime = Date.now();
    const duration = 1500;
    
    const animateLight = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      setLightIntensity(eased);
      
      if (progress < 1) {
        requestAnimationFrame(animateLight);
      } else {
        setTimeout(() => {
          setEntered(true);
        }, 500);
      }
    };
    
    requestAnimationFrame(animateLight);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="text-[#2c2c2c]">
      <div className="fixed inset-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <Scene color={sandColor} />
          </Suspense>
        </Canvas>
      </div>

      {/* Color Picker Button */}
      <div className="fixed top-20 right-4 z-50">
        <motion.button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="bg-[#2c2c2c]/80 backdrop-blur-sm p-2 rounded-lg hover:bg-[#2c2c2c] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Palette size={24} className="text-[#f5f3f0]" />
        </motion.button>

        <AnimatePresence>
          {showColorPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute top-12 right-0 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-xl"
            >
              <div className="grid grid-cols-4 gap-2 w-48">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSandColor(color);
                      setShowColorPicker(false);
                    }}
                    className="w-10 h-10 rounded-full shadow-inner hover:scale-110 transition-transform relative"
                    style={{ backgroundColor: color }}
                  >
                    {color === sandColor && (
                      <div className="absolute inset-0 rounded-full border-2 border-white/50" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {!entered ? (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-between bg-black"
          >
            {/* Ceiling Lamp */}
            <div className="relative mt-8">
              {/* Lamp Wire */}
              <div className="w-[4px] h-32 bg-gray-400 mx-auto" />
              
              {/* Lamp Fixture */}
              <motion.div
                initial={{ rotate: -5 }}
                animate={{ rotate: 5 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <div className="w-48 h-32 bg-gray-300 rounded-t-full mx-auto relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={handleLampClick}
                      className="focus:outline-none transform transition-transform hover:scale-110"
                    >
                      <motion.div
                        animate={{
                          filter: lampOn ? [
                            'drop-shadow(0 0 60px rgba(253,224,71,0.9))',
                            'drop-shadow(0 0 100px rgba(253,224,71,0.9))',
                            'drop-shadow(0 0 140px rgba(253,224,71,0.9))'
                          ] : 'none'
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: lampOn ? Infinity : 0,
                          repeatType: "reverse"
                        }}
                      >
                        <Lightbulb
                          size={80}
                          className={`${
                            lampOn 
                              ? 'text-yellow-300 animate-pulse'
                              : 'text-gray-600'
                          } transition-all duration-300`}
                        />
                      </motion.div>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Light Cone */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: lightIntensity * 0.7,
                  scale: lampOn ? [1, 1.1, 1] : 0,
                }}
                transition={{ 
                  duration: 2,
                  repeat: lampOn ? Infinity : 0,
                  repeatType: "reverse",
                }}
                className="absolute top-40 left-1/2 transform -translate-x-1/2 w-[1000px] h-[1000px]"
                style={{
                  background: `radial-gradient(circle, rgba(253,224,71,${lightIntensity * 0.8}) 0%, transparent 70%)`
                }}
              />

              {/* Ambient Light */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: lightIntensity * 0.4
                }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 20%, rgba(253,224,71,${lightIntensity * 0.4}), transparent 70%)`
                }}
              />

              {/* Click Instructions */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: lampOn ? 0 : 0.6 }}
                className="absolute top-48 left-1/2 transform -translate-x-1/2 text-gray-400 pixel-font text-sm mt-8"
              >
                Click the lamp to turn it on
              </motion.p>
            </div>

            {/* Couch */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mb-24 relative"
            >
              {/* Light spot on couch */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: lightIntensity * 0.6
                }}
                className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse, rgba(253,224,71,${lightIntensity * 0.4}) 0%, transparent 70%)`
                }}
              />

              <div className="relative w-[400px] h-[240px]">
                {/* Couch Base */}
                <div className="absolute bottom-0 w-full h-[160px] bg-[#4A5568] rounded-t-3xl rounded-b-lg shadow-lg">
                  {/* Couch Cushions */}
                  <div className="absolute top-6 left-6 right-6 h-20 bg-[#2D3748] rounded-lg shadow-inner">
                    {/* Cushion Details */}
                    <div className="flex justify-between px-6 pt-3">
                      <div className="w-3 h-10 bg-[#1A202C] rounded-full opacity-30" />
                      <div className="w-3 h-10 bg-[#1A202C] rounded-full opacity-30" />
                      <div className="w-3 h-10 bg-[#1A202C] rounded-full opacity-30" />
                    </div>
                  </div>
                  {/* Couch Arms */}
                  <div className="absolute top-0 left-0 w-12 h-full bg-[#4A5568] rounded-tl-3xl rounded-bl-lg shadow-lg" />
                  <div className="absolute top-0 right-0 w-12 h-full bg-[#4A5568] rounded-tr-3xl rounded-br-lg shadow-lg" />
                </div>
                {/* Couch Back */}
                <div className="absolute top-0 left-6 right-6 h-[100px] bg-[#4A5568] rounded-t-2xl shadow-lg">
                  {/* Back Cushion */}
                  <div className="absolute top-6 left-6 right-6 h-full bg-[#2D3748] rounded-t-lg shadow-inner">
                    {/* Back Cushion Details */}
                    <div className="flex justify-around pt-6">
                      <div className="w-12 h-3 bg-[#1A202C] rounded-full opacity-30" />
                      <div className="w-12 h-3 bg-[#1A202C] rounded-full opacity-30" />
                    </div>
                  </div>
                </div>

                {/* Light reflection on couch */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: lightIntensity * 0.3
                  }}
                  className="absolute inset-0 pointer-events-none mix-blend-soft-light"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, rgba(253,224,71,${lightIntensity * 0.5}), transparent 80%)`
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Navigation />
            
            {/* Hero Section */}
            <section className="min-h-screen relative pt-32">
              <div className="absolute inset-0 flex items-start justify-center pt-[20vh]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="text-center px-4"
                >
                  <div className="bg-white/30 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
                    <h1 className="text-4xl md:text-6xl mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#2c2c2c] to-[#6c6c6c] pixel-font">
                      {typedName}<span className="animate-blink">|</span>
                    </h1>
                    <p className="text-lg md:text-xl text-[#4c4c4c] max-w-2xl mx-auto pixel-font">
                      {typedMajor}<span className="animate-blink">|</span>
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-[#6c6c6c] text-sm pixel-font"
              >
                Scroll to explore & Move mouse to interact
              </motion.div>
            </section>

            <About />
            <Projects />
            <ThankYou />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}