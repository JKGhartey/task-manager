import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    description: "Get in touch with our support team",
    value: "gharteyjerome@gmail.com",
    href: "mailto:gharteyjerome@gmail.com",
  },
  {
    icon: Phone,
    title: "Phone",
    description: "Speak with our sales team",
    value: "+233 596036149",
    href: "tel:+233596036149",
  },
  {
    icon: MapPin,
    title: "Office",
    description: "Visit our headquarters",
    value: "123 Business St, Tech City, TC 12345",
    href: "#",
  },
  {
    icon: Clock,
    title: "Support Hours",
    description: "When we're available to help",
    value: "Mon-Fri 9AM-6PM GMT",
    href: "#",
  },
];

export function Contact() {
  return (
    <section id="contact" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Get in touch
          </h2>
          <p className="text-lg text-muted-foreground">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24
                hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Your Company" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your project or question..."
                  rows={4}
                />
              </div>
              <Button className="w-full">Send Message</Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
              <p className="text-muted-foreground mb-6">
                Ready to get started? Reach out to us through any of these
                channels.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {info.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-1">
                          {info.description}
                        </p>
                        {info.href !== "#" ? (
                          <a
                            href={info.href}
                            className="text-sm text-primary hover:underline"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm text-foreground">
                            {info.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
