/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { X, Code, Play, CheckCircle2, AlertCircle, FileCode, Layers } from 'lucide-react';
import { compileQueryFilter } from '../academic/compilerParser';
import { Activity } from '../types';

interface CompilerParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
}

const SAMPLE_QUERIES = [
  'category == "Trekking & Outdoors" && costAmount <= 3000',
  'city == "Bengaluru" && costMode == "free"',
  'costAmount > 0 && participantLimit >= 6',
  'city == "Bengaluru" || city == "Mysuru"',
];

export const CompilerParserModal: React.FC<CompilerParserModalProps> = ({
  isOpen,
  onClose,
  activities,
}) => {
  const [expression, setExpression] = useState(SAMPLE_QUERIES[0]);

  const compiled = useMemo(() => {
    return compileQueryFilter(expression);
  }, [expression]);

  const filteredActivities = useMemo(() => {
    if (!compiled.filterFn) return activities;
    try {
      return activities.filter(compiled.filterFn);
    } catch {
      return [];
    }
  }, [activities, compiled]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] border border-stone-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-900 text-white flex items-center justify-center">
              <Code className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-stone-900 font-display">
                  Compiler Design: Query Filter Parser
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded">
                  AST & Lexer
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Lexical analysis, Context-Free Grammar parser, AST construction, and activity evaluation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Query Input Section */}
        <div className="p-5 border-b border-stone-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Filter Expression Input
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-500">Sample Expressions:</span>
              <div className="flex gap-1.5">
                {SAMPLE_QUERIES.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setExpression(q)}
                    className="text-[10px] bg-stone-100 hover:bg-indigo-50 hover:text-indigo-900 px-2 py-0.5 rounded font-mono text-stone-600 transition-colors cursor-pointer"
                  >
                    Preset {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g. category == 'Trekking & Outdoors' && costAmount < 3000"
              className="w-full pl-3 pr-10 py-2.5 text-xs font-mono bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 text-stone-900"
            />
            <div className="absolute right-3 top-2.5">
              {compiled.error ? (
                <AlertCircle className="w-4 h-4 text-rose-500" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
            </div>
          </div>

          {compiled.error && (
            <div className="text-xs text-rose-600 flex items-center gap-1.5 font-mono bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{compiled.error}</span>
            </div>
          )}

          <div className="text-[11px] text-stone-500 flex items-center gap-2">
            <span className="font-semibold text-stone-700">Supported Identifiers:</span>
            <span>category, city, costAmount, participantLimit, costMode, spots</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-stone-700">Operators:</span>
            <span>==, !=, &lt;, &lt;=, &gt;, &gt;=, &amp;&amp;, ||, ( )</span>
          </div>
        </div>

        {/* Tabbed Inspector: Tokens, AST, and Evaluated Results */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-stone-100/50">
          {/* Left Column: Compiler Intermediate Representations */}
          <div className="p-4 border-r border-stone-200 overflow-y-auto space-y-4">
            {/* Tokens */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <FileCode className="w-4 h-4 text-indigo-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  1. Lexical Tokens ({compiled.tokens?.length || 0})
                </h4>
              </div>
              <div className="bg-stone-900 rounded-xl p-3 max-h-44 overflow-y-auto font-mono text-[11px] text-stone-200 space-y-1">
                {compiled.tokens?.map((tok, idx) => (
                  <div key={idx} className="flex justify-between border-b border-stone-800 pb-0.5">
                    <span className="text-indigo-400 font-semibold">{tok.type}</span>
                    <span className="text-amber-300 truncate max-w-[180px]">
                      {String(tok.value)}
                    </span>
                    <span className="text-stone-500 text-[10px]">pos:{tok.position}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Abstract Syntax Tree */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Layers className="w-4 h-4 text-indigo-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  2. Abstract Syntax Tree (AST)
                </h4>
              </div>
              <div className="bg-stone-900 rounded-xl p-3 max-h-56 overflow-y-auto font-mono text-[11px] text-emerald-400">
                <pre>{JSON.stringify(compiled.ast, null, 2)}</pre>
              </div>
            </div>
          </div>

          {/* Right Column: Execution Output */}
          <div className="p-4 overflow-y-auto space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                3. Evaluator Matches ({filteredActivities.length} of {activities.length} activities)
              </h4>
              <span className="text-[11px] font-semibold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded">
                Live AST Execution
              </span>
            </div>

            {filteredActivities.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs italic">
                No activities matched this query expression.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h5 className="font-bold text-stone-900">{act.title}</h5>
                      <p className="text-[11px] text-stone-500">
                        {act.category} · {act.city} · Limit: {act.participantLimit}
                      </p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-indigo-950">
                        {act.costMode === 'free' ? 'Free' : `₹${act.costAmount}`}
                      </span>
                      <span className="block text-[10px] text-stone-400 uppercase">
                        {act.costMode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
