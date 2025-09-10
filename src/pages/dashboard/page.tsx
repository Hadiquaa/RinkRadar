
import { useState, useEffect } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import AuthModal from '../../components/feature/AuthModal';
import TemperatureChart from '../../components/feature/TemperatureChart';
import Modal from '../../components/base/Modal';
import Input from '../../components/base/Input';
import Button from '../../components/base/Button';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { useSupabaseData } from '../../hooks/useSupabaseData';

export default function Dashboard() {
  const { user, signIn, signUp, signOut } = useSupabaseAuth();
  const { rinks, addRink, updateRink, addTemperatureReading, loading } = useSupabaseData();
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'login'
  });
  const [addRinkModal, setAddRinkModal] = useState(false);
  const [editRinkModal, setEditRinkModal] = useState<{ isOpen: boolean; rink: any | null }>({
    isOpen: false,
    rink: null
  });
  const [chartModal, setChartModal] = useState<{ isOpen: boolean; rink: any | null }>({
    isOpen: false,
    rink: null
  });

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    province: 'Ontario',
    temperature: '',
    notes: ''
  });

  const provinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
    'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec',
    'Saskatchewan', 'Yukon'
  ];

  const userRinks = rinks.filter(rink => rink.user_id === user?.id);

  const handleAuthSubmit = async (email: string, password: string) => {
    if (authModal.mode === 'login') {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      province: 'Ontario',
      temperature: '',
      notes: ''
    });
  };

  const handleAddRink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addRink({
        name: formData.name,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        latitude: 45.4215 + Math.random() * 10,
        longitude: -75.6972 + Math.random() * 10,
        current_temperature: parseInt(formData.temperature),
        photos: []
      });

      setAddRinkModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding rink:', error);
    }
  };

  const handleEditRink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editRinkModal.rink) return;

    try {
      await updateRink(editRinkModal.rink.id, {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        province: formData.province
      });

      // Add new temperature reading
      await addTemperatureReading(
        editRinkModal.rink.id,
        parseInt(formData.temperature),
        formData.notes
      );

      setEditRinkModal({ isOpen: false, rink: null });
      resetForm();
    } catch (error) {
      console.error('Error updating rink:', error);
    }
  };

  const openEditModal = (rink: any) => {
    setFormData({
      name: rink.name,
      address: rink.address,
      city: rink.city,
      province: rink.province,
      temperature: rink.current_temperature.toString(),
      notes: ''
    });
    setEditRinkModal({ isOpen: true, rink });
  };

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          user={user}
          onLogin={() => setAuthModal({ isOpen: true, mode: 'login' })}
          onSignUp={() => setAuthModal({ isOpen: true, mode: 'signup' })}
          onLogout={signOut}
        />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-white rounded-lg shadow-md p-12">
            <i className="ri-lock-line text-6xl text-gray-300 mb-6"></i>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Required</h1>
            <p className="text-lg text-gray-600 mb-8">
              Please log in to access your dashboard and manage your rinks.
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}>
                Login
              </Button>
              <Button 
                variant="outline"
                onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>

        <Footer />

        <AuthModal
          isOpen={authModal.isOpen}
          onClose={() => setAuthModal({ ...authModal, isOpen: false })}
          mode={authModal.mode}
          onSubmit={handleAuthSubmit}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          user={user}
          onLogin={() => setAuthModal({ isOpen: true, mode: 'login' })}
          onSignUp={() => setAuthModal({ isOpen: true, mode: 'signup' })}
          onLogout={signOut}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onLogin={() => setAuthModal({ isOpen: true, mode: 'login' })}
        onSignUp={() => setAuthModal({ isOpen: true, mode: 'signup' })}
        onLogout={signOut}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-lg text-gray-600 mt-2">
              Manage your ice rinks and contribute to climate research
            </p>
          </div>
          <Button onClick={() => setAddRinkModal(true)}>
            <i className="ri-add-line mr-2"></i>
            Add New Rink
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-building-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Rinks</p>
                <p className="text-2xl font-bold text-gray-900">{userRinks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-thermometer-line text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Temperature</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userRinks.length > 0 
                    ? Math.round(userRinks.reduce((acc, rink) => acc + rink.current_temperature, 0) / userRinks.length)
                    : 0}°C
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-camera-line text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Photos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userRinks.reduce((acc, rink) => acc + rink.photos.length, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-bar-chart-line text-orange-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Rinks</p>
                <p className="text-2xl font-bold text-gray-900">{userRinks.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rinks Grid */}
        {userRinks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <i className="ri-building-line text-6xl text-gray-300 mb-6"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Rinks Yet</h2>
            <p className="text-lg text-gray-600 mb-8">
              Start contributing to climate research by adding your first ice rink.
            </p>
            <Button onClick={() => setAddRinkModal(true)}>
              <i className="ri-add-line mr-2"></i>
              Add Your First Rink
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRinks.map(rink => (
              <div key={rink.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {rink.photos.length > 0 ? (
                  <div className="h-48 bg-gray-200">
                    <img
                      src={rink.photos[0]}
                      alt={rink.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <i className="ri-image-line text-4xl text-gray-300"></i>
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{rink.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {rink.city}, {rink.province}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <i className="ri-thermometer-line text-blue-500 mr-2"></i>
                      <span className={`text-lg font-semibold ${
                        rink.current_temperature < -10 ? 'text-blue-600' :
                        rink.current_temperature < 0 ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {rink.current_temperature}°C
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(rink.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => openEditModal(rink)}
                      className="flex-1"
                    >
                      <i className="ri-edit-line mr-1"></i>
                      Update
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setChartModal({ isOpen: true, rink })}
                      className="flex-1"
                    >
                      <i className="ri-line-chart-line mr-1"></i>
                      Trends
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Rink Modal */}
      <Modal
        isOpen={addRinkModal}
        onClose={() => {setAddRinkModal(false); resetForm();}}
        title="Add New Rink"
        size="lg"
      >
        <form onSubmit={handleAddRink} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Rink Name"
              value={formData.name}
              onChange={(value) => setFormData({...formData, name: value})}
              placeholder="Enter rink name"
              required
            />
            <Input
              label="Address"
              value={formData.address}
              onChange={(value) => setFormData({...formData, address: value})}
              placeholder="Street address"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="City"
              value={formData.city}
              onChange={(value) => setFormData({...formData, city: value})}
              placeholder="City name"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Province *
              </label>
              <select
                value={formData.province}
                onChange={(e) => setFormData({...formData, province: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-8"
                required
              >
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Current Temperature (°C)"
              type="number"
              value={formData.temperature}
              onChange={(value) => setFormData({...formData, temperature: value})}
              placeholder="-10"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Ice conditions, observations..."
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.notes.length}/500 characters</p>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {setAddRinkModal(false); resetForm();}}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Rink
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Rink Modal */}
      <Modal
        isOpen={editRinkModal.isOpen}
        onClose={() => {setEditRinkModal({ isOpen: false, rink: null }); resetForm();}}
        title="Update Rink"
        size="lg"
      >
        <form onSubmit={handleEditRink} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Rink Name"
              value={formData.name}
              onChange={(value) => setFormData({...formData, name: value})}
              placeholder="Enter rink name"
              required
            />
            <Input
              label="Address"
              value={formData.address}
              onChange={(value) => setFormData({...formData, address: value})}
              placeholder="Street address"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="City"
              value={formData.city}
              onChange={(value) => setFormData({...formData, city: value})}
              placeholder="City name"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Province *
              </label>
              <select
                value={formData.province}
                onChange={(e) => setFormData({...formData, province: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-8"
                required
              >
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Current Temperature (°C)"
              type="number"
              value={formData.temperature}
              onChange={(value) => setFormData({...formData, temperature: value})}
              placeholder="-10"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Update Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Recent changes, new observations..."
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.notes.length}/500 characters</p>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {setEditRinkModal({ isOpen: false, rink: null }); resetForm();}}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update Rink
            </Button>
          </div>
        </form>
      </Modal>

      {/* Temperature Chart Modal */}
      <Modal
        isOpen={chartModal.isOpen}
        onClose={() => setChartModal({ isOpen: false, rink: null })}
        title="Temperature Trends"
        size="xl"
      >
        {chartModal.rink && (
          <TemperatureChart 
            rinkId={chartModal.rink.id} 
            rinkName={chartModal.rink.name}
          />
        )}
      </Modal>

      <Footer />

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        mode={authModal.mode}
        onSubmit={handleAuthSubmit}
      />
    </div>
  );
}
