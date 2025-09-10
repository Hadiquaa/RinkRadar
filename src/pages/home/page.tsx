
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import AuthModal from '../../components/feature/AuthModal';
import Button from '../../components/base/Button';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';

export default function Home() {
  const { user, signIn, signUp, signOut } = useSupabaseAuth();
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'login'
  });

  const handleAuthSubmit = async (email: string, password: string) => {
    if (authModal.mode === 'login') {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        user={user}
        onLogin={() => setAuthModal({ isOpen: true, mode: 'login' })}
        onSignUp={() => setAuthModal({ isOpen: true, mode: 'signup' })}
        onLogout={signOut}
      />

      {/* Hero Section */}
      <section 
        className="relative h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Stunning%20panoramic%20view%20of%20Canadian%20winter%20landscape%20with%20multiple%20frozen%20lakes%20and%20ice%20skating%20rinks%20scattered%20across%20snowy%20terrain%2C%20aerial%20perspective%20showing%20vast%20wilderness%2C%20snow%20covered%20forests%2C%20pristine%20white%20snow%2C%20clear%20blue%20winter%20sky%2C%20natural%20ice%20formations%2C%20environmental%20research%20setting%2C%20climate%20monitoring%20landscape&width=1920&height=1080&seq=hero1&orientation=landscape')`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Monitor Canada's Ice Rinks
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Track temperature changes, contribute to climate research, and help preserve our winter heritage across the Great White North.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/map">
                <Button size="lg" className="px-8 py-4 text-lg">
                  <i className="ri-map-pin-line mr-2"></i>
                  Explore Rinks
                </Button>
              </Link>
              {user ? (
                <Link to="/dashboard">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-white/10 border-white text-white hover:bg-white hover:text-gray-900">
                    <i className="ri-dashboard-line mr-2"></i>
                    My Dashboard
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-4 text-lg bg-white/10 border-white text-white hover:bg-white hover:text-gray-900"
                  onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
                >
                  <i className="ri-user-add-line mr-2"></i>
                  Join Community
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Advancing Climate Research Through Community
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every temperature reading and photo you contribute helps scientists understand the impact of climate change on Canada's winter recreation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-thermometer-line text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Temperature Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Record accurate temperature readings to help researchers monitor climate patterns and predict optimal skating conditions.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-camera-line text-2xl text-green-600"></i>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Visual Documentation</h3>
              <p className="text-gray-600 leading-relaxed">
                Capture photos showing ice conditions, thickness, and quality to create a comprehensive visual database for research.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-map-2-line text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Explore Rinksping</h3>
              <p className="text-gray-600 leading-relaxed">
                Explore an interactive map of ice rinks across Canada, with real-time conditions and historical data visualization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Making a Real Impact
            </h2>
            <p className="text-xl opacity-90">
              Our community is actively contributing to important climate research
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">9,847</div>
              <div className="text-lg opacity-80">Temperature Records</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1837</div>
              <div className="text-lg opacity-80">Active Rinks</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">9</div>
              <div className="text-lg opacity-80">Provinces Covered</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1132</div>
              <div className="text-lg opacity-80">Community Contributors</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of Canadians helping preserve our winter traditions and advance climate science.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="px-8 py-4 text-lg">
                  <i className="ri-add-line mr-2"></i>
                  Add Your First Rink
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg"
                onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
              >
                <i className="ri-user-add-line mr-2"></i>
                Get Started Today
              </Button>
            )}
            <Link to="/about">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer user={user} />

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        mode={authModal.mode}
        onSubmit={handleAuthSubmit}
      />
    </div>
  );
}
