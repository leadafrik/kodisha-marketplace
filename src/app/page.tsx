'use client';

import { FC } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Zap, Lock, TrendingUp } from 'lucide-react';

const HomePage: FC = () => {
  const categories = [
    {
      name: 'Stays',
      icon: '🏠',
      description: 'Short-term or long-term accommodations',
      href: '/browse/stays',
      color: 'from-blue-500 to-blue-600',
      items: ['Short-term', 'Long-term', 'Serviced', 'Vacation'],
    },
    {
      name: 'Spaces',
      icon: '🏢',
      description: 'Venues, offices, and meeting spaces',
      href: '/browse/spaces',
      color: 'from-purple-500 to-purple-600',
      items: ['Venues', 'Meetings', 'Studios', 'Coworking'],
    },
    {
      name: 'Sports',
      icon: '⚽',
      description: 'Fields, courts, and sports equipment',
      href: '/browse/sports',
      color: 'from-orange-500 to-orange-600',
      items: ['Fields', 'Courts', 'Gyms', 'Training'],
    },
    {
      name: 'Equipment',
      icon: '📷',
      description: 'Cameras, audio, tools, and more',
      href: '/browse/equipment',
      color: 'from-green-500 to-green-600',
      items: ['Cameras', 'Audio', 'Tools', 'Vehicles'],
    },
  ];

  const features = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Verified Hosts',
      description: 'Progressive verification system ensures trustworthy listings',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Across Kenya',
      description: 'Available in all 47 counties with full location coverage',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Easy Messaging',
      description: 'Real-time chat with hosts before booking',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Best Prices',
      description: 'Competitive rates and transparent pricing',
    },
  ];

  const stats = [
    { number: '47', label: 'Counties' },
    { number: '1000+', label: 'Active Listings' },
    { number: '500+', label: 'Happy Users' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 mb-12">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              🎉 Welcome to Kodisha - Kenya's #1 Rental Marketplace
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
              Everything You Want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Rent</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From cozy stays to sports equipment, explore thousands of listings across Kenya. Connect with trusted hosts in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/browse"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Start Browsing
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/listing/create"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all"
              >
                List Your Item
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">{stat.number}</div>
                <div className="text-gray-600 font-medium mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-600">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="group"
              >
                <div className="relative h-72 rounded-2xl overflow-hidden cursor-pointer transform transition-all hover:-translate-y-2">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-100 transition-opacity`} />

                  {/* Pattern Overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-10 -mt-10" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-8 -mb-8" />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-6 text-white">
                    <div>
                      <div className="text-6xl mb-4">{cat.icon}</div>
                      <h3 className="text-2xl font-bold">{cat.name}</h3>
                      <p className="text-white/80 text-sm mt-2">{cat.description}</p>
                    </div>

                    <div className="space-y-2">
                      {cat.items.map((item, i) => (
                        <div key={i} className="text-sm text-white/70">• {item}</div>
                      ))}
                      <div className="pt-4 flex items-center text-white font-semibold group-hover:gap-3 transition-all gap-2">
                        Browse <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Kodisha?</h2>
            <p className="text-xl text-gray-600">The most trusted marketplace in Kenya</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '1',
                title: 'Browse',
                description: 'Search through thousands of listings across all 47 counties',
              },
              {
                number: '2',
                title: 'Message',
                description: 'Chat with hosts in real-time to confirm details and negotiate',
              },
              {
                number: '3',
                title: 'Rent',
                description: 'Complete the booking and enjoy your rental hassle-free',
              },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-2xl rounded-full flex items-center justify-center mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>

                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 -right-8 text-gray-300">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of Kenyans renting and booking across the country</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all"
            >
              Create Account
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white font-bold rounded-lg border-2 border-white hover:bg-blue-800 transition-all"
            >
              Browse Now
            </Link>
          </div>
        </div>
      </section>

      {/* Add animation keyframes */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
