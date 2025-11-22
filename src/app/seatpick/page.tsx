'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Mic,
    Layers,
    Zap,
    Users,
    Shield,
    CheckCircle,
    ArrowRight,
    Globe,
    Database,
    Sparkles,
    BarChart3,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// --- Components ---

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
    >
        {children}
    </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors"
    >
        <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
);

const StepCard = ({ number, title, description }: { number: string; title: string; description: string }) => (
    <div className="relative pl-8 border-l-2 border-purple-500/30 pb-12 last:pb-0">
        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
        <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-purple-400">Step {number}</span> {title}
        </h4>
        <p className="text-gray-400">{description}</p>
    </div>
);

const RoleCard = ({ title, features, isAdmin = false }: { title: string; features: string[]; isAdmin?: boolean }) => (
    <div className={`p-8 rounded-2xl border ${isAdmin ? 'bg-purple-900/10 border-purple-500/30' : 'bg-white/5 border-white/10'}`}>
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            {isAdmin ? <Shield className="text-purple-400" /> : <Users className="text-blue-400" />}
            {title}
        </h3>
        <ul className="space-y-4">
            {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle size={18} className={isAdmin ? "text-purple-400 mt-1" : "text-blue-400 mt-1"} />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
    </div>
);

const FaqItem = ({ question, answer }: { question: string; answer: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-white/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 text-left flex items-center justify-between hover:text-purple-400 transition-colors"
            >
                <span className="text-lg font-medium text-white">{question}</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <ArrowRight size={20} />
                </span>
            </button>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="pb-6 text-gray-400 leading-relaxed"
                >
                    {answer}
                </motion.div>
            )}
        </div>
    );
};

