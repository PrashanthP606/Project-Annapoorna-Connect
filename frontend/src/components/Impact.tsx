import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, HandHeart, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import api from "@/lib/api"; // Ensure this import points to your axios instance

// Separate component for the Card to handle its own animation state
const AnimatedStat = ({ 
  stat, 
  index, 
  targetValue 
}: { 
  stat: any; 
  index: number; 
  targetValue: number;
}) => {
  // Pass the dynamic targetValue to the hook
  const { count, ref } = useAnimatedCounter(targetValue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <Card className="group hover:shadow-[var(--shadow-glow)] transition-[var(--transition-bounce)] hover:-translate-y-3 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border-none relative overflow-hidden h-full">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        <CardContent className="p-8 text-center relative flex flex-col items-center justify-center h-full">
          {/* Icon Container */}
          <motion.div 
            className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-[var(--transition-bounce)] shadow-[var(--shadow-warm)]`}
            whileHover={{ rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <stat.icon className="h-10 w-10 text-white drop-shadow-sm" />
          </motion.div>
          
          {/* Number Count */}
          <div ref={ref} className="text-4xl lg:text-5xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {count.toLocaleString()}+
          </div>
          
          {/* Label */}
          <div className="text-lg font-semibold text-foreground mb-3">
            {stat.label}
          </div>
          
          {/* Description */}
          <div className="text-sm text-muted-foreground leading-relaxed max-w-[200px] mx-auto">
            {stat.description}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Impact = () => {
  // State to hold the dynamic counts
  const [counts, setCounts] = useState({
    connected: 0,
    served: 0,
    donations: 0
  });

  // Fetch stats from backend on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Assuming your route is /api/auth/stats based on previous context
        // Adjust the URL if you placed the route somewhere else
        const res = await api.get('/auth/stats'); 
        
        if (res.data) {
          setCounts({
            connected: res.data.connected || 0,
            served: res.data.served || 0,
            donations: res.data.donations || 0
          });
        }
      } catch (error) {
        console.error("Failed to fetch impact stats:", error);
      }
    };

    fetchStats();
  }, []);

  // Configuration for the 3 cards
  const statsConfig = [
    {
      icon: Users,
      valueKey: "connected", // Maps to counts.connected
      label: "Active Users",
      description: "Total community of Donors and Receivers united.",
      color: "from-teal-500 to-emerald-500"
    },
    {
      icon: HandHeart,
      valueKey: "served", // Maps to counts.served
      label: "People Benefited",
      description: "Successful food claims fulfilled by receivers.",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: Utensils,
      valueKey: "donations", // Maps to counts.donations
      label: "Total Donations",
      description: "Food listings posted by our generous donors.",
      color: "from-blue-500 to-indigo-500"
    }
  ];

  return (
    <section id="impact" className="py-20 bg-gradient-to-br from-cream-warm to-cream-light relative overflow-hidden">
      {/* Background decoration */}
      <motion.div 
        className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full opacity-10"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      ></motion.div>
      <motion.div 
        className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full opacity-10"
        animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      ></motion.div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
            Our Growing{" "}
            <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-orange-500 bg-clip-text text-transparent">
              Impact
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Real-time metrics showing how we connect surplus food with those who need it.
          </p>
        </motion.div>

        {/* 3 Columns Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {statsConfig.map((stat, index) => (
            <AnimatedStat 
              key={index} 
              stat={stat} 
              index={index} 
              // Dynamically get the value from state based on the key
              targetValue={counts[stat.valueKey as keyof typeof counts]} 
            />
          ))}
        </div>

        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="bg-white/60 rounded-3xl p-10 max-w-4xl mx-auto border border-white/40 backdrop-blur-md shadow-xl relative overflow-hidden">
             <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-800">
              Join the Movement
            </h3>
            <p className="text-lg text-gray-600">
              Every donation matters. Join us in creating a hunger-free world.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Impact;