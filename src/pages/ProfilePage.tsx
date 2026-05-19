// src/pages/ProfilePage.tsx

import React, { useState } from 'react';
import { User, MapPin, Phone, Mail, Edit, Camera, Save, Sprout, Home } from 'lucide-react';

interface ProfilePageProps {
  currentUser: any;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    location: currentUser?.location || '',
    farmSize: currentUser?.farmerProfile?.farmSize || '',
    cropGrown: currentUser?.farmerProfile?.cropGrown?.join(', ') || ''
  });

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  const stats = [
    { label: 'Schemes Applied', value: '4', icon: Sprout },
    { label: 'Orders Placed', value: '12', icon: Home },
    { label: 'Reports Uploaded', value: '3', icon: Sprout },
    { label: 'Member Since', value: '2024', icon: User }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-8 h-8 text-blue-600" />
          <h1 className="section-title mb-0">My Profile</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account information
        </p>
      </div>

      {/* Profile Card */}
      <div className="card p-6">
        <div className="flex items-start gap-6 mb-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
              {currentUser?.name?.charAt(0) || 'F'}
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-600 text-white rounded-xl flex items-center justify-center hover:bg-green-700 transition-colors">
              <Camera className="w-5 h-5" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {currentUser?.name || 'Farmer Name'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentUser?.userType === 'farmer' ? 'Farmer' : 'Consumer'}
                </p>
              </div>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={isEditing ? 'btn-primary' : 'btn-secondary'}
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2 inline" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2 inline" />
                    Edit
                  </>
                )}
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <stat.icon className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="card p-6">
        <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4">
          Personal Information
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
              />
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100">
                {formData.name}
              </div>
            )}
          </div>

          <div>
            <label className="label">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
              />
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-600" />
                {formData.phone}
              </div>
            )}
          </div>

          <div>
            <label className="label">Email Address</label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
              />
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-600" />
                {formData.email}
              </div>
            )}
          </div>

          <div>
            <label className="label">Location</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="input"
              />
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                {formData.location}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Farm Information */}
      {currentUser?.userType === 'farmer' && (
        <div className="card p-6">
          <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4">
            Farm Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Farm Size (Acres)</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.farmSize}
                  onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                  className="input"
                />
              ) : (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100">
                  {formData.farmSize} acres
                </div>
              )}
            </div>

            <div>
              <label className="label">Crops Grown</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.cropGrown}
                  onChange={(e) => setFormData({ ...formData, cropGrown: e.target.value })}
                  className="input"
                  placeholder="e.g., Wheat, Rice, Cotton"
                />
              ) : (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100">
                  {formData.cropGrown}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Account Settings */}
      <div className="card p-6">
        <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4">
          Account Settings
        </h2>

        <div className="space-y-3">
          <button className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="font-medium text-gray-900 dark:text-gray-100">Change Password</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Update your password</div>
          </button>

          <button className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="font-medium text-gray-900 dark:text-gray-100">Language Preferences</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred language</div>
          </button>

          <button className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="font-medium text-gray-900 dark:text-gray-100">Notification Settings</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Manage your notifications</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;