import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Code, Cpu, Globe, Palette } from 'lucide-react';

const projects = [
  {
    title: 'Interactive Sand Simulation',
    description: 'A real-time 3D particle system with hand tracking interaction built using Three.js and MediaPipe.',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80',
    tags: ['React', 'Three.js', 'MediaPipe', 'TypeScript'],
    links: {
      github: 'https://github.com/TysonN112',
      live: '#'
    },
    icon: <Globe className="w-6 h-6" />
  },
  {
    title: 'AI-Powered Code Assistant',
    description: 'A machine learning model that helps developers write better code through intelligent suggestions.',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80',
    tags: ['Python', 'TensorFlow', 'NLP', 'FastAPI'],
    links: {
      github: 'https://github.com/TysonN112',
      live: '#'
    },
    icon: <Cpu className="w-6 h-6" />
  },
  {
    title: 'Portfolio Website',
    description: 'A creative portfolio website with interactive 3D elements and smooth animations.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80',
    tags: ['React', 'Three.js', 'Framer Motion', 'TailwindCSS'],
    links: {
      github: 'https://github.com/TysonN112',
      live: '#'
    },
    icon: <Palette className="w-6 h-6" />
  }
];

export function Projects() {
  return (
    <section id="work" className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="bg-white/30 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl pixel-font text-[#2c2c2c] mb-12">Projects</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                      {project.icon}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg pixel-font text-[#2c2c2c] mb-3">{project.title}</h3>
                    <p className="text-sm text-[#4c4c4c] mb-4">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 text-xs pixel-font bg-[#2c2c2c]/10 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-[#2c2c2c]/10 transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-[#2c2c2c]/10 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}