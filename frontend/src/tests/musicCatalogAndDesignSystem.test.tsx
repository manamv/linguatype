import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { TopicSelector } from '../components/grammar/TopicSelector'
import { MusicClipsView } from '../components/music/MusicClipsView'
import { VocabularyView } from '../components/vocabulary/VocabularyView'
import { TypingEngine } from '../components/typing/TypingEngine'
import { achievementsService } from '../services/achievements'
import { DICTIONARY_MAP } from '../utils/dictionary'

describe('Design System (shadcn/ui) & Scalable Music Catalog Tests', () => {
  it('Button (shadcn/ui): renders variants, prevents clicks while loading, and preserves focus-visible ring', () => {
    const handleClick = vi.fn()
    const { rerender } = render(
      <Button variant="primary" onClick={handleClick}>
        Запустить
      </Button>
    )

    const btn = screen.getByRole('button', { name: /Запустить/i })
    expect(btn.className).toContain('bg-sky-400')
    expect(btn.className).toContain('focus-visible:ring-2')
    fireEvent.click(btn)
    expect(handleClick).toHaveBeenCalledTimes(1)

    // Loading state disables button and prevents double-submit clicks
    rerender(
      <Button variant="danger" isLoading={true} onClick={handleClick}>
        Удалить
      </Button>
    )
    const loadingBtn = screen.getByRole('button', { name: /Удалить/i })
    expect(loadingBtn).toBeDisabled()
    fireEvent.click(loadingBtn)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('Card & Badge (shadcn/ui): render consistent theme tokens across active/interactive variants', () => {
    render(
      <Card variant="active" data-testid="ds-card">
        <Badge variant="sky">B1</Badge>
        <Badge variant="purple">C1</Badge>
        <span>Контент карточки</span>
      </Card>
    )

    const card = screen.getByTestId('ds-card')
    expect(card.className).toContain('border-sky-400/50')
    expect(screen.getByText('B1').className).toContain('text-sky-300')
    expect(screen.getByText('C1').className).toContain('text-purple-400')
  })

  it('TopicSelector: groups topics by CEFR levels and filters by level pill', () => {
    const topics = [
      { id: 'a1-articles', title: 'articles a an the', level: 'A1', description: 'артикли', sentenceCount: 3 },
      { id: 'b1-passive', title: 'passive voice', level: 'B1', description: 'пассивный залог', sentenceCount: 4 },
      { id: 'c1-inversion', title: 'negative inversion', level: 'C1', description: 'инверсия', sentenceCount: 3 }
    ]
    render(<TopicSelector topics={topics} onSelectTopic={vi.fn()} onSelectAdaptive={vi.fn()} />)

    // All 3 visible initially
    expect(screen.getByTestId('topic-card-a1-articles')).toBeInTheDocument()
    expect(screen.getByTestId('topic-card-b1-passive')).toBeInTheDocument()
    expect(screen.getByTestId('topic-card-c1-inversion')).toBeInTheDocument()

    // Filter to C1 only (button displays "C1" + count "1")
    fireEvent.click(screen.getByRole('button', { name: /^C1\s*1$/i }))
    expect(screen.getByTestId('topic-card-c1-inversion')).toBeInTheDocument()
    expect(screen.queryByTestId('topic-card-a1-articles')).not.toBeInTheDocument()
    expect(screen.queryByTestId('topic-card-b1-passive')).not.toBeInTheDocument()
  })

  it('MusicClipsView: toggles scalable catalog collapse/expand cleanly', async () => {
    render(<MusicClipsView onStartTyping={vi.fn()} />)

    const toggleBtn = await screen.findByTestId('music-catalog-toggle')
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true')
    expect(await screen.findByTestId('music-level-group-A2')).toBeInTheDocument()

    // Collapse catalog
    fireEvent.click(toggleBtn)
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByTestId('music-level-group-A2')).not.toBeInTheDocument()

    // Expand catalog back
    fireEvent.click(toggleBtn)
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true')
    expect(await screen.findByTestId('music-level-group-A2')).toBeInTheDocument()
  })

  it('MusicClipsView: filters catalog by C1 level and handles empty search with reset button', async () => {
    render(<MusicClipsView onStartTyping={vi.fn()} />)

    // Filter to C1 tracks
    const c1Filter = await screen.findByTestId('music-level-filter-C1')
    fireEvent.click(c1Filter)
    expect(screen.getByTestId('song-tab-kendrick-prayer')).toBeInTheDocument()
    expect(screen.getByTestId('song-tab-kendrick-samidot')).toBeInTheDocument()
    expect(screen.getByTestId('song-tab-j-cole-4-your-eyez-only')).toBeInTheDocument()
    expect(screen.queryByTestId('song-tab-queen-champions')).not.toBeInTheDocument()

    // Search non-existent song -> empty state + reset
    const search = screen.getByTestId('music-search-input')
    fireEvent.change(search, { target: { value: 'nonexistent-xyz-track' } })
    expect(screen.getByText(/По вашему запросу треков не найдено/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Сбросить фильтры/i }))
    expect(screen.getByTestId('song-tab-queen-champions')).toBeInTheDocument()
    expect(screen.getByTestId('song-tab-kendrick-prayer')).toBeInTheDocument()
  })

  it('MusicClipsView: displays unique AI Meaning analysis for newly added tracks (Hotel California & Prayer)', async () => {
    render(<MusicClipsView onStartTyping={vi.fn()} />)

    // Select Eagles - Hotel California
    const hotelTab = await screen.findByTestId('song-tab-eagles-hotel-california')
    fireEvent.click(hotelTab)

    // Switch to AI Meaning tab
    fireEvent.click(await screen.findByTestId('tab-ai-meaning'))
    const aiContent = await screen.findByTestId('ai-meaning-content')
    expect(aiContent).toHaveTextContent(/Отель Калифорния/i)

    // Switch to Kendrick Lamar - Prayer and verify historical references (Michael Jackson & MLK)
    fireEvent.click(screen.getByTestId('song-tab-kendrick-prayer'))
    expect(await screen.findByTestId('ai-meaning-content')).toHaveTextContent(/разделении искусства и личности/i)
    const refsSection = await screen.findByTestId('ai-references-section')
    expect(refsSection).toHaveTextContent(/Майкл Джексон/i)
    expect(refsSection).toHaveTextContent(/Мартин Лютер Кинг/i)
  })

  it('MusicClipsView: Rhythm Typing mode tracks live keystrokes and counts mistakes', async () => {
    render(<MusicClipsView onStartTyping={vi.fn()} />)

    // Wait for first song (Queen - We Are the Champions) to load
    await screen.findByTestId('song-tab-queen-champions')
    const rhythmBtn = await screen.findByTestId('music-mode-rhythm')
    fireEvent.click(rhythmBtn)

    expect(await screen.findByTestId('music-rhythm-panel')).toBeInTheDocument()
    expect(screen.getByText(/Ошибки: 0/i)).toBeInTheDocument()

    // First char of Queen's first subtitle is 'i'; type correct 'i' then wrong 'z'
    fireEvent.keyDown(window, { key: 'i' })
    expect(screen.getByText(/Ошибки: 0/i)).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'z' })
    expect(screen.getByText(/Ошибки: 1/i)).toBeInTheDocument()

    // Backspace erases typed mistake cleanly
    fireEvent.keyDown(window, { key: 'Backspace' })
    expect(screen.getByTestId('music-typing-line')).toBeInTheDocument()
  })

  it('MusicClipsView: Auto-Pause Dictation masks characters and supports skipping to next line', async () => {
    render(<MusicClipsView onStartTyping={vi.fn()} />)

    await screen.findByTestId('song-tab-queen-champions')
    fireEvent.click(await screen.findByTestId('music-mode-dictation'))
    expect(await screen.findByTestId('music-dictation-panel')).toBeInTheDocument()

    // Force typing phase immediately -> text should be masked with bullet dots
    fireEvent.click(screen.getByTestId('dictation-force-type-btn'))
    expect(screen.getByTestId('music-typing-line').textContent).toContain('•')

    // Reveal hint -> dots disappear
    fireEvent.click(screen.getByTestId('dictation-hint-btn'))
    expect(screen.getByTestId('music-typing-line').textContent).not.toContain('•')

    // Skip to next line resets to listening phase
    fireEvent.click(screen.getByTestId('dictation-skip-btn'))
    expect(screen.getByText(/Слушайте строку 2\//i)).toBeInTheDocument()
  })

  it('MusicClipsView: activates snowfall only for Last Christmas and removes it on other songs', async () => {
    render(<MusicClipsView onStartTyping={vi.fn()} />)

    // Initially off
    await screen.findByTestId('song-tab-wham-last-christmas')
    expect(screen.queryByTestId('christmas-snowfall')).not.toBeInTheDocument()

    // Enable on Last Christmas
    fireEvent.click(screen.getByTestId('song-tab-wham-last-christmas'))
    expect(await screen.findByTestId('christmas-snowfall')).toBeInTheDocument()

    // Switch to Sting -> snowfall disappears
    fireEvent.click(screen.getByTestId('song-tab-sting-shape-of-my-heart'))
    expect(screen.queryByTestId('christmas-snowfall')).not.toBeInTheDocument()
  })

  it('MusicClipsView: renders all 14 catalog tracks across A2, B1, B2, and C1 levels', async () => {
    render(<MusicClipsView onStartTyping={vi.fn()} />)

    const expectedIds = [
      'queen-champions',
      'coldplay-scientist',
      'beatles-yesterday',
      'steve-lacy-the-feeling',
      'wham-last-christmas',
      'harry-styles-coming-up-roses',
      'frank-ocean-ivy',
      'sting-shape-of-my-heart',
      'eagles-hotel-california',
      'hozier-take-me-to-church',
      'kendrick-count-me-out',
      'kendrick-prayer',
      'kendrick-samidot',
      'j-cole-4-your-eyez-only'
    ]

    for (const id of expectedIds) {
      expect(await screen.findByTestId(`song-tab-${id}`)).toBeInTheDocument()
    }
  })

  it('MusicClipsView: displays Song Vocabulary tab with unfamiliar words, context quotes, and save-to-vocabulary action', async () => {
    render(<MusicClipsView onStartTyping={vi.fn()} />)

    // Select Harry Styles - Coming Up Roses
    fireEvent.click(await screen.findByTestId('song-tab-harry-styles-coming-up-roses'))

    // Open Song Vocabulary tab
    const vocabTab = await screen.findByTestId('tab-song-vocab')
    fireEvent.click(vocabTab)

    const vocabContent = await screen.findByTestId('song-vocab-content')
    expect(vocabContent).toBeInTheDocument()
    expect(vocabContent).toHaveTextContent(/coming up roses/i)
    expect(vocabContent).toHaveTextContent(/devoid of/i)
    expect(vocabContent).toHaveTextContent(/Контекст:/i)
    expect(vocabContent).toHaveTextContent(/Но я не лишён жажды жизни/i)

    // Save word to personal vocabulary
    const saveBtn = screen.getByTestId('save-song-vocab-devoid-of')
    fireEvent.click(saveBtn)
    await waitFor(() => {
      expect(screen.getByTestId('save-song-vocab-devoid-of')).toHaveTextContent(/В словаре/i)
    })
  })

  it('MusicClipsView: completes Song Comprehension Quiz (words + idioms) and persists best song score', async () => {
    window.localStorage.clear()
    render(<MusicClipsView onStartTyping={vi.fn()} />)

    // Select Wham! - Last Christmas and open Comprehension Quiz tab
    fireEvent.click(await screen.findByTestId('song-tab-wham-last-christmas'))
    fireEvent.click(await screen.findByTestId('tab-song-quiz'))
    expect(await screen.findByTestId('song-quiz-content')).toBeInTheDocument()

    // Complete all 5 questions (3 complex words + 2 figurative idioms)
    for (let i = 0; i < 5; i++) {
      fireEvent.click(await screen.findByTestId('song-quiz-option-0'))
      expect(await screen.findByTestId('song-quiz-feedback')).toBeInTheDocument()
      fireEvent.click(screen.getByTestId('song-quiz-next-btn'))
    }

    // Quiz result screen appears and best score badge is persisted on the song card
    expect(await screen.findByTestId('song-quiz-result')).toBeInTheDocument()
    expect(await screen.findByTestId('song-record-wham-last-christmas')).toHaveTextContent(/\/5/)
  })

  it('VocabularyView: groups words semantically and supports 3D Flashcards memorization mode', () => {
    const sampleWords = [
      { id: '1', word: 'pay my dues', translation: 'заплатить по счетам', phonetic: '/peɪ maɪ djuːz/', partOfSpeech: 'idiom', mistakeCount: 1 },
      { id: '2', word: 'thoroughly', translation: 'тщательно', phonetic: '/ˈθʌr.ə.li/', partOfSpeech: 'adverb', mistakeCount: 2 },
      { id: '3', word: 'legacy', translation: 'наследие', phonetic: '/ˈleɡ.ə.si/', partOfSpeech: 'noun', mistakeCount: 0 }
    ]

    render(
      <VocabularyView
        words={sampleWords}
        onAddWord={vi.fn()}
        onDeleteWord={vi.fn()}
        onStartVocabularyPractice={vi.fn()}
      />
    )

    // Semantic groups are rendered
    expect(screen.getByTestId('vocab-group-idioms')).toBeInTheDocument()
    expect(screen.getByTestId('vocab-group-qualities')).toBeInTheDocument()
    expect(screen.getByTestId('vocab-group-concepts')).toBeInTheDocument()

    // Filter to idioms only
    fireEvent.click(screen.getByTestId('vocab-filter-idioms'))
    expect(screen.getByTestId('word-item-pay my dues')).toBeInTheDocument()
    expect(screen.queryByTestId('word-item-legacy')).not.toBeInTheDocument()

    // Reset filter to ALL and switch to 3D Flashcards mode
    fireEvent.click(screen.getByTestId('vocab-filter-ALL'))
    fireEvent.click(screen.getByTestId('vocab-mode-flashcards'))
    expect(screen.getByTestId('vocab-flashcards-mode')).toBeInTheDocument()

    // Flip card and mark as known
    fireEvent.click(screen.getByTestId('flashcard-card'))
    fireEvent.click(screen.getByTestId('flashcard-know-btn'))
    expect(screen.getByText(/Выучено: 1 \/ 3/i)).toBeInTheDocument()
  })

  it('Achievements & Dictionary: provides 18 achievements and full lyric word translations', () => {
    expect(achievementsService.getAchievements().length).toBeGreaterThanOrEqual(18)
    for (const word of ['shimmering', 'mouthpiece', 'subliminal', 'estranged', 'devoid', 'conceal', 'bounce']) {
      expect(DICTIONARY_MAP[word]?.translation).toBeTruthy()
    }
  })

  it('TypingEngine: shows subtle warning pill on wrong keyboard layout (Cyrillic) and clears on English key', () => {
    const lesson = {
      id: 'layout-test',
      title: 'Layout Guard Test',
      level: 'A1',
      description: 'Test',
      sentences: [{ id: 's1', english: 'hello world', russian: 'привет мир' }]
    }
    render(<TypingEngine lesson={lesson} onFinish={vi.fn()} />)

    expect(screen.queryByTestId('keyboard-warning-pill')).not.toBeInTheDocument()

    // Pressing Cyrillic letter triggers wrong-layout pill
    fireEvent.keyDown(window, { key: 'ф' })
    expect(screen.getByTestId('wrong-layout-warning')).toBeInTheDocument()

    // Pressing English letter clears wrong-layout pill immediately
    fireEvent.keyDown(window, { key: 'h' })
    expect(screen.queryByTestId('wrong-layout-warning')).not.toBeInTheDocument()
  })
})
