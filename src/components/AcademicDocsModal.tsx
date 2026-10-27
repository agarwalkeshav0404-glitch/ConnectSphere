/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, BookOpen, Cpu, Brain, Layers, Code, Sparkles, Terminal } from 'lucide-react';
import { ACADEMIC_SUBJECTS } from '../academic/academicConcepts';

interface AcademicDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCompiler: () => void;
}

export const AcademicDocsModal: React.FC<AcademicDocsModalProps> = ({
  isOpen,
  onClose,
  onOpenCompiler,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('algorithms');

  if (!isOpen) return null;

  const activeSubject =
    ACADEMIC_SUBJECTS.find((s) => s.id === selectedSubjectId) || ACADEMIC_SUBJECTS[0];

  const getSubjectIcon = (id: string) => {
    switch (id) {
      case 'algorithms':
        return Brain;
      case 'os':
        return Cpu;
      case 'data-mining':
        return Layers;
      case 'graphics':
        return Sparkles;
      case 'compiler-design':
        return Code;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] border border-stone-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-900 text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-stone-900 font-display">
                  Academic Project Architecture
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded">
                  B.Tech 3rd Year Core
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Rigorous mapping of ConnectSphere engineering implementation to CS syllabus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenCompiler();
              }}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-900 bg-indigo-100 hover:bg-indigo-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Interactive Compiler Tool</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Split: Sidebar & Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Subject Nav */}
          <div className="w-full md:w-64 border-r border-stone-200 bg-stone-50/40 p-3 space-y-1.5 shrink-0 overflow-y-auto">
            {ACADEMIC_SUBJECTS.map((sub) => {
              const Icon = getSubjectIcon(sub.id);
              const isSelected = sub.id === selectedSubjectId;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-indigo-900 text-white shadow-sm'
                      : 'hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mt-0.5 shrink-0 ${
                      isSelected ? 'text-indigo-200' : 'text-stone-400'
                    }`}
                  />
                  <div>
                    <p className="text-xs font-bold leading-tight">{sub.subjectName}</p>
                    <p
                      className={`text-[10px] mt-0.5 ${
                        isSelected ? 'text-indigo-200' : 'text-stone-400'
                      }`}
                    >
                      {sub.semester}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Subject Deep Dive Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  {activeSubject.semester}
                </span>
                <span className="text-xs font-mono text-stone-400">
                  Ref: {activeSubject.codeReference}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-stone-900 font-display mt-1">
                {activeSubject.subjectName}
              </h2>
            </div>

            {/* Core Concepts Badges */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Core Curriculum Concepts Demonstrated
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeSubject.coreConcepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 border border-stone-200"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            {/* Application Overview */}
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4">
              <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-1">
                Implementation in ConnectSphere
              </h4>
              <p className="text-xs text-indigo-900 leading-relaxed">
                {activeSubject.systemApplication}
              </p>
            </div>

            {/* Mathematical Formula */}
            {activeSubject.mathematicalFormula && (
              <div className="bg-stone-900 text-white rounded-xl p-4 font-mono text-xs overflow-x-auto">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                  Mathematical / Algorithmic Formulation
                </span>
                <div className="text-indigo-300 font-semibold py-1">
                  {activeSubject.mathematicalFormula}
                </div>
              </div>
            )}

            {/* Detailed Theoretical Foundation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Theoretical Foundation & Analysis
              </h4>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs font-mono text-stone-800 whitespace-pre-wrap leading-relaxed">
                {activeSubject.theoreticalFoundation}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
