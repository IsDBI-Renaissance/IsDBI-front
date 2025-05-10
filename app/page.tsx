"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useInView } from "react-intersection-observer"
import { ThemeToggle } from "@/components/theme-toggle"
import img1 from "../public/images/img.png"
export default function Home() {
  // Refs for scroll animations
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: dashboardRef, inView: dashboardInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: feature1Ref, inView: feature1InView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: feature2Ref, inView: feature2InView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: feature3Ref, inView: feature3InView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: missionRef, inView: missionInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: testimonialRef, inView: testimonialInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: clientsRef, inView: clientsInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: ctaRef, inView: ctaInView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 border-b border-gray-100 sticky top-0 bg-white/90 dark:bg-dark/90 backdrop-blur-sm z-50">
        <div className="container-custom flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center min-w-[120px]">
            <span className="flex items-center text-primary font-bold text-2xl">
              <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
              </svg>
              Islamic Finance
            </span>
          </div>
          {/* Centered Nav */}
          <nav className="hidden md:flex flex-1 justify-center">
            <div className="flex gap-8 px-8 py-2 rounded-full bg-primary/5 border border-primary/10 shadow-sm">
              <Link href="/" className="text-dark dark:text-light hover:text-primary transition-colors font-medium">Home</Link>
              <Link href="/company" className="text-dark dark:text-light hover:text-primary transition-colors font-medium">Company</Link>
              <Link href="/product" className="text-dark dark:text-light hover:text-primary transition-colors font-medium">Product</Link>
              <Link href="/pricing" className="text-dark dark:text-light hover:text-primary transition-colors font-medium">Pricing</Link>
              <Link href="/docs/api" className="text-dark dark:text-light hover:text-primary transition-colors font-medium">API Documentation</Link>
            </div>
          </nav>
          {/* Right Buttons */}
          <div className="flex items-center gap-4 min-w-[180px] justify-end">
            <ThemeToggle className="bg-transparent shadow-none" />
            <Link href="/login" className="font-medium text-dark dark:text-light hover:text-primary transition-colors">Log in</Link>
            <Link href="/signup">
              <Button size="sm" className="rounded-full bg-primary text-white px-6 font-semibold shadow-none hover:bg-primary/90">Start</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-0 bg-white">
        <div className="container-custom flex flex-col items-center text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              <span className="block text-dark dark:text-light">The Path</span>
              <span className="block text-primary">To Shariah-Compliant Automation</span>
              <span className="block text-primary-light">Starts With FinStandAI</span>
            </h1>
            <p className="text-neutral text-lg md:text-xl mb-6">
              FinStandAI is the next-generation AI platform for Islamic finance. Automate, analyze, and assure — with clarity and confidence.
            </p>
            <div className="mb-4 flex justify-center items-center gap-2 text-sm text-primary font-semibold">
              Press <kbd className="px-2 py-1 bg-primary/10 rounded border border-primary/20">F</kbd> any time to get Started!
            </div>
          </div>
          <div className="w-full flex justify-center mt-8">
            <div className="bg-primary/5 rounded-3xl p-4 w-full max-w-7xl flex justify-center items-center" style={{ boxShadow: '0 8px 40px 0 rgba(139, 92, 246, 0.35)' }}>
              <Image
                src={img1}
                alt="Islamic Finance AI Dashboard Screenshot"
                width={1400}
                height={750}
                className="w-full h-auto rounded-2xl border-2 border-primary shadow-[0_8px_40px_0_rgba(139,92,246,0.35)]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-primary mb-16">Much more than an Islamic finance assistant</h2>
          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
            <div className="flex-1 bg-primary/5 rounded-2xl p-8 flex items-center justify-center">
              <Image src="/images/ai-automation.svg" alt="AI Automation" width={400} height={300} className="w-full h-auto" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-2xl font-bold mb-4 text-dark">Empower Islamic finance with next-gen AI</h3>
              <p className="text-neutral text-lg mb-2">FinStandAI transforms Shariah-compliant financial operations using AI-driven automation — no manuals, no complexity. Generate journal entries and detect contract types effortlessly.</p>
            </div>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 mb-20">
            <div className="flex-1 bg-primary/5 rounded-2xl p-8 flex items-center justify-center">
              <Image src="/images/accounting-control.svg" alt="Accounting Control" width={400} height={300} className="w-full h-auto" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-2xl font-bold mb-4 text-dark">Reclaim control of your accounting process</h3>
              <p className="text-neutral text-lg mb-2">Say goodbye to tedious interpretation of AAOIFI standards. FinStandAI helps professionals focus on decision-making, not decoding complex guidelines.</p>
            </div>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 bg-primary/5 rounded-2xl p-8 flex items-center justify-center">
              <Image src="/images/compliance.svg" alt="Compliance and Clarity" width={400} height={300} className="w-full h-auto" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-2xl font-bold mb-4 text-dark">AI-enhanced compliance and clarity</h3>
              <p className="text-neutral text-lg mb-2">From equity buyouts to Ijarah leasing, our platform decodes the standards behind every transaction. Transparent logic, step-by-step explanations, and full Shariah assurance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-light">
        <div className="container-custom text-center">
          <p className="text-sm text-primary-light uppercase font-semibold mb-4">Our Mission</p>
          <h2 className="text-3xl md:text-4xl font-bold text-dark-accent mb-8">
            We focus on simplifying Islamic finance,<br />
            <span className="text-dark">making AAOIFI standards accessible, actionable, and automated for institutions and professionals worldwide.</span>
          </h2>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-dark text-white">
        <div className="container-custom flex flex-col md:flex-row justify-between items-center rounded-2xl bg-dark p-8 shadow-xl">
          <div>
            <h3 className="text-2xl font-bold mb-2">We are at your disposal</h3>
            <p className="text-gray-300">Our team is ready to answer your questions and help you get started.</p>
          </div>
          <Link href="/signup">
            <Button variant="secondary" className="mt-6 md:mt-0 scale-up pulse">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="text-primary font-bold text-2xl mb-6">
                <span className="flex items-center">
                  <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                  </svg>
                  FreightMee
                </span>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral hover:text-primary transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                  </svg>
                </a>
                <a href="#" className="text-neutral hover:text-primary transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a href="#" className="text-neutral hover:text-primary transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-neutral hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral hover:text-primary transition-colors">
                    Product
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral hover:text-primary transition-colors">
                    Solutions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral hover:text-primary transition-colors">
                    Career
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-neutral hover:text-primary transition-colors">
                    Our Team
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral hover:text-primary transition-colors">
                    Partners
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral hover:text-primary transition-colors">
                    Legal Notice
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-neutral hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral hover:text-primary transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral hover:text-primary transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-neutral">© 2024, FreightMee. All Rights Reserved.</p>
            <div className="mt-4 md:mt-0">
              <span className="text-sm text-neutral">English</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
