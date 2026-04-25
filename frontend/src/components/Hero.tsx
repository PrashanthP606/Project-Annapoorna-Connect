import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users } from "lucide-react";
import { motion } from "framer-motion";
import { DrawerMenu } from "@/components/ui/drawer-menu";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

type User = {
  id: string;
  name?: string;
  email?: string;
  role?: "donor" | "receiver" | "admin" | string;
};

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // compute target and label for primary button
  const primaryTarget = token ? (user?.role === "donor" ? "/donate" : "/foods") : "/login";
  const primaryLabel = token ? (user?.role === "donor" ? "Donate Now" : "View Foods") : "Login";

  return (
    <section
      id="home"
      className="pt-8 pb-20 lg:pt-12 lg:pb-32 bg-gradient-to-br from-cream-warm to-cream-light relative overflow-hidden"
    >
      {/* Top-right Logout Button (visible only when logged in) */}
      {token && (
        <div className="absolute top-6 right-6 z-50">
          <Button variant="destructive" className="px-4 py-2" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}

      {/* Drawer Menu */}
      <DrawerMenu />

      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-primary/5 via-transparent to-gold-accent/5"></div>
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-teal-primary/10 to-teal-light/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-gold-accent/10 to-gold-light/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Annapoorna Connect Logo" className="h-16 w-16 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-primary">Annapoorna Connect</h2>
                <p className="text-muted-foreground">Food Connects. Waste Disconnects.</p>
              </div>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Bridging the Gap Between{" "}
              <span className="text-primary bg-gradient-to-r from-teal-primary to-teal-light bg-clip-text text-transparent">
                Food Surplus
              </span>{" "}
              and{" "}
              <span className="text-accent bg-gradient-to-r from-gold-accent to-gold-light bg-clip-text text-transparent">
                Hunger
              </span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Connect food donors with needy in Tier-2 and Tier-3 cities. Every meal shared is a step toward zero waste and
              zero hunger.
            </p>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link to={primaryTarget}>
                <Button variant="premium" size="lg" className="px-8 py-4 text-lg font-semibold">
                  {primaryLabel}
                  <Heart className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            {/* <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Meals Rescued</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">NGO Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Cities Served</div>
              </div>
            </div> */}
            
          </div>

          {/* Right Content */}
          <div className="relative">
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-[var(--shadow-soft)]">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-cream-warm rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-primary to-teal-light rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Food Donor</h3>
                    <p className="text-sm text-muted-foreground">Post surplus food details</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Link to="/login" className="hover:scale-110 transition-transform">
                    <ArrowRight className="h-8 w-8 text-primary animate-pulse cursor-pointer" />
                  </Link>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gold-light/20 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-accent to-gold-light rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Needy</h3>
                    <p className="text-sm text-muted-foreground">Claim and collect food</p>
                  </div>
                </div>
              </div>

              {/* Optional: show small user info if present */}
              {token && (
                <div className="mt-6 text-sm text-muted-foreground">
                  You're logged in. You can post donations from the Donate page.
                </div>
              )}
            </div>

            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-gold-accent to-gold-light rounded-full opacity-20" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-teal-primary to-teal-light rounded-full opacity-20" />
          </div>
        </div>
        <br />
        
      </div>
    </section>
  );
};

export default Hero;