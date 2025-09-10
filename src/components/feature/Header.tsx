
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../base/Button';
import UserProfile from './UserProfile';

interface HeaderProps {
  user: any;
  onLogin: () => void;
  onSignUp: () => void;
  onLogout: () => void;
}

export default function Header({ user, onLogin, onSignUp, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center cursor-pointer"
            >
              <img 
                src="https://static.readdy.ai/image/027456dd04c84b79140ce5de1014e0cc/9dd76f04d92ef56e0c33fcd525d6ab7b.png" 
                alt="RinkRadar Logo" 
                className="h-8 w-auto mr-2"
              />
              <span className="text-xl font-bold text-gray-900" style={{ fontFamily: '"Inter", sans-serif' }}>
                RinkRadar
              </span>
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => handleNavigation('/')}
                className={`text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive('/') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation('/explore')}
                className={`text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive('/explore') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Explore
              </button>
              {user && (
                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className={`text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    isActive('/dashboard') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  My Dashboard
                </button>
              )}
              <button
                onClick={() => handleNavigation('/impacts')}
                className={`text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive('/impacts') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Impacts
              </button>
              <button
                onClick={() => handleNavigation('/about')}
                className={`text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive('/about') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                About
              </button>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4 relative z-60">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-blue-600"></i>
                    </div>
                    <span className="hidden md:block">{user.email}</span>
                    <i className="ri-arrow-down-s-line"></i>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-70">
                      <button
                        onClick={() => {
                          setShowProfile(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <i className="ri-settings-line mr-2"></i>
                        Profile Settings
                      </button>
                      <button
                        onClick={() => {
                          onLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <i className="ri-logout-box-line mr-2"></i>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" onClick={onLogin}>
                    Login
                  </Button>
                  <Button size="sm" onClick={onSignUp}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <UserProfile 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />
    </>
  );
}
