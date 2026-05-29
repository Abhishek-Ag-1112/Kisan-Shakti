// src/pages/SoilReportPage.tsx - SIMPLIFIED VERSION

import { useState } from 'react';
import { Beaker, Loader, CheckCircle, AlertCircle, FileText, Upload } from 'lucide-react';
import { db, auth } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { analyzeSoilReport } from '../services/aiService';

const SoilReportPage = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [soilData, setSoilData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    pH: undefined as number | undefined,
    organicMatter: undefined as number | undefined
  });
  const [fieldName, setFieldName] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState<{
    analysis: string;
    recommendations: string[];
  } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('soilReport', file);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5174';
      const response = await fetch(`${backendUrl}/api/analyze-soil-report`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to analyze uploaded report');
      }

      const data = await response.json();
      console.log('OCR Soil Report Data:', data);

      // Auto-populate the form based on extracted data
      const newSoilData = { ...soilData };
      
      if (Array.isArray(data.soilData)) {
        data.soilData.forEach((item: any) => {
          const name = item.nutrient.toLowerCase();
          let status = item.status || 'Medium';
          // Ensure standard capitalization
          if (status.toLowerCase().startsWith('l')) status = 'Low';
          else if (status.toLowerCase().startsWith('h')) status = 'High';
          else status = 'Medium';
          
          if (name.includes('nitrogen') || name === 'n') {
            newSoilData.nitrogen = status;
          } else if (name.includes('phosphorus') || name === 'p') {
            newSoilData.phosphorus = status;
          } else if (name.includes('potassium') || name === 'k') {
            newSoilData.potassium = status;
          } else if (name.includes('ph')) {
            newSoilData.pH = typeof item.value === 'number' ? item.value : parseFloat(item.value) || undefined;
          } else if (name.includes('organic') || name.includes('matter')) {
            newSoilData.organicMatter = typeof item.value === 'number' ? item.value : parseFloat(item.value) || undefined;
          }
        });
      }

      setSoilData(newSoilData);

      // Populate recommendations immediately
      if (Array.isArray(data.recommendations)) {
        const mappedRecommendations = data.recommendations.map((rec: any) => 
          typeof rec === 'string' ? rec : `${rec.title}: ${rec.description} (${rec.priority.toUpperCase()} priority)`
        );

        setCurrentAnalysis({
          analysis: "Soil report successfully analyzed via AI OCR document scanning! Below are the parsed nutrient values and recommendations.",
          recommendations: mappedRecommendations
        });
      }

      alert('Soil report analyzed and populated successfully!');
    } catch (error) {
      console.error('OCR Upload error:', error);
      alert('Failed to analyze uploaded file. Make sure the backend server (npm start) is running on port 5174.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!soilData.nitrogen || !soilData.phosphorus || !soilData.potassium) {
      alert('Please fill in at least N, P, K values');
      return;
    }

    setAnalyzing(true);
    try {
      // Call AI service
      const result = await analyzeSoilReport(soilData);
      setCurrentAnalysis(result);

      // Save to Firebase
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'soilReports'), {
          uid: user.uid,
          soilData,
          aiAnalysis: result.analysis,
          aiRecommendations: result.recommendations,
          field: fieldName || 'Unnamed Field',
          createdAt: new Date()
        });
      }

      // Reset form
      setSoilData({
        nitrogen: '',
        phosphorus: '',
        potassium: '',
        pH: undefined,
        organicMatter: undefined
      });
      setFieldName('');
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze soil. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-2">
          <Beaker className="w-8 h-8 text-indigo-600" />
          <h1 className="section-title mb-0">AI Soil Analysis</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Get AI-powered soil analysis and fertilizer recommendations
        </p>
      </div>

      {/* Input Section */}
      <div className="card p-6">
        <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between">
          <span>Soil Assessment & Analytics</span>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full">AI OCR Enabled</span>
        </h2>

        {/* OCR Upload Card */}
        <div className="border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 mb-6 text-center bg-indigo-50/20 dark:bg-indigo-950/10 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300">
          <div className="mx-auto w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
            <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Scan Your Soil Report Document</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
            Drop an image or PDF of your KVK lab report here. Our AI-driven OCR will scan and extract all NPK, pH, and organic nutrients instantly.
          </p>
          <label className={`btn-primary px-6 py-2.5 inline-flex items-center gap-2 cursor-pointer ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
            {uploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Scanning & Analyzing...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Select Lab Report File
              </>
            )}
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        <div className="flex items-center gap-4 my-6">
          <div className="h-[1px] bg-gray-200 dark:bg-gray-700 flex-1"></div>
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Or Fill In Nutrient Values Manually</span>
          <div className="h-[1px] bg-gray-200 dark:bg-gray-700 flex-1"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label">Field Name (Optional)</label>
            <input
              type="text"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="e.g., North Field"
              className="input"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="label">Nitrogen (N) *</label>
            <select
              value={soilData.nitrogen}
              onChange={(e) => setSoilData({ ...soilData, nitrogen: e.target.value })}
              className="input"
            >
              <option value="">Select level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="label">Phosphorus (P) *</label>
            <select
              value={soilData.phosphorus}
              onChange={(e) => setSoilData({ ...soilData, phosphorus: e.target.value })}
              className="input"
            >
              <option value="">Select level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="label">Potassium (K) *</label>
            <select
              value={soilData.potassium}
              onChange={(e) => setSoilData({ ...soilData, potassium: e.target.value })}
              className="input"
            >
              <option value="">Select level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label">pH Level (Optional)</label>
            <input
              type="number"
              step="0.1"
              value={soilData.pH || ''}
              onChange={(e) => setSoilData({ ...soilData, pH: parseFloat(e.target.value) || undefined })}
              placeholder="e.g., 6.5"
              className="input"
            />
          </div>

          <div>
            <label className="label">Organic Matter % (Optional)</label>
            <input
              type="number"
              step="0.1"
              value={soilData.organicMatter || ''}
              onChange={(e) => setSoilData({ ...soilData, organicMatter: parseFloat(e.target.value) || undefined })}
              placeholder="e.g., 2.5"
              className="input"
            />
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={analyzing || !soilData.nitrogen || !soilData.phosphorus || !soilData.potassium}
          className="btn-primary w-full"
        >
          {analyzing ? (
            <>
              <Loader className="w-5 h-5 mr-2 inline animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Beaker className="w-5 h-5 mr-2 inline" />
              Analyze Soil with AI
            </>
          )}
        </button>

        <div className="alert-info mt-4">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-bold">Free Soil Testing</p>
            <p className="text-sm">
              Get your soil tested for free at your nearest Krishi Vigyan Kendra (KVK)
            </p>
          </div>
        </div>
      </div>

      {/* Current Analysis */}
      {currentAnalysis && (
        <div className="card p-6 border-2 border-indigo-600">
          <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            AI Analysis Complete
          </h2>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 mb-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
              Soil Health Assessment
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {currentAnalysis.analysis}
            </p>
          </div>

          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3">
            AI Recommendations
          </h3>
          <div className="space-y-3">
            {currentAnalysis.recommendations.map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
              >
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-gray-700 dark:text-gray-300 flex-1">
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="card p-6">
        <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4">
          About Soil Analysis
        </h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            <FileText className="w-5 h-5 inline mr-2 text-indigo-600" />
            Our AI analyzes your soil test results and provides personalized fertilizer recommendations.
          </p>
          <p>
            Enter your N-P-K values and optional pH and organic matter levels to get started.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SoilReportPage;