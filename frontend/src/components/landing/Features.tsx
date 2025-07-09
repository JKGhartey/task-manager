import {
  BarChart3,
  CheckCircle,
  Clock,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: CheckCircle,
    title: "Task Organization",
    description:
      "Organize tasks with categories, priorities, and deadlines. Keep everything structured and easy to find.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Assign tasks to team members, track progress, and collaborate seamlessly with real-time updates.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Monitor task completion rates, team performance, and project milestones with detailed analytics.",
  },
  {
    icon: Clock,
    title: "Time Management",
    description:
      "Set deadlines, track time spent on tasks, and optimize your workflow for maximum efficiency.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Your data is protected with enterprise-grade security and 99.9% uptime guarantee.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "Get instant notifications and updates on task changes, comments, and project progress.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
            Features
          </div>
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Everything you need to
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {" "}
              manage tasks effectively
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to streamline your workflow and boost
            team productivity. Built for modern teams who demand excellence.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-background/50 backdrop-blur-sm"
            >
              <CardHeader className="pb-4">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <div className="h-1 w-8 bg-primary/30 rounded-full"></div>
            <span>And much more...</span>
            <div className="h-1 w-8 bg-primary/30 rounded-full"></div>
          </div>
          <p className="text-lg font-medium text-foreground">
            Ready to experience the difference?
          </p>
        </div>
      </div>
    </section>
  );
}
