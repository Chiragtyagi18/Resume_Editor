'use client';
import React, { useState } from 'react';
import { Resume, PersonalInfo, Experience, Education, Skill } from '../types/resume';
import { 
  User, FileText, Briefcase, GraduationCap, Award, 
  Plus, Trash2, Sparkles, Loader2, X, Mail, Phone, MapPin, Linkedin, Globe 
} from 'lucide-react';
import { enhanceContent } from '../services/api';

interface EditingPanelProps {
  resume: Resume;
  selectedSection: string | null;
  onSectionSelect: (section: string | null) => void;
  onUpdatePersonalInfo: (personalInfo: PersonalInfo) => void;
  onUpdateSummary: (summary: string) => void;
  onAddExperience: (experience: Experience) => void;
  onUpdateExperience: (id: string, updates: Partial<Experience>) => void;
  onRemoveExperience: (id: string) => void;
  onAddEducation: (education: Education) => void;
  onUpdateEducation: (id: string, updates: Partial<Education>) => void;
  onRemoveEducation: (id: string) => void;
  onAddSkill: (skill: Skill) => void;
  onUpdateSkill: (id: string, updates: Partial<Skill>) => void;
  onRemoveSkill: (id: string) => void;
}

export const EditingPanel: React.FC<EditingPanelProps> = ({
  resume,
  selectedSection,
  onSectionSelect,
  onUpdatePersonalInfo,
  onUpdateSummary,
  onAddExperience,
  onUpdateExperience,
  onRemoveExperience,
  onAddEducation,
  onUpdateEducation,
  onRemoveEducation,
  onAddSkill,
  onUpdateSkill,
  onRemoveSkill
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User, color: 'blue' },
    { id: 'summary', label: 'Summary', icon: FileText, color: 'purple' },
    { id: 'experience', label: 'Experience', icon: Briefcase, color: 'green' },
    { id: 'education', label: 'Education', icon: GraduationCap, color: 'orange' },
    { id: 'skills', label: 'Skills', icon: Award, color: 'pink' }
  ];

  const handleEnhance = async (section: string, content: string) => {
    setIsEnhancing(true);
    try {
      const result = await enhanceContent({ section, content });
      if (section === 'summary') {
        onUpdateSummary(result.enhanced_content);
      }
    } catch (error) {
      console.error('Failed to enhance content:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const createNewExperience = (): Experience => ({
    id: Date.now().toString(),
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: ['']
  });

  const createNewEducation = (): Education => ({
    id: Date.now().toString(),
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    gpa: '',
    achievements: ['']
  });

  const createNewSkill = (): Skill => ({
    id: Date.now().toString(),
    name: '',
    level: 'Intermediate',
    category: 'Programming'
  });

  const skillCategories = ['Programming', 'Frontend', 'Backend', 'Cloud', 'DevOps', 'Database', 'Tools', 'Other'];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Section Tabs */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Edit Resume</h2>
        <div className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = selectedSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => onSectionSelect(isActive ? null : section.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm' 
                    : 'hover:bg-white hover:shadow-sm text-gray-700 border border-transparent'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{section.label}</span>
                {isActive && <X className="h-4 w-4 ml-auto" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editing Content */}
      <div className="flex-1 overflow-auto p-4">
        {!selectedSection && (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Select a Section to Edit</h3>
            <p className="text-sm">Click on a section in the resume or select from the tabs above to start editing</p>
          </div>
        )}

        {/* Personal Info Editor */}
        {selectedSection === 'personal' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={resume.personalInfo.name}
                  onChange={(e) => onUpdatePersonalInfo({ ...resume.personalInfo, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={resume.personalInfo.email}
                  onChange={(e) => onUpdatePersonalInfo({ ...resume.personalInfo, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={resume.personalInfo.phone}
                  onChange={(e) => onUpdatePersonalInfo({ ...resume.personalInfo, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={resume.personalInfo.location}
                  onChange={(e) => onUpdatePersonalInfo({ ...resume.personalInfo, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City, State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Linkedin className="inline h-4 w-4 mr-1" />
                  LinkedIn (Optional)
                </label>
                <input
                  type="url"
                  value={resume.personalInfo.linkedin || ''}
                  onChange={(e) => onUpdatePersonalInfo({ ...resume.personalInfo, linkedin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Globe className="inline h-4 w-4 mr-1" />
                  Website (Optional)
                </label>
                <input
                  type="url"
                  value={resume.personalInfo.website || ''}
                  onChange={(e) => onUpdatePersonalInfo({ ...resume.personalInfo, website: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        )}

        {/* Summary Editor */}
        {selectedSection === 'summary' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Professional Summary</h3>
              </div>
              <button
                onClick={() => handleEnhance('summary', resume.summary)}
                disabled={isEnhancing || !resume.summary.trim()}
                className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 text-sm transition-all"
              >
                {isEnhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                <span>AI Enhance</span>
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Write a compelling summary of your professional background
              </label>
              <textarea
                value={resume.summary}
                onChange={(e) => onUpdateSummary(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Experienced professional with expertise in... highlight your key skills, achievements, and career goals."
              />
            </div>
          </div>
        )}

        {/* Experience Editor */}
        {selectedSection === 'experience' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
              </div>
              <button
                onClick={() => onAddExperience(createNewExperience())}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Experience</span>
              </button>
            </div>
            <div className="space-y-6">
              {resume.experience.map((exp, index) => (
                <div key={exp.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Experience #{index + 1}</h4>
                    <button
                      onClick={() => onRemoveExperience(exp.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => onUpdateExperience(exp.id, { position: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => onUpdateExperience(exp.id, { company: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Company Name"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => onUpdateExperience(exp.id, { startDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => onUpdateExperience(exp.id, { endDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={exp.current}
                        />
                      </div>
                    </div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => onUpdateExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="text-sm text-gray-700">I currently work here</span>
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => onUpdateExperience(exp.id, { description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Describe your role and responsibilities..."
                      />
                    </div>
                  </div>
                </div>
              ))}
              {resume.experience.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No work experience added yet</p>
                  <p className="text-sm">Click "Add Experience" to get started</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Education Editor */}
        {selectedSection === 'education' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Education</h3>
              </div>
              <button
                onClick={() => onAddEducation(createNewEducation())}
                className="flex items-center space-x-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Education</span>
              </button>
            </div>
            <div className="space-y-6">
              {resume.education.map((edu, index) => (
                <div key={edu.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Education #{index + 1}</h4>
                    <button
                      onClick={() => onRemoveEducation(edu.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => onUpdateEducation(edu.id, { institution: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="University Name"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => onUpdateEducation(edu.id, { degree: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Bachelor of Science"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => onUpdateEducation(edu.id, { field: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Computer Science"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => onUpdateEducation(edu.id, { startDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => onUpdateEducation(edu.id, { endDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GPA (Optional)</label>
                      <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={(e) => onUpdateEducation(edu.id, { gpa: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="3.8"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {resume.education.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No education added yet</p>
                  <p className="text-sm">Click "Add Education" to get started</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills Editor */}
        {selectedSection === 'skills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-pink-600" />
                <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
              </div>
              <button
                onClick={() => onAddSkill(createNewSkill())}
                className="flex items-center space-x-2 px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Skill</span>
              </button>
            </div>
            <div className="space-y-4">
              {resume.skills.map((skill, index) => (
                <div key={skill.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => onUpdateSkill(skill.id, { name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Skill name (e.g., JavaScript)"
                    />
                  </div>
                  <div className="w-32">
                    <select
                      value={skill.level}
                      onChange={(e) => onUpdateSkill(skill.id, { level: e.target.value as Skill['level'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div className="w-32">
                    <select
                      value={skill.category}
                      onChange={(e) => onUpdateSkill(skill.id, { category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {skillCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => onRemoveSkill(skill.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {resume.skills.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No skills added yet</p>
                  <p className="text-sm">Click "Add Skill" to get started</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};