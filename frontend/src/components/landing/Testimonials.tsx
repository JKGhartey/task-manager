import { Card, CardContent } from "@/components/ui/card";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Project Manager",
    company: "TechCorp",
    content:
      "This task management platform has completely transformed how our team works. The real-time updates and collaboration features are game-changers.",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Team Lead",
    company: "StartupXYZ",
    content:
      "Simple, intuitive, and powerful. We've increased our productivity by 40% since switching to this platform. Highly recommended!",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "Product Manager",
    company: "InnovateLab",
    content:
      "The analytics and reporting features help us make data-driven decisions. The interface is clean and the customer support is excellent.",
    rating: 5,
    avatar: "ER",
  },
  {
    name: "David Thompson",
    role: "CEO",
    company: "GrowthCo",
    content:
      "We've tried many task management tools, but this one stands out for its ease of use and powerful features. It's become essential for our workflow.",
    rating: 5,
    avatar: "DT",
  },
  {
    name: "Lisa Wang",
    role: "Operations Director",
    company: "ScaleUp Inc",
    content:
      "The team collaboration features are outstanding. We can now track progress in real-time and ensure everyone stays aligned on project goals.",
    rating: 5,
    avatar: "LW",
  },
  {
    name: "James Wilson",
    role: "Development Lead",
    company: "CodeCraft",
    content:
      "As a development team, we need precise task tracking and this platform delivers. The integration capabilities are fantastic.",
    rating: 5,
    avatar: "JW",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Loved by teams worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            See what our customers have to say about their experience
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <blockquote className="mb-6 text-muted-foreground leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span>4.9/5 from 500+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}
