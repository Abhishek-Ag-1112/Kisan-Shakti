// src/pages/CropHealthPage.tsx

import React, { useState, useEffect } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, Loader, FileText, Leaf } from 'lucide-react';
import { db, auth } from '../services/firebase';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { analyzeCropImage } from '../services/aiService';

interface CropHealthReport {
  id: string;
  cropType: string;
  symptoms: string;
  disease: string;
  severity: string;
  treatment: string[];
  prevention: string[];
  createdAt: any;
}

const CropHealthPage: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [cropType, setCropType] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [reports, setReports] = useState<CropHealthReport[]>([]);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<{
    disease: string;
    severity: string;
    treatment: string[];
    prevention: string[];
  } | null>(null);

  // Load reports from Firebase
  useEffect(() => {
    const fetchReports = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, 'cropHealth'),
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const fetchedReports: CropHealthReport[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CropHealthReport[];

      setReports(fetchedReports);
    };

    fetchReports();
  }, []);

  const handleAnalyze = async () => {
    if (!cropType || !symptoms) {
      alert('Please fill in crop type and symptoms');
      return;
    }

    setAnalyzing(true);
    try {
      // Call AI service
      const result = await analyzeCropImage(symptoms, cropType);
      setCurrentDiagnosis(result);

      // Save to Firebase
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'cropHealth'), {
          uid: user.uid,
          cropType,
          symptoms,
          disease: result.disease,
          severity: result.severity,
          treatment: result.treatment,
          prevention: result.prevention,
          createdAt: new Date()
        });

        // Refresh reports
        const q = query(
          collection(db, 'cropHealth'),
          where('uid', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedReports: CropHealthReport[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CropHealthReport[];
        setReports(fetchedReports);
      }

      // Reset form
      setCropType('');
      setSymptoms('');
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze crop. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'mild':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'moderate':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'severe':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'mild':
        return <CheckCircle className="w-5 h-5" />;
      case 'moderate':
        return <AlertTriangle className="w-5 h-5" />;
      case 'severe':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-2">
          <Leaf className="w-8 h-8 text-green-600" />
          <h1 className="section-title mb-0">AI Crop Doctor</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Get instant AI-powered disease diagnosis and treatment recommendations
        </p>
      </div>

      {/* Input Section */}
      <div className="card p-6">
        <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4">
          Describe Your Crop Issue
        </h2>

        <div className="space-y-4">
          <div>
            <label className="label">Crop Type *</label>
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="input"
            >
              <option value="">Select crop</option>
              <option value="Wheat">Wheat</option>
              <option value="Rice">Rice</option>
              <option value="Cotton">Cotton</option>
              <option value="Tomato">Tomato</option>
              <option value="Potato">Potato</option>
              <option value="Corn">Corn</option>
              <option value="Soybean">Soybean</option>
              <option value="Sugarcane">Sugarcane</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="label">Symptoms Description *</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe what you see: leaf color changes, spots, wilting, holes, etc. Be as detailed as possible."
              className="input min-h-32"
              rows={4}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Example: "Yellow spots on leaves, brown edges, leaves curling downward, white powdery substance on stems"
            </p>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing || !cropType || !symptoms}
            className="btn-primary w-full"
          >
            {analyzing ? (
              <>
                <Loader className="w-5 h-5 mr-2 inline animate-spin" />
                AI is analyzing...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5 mr-2 inline" />
                Diagnose with AI
              </>
            )}
          </button>
        </div>

        <div className="alert-info mt-4">
          <AlertTriangle className="w-5 h-5" />
          <div>
            <p className="font-bold">Expert Consultation</p>
            <p className="text-sm">
              For severe cases, consult with agricultural experts at your nearest Krishi Vigyan Kendra
            </p>
          </div>
        </div>
      </div>

      {/* Current Diagnosis */}
      {currentDiagnosis && (
        <div className="card p-6 border-2 border-green-600">
          <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            AI Diagnosis Complete
          </h2>

          {/* Disease Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                Detected Disease
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 ${getSeverityColor(currentDiagnosis.severity)}`}>
                {getSeverityIcon(currentDiagnosis.severity)}
                {currentDiagnosis.severity}
              </span>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {currentDiagnosis.disease}
            </p>
          </div>

          {/* Treatment */}
          <div className="mb-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Treatment Steps
            </h3>
            <div className="space-y-2">
              {currentDiagnosis.treatment.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                >
                  <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 flex-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Prevention */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Prevention Measures
            </h3>
            <div className="space-y-2">
              {currentDiagnosis.prevention.map((measure, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 dark:text-gray-300 flex-1">
                    {measure}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Previous Diagnoses */}
      <div className="card p-6">
        <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4">
          Previous Diagnoses
        </h2>
        <div className="space-y-3">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={report.id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {report.cropType} - {report.disease}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {report.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getSeverityColor(report.severity)}`}>
                    {getSeverityIcon(report.severity)}
                    {report.severity}
                  </span>
                </div>
                <details className="text-sm">
                  <summary className="cursor-pointer text-green-600 font-medium mb-2">
                    View Details
                  </summary>
                  <div className="space-y-2 mt-2">
                    <div>
                      <strong className="text-gray-900 dark:text-gray-100">Symptoms:</strong>
                      <p className="text-gray-700 dark:text-gray-300">{report.symptoms}</p>
                    </div>
                    <div>
                      <strong className="text-gray-900 dark:text-gray-100">Treatment:</strong>
                      <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                        {report.treatment.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </details>
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-gray-600 dark:text-gray-400">
              No diagnoses yet. Describe your crop issue above to get AI-powered help!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropHealthPage;