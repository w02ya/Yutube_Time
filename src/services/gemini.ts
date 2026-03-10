import { GoogleGenAI, Type } from "@google/genai";
import { VideoRecord } from "../types";

const apiKey = process.env.GEMINI_API_KEY;

export async function analyzeVideos(videos: { title: string; channel: string }[]): Promise<Partial<VideoRecord>[]> {
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    return [];
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `당신은 유튜브 미디어 소비 패턴을 분석하는 데이터 분석가의 AI 어시스턴트입니다.
사용자가 시청한 유튜브 영상 제목(Title)과 채널명(Channel) 리스트를 제공하면, 다음 기준에 따라 '카테고리'와 '생산성 점수'를 평가하여 엄격한 JSON 형식으로 반환하세요.

[분류 기준]
1. 카테고리 (반드시 아래 7개 중 하나로만 분류할 것):
   - 지식/정보
   - 교육/학습
   - 자기계발
   - 예능/오락
   - 게임
   - 음악
   - 기타

2. 생산성 점수 (1~100점 스케일):
   - 80~100점 (High): 직접적인 직무/학업 능력 향상, 깊이 있는 통찰 제공
   - 50~79점 (Medium): 간접적인 도움, 가벼운 교양, 동기부여, 건전한 취미
   - 10~49점 (Low): 단순 킬링타임, 도파민 소비 중심의 오락

[입력 데이터]
${JSON.stringify(videos)}

[출력 형식 제한]
반드시 아래의 JSON Array 형식으로만 출력하고, 마크다운 코드 블록이나 다른 인사말은 절대 포함하지 마세요.
[
  {
    "title": "[원본 영상 제목]",
    "channel": "[원본 채널명]",
    "category": "[분류된 카테고리]",
    "score": [생산성 점수 숫자]
  }
]`
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            channel: { type: Type.STRING },
            category: { type: Type.STRING },
            score: { type: Type.NUMBER }
          },
          required: ["title", "channel", "category", "score"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
}
