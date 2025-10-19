
import React, { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import WorksheetDisplay from './components/WorksheetDisplay';
import Loader from './components/Loader';
import { generateWorksheetFromImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [worksheetHtml, setWorksheetHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setWorksheetHtml(null);
      setError(null);
    }
  };

  const handleGenerateClick = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setWorksheetHtml(null);

    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const generatedHtml = await generateWorksheetFromImage(base64, mimeType);
      setWorksheetHtml(generatedHtml);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);
  
  const handleReset = () => {
    setImageFile(null);
    setImageUrl(null);
    setWorksheetHtml(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <LogoIcon />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Kindergarten Worksheet Generator</h1>
          </div>
          <p className="text-md text-slate-600">Transform photos of activities into printable A4 worksheets instantly.</p>
        </header>

        <main className="mt-10">
          {!worksheetHtml && !isLoading && (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <FileUpload onFileChange={handleFileChange} />
              {imageUrl && (
                <div className="mt-6 text-center">
                  <h3 className="text-lg font-semibold text-slate-700 mb-3">Image Preview</h3>
                  <img src={imageUrl} alt="Upload preview" className="max-w-full h-auto max-h-80 mx-auto rounded-lg shadow-md" />
                  <button
                    onClick={handleGenerateClick}
                    disabled={isLoading}
                    className="mt-6 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-102"
                  >
                    Generate Worksheet
                  </button>
                </div>
              )}
            </div>
          )}
          
          {isLoading && <Loader />}
          
          {error && (
            <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg text-center">
              <p><strong>Error:</strong> {error}</p>
              <button onClick={handleReset} className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700">
                Try Again
              </button>
            </div>
          )}

          {worksheetHtml && !isLoading && (
            <div>
              <WorksheetDisplay htmlContent={worksheetHtml} />
              <div className="text-center mt-8">
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700 transition-transform transform hover:scale-102"
                >
                  Create a New Worksheet
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
