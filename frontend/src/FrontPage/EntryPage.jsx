import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  LogIn,
  UserPlus,
  FolderKanban,
  Search,
  Share2,
  ShieldCheck,
} from "lucide-react";
import DCsiLogo from "../assets/dcsi-logo-no-background.png";
import * as THREE from "three";

// Component for the animated canvas background with a dark theme
const CanvasBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleCount = 100;
    const maxDistance = 100; // Max distance for lines to connect

    // Function to handle window resizing
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    // Create particles with random positions and velocities
    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.5,
        });
      }
    };

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Dark overlay background
      ctx.fillStyle = "rgba(10, 25, 40, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Bounce off walls
        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        // Draw particle (white)
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fill();

        // Check distance to other particles and draw lines (white)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt(
            Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
          );

          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            // Line opacity based on distance
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / maxDistance})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    };

    // Initialize and start
    window.addEventListener("resize", handleResize);
    handleResize();
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};

// New component for the animated canvas background with an inverted theme
const InvertedCanvasBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleCount = 100;
    const maxDistance = 100;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.5,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Light overlay background
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        // Draw particle (gray)
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(100, 100, 100, 0.4)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt(
            Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
          );

          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            // Line opacity based on distance (gray)
            ctx.strokeStyle = `rgba(100, 100, 100, ${1 - dist / maxDistance})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};

// Component for the 3D analytics visualization
const AnalyticsCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    camera.position.z = 5;

    // Create a group for the animated objects
    const group = new THREE.Group();
    scene.add(group);

    // Create animated nodes
    const nodeCount = 50;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      const geometry = new THREE.SphereGeometry(0.05, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0x4dd0e1 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      nodes.push(sphere);
      group.add(sphere);
    }

    // Create connecting lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1,
    });
    const lines = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodes[i].position.distanceTo(nodes[j].position) < 2.5) {
          const points = [nodes[i].position, nodes[j].position];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(geometry, lineMaterial);
          lines.push(line);
          group.add(line);
        }
      }
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the group
      group.rotation.x += 0.001;
      group.rotation.y += 0.002;

      // Make nodes pulse
      nodes.forEach((node) => {
        node.scale.setScalar(
          1 + Math.sin(Date.now() * 0.002 + node.position.x) * 0.5
        );
      });

      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

const EntryPage = () => {
  return (
    <div className="relative font-sans">
      {/* Navbar - now fixed at the top */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900/80 backdrop-blur-md py-4 px-6 md:px-12 flex justify-between items-center animate-fade-in-down">
        <div className="flex items-center space-x-2">
          <img
            src={DCsiLogo}
            alt="DCSI Logo"
            className="invert-logo h-8 md:h-10"
          />
        </div>
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="flex items-center px-4 py-2 rounded-full text-white hover:bg-gray-800 transition-all duration-200 font-medium"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Login
          </Link>
          <Link
            to="/register"
            className="flex items-center px-4 py-2 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Register
          </Link>
        </div>
      </nav>

      {/* First Screen: Hero Section with animated background */}
      <div className="relative min-h-screen overflow-hidden bg-gray-900 text-gray-200">
        <CanvasBackground />
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 py-16 md:py-24 pt-24">
          <div className="max-w-4xl animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-wide">
              {" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                Digital Records
              </span>{" "}
              Management for Indigency
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              A secure and powerful platform for seamless data management,
              document organization, and intelligent insights.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-10 py-5 border-2 border-transparent text-lg font-bold rounded-full shadow-lg
                             bg-gradient-to-r from-teal-500 to-blue-600 text-white
                             hover:from-teal-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <UserPlus className="w-6 h-6 mr-3" />
                Start Now
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-10 py-5 border-2 border-gray-400 text-lg font-bold rounded-full shadow-md
                             bg-transparent text-gray-200 hover:bg-gray-800 hover:border-gray-200 transform hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <LogIn className="w-6 h-6 mr-3" />
                Sign In
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Second Screen: Features Section with inverted animated background */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 py-16 px-4 md:px-24">
        <InvertedCanvasBackground /> {/* The new inverted canvas */}
        <div className="relative z-10 max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Seamless Document Management
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Organize, search, and collaborate on your digital records with a
            suite of powerful features.
          </p>
        </div>
        <div className="relative z-10 w-full overflow-x-auto overflow-y-hidden scroll-snap-x-mandatory scrollbar-hide">
          <div className="flex space-x-6 p-4 md:p-8">
            {/* Feature Card 1 */}
            <div className="min-w-[80%] md:min-w-[calc(33.333%-1.5rem)] scroll-snap-align-center bg-white p-8 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-105 flex-shrink-0">
              <div className="bg-teal-500 p-3 rounded-full inline-block mb-4">
                <FolderKanban className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Centralized Storage</h3>
              <p className="text-gray-500">
                Keep all your documents in one secure, accessible location,
                protected by industry-standard encryption.
              </p>
            </div>
            {/* Feature Card 2 */}
            <div className="min-w-[80%] md:min-w-[calc(33.333%-1.5rem)] scroll-snap-align-center bg-white p-8 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-105 flex-shrink-0">
              <div className="bg-blue-500 p-3 rounded-full inline-block mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Advanced AI Search</h3>
              <p className="text-gray-500">
                Find any document instantly with powerful AI-driven full-text
                search, even within scanned PDFs and images.
              </p>
            </div>
            {/* Feature Card 3 */}
            <div className="min-w-[80%] md:min-w-[calc(33.333%-1.5rem)] scroll-snap-align-center bg-white p-8 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-105 flex-shrink-0">
              <div className="bg-purple-500 p-3 rounded-full inline-block mb-4">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Secure Sharing</h3>
              <p className="text-gray-500">
                Collaborate with your team safely and efficiently using granular
                permission controls and shareable links.
              </p>
            </div>
            {/* Feature Card 4 */}
            <div className="min-w-[80%] md:min-w-[calc(33.333%-1.5rem)] scroll-snap-align-center bg-white p-8 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-105 flex-shrink-0">
              <div className="bg-indigo-500 p-3 rounded-full inline-block mb-4">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Robust Security</h3>
              <p className="text-gray-500">
                Your data is protected by enterprise-grade security protocols,
                including end-to-end encryption.
              </p>
            </div>
          </div>
          <p className="text-center text-gray-400 mt-4 text-sm md:hidden">
            Scroll horizontally to see more features.
          </p>
        </div>
      </section>

      {/* Third Screen: Analytics Section */}
      <section className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200 py-16 px-4 md:px-24">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Powerful Analytics & Insights
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-12">
            Turn your data into actionable intelligence with our beautiful and
            interactive analytics dashboard.
          </p>
          <div className="w-full h-[50vh] bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-4 md:p-8 flex items-center justify-center relative">
            <AnalyticsCanvas />
          </div>
        </div>
      </section>

      {/* Additional CSS for animations */}
      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          animation-delay: 0.2s;
        }

        .invert-logo {
          filter: invert(100%);
        }

        /* Hide scrollbar for a cleaner look */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        /* Snap scrolling for the feature cards */
        .scroll-snap-x-mandatory {
          scroll-snap-type: x mandatory;
        }

        .scroll-snap-align-center {
          scroll-snap-align: center;
        }
      `}</style>
    </div>
  );
};

export default EntryPage;
