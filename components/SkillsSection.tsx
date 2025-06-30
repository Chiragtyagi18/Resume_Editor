'use client';
import React, { useState } from 'react';
import { Plus, Award, Trash2, Check } from 'lucide-react';
import { Skill } from '../types/resume';

interface SkillsSectionProps {
  skills: Skill[];
  onAdd: (skill: Skill) => void;
  onUpdate: (id: string, updates: Partial<Skill>) => void;
  onRemove: (id: string) => void;
  isExpanded?: boolean;
}

const skillLevels: Skill['level'][] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const skillCategories = ['Programming', 'Frontend', 'Backend', 'Cloud', 'DevOps', 'Database', 'Tools', 'Other'];

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  onAdd,
  onUpdate,
  onRemove,
  isExpanded = false
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id'>>({
    name: '',
    level: 'Intermediate',
    category: 'Programming'
  });

  const handleAdd = () => {
    if (newSkill.name.trim()) {
      onAdd({
        id: Date.now().toString(),
        ...newSkill
      });
      setNewSkill({ name: '', level: 'Intermediate', category: 'Programming' });
      setIsAdding(false);
    }
  };

  const getLevelColor = (level: Skill['level']) => {
    switch (level) {
      case 'Beginner': return 'bg-red-100 text-red-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-blue-100 text-blue-800';
      case 'Expert': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const hasContent = skills.length > 0;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 ${
      isExpanded ? 'ring-2 ring-blue-200' : ''
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Skills</h2>
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
              <span>Add Skill</span>
            </button>
          )}
        </div>

        {!isExpanded && hasContent && (
          <div className="space-y-4">
            {Object.entries(groupedSkills).slice(0, 3).map(([category, categorySkills]) => (
              <div key={category}>
                <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.slice(0, 6).map((skill) => (
                    <span key={skill.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {skill.name}
                    </span>
                  ))}
                  {categorySkills.length > 6 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{categorySkills.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            ))}
            {Object.keys(groupedSkills).length > 3 && (
              <p className="text-sm text-gray-500 text-center">
                +{Object.keys(groupedSkills).length - 3} more categories
              </p>
            )}
          </div>
        )}

        {(isExpanded || !hasContent) && (
          <>
            {isAdding && (
              <div className="mb-6 p-4 border-2 border-dashed border-blue-300 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Skill name"
                  />
                  <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as Skill['level'] })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {skillLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {skillCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Skill
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => onUpdate(skill.id, { name: e.target.value })}
                            className="w-full font-medium text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                          />
                          <div className="flex items-center space-x-2 mt-1">
                            <select
                              value={skill.level}
                              onChange={(e) => onUpdate(skill.id, { level: e.target.value as Skill['level'] })}
                              className={`text-xs px-2 py-1 rounded-full border-none focus:outline-none focus:ring-0 ${getLevelColor(skill.level)}`}
                            >
                              {skillLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemove(skill.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {skills.length === 0 && !isAdding && (
                <div className="text-center py-8 text-gray-500">
                  <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No skills added yet</p>
                  <p className="text-sm">Click to edit this section</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};