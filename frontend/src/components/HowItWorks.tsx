// src/pages/HowItWorks.tsx (or wherever this file is located)
import React from "react";
import { motion } from "framer-motion";
import { Upload, Bell, Users, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    // ... your steps data (unchanged)
    {
      icon: Upload,
      title: "Post Donation",
      description: "Upload surplus food details and photos in seconds.",
      color: "text-white",
      iconBg: "bg-[#36B3A0]",
      delay: 0.1,
    },
    {
      icon: Bell,
      title: "Notify NGOs",
      description: "Nearby Receiver receives instant alerts about the availability.",
      color: "text-white",
      iconBg: "bg-[#F2BC57]",
      delay: 0.2,
    },
    {
      icon: Users,
      title: "Quick Claim",
      description: "The first receiver to claim secures the food donation and the donor is notified about the receiver.",
      color: "text-white",
      iconBg: "bg-[#36B3A0]",
      delay: 0.3,
    },
    {
      icon: CheckCircle,
      title: "Serve",
      description: "Food need to be collected by the receiver.",
      color: "text-white",
      iconBg: "bg-[#F2BC57]",
      delay: 0.4,
    },
  ];

  return (
    // 👇 ADD THE ID HERE
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-[#F5F1EB]">
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#2D3748] mb-4">
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#36B3A0] to-[#F2BC57]">Works</span>
          </h2>
          <p className="text-lg text-[#718096] max-w-2xl mx-auto">
            A simple, efficient process connecting surplus food with those who need it most.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-[#CBD5E0] -z-10"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: step.delay, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group relative bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl ${step.iconBg} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                <step.icon className={`w-8 h-8 ${step.color}`} />
              </div>

              {/* Text Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-[#2D3748] mb-3">
                  {step.title}
                </h3>
                <p className="text-[#718096] text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;