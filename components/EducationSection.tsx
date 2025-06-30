'use client';
import React, { useState } from 'react';
import { Plus, GraduationCap, Trash2, Check } from 'lucide-react';
import { Education } from '../types/resume';

interface EducationSectionProps {
  education: Education[];
  onAdd: (education: Education) => void;
  onUpdate: (id: string, updates: Partial<Education>) => void;
  onRemove: (id: string) => void;
  isExpanded?: boolean;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  education,
  onAdd,
  onUpdate,
  onRemove,
  isExpanded = false
}) => {
  const [isAdding, setIsAdding] = useState(false);

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

  const handleAdd = () => {
    onAdd(createNewEducation());
    setIsAdding(false);
  };

  const addAchievement = (educationId: string) => {
    const edu = education.find(e => e.id === educationId);
    if (edu) {
      onUpdate(educationId, {
        achievements: [...edu.achievements, '']
      });
    }
  };

  const updateAchievement = (educationId: string, index: number, value: string) => {
    const edu = education.find(e => e.id === educationId);
    if (edu) {
      const achievements = [...edu.achievements];
      achievements[index] = value;
      onUpdate(educationId, { achievements });
    }
  };

  const removeAchievement = (educationId: string, index: number) => {
    const edu = education.find(e => e.id === educationId);
    if (edu && edu.achievements.length > 1) {
      const achievements = edu.achievements.filter((_, i) => i !== index);
      onUpdate(educationId, { achievements });
    }
  };

  const hasContent = education.length > 0;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 ${
      isExpanded ? 'ring-2 ring-blue-200' : ''
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Education</h2>
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
              <span>Add Education</span>
            </button>
          )}
        </div>

        {!isExpanded && hasContent && (
          <div className="space-y-3">
            {education.slice(0, 2).map((edu) => (
              <div key={edu.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{edu.degree} in {edu.field}</h4>
                  <span className="text-xs text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
              </div>
            ))}
            {education.length > 2 && (
              <p className="text-sm text-gray-500 text-center">
                +{education.length - 2} more education{education.length - 2 !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {(isExpanded || !hasContent) && (
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => onUpdate(edu.id, { institution: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Institution Name"
                      />
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => onUpdate(edu.id, { degree: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Degree Type (e.g., Bachelor of Science)"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => onUpdate(edu.id, { field: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Field of Study"
                      />
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => onUpdate(edu.id, { startDate: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => onUpdate(edu.id, { endDate: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="mb-4">
                      <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={(e) => onUpdate(edu.id, { gpa: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="GPA (optional)"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Achievements & Activities</label>
                      {edu.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={achievement}
                            onChange={(e) => updateAchievement(edu.id, index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Honors, activities, relevant coursework..."
                          />
                          {edu.achievements.length > 1 && (
                            <button
                              onClick={() => removeAchievement(edu.id, index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addAchievement(edu.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        + Add Achievement
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemove(edu.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {isAdding && (
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-4">Ready to add your educational background?</p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Education
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

            {education.length === 0 && !isAdding && (
              <div className="text-center py-8 text-gray-500">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No education added yet</p>
                <p className="text-sm">Click to edit this section</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};