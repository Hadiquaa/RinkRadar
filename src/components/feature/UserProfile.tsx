import { useState, useEffect } from 'react';
import Modal from '../base/Modal';
import Input from '../base/Input';
import Button from '../base/Button';
import { useSupabaseData } from '../../hooks/useSupabaseData';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { userProfile, upsertUserProfile } = useSupabaseData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    location_city: '',
    location_province: 'Ontario',
    preferred_units: 'celsius',
    email_updates: true,
    temperature_alerts: false
  });

  const provinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 
    'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec',
    'Saskatchewan', 'Yukon'
  ];

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        location_city: userProfile.location_city || '',
        location_province: userProfile.location_province || 'Ontario',
        preferred_units: userProfile.preferred_units || 'celsius',
        email_updates: userProfile.notification_preferences?.email_updates ?? true,
        temperature_alerts: userProfile.notification_preferences?.temperature_alerts ?? false
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await upsertUserProfile({
        full_name: formData.full_name,
        location_city: formData.location_city,
        location_province: formData.location_province,
        preferred_units: formData.preferred_units,
        notification_preferences: {
          email_updates: formData.email_updates,
          temperature_alerts: formData.temperature_alerts
        }
      });
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Profile" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={formData.full_name}
            onChange={(value) => setFormData({...formData, full_name: value})}
            placeholder="Enter your full name"
          />
          <Input
            label="City"
            value={formData.location_city}
            onChange={(value) => setFormData({...formData, location_city: value})}
            placeholder="Your city"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province
            </label>
            <select
              value={formData.location_province}
              onChange={(e) => setFormData({...formData, location_province: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-8"
            >
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature Units
            </label>
            <select
              value={formData.preferred_units}
              onChange={(e) => setFormData({...formData, preferred_units: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-8"
            >
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.email_updates}
                onChange={(e) => setFormData({...formData, email_updates: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Receive email updates about new features and community news
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.temperature_alerts}
                onChange={(e) => setFormData({...formData, temperature_alerts: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Get alerts when temperatures change significantly at your rinks
              </span>
            </label>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}