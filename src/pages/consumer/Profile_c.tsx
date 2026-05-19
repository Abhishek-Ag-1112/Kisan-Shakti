import React, { useState, useEffect } from 'react';
import { User, Edit, LogOut, Shield, MapPin, ShoppingBag, Bell, Trash2, AlertTriangle } from 'lucide-react';
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../services/firebase";
import { onAuthStateChanged, deleteUser } from "firebase/auth";

interface ProfileProps {
    currentUser: any;
    onLogout: () => void;
}

const Profile_c: React.FC<ProfileProps> = ({ currentUser, onLogout }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(currentUser?.name || '');
    const [location, setLocation] = useState(currentUser?.location || '');
    const [profileData, setProfileData] = useState(currentUser);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setProfileData(userData);
                    setName(userData.name);
                    setLocation(userData.location);
                }
            }
        };
        fetchUserData();
    }, [currentUser]);

    const handleUpdate = async () => {
        if (currentUser) {
            const userDocRef = doc(db, "users", currentUser.uid);
            try {
                await updateDoc(userDocRef, { name, location });
                setProfileData({ ...profileData, name, location });
                setIsEditing(false);
                alert('Profile updated successfully!');
            } catch (error) {
                console.error("Error updating profile: ", error);
                alert('Failed to update profile.');
            }
        }
    };
    
    const handleDeleteAccount = async () => {
        const user = auth.currentUser;
        if (user && user.uid === currentUser.uid) {
            try {
                // Delete user data from Firestore
                await deleteDoc(doc(db, "users", user.uid));

                // Delete the user from Firebase Authentication
                await deleteUser(user);
                
                alert('Your account has been permanently deleted.');
                onLogout(); 
            } catch (error) {
                console.error("Error deleting account:", error);
                alert("Failed to delete account. You may need to sign in again to complete this action.");
            }
        } else {
             alert("Could not verify user. Please sign in again.");
        }
        setShowDeleteConfirm(false);
    };


    return (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                {name?.[0]?.toUpperCase() || 'C'}
                            </div>
                            <div className="text-center sm:text-left">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="text-3xl font-bold text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-1"
                                    />
                                ) : (
                                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{name}</h1>
                                )}
                                <p className="text-gray-500 dark:text-gray-400 mt-1">Consumer Account</p>
                            </div>
                            <div className="sm:ml-auto flex items-center gap-2">
                                <button
                                    onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    {isEditing ? 'Save' : 'Edit Profile'}
                                </button>
                                {isEditing && (
                                     <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg">Cancel</button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-100 dark:bg-gray-700/50 p-5 rounded-xl">
                                <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2"><User className="text-blue-500"/> Personal Information</h3>
                                <div className="space-y-3 text-sm">
                                    <p><strong className="text-gray-600 dark:text-gray-300">Email:</strong> {profileData?.email}</p>
                                    {isEditing ? (
                                        <div className="flex items-center gap-2">
                                            <strong className="text-gray-600 dark:text-gray-300">Location:</strong>
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                className="bg-white dark:bg-gray-800 rounded-md px-2 py-1 w-full"
                                            />
                                        </div>
                                    ) : (
                                        <p><strong className="text-gray-600 dark:text-gray-300">Location:</strong> {location || 'Not Set'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-100 dark:bg-gray-700/50 p-5 rounded-xl">
                                <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2"><ShoppingBag className="text-blue-500"/> Activity</h3>
                                <div className="space-y-3 text-sm">
                                    <p><strong className="text-gray-600 dark:text-gray-300">Orders Placed:</strong> 12</p>
                                    <p><strong className="text-gray-600 dark:text-gray-300">Wishlist Items:</strong> 5</p>
                                </div>
                            </div>
                        </div>

                         <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                             <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-100">Account Actions</h3>
                             <div className="flex flex-wrap gap-4">
                                <button onClick={onLogout} className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 px-4 py-2 rounded-lg transition-colors">
                                    <LogOut className="w-5 h-5"/>
                                    <span>Sign Out</span>
                                </button>
                                <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 px-4 py-2 rounded-lg transition-colors">
                                    <Trash2 className="w-5 h-5"/>
                                    <span>Delete Account</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-sm w-full">
                         <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Delete Account</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                            Are you sure you want to delete your account? This action is irreversible and all your data will be permanently lost.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500">
                                Cancel
                            </button>
                            <button onClick={handleDeleteAccount} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile_c;