'use client';
import React from 'react';
import { Resume, PersonalInfo, Experience, Education, Skill } from '../types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe, Edit3 } from 'lucide-react';

interface ResumeCanvasProps {
  resume: Resume;
  selectedSection: string | null;
  onSectionSelect: (section: string | null) => void;
  onUpdatePersonalInfo: (personalInfo: PersonalInfo) => void;
  onUpdateSummary: (summary: string) => void;
  onUpdateExperience: (id: string, updates: Partial<Experience>) => void;
  onUpdateEducation: (id: string, updates: Partial<Education>) => void;
  onUpdateSkill: (id: string, updates: Partial<Skill>) => void;
}

export const ResumeCanvas: React.FC<ResumeCanvasProps> = ({
  resume,
  selectedSection,
  onSectionSelect,
}) => {
  const handleSectionClick = (section: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSectionSelect(selectedSection === section ? null : section);
  };

  const getSectionClasses = (section: string) => {
    const baseClasses = "relative group cursor-pointer transition-all duration-200 rounded-lg p-4 m-2";
    const selectedClasses = selectedSection === section 
      ? "ring-2 ring-blue-500 bg-blue-50 shadow-md" 
      : "hover:bg-gray-50 hover:shadow-sm";
    return `${baseClasses} ${selectedClasses}`;
  };

  const EditButton = ({ section }: { section: string }) => (
    <button
      onClick={(e) => handleSectionClick(section, e)}
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 z-10"
    >
      <Edit3 className="h-3 w-3" />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Resume Paper */}
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden min-h-[800px]" style={{ aspectRatio: '8.5/11' }}>
        <div className="p-8 h-full">
          {/* Header Section */}
          <div 
            className={getSectionClasses('personal')}
            onClick={(e) => handleSectionClick('personal', e)}
          >
            <EditButton section="personal" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {resume.personalInfo.name || 'Your Name'}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {resume.personalInfo.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{resume.personalInfo.email}</span>
                  </div>
                )}
                {resume.personalInfo.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{resume.personalInfo.phone}</span>
                  </div>
                )}
                {resume.personalInfo.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{resume.personalInfo.location}</span>
                  </div>
                )}
                {resume.personalInfo.linkedin && (
                  <div className="flex items-center space-x-1">
                    <Linkedin className="h-4 w-4" />
                    <span className="truncate max-w-[200px]">{resume.personalInfo.linkedin}</span>
                  </div>
                )}
                {resume.personalInfo.website && (
                  <div className="flex items-center space-x-1">
                    <Globe className="h-4 w-4" />
                    <span className="truncate max-w-[200px]">{resume.personalInfo.website}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div 
            className={getSectionClasses('summary')}
            onClick={(e) => handleSectionClick('summary', e)}
          >
            <EditButton section="summary" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b-2 border-gray-200 pb-2">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {resume.summary || (
                  <span className="text-gray-400 italic">
                    Click to add your professional summary...
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Experience Section */}
          <div 
            className={getSectionClasses('experience')}
            onClick={(e) => handleSectionClick('experience', e)}
          >
            <EditButton section="experience" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                Work Experience
              </h2>
              <div className="space-y-6">
                {resume.experience.length > 0 ? resume.experience.map((exp,) => (
                  <div key={exp.id} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="ml-6 border-l-2 border-blue-200 pl-6 pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{exp.position || 'Position Title'}</h3>
                          <p className="text-blue-600 font-medium text-base">{exp.company || 'Company Name'}</p>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {exp.startDate || 'Start'} - {exp.current ? 'Present' : (exp.endDate || 'End')}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 text-sm mb-3 leading-relaxed">{exp.description}</p>
                      )}
                      {exp.achievements.filter(a => a.trim()).length > 0 && (
                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-2">
                          {exp.achievements.filter(a => a.trim()).map((achievement, idx) => (
                            <li key={idx} className="leading-relaxed">{achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-400 italic text-center py-8">
                    Click to add your work experience...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div 
            className={getSectionClasses('education')}
            onClick={(e) => handleSectionClick('education', e)}
          >
            <EditButton section="education" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                Education
              </h2>
              <div className="space-y-4">
                {resume.education.length > 0 ? resume.education.map((edu) => (
                  <div key={edu.id} className="relative">
                    <div className="absolute left-0 top-2 w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="ml-6 border-l-2 border-green-200 pl-6 pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}
                          </h3>
                          <p className="text-green-600 font-medium">{edu.institution || 'Institution'}</p>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {edu.startDate || 'Start'} - {edu.endDate || 'End'}
                        </span>
                      </div>
                      {edu.gpa && (
                        <p className="text-gray-600 text-sm mb-2">GPA: {edu.gpa}</p>
                      )}
                      {edu.achievements.filter(a => a.trim()).length > 0 && (
                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-2">
                          {edu.achievements.filter(a => a.trim()).map((achievement, index) => (
                            <li key={index} className="leading-relaxed">{achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-400 italic text-center py-8">
                    Click to add your education...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div 
            className={getSectionClasses('skills')}
            onClick={(e) => handleSectionClick('skills', e)}
          >
            <EditButton section="skills" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                Skills
              </h2>
              <div className="space-y-4">
                {resume.skills.length > 0 ? Object.entries(resume.skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = [];
                  acc[skill.category].push(skill);
                  return acc;
                }, {} as Record<string, typeof resume.skills>)).map(([category, skills]) => (
                  <div key={category}>
                    <h3 className="font-medium text-gray-800 text-base mb-3">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => {
                        const levelColors = {
                          'Beginner': 'bg-red-100 text-red-800',
                          'Intermediate': 'bg-yellow-100 text-yellow-800',
                          'Advanced': 'bg-blue-100 text-blue-800',
                          'Expert': 'bg-green-100 text-green-800'
                        };
                        return (
                          <span 
                            key={skill.id} 
                            className={`px-3 py-1.5 text-sm rounded-full font-medium ${levelColors[skill.level]}`}
                          >
                            {skill.name || 'Skill Name'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-400 italic text-center py-8">
                    Click to add your skills...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};