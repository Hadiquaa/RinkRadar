import { Link } from 'react-router-dom';

interface FooterProps {
  user?: any;
}

export default function Footer({ user }: FooterProps) {
  return (
    <footer 
      className="bg-gray-900 text-white relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.85), rgba(17, 24, 39, 0.9)), url('https://readdy.ai/api/search-image?query=Canadian%20outdoor%20ice%20hockey%20rink%20with%20players%20skating%20in%20winter%20evening%20light%2C%20frozen%20pond%20hockey%20game%2C%20natural%20ice%20surface%2C%20snow%20covered%20landscape%2C%20traditional%20Canadian%20winter%20scene%2C%20community%20skating%2C%20hockey%20sticks%20and%20pucks%2C%20warm%20lighting%20from%20rink%20lights%2C%20nostalgic%20winter%20atmosphere&width=1920&height=800&seq=footer-bg&orientation=landscape')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-gray-900/20"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <img
                src="https://static.readdy.ai/image/027456dd04c84b79140ce5de1014e0cc/9dd76f04d92ef56e0c33fcd525d6ab7b.png"
                alt="RinkRadar Logo"
                className="h-8 w-auto mr-2"
              />
              <span className="text-xl font-bold" style={{ fontFamily: '"Inter", sans-serif' }}>
                RinkRadar
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Monitoring Canada's ice rinks and contributing to climate research through community-driven data collection.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <i className="ri-twitter-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <i className="ri-facebook-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <i className="ri-instagram-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <i className="ri-github-line text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Explore Rinks
                </Link>
              </li>
              {user && (
                <li>
                  <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    Dashboard
                  </Link>
                </li>
              )}
              <li>
                <Link to="/impacts" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Climate Impacts
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Research & Data</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://onlinelibrary.wiley.com/doi/full/10.1111/cag.12878" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Climate Reports
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Data Downloads
                </a>
              </li>
              <li>
                <a 
                  href="https://www.rinkwatch.org/documents/rinkwatch_report_2023-2024.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Research Publications
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 RinkRadar. All rights reserved. Contributing to climate research across Canada.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-gray-300 text-sm">Powered by community data</span>
            <div className="flex items-center space-x-2">
              <i className="ri-global-line text-green-400"></i>
              <span className="text-green-400 text-sm font-medium">Climate Action</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
