import { Building2, Clock, Mail, Phone, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Support",
    value: "gharteyjerome@gmail.com",
    href: "mailto:gharteyjerome@gmail.com",
  },
  {
    icon: Phone,
    title: "Phone Support",
    value: "+233 596036149",
    href: "tel:+233596036149",
  },
  {
    icon: Building2,
    title: "Office Location",
    value: "123 Business St, Tech City, TC 12345",
    href: "#",
  },
  {
    icon: Clock,
    title: "Support Hours",
    value: "Mon-Fri 9AM-6PM GMT",
    href: "#",
  },
];

export function Contact() {
  return (
    <section id="contact" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
            Contact Us
          </div>
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Ready to get started?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our task management platform? We're here to
            help you find the perfect solution for your team's needs.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 max-w-7xl mx-auto">
          {/* Contact Form */}
          <div>
            <Card className="border border-border/50 shadow-xl bg-background/50 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Send className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Send us a message</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Fill out the form below and we'll get back to you within 24
                  hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="h-11 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      className="h-11 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    className="h-11 border-border/50 focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium">
                    Company
                  </Label>
                  <Input
                    id="company"
                    placeholder="Your Company Inc."
                    className="h-11 border-border/50 focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your project requirements, team size, or any questions you have..."
                    rows={5}
                    className="border-border/50 focus:border-primary transition-colors resize-none"
                  />
                </div>
                <Button className="w-full h-11">Send Message</Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold mb-4 text-foreground">
                Get in touch
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Ready to transform your team's productivity? Reach out to us
                through any of these channels and we'll help you get started.
              </p>
            </div>

            {/* Simplified Contact Info Grid */}
            <div className="grid gap-4">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-accent/5 border border-border/30 hover:bg-accent/10 transition-colors duration-300"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-sm mb-1">
                      {info.title}
                    </h4>
                    {info.href !== "#" ? (
                      <a
                        href={info.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {info.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Why Choose Us Section */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-border/30">
              <h4 className="font-semibold text-foreground mb-4">
                Why choose us?
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    24/7 customer support
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Free consultation and setup
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Custom integrations available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
