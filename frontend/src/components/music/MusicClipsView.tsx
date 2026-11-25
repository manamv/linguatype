import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  Music,
  Play,
  Pause,
  Volume2,
  BookOpen,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Headphones,
  Flame,
  RotateCcw,
  ArrowLeft,
  Crosshair,
  Languages,
  Zap,
  Ear,
  Eye,
  EyeOff,
  SkipForward,
  CheckCircle2,
  Search,
  X,
  Shuffle,
  Snowflake,
  Library,
  BookmarkPlus,
  Check,
  Trophy,
  Brain
} from 'lucide-react'
import type { MusicLesson, LessonData } from '../../types'
import { api } from '../../services/api'
import { soundService } from '../../services/sound'
import { WordPopover } from '../typing/WordPopover'
import { useWordSelection } from '../../hooks/useWordSelection'
import { normalizeEnglishWord } from '../../utils/dictionary'
import { SONG_VOCABULARY, type SongVocabItem } from '../../data/songVocabulary'
import { AI_SONG_ANALYSES } from '../../data/songAiAnalysis'
import { buildSongQuizQuestions } from '../../data/songQuiz'
import { songProgressService, type SongBestRecord } from '../../services/songProgress'
import { achievementsService } from '../../services/achievements'

interface YTPlayerInstance {
  playVideo?: () => void
  pauseVideo?: () => void
  seekTo?: (seconds: number, allowSeekAhead?: boolean) => void
  getCurrentTime?: () => number
  getPlayerState?: () => number
  cueVideoById?: (videoId: string) => void
  loadVideoById?: (videoId: string) => void
  destroy?: () => void
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void
    YT?: {
      Player: new (
        element: HTMLElement | string,
        options: {
          width?: string | number
          height?: string | number
          videoId?: string
          playerVars?: Record<string, string | number>
          events?: {
            onReady?: () => void
            onStateChange?: (event: { data: number }) => void
          }
        }
      ) => YTPlayerInstance
    }
  }
}

interface MusicClipsViewProps {
  onStartTyping: (lesson: LessonData) => void
  onBack?: () => void
}

function extractYouTubeId(url: string): string {
  const match = url.match(/embed\/([a-zA-Z0-9_-]+)/)
  return match ? match[1] : '04854XqcfCY'
}

