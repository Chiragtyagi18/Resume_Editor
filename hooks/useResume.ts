'use client';
import { useState, useCallback } from 'react';
import { Resume, PersonalInfo, Experience, Education, Skill } from '../types/resume';
// import { ResumeParser } from '../services/resumeParser.client';
const getResumeParser = async () =>
  (await import('../services/resumeParser.client')).ResumeParser;


const createEmptyResume = (): Resume => ({
  personalInfo: {
    id: '1',
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: ''
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export const useResume = () => {
  const [resume, setResume] = useState<Resume>(createEmptyResume());
  const [isLoading, setIsLoading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const parseResumeFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setParseError(null);
    
    try {
      const ResumeParser = await getResumeParser();
      const parsedResume = await ResumeParser.parseFile(file);
      setResume(parsedResume);
      return parsedResume;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse resume';
      setParseError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePersonalInfo = useCallback((personalInfo: PersonalInfo) => {
    setResume(prev => ({
      ...prev,
      personalInfo,
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const updateSummary = useCallback((summary: string) => {
    setResume(prev => ({
      ...prev,
      summary,
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const addExperience = useCallback((experience: Experience) => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, experience],
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const updateExperience = useCallback((id: string, updates: Partial<Experience>) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, ...updates } : exp
      ),
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const addEducation = useCallback((education: Education) => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, education],
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const updateEducation = useCallback((id: string, updates: Partial<Education>) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, ...updates } : edu
      ),
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const addSkill = useCallback((skill: Skill) => {
    setResume(prev => ({
      ...prev,
      skills: [...prev.skills, skill],
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const updateSkill = useCallback((id: string, updates: Partial<Skill>) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.id === id ? { ...skill, ...updates } : skill
      ),
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id),
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const downloadResume = useCallback(() => {
    const dataStr = JSON.stringify(resume, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `resume_${resume.personalInfo.name.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [resume]);

  const resetResume = useCallback(() => {
    setResume(createEmptyResume());
    setParseError(null);
  }, []);

  return {
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
  };
};