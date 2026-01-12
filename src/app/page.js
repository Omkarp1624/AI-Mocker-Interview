import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header/Navigation */}
      <header className="container mx-auto px-4 py-8 sticky top-0 z-50 bg-gradient-to-b from-slate-900 via-blue-900 to-transparent">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-white">
              AI
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">PrepPro AI</h1>
          </div>
          <div className="flex gap-6 items-center">
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg px-6 py-2 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/75 transition-all duration-300">Dashboard</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-120px)] py-12">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-full text-sm font-semibold backdrop-blur-sm">
              🚀 AI-Powered Interview Practice
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Your Personal AI
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Interview Coach</span>
            </h1>
            
            <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
              Master your interview skills with AI-generated questions tailored to your role. 
              Get instant, personalized feedback and gain the confidence to ace any interview.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold text-lg px-8 py-7">
                  Start Practicing Now
                </Button>
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full border-blue-400/50 text-blue-300 hover:bg-blue-500/20 font-semibold text-lg px-8 py-7">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-blue-500/20">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">1000+</div>
                <div className="text-gray-400 text-sm mt-2">Interviews Conducted</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">50+</div>
                <div className="text-gray-400 text-sm mt-2">Job Roles</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">95%</div>
                <div className="text-gray-400 text-sm mt-2">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Image/Illustration */}
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-md h-full min-h-[400px]">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-cyan-600/40 to-blue-900/40 rounded-3xl blur-3xl animate-pulse"></div>
              
              {/* Image Container */}
              <div className="relative z-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-400/30 rounded-3xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <span className="text-6xl">🎯</span>
                  </div>
                  <p className="text-xl font-semibold text-blue-200">Smart Interview</p>
                  <p className="text-sm text-gray-400 mt-2">Powered by Google Gemini AI</p>
                  <div className="mt-6 space-y-2 text-left text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400">✓</span> Real-time feedback
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400">✓</span> Custom questions
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400">✓</span> Performance metrics
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="how-it-works" className="py-24 border-t border-blue-500/20">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">How It Works</span>
            </h2>
            <p className="text-gray-400 text-lg">Simple steps to master your interview skills</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 p-8 rounded-2xl hover:border-blue-400/60 transition-all backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Enter Your Details</h3>
              <p className="text-gray-400">
                Provide your target position, experience level, and job description for personalized interview questions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 p-8 rounded-2xl hover:border-blue-400/60 transition-all backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Generates Questions</h3>
              <p className="text-gray-400">
                Google Gemini AI creates 5 tailored interview questions with professional model answers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 p-8 rounded-2xl hover:border-blue-400/60 transition-all backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/20">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Get Instant Feedback</h3>
              <p className="text-gray-400">
                Receive real-time AI feedback, ratings, and personalized improvement suggestions.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 border-t border-blue-500/20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Why Choose AI Mock Interview?</span>
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="text-cyan-400 text-2xl flex-shrink-0">✓</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">AI-Powered Personalization</h4>
                    <p className="text-gray-400">Custom questions for your specific role and experience</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-cyan-400 text-2xl flex-shrink-0">✓</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Real-Time Feedback</h4>
                    <p className="text-gray-400">Instant analysis and improvement suggestions after each answer</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-cyan-400 text-2xl flex-shrink-0">✓</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Progress Tracking</h4>
                    <p className="text-gray-400">Monitor your improvements over time with detailed analytics</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-cyan-400 text-2xl flex-shrink-0">✓</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">100% Free to Start</h4>
                    <p className="text-gray-400">Practice unlimited interviews without any cost</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-400/30 rounded-3xl p-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-2">Success Rate</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-cyan-400">95%</span>
                      <span className="text-gray-400">of users feel confident</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-2">Interview Quality</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-cyan-400">50+</span>
                      <span className="text-gray-400">job roles available</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-2">User Base</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-cyan-400">1000+</span>
                      <span className="text-gray-400">interviews daily</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 border-t border-blue-500/20">
          <div className="bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-blue-600/20 border border-blue-400/30 backdrop-blur-xl rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
              Ready to Ace Your Interview?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of successful professionals who improved their interview skills with AI
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold text-lg px-10 py-7">
                Start Your Free Interview Now →
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 bg-slate-900/50 backdrop-blur-sm py-12 mt-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                  AI
                </div>
                <span className="font-bold text-white">PrepPro AI</span>
              </div>
              <p className="text-gray-400 text-sm">Master your interview skills with advanced AI coaching</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/dashboard" className="hover:text-cyan-400 transition">Dashboard</Link></li>
                <li><Link href="#how-it-works" className="hover:text-cyan-400 transition">How It Works</Link></li>
                <li><Link href="/sign-in" className="hover:text-cyan-400 transition">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Built With</h4>
              <p className="text-gray-400 text-sm">Next.js • Google Gemini AI • Clerk • Tailwind CSS</p>
            </div>
          </div>
          <div className="border-t border-blue-500/20 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>© 2025 PrepPro AI. All rights reserved.</p>
            <p className="mt-4 md:mt-0">Crafted by <span className="font-semibold text-cyan-400">Omkar Patil</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
