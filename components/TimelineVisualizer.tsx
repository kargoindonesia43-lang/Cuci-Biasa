import React from 'react';
import { SceneDetail } from '../types';

interface TimelineVisualizerProps {
  scenes: SceneDetail[];
  currentIndex: number;
  onSceneSelect: (index: number) => void;
}

const TimelineVisualizer: React.FC<TimelineVisualizerProps> = ({ scenes, currentIndex, onSceneSelect }) => {
  return (
    <div className="w-full py-6 px-4 mb-6">
      <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 rounded-full -z-10"></div>
        <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full transition-all duration-500 ease-in-out -z-10"
            style={{ width: `${(currentIndex / (scenes.length - 1)) * 100}%` }}
        ></div>

        {/* Nodes */}
        {scenes.map((scene, idx) => {
          const isActive = idx === currentIndex;
          const isPast = idx < currentIndex;

          return (
            <button
              key={scene.frame_id}
              onClick={() => onSceneSelect(idx)}
              className={`
                relative flex flex-col items-center group focus:outline-none
              `}
            >
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                  ${isActive 
                    ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-125 text-white' 
                    : isPast 
                      ? 'bg-indigo-900 border-indigo-700 text-indigo-300' 
                      : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'}
                `}
              >
                <span className="text-xs font-bold">{idx + 1}</span>
              </div>
              
              <div className={`
                absolute top-10 w-24 text-center transition-all duration-300
                ${isActive ? 'opacity-100 transform translate-y-0' : 'opacity-60 transform hover:opacity-100'}
              `}>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-indigo-300' : 'text-slate-500'}`}>
                  {scene.time_code}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineVisualizer;
