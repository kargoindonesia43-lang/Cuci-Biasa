import React, { useState, useEffect } from 'react';
import { VeoPromptResponse } from '../types';
import { CopyIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';
import TimelineVisualizer from './TimelineVisualizer';

interface PromptResultProps {
  data: VeoPromptResponse;
}

const PromptResult: React.FC<PromptResultProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSceneChange = (index: number) => {
    if (index >= 0 && index < data.scenes.length && index !== currentSceneIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSceneIndex(index);
        setIsTransitioning(false);
      }, 200); // Short delay for transition effect
    }
  };

  const currentScene = data.scenes[currentSceneIndex];

  // Auto-switch to visual tab if scenes data changes
  useEffect(() => {
    setCurrentSceneIndex(0);
  }, [data]);

  return (
    <div className="w-full mt-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          Generated Flow Strategy
        </h2>
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'visual' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Visual Flow
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'json' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Raw JSON
          </button>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-1 shadow-xl overflow-hidden">
        {activeTab === 'visual' ? (
          <div className="flex flex-col">
            {/* Concept Header */}
            <div className="px-6 pt-6 pb-2">
               <div className="bg-indigo-900/10 border border-indigo-500/20 p-4 rounded-lg">
                  <h3 className="text-indigo-400/80 text-xs font-bold uppercase tracking-wider mb-1">Narrative Arc</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{data.main_concept}</p>
               </div>
            </div>

            {/* Timeline Component */}
            <TimelineVisualizer 
              scenes={data.scenes} 
              currentIndex={currentSceneIndex} 
              onSceneSelect={handleSceneChange} 
            />

            {/* Main Scene Detail View */}
            <div className="relative px-6 pb-6 min-h-[400px]">
              
              {/* Navigation Arrows (Absolute positioned on desktop) */}
              <button 
                onClick={() => handleSceneChange(currentSceneIndex - 1)}
                disabled={currentSceneIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-indigo-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors hidden md:block"
              >
                <ChevronLeftIcon />
              </button>
              
              <button 
                onClick={() => handleSceneChange(currentSceneIndex + 1)}
                disabled={currentSceneIndex === data.scenes.length - 1}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-indigo-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors hidden md:block"
              >
                <ChevronRightIcon />
              </button>

              {/* Scene Content */}
              <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                
                <div className="flex justify-between items-end mb-3 px-1">
                   <div>
                     <span className="text-slate-500 text-xs uppercase font-bold tracking-widest">Scene {currentScene.frame_id}</span>
                     <h3 className="text-2xl font-bold text-white mt-1">Prompt Detail</h3>
                   </div>
                   <button 
                    onClick={() => handleCopy(currentScene.visual_prompt, `scene-${currentScene.frame_id}`)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-indigo-600/20"
                  >
                    {copiedId === `scene-${currentScene.frame_id}` ? 'Copied!' : <><CopyIcon /> Copy to Clipboard</>}
                  </button>
                </div>

                {/* Primary Visual Prompt Card */}
                <div className="bg-black/40 border border-slate-700/50 rounded-xl p-5 mb-4 shadow-inner">
                   <p className="text-slate-200 text-lg leading-relaxed font-light">{currentScene.visual_prompt}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Card 1: Expression */}
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                       <h4 className="text-xs font-bold text-slate-400 uppercase">Expression & Mood</h4>
                    </div>
                    <p className="text-slate-300 text-sm italic">{currentScene.facial_expression}</p>
                  </div>

                  {/* Card 2: Continuity */}
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                       <h4 className="text-xs font-bold text-slate-400 uppercase">Continuity Logic</h4>
                    </div>
                    <p className="text-emerald-400/90 text-sm">{currentScene.continuity_logic}</p>
                  </div>

                   {/* Card 3: Technical */}
                   <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                       <h4 className="text-xs font-bold text-slate-400 uppercase">Director Notes</h4>
                    </div>
                    <div className="space-y-2">
                       <div>
                         <span className="text-[10px] text-slate-500 block uppercase">Camera</span>
                         <p className="text-slate-300 text-sm">{currentScene.camera_movement}</p>
                       </div>
                       <div>
                         <span className="text-[10px] text-slate-500 block uppercase">Motion</span>
                         <p className="text-slate-300 text-sm">{currentScene.motion_description}</p>
                       </div>
                    </div>
                  </div>

                </div>

                {/* Mobile Navigation Controls */}
                <div className="flex md:hidden justify-between mt-6">
                    <button 
                      onClick={() => handleSceneChange(currentSceneIndex - 1)}
                      disabled={currentSceneIndex === 0}
                      className="px-4 py-2 bg-slate-800 rounded-lg text-sm disabled:opacity-50"
                    >
                      Previous Scene
                    </button>
                    <button 
                      onClick={() => handleSceneChange(currentSceneIndex + 1)}
                      disabled={currentSceneIndex === data.scenes.length - 1}
                      className="px-4 py-2 bg-slate-800 rounded-lg text-sm disabled:opacity-50"
                    >
                      Next Scene
                    </button>
                </div>

              </div>
            </div>
          </div>
        ) : (
          <div className="relative group p-6">
            <button
              onClick={() => handleCopy(data.json_output_raw, 'full-json')}
              className="absolute right-10 top-10 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-xs text-white transition-colors flex items-center gap-2"
            >
              {copiedId === 'full-json' ? 'Copied!' : <><CopyIcon /> Copy JSON</>}
            </button>
            <pre className="text-xs sm:text-sm font-mono text-green-400 bg-black/50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-[600px] overflow-y-auto border border-slate-800">
              {data.json_output_raw}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptResult;