export default function SeatPickLandingPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-purple-500/30">

            {/* --- Hero Section --- */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-[#0A0A0A] to-[#0A0A0A]" />

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <FadeIn>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                            <Sparkles size={16} className="text-purple-400" />
                            <span className="text-sm font-medium text-gray-300">New: Voice Feedback & Multi-Model Support</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                            Create Professional <br />
                            Landing Pages at Scale
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                            The SeatPick Generator combines the power of GPT-4, Claude, and Gemini to build SEO-optimized content for venues, teams, and events in seconds.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                                Start Generating <ArrowRight size={20} />
                            </button>
                            <button className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all">
                                View Documentation
                            </button>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* --- Features Grid --- */}
            <section className="py-24 px-6 bg-[#0F0F0F]">
                <div className="max-w-7xl mx-auto">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Supercharge Your Content Workflow</h2>
                            <p className="text-gray-400">Everything you need to manage thousands of pages with ease.</p>
                        </div>
                    </FadeIn>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FadeIn delay={0.1}>
                            <FeatureCard
                                icon={Mic}
                                title="Voice Feedback"
                                description="Speak your edits naturally. The AI listens, transcribes, and revises your content instantly."
                            />
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <FeatureCard
                                icon={Layers}
                                title="Multi-Model Comparison"
                                description="Run GPT-4, Claude, and Gemini side-by-side. Pick the best output for every page."
                            />
                        </FadeIn>
                        <FadeIn delay={0.3}>
                            <FeatureCard
                                icon={Zap}
                                title="Bulk Generation"
                                description="Upload a CSV and generate 100+ pages at once. Perfect for venue and team directories."
                            />
                        </FadeIn>
                        <FadeIn delay={0.4}>
                            <FeatureCard
                                icon={Globe}
                                title="Multi-Language"
                                description="Generate native-quality content in Spanish, French, German, and more with auto-locale detection."
                            />
                        </FadeIn>
                        <FadeIn delay={0.5}>
                            <FeatureCard
                                icon={Database}
                                title="Direct CMS Push"
                                description="Publish approved content directly to Strapi with one click. No copy-pasting required."
                            />
                        </FadeIn>
                        <FadeIn delay={0.6}>
                            <FeatureCard
                                icon={BarChart3}
                                title="Cost & Quality Analytics"
                                description="Track token usage, costs per page, and quality scores to optimize your budget."
                            />
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* --- Workflow Section --- */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <FadeIn>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">From Idea to Published <br /> in Minutes</h2>
                        <p className="text-gray-400 mb-8">
                            Streamline your content creation process. Whether it&apos;s a single page or a massive campaign, the workflow remains simple and efficient.
                        </p>
                        <div className="space-y-2">
                            <StepCard
                                number="01"
                                title="Input Details"
                                description="Enter page details manually or upload a CSV for bulk processing."
                            />
                            <StepCard
                                number="02"
                                title="Select AI Model"
                                description="Choose from top-tier models like GPT-4 Turbo or Claude Sonnet."
                            />
                            <StepCard
                                number="03"
                                title="Generate & Review"
                                description="AI drafts the content. Use voice feedback to refine and polish."
                            />
                            <StepCard
                                number="04"
                                title="Publish"
                                description="Push directly to Strapi or export to Google Docs/Markdown."
                            />
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#1A1A1A] aspect-square flex items-center justify-center">
                            {/* Placeholder for a UI screenshot or abstract graphic */}
                            <div className="text-center p-8">
                                <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-400">
                                    <Sparkles size={48} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">AI-Powered Magic</h3>
                                <p className="text-gray-400">Watch your content come to life</p>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* --- Roles Section --- */}
            <section className="py-24 px-6 bg-[#0F0F0F]">
                <div className="max-w-7xl mx-auto">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Teams</h2>
                            <p className="text-gray-400">Powerful tools for creators, advanced controls for admins.</p>
                        </div>
                    </FadeIn>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <FadeIn delay={0.1}>
                            <RoleCard
                                title="Content Creator"
                                features={[
                                    "Generate single or bulk pages",
                                    "Review and edit with Rich Text",
                                    "Use Voice Feedback for revisions",
                                    "Export to Docs or Strapi",
                                    "View personal history"
                                ]}
                            />
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <RoleCard
                                title="Admin / Editor"
                                isAdmin
                                features={[
                                    "Score generations (1-10) to train AI",
                                    "Manage Prompt Pipelines & “Bag of Tricks”",
                                    "View all user generations",
                                    "Analyze costs and token usage",
                                    "Curate Reference Library"
                                ]}
                            />
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* --- FAQ / Manual Content --- */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <FadeIn>
                        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-2">
                            <FaqItem
                                question="What page types are supported?"
                                answer="We support 6 core page types: Venue (stadiums), Team (sports clubs), Event (specific matches), Festival (music events), League (competitions), and City (destinations). Each type has a specialized prompt structure."
                            />
                            <FaqItem
                                question="How does the Scoring System work?"
                                answer="Admins can rate generations on a 1-10 scale. High scores (9-10) are added to the Reference Library to train the AI. Low scores (&lt;7) require feedback tags (e.g., “too promotional”) which help the AI learn what to avoid."
                            />
                            <FaqItem
                                question="Can I use my own API keys?"
                                answer="Currently, the system uses a centralized API key management system controlled by admins. This ensures consistent billing and access to fine-tuned models."
                            />
                            <FaqItem
                                question="How do I fix &lsquo;Missing Keywords&rsquo; warnings?"
                                answer="If the system flags missing keywords, you can either manually add them to the text or use the Voice Feedback feature to say &ldquo;Add the missing keywords naturally&rdquo; and let the AI handle it."
                            />
                            <FaqItem
                                question="What happens if I push to Strapi with an existing slug?"
                                answer="Warning: Pushing to Strapi with an existing slug will OVERWRITE the current content on that page. Always double-check that you are updating the correct page before pushing."
                            />
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* --- Footer --- */}
            <footer className="py-12 px-6 border-t border-white/10 bg-[#050505]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-gray-400 text-sm">
                        © 2025 SeatPick Generator. Internal Tool.
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">User Manual</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Admin Login</a>
                    </div>
                </div>
            </footer>

        </div>
    );
}
