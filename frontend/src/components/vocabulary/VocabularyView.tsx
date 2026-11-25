import React, { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Volume2,
  Plus,
  Trash2,
  BookOpen,
  AlertCircle,
  Sparkles,
  Layers,
  List,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react'
import type { VocabularyWord } from '../../types'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { soundService } from '../../services/sound'

interface VocabularyViewProps {
  words: VocabularyWord[]
  onAddWord: (word: { word: string; translation: string; phonetic?: string }) => Promise<void>
  onDeleteWord: (id: string) => Promise<void>
  onStartVocabularyPractice: (words: string[]) => void
}

type SemanticGroupId = 'idioms' | 'actions' | 'qualities' | 'concepts'

const SEMANTIC_GROUP_ORDER: SemanticGroupId[] = ['idioms', 'actions', 'qualities', 'concepts']

const SEMANTIC_GROUPS: Record<
  SemanticGroupId,
  {
    label: string
    subtitle: string
    dotClass: string
    badgeClass: string
  }
> = {
  idioms: {
    label: 'Идиомы и выражения',
    subtitle: 'Устойчивые фразы, фразовые глаголы и пословицы',
    dotClass: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-400/30'
  },
  actions: {
    label: 'Действия и процессы',
    subtitle: 'Глаголы, движения и изменения состояний',
    dotClass: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
  },
  qualities: {
    label: 'Качества, чувства и оттенки',
    subtitle: 'Прилагательные, наречия и описания состояний',
    dotClass: 'bg-sky-400 shadow-[0_0_8px_#38bdf8]',
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-400/30'
  },
  concepts: {
    label: 'Понятия, явления и мир',
    subtitle: 'Существительные, идеи, события и предметы',
    dotClass: 'bg-violet-400 shadow-[0_0_8px_#a78bfa]',
    badgeClass: 'bg-violet-500/15 text-violet-300 border-violet-400/30'
  }
}

function classifyWordSemanticGroup(w: VocabularyWord): SemanticGroupId {
  const pos = (w.partOfSpeech || '').toLowerCase()
  const rawWord = w.word.trim().toLowerCase()
  const tr = w.translation.trim().toLowerCase()

  if (
    pos.includes('idiom') ||
    pos.includes('phrasal') ||
    pos.includes('proverb') ||
    pos.includes('collocation') ||
    pos.includes('phrase') ||
    rawWord.includes(' ')
  ) {
    return 'idioms'
  }
  if (pos.includes('verb') && !pos.includes('adverb')) {
    return 'actions'
  }
  if (
    pos.includes('adj') ||
    pos.includes('adv') ||
    rawWord.endsWith('ly') ||
    rawWord.endsWith('ful') ||
    rawWord.endsWith('less') ||
    rawWord.endsWith('ous') ||
    rawWord.endsWith('ial') ||
    rawWord.endsWith('ed')
  ) {
    return 'qualities'
  }
  if (tr.endsWith('ть') || tr.endsWith('ться')) {
    return 'actions'
  }
  return 'concepts'
}

export const VocabularyView: React.FC<VocabularyViewProps> = ({
  words,
  onAddWord,
  onDeleteWord,
  onStartVocabularyPractice
}) => {
  const [newWord, setNewWord] = useState('')
  const [newTranslation, setNewTranslation] = useState('')
  const [newPhonetic, setNewPhonetic] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Semantic group filter & View mode (Grouped List vs 3D Flashcards)
  const [viewMode, setViewMode] = useState<'list' | 'flashcards'>('list')
  const [selectedGroup, setSelectedGroup] = useState<'ALL' | SemanticGroupId>('ALL')

  // Flashcards interactive state
  const [deckOrder, setDeckOrder] = useState<string[]>([])
  const [cardIndex, setCardIndex] = useState<number>(0)
  const [isFlipped, setIsFlipped] = useState<boolean>(false)
  const [masteredIds, setMasteredIds] = useState<Record<string, boolean>>({})

  const groupCounts = useMemo(() => {
    const counts: Record<SemanticGroupId, number> = {
      idioms: 0,
      actions: 0,
      qualities: 0,
      concepts: 0
    }
    for (const w of words) {
      counts[classifyWordSemanticGroup(w)] += 1
    }
    return counts
  }, [words])

  const filteredWords = useMemo(() => {
    if (selectedGroup === 'ALL') return words
    return words.filter(w => classifyWordSemanticGroup(w) === selectedGroup)
  }, [words, selectedGroup])

  const groupedWords = useMemo(() => {
    return SEMANTIC_GROUP_ORDER.map(gid => ({
      groupId: gid,
      meta: SEMANTIC_GROUPS[gid],
      items: filteredWords.filter(w => classifyWordSemanticGroup(w) === gid)
    })).filter(g => g.items.length > 0)
  }, [filteredWords])

  // Sync flashcard deck whenever filteredWords changes
  useEffect(() => {
    setDeckOrder(filteredWords.map(w => w.id))
    setCardIndex(0)
    setIsFlipped(false)
  }, [filteredWords])

  const activeDeck = useMemo(() => {
    const byId = new Map(filteredWords.map(w => [w.id, w]))
    const ordered = deckOrder.map(id => byId.get(id)).filter((w): w is VocabularyWord => Boolean(w))
    return ordered.length > 0 ? ordered : filteredWords
  }, [deckOrder, filteredWords])

  const activeCard = activeDeck[cardIndex] || activeDeck[0]
  const masteredCount = useMemo(
    () => activeDeck.filter(w => masteredIds[w.id]).length,
    [activeDeck, masteredIds]
  )

  const handleNextCard = useCallback(() => {
    if (activeDeck.length === 0) return
    setIsFlipped(false)
    setCardIndex(i => (i + 1) % activeDeck.length)
  }, [activeDeck.length])

  const handlePrevCard = useCallback(() => {
    if (activeDeck.length === 0) return
    setIsFlipped(false)
    setCardIndex(i => (i - 1 + activeDeck.length) % activeDeck.length)
  }, [activeDeck.length])

  const handleShuffleDeck = () => {
    const ids = [...activeDeck.map(w => w.id)]
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[ids[i], ids[j]] = [ids[j], ids[i]]
    }
    setDeckOrder(ids)
    setCardIndex(0)
    setIsFlipped(false)
  }

  const handleMarkKnown = () => {
    if (!activeCard) return
    setMasteredIds(prev => ({ ...prev, [activeCard.id]: true }))
    soundService.playQuizCorrect()
    handleNextCard()
  }

  const handleRepeatLater = () => {
    if (!activeCard) return
    setMasteredIds(prev => ({ ...prev, [activeCard.id]: false }))
    soundService.playKeyClick(false)
    handleNextCard()
  }

  // Keyboard shortcuts for Flashcards mode (Space = flip, Arrows = prev/next)
  useEffect(() => {
    if (viewMode !== 'flashcards' || activeDeck.length === 0) return
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === ' ') {
        e.preventDefault()
        setIsFlipped(f => !f)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNextCard()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrevCard()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [viewMode, activeDeck.length, handleNextCard, handlePrevCard])

  // Form submission with strict validation (Criterion 9)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    // Validation: required fields
    if (!newWord.trim()) {
      setErrorMessage('Поле «Английское слово» обязательно для заполнения')
      return
    }

    // Validation: English letters only for the word
    if (!/^[a-zA-Z\s-]+$/.test(newWord.trim())) {
      setErrorMessage('Слово должно содержать только английские буквы')
      return
    }

    if (!newTranslation.trim()) {
      setErrorMessage('Поле «Перевод на русский» обязательно для заполнения')
      return
    }

    try {
      setIsSubmitting(true)
      await onAddWord({
        word: newWord.trim().toLowerCase(),
        translation: newTranslation.trim(),
        phonetic: newPhonetic.trim() || undefined
      })
      // Clear form
      setNewWord('')
      setNewTranslation('')
      setNewPhonetic('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Не удалось добавить слово'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-7 max-w-4xl mx-auto w-full animate-fade-in" data-testid="vocabulary-view">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-sky-400" />
            Словарь трудных слов
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Слова сгруппированы по смыслу — повторяйте их списком, в 3D-карточках или в спринте печати.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {words.length > 0 && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                data-testid="vocab-mode-list"
              >
                <List className="w-3.5 h-3.5" />
                <span>По группам</span>
              </button>
              <button
                onClick={() => setViewMode('flashcards')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'flashcards'
                    ? 'bg-purple-500/20 text-purple-200 border border-purple-400/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                data-testid="vocab-mode-flashcards"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Карточки</span>
              </button>
            </div>
          )}

          {words.length > 0 && (
            <Button
              onClick={() => onStartVocabularyPractice(filteredWords.map(w => w.word))}
              variant="primary"
            >
              <Sparkles className="w-4 h-4" />
              <span>Тренировать слова ({filteredWords.length})</span>
            </Button>
          )}
        </div>
      </div>

      {/* Add New Word Form (Validation Form - Criterion 9) */}
      <Card className="bg-[#090d16]/90 border border-white/[0.08]">
        <h3 className="text-sm font-semibold text-white mb-3">Добавить слово в личный словарь</h3>
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="add-word-form" noValidate>
          {errorMessage && (
            <div
              className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2"
              role="alert"
              data-testid="form-error"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label htmlFor="word-input" className="block text-xs text-slate-400 mb-1">
                Английское слово <span className="text-rose-400">*</span>
              </label>
              <input
                id="word-input"
                type="text"
                value={newWord}
                onChange={e => setNewWord(e.target.value)}
                placeholder="например, thoroughly"
                className="w-full px-3 py-2 rounded-xl bg-[#050810] border border-white/[0.08] text-white text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              />
            </div>

            <div>
              <label htmlFor="translation-input" className="block text-xs text-slate-400 mb-1">
                Перевод на русский <span className="text-rose-400">*</span>
              </label>
              <input
                id="translation-input"
                type="text"
                value={newTranslation}
                onChange={e => setNewTranslation(e.target.value)}
                placeholder="например, тщательно"
                className="w-full px-3 py-2 rounded-xl bg-[#050810] border border-white/[0.08] text-white text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              />
            </div>

            <div>
              <label htmlFor="phonetic-input" className="block text-xs text-slate-400 mb-1">
                Транскрипция (опционально)
              </label>
              <input
                id="phonetic-input"
                type="text"
                value={newPhonetic}
                onChange={e => setNewPhonetic(e.target.value)}
                placeholder="например, /ˈθʌr.ə.li/"
                className="w-full px-3 py-2 rounded-xl bg-[#050810] border border-white/[0.08] text-white text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              data-testid="submit-word-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить в словарь</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* Semantic Group Filter Pills */}
      {words.length > 0 && (
        <div className="flex flex-wrap items-center gap-2" data-testid="vocab-semantic-filters">
          <button
            onClick={() => setSelectedGroup('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
              selectedGroup === 'ALL'
                ? 'bg-sky-400 text-slate-950 font-bold shadow-lg shadow-sky-500/20'
                : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.07]'
            }`}
            data-testid="vocab-filter-ALL"
          >
            <span>Все группы</span>
            <span className="text-[10px] opacity-80">{words.length}</span>
          </button>

          {SEMANTIC_GROUP_ORDER.map(gid => {
            const count = groupCounts[gid]
            if (count === 0) return null
            const meta = SEMANTIC_GROUPS[gid]
            const isAct = selectedGroup === gid
            return (
              <button
                key={gid}
                onClick={() => setSelectedGroup(gid)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                  isAct
                    ? 'bg-sky-400 text-slate-950 font-bold shadow-lg shadow-sky-500/20'
                    : 'bg-white/[0.03] text-slate-300 hover:text-white border border-white/[0.07]'
                }`}
                data-testid={`vocab-filter-${gid}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isAct ? 'bg-slate-950' : meta.dotClass}`} />
                <span>{meta.label}</span>
                <span className="text-[10px] opacity-75">{count}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Empty State OR Flashcards Mode OR Semantic Grouped List */}
      {words.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#090d16]/60 border border-dashed border-white/[0.1] text-center space-y-2">
          <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400">
            Словарь пока пуст. Добавьте новые слова через форму выше или кликайте на слова во время набора текста.
          </p>
        </div>
      ) : viewMode === 'flashcards' && activeCard ? (
        /* 3D INTERACTIVE FLASHCARDS DECK */
        <div className="space-y-5 max-w-2xl mx-auto w-full" data-testid="vocab-flashcards-mode">
          {/* Deck Progress Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-slate-300">
              Карточка <span className="text-white font-bold">{cardIndex + 1}</span> из {activeDeck.length}
            </span>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                Выучено: {masteredCount} / {activeDeck.length}
              </span>
              <button
                onClick={handleShuffleDeck}
                className="px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] text-slate-300 hover:text-white border border-white/[0.08] transition flex items-center gap-1 cursor-pointer"
                data-testid="flashcard-shuffle-btn"
              >
                <Shuffle className="w-3.5 h-3.5 text-sky-400" />
                <span>Перемешать</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-purple-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${Math.round(((cardIndex + 1) / activeDeck.length) * 100)}%` }}
            />
          </div>

          {/* 3D Flip Card */}
          <div
            className="flashcard-scene cursor-pointer select-none"
            onClick={() => setIsFlipped(f => !f)}
            role="button"
            tabIndex={0}
            aria-label={isFlipped ? 'Перевернуть карточку на английское слово' : 'Перевернуть карточку на перевод'}
            data-testid="flashcard-card"
          >
            <div className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>
              {/* FRONT FACE: English Word */}
              <div className="flashcard-face rounded-3xl bg-[radial-gradient(ellipse_110%_80%_at_50%_0%,rgba(56,189,248,0.16),rgba(9,13,22,0.98)_70%)] border border-sky-400/30 p-7 flex flex-col justify-between shadow-2xl shadow-black/80">
                <div className="flex items-center justify-between gap-2">
                  {(() => {
                    const gid = classifyWordSemanticGroup(activeCard)
                    const meta = SEMANTIC_GROUPS[gid]
                    return (
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono border ${meta.badgeClass}`}>
                        {meta.label}
                      </span>
                    )
                  })()}
                  <div className="flex items-center gap-2">
                    {masteredIds[activeCard.id] && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        ✓ Выучено
                      </span>
                    )}
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        soundService.playWordAudio(activeCard.word, activeCard.audioUrl)
                      }}
                      className="p-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-300 transition cursor-pointer"
                      title="Озвучить слово"
                      aria-label={`Озвучить ${activeCard.word}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-center space-y-2 my-6">
                  <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                    {activeCard.word}
                  </div>
                  {activeCard.phonetic && (
                    <div className="text-sm font-mono text-sky-300/80">{activeCard.phonetic}</div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
                  <RotateCw className="w-3.5 h-3.5 text-sky-400" />
                  <span>Нажмите на карточку или Space, чтобы увидеть перевод</span>
                </div>
              </div>

              {/* BACK FACE: Russian Translation + Self-Check Actions */}
              <div className="flashcard-face flashcard-face-back rounded-3xl bg-[radial-gradient(ellipse_110%_80%_at_50%_0%,rgba(168,85,247,0.18),rgba(9,13,22,0.98)_70%)] border border-purple-400/35 p-7 flex flex-col justify-between shadow-2xl shadow-black/80">
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="text-purple-300 font-bold">{activeCard.word}</span>
                  <span className="text-slate-400">{activeCard.mistakeCount} опечаток</span>
                </div>

                <div className="text-center space-y-2 my-4">
                  <div className="text-[11px] uppercase tracking-wider font-mono text-purple-300/80">Перевод</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                    {activeCard.translation}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handleRepeatLater()
                    }}
                    className="py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    data-testid="flashcard-repeat-btn"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Повторить ещё</span>
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handleMarkKnown()
                    }}
                    className="py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    data-testid="flashcard-know-btn"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Знаю отлично</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrevCard}
              className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] text-slate-200 border border-white/[0.08] text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
              data-testid="flashcard-prev-btn"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>

            <button
              onClick={() => setIsFlipped(f => !f)}
              className="px-4 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-400/30 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
              data-testid="flashcard-flip-btn"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Перевернуть</span>
            </button>

            <button
              onClick={handleNextCard}
              className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] text-slate-200 border border-white/[0.08] text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
              data-testid="flashcard-next-btn"
            >
              <span>Дальше</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* SEMANTIC GROUPED WORDS LIST */
        <div className="space-y-5" data-testid="words-list">
          {groupedWords.map(({ groupId, meta, items }) => (
            <div key={groupId} className="space-y-2.5" data-testid={`vocab-group-${groupId}`}>
              <div className="flex items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${meta.dotClass}`} />
                  <h3 className="text-xs font-bold text-slate-200 tracking-wide">{meta.label}</h3>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">— {meta.subtitle}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{items.length}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map(w => (
                  <div
                    key={w.id}
                    className="p-4 rounded-2xl bg-[#090d16]/90 border border-white/[0.07] flex items-center justify-between hover:border-white/[0.16] hover:bg-white/[0.03] transition shadow-lg shadow-black/40"
                    data-testid={`word-item-${w.word}`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <button
                        onClick={() => soundService.playWordAudio(w.word, w.audioUrl)}
                        className="p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/20 text-sky-400 transition cursor-pointer shrink-0"
                        title="Прослушать произношение"
                        aria-label={`Прослушать ${w.word}`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm font-mono truncate">{w.word}</span>
                          {w.phonetic && <span className="text-[11px] text-slate-400 font-mono truncate">{w.phonetic}</span>}
                        </div>
                        <div className="text-xs text-sky-300 truncate">{w.translation}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[10px] text-slate-500 font-mono px-2 py-0.5 rounded-lg bg-white/[0.03] border border-white/[0.07]">
                        {w.mistakeCount} опечаток
                      </span>
                      <button
                        onClick={() => onDeleteWord(w.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/[0.05] transition cursor-pointer"
                        title="Удалить слово"
                        aria-label={`Удалить ${w.word}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