// Precomputed deterministic snowflake specs (zero random re-renders, ultra-light CSS transform)
const SNOWFLAKES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${(i * 4.7 + (i % 3) * 1.9) % 98}%`,
  size: 3 + (i % 4) * 1.5,
  opacity: 0.22 + (i % 4) * 0.09,
  duration: `${10 + (i % 6) * 2.4}s`,
  delay: `-${(i * 1.3) % 14}s`
}))

const MUSIC_LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1'] as const

const MUSIC_LEVEL_META: Record<
  string,
  {
    label: string
    subtitle: string
    dotClass: string
    badgeClass: string
  }
> = {
  A1: {
    label: 'A1 • Foundation',
    subtitle: 'Медленный темп и базовые фразы',
    dotClass: 'bg-sky-400 shadow-[0_0_8px_#38bdf8]',
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-400/30'
  },
  A2: {
    label: 'A2 • Elementary',
    subtitle: 'Понятный вокал, Past Simple и повседневная лексика',
    dotClass: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]',
    badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30'
  },
  B1: {
    label: 'B1 • Intermediate',
    subtitle: 'Present Perfect, идиомы и выразительные метафоры',
    dotClass: 'bg-blue-400 shadow-[0_0_8px_#60a5fa]',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-400/30'
  },
  B2: {
    label: 'B2 • Upper-Intermediate',
    subtitle: 'Живой разговорный темп, сленг и сложные обороты',
    dotClass: 'bg-indigo-400 shadow-[0_0_8px_#818cf8]',
    badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-400/30'
  },
  C1: {
    label: 'C1 • Advanced',
    subtitle: 'Быстрый флоу, редкие идиомы и культурные отсылки',
    dotClass: 'bg-violet-400 shadow-[0_0_8px_#a78bfa]',
    badgeClass: 'bg-violet-500/15 text-violet-300 border-violet-400/30'
  }
}

export const MusicClipsView: React.FC<MusicClipsViewProps> = ({ onStartTyping, onBack }) => {
  const [songsList, setSongsList] = useState<
    Array<{
      id: string
      title: string
      artist: string
      level: string
      thumbnailUrl: string
      grammarFocus: string
      sentenceCount: number
    }>
  >([])
  const [selectedSongId, setSelectedSongId] = useState<string>('queen-champions')
  const [currentSong, setCurrentSong] = useState<MusicLesson | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<'grammar' | 'vocab' | 'quiz' | 'ai-meaning'>('grammar')
  const [savedVocabWords, setSavedVocabWords] = useState<Record<string, boolean>>({})
  const [savingVocabWord, setSavingVocabWord] = useState<string | null>(null)

  // Per-song personal best records & Comprehension Quiz state
  const [songRecords, setSongRecords] = useState<Record<string, SongBestRecord>>(() => songProgressService.getAll())
  const [quizIndex, setQuizIndex] = useState<number>(0)
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null)
  const [quizScore, setQuizScore] = useState<number>(0)
  const [quizFinished, setQuizFinished] = useState<boolean>(false)

  // Scalable Music Catalog state (CEFR level filter, search, collapsible drawer)
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL')
  const [songSearchQuery, setSongSearchQuery] = useState<string>('')
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(true)

  // Real-time YouTube Clip Karaoke State (only updates on line/word changes -> 0 lag!)
  const [isKaraokePlaying, setIsKaraokePlaying] = useState<boolean>(false)
  const [activeSubtitleId, setActiveSubtitleId] = useState<number>(1)
  const [activeWordIdx, setActiveWordIdx] = useState<number>(-1)
  const [isInIntro, setIsInIntro] = useState<boolean>(false)
  const [timingOffset, setTimingOffset] = useState<number>(0.0)
  const [syncFlashMsg, setSyncFlashMsg] = useState<string | null>(null)
  const [translateOnClick, setTranslateOnClick] = useState<boolean>(false)

  // Interactive Musical Typing Modes: 'karaoke' | 'rhythm' (type on beat) | 'dictation' (listen -> auto-pause -> type by ear -> auto-resume)
  const [musicMode, setMusicMode] = useState<'karaoke' | 'rhythm' | 'dictation'>('karaoke')
  const [typedLine, setTypedLine] = useState<string>('')
  const [lineCleared, setLineCleared] = useState<boolean>(false)
  const [linesClearedCount, setLinesClearedCount] = useState<number>(0)
  const [rhythmCombo, setRhythmCombo] = useState<number>(0)
  const [musicErrors, setMusicErrors] = useState<number>(0)
  const [dictationPhase, setDictationPhase] = useState<'LISTENING' | 'TYPING' | 'DONE'>('LISTENING')
  const [dictationShowHint, setDictationShowHint] = useState<boolean>(false)

  // Shared Word Translation Popover (Idea #4)
  const { selectedWord, handleTextSelection, selectWord, clearSelectedWord } = useWordSelection()

  // Direct DOM refs for silky 60-FPS updates without React re-render churn
  const ytHostRef = useRef<HTMLDivElement>(null)
  const ytPlayerRef = useRef<YTPlayerInstance | null>(null)
  const ytPlayerReadyRef = useRef<boolean>(false)
  const activeSubtitleRef = useRef<HTMLDivElement>(null)
  const subtitlesScrollContainerRef = useRef<HTMLDivElement>(null)
  const activeProgressBarRef = useRef<HTMLDivElement>(null)
  const spotlightProgressRef = useRef<HTMLDivElement>(null)
  const timeDisplayRef = useRef<HTMLSpanElement>(null)
  const introCountdownRef = useRef<HTMLSpanElement>(null)

  // Dual-source YouTube clock refs (YT.Player API + passive postMessage infoDelivery)
  const currentTimeRef = useRef<number>(0)
  const ytMsgTimeRef = useRef<number>(-1)
  const ytMsgPerfRef = useRef<number>(0)
  const seekingUntilRef = useRef<number>(0)
  const activeSubIdRef = useRef<number>(1)
  const activeWordIdxRef = useRef<number>(-1)
  const isInIntroRef = useRef<boolean>(false)
  const timingOffsetRef = useRef<number>(0)
  const musicModeRef = useRef<'karaoke' | 'rhythm' | 'dictation'>('karaoke')
  const dictationPhaseRef = useRef<'LISTENING' | 'TYPING' | 'DONE'>('LISTENING')
  const dictationPausedLineIdRef = useRef<number>(-1)
  const typedLineRef = useRef<string>('')

  timingOffsetRef.current = timingOffset
  activeSubIdRef.current = activeSubtitleId
  activeWordIdxRef.current = activeWordIdx
  isInIntroRef.current = isInIntro
  musicModeRef.current = musicMode
  dictationPhaseRef.current = dictationPhase
  typedLineRef.current = typedLine

  // Passive YouTube postMessage listener (zero setState on time ticks -> zero lag, 100% reliable fallback clock!)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        if (data && data.event === 'infoDelivery' && data.info) {
          if (typeof data.info.currentTime === 'number' && !isNaN(data.info.currentTime)) {
            ytMsgTimeRef.current = data.info.currentTime
            ytMsgPerfRef.current = performance.now()
          }
          if (data.info.playerState === 1) {
            setIsKaraokePlaying(true)
          } else if (data.info.playerState === 2 || data.info.playerState === 0) {
            setIsKaraokePlaying(false)
          }
        }
      } catch {
        // ignore non-JSON messages
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Load songs list on mount
  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setIsLoading(true)
      try {
        const list = await api.getMusicLessons()
        if (isMounted) {
          setSongsList(list)
          if (list.length > 0) {
            setSelectedSongId(list[0].id)
          }
        }
      } catch {
        // Fallback handled in api
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  // Load selected song details
  useEffect(() => {
    let isMounted = true
    clearSelectedWord()
    const loadSong = async () => {
      try {
        const song = await api.getMusicLesson(selectedSongId)
        if (!isMounted) return

        setCurrentSong(song)
        currentTimeRef.current = 0
        ytMsgTimeRef.current = -1
        setTimingOffset(0)
        setIsKaraokePlaying(false)
        setActiveWordIdx(-1)
        setIsInIntro(false)
        setTypedLine('')
        typedLineRef.current = ''
        setLineCleared(false)
        setLinesClearedCount(0)
        setRhythmCombo(0)
        setMusicErrors(0)
        setDictationPhase('LISTENING')
        dictationPhaseRef.current = 'LISTENING'
        dictationPausedLineIdRef.current = -1
        setDictationShowHint(false)
        setQuizIndex(0)
        setQuizSelectedOption(null)
        setQuizScore(0)
        setQuizFinished(false)
        setSongRecords(songProgressService.getAll())
        if (timeDisplayRef.current) {
          timeDisplayRef.current.textContent = '0.0 сек'
        }
        if (song.subtitles.length > 0) {
          setActiveSubtitleId(song.subtitles[0].id)
        }

        // Switch video cleanly on existing YT.Player instance without detaching API
        const videoId = extractYouTubeId(song.videoUrl)
        if (ytPlayerRef.current && ytPlayerReadyRef.current && typeof ytPlayerRef.current.cueVideoById === 'function') {
          try {
            ytPlayerRef.current.cueVideoById(videoId)
          } catch {
            // safe fallback
          }
        }
      } catch {
        // Fallback
      }
    }
    loadSong()
    return () => {
      isMounted = false
    }
  }, [selectedSongId, clearSelectedWord])

  // Initialize official YouTube IFrame Player API once host div is mounted (!isLoading && currentSong)
  useEffect(() => {
    if (typeof window === 'undefined' || !currentSong || isLoading) return
    if (ytPlayerRef.current) return

    let cancelled = false
    const videoId = extractYouTubeId(currentSong.videoUrl)

    const mountPlayer = () => {
      if (cancelled || !window.YT?.Player || !ytHostRef.current || ytPlayerRef.current) return

      try {
        ytHostRef.current.innerHTML = ''
        const slot = document.createElement('div')
        slot.style.width = '100%'
        slot.style.height = '100%'
        ytHostRef.current.appendChild(slot)

        ytPlayerRef.current = new window.YT.Player(slot, {
          width: '100%',
          height: '100%',
          videoId,
          playerVars: {
            enablejsapi: 1,
            modestbranding: 1,
            rel: 0,
            playsinline: 1
          },
          events: {
            onReady: () => {
              if (!cancelled) {
                ytPlayerReadyRef.current = true
              }
            },
            onStateChange: event => {
              if (cancelled) return
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
              if (event.data === 1) {
                setIsKaraokePlaying(true)
              } else if (event.data === 2 || event.data === 0) {
                setIsKaraokePlaying(false)
              }
            }
          }
        })
      } catch {
        // Safe fallback for environments where YT API is unavailable
      }
    }

    if (window.YT?.Player) {
      mountPlayer()
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        prevCallback?.()
        mountPlayer()
      }

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }
    }

    let attempts = 0
    const poll = setInterval(() => {
      attempts++
      if (ytPlayerRef.current || attempts > 40) {
        clearInterval(poll)
        return
      }
      if (window.YT?.Player && ytHostRef.current) {
        mountPlayer()
        clearInterval(poll)
      }
    }, 150)

    return () => {
      cancelled = true
      clearInterval(poll)
    }
  }, [currentSong, isLoading])

  // Cleanup player on unmount
  useEffect(() => {
    return () => {
      try {
        ytPlayerRef.current?.destroy?.()
      } catch {
        // ignore cleanup errors
      }
      ytPlayerRef.current = null
      ytPlayerReadyRef.current = false
    }
  }, [])

  // 60-FPS Zero-Lag YouTube Clock Sync Loop with Sub-Tick Interpolation
  useEffect(() => {
    if (!isKaraokePlaying || !currentSong || currentSong.subtitles.length === 0) return

    let rafId = 0
    let lastYtReading = -1
    let anchorYtTime = currentTimeRef.current
    let anchorPerfTime = performance.now()

    const tick = (now: number) => {
      if (Date.now() < seekingUntilRef.current) {
        rafId = requestAnimationFrame(tick)
        return
      }

      let ytReading = -1

      // Source 1: Direct YT.Player API getCurrentTime()
      if (ytPlayerRef.current && ytPlayerReadyRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
        try {
          const t = ytPlayerRef.current.getCurrentTime()
          if (typeof t === 'number' && !isNaN(t) && t >= 0) {
            ytReading = t
          }
        } catch {
          // try passive source below
        }
      }

      // Source 2: Passive YouTube postMessage infoDelivery clock (backup if YT.Player getter unavailable)
      if (ytReading < 0 && ytMsgTimeRef.current >= 0) {
        const age = Math.min(0.35, (now - ytMsgPerfRef.current) / 1000)
        ytReading = ytMsgTimeRef.current + age
      }

      let liveTime = currentTimeRef.current
      if (ytReading >= 0) {
        if (Math.abs(ytReading - lastYtReading) > 0.005) {
          lastYtReading = ytReading
          anchorYtTime = ytReading
          anchorPerfTime = now
          liveTime = ytReading
        } else {
          // Smooth 60-FPS interpolation between YouTube's 250ms clock updates (capped at 0.35s)
          liveTime = anchorYtTime + Math.min(0.35, (now - anchorPerfTime) / 1000)
        }
      }

      currentTimeRef.current = liveTime

      // Direct DOM update for timer display (zero React re-renders!)
      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = `${liveTime.toFixed(1)} сек`
      }

      const effTime = Math.max(0, liveTime + timingOffsetRef.current)
      const firstStart = currentSong.subtitles[0].startSeconds
      const nowInIntro = effTime < firstStart

      if (nowInIntro !== isInIntroRef.current) {
        isInIntroRef.current = nowInIntro
        setIsInIntro(nowInIntro)
      }

      if (nowInIntro && introCountdownRef.current) {
        introCountdownRef.current.textContent = `${Math.max(0, firstStart - effTime).toFixed(1)}с`
      }

      // Dictation Mode Auto-Pause: pause right at the end of the active phrase so user types by ear
      if (musicModeRef.current === 'dictation' && dictationPhaseRef.current === 'LISTENING') {
        const currentTargetSub = currentSong.subtitles.find(s => s.id === activeSubIdRef.current)
        if (
          currentTargetSub &&
          effTime >= currentTargetSub.endSeconds - 0.08 &&
          dictationPausedLineIdRef.current !== currentTargetSub.id
        ) {
          dictationPausedLineIdRef.current = currentTargetSub.id
          try {
            ytPlayerRef.current?.pauseVideo?.()
          } catch {
            // ignore
          }
          setIsKaraokePlaying(false)
          dictationPhaseRef.current = 'TYPING'
          setDictationPhase('TYPING')
          setTypedLine('')
          typedLineRef.current = ''
          setLineCleared(false)
          soundService.playKeyClick(false)
          if (spotlightProgressRef.current) spotlightProgressRef.current.style.width = '100%'
          return
        }
      }

      const match = currentSong.subtitles.find(s => effTime >= s.startSeconds && effTime <= s.endSeconds)

      if (match) {
        if (match.id !== activeSubIdRef.current && musicModeRef.current !== 'dictation') {
          activeSubIdRef.current = match.id
          setActiveSubtitleId(match.id)
        }

        let nextWordIdx = -1
        if (match.words && match.words.length > 0) {
          nextWordIdx = match.words.findIndex(w => effTime >= w.start && effTime <= w.end)
          if (nextWordIdx === -1) {
            for (let i = match.words.length - 1; i >= 0; i--) {
              if (effTime >= match.words[i].start) {
                nextWordIdx = i
                break
              }
            }
          }
        } else {
          const wordsCount = match.textEn.split(' ').length
          const dur = Math.max(0.1, match.endSeconds - match.startSeconds)
          const progress = Math.max(0, Math.min(1, (effTime - match.startSeconds) / dur))
          nextWordIdx = Math.min(wordsCount - 1, Math.floor(progress * wordsCount))
        }

        if (nextWordIdx !== activeWordIdxRef.current) {
          activeWordIdxRef.current = nextWordIdx
          setActiveWordIdx(nextWordIdx)
        }

        const dur = Math.max(0.1, match.endSeconds - match.startSeconds)
        const pct = `${Math.max(0, Math.min(100, ((effTime - match.startSeconds) / dur) * 100)).toFixed(1)}%`
        if (activeProgressBarRef.current) activeProgressBarRef.current.style.width = pct
        if (spotlightProgressRef.current) spotlightProgressRef.current.style.width = pct
      } else if (activeWordIdxRef.current !== -1) {
        activeWordIdxRef.current = -1
        setActiveWordIdx(-1)
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [isKaraokePlaying, currentSong])

  // Auto-scroll active subtitle line smoothly inside its container only
  useEffect(() => {
    const container = subtitlesScrollContainerRef.current
    const activeEl = activeSubtitleRef.current
    if (container && activeEl) {
      const elTop = activeEl.offsetTop - container.offsetTop
      const elHeight = activeEl.offsetHeight
      const containerScrollTop = container.scrollTop
      const containerHeight = container.clientHeight

      if (elTop < containerScrollTop || elTop + elHeight > containerScrollTop + containerHeight - 10) {
        if (typeof container.scrollTo === 'function') {
          container.scrollTo({
            top: Math.max(0, elTop - 24),
            behavior: 'smooth'
          })
        }
      }
    }
  }, [activeSubtitleId])

  const executeSeekAndPlay = useCallback((targetTime: number, subId?: number) => {
    seekingUntilRef.current = Date.now() + 500
    currentTimeRef.current = targetTime
    if (timeDisplayRef.current) {
      timeDisplayRef.current.textContent = `${targetTime.toFixed(1)} сек`
    }
    if (subId !== undefined) {
      activeSubIdRef.current = subId
      setActiveSubtitleId(subId)
    }

    if (ytPlayerRef.current?.seekTo && ytPlayerReadyRef.current) {
      try {
        ytPlayerRef.current.seekTo(targetTime, true)
        ytPlayerRef.current.playVideo?.()
      } catch {
        // ignore
      }
    }
    setIsKaraokePlaying(true)
  }, [])

  const handlePlayWord = (e: React.MouseEvent, wordStart: number, subId: number) => {
    e.stopPropagation()
    executeSeekAndPlay(Math.max(0, wordStart - timingOffsetRef.current), subId)
  }

  const handleSkipIntro = () => {
    if (!currentSong || currentSong.subtitles.length === 0) return
    const firstVocalStart = Math.max(0, currentSong.subtitles[0].startSeconds - timingOffsetRef.current)
    executeSeekAndPlay(firstVocalStart, currentSong.subtitles[0].id)
  }

  const handleToggleKaraoke = () => {
    if (isKaraokePlaying) {
      try {
        ytPlayerRef.current?.pauseVideo?.()
      } catch {
        // ignore
      }
      setIsKaraokePlaying(false)
    } else {
      try {
        ytPlayerRef.current?.playVideo?.()
      } catch {
        // ignore
      }
      setIsKaraokePlaying(true)
    }
  }

  const handlePlayLine = (text: string, id: number, startSec: number) => {
    executeSeekAndPlay(Math.max(0, startSec - timingOffsetRef.current), id)
    soundService.speakText(text, 1.0)
  }

  // Smart Live Sync Lock: aligns the entire song's lyrics to the exact millisecond you hear this line
  const handleSyncToThisLine = (e: React.MouseEvent, subStartSeconds: number, subId: number) => {
    e.stopPropagation()
    let rawTime = currentTimeRef.current
    if (ytPlayerRef.current?.getCurrentTime && ytPlayerReadyRef.current) {
      try {
        const yt = ytPlayerRef.current.getCurrentTime()
        if (typeof yt === 'number' && !isNaN(yt)) rawTime = yt
      } catch {
        // use ref time
      }
    }
    const newOffset = Math.round((subStartSeconds - rawTime) * 10) / 10
    setTimingOffset(newOffset)
    activeSubIdRef.current = subId
    setActiveSubtitleId(subId)
    setSyncFlashMsg(`Синхронизировано (${newOffset >= 0 ? '+' : ''}${newOffset}с)`)
    setTimeout(() => setSyncFlashMsg(null), 2200)
  }

  const handleResetToStart = () => {
    seekingUntilRef.current = Date.now() + 500
    currentTimeRef.current = 0
    if (timeDisplayRef.current) {
      timeDisplayRef.current.textContent = '0.0 сек'
    }
    try {
      ytPlayerRef.current?.seekTo?.(0, true)
      ytPlayerRef.current?.pauseVideo?.()
    } catch {
      // ignore
    }
    setIsKaraokePlaying(false)
    setActiveWordIdx(-1)
    setIsInIntro(false)
    setActiveSubtitleId(currentSong?.subtitles[0]?.id || 1)
  }

  const handleStartTypingLesson = () => {
    if (!currentSong) return

    const lessonData: LessonData = {
      id: `music-${currentSong.id}`,
      title: `${currentSong.artist} — ${currentSong.title}`,
      level: currentSong.level,
      description: `Слепая печать по тексту песни «${currentSong.title}». ${currentSong.grammarFocus}.`,
      sentences: currentSong.typingSentences
    }

    onStartTyping(lessonData)
  }

  // Reset typed input whenever the active lyric line changes in Rhythm mode
  useEffect(() => {
    if (musicMode === 'rhythm') {
      setTypedLine('')
      typedLineRef.current = ''
      setLineCleared(false)
    }
  }, [activeSubtitleId, musicMode])

  const handleSelectMusicMode = (nextMode: 'karaoke' | 'rhythm' | 'dictation') => {
    setMusicMode(nextMode)
    musicModeRef.current = nextMode
    setTypedLine('')
    typedLineRef.current = ''
    setLineCleared(false)
    setDictationShowHint(false)
    dictationPausedLineIdRef.current = -1

    if (!currentSong || currentSong.subtitles.length === 0) return

    if (nextMode === 'dictation') {
      setDictationPhase('LISTENING')
      dictationPhaseRef.current = 'LISTENING'
      const curSub = currentSong.subtitles.find(s => s.id === activeSubIdRef.current) || currentSong.subtitles[0]
      if (curSub) {
        executeSeekAndPlay(Math.max(0, curSub.startSeconds - timingOffsetRef.current), curSub.id)
      }
    } else if (nextMode === 'rhythm' && !isKaraokePlaying) {
      const curSub = currentSong.subtitles.find(s => s.id === activeSubIdRef.current) || currentSong.subtitles[0]
      if (curSub) {
        executeSeekAndPlay(Math.max(0, curSub.startSeconds - timingOffsetRef.current), curSub.id)
      }
    }
  }

  const handleReplayDictationLine = useCallback(() => {
    if (!currentSong) return
    const curSub = currentSong.subtitles.find(s => s.id === activeSubIdRef.current) || currentSong.subtitles[0]
    if (!curSub) return
    dictationPausedLineIdRef.current = -1
    dictationPhaseRef.current = 'LISTENING'
    setDictationPhase('LISTENING')
    executeSeekAndPlay(Math.max(0, curSub.startSeconds - timingOffsetRef.current), curSub.id)
  }, [currentSong, executeSeekAndPlay])

  const handleAdvanceDictationLine = useCallback(() => {
    if (!currentSong) return
    const idx = currentSong.subtitles.findIndex(s => s.id === activeSubIdRef.current)
    const nextSub = idx >= 0 ? currentSong.subtitles[idx + 1] : undefined
    setTypedLine('')
    typedLineRef.current = ''
    setLineCleared(false)
    setDictationShowHint(false)
    dictationPausedLineIdRef.current = -1

    if (nextSub) {
      dictationPhaseRef.current = 'LISTENING'
      setDictationPhase('LISTENING')
      executeSeekAndPlay(Math.max(0, nextSub.startSeconds - timingOffsetRef.current), nextSub.id)
    } else {
      dictationPhaseRef.current = 'DONE'
      setDictationPhase('DONE')
      try {
        ytPlayerRef.current?.pauseVideo?.()
      } catch {
        // ignore
      }
      setIsKaraokePlaying(false)
      soundService.playCompletionChime()
    }
  }, [currentSong, executeSeekAndPlay])

  // Keyboard listener for Rhythm Typing (on beat) and Clip Dictation (after auto-pause)
  useEffect(() => {
    if (!currentSong) return
    const isTypingActive =
      musicMode === 'rhythm' || (musicMode === 'dictation' && dictationPhase === 'TYPING')
    if (!isTypingActive) return

    const activeSub = currentSong.subtitles.find(s => s.id === activeSubtitleId) || currentSong.subtitles[0]
    if (!activeSub) return
    const expectedLine = activeSub.textEn.toLowerCase().trim()

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta' || e.key === 'Tab') return

      if (e.key === 'Backspace') {
        e.preventDefault()
        const next = e.ctrlKey
          ? typedLineRef.current.replace(/\s*\S*$/, '')
          : typedLineRef.current.slice(0, -1)
        typedLineRef.current = next
        setTypedLine(next)
        return
      }

      if (e.key.length === 1 && !lineCleared) {
        e.preventDefault()
        const cur = typedLineRef.current
        if (cur.length >= expectedLine.length) return

        const typedKey = e.key.toLowerCase()
        const isCorrect = typedKey === expectedLine[cur.length]

        if (isCorrect) {
          soundService.playKeyClick(false)
        } else {
          soundService.playKeyClick(true)
          setMusicErrors(err => err + 1)
          setRhythmCombo(0)
        }

        const next = cur + typedKey
        typedLineRef.current = next
        setTypedLine(next)

        if (next === expectedLine) {
          setLineCleared(true)
          setLinesClearedCount(c => {
            const updatedCount = c + 1
            const rec = songProgressService.recordRhythmLines(selectedSongId, updatedCount)
            setSongRecords(prev => ({ ...prev, [selectedSongId]: rec }))
            achievementsService.checkAndUnlock({ rhythmLines: updatedCount })
            return updatedCount
          })
          setRhythmCombo(c => c + 1)
          soundService.playQuizCorrect()

          if (musicModeRef.current === 'dictation') {
            setTimeout(() => {
              handleAdvanceDictationLine()
            }, 650)
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSong, musicMode, dictationPhase, activeSubtitleId, lineCleared, handleAdvanceDictationLine])

  const aiAnalysis = AI_SONG_ANALYSES[selectedSongId] || AI_SONG_ANALYSES['queen-champions']
  const songVocab: SongVocabItem[] = SONG_VOCABULARY[selectedSongId] || SONG_VOCABULARY['queen-champions']
  const songQuizQuestions = useMemo(() => buildSongQuizQuestions(selectedSongId), [selectedSongId])
  const currentSongRecord = songRecords[selectedSongId]

  const handleSelectQuizOption = (optionIdx: number) => {
    if (quizSelectedOption !== null) return
    const q = songQuizQuestions[quizIndex]
    if (!q) return
    setQuizSelectedOption(optionIdx)
    if (optionIdx === q.correctIndex) {
      setQuizScore(s => s + 1)
      soundService.playQuizCorrect()
    } else {
      soundService.playQuizWrong()
    }
  }

  const handleNextQuizQuestion = () => {
    if (quizIndex + 1 < songQuizQuestions.length) {
      setQuizIndex(i => i + 1)
      setQuizSelectedOption(null)
    } else {
      setQuizFinished(true)
      const rec = songProgressService.recordQuizScore(selectedSongId, quizScore, songQuizQuestions.length)
      setSongRecords(prev => ({ ...prev, [selectedSongId]: rec }))
      if (quizScore === songQuizQuestions.length && songQuizQuestions.length > 0) {
        achievementsService.checkAndUnlock({ songQuizPerfect: true })
      }
      soundService.playCompletionChime()
    }
  }

  const handleRestartSongQuiz = () => {
    setQuizIndex(0)
    setQuizSelectedOption(null)
    setQuizScore(0)
    setQuizFinished(false)
  }

  const handleSaveSongVocabWord = async (item: SongVocabItem) => {
    if (savedVocabWords[item.word] || savingVocabWord === item.word) return
    setSavingVocabWord(item.word)
    try {
      await api.addVocabularyWord({
        word: item.word,
        translation: item.translation,
        phonetic: item.ipa,
        partOfSpeech: item.pos
      })
      setSavedVocabWords(prev => ({ ...prev, [item.word]: true }))
      soundService.playQuizCorrect()
    } catch {
      // Fallback: mark saved locally so UX stays responsive
      setSavedVocabWords(prev => ({ ...prev, [item.word]: true }))
    } finally {
      setSavingVocabWord(null)
    }
  }

  // Count tracks per CEFR level for scalable filter pills
  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const s of songsList) {
      const lvl = s.level.toUpperCase()
      counts[lvl] = (counts[lvl] || 0) + 1
    }
    return counts
  }, [songsList])

  const availableLevels = useMemo(() => {
    const ordered = MUSIC_LEVEL_ORDER.filter(lvl => (levelCounts[lvl] || 0) > 0)
    return ['ALL', ...ordered]
  }, [levelCounts])

  const filteredSongs = useMemo(() => {
    const q = songSearchQuery.trim().toLowerCase()
    return songsList.filter(song => {
      const matchesLevel = selectedLevelFilter === 'ALL' || song.level.toUpperCase() === selectedLevelFilter
      const matchesQuery =
        !q ||
        song.title.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q) ||
        song.grammarFocus.toLowerCase().includes(q) ||
        song.level.toLowerCase().includes(q)
      return matchesLevel && matchesQuery
    })
  }, [songsList, selectedLevelFilter, songSearchQuery])

  const groupedSongsByLevel = useMemo(() => {
    const groups: Array<{ level: string; items: typeof songsList }> = []
    for (const lvl of MUSIC_LEVEL_ORDER) {
      const items = filteredSongs.filter(s => s.level.toUpperCase() === lvl)
      if (items.length > 0) {
        groups.push({ level: lvl, items })
      }
    }
    const other = filteredSongs.filter(
      s => !MUSIC_LEVEL_ORDER.includes(s.level.toUpperCase() as (typeof MUSIC_LEVEL_ORDER)[number])
    )
    if (other.length > 0) {
      groups.push({ level: 'OTHER', items: other })
    }
    return groups
  }, [filteredSongs])

  const handleRandomSong = () => {
    const pool = filteredSongs.length > 0 ? filteredSongs : songsList
    if (pool.length === 0) return
    const alternatives = pool.filter(s => s.id !== selectedSongId)
    const pickPool = alternatives.length > 0 ? alternatives : pool
    const pick = pickPool[Math.floor(Math.random() * pickPool.length)]
    setSelectedSongId(pick.id)
  }

  return (
    <div
      className="relative space-y-6 max-w-5xl mx-auto w-full animate-fade-in"
      data-testid="music-clips-view"
      onMouseUp={handleTextSelection}
    >
      {/* Subtle GPU-only snowfall overlay when Last Christmas is active */}
      {selectedSongId === 'wham-last-christmas' && (
        <div
          className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
          aria-hidden="true"
          data-testid="christmas-snowfall"
        >
          {SNOWFLAKES.map(flake => (
            <span
              key={flake.id}
              className="snowflake-particle"
              style={{
                left: flake.left,
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                opacity: flake.opacity,
                animationDuration: flake.duration,
                animationDelay: flake.delay
              }}
            />
          ))}
        </div>
      )}
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-[#090d16]/95 border border-white/[0.08] shadow-2xl shadow-black/80">
        <div className="flex items-center space-x-3.5">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-mono transition cursor-pointer active:scale-95"
              title="Назад к тренировке"
              data-testid="music-back-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>
          )}
          <div className="w-11 h-11 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-lg shadow-sky-500/20">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Музыкальные клипы & Разбор грамматики
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-sky-300 border border-white/[0.08] font-mono">
                YouTube Clip Sync
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Включайте клип — слова идут по темпу песни! Выделяйте любое слово для перевода и разбора.
            </p>
          </div>
        </div>

        {currentSong && (
          <button
            onClick={handleStartTypingLesson}
            className="px-4 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs shadow-xl shadow-sky-500/25 transition-all flex items-center space-x-2 cursor-pointer active:scale-[0.98]"
            data-testid="start-music-typing-btn"
          >
            <Sparkles className="w-4 h-4" />
            <span>Начать печать песни</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Scalable Music Library Catalog: Level Filter + Search + Grouped CEFR Tracks */}
      <div
        className="rounded-3xl bg-[#090d16]/95 border border-white/[0.08] p-4 sm:p-5 space-y-4 shadow-2xl shadow-black/70"
        data-testid="music-catalog"
      >
        {/* Top Toolbar: Catalog Title, Active Track Pill, Random, Collapse */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-400/25 flex items-center justify-center text-sky-400">
              <Library className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Каталог клипов и песен</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300">
                  {filteredSongs.length} / {songsList.length}
                </span>
              </div>
              {currentSong && (
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Выбран:{' '}
                  <span className="text-sky-300 font-semibold">
                    {currentSong.artist} — {currentSong.title}
                  </span>{' '}
                  <span className="font-mono text-[10px] text-slate-500">({currentSong.level})</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomSong}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] text-slate-300 hover:text-white border border-white/[0.08] text-[11px] font-mono transition flex items-center gap-1.5 cursor-pointer"
              title="Выбрать случайный трек из каталога"
              data-testid="music-random-btn"
            >
              <Shuffle className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Случайный трек</span>
            </button>

            <button
              onClick={() => setIsCatalogOpen(o => !o)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] text-slate-300 hover:text-white border border-white/[0.08] text-[11px] font-mono transition flex items-center gap-1.5 cursor-pointer"
              aria-expanded={isCatalogOpen}
              data-testid="music-catalog-toggle"
            >
              <span>{isCatalogOpen ? 'Свернуть каталог' : 'Выбрать песню'}</span>
              {isCatalogOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {isCatalogOpen && (
          <div className="space-y-4 pt-1 border-t border-white/[0.06]">
            {/* Filter Controls: CEFR Level Pills + Instant Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Фильтр клипов по уровню английского">
                {availableLevels.map(lvl => {
                  const isActive = selectedLevelFilter === lvl
                  const count = lvl === 'ALL' ? songsList.length : levelCounts[lvl] || 0
                  return (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevelFilter(lvl)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-sky-400 text-slate-950 font-bold shadow-lg shadow-sky-500/25'
                          : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.07] border border-white/[0.07]'
                      }`}
                      data-testid={`music-level-filter-${lvl}`}
                    >
                      <span>{lvl === 'ALL' ? 'Все уровни' : lvl}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                          isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-white/[0.06] text-slate-400'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={songSearchQuery}
                  onChange={e => setSongSearchQuery(e.target.value)}
                  placeholder="Поиск песни, артиста, темы..."
                  aria-label="Поиск клипа или песни"
                  data-testid="music-search-input"
                  className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-[#050810] border border-white/[0.09] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400/60 focus:ring-1 focus:ring-sky-400/30 transition"
                />
                {songSearchQuery && (
                  <button
                    onClick={() => setSongSearchQuery('')}
                    aria-label="Очистить поиск песен"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Grouped Songs by CEFR Level (scales cleanly to dozens of tracks) */}
            {groupedSongsByLevel.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#050810]/80 border border-white/[0.06] text-center space-y-2">
                <p className="text-xs text-slate-400">По вашему запросу треков не найдено.</p>
                <button
                  onClick={() => {
                    setSelectedLevelFilter('ALL')
                    setSongSearchQuery('')
                  }}
                  className="px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-400/30 text-xs font-mono cursor-pointer transition"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {groupedSongsByLevel.map(group => {
                  const meta = MUSIC_LEVEL_META[group.level] ?? {
                    label: group.level,
                    subtitle: 'Музыкальная подборка',
                    dotClass: 'bg-sky-400',
                    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-400/30'
                  }
                  return (
                    <div
                      key={group.level}
                      className="space-y-2"
                      data-testid={`music-level-group-${group.level}`}
                    >
                      <div className="flex items-center justify-between gap-2 px-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${meta.dotClass}`} />
                          <span className="text-xs font-bold text-slate-200 tracking-wide">{meta.label}</span>
                          <span className="text-[11px] text-slate-500 hidden md:inline">— {meta.subtitle}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          {group.items.length} {group.items.length === 1 ? 'трек' : group.items.length < 5 ? 'трека' : 'треков'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {group.items.map(song => {
                          const isSelected = song.id === selectedSongId
                          const isChristmas = song.id === 'wham-last-christmas'
                          const rec = songRecords[song.id]
                          return (
                            <button
                              key={song.id}
                              onClick={() => setSelectedSongId(song.id)}
                              className={`group flex flex-col justify-between gap-2 p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                                isSelected
                                  ? 'bg-sky-500/[0.11] border-sky-400/60 shadow-lg shadow-sky-500/10 ring-1 ring-sky-400/30'
                                  : 'bg-[#050810]/85 border-white/[0.06] hover:border-white/[0.16] hover:bg-white/[0.04]'
                              }`}
                              data-testid={`song-tab-${song.id}`}
                            >
                              <div className="flex items-start justify-between gap-2 w-full">
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                                    <span className="truncate">{song.title}</span>
                                    {isChristmas && (
                                      <Snowflake className="w-3 h-3 text-sky-300 shrink-0" aria-hidden="true" />
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 truncate">{song.artist}</div>
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border shrink-0 ${meta.badgeClass}`}
                                >
                                  {song.level}
                                </span>
                              </div>

                              {rec && (rec.bestWpm || rec.bestQuizTotal || rec.bestRhythmLines) && (
                                <div
                                  className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono"
                                  data-testid={`song-record-${song.id}`}
                                >
                                  {rec.bestWpm ? (
                                    <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-400/25 flex items-center gap-1">
                                      <Trophy className="w-2.5 h-2.5" />
                                      {rec.bestWpm} WPM
                                    </span>
                                  ) : null}
                                  {rec.bestQuizTotal ? (
                                    <span className="px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-400/25">
                                      🧠 {rec.bestQuizScore}/{rec.bestQuizTotal}
                                    </span>
                                  ) : null}
                                  {rec.bestRhythmLines ? (
                                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-400/25">
                                      ✓ {rec.bestRhythmLines} стр.
                                    </span>
                                  ) : null}
                                </div>
                              )}

                              <div className="flex items-center justify-between gap-2 w-full pt-1 border-t border-white/[0.05]">
                                <span className="text-[10px] font-mono text-sky-300/80 truncate">
                                  {song.grammarFocus}
                                </span>
                                {isSelected ? (
                                  <span className="text-[10px] font-mono text-emerald-300 font-bold shrink-0">
                                    ● Активен
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300 shrink-0">
                                    {song.sentenceCount} фраз
                                  </span>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Song Detail Body: 2 Columns (Equal Height) */}
      {currentSong && !isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* LEFT COLUMN: YouTube Clip + Live Karaoke Spotlight + Synchronized Subtitles */}
          <div className="lg:col-span-7 space-y-4">
            {/* Video Player Card */}
            <div className="rounded-3xl bg-[#090d16] border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/80">
              <div className="relative aspect-video w-full bg-[#050810] flex items-center justify-center">
                <div ref={ytHostRef} className="w-full h-full" />
              </div>

              {/* Player Header bar & Karaoke Controls */}
              <div className="p-3.5 bg-white/[0.02] flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06]">
                <div>
                  <h3 className="text-xs font-bold text-white flex flex-wrap items-center gap-2">
                    <span>
                      {currentSong.artist} — {currentSong.title}
                    </span>
                    {currentSongRecord && (currentSongRecord.bestWpm || currentSongRecord.bestQuizTotal) && (
                      <span
                        className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30"
                        data-testid="active-song-best-badge"
                      >
                        <Trophy className="w-3 h-3" />
                        <span>
                          Рекорд:
                          {currentSongRecord.bestWpm ? ` ${currentSongRecord.bestWpm} WPM` : ''}
                          {currentSongRecord.bestQuizTotal
                            ? ` • Тест ${currentSongRecord.bestQuizScore}/${currentSongRecord.bestQuizTotal}`
                            : ''}
                        </span>
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-sky-400 font-mono mt-0.5">{currentSong.grammarFocus}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleToggleKaraoke}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-mono font-bold shadow-lg shadow-sky-500/20 transition cursor-pointer active:scale-[0.98]"
                    data-testid="karaoke-toggle-btn"
                  >
                    {isKaraokePlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Пауза</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Включить клип</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSkipIntro}
                    className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-mono transition cursor-pointer"
                    title="Перемотать клип сразу к первому слову вокала"
                  >
                    К вокалу ⏩
                  </button>

                  <button
                    onClick={handleResetToStart}
                    className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] transition cursor-pointer"
                    title="С начала клипа (0:00)"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 3-Way Interactive Mode Switcher: Karaoke | Rhythm Typing | Auto-Pause Dictation */}
              <div className="px-3.5 py-2.5 bg-[#070b14] border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.07] text-[11px] font-mono">
                  <button
                    onClick={() => handleSelectMusicMode('karaoke')}
                    className={`px-2.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                      musicMode === 'karaoke'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    data-testid="music-mode-karaoke"
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Караоке</span>
                  </button>
                  <button
                    onClick={() => handleSelectMusicMode('rhythm')}
                    className={`px-2.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                      musicMode === 'rhythm'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    data-testid="music-mode-rhythm"
                    title="Печатайте текст прямо по темпу играющей песни"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Ритм-печать</span>
                  </button>
                  <button
                    onClick={() => handleSelectMusicMode('dictation')}
                    className={`px-2.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                      musicMode === 'dictation'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    data-testid="music-mode-dictation"
                    title="Клип поёт фразу → авто-пауза → вы печатаете на слух → клип продолжается"
                  >
                    <Ear className="w-3.5 h-3.5" />
                    <span>Диктант (авто-пауза)</span>
                  </button>
                </div>

                {musicMode !== 'karaoke' && (
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                      ✓ {linesClearedCount}
                    </span>
                    {rhythmCombo >= 2 && (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-400/30">
                        🔥 {rhythmCombo}x
                      </span>
                    )}
                    <span className="text-rose-400">Ошибки: {musicErrors}</span>
                  </div>
                )}
              </div>

              {/* Interactive Deck below Video: Karaoke Teleprompter OR Rhythm Typing OR Auto-Pause Dictation */}
              {(() => {
                const activeIdx = currentSong.subtitles.findIndex(s => s.id === activeSubtitleId)
                const activeSub = currentSong.subtitles[activeIdx] || currentSong.subtitles[0]
                const nextSub = activeIdx >= 0 ? currentSong.subtitles[activeIdx + 1] : currentSong.subtitles[1]
                if (!activeSub) return null

                // MODE 1: STANDARD KARAOKE TELEPROMPTER
                if (musicMode === 'karaoke') {
                  const spotlightWords = activeSub.textEn.split(' ')
                  return (
                    <div className="relative px-5 py-4 bg-gradient-to-b from-[#070b14] to-[#050810] border-t border-white/[0.06] space-y-2">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-base sm:text-lg leading-snug select-text">
                        {spotlightWords.map((w, idx) => {
                          const isCur = isKaraokePlaying && !isInIntro && idx === activeWordIdx
                          const isPast = isKaraokePlaying && !isInIntro && activeWordIdx > -1 && idx < activeWordIdx
                          return (
                            <span
                              key={idx}
                              onClick={() => selectWord(w)}
                              className={`cursor-pointer ${
                                isCur
                                  ? 'text-white font-black bg-sky-500/30 px-2 py-0.5 rounded-lg border border-sky-400/60 shadow-[0_0_16px_rgba(56,189,248,0.45)]'
                                  : isPast
                                    ? 'text-sky-300 font-bold'
                                    : 'text-slate-400 hover:text-sky-200 font-medium'
                              }`}
                              title="Нажмите на слово для перевода"
                            >
                              {w}
                            </span>
                          )
                        })}
                      </div>
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-slate-400">{activeSub.textRu}</span>
                        {nextSub && (
                          <span className="text-[11px] font-mono text-slate-600 truncate max-w-[45%] hidden sm:inline">
                            Далее: {nextSub.textEn}
                          </span>
                        )}
                      </div>
                      <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                        <div
                          ref={spotlightProgressRef}
                          className="h-full bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-500 rounded-full"
                          style={{ width: '0%' }}
                        />
                      </div>
                    </div>
                  )
                }

                // MODE 2 & MODE 3: RHYTHM TYPING OR AUTO-PAUSE CLIP DICTATION
                const expectedLine = activeSub.textEn.toLowerCase().trim()
                const isDictation = musicMode === 'dictation'
                const shouldMask = isDictation && dictationPhase === 'TYPING' && !dictationShowHint && !lineCleared

                return (
                  <div
                    className="relative px-5 py-4 bg-gradient-to-b from-[#070b14] to-[#050810] border-t border-white/[0.06] space-y-3"
                    data-testid={isDictation ? 'music-dictation-panel' : 'music-rhythm-panel'}
                  >
                    {/* Status & Controls Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      {isDictation ? (
                        dictationPhase === 'DONE' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Диктант по песне завершён!</span>
                          </span>
                        ) : dictationPhase === 'LISTENING' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/30 font-mono">
                            <Ear className="w-3.5 h-3.5 animate-pulse" />
                            <span>Слушайте строку {activeIdx + 1}/{currentSong.subtitles.length} — авто-пауза в конце фразы...</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold">
                            <span>⏸ Пауза! Печатайте услышанную строку с клавиатуры</span>
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 font-mono">
                          <Zap className="w-3.5 h-3.5" />
                          <span>{lineCleared ? '✓ В темпе! Ждём следующую строку...' : 'Печатайте прямо в такт песни с клавиатуры'}</span>
                        </span>
                      )}

                      {isDictation && dictationPhase !== 'DONE' && (
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <button
                            onClick={handleReplayDictationLine}
                            className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-sky-500/20 text-sky-300 border border-white/[0.08] transition cursor-pointer flex items-center gap-1"
                            data-testid="dictation-replay-btn"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Переслушать</span>
                          </button>
                          <button
                            onClick={() => setDictationShowHint(h => !h)}
                            className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-amber-500/20 text-amber-300 border border-white/[0.08] transition cursor-pointer flex items-center gap-1"
                            data-testid="dictation-hint-btn"
                          >
                            {dictationShowHint ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            <span>{dictationShowHint ? 'Скрыть' : 'Подсказка'}</span>
                          </button>
                          {dictationPhase === 'LISTENING' && (
                            <button
                              onClick={() => {
                                dictationPausedLineIdRef.current = activeSub.id
                                try { ytPlayerRef.current?.pauseVideo?.() } catch { /* ignore */ }
                                setIsKaraokePlaying(false)
                                dictationPhaseRef.current = 'TYPING'
                                setDictationPhase('TYPING')
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 transition cursor-pointer"
                              data-testid="dictation-force-type-btn"
                            >
                              Печатать сейчас
                            </button>
                          )}
                          <button
                            onClick={handleAdvanceDictationLine}
                            className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/[0.08] transition cursor-pointer flex items-center gap-1"
                            data-testid="dictation-skip-btn"
                          >
                            <span>Дальше</span>
                            <SkipForward className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Live Character-by-Character Typing Line */}
                    <div
                      className="font-mono text-lg sm:text-xl leading-relaxed tracking-wide p-3.5 rounded-2xl bg-[#090d16] border border-white/[0.08] min-h-[3.5rem] whitespace-pre-wrap break-words"
                      data-testid="music-typing-line"
                    >
                      {isDictation && dictationPhase === 'LISTENING' ? (
                        <span className="text-slate-500 italic text-sm">
                          🎧 Внимательно слушайте строку... Как только она закончится, клип сам встанет на паузу.
                        </span>
                      ) : (
                        expectedLine.split('').map((ch, idx) => {
                          let cls = 'text-slate-500'
                          let display = ch
                          const isCurrent = idx === typedLine.length && !lineCleared

                          if (idx < typedLine.length) {
                            if (typedLine[idx] === ch) {
                              cls = 'text-emerald-400 font-semibold'
                            } else {
                              cls = 'text-rose-400 bg-rose-500/30 underline decoration-rose-500 font-semibold'
                              display = ch === ' ' ? '␣' : ch
                            }
                          } else if (shouldMask) {
                            display = ch === ' ' ? ' ' : '•'
                            cls = isCurrent ? 'text-amber-300' : 'text-slate-600'
                          } else if (isCurrent) {
                            cls = 'text-white'
                          }

                          return (
                            <span key={idx} className={`relative ${ch === ' ' ? 'inline' : 'inline-block'} ${cls}`}>
                              {isCurrent && (
                                <span className="absolute -left-[1px] top-0.5 bottom-0.5 w-[2px] bg-sky-400 animate-pulse pointer-events-none" />
                              )}
                              {display}
                            </span>
                          )
                        })
                      )}
                    </div>

                    {/* Russian Translation Hint & Next Line */}
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-slate-400">
                        {isDictation ? `Смысл фразы: «${activeSub.textRu}»` : activeSub.textRu}
                      </span>
                      {!isDictation && nextSub && (
                        <span className="text-[11px] font-mono text-slate-500 truncate max-w-[45%] hidden sm:inline">
                          Далее: {nextSub.textEn}
                        </span>
                      )}
                    </div>

                    {/* Tempo Progress Bar */}
                    <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        ref={spotlightProgressRef}
                        className={`h-full rounded-full ${
                          lineCleared
                            ? 'bg-emerald-400'
                            : isDictation
                              ? 'bg-gradient-to-r from-amber-400 to-sky-400'
                              : 'bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500'
                        }`}
                        style={{ width: lineCleared ? '100%' : '0%' }}
                      />
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Synchronized Karaoke Subtitles + Word Translation Popover */}
            <div className="relative p-5 rounded-3xl bg-[#090d16] border border-white/[0.08] space-y-3 shadow-2xl shadow-black/60">
              {selectedWord && (
                <WordPopover
                  word={selectedWord}
                  onClose={clearSelectedWord}
                  className="absolute -top-16 left-1/2 -translate-x-1/2"
                />
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5 text-sky-400" />
                  <span>Караоке-субтитры</span>
                  {syncFlashMsg && (
                    <span className="text-[10px] text-emerald-300 font-mono font-semibold bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-400/30 animate-fade-in">
                      ✓ {syncFlashMsg}
                    </span>
                  )}
                </h4>

                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <button
                    onClick={() => setTranslateOnClick(t => !t)}
                    className={`px-2 py-0.5 rounded-xl text-[11px] border transition cursor-pointer flex items-center gap-1 ${
                      translateOnClick
                        ? 'bg-sky-500/20 text-sky-300 border-sky-400/40 font-semibold'
                        : 'bg-white/[0.03] text-slate-400 border-white/[0.07] hover:text-white'
                    }`}
                    data-testid="lyrics-translate-mode-btn"
                    title="Клик по любому слову открывает перевод и сохранение в словарь"
                  >
                    <Languages className="w-3 h-3" />
                    <span>Словарь по клику: {translateOnClick ? 'ВКЛ' : 'ВЫКЛ'}</span>
                  </button>

                  {/* Calibration offset controls */}
                  <div
                    className="flex items-center space-x-1 bg-white/[0.02] px-2 py-0.5 rounded-xl border border-white/[0.06] text-[11px]"
                    title="Точная подстройка сдвига субтитров под звук клипа"
                  >
                    <span className="text-slate-500 text-[10px]">Сдвиг:</span>
                    <button
                      onClick={() => setTimingOffset(prev => Math.round((prev - 0.2) * 10) / 10)}
                      className="px-1 py-0.5 rounded hover:bg-sky-500/20 text-sky-300 transition cursor-pointer"
                    >
                      -0.2s
                    </button>
                    <button
                      onClick={() => setTimingOffset(0)}
                      className={`px-1 py-0.5 rounded transition cursor-pointer ${
                        timingOffset === 0 ? 'text-slate-400' : 'text-sky-400 font-bold bg-sky-500/20'
                      }`}
                    >
                      {timingOffset === 0 ? '0.0s' : `${timingOffset > 0 ? '+' : ''}${timingOffset}s`}
                    </button>
                    <button
                      onClick={() => setTimingOffset(prev => Math.round((prev + 0.2) * 10) / 10)}
                      className="px-1 py-0.5 rounded hover:bg-sky-500/20 text-sky-300 transition cursor-pointer"
                    >
                      +0.2s
                    </button>
                  </div>

                  <span ref={timeDisplayRef} className="text-sky-400 font-bold min-w-[50px] text-right">
                    0.0 сек
                  </span>
                </div>
              </div>

              {/* Instrumental Intro Live Banner */}
              {isKaraokePlaying && isInIntro && currentSong.subtitles[0] && (
                <div className="p-3 rounded-2xl bg-sky-500/[0.07] border border-sky-400/30 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-sky-300 font-mono">
                    <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
                    <span>Вступление (инструментал) • Вокал через:</span>
                    <span ref={introCountdownRef} className="font-bold text-white text-sm">
                      {currentSong.subtitles[0].startSeconds.toFixed(1)}с
                    </span>
                  </div>
                  <button
                    onClick={handleSkipIntro}
                    className="px-3 py-1 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold font-mono text-[11px] transition shadow-md shadow-sky-500/20 cursor-pointer flex items-center space-x-1"
                  >
                    <span>Пропустить к пению</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div
                ref={subtitlesScrollContainerRef}
                className="space-y-2.5 max-h-64 overflow-y-auto pr-1.5 scroll-smooth"
                data-testid="subtitles-scroll-container"
              >
                {currentSong.subtitles.map(sub => {
                  const isActive = activeSubtitleId === sub.id
                  const words = sub.textEn.split(' ')

                  return (
                    <div
                      key={sub.id}
                      ref={isActive ? activeSubtitleRef : null}
                      onClick={() => {
                        if (!translateOnClick) handlePlayLine(sub.textEn, sub.id, sub.startSeconds)
                      }}
                      className={`p-3.5 rounded-2xl border transition-colors cursor-pointer flex flex-col gap-2 ${
                        isActive
                          ? 'bg-white/[0.07] border-sky-400/50 text-white shadow-xl shadow-sky-500/10 ring-1 ring-sky-400/30'
                          : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] text-slate-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1">
                          <div className="font-mono text-sm sm:text-base leading-relaxed flex flex-wrap gap-1.5 select-text">
                            {words.map((w, wIdx) => {
                              const cleaned = normalizeEnglishWord(w)
                              const isCurrentWord = isActive && isKaraokePlaying && !isInIntro && wIdx === activeWordIdx
                              const isPastWord =
                                isActive && isKaraokePlaying && !isInIntro && activeWordIdx > -1 && wIdx < activeWordIdx
                              const wordTiming = sub.words?.[wIdx]

                              let wordStyle = 'text-slate-400 hover:text-sky-300 px-0.5'
                              if (isCurrentWord) {
                                wordStyle =
                                  'text-white font-extrabold bg-sky-500/30 px-2 py-0.5 rounded-lg border border-sky-400/50 shadow-[0_0_12px_rgba(56,189,248,0.35)] inline-block'
                              } else if (selectedWord === cleaned) {
                                wordStyle = 'bg-sky-400/25 text-sky-200 underline decoration-sky-400 px-1 rounded'
                              } else if (isPastWord) {
                                wordStyle = 'text-sky-300 font-medium px-0.5'
                              }

                              return (
                                <span
                                  key={wIdx}
                                  onClick={e => {
                                    if (translateOnClick) {
                                      e.stopPropagation()
                                      selectWord(w)
                                    } else if (wordTiming) {
                                      handlePlayWord(e, wordTiming.start, sub.id)
                                    }
                                  }}
                                  className={`${wordStyle} cursor-pointer`}
                                  data-testid={`lyric-word-${sub.id}-${cleaned}`}
                                  title={
                                    translateOnClick
                                      ? 'Нажмите для перевода'
                                      : wordTiming
                                        ? `Перейти к ${wordTiming.start}с`
                                        : undefined
                                  }
                                >
                                  {w}
                                </span>
                              )
                            })}
                          </div>

                          <div className="text-xs text-slate-400">{sub.textRu}</div>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                          {isKaraokePlaying && (
                            <button
                              onClick={e => handleSyncToThisLine(e, sub.startSeconds, sub.id)}
                              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-sky-500/20 text-slate-400 hover:text-sky-300 transition cursor-pointer"
                              title="Поймать ритм: нажмите в момент, когда звучит начало этой строки"
                            >
                              <Crosshair className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              handlePlayLine(sub.textEn, sub.id, sub.startSeconds)
                            }}
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-sky-400 transition cursor-pointer"
                            title="Перемотать клип к этой строке"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {isActive && isKaraokePlaying && !isInIntro && (
                        <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden mt-1">
                          <div
                            ref={activeProgressBarRef}
                            className="h-full bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-500 rounded-full"
                            style={{ width: '0%' }}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Expanded Grammar Breakdown | Song Vocab | Quiz | Meaning (Matches Left Column Height) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="p-5 rounded-3xl bg-[#090d16] border border-white/[0.08] flex flex-col gap-4 shadow-2xl flex-1">
              {/* Tab Switcher: Grammar | Vocabulary | Comprehension Quiz | AI Meaning */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06] text-[11px] font-mono">
                <button
                  onClick={() => setActiveTab('grammar')}
                  className={`py-2 px-1.5 rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    activeTab === 'grammar'
                      ? 'bg-white/[0.1] text-white font-semibold shadow-sm border border-white/[0.1]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  data-testid="tab-grammar-rules"
                >
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Разбор правил песни</span>
                </button>

                <button
                  onClick={() => setActiveTab('vocab')}
                  className={`py-2 px-1.5 rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    activeTab === 'vocab'
                      ? 'bg-white/[0.1] text-white font-semibold shadow-sm border border-white/[0.1]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  data-testid="tab-song-vocab"
                >
                  <Languages className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span className="truncate">Словарь ({songVocab.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`py-2 px-1.5 rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    activeTab === 'quiz'
                      ? 'bg-purple-500/20 text-purple-200 font-semibold shadow-sm border border-purple-400/35'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  data-testid="tab-song-quiz"
                >
                  <Brain className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                  <span className="truncate">Тест ({songQuizQuestions.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('ai-meaning')}
                  className={`py-2 px-1.5 rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                    activeTab === 'ai-meaning'
                      ? 'bg-white/[0.1] text-white font-semibold shadow-sm border border-white/[0.1]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  data-testid="tab-ai-meaning"
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0 text-sky-400" />
                  <span className="truncate">Смысл песни</span>
                </button>
              </div>

              {/* TAB 1: EXPANDED GRAMMAR BREAKDOWN (Spacious, matches AI Meaning height!) */}
              {activeTab === 'grammar' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-500/10 via-transparent to-indigo-500/10 border border-white/[0.08] flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                        <span>Грамматический фокус трека</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{currentSong.grammarFocus}</p>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 min-h-0 max-h-[720px] overflow-y-auto pr-1.5">
                    {currentSong.grammarBreakdown.map((rule, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-2.5 hover:border-sky-400/30 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-sky-300">{rule.ruleTitle}</span>
                          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-400/25 shrink-0">
                            {rule.grammarTag}
                          </span>
                        </div>

                        <div className="font-mono text-xs sm:text-sm text-white bg-[#050810] p-3 rounded-xl border border-white/[0.07] select-text">
                          «{rule.lyricQuote}»
                        </div>

                        <div className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                          {rule.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: SONG VOCABULARY (Key Unfamiliar Words + Context from Song) */}
              {activeTab === 'vocab' && (
                <div className="space-y-3 animate-fade-in" data-testid="song-vocab-content">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-transparent to-sky-500/10 border border-white/[0.08]">
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ключевая лексика и идиомы из песни</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Наиболее полезные и редкие выражения с переводом и точным контекстом из трека.
                    </p>
                  </div>

                  <div className="space-y-2.5 flex-1 min-h-0 max-h-[720px] overflow-y-auto pr-1.5">
                    {songVocab.map(item => {
                      const isSaved = Boolean(savedVocabWords[item.word])
                      const isSaving = savingVocabWord === item.word
                      return (
                        <div
                          key={item.word}
                          className="p-3.5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-2 hover:border-emerald-400/30 transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-sm font-bold text-white font-mono">{item.word}</span>
                                <span className="text-[11px] font-mono text-slate-400">{item.ipa}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-400/25">
                                  {item.level}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">{item.pos}</span>
                              </div>
                              <div className="text-xs text-slate-200 mt-1 leading-relaxed">{item.translation}</div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => soundService.speakText(item.word, 0.95)}
                                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-sky-500/20 text-sky-400 transition cursor-pointer"
                                title="Озвучить слово"
                                aria-label={`Озвучить ${item.word}`}
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleSaveSongVocabWord(item)}
                                disabled={isSaved || isSaving}
                                className={`px-2 py-1.5 rounded-lg text-[10px] font-mono transition flex items-center gap-1 cursor-pointer ${
                                  isSaved
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/35'
                                    : 'bg-white/[0.05] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-200 border border-white/[0.08]'
                                }`}
                                data-testid={`save-song-vocab-${item.word.replace(/\s+/g, '-')}`}
                              >
                                {isSaved ? <Check className="w-3 h-3" /> : <BookmarkPlus className="w-3 h-3" />}
                                <span>{isSaved ? 'В словаре' : 'В словарь'}</span>
                              </button>
                            </div>
                          </div>

                          <div className="bg-[#050810] px-3 py-2 rounded-xl border border-white/[0.06] space-y-1">
                            <div className="font-mono text-[11px] text-sky-200/90 select-text">
                              <span className="text-slate-500 mr-1.5">Контекст:</span>«{item.contextQuote}»
                            </div>
                            <div className="text-[11px] text-slate-400 leading-snug">
                              {item.contextTranslation}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: SONG COMPREHENSION QUIZ (Complex Words + Figurative Quotes / Idioms) */}
              {activeTab === 'quiz' && (
                <div className="space-y-3 animate-fade-in" data-testid="song-quiz-content">
                  {quizFinished ? (
                    <div
                      className="p-5 rounded-2xl bg-gradient-to-b from-purple-500/15 to-[#050810] border border-purple-400/30 text-center space-y-3"
                      data-testid="song-quiz-result"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/35 text-amber-300 flex items-center justify-center mx-auto">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Тест на понимание песни завершён!</div>
                        <div className="text-2xl font-black font-mono text-purple-300 mt-1">
                          {quizScore} / {songQuizQuestions.length}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Лучший результат по «{currentSong.title}» автоматически сохранён.
                        </p>
                      </div>
                      <button
                        onClick={handleRestartSongQuiz}
                        className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/35 text-xs font-mono font-bold transition cursor-pointer"
                        data-testid="song-quiz-restart-btn"
                      >
                        Пройти тест заново
                      </button>
                    </div>
                  ) : (
                    (() => {
                      const q = songQuizQuestions[quizIndex]
                      if (!q) return null
                      const isAnswered = quizSelectedOption !== null
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-400/30">
                              {q.badge}
                            </span>
                            <span className="text-slate-400">
                              Вопрос {quizIndex + 1} / {songQuizQuestions.length} • Счёт: {quizScore}
                            </span>
                          </div>

                          <div className="p-4 rounded-2xl bg-[#050810] border border-white/[0.08] space-y-2">
                            <div className="text-base font-bold text-white font-mono leading-snug">{q.prompt}</div>
                            {q.subPrompt && <div className="text-[11px] text-slate-400">{q.subPrompt}</div>}
                            {q.contextQuote && (
                              <div className="text-xs font-mono text-sky-300/90 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/[0.06]">
                                «{q.contextQuote}»
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            {q.options.map((opt, idx) => {
                              let optCls =
                                'bg-white/[0.03] border-white/[0.08] text-slate-200 hover:bg-white/[0.07] hover:border-purple-400/40'
                              if (isAnswered) {
                                if (idx === q.correctIndex) {
                                  optCls = 'bg-emerald-500/20 border-emerald-400/60 text-emerald-200 font-semibold'
                                } else if (idx === quizSelectedOption) {
                                  optCls = 'bg-rose-500/20 border-rose-400/60 text-rose-200'
                                } else {
                                  optCls = 'bg-white/[0.015] border-white/[0.05] text-slate-500'
                                }
                              }
                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleSelectQuizOption(idx)}
                                  disabled={isAnswered}
                                  className={`w-full p-3 rounded-xl border text-left text-xs leading-relaxed transition cursor-pointer flex items-start gap-2.5 ${optCls}`}
                                  data-testid={`song-quiz-option-${idx}`}
                                >
                                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-300 shrink-0 mt-0.5">
                                    {String.fromCharCode(65 + idx)}
                                  </span>
                                  <span>{opt}</span>
                                </button>
                              )
                            })}
                          </div>

                          {isAnswered && (
                            <div
                              className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.09] space-y-2.5"
                              data-testid="song-quiz-feedback"
                            >
                              <div className="text-xs text-slate-200 leading-relaxed">{q.explanation}</div>
                              <button
                                onClick={handleNextQuizQuestion}
                                className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs transition cursor-pointer"
                                data-testid="song-quiz-next-btn"
                              >
                                {quizIndex + 1 < songQuizQuestions.length ? 'Следующий вопрос →' : 'Завершить и сохранить результат'}
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })()
                  )}
                </div>
              )}

              {/* TAB 4: DEEP MEANING & CULTURAL CONTEXT */}
              {activeTab === 'ai-meaning' && (
                <div className="space-y-3 animate-fade-in flex-1 min-h-0 max-h-[760px] overflow-y-auto pr-1.5" data-testid="ai-meaning-content">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-transparent to-sky-500/10 border border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1.5 text-indigo-300 text-xs font-bold">
                        <Sparkles className="w-4 h-4 text-sky-400" />
                        <span>Главный философский посыл</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-200 border border-indigo-400/25">
                        Тон: {aiAnalysis.emotionalTone.split(',')[0]}
                      </span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">{aiAnalysis.mainTheme}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-2">
                    <div className="flex items-center space-x-1.5 text-sky-400 text-xs font-bold">
                      <Flame className="w-4 h-4" />
                      <span>Культурный и исторический контекст</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">{aiAnalysis.culturalContext}</p>
                  </div>

                  {/* Historical & Cultural References */}
                  {aiAnalysis.references && aiAnalysis.references.length > 0 && (
                    <div className="space-y-2" data-testid="ai-references-section">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200">
                        <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"></span>
                        <span>Исторические и культурные отсылки:</span>
                      </div>
                      <div className="space-y-2">
                        {aiAnalysis.references.map((ref, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl bg-amber-500/[0.04] border border-amber-400/20 space-y-1"
                          >
                            <div className="text-xs font-bold text-amber-300">{ref.title}</div>
                            <div className="text-xs text-slate-300 leading-relaxed">{ref.detail}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metaphor Breakdown */}
                  <div className="space-y-2.5">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200">
                      <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]"></span>
                      <span>Скрытый подтекст ключевых метафор:</span>
                    </div>
                    <div className="space-y-2.5">
                      {aiAnalysis.metaphors.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-1.5 hover:border-white/[0.14] transition-all"
                        >
                          <div className="text-xs sm:text-sm font-mono font-semibold text-sky-300 flex items-center space-x-1.5 select-text">
                            <span className="text-sky-400 font-serif text-sm">“</span>
                            <span>{m.quote}</span>
                            <span className="text-sky-400 font-serif text-sm">”</span>
                          </div>
                          <div className="text-xs sm:text-[13px] text-slate-300 leading-relaxed pl-1">{m.meaning}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Start Typing Call to Action */}
              <div className="mt-auto pt-3 border-t border-white/[0.06]">
                <button
                  onClick={handleStartTypingLesson}
                  className="w-full py-3.5 rounded-2xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs shadow-xl shadow-sky-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]"
                  data-testid="start-typing-cta"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Перейти к слепой печати песни</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
