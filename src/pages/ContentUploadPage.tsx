import React from 'react';
import { useQuery } from '@tanstack/react-query';
import FileUploader from '../components/FileUploader';
import FileList from '../components/FileList';
import { fetchAllFiles } from '../api/fileApi';

const CourseUploadPage: React.FC = () => {
  // Fetch data using React Query
  const { 
    data: uploadedFiles = [], 
    isLoading, 
    isError,
    refetch
  } = useQuery({
    queryKey: ['courseFiles'],
    queryFn: fetchAllFiles,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Course Content Management</h1>
          <p className="mt-2 text-sm text-gray-500">
            Securely upload and manage instructional materials. Supported formats: PDF, MP4, JPG, PNG.
          </p>
        </div>

        {/* Upload Component */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload New Material</h2>
          <FileUploader />
        </div>

        {/* Uploaded Files List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Uploaded Content</h2>
            <button 
              onClick={() => refetch()} 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Refresh List
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-12 space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-500">Loading course materials...</span>
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-red-600 bg-red-50 rounded-lg border border-red-200">
              Failed to load course materials. Ensure the server is running.
            </div>
          ) : (
            <FileList files={uploadedFiles} />
          )}
        </div>

      </div>
    </div>
  );
};

export default CourseUploadPage;