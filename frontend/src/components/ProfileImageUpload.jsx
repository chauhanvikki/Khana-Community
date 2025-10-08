import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://khana-community.onrender.com';

export default function ProfileImageUpload({ currentImage, onUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(currentImage || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setError('');
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    }
  };

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      const form = new FormData();
      form.append('image', file);
      const res = await axios.post(`${API_BASE_URL}/api/uploads/me/avatar`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = res.data?.profileImage || '';
      onUploaded?.(url);
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border">
        {preview ? (
          <img src={preview} alt="avatar" className="w-16 h-16 object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input type="file" accept="image/*" onChange={onFileChange} className="text-sm" />
        <button
          disabled={!file || loading}
          onClick={upload}
          className="px-3 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}
