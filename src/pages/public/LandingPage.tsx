import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Dumbbell, Utensils, TrendingUp, MessageCircle, ShoppingBag, CheckCircle, Star } from 'lucide-react'
import { Button } from '../../components/ui'

const FEATURES = [
  { icon: Brain, title: 'AI Dietitian', desc: 'Personalised meal plans built around your goals, allergies, and UAE lifestyle — halal-certified always.' },
  { icon: Dumbbell, title: 'Smart Workouts', desc: 'AI-generated training plans tailored to you. Trainers can also upload and manage routines directly.' },
  { icon: TrendingUp, title: 'Whoop-Style Dashboard', desc: 'Track recovery, sleep, steps, and body composition with beautiful real-time insights.' },
  { icon: MessageCircle, title: 'AI Health Coach', desc: '24/7 chat with your AI coach. Ask anything from macro counts to Ramadan meal timing.' },
  { icon: Utensils, title: 'Macro Tracking', desc: 'Log meals, track macros, and follow realistic recipes with UAE grocery sourcing built-in.' },
  { icon: ShoppingBag, title: 'UAE Sourcing', desc: 'Every recipe links to Carrefour, Spinneys, Kibsons, and Talabat — order ingredients without leaving the app.' },
]

const TESTIMONIALS = [
  { name: 'Fatima Al Rashidi', role: 'Marketing Manager, Dubai', text: 'FitMind transformed how I eat during Ramadan. The Suhoor and Iftar meal plans are spot on — balanced and delicious.', rating: 5 },
  { name: 'Ahmed Khalil', role: 'Personal Trainer, Abu Dhabi', text: 'As a trainer, I can upload my clients\' workout programmes and track their progress all in one place. Game changer.', rating: 5 },
  { name: 'Priya Nair', role: 'IT Professional, Sharjah', text: 'Finally an app that understands UAE grocery stores. I order everything from Kibsons right from the recipe page!', rating: 5 },
]

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl green-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">FM</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FitMind</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-green-600 transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-green-600 transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/register')}>Get Started Free</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-green-200">
            <span>🇦🇪</span> Built for the UAE
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Your AI
            <span className="text-green-500"> Dietitian</span>
            <br />& Fitness Coach
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Personalised meal plans, smart workouts, and an AI coach — all built around your goals, culture, and the UAE lifestyle. Halal-aware, Ramadan-ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/register')}>
              Start Free — No Credit Card
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-4">Used by 10,000+ people across the UAE</p>

          {/* Hero visual */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-w-4xl mx-auto">
              <div className="bg-green-500 px-6 py-4 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/40" />
                  <div className="w-3 h-3 rounded-full bg-white/40" />
                  <div className="w-3 h-3 rounded-full bg-white/40" />
                </div>
                <span className="text-white text-sm font-medium">FitMind Dashboard</span>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Recovery', value: '82%', color: '#52a07c', sub: 'Peak' },
                  { label: 'Calories', value: '1,840', color: '#F59E0B', sub: 'of 2,200 kcal' },
                  { label: 'Steps', value: '8,432', color: '#3B82F6', sub: 'of 10,000' },
                  { label: 'Hydration', value: '2.1L', color: '#06B6D4', sub: 'of 3L target' },
                ].map(m => (
                  <div key={m.label} className="bg-gray-50 rounded-2xl p-4 text-left">
                    <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                    <p className="text-2xl font-bold" style={{ color: m.color }}>{m.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{m.sub}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6 grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-green-700 mb-2">Today's Meal Plan</p>
                  {['🥣 Overnight Oats — 556 kcal', '🐟 Grilled Hammour + Quinoa — 635 kcal', '🍲 Chicken Kabsa — 399 kcal'].map(m => (
                    <div key={m} className="flex items-center gap-2 py-1.5 border-b border-green-100 last:border-0">
                      <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{m}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">AI Coach</p>
                  <div className="bg-white rounded-xl p-3 text-sm text-gray-700 border border-gray-100">
                    "Great progress this week! You're on track to hit your weight goal by Ramadan. Try adding an extra 500ml of water post-workout in this heat. 🌿"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Everything you need to thrive</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">Built specifically for the UAE market — understanding your culture, your food, and your goals.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="group p-6 rounded-2xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:text-white transition-all">
                  <f.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16">Loved across the UAE</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 card-shadow">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={16} fill="#F59E0B" className="text-amber-400" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Start free, upgrade when ready</h2>
          <p className="text-lg text-gray-500 mb-12">No commitment. Cancel anytime. AED pricing for the UAE market.</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Starter', price: 'Free', features: ['10 AI chats/month', 'Basic tracking', '20 recipes'], color: '#6B7280', cta: 'Get Started' },
              { name: 'Pro', price: 'AED 49/mo', features: ['100 AI chats/month', 'AI meal plans', 'Full recipe library', 'Ramadan planning'], color: '#52a07c', cta: 'Start Pro', highlight: true },
              { name: 'Elite', price: 'AED 99/mo', features: ['Unlimited AI', 'Trainer connection', 'AI progress insights', 'Priority support'], color: '#F59E0B', cta: 'Go Elite' },
            ].map(p => (
              <div key={p.name} className={`rounded-2xl p-6 border-2 text-left transition-all ${p.highlight ? 'border-green-500 bg-green-50 shadow-lg scale-105' : 'border-gray-100'}`}>
                {p.highlight && <div className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full inline-block mb-3">Most Popular</div>}
                <h3 className="text-xl font-bold text-gray-900">{p.name}</h3>
                <p className="text-3xl font-extrabold mt-2 mb-4" style={{ color: p.color }}>{p.price}</p>
                <ul className="space-y-2 mb-6">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle size={14} className="text-green-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={p.highlight ? 'primary' : 'outline'} fullWidth onClick={() => navigate('/register')}>{p.cta}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-green-500 to-green-700">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Start your health journey today</h2>
          <p className="text-green-100 text-lg mb-8">Join thousands of UAE residents eating better and training smarter with FitMind.</p>
          <Button size="lg" className="bg-white text-green-600 hover:bg-green-50" onClick={() => navigate('/register')}>
            Create Your Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg green-gradient flex items-center justify-center">
                <span className="text-white font-bold text-xs">FM</span>
              </div>
              <span className="text-white font-bold">FitMind</span>
            </div>
            <p className="text-sm">Your AI dietitian & fitness coach for the UAE.</p>
          </div>
          <div className="text-sm space-y-1">
            <p className="text-white font-medium mb-2">Legal</p>
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
            <p>Contact Us</p>
          </div>
        </div>
        <p className="text-center text-xs text-gray-600 mt-8">© 2026 FitMind. All rights reserved. Made with 💚 in the UAE.</p>
      </footer>
    </div>
  )
}
