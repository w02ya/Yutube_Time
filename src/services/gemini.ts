import { VideoRecord, AnalysisSummary } from "../types";

type Category = "지식/정보" | "교육/학습" | "자기계발" | "예능/오락" | "게임" | "음악" | "기타";

const RULES: { keywords: string[]; category: Category; score: number }[] = [
  { keywords: ["강의", "튜토리얼", "tutorial", "course", "수업", "학습", "공부", "강좌", "배우기"], category: "교육/학습", score: 85 },
  { keywords: ["동기", "습관", "성공", "자기계발", "마인드셋", "목표", "생산성", "루틴"], category: "자기계발", score: 78 },
  { keywords: ["뉴스", "다큐", "documentary", "분석", "정보", "역사", "과학", "지식", "설명"], category: "지식/정보", score: 72 },
  { keywords: ["노래", "뮤직비디오", "mv", "music", "음악", "가요", "k-pop", "kpop", "playlist", "ost"], category: "음악", score: 45 },
  { keywords: ["게임", "gaming", "플레이", "gameplay", "lol", "마인크래프트", "배틀그라운드", "롤", "오버워치"], category: "게임", score: 25 },
  { keywords: ["예능", "드라마", "영화", "vlog", "브이로그", "먹방", "mukbang", "재미", "웃긴", "개그", "meme", "밈"], category: "예능/오락", score: 20 },
];

function classifyByKeyword(title: string, channel: string): { category: Category; score: number } {
  const text = (title + " " + channel).toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some(k => text.includes(k.toLowerCase()))) {
      return { category: rule.category, score: rule.score + Math.floor(Math.random() * 10) - 5 };
    }
  }
  return { category: "기타", score: 40 + Math.floor(Math.random() * 20) };
}

async function analyzeWithAI(videos: { title: string; channel: string }[]): Promise<Partial<VideoRecord>[]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("API 키 없음");

  const prompt = `당신은 유튜브 미디어 소비 패턴을 분석하는 데이터 분석가입니다.
아래 유튜브 영상 목록을 보고 각 영상의 '카테고리'와 '생산성 점수'를 평가하세요.

[분류 기준]
카테고리 (반드시 아래 7개 중 하나):
지식/정보, 교육/학습, 자기계발, 예능/오락, 게임, 음악, 기타

생산성 점수 (1~100):
80~100: 직무/학업 능력 향상, 깊이 있는 통찰
50~79: 가벼운 교양, 동기부여, 건전한 취미
10~49: 단순 킬링타임, 도파민 소비 중심

[입력]
${JSON.stringify(videos)}

[출력] JSON Array만 반환 (마크다운 없이):
[{"title":"...","channel":"...","category":"...","score":숫자}]`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );

  if (!res.ok) throw new Error(await res.text());

  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const text = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  return JSON.parse(text);
}

const BATCH_SIZE = 50;

export async function analyzeVideos(videos: { title: string; channel: string }[]): Promise<Partial<VideoRecord>[]> {
  const results: Partial<VideoRecord>[] = [];

  for (let i = 0; i < videos.length; i += BATCH_SIZE) {
    const batch = videos.slice(i, i + BATCH_SIZE);
    try {
      const batchResult = await analyzeWithAI(batch);
      console.log(`✅ AI 분석 완료 (${i + batch.length}/${videos.length})`);
      results.push(...batchResult);
    } catch (e) {
      console.warn(`⚠️ AI 분석 실패 (배치 ${i}~${i + batch.length}):`, e);
      throw e;
    }
  }

  return results;
}

export async function analyzeDashboard(summary: AnalysisSummary, recordCount: number): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("API 키 없음");

  const prompt = `당신은 유튜브 시청 패턴 분석 전문가입니다. 아래 데이터를 바탕으로 한국어로 심층 분석과 실질적인 조언을 제공해주세요.

[대시보드 데이터]
- 하루 평균 시청 시간: ${summary.todayWatchTime}
- 생산성 점수: ${summary.productivityScore}/100
- 최다 시청 카테고리: ${summary.topCategory}
- 피크 시청 시간대: ${summary.peakTime}
- 카테고리 분포: ${summary.categoryDistribution.map(c => `${c.name} ${c.value}%`).join(', ')}
- Shorts 비율: ${summary.shortsRatio ?? 0}%
- 분석 영상 수: ${recordCount}개

마크다운 형식으로 아래 항목을 작성해주세요:

## 📊 시청 패턴 분석
## ⚠️ 주의할 점
## 💡 개선 조언
## 🎯 이번 주 실천 목표`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "분석 결과를 가져올 수 없습니다.";
}
