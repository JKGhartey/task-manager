import { BarChart3, ClipboardList, UserPlus, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Account",
    description:
      "Sign up for free and set up your workspace in minutes. No credit card required.",
  },
  {
    icon: ClipboardList,
    step: "02",
    title: "Add Your Tasks",
    description:
      "Create tasks, set priorities, and organize them into projects and categories.",
  },
  {
    icon: Users,
    step: "03",
    title: "Invite Your Team",
    description:
      "Add team members, assign tasks, and start collaborating on projects together.",
  },
  {
    icon: BarChart3,
    step: "04",
    title: "Track Progress",
    description:
      "Monitor task completion, view analytics, and optimize your workflow for better results.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 lg:py-32 bg-gradient-to-br from-muted/50 to-background relative"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
            How it Works
          </div>
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Get started in
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {" "}
              4 simple steps
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform is designed to be intuitive and easy to use from day
            one. You'll be up and running in minutes, not hours.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="group border-0 shadow-lg bg-background/80 backdrop-blur-sm relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <step.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed text-muted-foreground">
                  {step.description}
                </CardDescription>
              </CardContent>

              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/30 to-primary/10 transform -translate-y-1/2 z-10"></div>
              )}
            </Card>
          ))}
        </div>

        {/* Mobile connection lines */}
        <div className="lg:hidden mt-8">
          <div className="flex justify-center">
            <div className="space-y-8">
              {steps.slice(0, -1).map((_, index) => (
                <div
                  key={index}
                  className="w-0.5 h-8 bg-gradient-to-b from-primary/30 to-transparent mx-auto"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg font-medium text-foreground mb-4">
            That's it! You're ready to boost your productivity.
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-1 w-8 bg-primary/30 rounded-full"></div>
            <span>No complex setup required</span>
            <div className="h-1 w-8 bg-primary/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
