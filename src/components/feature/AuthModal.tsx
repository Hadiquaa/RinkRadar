
import { useState } from 'react';
import Modal from '../base/Modal';
import Input from '../base/Input';
import Button from '../base/Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onSubmit: (email: string, password: string) => Promise<void>;
}

export default function AuthModal({ isOpen, onClose, mode, onSubmit }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmailSent, setShowEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(email, password);
      
      if (mode === 'signup') {
        setShowEmailSent(true);
        setEmail('');
        setPassword('');
      } else {
        setEmail('');
        setPassword('');
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowEmailSent(false);
    setEmail('');
    setPassword('');
    setError('');
    onClose();
  };

  // Show email verification message after successful signup
  if (showEmailSent && mode === 'signup') {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Check Your Email"
        size="sm"
      >
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-mail-check-line text-2xl text-green-600"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Verification Email Sent!
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700">
              <i className="ri-information-line mr-2"></i>
              Don't forget to check your spam folder if you don't see the email within a few minutes.
            </p>
          </div>
          <Button onClick={handleClose} className="w-full">
            Got it, thanks!
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'login' ? 'Login to RinkRadar' : 'Sign Up for RinkRadar'}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Enter your email"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          required
        />

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
