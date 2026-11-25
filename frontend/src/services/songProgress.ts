export interface SongBestRecord {
  bestWpm?: number
  bestAccuracy?: number
  bestRhythmLines?: number
  bestQuizScore?: number
  bestQuizTotal?: number
  updatedAt: string
}

const STORAGE_KEY = 'linguatype_song_best_records_v1'

function loadAll(): Record<string, SongBestRecord> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function saveAll(map: Record<string, SongBestRecord>) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // ignore storage quota errors
  }
}

export const songProgressService = {
  getAll(): Record<string, SongBestRecord> {
    return loadAll()
  },

  getSongRecord(songId: string): SongBestRecord | null {
    const all = loadAll()
    return all[songId] ?? null
  },

  recordTypingResult(songId: string, wpm: number, accuracy: number): SongBestRecord {
    const all = loadAll()
    const prev = all[songId]
    const next: SongBestRecord = {
      ...prev,
      bestWpm: Math.max(prev?.bestWpm ?? 0, Math.round(wpm)),
      bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, Math.round(accuracy * 10) / 10),
      updatedAt: new Date().toISOString()
    }
    all[songId] = next
    saveAll(all)
    return next
  },

  recordRhythmLines(songId: string, linesCleared: number): SongBestRecord {
    const all = loadAll()
    const prev = all[songId]
    const next: SongBestRecord = {
      ...prev,
      bestRhythmLines: Math.max(prev?.bestRhythmLines ?? 0, linesCleared),
      updatedAt: new Date().toISOString()
    }
    all[songId] = next
    saveAll(all)
    return next
  },

  recordQuizScore(songId: string, score: number, total: number): SongBestRecord {
    const all = loadAll()
    const prev = all[songId]
    const prevRatio = prev?.bestQuizTotal ? (prev.bestQuizScore ?? 0) / prev.bestQuizTotal : -1
    const newRatio = total > 0 ? score / total : 0
    const shouldUpdate = newRatio >= prevRatio
    const next: SongBestRecord = {
      ...prev,
      bestQuizScore: shouldUpdate ? score : prev?.bestQuizScore,
      bestQuizTotal: shouldUpdate ? total : prev?.bestQuizTotal,
      updatedAt: new Date().toISOString()
    }
    all[songId] = next
    saveAll(all)
    return next
  }
}
