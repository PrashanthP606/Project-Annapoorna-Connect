import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, ArrowRight, Phone, Mail } from "lucide-react";

const CTA = () => {
  return (
    <section id="cta" className="py-20 bg-gradient-to-br from-primary to-teal-light text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-primary/20 to-transparent"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-accent/20 rounded-full"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cream-warm/20 rounded-full"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Join Annapoorna Connect today and be part of the solution to food waste and hunger in your community.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* For Donors */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-accent to-gold-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">Become a Food Donor</h3>
              <p className="text-lg opacity-90 mb-6">
                Turn your surplus food into hope for someone in need. Every donation helps reduce waste and feed communities.
              </p>
              
              <ul className="text-left space-y-2 mb-8 opacity-90">
                <li>• Post donations in minutes</li>
                <li>• Real-time pickup coordination</li>
                <li>• Track your impact</li>
                <li>• Join a community of givers</li>
              </ul>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
              >
                Start Donating
                <Heart className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>

          {/* For NGOs */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cream-warm to-cream-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-teal-primary" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">Partner NGO or Receiver</h3>
              <p className="text-lg opacity-90 mb-6">
                Access fresh, quality food for your beneficiaries. Connect with donors and make collection efficient.
              </p>
              
              <ul className="text-left space-y-2 mb-8 opacity-90">
                <li>• Instant donation alerts</li>
                <li>• GPS-enabled pickup</li>
                <li>• Quality assurance features</li>
                <li>• Analytics dashboard</li>
              </ul>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
              >
                Become Partner
                <Users className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        {/* <div className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">Get Started Today</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3 justify-center">
                <Phone className="h-5 w-5 text-gold-accent" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <Mail className="h-5 w-5 text-gold-accent" />
                <span>hello@annapoorna.org</span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="bg-gold-accent hover:bg-gold-light text-white font-semibold px-8"
            >
              Contact Us Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default CTA;