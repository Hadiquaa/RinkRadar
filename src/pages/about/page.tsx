
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import AuthModal from '../../components/feature/AuthModal';
import Button from '../../components/base/Button';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';

export default function About() {
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
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About RinkWatch
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Preserving Canada's winter heritage through community-driven climate research and environmental monitoring.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                RinkWatch is dedicated to documenting and preserving Canada's outdoor ice rinks while contributing valuable data to climate change research. Our platform empowers communities across the nation to become citizen scientists, tracking temperature changes and ice conditions that tell the story of our changing climate.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Every temperature reading, every photograph, and every observation shared on RinkWatch contributes to a growing database that helps researchers understand the impact of climate change on Canada's winter recreation and cultural traditions.
              </p>
            </div>
            <div>
              <img
                src="https://readdy.ai/api/search-image?query=Canadian%20research%20team%20collecting%20ice%20temperature%20data%20at%20outdoor%20skating%20rink%20with%20scientific%20equipment%2C%20winter%20research%20scene%2C%20environmental%20scientists%20working%2C%20climate%20monitoring%20activities%2C%20professional%20research%20setting%2C%20cold%20weather%20gear%2C%20data%20collection%20tools&width=600&height=400&seq=mission1&orientation=landscape"
                alt="Climate research team"
                className="w-full h-80 object-cover object-top rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What People Are Saying</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our community's contributions are making a difference in climate research and environmental understanding.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-database-line text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Research Contributions</h3>
              <p className="text-gray-600">
                Our data is being used by universities and research institutions across Canada to study climate change impacts on winter recreation.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-team-line text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Community Building</h3>
              <p className="text-gray-600">
                We're connecting passionate Canadians who care about preserving our winter traditions and understanding climate change.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-bar-chart-box-line text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">Policy Influence</h3>
              <p className="text-gray-600">
                Our comprehensive database is informing municipal planning decisions and climate adaptation strategies across Canada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How RinkWatch Works</h2>
            <p className="text-xl text-gray-600">
              Simple steps to start contributing to climate research
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Sign Up</h3>
              <p className="text-gray-600">
                Create your free account and join our community of citizen scientists.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Add Rinks</h3>
              <p className="text-gray-600">
                Register ice rinks in your area with location details and current conditions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Collect Data</h3>
              <p className="text-gray-600">
                Regularly update temperature readings and upload photos of ice conditions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Make Impact</h3>
              <p className="text-gray-600">
                Your contributions help researchers understand climate change effects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-xl text-gray-600">
              Passionate researchers and developers dedicated to climate action
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold mb-2">Dr. Sarah Chen</h3>
              <p className="text-blue-600 mb-4">Climate Research Lead</p>
              <p className="text-gray-600 text-sm">
                PhD in Environmental Science from UBC, specializing in Arctic climate change and community-based monitoring.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold mb-2">Michael Thompson</h3>
              <p className="text-blue-600 mb-4">Technical Director</p>
              <p className="text-gray-600 text-sm">
                Full-stack developer with 8 years experience building environmental monitoring platforms and citizen science tools.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold mb-2">Emma Dubois</h3>
              <p className="text-blue-600 mb-4">Community Outreach</p>
              <p className="text-gray-600 text-sm">
                Former Parks Canada coordinator with expertise in community engagement and environmental education programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Research Partners</h2>
            <p className="text-xl text-gray-600">
              Collaborating with leading institutions across Canada
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 items-center justify-center">
            <div className="text-center">
              <div className="h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-lg font-semibold text-gray-600">University of Toronto</span>
              </div>
            </div>
            <div className="text-center">
              <div className="h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-lg font-semibold text-gray-600">Environment Canada</span>
              </div>
            </div>
            <div className="text-center">
              <div className="h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-lg font-semibold text-gray-600">McGill University</span>
              </div>
            </div>
            <div className="text-center">
              <div className="h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-lg font-semibold text-gray-600">UBC Climate Lab</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Join the Movement</h2>
          <p className="text-xl mb-8 opacity-90">
            Be part of Canada's largest community-driven climate monitoring initiative. Your local observations make a global difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="px-8 py-4 text-lg bg-white text-blue-900 hover:bg-gray-100">
                  <i className="ri-dashboard-line mr-2"></i>
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg bg-white text-blue-900 hover:bg-gray-100"
                onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
              >
                <i className="ri-user-add-line mr-2"></i>
                Start Contributing
              </Button>
            )}
            <Link to="/map">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg bg-transparent border-white text-white hover:bg-white hover:text-blue-900"
              >
                <i className="ri-map-pin-line mr-2"></i>
                Explore Data
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
