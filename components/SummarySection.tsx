'use client';
import React, { useState } from 'react';
import { FileText, Sparkles, Loader2, Check } from 'lucide-react';
import { enhanceContent } from '../services/api';

interface SummarySectionProps {
  summary: string;
  onUpdate: (summary: string) => void;
  isExpanded?: boolean;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  summary,
  onUpdate,
  isExpanded = false
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleEnhance = async () => {
    if (!summary.trim()) return;
    
    setIsEnhancing(true);
    try {
      const result = await enhanceContent({ section: 'summary', content: summary });
      onUpdate(result.enhanced_content);
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error('Failed to enhance content:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const hasContent = summary.trim().length > 0;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 ${
      isExpanded ? 'ring-2 ring-blue-200' : ''
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Professional Summary</h2>
            {hasContent && !isExpanded && (
              <Check className="h-4 w-4 text-green-500" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasContent && isExpanded && (
              <button
                onClick={handleEnhance}
                disabled={isEnhancing || !summary.trim()}
                className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isEnhancing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                <span className="text-sm">{isEnhancing ? 'Enhancing...' : 'AI Enhance'}</span>
              </button>
            )}
          </div>
        </div>

        {isExpanded && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Write a compelling summary of your professional background and key strengths
            </label>
            <textarea
              value={summary}
              onChange={(e) => onUpdate(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              placeholder="Experienced professional with expertise in... highlight your key skills, achievements, and career goals."
            />
          </div>
        )}

        {!isExpanded && !hasContent && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No professional summary added yet</p>
            <p className="text-sm">Click &quot;Summary&quot; above to edit this section</p>
          </div>
        )}

        {!isExpanded && hasContent && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 text-sm line-clamp-3">{summary}</p>
            <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">Click &quot;Summary&quot; above to edit or enhance with AI</p>
            </div>
          </div>
        )}

        {suggestions.length > 0 && isExpanded && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">AI Suggestions:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};