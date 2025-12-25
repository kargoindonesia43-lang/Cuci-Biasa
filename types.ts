export interface PromptOptions {
  language: string;
  aspectRatio: string;
}

export interface InputFrames {
  start: string | null;
  middle: string | null;
  end: string | null;
}

export interface SceneDetail {
  frame_id: number;
  time_code: string;
  visual_prompt: string;
  motion_description: string;
  camera_movement: string;
  facial_expression: string; // New field for specific expression analysis
  technical_notes: string;
  dialogue_suggestion?: string;
  continuity_logic: string;
}

export interface VeoPromptResponse {
  main_concept: string;
  aspect_ratio: string;
  scenes: SceneDetail[];
  json_output_raw: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
