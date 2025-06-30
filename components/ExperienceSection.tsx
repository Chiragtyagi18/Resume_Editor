'use client';
import React, { useState } from 'react';
import { Plus, Briefcase, Trash2, Sparkles, Loader2, Check } from 'lucide-react';
import { Experience } from '../types/resume';
import { enhanceContent } from '../services/api';

interface ExperienceSectionProps {
  experiences: Experience[];
  onAdd: (experience: Experience) => void;
  onUpdate: (id: string, updates: Partial<Experience>) => void;
  onRemove: (id: string) => void;
  isExpanded?: boolean;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  onAdd,
  onUpdate,
  onRemove,
  isExpanded = false
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [enhancingId, setEnhancingId] = useState<string | null>(null);

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

  const handleAdd = () => {
    onAdd(createNewExperience());
    setIsAdding(false);
  };

  const handleEnhance = async (experience: Experience) => {
    setEnhancingId(experience.id);
    try {
      const content = `${experience.description}\n\nAchievements:\n${experience.achievements.join('\n')}`;
      const result = await enhanceContent({ section: 'experience', content });
      
      // Split enhanced content back into description and achievements
      const lines = result.enhanced_content.split('\n');
      const achievementsStartIndex = lines.findIndex(line => line.toLowerCase().includes('achievement'));
      
      if (achievementsStartIndex !== -1) {
        const description = lines.slice(0, achievementsStartIndex).join('\n').trim();
        const achievements = lines.slice(achievementsStartIndex + 1).filter(line => line.trim()).map(line => line.replace(/^[•-]\s*/, ''));
        onUpdate(experience.id, { description, achievements });
      } else {
        onUpdate(experience.id, { description: result.enhanced_content });
      }
    } catch (error) {
      console.error('Failed to enhance experience:', error);
    } finally {
      setEnhancingId(null);
    }
  };

  const addAchievement = (experienceId: string) => {
    const experience = experiences.find(exp => exp.id === experienceId);
    if (experience) {
      onUpdate(experienceId, {
        achievements: [...experience.achievements, '']
      });
    }
  };

  const updateAchievement = (experienceId: string, index: number, value: string) => {
    const experience = experiences.find(exp => exp.id === experienceId);
    if (experience) {
      const achievements = [...experience.achievements];
      achievements[index] = value;
      onUpdate(experienceId, { achievements });
    }
  };

  const removeAchievement = (experienceId: string, index: number) => {
    const experience = experiences.find(exp => exp.id === experienceId);
    if (experience && experience.achievements.length > 1) {
      const achievements = experience.achievements.filter((_, i) => i !== index);
      onUpdate(experienceId, { achievements });
    }
  };

  const hasContent = experiences.length > 0;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 ${
      isExpanded ? 'ring-2 ring-blue-200' : ''
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Work Experience</h2>
            {hasContent && !isExpanded && (
              <Check className="h-4 w-4 text-green-500" />
            )}
          </div>
          {isExpanded && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Experience</span>
            </button>
          )}
        </div>

        {!isExpanded && hasContent && (
          <div className="space-y-3">
            {experiences.slice(0, 2).map((exp) => (
              <div key={exp.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{exp.position}</h4>
                  <span className="text-xs text-gray-500">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{exp.company}</p>
                {exp.description && (
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{exp.description}</p>
                )}
              </div>
            ))}
            {experiences.length > 2 && (
              <p className="text-sm text-gray-500 text-center">
                +{experiences.length - 2} more experience{experiences.length - 2 !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {(isExpanded || !hasContent) && (
          <div className="space-y-6">
            {experiences.map((experience) => (
              <div key={experience.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        value={experience.company}
                        onChange={(e) => onUpdate(experience.id, { company: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Company Name"
                      />
                      <input
                        type="text"
                        value={experience.position}
                        onChange={(e) => onUpdate(experience.id, { position: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Job Title"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <input
                        type="month"
                        value={experience.startDate}
                        onChange={(e) => onUpdate(experience.id, { startDate: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="month"
                        value={experience.endDate}
                        onChange={(e) => onUpdate(experience.id, { endDate: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={experience.current}
                      />
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={experience.current}
                          onChange={(e) => onUpdate(experience.id, { 
                            current: e.target.checked,
                            endDate: e.target.checked ? '' : experience.endDate
                          })}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="text-sm text-gray-700">Current</span>
                      </label>
                    </div>

                    <textarea
                      value={experience.description}
                      onChange={(e) => onUpdate(experience.id, { description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                      placeholder="Describe your role and responsibilities..."
                    />

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Key Achievements</label>
                      {experience.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={achievement}
                            onChange={(e) => updateAchievement(experience.id, index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe a key achievement..."
                          />
                          {experience.achievements.length > 1 && (
                            <button
                              onClick={() => removeAchievement(experience.id, index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addAchievement(experience.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        + Add Achievement
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEnhance(experience)}
                      disabled={enhancingId === experience.id}
                      className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 transition-all"
                    >
                      {enhancingId === experience.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onRemove(experience.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {isAdding && (
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-4">Ready to add a new work experience?</p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Experience
                  </button>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {experiences.length === 0 && !isAdding && (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No work experience added yet</p>
                <p className="text-sm">Click to edit this section</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};