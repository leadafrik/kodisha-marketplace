'use client';

import { FC } from 'react';
import Link from 'next/link';
import { MapPin, Mail, Phone, Heart, Instagram, Twitter, Linkedin } from 'lucide-react';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded">K</div>
              <span>Kodisha</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Kenya's trusted marketplace for rentals. Connect with hosts and guests across all 47 counties.
            </p>
          </div>

          {/* Browse */}
          <div>
            <h4 className="font-semibold text-white mb-4">Browse</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/browse/stays" className="text-gray-400 hover:text-blue-400 transition">
                  Stays
                </Link>
              </li>
              <li>
                <Link href="/browse/spaces" className="text-gray-400 hover:text-blue-400 transition">
                  Spaces
                </Link>
              </li>
              <li>
                <Link href="/browse/sports" className="text-gray-400 hover:text-blue-400 transition">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="/browse/equipment" className="text-gray-400 hover:text-blue-400 transition">
                  Equipment
                </Link>
              </li>
            </ul>
          </div>

          {/* Host */}
          <div>
            <h4 className="font-semibold text-white mb-4">Host</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/listing/create" className="text-gray-400 hover:text-blue-400 transition">
                  List Your Item
                </Link>
              </li>
              <li>
                <Link href="/host/dashboard" className="text-gray-400 hover:text-blue-400 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-blue-400 transition">
                  Host Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-blue-400 transition">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail size={16} />
                <span>hello@kodisha.co.ke</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone size={16} />
                <span>+254 (0) 700 000 000</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <MapPin size={16} />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 py-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-blue-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition">
                  Cookie Policy
                </Link>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex justify-start md:justify-end gap-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t border-gray-700 text-xs text-gray-500">
          <p>&copy; {currentYear} Kodisha Rentals. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Made with <Heart size={12} className="inline text-red-500" /> in Kenya</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
