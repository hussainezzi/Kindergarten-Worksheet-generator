import React, { useState } from 'react';
import { DownloadIcon } from './icons';

interface WorksheetDisplayProps {
  htmlContent: string;
}

// Declare global variables from CDN scripts for TypeScript
declare const html2canvas: any;
declare const jspdf: any;

const WorksheetDisplay: React.FC<WorksheetDisplayProps> = ({ htmlContent }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    const worksheetElement = document.getElementById('printable-worksheet');
    if (!worksheetElement) {
      console.error('Worksheet element not found!');
      return;
    }

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(worksheetElement, {
        scale: 2, // Use higher scale for better resolution
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Use the jspdf global from the script tag
      const pdf = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('worksheet.pdf');

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Sorry, there was an error creating the PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };


  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-end w-full max-w-[800px] mb-4">
        <button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="no-print inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          <DownloadIcon />
          {isDownloading ? 'Downloading...' : 'Download PDF'}
        </button>
      </div>

      <div id="printable-worksheet" className="a4-container bg-white shadow-xl border border-gray-200 p-8">
        <header className="border-b-2 border-gray-300 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">Rawdatul Quran Al Kareem</h1>
          <h2 className="text-xl text-center text-gray-600 mt-1">Kindergarten Senior</h2>
        </header>
        <main dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </div>
  );
};

export default WorksheetDisplay;