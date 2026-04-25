import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Users, MapPin, Info, Settings, Zap, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DrawerMenuItem {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  color: string;
  description: string;
}

const menuItems: DrawerMenuItem[] = [
  { icon: Home, label: "Home", href: "#home", color: "from-teal-primary to-teal-light", description: "Welcome section" },
  { icon: Zap, label: "Features", href: "#features", color: "from-primary to-teal-primary", description: "Our key features" },
  { icon: Info, label: "How It Works", href: "#how-it-works", color: "from-accent to-gold-accent", description: "Our process" },
  { icon: Users, label: "Impact", href: "#impact", color: "from-gold-accent to-gold-light", description: "Our achievements" },
  { icon: MessageCircle, label: "Get Started", href: "#cta", color: "from-primary to-accent", description: "Join our mission" },
];

export const DrawerMenu = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Menu Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm border-primary/20 hover:border-primary/50 shadow-[var(--shadow-soft)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Vertical Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            className="fixed top-16 left-4 z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-primary/10 shadow-[var(--shadow-elegant)] overflow-hidden max-h-[calc(100vh-5rem)]"
          >
            <div className="flex flex-col w-72">
              {/* Header */}
              <div className="p-6 border-b border-primary/10">
                <h3 className="text-lg font-semibold text-foreground">Navigation Menu</h3>
                <p className="text-sm text-muted-foreground">Explore Annapoorna Connect</p>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    onClick={() => scrollToSection(item.href)}
                    className={cn(
                      "group relative flex items-center w-full p-4 text-left transition-[var(--transition-gentle)] hover:bg-gradient-to-r",
                      `hover:${item.color}`,
                      "hover:text-white border-b border-primary/5 last:border-b-0"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mr-4 transition-[var(--transition-bounce)] group-hover:scale-110 group-hover:shadow-[var(--shadow-warm)]",
                      item.color
                    )}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-semibold text-foreground group-hover:text-white transition-colors">
                        {item.label}
                      </div>
                      <div className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors">
                        {item.description}
                      </div>
                    </div>
                    
                    {/* Arrow indicator */}
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={false}
                      animate={{ x: 0 }}
                      whileHover={{ x: 5 }}
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                    
                    {/* Hover ripple effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};