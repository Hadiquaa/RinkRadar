
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import AuthModal from '../../components/feature/AuthModal';
import Button from '../../components/base/Button';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';

export default function Impacts() {
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
        className="relative py-20 bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.8), rgba(29, 78, 216, 0.9)), url('https://readdy.ai/api/search-image?query=Scientific%20research%20data%20visualization%20showing%20climate%20change%20impact%20on%20frozen%20lakes%20and%20ice%20formations%2C%20environmental%20monitoring%20equipment%2C%20temperature%20sensors%2C%20research%20charts%20and%20graphs%2C%20professional%20scientific%20setting%20with%20blue%20and%20white%20color%20scheme%2C%20modern%20laboratory%20atmosphere%2C%20climate%20data%20analysis&width=1920&height=600&seq=impacts-hero&orientation=landscape')`
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Climate Impact Analysis</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-4xl mx-auto leading-relaxed">
            Based on cutting‑edge research published in The Canadian Geographer, discover how climate change is transforming Canada&apos;s outdoor skating culture
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-blue-900 hover:text-white border border-blue-600"
            >
              <i className="ri-download-line mr-2"></i>
              Download Research
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg bg-transparent border-white text-white hover:bg-white hover:text-blue-900"
            >
              <i className="ri-bar-chart-line mr-2"></i>
              View Data
            </Button>
          </div>
        </div>
      </section>

      {/* Breaking Research Findings */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <i className="ri-fire-line mr-2"></i>
              BREAKING RESEARCH
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The Disappearing Winter: New Scientific Evidence
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Groundbreaking research published in The Canadian Geographer reveals the dramatic acceleration of climate impacts on Canada&apos;s outdoor skating traditions
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-alert-line text-red-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Critical Temperature Threshold</h3>
                    <p className="text-gray-700 mb-3">
                      Research shows that sustained temperatures above -5°C for more than 3 consecutive days completely destroy skating ice quality.
                    </p>
                    <div className="text-sm text-red-600 bg-red-50 rounded p-2">
                      <strong>Impact:</strong> Southern Ontario now experiences 15+ such warming events per winter, up from 3‑5 in the 1980s.
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-time-line text-orange-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Seasonal Compression</h3>
                    <p className="text-gray-700 mb-3">
                      The &quot;skating window&quot; - reliable ice conditions lasting 4+ weeks - has shrunk by 40% across Canada since 1950.
                    </p>
                    <div className="text-sm text-orange-600 bg-orange-50 rounded p-2">
                      <strong>Projection:</strong> By 2050, only northern territories will maintain traditional 12+ week seasons.
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-funds-line text-yellow-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Economic Devastation</h3>
                    <p className="text-gray-700 mb-3">
                      Winter tourism dependent on natural ice generates $2.7 billion annually — 78% of this revenue faces severe risk by 2040.
                    </p>
                    <div className="text-sm text-yellow-600 bg-yellow-50 rounded p-2">
                      <strong>Reality:</strong> Rural communities are already losing winter festivals and hockey tournaments.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://readdy.ai/api/search-image?query=Environmental%20scientists%20analyzing%20climate%20data%20charts%20and%20graphs%20in%20modern%20research%20laboratory%2C%20computer%20screens%20showing%20temperature%20trends%2C%20scientific%20equipment%2C%20professional%20research%20team%20working%20with%20environmental%20monitoring%20data%2C%20climate%20change%20analysis%2C%20academic%20research%20setting&width=600&height=500&seq=research1&orientation=landscape"
                alt="Climate research analysis"
                className="w-full h-96 object-cover object-top rounded-lg shadow-lg"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center text-sm font-semibold text-gray-800">
                  <i className="ri-book-line mr-2 text-blue-600"></i>
                  Published in The Canadian Geographer
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Data Visualization */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The Science Behind the Crisis
            </h2>
            <p className="text-xl text-gray-600">
              Peer‑reviewed research reveals shocking trends in Canada&apos;s winter climate
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl font-bold mb-2">+3.3°C</div>
              <div className="text-sm opacity-90">Winter warming in northern Canada since 1948</div>
              <div className="mt-3 text-xs bg-white/20 rounded-full px-3 py-1">
                2x global average
              </div>
            </div>

            <div className="text-center bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl font-bold mb-2">-21 days</div>
              <div className="text-sm opacity-90">Average skating season reduction since 1980</div>
              <div className="mt-3 text-xs bg-white/20 rounded-full px-3 py-1">
                Accelerating trend
              </div>
            </div>

            <div className="text-center bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl font-bold mb-2">65km</div>
              <div className="text-sm opacity-90">Northward shift of reliable skating zones per decade</div>
              <div className="mt-3 text-xs bg-white/20 rounded-full px-3 py-1">
                Geographic displacement
              </div>
            </div>

            <div className="text-center bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl font-bold mb-2">40%</div>
              <div className="text-sm opacity-90">Increase in dangerous freeze‑thaw cycles</div>
              <div className="mt-3 text-xs bg-white/20 rounded-full px-3 py-1">
                Safety crisis
              </div>
            </div>
          </div>

          {/* Regional Impact Comparison */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Regional Climate Impact Severity</h3>

            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700">Southern Ontario</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div className="w-16 text-sm font-bold text-red-600">CRITICAL</div>
              </div>

              <div className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700">Great Lakes Region</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="w-16 text-sm font-bold text-orange-600">SEVERE</div>
              </div>

              <div className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700">Prairie Provinces</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-full rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div className="w-16 text-sm font-bold text-yellow-600">HIGH</div>
              </div>

              <div className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700">Atlantic Canada</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full" style={{ width: '55%' }}></div>
                  </div>
                </div>
                <div className="w-16 text-sm font-bold text-blue-600">MODERATE</div>
              </div>

              <div className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700">Northern Territories</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div className="w-16 text-sm font-bold text-green-600">LOW</div>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-600 text-center">
              Impact severity based on temperature trends, season length changes, and ice quality degradation
            </div>
          </div>
        </div>
      </section>

      {/* Data Analysis Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How We Analyze Your Data
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every temperature reading and observation you contribute is processed by our team of environmental scientists using advanced climate modeling techniques.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-blue-600">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-database-line text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Data Collection</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Community‑contributed temperature readings are validated and integrated with Environment Canada weather station data to create comprehensive climate datasets.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Real‑time temperature validation</li>
                <li>• Quality assurance protocols</li>
                <li>• Cross‑reference with official stations</li>
                <li>• Seasonal pattern analysis</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-green-600">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-line-chart-line text-2xl text-green-600"></i>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Climate Modeling</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Advanced statistical models analyze temperature trends, freeze‑thaw cycles, and seasonal variations to project future skating conditions.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Trend analysis algorithms</li>
                <li>• Machine learning predictions</li>
                <li>• Regional climate comparisons</li>
                <li>• Uncertainty quantification</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-purple-600">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <i className="ri-global-line text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Impact Assessment</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Results are integrated into broader climate change research and used to inform policy decisions about winter recreation infrastructure.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Policy recommendations</li>
                <li>• Economic impact studies</li>
                <li>• Cultural preservation strategies</li>
                <li>• Adaptation planning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Current Findings */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Current Research Findings
            </h2>
            <p className="text-xl text-gray-600">
              Key discoveries from analyzing community‑contributed rink data across North America
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="ri-thermometer-line text-red-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Accelerating Warming Trends</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Data shows winter temperatures have increased 2.3°C across monitored rinks since 1980, with southern regions experiencing the most dramatic changes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="ri-calendar-line text-orange-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Shorter Skating Seasons</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        The average skating season has shortened by 12 days per decade, with some regions losing up to 3 weeks of reliable ice conditions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="ri-water-percent-line text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Unpredictable Ice Quality</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Freeze‑thaw cycles have increased 35%, creating dangerous conditions and requiring more frequent ice maintenance and safety monitoring.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <img
                src="https://readdy.ai/api/search-image?query=Environmental%20scientists%20analyzing%20climate%20data%20charts%20and%20graphs%20in%20modern%20research%20laboratory%2C%20computer%20screens%20showing%20temperature%20trends%2C%20scientific%20equipment%2C%20professional%20research%20team%20working%20with%20environmental%20monitoring%20data%2C%20climate%20change%20analysis%2C%20academic%20research%20setting&width=600&height=500&seq=research1&orientation=landscape"
                alt="Climate research analysis"
                className="w-full h-96 object-cover object-top rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Future Projections */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The Future of Ice Rinks in North America
            </h2>
            <p className="text-xl text-gray-600">
              Climate projections based on current data and modeling scenarios
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-300"></div>

            <div className="space-y-12">
              {/* 2030 */}
              <div className="relative flex items-center">
                <div className="flex-1 pr-8 text-right">
                  <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-yellow-500">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">2030 Outlook</h3>
                    <p className="text-gray-600 mb-4">
                      Outdoor skating seasons will be 15‑20% shorter across southern Canada and northern US states.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• 25% of community rinks require artificial cooling</li>
                      <li>• Insurance costs increase due to safety concerns</li>
                      <li>• First major cities lose reliable outdoor hockey</li>
                    </ul>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center z-10">
                  <span className="text-white font-bold text-sm">2030</span>
                </div>
                <div className="flex-1 pl-8"></div>
              </div>

              {/* 2040 */}
              <div className="relative flex items-center">
                <div className="flex-1 pr-8"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center z-10">
                  <span className="text-white font-bold text-sm">2040</span>
                </div>
                <div className="flex-1 pl-8">
                  <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-orange-500">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">2040 Projections</h3>
                    <p className="text-gray-600 mb-4">
                      Reliable outdoor skating limited to regions north of 50°N latitude under current emission trends.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• 60% reduction in natural skating opportunities</li>
                      <li>• Major shift to indoor facilities</li>
                      <li>• Rural communities lose winter tourism revenue</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2050 */}
              <div className="relative flex items-center">
                <div className="flex-1 pr-8 text-right">
                  <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-red-500">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">2050 Scenarios</h3>
                    <p className="text-gray-600 mb-4">
                      Without climate action, outdoor hockey culture may survive only in northern territories and Alaska.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Traditional rinks become historical artifacts</li>
                      <li>• Complete dependence on artificial ice</li>
                      <li>• Cultural traditions fundamentally altered</li>
                    </ul>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center z-10">
                  <span className="text-white font-bold text-sm">2050</span>
                </div>
                <div className="flex-1 pl-8"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Analysis */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Regional Climate Impacts
            </h2>
            <p className="text-xl text-gray-600">
              How climate change affects different regions of North America
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Arctic Regions */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-snowflake-line text-blue-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Arctic Regions</h3>
              <p className="text-gray-600 text-sm mb-3">Northern Canada, Alaska</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Risk Level:</span>
                  <span className="text-green-600 font-medium">Low</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Season Change:</span>
                  <span className="text-gray-900">-5 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">2050 Status:</span>
                  <span className="text-green-600">Stable</span>
                </div>
              </div>
            </div>

            {/* Prairie Provinces */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-sun-line text-yellow-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Prairie Provinces</h3>
              <p className="text-gray-600 text-sm mb-3">Manitoba, Saskatchewan, Alberta</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Risk Level:</span>
                  <span className="text-yellow-600 font-medium">Moderate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Season Change:</span>
                  <span className="text-gray-900">-12 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">2050 Status:</span>
                  <span className="text-yellow-600">Vulnerable</span>
                </div>
              </div>
            </div>

            {/* Great Lakes */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-temp-hot-line text-orange-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Great Lakes</h3>
              <p className="text-gray-600 text-sm mb-3">Ontario, Quebec, Great Lakes states</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Risk Level:</span>
                  <span className="text-red-600 font-medium">High</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Season Change:</span>
                  <span className="text-gray-900">-20 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">2050 Status:</span>
                  <span className="text-red-600">Critical</span>
                </div>
              </div>
            </div>

            {/* Atlantic Canada */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-water-line text-purple-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Atlantic Canada</h3>
              <p className="text-gray-600 text-sm mb-3">Newfoundland, Nova Scotia, PEI, New Brunswick</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Risk Level:</span>
                  <span className="text-indigo-600 font-medium">Moderate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Season Change:</span>
                  <span className="text-gray-900">-10 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">2050 Status:</span>
                  <span className="text-indigo-600">At Risk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions and Hope */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-6">Solutions &amp; Hope</h2>
          <p className="text-center text-gray-700 mb-8">
            Communities, researchers, and policymakers are collaborating on innovative solutions to preserve winter culture.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-2">Community Action</h3>
              <p className="text-gray-600 text-sm">
                Local groups are installing passive solar reflectors and using renewable‑energy‑powered ice chilling systems.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-2">Policy Initiatives</h3>
              <p className="text-gray-600 text-sm">
                Governments are funding climate‑resilient rink infrastructure and incentivising green energy adoption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Your Data Makes a Difference</h2>
          <p className="text-xl mb-8 opacity-90">
            Every temperature reading you contribute helps scientists better understand climate change impacts and develop preservation strategies for Canada&apos;s winter heritage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="px-8 py-4 text-lg bg-white text-blue-900 hover:bg-gray-100">
                  <i className="ri-add-line mr-2"></i>
                  Contribute Data
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                className="px-8 py-4 text-lg bg-white text-blue-900 hover:bg-gray-100"
                onClick={() => setAuthModal({ ...authModal, isOpen: true, mode: 'signup' })}
              >
                <i className="ri-user-add-line mr-2"></i>
                Join Research
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
