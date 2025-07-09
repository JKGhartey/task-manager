import {
  BarChart3,
  CheckCircle,
  Clock,
  Shield,
  Target,
  TrendingUp,
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
    size: "large",
    gradient: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-500",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Assign tasks to team members, track progress, and collaborate seamlessly with real-time updates.",
    size: "medium",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Monitor task completion rates, team performance, and project milestones with detailed analytics.",
    size: "medium",
    gradient: "from-purple-500/20 to-violet-500/20",
    iconColor: "text-purple-500",
  },
  {
    icon: Clock,
    title: "Time Management",
    description:
      "Set deadlines, track time spent on tasks, and optimize your workflow for maximum efficiency.",
    size: "small",
    gradient: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-500",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Your data is protected with enterprise-grade security and 99.9% uptime guarantee.",
    size: "small",
    gradient: "from-indigo-500/20 to-blue-500/20",
    iconColor: "text-indigo-500",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "Get instant notifications and updates on task changes, comments, and project progress.",
    size: "large",
    gradient: "from-yellow-500/20 to-orange-500/20",
    iconColor: "text-yellow-500",
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description:
      "Advanced insights into team productivity, task completion patterns, and workflow optimization.",
    size: "small",
    gradient: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-500",
  },
  {
    icon: Target,
    title: "Goal Setting",
    description:
      "Set SMART goals, track milestones, and celebrate achievements with your team.",
    size: "medium",
    gradient: "from-teal-500/20 to-cyan-500/20",
    iconColor: "text-teal-500",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/3 to-secondary/3 rounded-full blur-3xl"></div>
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

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 max-w-7xl mx-auto">
          {/* Large card - Task Organization */}
          <div className="md:col-span-4 lg:col-span-6 md:row-span-2">
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-background/60 backdrop-blur-sm overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative pb-4">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm group-hover:bg-background/90 transition-all duration-300 shadow-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300 relative z-10">
                  Task Organization
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-lg leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 mb-6">
                  Organize tasks with categories, priorities, and deadlines.
                  Keep everything structured and easy to find.
                </CardDescription>

                {/* Feature highlights */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        Smart Categories
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Auto-organize tasks by project, team, or custom tags
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        Priority Levels
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Set urgent, high, medium, and low priority with visual
                        indicators
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        Deadline Management
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Track due dates with smart reminders and notifications
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        Search & Filter
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Find tasks instantly with powerful search and filtering
                        options
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats preview */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-500">∞</div>
                      <div className="text-xs text-muted-foreground">
                        Categories
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">4</div>
                      <div className="text-xs text-muted-foreground">
                        Priority Levels
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">
                        ⚡
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Smart Search
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                <CheckCircle className="h-20 w-20 text-green-500 rotate-12" />
              </div>
            </Card>
          </div>

          {/* Medium card - Team Collaboration */}
          <div className="md:col-span-2 lg:col-span-3 md:row-span-1">
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-background/60 backdrop-blur-sm overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative pb-4">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm group-hover:bg-background/90 transition-all duration-300 shadow-lg">
                  <Users className="h-6 w-6 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300 relative z-10">
                  Team Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                  Assign tasks to team members, track progress, and collaborate
                  seamlessly.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Small card - Time Management */}
          <div className="md:col-span-2 lg:col-span-3 md:row-span-1">
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-background/60 backdrop-blur-sm overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative pb-4">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm group-hover:bg-background/90 transition-all duration-300 shadow-lg">
                  <Clock className="h-6 w-6 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300 relative z-10">
                  Time Management
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                  Set deadlines, track time spent on tasks, and optimize your
                  workflow.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Small card - Security */}
          <div className="md:col-span-2 lg:col-span-3 md:row-span-1">
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-background/60 backdrop-blur-sm overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative pb-4">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm group-hover:bg-background/90 transition-all duration-300 shadow-lg">
                  <Shield className="h-6 w-6 text-indigo-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300 relative z-10">
                  Secure & Reliable
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                  Enterprise-grade security and 99.9% uptime guarantee.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Small card - Analytics */}
          <div className="md:col-span-2 lg:col-span-3 md:row-span-1">
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-background/60 backdrop-blur-sm overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative pb-4">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm group-hover:bg-background/90 transition-all duration-300 shadow-lg">
                  <TrendingUp className="h-6 w-6 text-pink-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300 relative z-10">
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                  Advanced insights into team productivity and workflow
                  optimization.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Medium card - Progress Tracking */}
          <div className="md:col-span-2 lg:col-span-4 md:row-span-1">
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-background/60 backdrop-blur-sm overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative pb-4">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm group-hover:bg-background/90 transition-all duration-300 shadow-lg">
                  <BarChart3 className="h-6 w-6 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300 relative z-10">
                  Progress Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                  Monitor task completion rates, team performance, and project
                  milestones.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Medium card - Goal Setting */}
          <div className="md:col-span-2 lg:col-span-4 md:row-span-1">
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-background/60 backdrop-blur-sm overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative pb-4">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm group-hover:bg-background/90 transition-all duration-300 shadow-lg">
                  <Target className="h-6 w-6 text-teal-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300 relative z-10">
                  Goal Setting
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                  Set SMART goals, track milestones, and celebrate achievements.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Medium card - Real-time Updates */}
          <div className="md:col-span-2 lg:col-span-4 md:row-span-1">
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-background/60 backdrop-blur-sm overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative pb-4">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm group-hover:bg-background/90 transition-all duration-300 shadow-lg">
                  <Zap className="h-6 w-6 text-yellow-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300 relative z-10">
                  Real-time Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                  Get instant notifications and updates on task changes,
                  comments, and project progress.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <div className="h-1 w-8 bg-primary/30 rounded-full"></div>
            <span>And much more...</span>
            <div className="h-1 w-8 bg-primary/30 rounded-full"></div>
          </div>
          <p className="text-lg font-medium text-foreground mb-6">
            Ready to experience the difference?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl">
              Get Started Free
            </button>
            <button className="px-8 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-colors duration-300">
              View Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
