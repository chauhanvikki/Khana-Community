import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Camera, Trash2, Upload, X, Check } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function ProfileImageUpload({ currentImage, onUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  // Helper to get full image URL
  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('blob:') || path.startsWith('data:')) return path;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreview(url);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const form = new FormData();
      form.append('image', file);
      
      const res = await axios.post(`${API_BASE_URL}/api/uploads/me/avatar`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      onUploaded?.(res.data.profileImage);
      setFile(null);
      setPreview(null);
      setShowModal(false);
    } catch (e) {
      setError(e.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Remove profile image?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/uploads/me/avatar`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUploaded?.('');
      setShowModal(false);
    } catch (e) {
      setError('Failed to remove image');
    } finally {
      setLoading(false);
    }
  };

  const displayImage = preview || currentImage;

  return (
    <div className="relative">
      {/* Mini Profile Trigger */}
      <button 
        onClick={() => setShowModal(true)}
        className="group relative w-12 h-12 rounded-full overflow-hidden border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        {currentImage ? (
          <img src={getFullImageUrl(currentImage)} alt="profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-400">
            <Camera size={20} />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera size={16} className="text-white" />
        </div>
      </button>

      {/* Modal Backdrop */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Profile Photo</h3>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white">
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="flex flex-col items-center">
                {/* Large Preview */}
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-orange-100 shadow-xl mb-8 group">
                  {displayImage ? (
                    <img src={getFullImageUrl(displayImage)} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                      <Camera size={64} />
                    </div>
                  )}
                  {loading && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap justify-center gap-4 w-full">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={onFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  
                  {!preview ? (
                    <>
                      <button 
                        onClick={() => fileInputRef.current.click()}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-md"
                      >
                        <Upload size={18} />
                        Change Photo
                      </button>
                      
                      {currentImage && (
                        <button 
                          onClick={handleDelete}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={handleUpload}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-md"
                      >
                        <Check size={18} />
                        Save Changes
                      </button>
                      <button 
                        onClick={() => { setPreview(null); setFile(null); }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>

                {error && (
                  <p className="mt-4 text-red-500 text-sm font-semibold flex items-center gap-1">
                    <X size={14} /> {error}
                  </p>
                )}
              </div>
            </div>

            {/* Footer Tip */}
            <div className="px-8 py-4 bg-orange-50 text-orange-600 text-xs text-center font-medium">
              Images help volunteers and donors recognize each other.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
