import { SONG_VOCABULARY } from './songVocabulary'
import { AI_SONG_ANALYSES } from './songAiAnalysis'

export interface SongQuizQuestion {
  id: string
  kind: 'vocab' | 'metaphor'
  badge: string
  prompt: string
  subPrompt?: string
  contextQuote?: string
  options: string[]
  correctIndex: number
  explanation: string
}

function hashSeed(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

function buildFourOptions(correct: string, distractorPool: string[], seedKey: string): { options: string[]; correctIndex: number } {
  const uniqueDistractors = Array.from(new Set(distractorPool.filter(d => d && d !== correct)))
  const seed = hashSeed(seedKey)
  const picked: string[] = []
  for (let i = 0; i < uniqueDistractors.length && picked.length < 3; i++) {
    const idx = (seed + i * 7) % uniqueDistractors.length
    const cand = uniqueDistractors[idx]
    if (!picked.includes(cand)) picked.push(cand)
  }
  // Fallback if pool had collisions
  for (const cand of uniqueDistractors) {
    if (picked.length >= 3) break
    if (!picked.includes(cand)) picked.push(cand)
  }

  const correctIndex = seed % 4
  const options = [...picked]
  options.splice(correctIndex, 0, correct)
  return { options, correctIndex }
}

export function buildSongQuizQuestions(songId: string): SongQuizQuestion[] {
  const vocab = SONG_VOCABULARY[songId] || SONG_VOCABULARY['queen-champions']
  const ai = AI_SONG_ANALYSES[songId] || AI_SONG_ANALYSES['queen-champions']

  // Collect cross-song distractor pools
  const otherVocabTranslations: string[] = []
  for (const [id, list] of Object.entries(SONG_VOCABULARY)) {
    if (id === songId) continue
    for (const item of list) {
      otherVocabTranslations.push(item.translation)
    }
  }

  const otherMetaphorMeanings: string[] = []
  for (const [id, analysis] of Object.entries(AI_SONG_ANALYSES)) {
    if (id === songId) continue
    for (const m of analysis.metaphors) {
      otherMetaphorMeanings.push(m.meaning)
    }
  }

  const questions: SongQuizQuestion[] = []

  // 1. Up to 3 complex word / idiom translation questions from the song
  const selectedVocab = vocab.slice(0, 3)
  selectedVocab.forEach((item, idx) => {
    const { options, correctIndex } = buildFourOptions(
      item.translation,
      otherVocabTranslations,
      `${songId}-vocab-${item.word}-${idx}`
    )
    questions.push({
      id: `${songId}-vq-${idx}`,
      kind: 'vocab',
      badge: `Сложное слово • ${item.level}`,
      prompt: item.word,
      subPrompt: `${item.ipa} • ${item.pos}`,
      contextQuote: item.contextQuote,
      options,
      correctIndex,
      explanation: `«${item.word}» переводится как «${item.translation}». В песне: «${item.contextTranslation}».`
    })
  })

  // 2. Up to 2 metaphor / figurative quote comprehension questions from the song
  const selectedMetaphors = (ai.metaphors || []).slice(0, 2)
  selectedMetaphors.forEach((m, idx) => {
    const { options, correctIndex } = buildFourOptions(
      m.meaning,
      otherMetaphorMeanings,
      `${songId}-meta-${m.quote}-${idx}`
    )
    questions.push({
      id: `${songId}-mq-${idx}`,
      kind: 'metaphor',
      badge: 'Переносный смысл и идиома',
      prompt: `«${m.quote}»`,
      subPrompt: 'Что на самом деле означает эта строка в контексте песни?',
      options,
      correctIndex,
      explanation: m.meaning
    })
  })

  return questions
}
