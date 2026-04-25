import React from "react";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  // Link to open Gmail directly in browser
  const gmailLink = "https://mail.google.com/mail/?view=cm&fs=1&to=annapoorna7412@gmail.com";
  
  // Link to trigger phone dialer
  const phoneLink = "tel:+919449914908";

  return (
    <footer className="bg-[#1c1917] text-stone-300 mt-24 border-t-4 border-amber-500/20">
      <div className="container mx-auto px-6 lg:px-12 py-16">
        {/* MAIN GRID */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          
          {/* 1. Brand Section */}
          <div className="space-y-6 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <img
                  src={logo}
                  alt="Annapoorna Connect"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-white tracking-tight">
                  Annapoorna
                </h3>
                <p className="text-xs font-medium text-amber-500 uppercase tracking-wider">
                  Food Connects. Waste Disconnects.
                </p>
              </div>
            </div>

            <p className="text-stone-400 leading-relaxed text-sm max-w-sm">
              Bridging the gap between food surplus and hunger through
              community-driven technology and partnerships. Join us in creating a
              hunger-free world.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
              {[
                { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61583929262046" },
                { icon: Twitter, href: "https://x.com/AConnect60863" },
                { icon: Instagram, href: "https://www.instagram.com/annapoonaconnect/" },
                { icon: Linkedin, href: "http://www.linkedin.com/in/annapoorna-connect-629784399" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-2 rounded-full bg-stone-800 hover:bg-amber-500 transition-all duration-300"
                >
                  <social.icon className="h-5 w-5 text-stone-400 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Support/Links Section */}
          <div className="lg:pl-12">
            <h4 className="font-bold text-lg text-white mb-6 relative inline-block">
              Support
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-amber-500 rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-sm">
              {["Privacy Policy", "Terms of Service", "Community Guidelines", "FAQs"].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="group flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact Section */}
          <div>
            <h4 className="font-bold text-lg text-white mb-6 relative inline-block">
              Get in Touch
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-amber-500 rounded-full"></span>
            </h4>

            <div className="space-y-5 text-stone-400 text-sm">
              
              {/* EMAIL - Forces Gmail to Open */}
              <div className="flex items-start gap-4 group">
                <a 
                  href={gmailLink}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-stone-800 rounded-lg group-hover:bg-amber-500/10 transition-colors"
                >
                  <Mail className="h-5 w-5 text-amber-500" />
                </a>
                <div className="flex flex-col">
                  <span className="text-xs text-stone-500 uppercase font-semibold">Email</span>
                  <a 
                    href={gmailLink}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-stone-300 hover:text-white transition-colors"
                  >
                    annapoorna7412@gmail.com
                  </a>
                </div>
              </div>

              {/* PHONE - Triggers Call */}
              <div className="flex items-start gap-4 group">
                <a href={phoneLink} className="p-2 bg-stone-800 rounded-lg group-hover:bg-amber-500/10 transition-colors">
                  <Phone className="h-5 w-5 text-amber-500" />
                </a>
                <div className="flex flex-col">
                  <span className="text-xs text-stone-500 uppercase font-semibold">Phone</span>
                  <a 
                    href={phoneLink} 
                    className="text-stone-300 hover:text-white transition-colors"
                  >
                    +91 94499 14908
                  </a>
                </div>
              </div>

              {/* LOCATION */}
              <div className="flex items-start gap-4 group">
                <div className="p-2 bg-stone-800 rounded-lg group-hover:bg-amber-500/10 transition-colors">
                  <MapPin className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-stone-500 uppercase font-semibold">Location</span>
                  <span className="text-stone-300">
                    Bagalkote, Karnataka, India
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-stone-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 text-sm text-center md:text-left">
            © 2025 Annapoorna Connect. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-stone-500">
            <span className="flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;