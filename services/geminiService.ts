import { GoogleGenAI, Type } from "@google/genai";
import { VeoPromptResponse, InputFrames } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates structured video prompts based on 3 input frames.
 */
export const generateVideoPrompts = async (
  frames: InputFrames,
  language: string,
  aspectRatio: string
): Promise<VeoPromptResponse> => {
  
  const systemInstruction = `
    You are an elite Video Director and Prompt Engineer specializing in Google VEO and Google Flow.
    
    TASK:
    Analyze the provided 3 keyframes (Start, Middle/Action, End) to create a perfect video generation script.
    
    CRITICAL REQUIREMENTS:
    1. **Sequence Logic**: 
       - Image 1 is the START (Setup).
       - Image 2 is the CONTINUATION (Action/Conflict).
       - Image 3 is the END (Resolution).
    2. **Facial Expressions & Moments**: 
       - You MUST analyze the specific facial micro-expressions and body language in each uploaded image. 
       - The generated prompt must describe the *evolution* of these expressions (e.g., "smile turning into surprise").
    3. **Continuity (Sealur)**:
       - Explain exactly how to morph/transition from Frame 1 -> Frame 2 -> Frame 3.
    4. **Output**:
       - Language: ${language}
       - Format: JSON
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      main_concept: {
        type: Type.STRING,
        description: "A summary of the narrative arc defined by the 3 frames.",
      },
      scenes: {
        type: Type.ARRAY,
        description: "The sequence bridging the uploaded frames.",
        items: {
          type: Type.OBJECT,
          properties: {
            frame_id: { type: Type.INTEGER },
            time_code: { type: Type.STRING },
            visual_prompt: { 
              type: Type.STRING, 
              description: "Highly descriptive prompt including subject, environment, and lighting." 
            },
            facial_expression: {
              type: Type.STRING,
              description: "Detailed description of the character's emotion and face details based on the uploaded image.",
            },
            motion_description: { 
              type: Type.STRING, 
              description: "How the subject moves from the previous frame to this one." 
            },
            camera_movement: { type: Type.STRING },
            technical_notes: { type: Type.STRING },
            dialogue_suggestion: { type: Type.STRING },
            continuity_logic: { 
              type: Type.STRING, 
              description: "Logic explaining the bridge between the uploaded keyframes." 
            }
          },
          required: ["frame_id", "visual_prompt", "facial_expression", "motion_description", "continuity_logic"],
        },
      },
    },
    required: ["main_concept", "scenes"],
  };

  const contentParts: any[] = [];

  // Construct the prompt payload carefully to distinguish frames
  if (frames.start) {
    contentParts.push({ text: "FRAME 1 (START SCENE): Analyze the setting, character, and initial expression." });
    contentParts.push({ inlineData: { mimeType: "image/jpeg", data: frames.start } });
  }
  if (frames.middle) {
    contentParts.push({ text: "FRAME 2 (CONTINUATION/ACTION): Analyze the movement, change in expression, and plot progression." });
    contentParts.push({ inlineData: { mimeType: "image/jpeg", data: frames.middle } });
  }
  if (frames.end) {
    contentParts.push({ text: "FRAME 3 (ENDING): Analyze the final state, resolution expression, and closing composition." });
    contentParts.push({ inlineData: { mimeType: "image/jpeg", data: frames.end } });
  }

  contentParts.push({ 
    text: `Generate a seamless video prompt plan connecting these frames. Aspect Ratio: ${aspectRatio}. focus on preserving the identity and expressions found in the images.` 
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts: contentParts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4,
      },
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);

    return {
      main_concept: parsed.main_concept,
      aspect_ratio: aspectRatio,
      scenes: parsed.scenes,
      json_output_raw: jsonText,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate video prompts. Please try again.");
  }
};
