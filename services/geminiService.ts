import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

const RISK_KEYWORDS = ["呕吐", "便血", "抽搐", "吐血", "呼吸困难", "精神萎靡", "不吃不喝", "vomit", "blood", "seizure"];

// Initialize GenAI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const checkRisk = (text: string): boolean => {
  return RISK_KEYWORDS.some(keyword => text.includes(keyword));
};

export const sendMessageToAI = async (
  currentMessage: string,
  imageBase64: string | null,
  history: Message[]
): Promise<string> => {
  try {
    const systemInstruction = `
      你是一位经验丰富、富有同情心的AI宠物医生助手。
      你的名字叫"宠医小助手"。
      
      职责：
      1. 根据用户的描述回答关于宠物健康、护理、营养的问题。
      2. 如果用户上传了化验单或病历图片（OCR），请仔细解读其中的数值，并给出通俗易懂的解释。
      3. 如果用户描述的症状危及生命（如呕吐、便血、呼吸困难等），请务必在回答中强调立即就医。
      4. 你的语气应该是专业、温暖且令人安心的。
      5. 回答要简洁明了，适合手机阅读。

      请注意：你的回答仅供参考，不能替代线下兽医的诊断。
    `;

    // Choose model based on content
    // Use gemini-2.5-flash-image for image capabilities (multimodal)
    // Use gemini-3-flash-preview for pure text speed and reasoning
    const modelId = imageBase64 ? 'gemini-2.5-flash-image' : 'gemini-3-flash-preview';
    
    // Prepare contents
    let contents: any = {};
    
    if (imageBase64) {
      // Multimodal request
      contents = {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or detect from base64 header
              data: imageBase64.split(',')[1] // Remove data URL scheme if present
            }
          },
          {
             text: currentMessage || "请帮我解读这张图片里的内容，如果是化验单请重点关注异常指标。"
          }
        ]
      };
    } else {
      // Text-only request
      // We can pass simple history context if needed, but for this demo 
      // we'll just send the current prompt with a bit of context string to keep it stateless/simple
      // or we can use the Chat API. Let's use Chat API for text only to keep context.
      // However, to unify the interface for this demo, we'll construct a single turn prompt with history.
      
      const conversationContext = history.slice(-5).map(h => `${h.role === 'user' ? '用户' : '医生'}: ${h.content}`).join('\n');
      const finalPrompt = `
        ${conversationContext}
        用户: ${currentMessage}
        医生:
      `;
       contents = { parts: [{ text: finalPrompt }] };
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "抱歉，我没有理解您的意思，请再说一遍。";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，AI 医生暂时繁忙，请稍后再试或直接咨询线下医生。";
  }
};
