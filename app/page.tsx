"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { GameCard } from "@/components/game-card";
import { ContactForm } from "@/components/contact-form";
import { Canvas } from "@react-three/fiber";
import { Float, Stars, PerspectiveCamera } from "@react-three/drei";
import { ChevronDown, Gamepad2, Send, Users2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as THREE from "three";
import Head from "next/head";

function Background({ mousePosition, isTransitioning }: { mousePosition: { x: number; y: number }, isTransitioning: boolean }) {
  const torusRef = useRef<THREE.Mesh>(null);
  const torus2Ref = useRef<THREE.Mesh>(null);
  const starsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (torusRef.current && torus2Ref.current) {
      const speed = isTransitioning ? 0.05 : 0.1;
      torusRef.current.rotation.x = mousePosition.y * speed;
      torusRef.current.rotation.y = mousePosition.x * speed;
      torus2Ref.current.rotation.x = -mousePosition.y * (speed * 1.5);
      torus2Ref.current.rotation.y = -mousePosition.x * (speed * 1.5);
    }
    if (starsRef.current) {
      const starSpeed = isTransitioning ? 0.01 : 0.02;
      starsRef.current.rotation.x = mousePosition.y * starSpeed;
      starsRef.current.rotation.y = mousePosition.x * starSpeed;
    }
    if (groupRef.current) {
      groupRef.current.scale.setScalar(isTransitioning ? 0.95 : 1);
    }
  }, [mousePosition, isTransitioning]);

  return (
    <><Head>
      <link rel="shortcut icon" href="https://devdeploy.us/favicon.ico" type="image/x-icon" />
    </Head><group ref={groupRef}>
        <Stars
          ref={starsRef}
          radius={300}
          depth={60}
          count={5000}
          factor={6}
          saturation={0.5}
          fade
          speed={isTransitioning ? 0.25 : 0.5} />
        <Float speed={2} rotationIntensity={isTransitioning ? 0.25 : 0.5} floatIntensity={1}>
          <mesh ref={torusRef} position={[0, 0, -60]}>
            <torusGeometry args={[15, 3, 32, 100]} />
            <meshStandardMaterial
              color="#2D3A8C"
              wireframe
              emissive="#4F46E5"
              emissiveIntensity={isTransitioning ? 0.2 : 0.4}
              transparent
              opacity={0.7} />
          </mesh>
        </Float>
        <Float speed={1.5} rotationIntensity={isTransitioning ? 0.15 : 0.3} floatIntensity={0.8}>
          <mesh ref={torus2Ref} position={[0, 0, -80]}>
            <torusGeometry args={[20, 1, 16, 100]} />
            <meshStandardMaterial
              color="#5B21B6"
              wireframe
              emissive="#7C3AED"
              emissiveIntensity={isTransitioning ? 0.15 : 0.3}
              transparent
              opacity={0.5} />
          </mesh>
        </Float>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.7} color="#4F46E5" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7C3AED" />
        <pointLight position={[0, 0, 20]} intensity={0.3} color="#C4B5FD" />
      </group></>
  );
}

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sections = ["hero", "games", "team", "contact"];
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSectionChange = (newSection: number) => {
    if (newSection < 0 || newSection >= sections.length) return;

    setCurrentSection(newSection);
    setIsTransitioning(true);

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  useEffect(() => {
    let lastWheelTime = Date.now();
    const wheelCooldown = 50;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();
      if (now - lastWheelTime < wheelCooldown) return;
      lastWheelTime = now;

      const direction = e.deltaY > 0 ? 1 : -1;
      const newSection = currentSection + direction;

      if (newSection >= 0 && newSection < sections.length) {
        handleSectionChange(newSection);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          handleSectionChange(currentSection + 1);
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          handleSectionChange(currentSection - 1);
          break;
        case "Home":
          e.preventDefault();
          handleSectionChange(0);
          break;
        case "End":
          e.preventDefault();
          handleSectionChange(sections.length - 1);
          break;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [currentSection, sections.length]);

  const sectionVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.9,
      filter: "blur(4px)",
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      y: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.9,
      filter: "blur(4px)",
    })
  };

  const transition = {
    y: { type: "spring", stiffness: 200, damping: 25 },
    opacity: { duration: 0.5 },
    scale: { duration: 0.5 },
    filter: { duration: 0.5 }
  };

  const renderSection = (index: number) => {
    const sectionClasses = "relative z-30 h-screen flex items-center justify-center px-4 before:content-[''] before:absolute before:inset-0 before:bg-black/40 before:backdrop-blur-sm";

    switch (index) {
      case 0:
        return (
          <motion.section
            key="hero"
            className={sectionClasses}
            variants={sectionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="text-center relative z-40">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <div className="relative">
                  <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 rounded-full" />
                  <h1 className="text-8xl font-black mb-4 relative">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300">
                      Dev
                    </span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300">
                      Deploy
                    </span>
                  </h1>
                </div>
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-white/90">
                  <Gamepad2 className="w-8 h-8 text-indigo-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    GAMES STUDIO
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
              >
                <p className="text-2xl text-indigo-200/90 max-w-2xl mx-auto leading-relaxed font-medium">
                  Join millions of players in our immersive game universes
                </p>
                <div className="flex justify-center gap-4">
                  <div className="inline-flex gap-2 px-6 py-3 bg-gradient-to-r from-indigo-950/50 to-purple-950/50 rounded-full text-white font-bold backdrop-blur-md border border-indigo-500/20">
                    <span className="text-indigo-400 animate-pulse">●</span> LIVE: OFFLINE
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="mt-12 flex flex-col items-center gap-2"
              >
                <div className="text-base text-indigo-200/60 font-medium">Scroll to explore</div>
                <ChevronDown className="w-6 h-6 text-indigo-200/60 animate-bounce" />
              </motion.div>
            </div>
          </motion.section>
        );
      case 1:
        return (
          <motion.section
            key="games"
            className={sectionClasses}
            variants={sectionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="container mx-auto px-4 relative z-40">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-5xl font-bold text-center mb-6 flex items-center justify-center gap-3">
                  <Gamepad2 className="w-10 h-10 text-indigo-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                    Featured Games
                  </span>
                </h2>
                <p className="text-center text-xl text-indigo-200/70 mb-16 max-w-2xl mx-auto">
                  Dive into our collection of immersive gaming experiences, each crafted with passion and cutting-edge technology.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <GameCard
                  title="Mount Everest Roleplay"
                  description="Conquer the highest mountain on Earth! With a peak elevation of 29,035 feet (8849 meters), the top of Mount Everest is the highest point above sea level."
                  image="https://tr.rbxcdn.com/180DAY-d06d809b1d50e003917990f3a7f1ad00/768/432/Image/Webp/noFilter"
                  stats={{
                    players: "OFFLINE",
                    rating: "4.5",
                    visits: "3.9M+",
                  }}
                />
              </motion.div>
            </div>
          </motion.section>
        );
      case 2:
        return (
          <motion.section
            key="team"
            className={sectionClasses}
            variants={sectionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="container mx-auto px-4 relative z-40">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-5xl font-bold text-center mb-6 flex items-center justify-center gap-3">
                  <Users2 className="w-10 h-10 text-indigo-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                    Meet Our Team
                  </span>
                </h2>
                <p className="text-center text-xl text-indigo-200/70 mb-16 max-w-2xl mx-auto">
                  Talented individuals united by a passion for creating extraordinary gaming experiences.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {[
                  {
                    name: "JKbings0099",
                    role: "Founder | Lead Developer",
                    image: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-DAC9E1ACCC62EA6FAB8C8D4F37A64D43-Png/840/840/AvatarHeadshot/Webp/noFilter",
                  },
                ].map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="group"
                  >
                    <div className="relative overflow-hidden rounded-xl bg-black/40 backdrop-blur-sm border border-indigo-500/20 p-6 hover:border-indigo-500/40 transition-colors">
                      <div className="aspect-square overflow-hidden rounded-lg mb-4">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-indigo-300">{member.role}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        );
      case 3:
        return (
          <motion.section
            key="contact"
            className={sectionClasses}
            variants={sectionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="container mx-auto px-4 relative z-40">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-5xl font-bold text-center mb-6 flex items-center justify-center gap-3">
                  <Send className="w-10 h-10 text-indigo-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                    Get in Touch
                  </span>
                </h2>
                <p className="text-center text-xl text-indigo-200/70 mb-16 max-w-2xl mx-auto">
                  Have questions or want to collaborate? We'd love to hear from you.
                </p>
              </motion.div>
              <div className="max-w-2xl mx-auto">
                <ContactForm />
              </div>
            </div>
          </motion.section>
        );
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-[#050314] text-white">
      <div className="fixed inset-0 z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 50]} />
          <Background mousePosition={mousePosition} isTransitioning={isTransitioning} />
        </Canvas>
      </div>

      <motion.div
        className="fixed inset-0 z-10 bg-black/40 backdrop-blur-md"
        initial={false}
        animate={{ opacity: isTransitioning ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      <TooltipProvider>
        <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50">
          {sections.map((section, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={`w-2 h-2 rounded-full transition-all duration-500 cursor-pointer ${currentSection === index
                      ? "bg-indigo-500 w-6"
                      : "bg-indigo-500/20 hover:bg-indigo-500/40"
                    }`}
                  onClick={() => {
                    if (!isTransitioning) {
                      handleSectionChange(index);
                    }
                  }}
                />
              </TooltipTrigger>
              <TooltipContent
                side="left"
                className="bg-black/80 border-indigo-500/20"
                sideOffset={8}
              >
                <span className="capitalize">{section}</span>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      <AnimatePresence initial={false} custom={currentSection} mode="wait">
        <motion.div
          key={currentSection}
          custom={currentSection}
          variants={sectionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          className="relative z-20"
        >
          {renderSection(currentSection)}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}