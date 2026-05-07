import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFile } from '../api/fileApi';

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const queryClient = useQueryClient();

  const allowedTypes = ['application/pdf', 'video/mp4', 'image/jpeg', 'image/png'];

  // React Query Mutation for the upload
  const uploadMutation = useMutation({
    mutationFn: (selectedFile: File) => uploadFile(selectedFile, setProgress),
    onSuccess: () => {
      // Invalidate the cache to trigger an automatic table refresh
      queryClient.invalidateQueries({ queryKey: ['courseFiles'] });
      
      // Reset UI
      setFile(null);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'An error occurred during upload.');
      setProgress(0);
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload a PDF, MP4, JPG, or PNG.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Optional: Max size validation (e.g., 10MB) before hitting the server
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (file) {
      setError('');
      setProgress(0);
      uploadMutation.mutate(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Area */}
      <div 
        className={`flex justify-center w-full h-36 px-4 transition bg-white border-2 border-dashed rounded-xl appearance-none cursor-pointer focus:outline-none 
          ${file ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
        onClick={() => !uploadMutation.isPending && fileInputRef.current?.click()}
      >
        <span className="flex flex-col items-center justify-center space-y-2">
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 ${file ? 'text-blue-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
          </svg>
          <span className="font-medium text-gray-600">
            {file ? <span className="text-blue-700">{file.name}</span> : 'Click to browse or drop a file here'}
          </span>
        </span>
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.mp4,.jpg,.jpeg,.png"
          disabled={uploadMutation.isPending}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
          {error}
        </div>
      )}

      {/* Progress Bar & Actions */}
      {file && (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="flex justify-between text-sm font-medium text-gray-700">
            <span>{file.name}</span>
            <span>{progress}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => { setFile(null); setProgress(0); setError(''); }}
              disabled={uploadMutation.isPending}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploadMutation.isPending}
              className={`px-4 py-2 text-white font-medium rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${uploadMutation.isPending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              {uploadMutation.isPending ? 'Uploading...' : 'Confirm Upload'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;