import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header/Navigation */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.svg" 
              alt="AI Interview Logo" 
              width={40} 
              height={40}
            />
            <h1 className="text-2xl font-bold text-primary">AI Mock Interview</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/sign-in">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 space-y-6">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              🚀 AI-Powered Interview Practice
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Your Personal AI
              <span className="text-primary"> Interview Coach</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl">
              Practice with AI-generated questions tailored to your job role. 
              Get instant feedback and improve your interview skills with our 
              advanced mock interview platform.
            </p>

            <div className="flex gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Practicing Free
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-gray-600">Mock Interviews</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-gray-600">Job Roles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Image/Illustration */}
          <div className="flex-1">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <Image
                src="/window.svg"
                alt="AI Interview Illustration"
                width={500}
                height={500}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="how-it-works" className="py-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-bold mb-3">1. Enter Job Details</h3>
              <p className="text-gray-600">
                Provide your job position, description, and years of experience. 
                Our AI will customize questions for you.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold mb-3">2. AI Generates Questions</h3>
              <p className="text-gray-600">
                Get 5 tailored interview questions with model answers generated 
                by Google Gemini AI based on your role.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-bold mb-3">3. Practice & Get Feedback</h3>
              <p className="text-gray-600">
                Answer questions, get instant AI feedback, ratings, and 
                personalized improvement suggestions.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Ace Your Interview?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of job seekers who improved their interview skills with AI
            </p>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Get Started Now - It's Free!
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 AI Mock Interview. Built with Next.js, Gemini AI & Clerk.</p>
        </div>
      </footer>
    </div>
  );
}
