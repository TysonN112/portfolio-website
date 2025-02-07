import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Github, Linkedin } from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav className="fixed w-full z-50">
      <div className="flex items-center justify-between p-4">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`${
            isOpen 
              ? 'bg-white/20 hover:bg-white/30' 
              : 'bg-[#2c2c2c]/80 hover:bg-[#2c2c2c]'
          } backdrop-blur-sm p-2 rounded-lg transition-colors relative z-50`}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <Menu size={24} className="text-[#f5f3f0]" />
          )}
        </button>

        <div className="flex gap-2">
          <a
            href="https://www.linkedin.com/in/tysondknguyen/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#2c2c2c]/80 backdrop-blur-sm p-2 rounded-lg hover:bg-[#2c2c2c] transition-colors"
          >
            <Linkedin size={24} className="text-[#f5f3f0]" />
          </a>
          <a
            href="https://github.com/TysonN112"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#2c2c2c]/80 backdrop-blur-sm p-2 rounded-lg hover:bg-[#2c2c2c] transition-colors"
          >
            <Github size={24} className="text-[#f5f3f0]" />
          </a>
        </div>
      </div>

      {isOpen && (
        <div 
          ref={menuRef}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40"
        >
          <div className="flex flex-col items-center justify-center h-full gap-8 pixel-font">
            <a
              href="#about"
              onClick={() => setIsOpen(false)}
              className="text-[#f5f3f0] hover:text-yellow-300 transition-colors text-xl"
            >
              About
            </a>
            <a
              href="#work"
              onClick={() => setIsOpen(false)}
              className="text-[#f5f3f0] hover:text-yellow-300 transition-colors text-xl"
            >
              Work
            </a>
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="text-[#f5f3f0] hover:text-yellow-300 transition-colors text-xl"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}