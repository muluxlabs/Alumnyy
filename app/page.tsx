import Link from "next/link"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Globe, Users, Briefcase, Lightbulb, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="sm" />
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/sign-up">Join Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Logo size="xl" animated showText={false} />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance">
            From Study Abroad to{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-teal-500 to-amber-500 bg-clip-text text-transparent">
              Global Impact
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
            Connect with international students, graduates, and professionals worldwide.
            Expand your network, find opportunities, and build partnerships across borders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Get Started
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">50+</div>
              <div className="text-sm text-muted-foreground mt-1">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground mt-1">Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground mt-1">Opportunities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">100+</div>
              <div className="text-sm text-muted-foreground mt-1">Partnerships</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Three Pillars of Global Connection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you&apos;re a student, professional, or business leader, we provide the platform to expand your global reach.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="relative p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6">
                <Users className="size-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Global Talent Bridge
              </h3>
              <p className="text-muted-foreground mb-4">
                Connect international students and graduates with opportunities worldwide. Build your career across borders.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-indigo-500" />
                  International job board
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-indigo-500" />
                  Mentorship matching
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-indigo-500" />
                  Skill-based networking
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="relative p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-6">
                <Briefcase className="size-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Business Expansion Network
              </h3>
              <p className="text-muted-foreground mb-4">
                Find local partners, market intelligence, and collaboration opportunities for your global business ventures.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-teal-500" />
                  Local partner matching
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-teal-500" />
                  Market insights
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-teal-500" />
                  Cross-border consulting
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="relative p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
                <Lightbulb className="size-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Professional Ecosystem
              </h3>
              <p className="text-muted-foreground mb-4">
                Collaborate with professionals from diverse backgrounds. Find co-founders, advisors, and team members.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-amber-500" />
                  Co-founder matching
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-amber-500" />
                  Expert consultations
                </li>
                <li className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-amber-500" />
                  Knowledge sharing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our global collective in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Create Your Profile
              </h3>
              <p className="text-muted-foreground">
                Tell us about your background, expertise, and what you&apos;re looking for
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Discover Connections
              </h3>
              <p className="text-muted-foreground">
                Browse members by country, industry, or expertise and send connection requests
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Grow Together
              </h3>
              <p className="text-muted-foreground">
                Collaborate on opportunities, share insights, and expand your global reach
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Globe className="size-16 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Go Beyond Borders?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of international professionals building meaningful connections and opportunities across the globe.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/sign-up">
              Start Your Journey
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Beyond Borders Collective. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
