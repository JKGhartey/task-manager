import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/routes";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for individuals and small teams getting started",
    features: [
      "Up to 10 tasks",
      "Basic task management",
      "Email support",
      "Mobile app access",
      "Basic reporting",
    ],
    popular: false,
    cta: "Get Started Free",
    href: ROUTES.SIGNUP,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "Ideal for growing teams and businesses",
    features: [
      "Unlimited tasks",
      "Advanced task management",
      "Team collaboration",
      "Priority support",
      "Advanced analytics",
      "Custom categories",
      "File attachments",
      "API access",
    ],
    popular: true,
    cta: "Start Free Trial",
    href: ROUTES.SIGNUP,
  },
  {
    name: "Enterprise",
    price: "$29",
    period: "per month",
    description: "For large organizations with advanced needs",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Advanced security",
      "Custom integrations",
      "Dedicated support",
      "SSO authentication",
      "Advanced permissions",
      "Custom branding",
    ],
    popular: false,
    cta: "Contact Sales",
    href: "#contact",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that's right for you and your team
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                plan.popular ? "ring-2 ring-primary" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <CardDescription className="text-base mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="w-full mt-6"
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link to={plan.href}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}
