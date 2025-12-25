import React, { useState } from 'react';
import { generateVideoPrompts } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import PromptResult from './components/PromptResult';
import { VideoIcon, SparklesIcon } from './components/Icons';
import { LANGUAGES, ASPECT_RATIOS } from './constants';
import { AppState, VeoPromptResponse, InputFrames } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  
  // State to hold 3 separate images
  const [frames, setFrames] = useState<InputFrames>({
    start: null,
    middle: null,
    end: null
  });
  
  // Separate previews for UI
  const [previews, setPreviews] = useState<{ start: string | null, middle: string | null, end: string | null }>({
    start: null,
    middle: null,
    end: null
  });

  const [language, setLanguage] = useState(LANGUAGES[0].value);
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0].value);
  const [resultData, setResultData] = useState<VeoPromptResponse | null>(null);

  const handleImageSelect = (key: keyof InputFrames) => (base64: string, preview: string) => {
    setFrames(prev => ({ ...prev, [key]: base64 }));
    setPreviews(prev => ({ ...prev, [key]: preview }));
    setAppState(AppState.IDLE);
  };

  const handleGenerate = async () => {
    // Ensure at least one frame is uploaded (Start frame is usually critical)
    if (!frames.start) {
      alert("Please upload at least the Start Frame.");
      return;
    }

    setAppState(AppState.ANALYZING);
    try {
      const data = await generateVideoPrompts(frames, language, aspectRatio);
      setResultData(data);
      setAppState(AppState.SUCCESS);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
              <VideoIcon />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              VEO <span className="text-indigo-400">Flow Architect</span>
            </h1>
          </div>
          <div className="hidden md:block text-xs text-slate-500 border border-slate-800 px-3 py-1 rounded-full">
            Frame-to-Frame Continuity Engine
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-5 space-y-8">
            
            <section>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                1. Upload Keyframes sequence
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                 {/* Frame 1: Full width on mobile, half on grid */}
                 <div className="col-span-2">
                    <ImageUploader 
                      label="Frame 1: Start" 
                      subLabel="The beginning scene (Adegan Awal)"
                      onImageSelect={handleImageSelect('start')} 
                      selectedImage={previews.start} 
                    />
                 </div>
                 
                 {/* Frame 2 & 3 side by side */}
                 <div className="col-span-1">
                    <ImageUploader 
                      label="Frame 2: Action" 
                      subLabel="The connection (Kelanjutan)"
                      onImageSelect={handleImageSelect('middle')} 
                      selectedImage={previews.middle} 
                    />
                 </div>
                 <div className="col-span-1">
                    <ImageUploader 
                      label="Frame 3: End" 
                      subLabel="The resolution (Akhir Video)"
                      onImageSelect={handleImageSelect('end')} 
                      selectedImage={previews.end} 
                    />
                 </div>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                2. Configuration
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
                  <select 
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none"
                  >
                    {ASPECT_RATIOS.map(ratio => (
                      <option key={ratio.value} value={ratio.value}>{ratio.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <button
              onClick={handleGenerate}
              disabled={!frames.start || appState === AppState.ANALYZING}
              className={`
                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl
                ${!frames.start 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : appState === AppState.ANALYZING 
                    ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-500/20 cursor-wait'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-[1.02] shadow-indigo-600/20'}
              `}
            >
              {appState === AppState.ANALYZING ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing 3 Frames...
                </>
              ) : (
                <>
                  <SparklesIcon /> Generate Flow
                </>
              )}
            </button>
            
            {appState === AppState.ERROR && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                An error occurred while generating prompts. Please ensure you have configured the API Key correctly.
              </div>
            )}
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
             <div className="sticky top-24">
               {appState === AppState.IDLE && !resultData && (
                 <div className="h-full flex flex-col items-center justify-center min-h-[400px] border border-slate-800 rounded-2xl bg-slate-900/30 text-slate-500 border-dashed">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                       <SparklesIcon />
                    </div>
                    <p className="text-lg font-medium">Ready to create</p>
                    <p className="text-sm max-w-xs text-center mt-2">Upload your 3 keyframes to generate a perfectly continuous video prompt.</p>
                 </div>
               )}

               {appState === AppState.ANALYZING && (
                  <div className="h-full flex flex-col items-center justify-center min-h-[400px] border border-slate-800 rounded-2xl bg-slate-900/30">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <p className="mt-6 text-indigo-300 font-medium animate-pulse">Connecting Keyframes...</p>
                    <p className="text-slate-500 text-sm mt-2">Analyzing facial expressions & continuity</p>
                  </div>
               )}

               {appState === AppState.SUCCESS && resultData && (
                 <PromptResult data={resultData} />
               )}
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
