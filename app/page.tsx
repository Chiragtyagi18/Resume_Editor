// app/(main)/page.tsx
'use client';

import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ResumeCanvas } from '@/components/ResumeCanvas';
import { EditingPanel } from '@/components/EditingPanel';
import { useResume } from '@/hooks/useResume';
import {
  Download,
  Upload,
  Eye,
  EyeOff,
  Palette,
  Layout
} from 'lucide-react';

export default function ResumeEditorPage() {
  const {
    resume,
    isLoading,
    parseError,
    parseResumeFile,
    updatePersonalInfo,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    updateSkill,
    removeSkill,
    downloadResume,
    resetResume
  } = useResume();

  const [currentStep, setCurrentStep] = useState<'upload' | 'edit'>('upload');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showEditPanel, setShowEditPanel] = useState(true);

  const handleFileUpload = async (file: File) => {
    try {
      await parseResumeFile(file);
      setCurrentStep('edit');
    } catch (error) {
      console.error('Failed to parse resume:', error);
    }
  };

  const handleStartFromScratch = () => {
    resetResume();
    setCurrentStep('edit');
  };

  const handleNewResume = () => {
    resetResume();
    setCurrentStep('upload');
  };

  if (currentStep === 'upload') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Palette className="h-8 w-8 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-900">Resume Canvas</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Create and edit your resume with a visual canvas interface. Upload your existing resume or start fresh.
              </p>
            </div>

            {/* Upload Options */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <div className="text-center mb-6">
                  <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Upload Resume</h2>
                  <p className="text-gray-600">Upload your PDF or DOCX resume for visual editing</p>
                </div>
                <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
                {parseError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {parseError}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <div className="text-center mb-6">
                  <Layout className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Start Fresh</h2>
                  <p className="text-gray-600">Create your resume from scratch with our visual editor</p>
                </div>
                <button
                  onClick={handleStartFromScratch}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                >
                  Create New Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Resume Canvas</h1>
              {resume.personalInfo.name && (
                <span className="text-gray-500">- {resume.personalInfo.name}</span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowEditPanel(!showEditPanel)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {showEditPanel ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{showEditPanel ? 'Hide Panel' : 'Show Panel'}</span>
              </button>
              <button
                onClick={downloadResume}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button
                onClick={handleNewResume}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>New</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas Interface */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Resume Canvas */}
        <div className={`${showEditPanel ? 'flex-1' : 'w-full'} bg-gray-200 p-6 overflow-auto`}>
          <ResumeCanvas
            resume={resume}
            selectedSection={selectedSection}
            onSectionSelect={setSelectedSection}
            onUpdatePersonalInfo={updatePersonalInfo}
            onUpdateSummary={updateSummary}
            onUpdateExperience={updateExperience}
            onUpdateEducation={updateEducation}
            onUpdateSkill={updateSkill}
          />
        </div>

        {/* Editing Panel */}
        {showEditPanel && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-auto">
            <EditingPanel
              resume={resume}
              selectedSection={selectedSection}
              onSectionSelect={setSelectedSection}
              onUpdatePersonalInfo={updatePersonalInfo}
              onUpdateSummary={updateSummary}
              onAddExperience={addExperience}
              onUpdateExperience={updateExperience}
              onRemoveExperience={removeExperience}
              onAddEducation={addEducation}
              onUpdateEducation={updateEducation}
              onRemoveEducation={removeEducation}
              onAddSkill={addSkill}
              onUpdateSkill={updateSkill}
              onRemoveSkill={removeSkill}
            />
          </div>
        )}
      </div>
    </div>
  );
}
