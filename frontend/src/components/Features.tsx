import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Bell, Camera, Shield, BarChart3 } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: MapPin,
      title: "Real-Time Location Tracking",
      description: "NGOs and Receiver can track donor locations in real-time for efficient pickup coordination.",
      color: "from-teal-primary to-teal-light"
    },
    {
      icon: Bell,
      title: "Instant Notifications",
      description: "Get notified immediately when donations are posted through E-mail.",
      color: "from-gold-accent to-gold-light"
    },
    {
      icon: Clock,
      title: "First-Come-First-Serve",
      description: "Fair distribution system ensuring quick response and efficient food rescue.",
      color: "from-teal-light to-primary"
    },
    {
      icon: Camera,
      title: "Quality Assurance",
      description: "Image proof uploads and condition ratings ensure food safety standards.",
      color: "from-gold-light to-accent"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "End-to-end encryption and role-based access for donor and receiver safety.",
      color: "from-primary to-teal-primary"
    },
    {
      icon: BarChart3,
      title: "Impact Analytics",
      description: "Track meals rescued, donors engaged, and communities served with detailed analytics.",
      color: "from-accent to-gold-accent"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-cream-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Powerful Features for{" "}
            <span className="text-primary">Maximum Impact</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform is designed to make food rescue simple, efficient, and secure for both donors and needy.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)] hover:-translate-y-2 bg-white/50 backdrop-blur-sm border-none"
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-[var(--transition-bounce)]`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;