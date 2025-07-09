import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/routes";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-32 lg:py-48 min-h-screen flex items-center"
      role="banner"
      aria-labelledby="hero-heading"
    >
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 animate-pulse">
          <div className="h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>
        </div>
        <div className="absolute right-0 bottom-0 animate-pulse delay-1000">
          <div className="h-64 w-64 rounded-full bg-secondary/10 blur-3xl"></div>
        </div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 animate-pulse delay-500">
          <div className="h-32 w-32 rounded-full bg-blue-500/10 blur-2xl"></div>
        </div>
        {/* Floating elements */}
        <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-primary/20 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-secondary/20 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-blue-500/20 rounded-full animate-bounce delay-500"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="text-center lg:text-left">
              {/* Enhanced Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 px-5 py-2.5 text-sm font-semibold text-primary border border-primary/30 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 group">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="group-hover:scale-105 transition-transform duration-300">
                  ✨ AI-Powered • Free Forever
                </span>
              </div>

              {/* Enhanced Main heading */}
              <h1
                id="hero-heading"
                className="mb-8 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-tight"
              >
                <span className="block text-2xl sm:text-4xl lg:text-5xl text-muted-foreground font-medium mb-3">
                  Boost Your Team's
                </span>
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Productivity
                </span>
              </h1>

              {/* Enhanced Subtitle */}
              <p className="mb-10 text-base text-muted-foreground sm:text-lg lg:text-xl leading-relaxed max-w-2xl">
                Streamline workflows, eliminate chaos, and deliver projects on
                time.
                <span className="font-semibold text-foreground">
                  {" "}
                  10,000+ teams
                </span>{" "}
                trust us to manage their most important work.
              </p>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-start lg:justify-start mb-12">
                <Button
                  asChild
                  size="lg"
                  className="text-base px-8 py-3 h-auto group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link
                    to={ROUTES.SIGNUP}
                    className="flex items-center gap-3 relative z-10"
                    aria-label="Get started with TaskManager for free"
                  >
                    <span className="font-semibold">Get Started Free</span>
                    <span className="text-xs opacity-90 bg-white/20 px-2 py-1 rounded-full">
                      No credit card
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-base px-8 py-3 h-auto group border-2 hover:bg-primary/5 transition-all duration-300"
                >
                  <Link
                    to={ROUTES.LOGIN}
                    className="flex items-center gap-2"
                    aria-label="Sign in to your existing account"
                  >
                    <span className="font-medium">Sign In</span>
                    <span className="text-xs opacity-70">→</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right side - Visual Demo */}
            <div className="relative hidden lg:block" aria-hidden="true">
              <div className="relative">
                {/* Main demo card */}
                <div className="bg-background/80 backdrop-blur-sm border rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-primary/20 rounded animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-primary/10 backdrop-blur-sm border rounded-lg p-3 animate-bounce delay-1000">
                  <div className="text-xs font-medium text-primary">
                    ✓ Task Complete
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-secondary/10 backdrop-blur-sm border rounded-lg p-3 animate-bounce delay-1500">
                  <div className="text-xs font-medium text-secondary">
                    📈 +40% Productivity
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Social proof */}
          <div className="mt-16">
            <p className="text-sm text-muted-foreground mb-8 text-center">
              Trusted by innovative teams worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 backdrop-blur-sm border hover:bg-background/70 transition-colors duration-300">
                <div className="h-6 w-6">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-full h-full"
                    aria-label="TechCorp logo"
                  >
                    <rect width="24" height="24" rx="6" fill="#3B82F6" />
                    <path d="M8 12L12 8L16 12L12 16L8 12Z" fill="white" />
                    <circle cx="12" cy="12" r="2" fill="#3B82F6" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  TechCorp
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 backdrop-blur-sm border hover:bg-background/70 transition-colors duration-300">
                <div className="h-6 w-6">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-full h-full"
                    aria-label="InnovateLab logo"
                  >
                    <rect width="24" height="24" rx="6" fill="#10B981" />
                    <circle cx="12" cy="12" r="4" fill="white" />
                    <circle cx="12" cy="12" r="2" fill="#10B981" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  InnovateLab
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 backdrop-blur-sm border hover:bg-background/70 transition-colors duration-300">
                <div className="h-6 w-6">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-full h-full"
                    aria-label="DataSync logo"
                  >
                    <rect width="24" height="24" rx="6" fill="#8B5CF6" />
                    <path d="M8 12L12 8L16 12L12 16L8 12Z" fill="white" />
                    <circle cx="12" cy="12" r="2" fill="#8B5CF6" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  DataSync
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 backdrop-blur-sm border hover:bg-background/70 transition-colors duration-300">
                <div className="h-6 w-6">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-full h-full"
                    aria-label="CloudScale logo"
                  >
                    <rect width="24" height="24" rx="6" fill="#F59E0B" />
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 12L12 18L18 12"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.7"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  CloudScale
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
