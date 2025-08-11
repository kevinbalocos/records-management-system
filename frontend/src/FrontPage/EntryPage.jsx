import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  LogIn,
  UserPlus,
  Rocket,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  TrendingUp,
  Share2,
  Database,
  Eye,
  Settings,
} from "lucide-react";
import * as THREE from "three";

import DCsiLogo from "../assets/dcsi-logo-no-background.png";
import CongImage from "../assets/cong-no-text.jpg";
("https://placehold.co/1920x1080/000/eee?text=Congressman+Image");

// Component for the animated 3D analytics visualization
const AnalyticsCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const currentMount = mountRef.current;
    if (!currentMount) return;

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
    const nodeCount = 75;
    const nodes = [];
    const nodeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x4dd0e1 });

    for (let i = 0; i < nodeCount; i++) {
      const sphere = new THREE.Mesh(nodeGeometry, nodeMaterial);
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
      color: 0x56a3b2,
      transparent: true,
      opacity: 0.2,
    });
    const lineSegments = [];
    const maxDistance = 2.5;

    function updateLines() {
      // Clear existing lines
      lineSegments.forEach((line) => group.remove(line));
      lineSegments.length = 0;

      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          if (nodes[i].position.distanceTo(nodes[j].position) < maxDistance) {
            const points = [nodes[i].position, nodes[j].position];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, lineMaterial);
            lineSegments.push(line);
            group.add(line);
          }
        }
      }
    }
    updateLines();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the group
      group.rotation.x += 0.001;
      group.rotation.y += 0.002;

      // Make nodes pulse and move
      nodes.forEach((node, index) => {
        node.scale.setScalar(1 + Math.sin(Date.now() * 0.002 + index) * 0.5);
        node.position.x += Math.sin(Date.now() * 0.0005 + index) * 0.001;
        node.position.y += Math.cos(Date.now() * 0.0005 + index) * 0.001;
      });

      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.children.forEach((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

// Main EntryPage component
const EntryPage = () => {
  const [visibleItems, setVisibleItems] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => {
    // Staggered animation for the analytics features
    const timeouts = visibleItems.map((_, index) =>
      setTimeout(() => {
        setVisibleItems((prev) => {
          const newItems = [...prev];
          newItems[index] = true;
          return newItems;
        });
      }, index * 150)
    );

    return () => timeouts.forEach(clearTimeout);
  }, []);

  const featureCards = [
    {
      icon: Rocket,
      color: "from-teal-500 to-blue-600",
      title: "Blazing Fast Access",
      description:
        "Instantly retrieve any document with our optimized search engine, drastically cutting down your administrative time.",
    },
    {
      icon: ShieldCheck,
      color: "from-blue-500 to-indigo-600",
      title: "Uncompromising Security",
      description:
        "Your data is protected by enterprise-grade, end-to-end encryption, ensuring complete confidentiality and integrity.",
    },
    {
      icon: Zap,
      color: "from-purple-500 to-fuchsia-600",
      title: "Automated Processes",
      description:
        "Automate repetitive tasks like data entry and document tagging, allowing you to focus on what matters most.",
    },
    {
      icon: Database,
      color: "from-amber-500 to-orange-600",
      title: "Centralized Data Hub",
      description:
        "Manage all your indigency records from a single, intuitive platform, eliminating data silos and redundancy.",
    },
    {
      icon: Eye,
      color: "from-emerald-500 to-cyan-600",
      title: "Real-time Monitoring",
      description:
        "Keep a vigilant eye on all activities and changes within your database, with instant alerts for critical events.",
    },
    {
      icon: Settings,
      color: "from-rose-500 to-red-600",
      title: "Customizable Workflows",
      description:
        "Adapt the system to your specific needs with flexible configurations and custom form builders.",
    },
  ];

  const analyticsFeatures = [
    {
      icon: LayoutDashboard,
      color: "from-teal-500 to-blue-600",
      title: "Customizable Dashboards",
      description:
        "Tailor your view with drag-and-drop widgets to monitor key metrics and track progress in real-time.",
    },
    {
      icon: TrendingUp,
      color: "from-purple-500 to-indigo-600",
      title: "Predictive Trend Analysis",
      description:
        "Harness the power of machine learning to predict future trends and anticipate needs before they arise.",
    },
    {
      icon: Share2,
      color: "from-rose-500 to-red-600",
      title: "Actionable Reports",
      description:
        "Generate detailed, easy-to-read reports that help you communicate insights and drive strategy.",
    },
  ];

  return (
    <div className="relative font-inter bg-gray-950 text-gray-200 min-h-screen overflow-hidden">
      {/* Navbar - now fixed at the top */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900/80 backdrop-blur-md py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src={DCsiLogo}
            alt="DCSI Logo"
            className="invert-logo h-8 md:h-10"
          />
        </div>
        <div className="flex space-x-2 sm:space-x-4">
          <Link
            to="/login"
            className="flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-full text-white hover:bg-gray-800 transition-all duration-200 font-medium"
          >
            <LogIn className="w-5 h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Login</span>
          </Link>
          <Link
            to="/register"
            className="flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:from-teal-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <UserPlus className="w-5 h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Register</span>
          </Link>
        </div>
      </nav>

      {/* First Screen: Hero Section */}
      <div className="relative min-h-screen bg-gray-900 text-gray-200 overflow-hidden">
        <img
          src={CongImage}
          alt="Congressman's background"
          className="absolute inset-0 h-full w-full object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-gray-900/70 z-10"></div>
        <main className="relative z-20 flex flex-col items-start justify-center min-h-screen px-4 md:px-24 py-16 pt-32">
          <div className="max-w-4xl animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-wide">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                Digital Records
              </span>{" "}
              Management for Indigency
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl ">
              A secure and powerful platform for seamless data management,
              document organization, and intelligent insights.
            </p>
            <div className="flex flex-col sm:flex-row justify-start space-y-4 sm:space-y-0 sm:space-x-6">
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

      {/* --- */}

      {/* Second Section: Enhanced Features Grid */}
      <section className="relative py-20 px-4 md:px-12 lg:px-24 bg-gray-950 text-gray-200 overflow-hidden">
        {/* Background Grid and Glowing effect */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 to-gray-950"></div>
          <div className="absolute inset-0 bg-grid-pattern [mask-image:linear-gradient(to_bottom,_transparent_10%,_black_100%)]"></div>
          <div className="absolute w-full h-full bg-gradient-to-br from-teal-500/20 via-transparent to-blue-500/20 animate-pulse-slow"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            A New Standard in Records Management
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Discover a suite of powerful features designed to streamline your
            workflow, enhance security, and provide unparalleled control over
            your data.
          </p>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card, index) => (
              <div
                key={index}
                className={`group bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl border border-gray-800 transition-all duration-300 transform
                          hover:scale-105 hover:border-teal-500 shadow-xl relative overflow-hidden`}
              >
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                            bg-gradient-to-br ${card.color}`}
                ></div>
                <div
                  className={`relative z-10 flex flex-col items-center text-center transition-all duration-300 group-hover:text-white`}
                >
                  <div
                    className={`p-3 rounded-full inline-block mb-4 transition-all duration-300
                                 group-hover:bg-white/20 `}
                  >
                    <card.icon className="w-8 h-8 text-white transition-all duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 transition-all duration-300">
                    {card.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-200 transition-all duration-300">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- */}

      {/* Third Section: Advanced Analytics Visualization */}
      <section className="relative py-20 px-4 md:px-12 lg:px-24 bg-gray-950 text-gray-200">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
            {/* Left Column: Animated Feature Highlights */}
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                Unleash the Power of{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                  Intelligent Insights
                </span>
              </h2>
              <p className="text-lg text-gray-400 max-w-lg mb-10">
                Go beyond simple storage. Our platform provides the analytics
                and insights you need to make smarter, faster decisions.
              </p>
              <div className="space-y-8 mt-10">
                {analyticsFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-start opacity-0 transform translate-y-8 transition-all duration-500 ease-out
                               ${
                                 visibleItems[index]
                                   ? "opacity-100 translate-y-0"
                                   : ""
                               }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-gradient-to-br ${feature.color}`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: 3D Visualization */}
            <div className="order-1 lg:order-2">
              <div className="relative w-full h-[300px] md:h-[500px] bg-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
                <AnalyticsCanvas />
                {/* Overlay for aesthetic */}
                <div className="absolute inset-0 border-4 border-teal-500/30 rounded-2xl pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- */}

      {/* Footer */}
      <footer className="relative bg-gray-950 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">
            &copy; 2025 Datalink Creative Solution Incorporation. All rights
            reserved. | powered by DCSI
          </p>
        </div>
      </footer>

      {/* Additional Tailwind CSS & Custom Styles */}
      <style>{`
        /* Custom font for a clean, modern look */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

        body {
          font-family: 'Inter', sans-serif;
        }

        /* Hero section animations */
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; animation-delay: 0.2s; }

        /* Background grid pattern */
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }

        /* Glowing background pulse */
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Invert logo for dark background */
        .invert-logo {
          filter: invert(100%);
        }
      `}</style>
    </div>
  );
};

export default EntryPage;
