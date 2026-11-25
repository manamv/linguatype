import type { GrammarTopic, LeaderboardEntry, LessonData, SessionStats, UserStatsSummary, VocabularyWord, MusicLesson } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'lb-1', userName: 'alex_speed', wpm: 104, accuracy: 99.4, topicTitle: 'present perfect vs past simple', level: 'B1', timestamp: new Date().toISOString() },
  { id: 'lb-2', userName: 'elena_code', wpm: 96, accuracy: 98.8, topicTitle: 'second and third conditionals', level: 'B2', timestamp: new Date().toISOString() },
  { id: 'lb-3', userName: 'cyber_typer', wpm: 88, accuracy: 97.5, topicTitle: 'passive voice in tech contexts', level: 'B1', timestamp: new Date().toISOString() },
  { id: 'lb-4', userName: 'dev_master', wpm: 82, accuracy: 99.0, topicTitle: 'present simple and daily routines', level: 'A1', timestamp: new Date().toISOString() },
  { id: 'lb-5', userName: 'ninja_keys', wpm: 78, accuracy: 96.2, topicTitle: 'defining and non defining relative clauses', level: 'B2', timestamp: new Date().toISOString() }
]

// Fallback data for offline/standalone execution
const FALLBACK_TOPICS: GrammarTopic[] = [
  {
    id: 'pres-perf',
    title: 'present perfect vs past simple',
    level: 'B1',
    description: 'разница между результатом в настоящем и завершенным действием в прошлом',
    sentenceCount: 5
  },
  {
    id: 'cond-2',
    title: 'second and third conditionals',
    level: 'B2',
    description: 'нереальные условия в настоящем и прошлом без знаков препинания',
    sentenceCount: 4
  },
  {
    id: 'pass-voice',
    title: 'passive voice in tech contexts',
    level: 'B1',
    description: 'страдательный залог объект действия важнее исполнителя',
    sentenceCount: 3
  },
  {
    id: 'a1-basics',
    title: 'present simple and daily routines',
    level: 'A1',
    description: 'базовые утверждения отрицания и вопросы о повседневных привычках',
    sentenceCount: 3
  },
  {
    id: 'past-continuous',
    title: 'past continuous vs past simple',
    level: 'A2',
    description: 'параллельные и прерванные действия в прошлом без пунктуации',
    sentenceCount: 3
  },
  {
    id: 'future-forms',
    title: 'future forms will going to present continuous',
    level: 'B1',
    description: 'разница между спонтанными решениями планами и точными договоренностями',
    sentenceCount: 3
  },
  {
    id: 'modal-deduction',
    title: 'modals of deduction must cannot might',
    level: 'B2',
    description: 'выражение уверенности и предположений в настоящем и прошлом',
    sentenceCount: 3
  },
  {
    id: 'phrasal-tech',
    title: 'essential phrasal verbs in software engineering',
    level: 'B2',
    description: 'ключевые фразовые глаголы в разработке и системной инженерии',
    sentenceCount: 3
  },
  {
    id: 'c1-inversion',
    title: 'advanced inversion and fronting',
    level: 'C1',
    description: 'эмфатическая инверсия порядка слов после отрицательных наречий',
    sentenceCount: 3
  },
  {
    id: 'reported-speech',
    title: 'reported speech in technical discussions',
    level: 'B1',
    description: 'косвенная речь и согласование времен в командных обсуждениях',
    sentenceCount: 3
  },
  {
    id: 'a1-articles',
    title: 'articles a an the and zero article',
    level: 'A1',
    description: 'определенный неопределенный и нулевой артикль в повседневной речи',
    sentenceCount: 3
  },
  {
    id: 'a2-prepositions',
    title: 'prepositions of time and place in on at',
    level: 'A2',
    description: 'точное употребление предлогов времени и места в рабочих ситуациях',
    sentenceCount: 3
  },
  {
    id: 'b1-gerund-inf',
    title: 'gerund vs infinitive after verbs',
    level: 'B1',
    description: 'когда после глагола ставить форму с ing а когда инфинитив с to',
    sentenceCount: 3
  },
  {
    id: 'c1-mixed-cond',
    title: 'mixed conditionals and wish clauses',
    level: 'C1',
    description: 'смешанные условные предложения связь прошлого с настоящим и сожаления',
    sentenceCount: 3
  },
  {
    id: 'c1-cleft-sentences',
    title: 'cleft sentences and academic emphasis',
    level: 'C1',
    description: 'расщепленные предложения it is that и what is для смыслового акцента',
    sentenceCount: 3
  }
]

const FALLBACK_LESSONS: Record<string, LessonData> = {
  'pres-perf': {
    id: 'pres-perf',
    title: 'present perfect vs past simple',
    level: 'B1',
    description: 'отработка временных маркеров without uppercase and punctuation',
    sentences: [
      {
        id: 's1',
        english: 'she has already completed this difficult engineering report on time and the lead architect has verified all database schema changes with the entire team',
        russian: 'она уже завершила этот сложный инженерный отчёт вовремя и главный архитектор проверил все изменения схемы базы данных со всей командой',
        grammarTip: 'already указывает на результат в настоящем have или has плюс v3'
      },
      {
        id: 's2',
        english: 'they went to the international tech conference in berlin last tuesday and presented their new automated deployment pipeline to many distributed backend developers',
        russian: 'они поехали на международную технологическую конференцию в берлин в прошлый вторник и представили свой новый автоматизированный пайплайн деплоя разработчикам',
        grammarTip: 'last tuesday указывает на конкретный момент в прошлом past simple'
      },
      {
        id: 's3',
        english: 'we have never observed such an innovative microservice architecture before in any enterprise software system because the latency was always extremely low',
        russian: 'мы никогда раньше не наблюдали столь инновационной микросервисной архитектуры ни в одной корпоративной системе потому что задержка была низкой',
        grammarTip: 'never в контексте жизненного опыта до настоящего момента present perfect'
      }
    ]
  },
  'a1-articles': {
    id: 'a1-articles',
    title: 'articles a an the and zero article',
    level: 'A1',
    description: 'определенный неопределенный и нулевой артикль в повседневной речи',
    sentences: [
      {
        id: 'art1',
        english: 'an experienced developer always writes a clear commit message before pushing the changes to the remote repository',
        russian: 'опытный разработчик всегда пишет понятное сообщение коммита перед отправкой изменений в удаленный репозиторий',
        grammarTip: 'an перед гласным звуком experienced a перед согласным the для конкретных изменений'
      },
      {
        id: 'art2',
        english: 'the laptop on the wooden desk has an aluminum body and runs a fast linux distribution for daily software development',
        russian: 'ноутбук на деревянном столе имеет алюминиевый корпус и работает на быстрой сборке линукс для ежедневной разработки',
        grammarTip: 'the для конкретного предмета на столе an aluminum body'
      }
    ]
  },
  'a2-prepositions': {
    id: 'a2-prepositions',
    title: 'prepositions of time and place in on at',
    level: 'A2',
    description: 'точное употребление предлогов времени и места в рабочих ситуациях',
    sentences: [
      {
        id: 'prep1',
        english: 'our sprint planning meeting starts at nine oclock on monday morning in the main glass conference room',
        russian: 'наше планирование спринта начинается в девять часов в понедельник утром в главной стеклянной переговорной',
        grammarTip: 'at с точным временем on с днями недели in с помещениями'
      }
    ]
  },
  'b1-gerund-inf': {
    id: 'b1-gerund-inf',
    title: 'gerund vs infinitive after verbs',
    level: 'B1',
    description: 'когда после глагола ставить форму с ing а когда инфинитив с to',
    sentences: [
      {
        id: 'gi1',
        english: 'we decided to postpone deploying the experimental feature because the team wanted to avoid introducing subtle race conditions',
        russian: 'мы решили отложить деплой экспериментальной фичи потому что команда хотела избежать появления тонких состояний гонки',
        grammarTip: 'decide to v1 postpone plus ving avoid plus ving'
      }
    ]
  },
  'c1-mixed-cond': {
    id: 'c1-mixed-cond',
    title: 'mixed conditionals and wish clauses',
    level: 'C1',
    description: 'смешанные условные предложения связь прошлого с настоящим и сожаления',
    sentences: [
      {
        id: 'mc1',
        english: 'if we had adopted strict type safety two years ago our production codebase would be far more maintainable right now',
        russian: 'если бы мы внедрили строгую типизацию два года назад наша кодовая база была бы гораздо более поддерживаемой прямо сейчас',
        grammarTip: 'смешанный тип if плюс had v3 прошлое и would v1 результат в настоящем'
      }
    ]
  },
  'c1-cleft-sentences': {
    id: 'c1-cleft-sentences',
    title: 'cleft sentences and academic emphasis',
    level: 'C1',
    description: 'расщепленные предложения it is that и what is для смыслового акцента',
    sentences: [
      {
        id: 'cs1',
        english: 'it was the memory allocation bottleneck that caused the sudden drop in throughput during the peak black friday traffic',
        russian: 'именно узкое место выделения памяти вызвало внезапное падение пропускной способности во время пикового трафика',
        grammarTip: 'расщепленное предложение it was x that для усиления фокуса на причине'
      }
    ]
  }
}

function makeSub(id: number, startSeconds: number, endSeconds: number, textEn: string, textRu: string) {
  const tokens = textEn.split(' ').filter(Boolean)
  const weights = tokens.map(w => Math.max(2.0, w.length + 1.5))
  const totalWeight = weights.reduce((acc, v) => acc + v, 0)
  const rawDuration = Math.max(0.4, endSeconds - startSeconds)
  const vocalDuration = Math.min(rawDuration, Math.max(1.8, tokens.length * 0.58))
  const vocalEnd = Math.round((startSeconds + vocalDuration) * 100) / 100
  let cursor = startSeconds
  const words = tokens.map((word, idx) => {
    const wDur = vocalDuration * (weights[idx] / totalWeight)
    const wEnd = idx === tokens.length - 1 ? vocalEnd : Math.round((cursor + wDur) * 100) / 100
    const entry = { word, start: Math.round(cursor * 100) / 100, end: wEnd }
    cursor = wEnd
    return entry
  })
  return { id, startSeconds, endSeconds, textEn, textRu, words }
}

const FALLBACK_MUSIC_LESSONS: MusicLesson[] = [
  {
    id: 'queen-champions',
    title: 'We Are the Champions',
    artist: 'Queen',
    level: 'B1',
    videoUrl: 'https://www.youtube.com/embed/04854XqcfCY',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    grammarFocus: 'Present Perfect vs Past Simple, gerunds and colloquial contractions',
    subtitles: [
      makeSub(1, 1.20, 4.68, 'i have paid my dues', 'я платил по счетам'),
      makeSub(2, 4.68, 8.64, 'time after time', 'снова и снова'),
      makeSub(3, 8.64, 11.89, 'i have done my sentence', 'я отбыл свой срок'),
      makeSub(4, 11.89, 15.83, 'but committed no crime', 'но не совершал преступления'),
      makeSub(5, 15.83, 19.78, 'and bad mistakes', 'и тяжких ошибок'),
      makeSub(6, 19.78, 23.51, 'i have made a few', 'я совершил немного'),
      makeSub(7, 23.51, 27.16, 'i have had my share of sand kicked in my face', 'мне тоже швыряли песок в лицо'),
      makeSub(8, 27.16, 34.26, 'but i have come through and we mean to go on and on and on', 'но я выстоял и мы намерены идти вперед снова и снова'),
      makeSub(9, 34.26, 41.36, 'we are the champions my friends', 'мы чемпионы друзья мои'),
      makeSub(10, 41.36, 48.80, 'and we will keep on fighting till the end', 'и мы продолжим бороться до конца'),
      makeSub(11, 48.80, 56.40, 'we are the champions we are the champions', 'мы чемпионы мы чемпионы'),
      makeSub(12, 56.40, 67.50, 'no time for losers because we are the champions of the world', 'не время для проигравших потому что мы чемпионы мира')
    ],
    grammarBreakdown: [
      { ruleTitle: 'Present Perfect for Life Experience', lyricQuote: 'i have paid my dues time after time', explanation: 'have paid (V3) выражает жизненный опыт до момента речи с фокусом на результат в настоящем.', grammarTag: 'present-perfect' },
      { ruleTitle: 'Past Simple for Definite Events', lyricQuote: 'i have done my sentence but committed no crime', explanation: 'committed в Past Simple выражает завершенное действие в прошлом в контрасте с Present Perfect.', grammarTag: 'past-simple' },
      { ruleTitle: 'Keep on + Gerund', lyricQuote: 'we will keep on fighting till the end', explanation: 'фразовый глагол keep on в сочетании с герундием fighting означает непрерывное продолжение действия.', grammarTag: 'phrasal-verbs' },
      { ruleTitle: 'Colloquial Contraction', lyricQuote: 'no time for losers because we are the champions', explanation: 'в песне часто используется cause как разговорное сокращение от because.', grammarTag: 'informal-english' }
    ],
    typingSentences: [
      { id: 'qc-1', english: 'i have paid my dues time after time and i have done my sentence but committed no crime', russian: 'я платил по счетам снова и снова и я отбыл свой срок но не совершал преступления', grammarTip: 'контраст present perfect have paid и past simple committed' },
      { id: 'qc-2', english: 'and bad mistakes i have made a few i have had my share of sand kicked in my face', russian: 'и тяжких ошибок я совершил немного мне тоже швыряли песок в лицо', grammarTip: 'present perfect have made have had для жизненного опыта' },
      { id: 'qc-3', english: 'we are the champions my friends and we will keep on fighting till the end', russian: 'мы чемпионы друзья мои и мы продолжим бороться до конца', grammarTip: 'keep on fighting конструкция продолжения действия' },
      { id: 'qc-4', english: 'we are the champions no time for losers because we are the champions of the world', russian: 'мы чемпионы не время для проигравших потому что мы чемпионы мира', grammarTip: 'утвердительные конструкции и ритм песни' }
    ]
  },
  {
    id: 'coldplay-scientist',
    title: 'The Scientist',
    artist: 'Coldplay',
    level: 'B1',
    videoUrl: 'https://www.youtube.com/embed/RB-RcX5DS5A',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    grammarFocus: 'Infinitive of purpose, modal verbs and expressions of regret',
    subtitles: [
      makeSub(1, 2.17, 8.52, 'come up to meet you tell you i am sorry', 'прийти чтобы встретиться с тобой сказать что мне жаль'),
      makeSub(2, 8.52, 15.26, 'you do not know how lovely you are', 'ты даже не знаешь насколько ты прекрасна'),
      makeSub(3, 15.26, 21.80, 'i had to find you tell you i need you', 'я должен был найти тебя сказать что ты мне нужна'),
      makeSub(4, 21.80, 28.27, 'tell you i set you apart', 'сказать что ты для меня особенная'),
      makeSub(5, 28.27, 35.14, 'tell me your secrets and ask me your questions', 'открой мне свои секреты и задай свои вопросы'),
      makeSub(6, 35.14, 41.56, 'oh let us go back to the start', 'давай вернемся к самому началу'),
      makeSub(7, 41.56, 47.96, 'running in circles coming up tails', 'бежим по кругу выпадает решка'),
      makeSub(8, 47.96, 54.11, 'heads on a science apart', 'головы погружены в отдельную науку'),
      makeSub(9, 54.11, 60.69, 'nobody said it was easy', 'никто не говорил что будет легко'),
      makeSub(10, 60.69, 67.40, 'it is such a shame for us to part', 'так жаль что нам пришлось расстаться')
    ],
    grammarBreakdown: [
      { ruleTitle: 'Infinitive of Purpose', lyricQuote: 'come up to meet you tell you i am sorry', explanation: 'Инфинитив с частицей to (to meet, to tell) указывает на цель действия: зачем пришёл.', grammarTag: 'infinitive' },
      { ruleTitle: 'Modal Verb of Obligation in Past', lyricQuote: 'i had to find you tell you i need you', explanation: 'had to это форма прошедшего времени от must/have to выражающая внешнюю необходимость.', grammarTag: 'modals' }
    ],
    typingSentences: [
      { id: 'cs-1', english: 'come up to meet you tell you i am sorry you do not know how lovely you are', russian: 'прийти чтобы встретиться с тобой сказать что мне жаль ты не знаешь как ты прекрасна', grammarTip: 'infinitive of purpose to meet you to tell you' },
      { id: 'cs-2', english: 'i had to find you tell you i need you tell you i set you apart', russian: 'я должен был найти тебя сказать что ты мне нужна сказать что ты особенная', grammarTip: 'had to прошедшее время от must' }
    ]
  },
  {
    id: 'beatles-yesterday',
    title: 'Yesterday',
    artist: 'The Beatles',
    level: 'A2',
    videoUrl: 'https://www.youtube.com/embed/ogKi-58S26Y',
    thumbnailUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    grammarFocus: 'Past Simple, Used to and contrast with present',
    subtitles: [
      makeSub(1, 5.06, 13.53, 'yesterday all my troubles seemed so far away', 'вчера все мои невзгоды казались такими далекими'),
      makeSub(2, 13.53, 17.24, 'now it looks as though they are here to stay', 'теперь кажется будто они останутся навсегда'),
      makeSub(3, 17.24, 22.64, 'oh i believe in yesterday', 'о я верю во вчерашний день'),
      makeSub(4, 22.64, 30.02, 'suddenly i am not half the man i used to be', 'вдруг я больше не тот человек кем был раньше'),
      makeSub(5, 30.02, 34.37, 'there is a shadow hanging over me', 'надо мной нависла тень'),
      makeSub(6, 34.37, 39.88, 'oh yesterday came suddenly', 'о вчерашний день ушел внезапно'),
      makeSub(7, 39.88, 44.20, 'why she had to go', 'почему она должна была уйти'),
      makeSub(8, 44.20, 49.54, 'i do not know she would not say', 'я не знаю она не сказала'),
      makeSub(9, 49.54, 54.10, 'i said something wrong', 'я сказал что то не так'),
      makeSub(10, 54.10, 59.87, 'now i long for yesterday', 'теперь я тоскую по вчерашнему дню')
    ],
    grammarBreakdown: [
      { ruleTitle: 'Past Simple for Past States', lyricQuote: 'all my troubles seemed so far away', explanation: 'seemed правильный глагол в Past Simple указывает на состояние в прошлом.', grammarTag: 'past-simple' },
      { ruleTitle: 'Used to for Past Habits or States', lyricQuote: 'i am not half the man i used to be', explanation: 'used to выражает состояние или привычку в прошлом которая больше не актуальна в настоящем.', grammarTag: 'used-to' }
    ],
    typingSentences: [
      { id: 'by-1', english: 'yesterday all my troubles seemed so far away now it looks as though they are here to stay', russian: 'вчера все невзгоды казались далекими теперь кажется будто они здесь навсегда', grammarTip: 'past simple seemed в контрасте с настоящим looks' },
      { id: 'by-2', english: 'suddenly i am not half the man i used to be there is a shadow hanging over me', russian: 'вдруг я больше не тот кем был раньше надо мной нависла тень', grammarTip: 'конструкция used to для прошлых состояний' }
    ]
  },
  {
    id: 'steve-lacy-the-feeling',
    title: 'The Feeling',
    artist: 'Steve Lacy',
    level: 'B2',
    videoUrl: 'https://www.youtube.com/embed/ZNvgxCQbHf4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    grammarFocus: 'Idioms, participle clauses, modals (could / would rather) and conditionals',
    subtitles: [
      makeSub(1, 23.82, 34.73, 'something is burning i smell fire', 'что то горит я чувствую запах огня'),
      makeSub(2, 34.73, 45.84, 'the devil is working hard to keep me alone', 'дьявол усердно старается оставить меня одного'),
      makeSub(3, 45.84, 52.63, 'i know we are down to the wire', 'я знаю мы на самом пределе'),
      makeSub(4, 52.63, 57.19, 'oh i cannot be without you', 'о я не могу быть без тебя'),
      makeSub(5, 57.19, 67.00, 'i often wonder where your head is so confused', 'я часто гадаю где твои мысли так запутался'),
      makeSub(6, 67.00, 69.59, 'the heart takes what it wants', 'сердце берет то что хочет'),
      makeSub(7, 69.59, 77.56, 'i am not scared to bleed you know our history', 'я не боюсь боли ты знаешь нашу историю'),
      makeSub(8, 77.56, 85.86, 'after all there is one thing i do not know', 'в конце концов есть одна вещь которую я не знаю'),
      makeSub(9, 85.86, 97.04, 'am i your baby am i your baby', 'я твой малыш я твой малыш'),
      makeSub(10, 111.82, 117.28, 'staring at your pictures wishing i was with you', 'смотрю на твои фото желая быть с тобой'),
      makeSub(11, 117.28, 120.30, 'i could let it go but i am not a quitter', 'я мог бы отпустить это но я не сдаюсь'),
      makeSub(12, 120.30, 122.94, 'i cannot let you go i am in love with you', 'я не могу тебя отпустить я влюблен в тебя'),
      makeSub(13, 122.94, 128.57, 'sending all the signals pay me some attention', 'посылаю все сигналы обрати на меня внимание'),
      makeSub(14, 128.57, 131.26, 'kept it to myself because i did not want to be a burden', 'держал в себе потому что не хотел быть обузой'),
      makeSub(15, 131.26, 136.48, 'this is not going to heal if we do not make a deal', 'это не заживет если мы не договоримся'),
      makeSub(16, 142.37, 147.64, 'because i could spend my whole life waiting', 'потому что я мог бы провести всю жизнь в ожидании'),
      makeSub(17, 147.64, 153.30, 'i would rather not so baby let us get on', 'я бы предпочел этого не делать так что давай двигаться дальше')
    ],
    grammarBreakdown: [
      { ruleTitle: 'Idiom: Down to the Wire', lyricQuote: 'i know we are down to the wire', explanation: 'down to the wire — популярная английская идиома, означающая «до самого последнего момента / на пределе».', grammarTag: 'idioms' },
      { ruleTitle: 'Participle Clauses (-ing)', lyricQuote: 'staring at your pictures wishing i was with you', explanation: 'Причастные обороты staring и wishing передают одновременные действия и переживания без лишних союзов.', grammarTag: 'participles' },
      { ruleTitle: 'Would Rather (Preference)', lyricQuote: 'i would rather not so baby let us get on', explanation: 'Конструкция would rather (not) выражает личное предпочтение — «я бы предпочёл не делать этого».', grammarTag: 'modals' },
      { ruleTitle: 'First Conditional', lyricQuote: 'this is not going to heal if we do not make a deal', explanation: 'Реальное условие будущего: be going to в главной части и Present Simple после if.', grammarTag: 'conditionals' }
    ],
    typingSentences: [
      { id: 'sl-1', english: 'something is burning i smell fire the devil is working hard to keep me alone', russian: 'что-то горит я чувствую запах огня дьявол усердно старается оставить меня одного', grammarTip: 'present continuous is burning is working для текущих процессов' },
      { id: 'sl-2', english: 'i know we are down to the wire oh i cannot be without you the heart takes what it wants', russian: 'я знаю мы на пределе о я не могу быть без тебя сердце берет то что хочет', grammarTip: 'идиома down to the wire и модальный глагол cannot' },
      { id: 'sl-3', english: 'staring at your pictures wishing i was with you i could let it go but i am not a quitter', russian: 'смотрю на твои фото желая быть с тобой я мог бы отпустить это но я не сдаюсь', grammarTip: 'причастные обороты staring wishing и модальный could' },
      { id: 'sl-4', english: 'this is not going to heal if we do not make a deal i would rather not so baby let us get on', russian: 'это не заживет если мы не договоримся я бы предпочел этого не делать так что давай двигаться дальше', grammarTip: 'first conditional и конструкция would rather not' }
    ]
  },
  {
    id: 'wham-last-christmas',
    title: 'Last Christmas',
    artist: 'Wham!',
    level: 'A2',
    videoUrl: 'https://www.youtube.com/embed/E8gmARGvPlI',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&auto=format&fit=crop&q=80',
    grammarFocus: 'Past Simple, Future Will, Second Conditional and English idioms',
    subtitles: [
      makeSub(1, 17.41, 22.29, 'last christmas i gave you my heart', 'в прошлое рождество я отдал тебе свое сердце'),
      makeSub(2, 22.29, 26.87, 'but the very next day you gave it away', 'но на следующий же день ты от него избавилась'),
      makeSub(3, 26.87, 31.79, 'this year to save me from tears', 'в этом году чтобы уберечь себя от слез'),
      makeSub(4, 31.79, 34.98, 'i will give it to someone special', 'я отдам его кому то особенному'),
      makeSub(5, 34.98, 42.72, 'last christmas i gave you my heart', 'в прошлое рождество я отдал тебе свое сердце'),
      makeSub(6, 42.72, 49.08, 'but the very next day you gave it away this year to save me from tears', 'но на следующий же день ты отдала его в этом году чтобы спасти себя от слез'),
      makeSub(7, 49.08, 56.00, 'i will give it to someone special', 'я отдам его кому то особенному'),
      makeSub(8, 72.06, 77.05, 'once bitten and twice shy', 'обжегшись однажды дуешь на воду'),
      makeSub(9, 77.05, 80.57, 'i keep my distance but you still catch my eye', 'я держу дистанцию но ты все еще привлекаешь мой взгляд'),
      makeSub(10, 80.57, 85.11, 'tell me baby do you recognize me', 'скажи мне детка ты узнаешь меня'),
      makeSub(11, 85.11, 91.16, 'well it has been a year it does not surprise me', 'ну прошел уже год меня это не удивляет'),
      makeSub(12, 91.16, 94.38, 'happy christmas i wrapped it up and sent it', 'с рождеством я упаковал это и отправил'),
      makeSub(13, 94.38, 98.66, 'with a note saying i love you i meant it', 'с запиской я люблю тебя я говорил это искренне'),
      makeSub(14, 98.66, 103.15, 'now i know what a fool i have been', 'теперь я знаю каким глупцом я был'),
      makeSub(15, 103.15, 107.83, 'but if you kissed me now i know you would fool me again', 'но если бы ты поцеловала меня сейчас я знаю ты бы снова меня обманула'),
      makeSub(16, 162.05, 166.87, 'a crowded room friends with tired eyes', 'полная комната друзей с уставшими глазами'),
      makeSub(17, 166.87, 171.93, 'i am hiding from you and your soul of ice', 'я прячусь от тебя и твоей ледяной души')
    ],
    grammarBreakdown: [
      { ruleTitle: 'Past Simple vs Future Will', lyricQuote: 'last christmas i gave you my heart ... i will give it to someone special', explanation: 'Чёткий контраст времён: gave (Past Simple для прошлого Рождества) и will give (решение на будущее).', grammarTag: 'tenses' },
      { ruleTitle: 'Phrasal Verb: Give Away', lyricQuote: 'the very next day you gave it away', explanation: 'Фразовый глагол give away означает «отдать даром / избавиться от чего-то небрежно».', grammarTag: 'phrasal-verbs' },
      { ruleTitle: 'Second Conditional (Unreal Present)', lyricQuote: 'if you kissed me now i know you would fool me again', explanation: 'Нереальное условие настоящего: if + Past Simple (kissed), would + V1 (would fool).', grammarTag: 'conditionals' },
      { ruleTitle: 'Classic Proverb: Once Bitten, Twice Shy', lyricQuote: 'once bitten and twice shy', explanation: 'Знаменитая пословица: «обжегшись однажды, в следующий раз будешь вдвойне осторожен».', grammarTag: 'idioms' }
    ],
    typingSentences: [
      { id: 'lc-1', english: 'last christmas i gave you my heart but the very next day you gave it away', russian: 'в прошлое рождество я отдал тебе свое сердце но на следующий же день ты отдала его', grammarTip: 'past simple gave и фразовый глагол give away' },
      { id: 'lc-2', english: 'this year to save me from tears i will give it to someone special', russian: 'в этом году чтобы уберечь себя от слез я отдам его кому то особенному', grammarTip: 'infinitive of purpose to save и будущее время will give' },
      { id: 'lc-3', english: 'once bitten and twice shy i keep my distance but you still catch my eye', russian: 'обжегшись однажды дуешь на воду я держу дистанцию но ты все еще притягиваешь взгляд', grammarTip: 'идиомы once bitten twice shy и catch my eye' },
      { id: 'lc-4', english: 'now i know what a fool i have been but if you kissed me now i know you would fool me again', russian: 'теперь я знаю каким глупцом я был но если бы ты поцеловала меня сейчас ты бы снова меня обманула', grammarTip: 'present perfect i have been и second conditional if kissed would fool' }
    ]
  },
  {
    id: 'harry-styles-coming-up-roses',
    title: 'Coming Up Roses',
    artist: 'Harry Styles',
    level: 'B1',
    videoUrl: 'https://www.youtube.com/embed/2XdPlgeg71Y',
    thumbnailUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80',
    grammarFocus: 'English idioms (coming up roses, stay the course), First Conditional and Present Perfect',
    subtitles: [
      makeSub(1, 8.52, 10.49, 'tell me your fears', 'расскажи мне о своих страхах'),
      makeSub(2, 10.49, 14.43, 'i have turned back the clocks it is that time of year', 'я перевел часы назад пришло то самое время года'),
      makeSub(3, 14.43, 18.59, 'if we stay the course we could get it right', 'если мы не сойдем с пути у нас может получиться'),
      makeSub(4, 18.59, 24.85, 'but i am not devoid of an appetite', 'но я не лишен жажды жизни'),
      makeSub(5, 24.85, 28.93, 'and everything seems to be coming up roses', 'и кажется что все складывается как нельзя лучше'),
      makeSub(6, 28.93, 33.58, 'but i am scared if we are both right', 'но мне страшно что если мы оба правы'),
      makeSub(7, 33.58, 37.48, 'does that mean we are not aligned', 'значит ли это что мы не на одной волне'),
      makeSub(8, 40.08, 44.16, 'just for tonight let us go hangover chasing', 'только сегодня вечером давай сбежим от реальности'),
      makeSub(9, 44.16, 47.66, 'and i will talk your ear off about why it is safe', 'и я прожужжу тебе все уши почему это безопасно'),
      makeSub(10, 47.66, 53.80, 'as i fumble my words and fall flat on my face through the truth', 'путаясь в словах и терпя неудачу перед правдой'),
      makeSub(11, 56.26, 59.75, 'just say the word and we will take up the test', 'только скажи слово и мы примем это испытание'),
      makeSub(12, 59.75, 63.86, 'where we flirt with the bad ones and skip all the rest', 'где мы играем с опасным и пропускаем все остальное'),
      makeSub(13, 63.86, 69.81, 'but we will see out the night with your head on my chest me and you', 'но мы проведем эту ночь с твоей головой на моей груди ты и я'),
      makeSub(14, 74.22, 78.73, 'there is only me and you', 'есть только я и ты')
    ],
    grammarBreakdown: [
      { ruleTitle: 'Idiom: Coming Up Roses', lyricQuote: 'everything seems to be coming up roses', explanation: 'coming up roses — классическая идиома: «всё складывается блестяще, дела идут в гору».', grammarTag: 'idioms' },
      { ruleTitle: 'Idiom: Stay the Course', lyricQuote: 'if we stay the course we could get it right', explanation: 'stay the course означает «продолжать выбранный путь до конца, несмотря на трудности».', grammarTag: 'idioms' },
      { ruleTitle: 'Idiom: Talk Someone\'s Ear Off', lyricQuote: 'i will talk your ear off about why it is safe', explanation: 'talk someone\'s ear off — разговорная идиома «говорить без умолку, прожужжать все уши».', grammarTag: 'idioms' },
      { ruleTitle: 'Present Perfect (Result)', lyricQuote: 'i have turned back the clocks', explanation: 'Present Perfect подчёркивает действие, результат которого ощущается прямо сейчас.', grammarTag: 'present-perfect' }
    ],
    typingSentences: [
      { id: 'hs-1', english: 'tell me your fears if we stay the course we could get it right', russian: 'расскажи мне о своих страхах если мы не сойдем с пути у нас может получиться', grammarTip: 'идиома stay the course и модальный could' },
      { id: 'hs-2', english: 'and everything seems to be coming up roses does that mean we are not aligned', russian: 'и кажется все складывается прекрасно значит ли это что мы не на одной волне', grammarTip: 'идиома coming up roses и глагол seem to be' },
      { id: 'hs-3', english: 'just say the word and we will take up the test there is only me and you', russian: 'только скажи слово и мы примем испытание есть только я и ты', grammarTip: 'фразовый глагол take up и будущее время will' }
    ]
  },
  {
    id: 'frank-ocean-ivy',
    title: 'Ivy',
    artist: 'Frank Ocean',
    level: 'B1',
    videoUrl: 'https://www.youtube.com/embed/MAJPYBN7LRU',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    grammarFocus: 'Past Continuous, Second Conditional (If I could), Would for past habits',
    subtitles: [
      makeSub(1, 0.84, 7.57, 'i thought that i was dreaming when you said you love me', 'я думал что сплю когда ты сказала что любишь меня'),
      makeSub(2, 7.57, 9.47, 'the start of nothing', 'начало ничего'),
      makeSub(3, 9.47, 15.78, 'i had no chance to prepare i could not see you coming', 'у меня не было шанса подготовиться я не предвидел тебя'),
      makeSub(4, 15.78, 16.94, 'the start of nothing', 'начало ничего'),
      makeSub(5, 16.94, 21.13, 'ooh i could hate you now', 'о я мог бы ненавидеть тебя сейчас'),
      makeSub(6, 21.13, 25.58, 'it is quite alright to hate me now', 'вполне нормально ненавидеть меня сейчас'),
      makeSub(7, 25.58, 27.56, 'when we both know that deep down', 'когда мы оба знаем что в глубине души'),
      makeSub(8, 27.56, 31.67, 'the feeling still deep down is good', 'это чувство в глубине души все еще светлое'),
      makeSub(9, 33.72, 35.68, 'if i could see through walls', 'если бы я мог видеть сквозь стены'),
      makeSub(10, 35.68, 37.92, 'i could see you are faking', 'я бы увидел что ты притворяешься'),
      makeSub(11, 37.92, 39.66, 'if you could see my thoughts', 'если бы ты могла видеть мои мысли'),
      makeSub(12, 39.66, 41.40, 'you would see our faces', 'ты бы увидела наши лица'),
      makeSub(13, 41.40, 46.27, 'safe in my rental like an armored truck back then', 'в безопасности в моей арендованной машине как в броневике тогда'),
      makeSub(14, 48.83, 52.26, 'i am not a kid no more', 'я больше не ребенок'),
      makeSub(15, 52.26, 57.06, 'we will never be those kids again', 'мы уже никогда не станем теми детьми снова'),
      makeSub(16, 64.59, 66.53, 'no matter what i did', 'что бы я ни делал')
    ],
    grammarBreakdown: [
      { ruleTitle: 'Past Continuous in Reported Speech', lyricQuote: 'i thought that i was dreaming when you said you love me', explanation: 'was dreaming передаёт длительное фоновое состояние в момент, когда прозвучала фраза.', grammarTag: 'past-continuous' },
      { ruleTitle: 'Second Conditional (Hypothetical)', lyricQuote: 'if you could see my thoughts you would see our faces', explanation: 'Условие воображаемого настоящего: if + could + V1, would + V1.', grammarTag: 'conditionals' },
      { ruleTitle: 'No Matter What', lyricQuote: 'no matter what i did', explanation: 'Конструкция no matter what + Past Simple означает «что бы я ни делал / несмотря ни на что».', grammarTag: 'conjunctions' }
    ],
    typingSentences: [
      { id: 'fo-1', english: 'i thought that i was dreaming when you said you love me i had no chance to prepare', russian: 'я думал что сплю когда ты сказала что любишь меня у меня не было шанса подготовиться', grammarTip: 'past continuous was dreaming и past simple thought' },
      { id: 'fo-2', english: 'if i could see through walls i could see you are faking if you could see my thoughts you would see our faces', russian: 'если бы я видел сквозь стены я бы увидел что ты притворяешься если бы ты видела мои мысли ты бы увидела наши лица', grammarTip: 'second conditional if could would' },
      { id: 'fo-3', english: 'we will never be those kids again no matter what i did the feeling still deep down is good', russian: 'мы никогда не станем теми детьми снова что бы я ни делал чувство в глубине души все еще светлое', grammarTip: 'будущее время will never be и оборот no matter what' }
    ]
  },
  {
    id: 'sting-shape-of-my-heart',
    title: 'Shape of My Heart',
    artist: 'Sting',
    level: 'B1',
    videoUrl: 'https://www.youtube.com/embed/NlwIDxCjL-8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=600&auto=format&fit=crop&q=80',
    grammarFocus: 'Present Simple habits, Modal May (possibility), Infinitive of Purpose and Metaphors',
    subtitles: [
      makeSub(1, 25.01, 30.69, 'he deals the cards as a meditation', 'он раздает карты словно медитирует'),
      makeSub(2, 30.69, 35.51, 'and those he plays never suspect', 'и те с кем он играет никогда не подозревают'),
      makeSub(3, 35.51, 41.33, 'he does not play for the money he wins', 'он играет не ради денег которые выигрывает'),
      makeSub(4, 41.33, 47.77, 'he does not play for respect', 'он играет не ради уважения'),
      makeSub(5, 47.77, 53.15, 'he deals the cards to find the answer', 'он раздает карты чтобы найти ответ'),
      makeSub(6, 53.15, 58.42, 'the sacred geometry of chance', 'священная геометрия случая'),
      makeSub(7, 58.42, 64.62, 'the hidden law of a probable outcome', 'скрытый закон вероятного исхода'),
      makeSub(8, 64.62, 70.28, 'the numbers lead a dance', 'числа ведут свой танец'),
      makeSub(9, 70.28, 75.89, 'i know that the spades are the swords of a soldier', 'я знаю что пики это мечи солдата'),
      makeSub(10, 75.89, 80.90, 'i know that the clubs are weapons of war', 'я знаю что трефы это орудия войны'),
      makeSub(11, 80.90, 85.93, 'i know that diamonds mean money for this art', 'я знаю что бубны означают деньги за это искусство'),
      makeSub(12, 85.93, 93.26, 'but that is not the shape of my heart', 'но это не форма моего сердца'),
      makeSub(13, 93.26, 98.36, 'he may play the jack of diamonds', 'он может разыграть бубнового валета'),
      makeSub(14, 98.36, 103.99, 'he may lay the queen of spades', 'он может выложить пиковую даму'),
      makeSub(15, 103.99, 109.72, 'he may conceal a king in his hand', 'он может скрыть короля в своей руке'),
      makeSub(16, 109.72, 115.78, 'while the memory of it fades', 'пока память об этом угасает')
    ],
    grammarBreakdown: [
      { ruleTitle: 'Present Simple (3rd Person -s)', lyricQuote: 'he deals the cards as a meditation', explanation: 'В Present Simple с местоимением he к глаголу добавляется окончание -s (deals, plays, wins).', grammarTag: 'present-simple' },
      { ruleTitle: 'Infinitive of Purpose (to + V1)', lyricQuote: 'he deals the cards to find the answer', explanation: 'Инфинитив цели to find объясняет, зачем выполняется действие («чтобы найти ответ»).', grammarTag: 'infinitive' },
      { ruleTitle: 'Modal Verb May (Possibility)', lyricQuote: 'he may conceal a king in his hand', explanation: 'Модальный глагол may выражает вероятность или допущение («он может скрыть»).', grammarTag: 'modals' },
      { ruleTitle: 'Card Suit Symbolism', lyricQuote: 'the spades are the swords of a soldier', explanation: 'Английские названия карточных мастей: spades (пики), clubs (трефы), diamonds (бубны), hearts (червы).', grammarTag: 'vocabulary' }
    ],
    typingSentences: [
      { id: 'sh-1', english: 'he deals the cards as a meditation he deals the cards to find the answer', russian: 'он раздает карты как медитацию он раздает карты чтобы найти ответ', grammarTip: 'present simple 3 лицо deals и инфинитив цели to find' },
      { id: 'sh-2', english: 'i know that the spades are the swords of a soldier i know that the clubs are weapons of war', russian: 'я знаю что пики это мечи солдата я знаю что трефы это орудия войны', grammarTip: 'придаточные с that и лексика карточных мастей' },
      { id: 'sh-3', english: 'he may conceal a king in his hand while the memory of it fades but that is not the shape of my heart', russian: 'он может скрыть короля в руке пока память угасает но это не форма моего сердца', grammarTip: 'модальный глагол may и союз while' }
    ]
  },
  {
    id: 'eagles-hotel-california',
    title: 'Hotel California',
    artist: 'Eagles',
    level: 'B2',
    videoUrl: 'https://www.youtube.com/embed/8y7WGPWYsa0',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&auto=format&fit=crop&q=80',
    grammarFocus: 'Narrative Past Tenses, Past Continuous, Present Perfect with Since',
    subtitles: [
      makeSub(1, 52.78, 59.17, 'on a dark desert highway cool wind in my hair', 'на темном пустынном шоссе прохладный ветер в моих волосах'),
      makeSub(2, 59.17, 65.75, 'warm smell of colitas rising up through the air', 'теплый аромат поднимается в воздух'),
      makeSub(3, 65.75, 72.09, 'up ahead in the distance i saw a shimmering light', 'впереди вдалеке я увидел мерцающий свет'),
      makeSub(4, 72.09, 78.73, 'my head grew heavy and my sight grew dim i had to stop for the night', 'голова отяжелела и взгляд померк мне пришлось остановиться на ночь'),
      makeSub(5, 78.73, 85.77, 'there she stood in the doorway i heard the mission bell', 'там она стояла в дверном проеме я услышал звон колокола'),
      makeSub(6, 85.77, 91.86, 'and i was thinking to myself this could be heaven or this could be hell', 'и я думал про себя это может быть рай или это может быть ад'),
      makeSub(7, 91.86, 98.35, 'then she lit up a candle and she showed me the way', 'затем она зажгла свечу и показала мне путь'),
      makeSub(8, 98.35, 104.83, 'there were voices down the corridor i thought i heard them say', 'в коридоре звучали голоса мне показалось я слышал как они говорят'),
      makeSub(9, 104.83, 110.45, 'welcome to the hotel california', 'добро пожаловать в отель калифорния'),
      makeSub(10, 110.45, 117.40, 'such a lovely place such a lovely face', 'такое чудесное место такое прекрасное лицо'),
      makeSub(11, 117.40, 123.66, 'plenty of room at the hotel california', 'много места в отеле калифорния'),
      makeSub(12, 123.66, 130.71, 'any time of year you can find it here', 'в любое время года ты найдешь его здесь'),
      makeSub(13, 144.05, 150.31, 'how they dance in the courtyard sweet summer sweat', 'как они танцуют во внутреннем дворе сладкий летний пот'),
      makeSub(14, 150.31, 156.94, 'some dance to remember some dance to forget', 'одни танцуют чтобы помнить другие чтобы забыть'),
      makeSub(15, 156.94, 162.51, 'so i called up the captain please bring me my wine', 'и я позвал капитана пожалуйста принесите мне вина'),
      makeSub(16, 162.51, 169.00, 'he said we have not had that spirit here since nineteen sixty nine', 'он сказал у нас не было этого духа здесь с 1969 года')
    ],
    grammarBreakdown: [
      { ruleTitle: 'Narrative Past Simple + Irregular Verbs', lyricQuote: 'my head grew heavy and my sight grew dim ... she lit up a candle', explanation: 'Литературное повествование в прошлом: grow→grew, light→lit, stand→stood, hear→heard.', grammarTag: 'irregular-verbs' },
      { ruleTitle: 'Present Perfect + Since', lyricQuote: 'we have not had that spirit here since nineteen sixty nine', explanation: 'Классическое правило Present Perfect с точкой отсчёта в прошлом: have not had + since + год.', grammarTag: 'present-perfect' },
      { ruleTitle: 'Wordplay: Spirit (Double Meaning)', lyricQuote: 'we have not had that spirit here since nineteen sixty nine', explanation: 'Тонкая игра слов: spirit означает одновременно и «крепкий алкоголь», и «дух свободы 60-х».', grammarTag: 'vocabulary' },
      { ruleTitle: 'Parallel Infinitives of Purpose', lyricQuote: 'some dance to remember some dance to forget', explanation: 'Параллельная риторическая конструкция с инфинитивами цели to remember / to forget.', grammarTag: 'infinitive' }
    ],
    typingSentences: [
      { id: 'hc-1', english: 'on a dark desert highway cool wind in my hair up ahead in the distance i saw a shimmering light', russian: 'на темном пустынном шоссе прохладный ветер в волосах впереди вдалеке я увидел мерцающий свет', grammarTip: 'повествовательный past simple saw и описательные прилагательные' },
      { id: 'hc-2', english: 'and i was thinking to myself this could be heaven or this could be hell', russian: 'и я думал про себя это может быть рай или это может быть ад', grammarTip: 'past continuous was thinking и модальный could' },
      { id: 'hc-3', english: 'some dance to remember some dance to forget welcome to the hotel california', russian: 'одни танцуют чтобы помнить другие чтобы забыть добро пожаловать в отель калифорния', grammarTip: 'параллельные инфинитивы цели to remember to forget' },
      { id: 'hc-4', english: 'he said we have not had that spirit here since nineteen sixty nine', russian: 'он сказал у нас не было этого духа здесь с 1969 года', grammarTip: 'present perfect have not had с предлогом since' }
    ]
  },
  {
    id: 'hozier-take-me-to-church',
    title: 'Take Me to Church',
    artist: 'Hozier',
    level: 'B2',
    videoUrl: 'https://www.youtube.com/embed/PVjiKRfKpPI',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80',
    grammarFocus: 'Past Modals (should have), Passive Voice, Future Will and Literary Metaphors',
    subtitles: [
      makeSub(1, 11.12, 16.70, 'my lover has got humor she is the giggle at a funeral', 'у моей возлюбленной есть чувство юмора она смех на похоронах'),
      makeSub(2, 16.70, 18.26, 'knows everybody disapproval', 'знает всеобщее неодобрение'),
      makeSub(3, 18.26, 22.61, 'they should have worshipped her sooner', 'им следовало поклоняться ей раньше'),
      makeSub(4, 22.61, 28.37, 'if the heavens ever did speak she is the last true mouthpiece', 'если небеса когда либо говорили она последний истинный голос'),
      makeSub(5, 28.37, 34.21, 'every sunday is getting more bleak a fresh poison each week', 'каждое воскресенье становится мрачнее свежий яд каждую неделю'),
      makeSub(6, 34.21, 37.98, 'we were born sick you heard them say it', 'мы родились больными ты слышала как они говорили это'),
      makeSub(7, 37.98, 43.39, 'my church offers no absolutes she tells me worship in the bedroom', 'моя церковь не предлагает абсолютов она говорит мне молись в спальне'),
      makeSub(8, 43.39, 49.17, 'the only heaven i will be sent to is when i am alone with you', 'единственный рай куда меня отправят это когда я наедине с тобой'),
      makeSub(9, 49.17, 52.50, 'i was born sick but i love it', 'я родился больным но мне это нравится'),
      makeSub(10, 52.50, 55.33, 'command me to be well', 'прикажи мне исцелиться'),
      makeSub(11, 67.31, 72.38, 'take me to church i will worship like a dog at the shrine of your lies', 'отведи меня в церковь я буду поклоняться у алтаря твоей лжи'),
      makeSub(12, 72.38, 76.20, 'i will tell you my sins and you can sharpen your knife', 'я расскажу тебе свои грехи и ты можешь наточить свой нож'),
      makeSub(13, 76.20, 82.15, 'offer me that deathless death oh good god let me give you my life', 'подари мне эту бессмертную смерть о боже позволь мне отдать тебе свою жизнь'),
      makeSub(14, 98.45, 103.50, 'if i am a pagan of the good times my lover is the sunlight', 'если я язычник добрых времен моя возлюбленная это солнечный свет')
    ],
    grammarBreakdown: [
      { ruleTitle: 'Past Modal: Should Have + V3', lyricQuote: 'they should have worshipped her sooner', explanation: 'should have + V3 выражает упрёк или сожаление о действии, которое не произошло в прошлом.', grammarTag: 'modals' },
      { ruleTitle: 'Future Passive Voice', lyricQuote: 'the only heaven i will be sent to', explanation: 'Пассивный залог будущего времени: will be + V3 (will be sent — «куда меня отправят»).', grammarTag: 'passive' },
      { ruleTitle: 'Emphatic Do in Past', lyricQuote: 'if the heavens ever did speak', explanation: 'Вспомогательный глагол did в утвердительном предложении усиливает смысл («если бы небеса действительно заговорили»).', grammarTag: 'emphasis' },
      { ruleTitle: 'Comparative: Getting + More + Adj', lyricQuote: 'every sunday is getting more bleak', explanation: 'Present Continuous + get + сравнительная степень описывает постепенное нарастающее изменение.', grammarTag: 'comparatives' }
    ],
    typingSentences: [
      { id: 'hz-1', english: 'they should have worshipped her sooner if the heavens ever did speak she is the last true mouthpiece', russian: 'им следовало поклоняться ей раньше если небеса когда либо говорили она последний истинный голос', grammarTip: 'модальный глагол в прошлом should have worshipped и эмфатический did' },
      { id: 'hz-2', english: 'the only heaven i will be sent to is when i am alone with you command me to be well', russian: 'единственный рай куда меня отправят это когда я наедине с тобой прикажи мне исцелиться', grammarTip: 'пассивный залог будущего времени will be sent' },
      { id: 'hz-3', english: 'take me to church i will tell you my sins and you can sharpen your knife let me give you my life', russian: 'отведи меня в церковь я расскажу тебе грехи и ты можешь наточить нож позволь мне отдать тебе жизнь', grammarTip: 'повелительное наклонение take me let me и будущее время will' }
    ]
  },
  {
    id: 'kendrick-count-me-out',
    title: 'Count Me Out',
    artist: 'Kendrick Lamar',
    level: 'B2',
    videoUrl: 'https://www.youtube.com/embed/6nTcdw7bVdc',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    grammarFocus: 'Phrasal Verbs (count out, shut down), Modals (may), Colloquial Speech & Rhetorical Questions',
    subtitles: [
      makeSub(1, 0.64, 8.79, 'we may not know which way to go on this dark road', 'мы можем не знать куда идти по этой темной дороге'),
      makeSub(2, 21.50, 27.88, 'session ten breakthrough', 'десятая сессия прорыв'),
      makeSub(3, 27.88, 29.46, 'one of these lives i am going to make things right', 'в одной из этих жизней я все исправлю'),
      makeSub(4, 29.46, 31.28, 'with the wrongs i have done that is one of you now', 'с ошибками что я совершил теперь это часть пути'),
      makeSub(5, 31.28, 33.24, 'with the father son until then i fight', 'с верой а до тех пор я сражаюсь'),
      makeSub(6, 33.24, 34.69, 'rain on me put the blame on me', 'пусть льет на меня возложите вину на меня'),
      makeSub(7, 34.69, 36.52, 'got guilt got hurt got shame on me', 'на мне вина на мне боль на мне стыд'),
      makeSub(8, 36.52, 38.26, 'got six magazines that are aimed at me', 'шесть журналов нацелены на меня'),
      makeSub(9, 38.26, 40.06, 'done every magazine what is fame to me', 'был на каждой обложке что для меня слава'),
      makeSub(10, 40.06, 42.21, 'it is a game to me and i am tripping and falling', 'для меня это игра и я спотыкаюсь и падаю'),
      makeSub(11, 43.95, 45.45, 'what is fed when the hearts and the words do not reach', 'чем питаться когда сердца и слова не доходят'),
      makeSub(12, 45.45, 47.33, 'what is fair when the money does not take things back', 'что справедливо когда деньги не возвращают прошлое'),
      makeSub(13, 47.33, 49.18, 'it is rare when somebody takes your dreams back', 'редкость когда кто то возвращает твои мечты'),
      makeSub(14, 49.18, 50.94, 'i care too much want to share too much', 'я переживаю слишком сильно хочу делиться слишком многим'),
      makeSub(15, 50.94, 54.00, 'in my head too much i shut down too', 'слишком много в своей голове я тоже закрываюсь')
    ],
    grammarBreakdown: [
      { ruleTitle: 'Phrasal Verb: Count Someone Out', lyricQuote: 'count me out', explanation: 'count someone out означает «списать кого-то со счетов / не рассчитывать на него».', grammarTag: 'phrasal-verbs' },
      { ruleTitle: 'Phrasal Verb: Shut Down', lyricQuote: 'in my head too much i shut down too', explanation: 'shut down в психологическом контексте — «эмоционально закрыться, уйти в себя».', grammarTag: 'phrasal-verbs' },
      { ruleTitle: 'Modal May Not + Indirect Question', lyricQuote: 'we may not know which way to go on this dark road', explanation: 'Косвенный вопрос с инфинитивом: know + which way + to go.', grammarTag: 'modals' },
      { ruleTitle: 'Present Perfect (Experience)', lyricQuote: 'with the wrongs i have done', explanation: 'Present Perfect для накопленного жизненного опыта и последствий прошлых поступков.', grammarTag: 'present-perfect' }
    ],
    typingSentences: [
      { id: 'kc-1', english: 'we may not know which way to go on this dark road one of these lives i am going to make things right', russian: 'мы можем не знать куда идти по этой темной дороге однажды я все исправлю', grammarTip: 'косвенный вопрос which way to go и конструкция be going to' },
      { id: 'kc-2', english: 'rain on me put the blame on me what is fair when the money does not take things back', russian: 'возложите вину на меня что справедливо когда деньги не возвращают прошлое', grammarTip: 'риторический вопрос и фразовый глагол take back' },
      { id: 'kc-3', english: 'i care too much want to share too much in my head too much i shut down too', russian: 'я переживаю слишком сильно хочу делиться слишком многим я тоже закрываюсь', grammarTip: 'наречие too much и фразовый глагол shut down' }
    ]
  },
  {
    id: 'kendrick-prayer',
    title: 'Prayer',
    artist: 'Kendrick Lamar',
    level: 'C1',
    videoUrl: 'https://www.youtube.com/embed/BPbFD41Jyso',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&auto=format&fit=crop&q=80',
    grammarFocus: 'Passive Voice in Past, Causative Make, Advanced Literary Vocabulary & Allegory',
    subtitles: [
      makeSub(1, 23.63, 29.20, 'i was born on february twenty fourth nineteen seventy', 'я родился двадцать четвертого февраля тысяча девятьсот семидесятого года'),
      makeSub(2, 29.20, 32.36, 'the day i was delivered they said i would build a legacy', 'в день моего появления они сказали что я создам наследие'),
      makeSub(3, 32.36, 35.08, 'picture me with influence that lasts generations', 'представь меня с влиянием которое длится поколениями'),
      makeSub(4, 35.08, 38.32, 'i was made out of love to keep you happy and educated', 'я был создан из любви чтобы делать вас счастливыми и просвещенными'),
      makeSub(5, 38.32, 41.28, 'the first three letters of the alphabet my name', 'первые три буквы алфавита мое имя'),
      makeSub(6, 41.28, 44.52, 'i made you laugh i made you dance i made you sing', 'я заставил вас смеяться танцевать и петь'),
      makeSub(7, 44.52, 47.88, 'i have been around the world and back you recorded my almanac', 'я объехал весь мир и вернулся вы записали мой альманах'),
      makeSub(8, 47.88, 50.99, 'so dearly way before the fact me and pops were estranged', 'задолго до того как мы с отцом отдалились друг от друга'),
      makeSub(9, 50.99, 54.16, 'my father was a public figure bigger than life', 'мой отец был публичной фигурой масштабнее самой жизни'),
      makeSub(10, 54.16, 56.96, 'lived as a winner on stages alike', 'жил как победитель на всех сценах мира'),
      makeSub(11, 56.96, 59.40, 'rivers of people surely united just to see our bond', 'реки людей объединялись лишь чтобы увидеть нашу связь'),
      makeSub(12, 59.40, 61.92, 'time carried on that was a common thread', 'время шло дальше это была общая нить'),
      makeSub(13, 61.92, 64.20, 'my perfect father had many flaws', 'у моего идеального отца было много изъянов'),
      makeSub(14, 64.20, 66.72, 'still they moved their legs and shook their heads in unison', 'но они все равно двигались в унисон'),
      makeSub(15, 78.28, 81.60, 'the price of being iconic was heavy and cruel', 'цена того чтобы быть культовым оказалась тяжелой и жестокой'),
      makeSub(16, 81.60, 85.50, 'i stood on stage and had to watch my father on the news', 'я стоял на сцене и был вынужден смотреть на отца в новостях')
    ],
    grammarBreakdown: [
      { ruleTitle: 'Past Simple Passive', lyricQuote: 'the day i was delivered ... i was made out of love', explanation: 'Пассивный залог в прошлом (was + V3) используется для описания происхождения и судьбы лирического героя (песни ABC).', grammarTag: 'passive' },
      { ruleTitle: 'Causative Structure: Make + Obj + V1', lyricQuote: 'i made you laugh i made you dance i made you sing', explanation: 'После глагола make в значении «заставлять/побуждать» инфинитив идёт без частицы to.', grammarTag: 'causative' },
      { ruleTitle: 'Future in the Past (would)', lyricQuote: 'they said i would build a legacy', explanation: 'Согласование времён в косвенной речи: will превращается в would после глагола said.', grammarTag: 'reported-speech' },
      { ruleTitle: 'C1 Vocabulary: Estranged / Common Thread', lyricQuote: 'me and pops were estranged ... that was a common thread', explanation: 'estranged — «отчуждённый, отдалившийся»; common thread — «связующая нить, лейтмотив».', grammarTag: 'vocabulary' }
    ],
    typingSentences: [
      { id: 'kp-1', english: 'the day i was delivered they said i would build a legacy picture me with influence that lasts generations', russian: 'в день моего появления они сказали что я создам наследие представь меня с влиянием на поколения', grammarTip: 'пассивный залог was delivered и future in the past would build' },
      { id: 'kp-2', english: 'i was made out of love to keep you happy and educated i made you laugh i made you dance i made you sing', russian: 'я был создан из любви чтобы делать вас счастливыми я заставил вас смеяться танцевать и петь', grammarTip: 'каузативная конструкция make somebody do' },
      { id: 'kp-3', english: 'my perfect father had many flaws time carried on that was a common thread', russian: 'у моего идеального отца было много изъянов время шло это была общая нить', grammarTip: 'фразовый глагол carry on и идиома common thread' }
    ]
  },
  {
    id: 'kendrick-samidot',
    title: 'Sing About Me, I\'m Dying of Thirst',
    artist: 'Kendrick Lamar',
    level: 'C1',
    videoUrl: 'https://www.youtube.com/embed/xtIr8k4eC7o',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    grammarFocus: 'Time Clauses (When + Present Simple), Phrasal Verbs (settle down), Complex Storytelling C1',
    subtitles: [
      makeSub(1, 14.10, 15.70, 'when the lights shut off', 'когда погаснет свет'),
      makeSub(2, 15.70, 17.86, 'and it is my turn to settle down', 'и придет мой черед обрести покой'),
      makeSub(3, 17.86, 19.43, 'my main concern', 'моя главная забота'),
      makeSub(4, 19.43, 22.31, 'promise that you will sing about me', 'пообещай что ты споешь обо мне'),
      makeSub(5, 22.31, 25.55, 'promise that you will sing about me', 'пообещай что ты споешь обо мне'),
      makeSub(6, 25.55, 27.25, 'i said when the lights shut off', 'я сказал когда погаснет свет'),
      makeSub(7, 27.25, 29.40, 'and it is my turn to settle down', 'и придет мой черед уйти на покой'),
      makeSub(8, 29.40, 31.01, 'my main concern', 'моя главная тревога'),
      makeSub(9, 31.01, 33.92, 'promise that you will sing about me', 'пообещай что ты споешь обо мне'),
      makeSub(10, 38.13, 40.10, 'i woke up this morning and figured i would call you', 'я проснулся этим утром и решил позвонить тебе'),
      makeSub(11, 40.10, 41.52, 'in case i am not here tomorrow', 'на случай если меня не будет здесь завтра'),
      makeSub(12, 41.52, 43.70, 'i am hoping that i can borrow a piece of mind', 'я надеюсь что смогу одолжить немного спокойствия'),
      makeSub(13, 43.70, 45.80, 'i am behind on what is really important', 'я отстаю в том что действительно важно'),
      makeSub(14, 45.80, 46.95, 'my mind is really distorted', 'мой разум сильно искажен'),
      makeSub(15, 46.95, 49.64, 'i find nothing but trouble in my life', 'я нахожу в своей жизни лишь неприятности'),
      makeSub(16, 49.64, 51.22, 'i am fortunate you believe in a dream', 'мне повезло что ты веришь в мечту'),
      makeSub(17, 54.46, 56.52, 'and last night was just another distraction', 'и прошлая ночь была лишь очередным отвлечением'),
      makeSub(18, 56.52, 59.50, 'or a reaction of what we consider madness', 'или реакцией на то что мы считаем безумием')
    ],
    grammarBreakdown: [
      { ruleTitle: 'Future Time Clause (When + Present Simple)', lyricQuote: 'when the lights shut off ... promise that you will sing about me', explanation: 'После when в значении будущего времени используется Present Simple (shut off), а will — в главной части.', grammarTag: 'time-clauses' },
      { ruleTitle: 'In Case + Present Simple', lyricQuote: 'in case i am not here tomorrow', explanation: 'Союз in case («на случай, если») также требует Present Simple вместо will для описания будущего.', grammarTag: 'conjunctions' },
      { ruleTitle: 'Phrasal Verb: Settle Down', lyricQuote: 'it is my turn to settle down', explanation: 'settle down — «успокоиться, остепениться», а в контексте песни также эвфемизм ухода из жизни.', grammarTag: 'phrasal-verbs' },
      { ruleTitle: 'Idiom: Nothing But', lyricQuote: 'i find nothing but trouble in my life', explanation: 'Конструкция nothing but + существительное означает «ничего, кроме / сплошные неприятности».', grammarTag: 'idioms' }
    ],
    typingSentences: [
      { id: 'ks-1', english: 'when the lights shut off and it is my turn to settle down my main concern promise that you will sing about me', russian: 'когда погаснет свет и придет мой черед обрести покой пообещай что споешь обо мне', grammarTip: 'придаточное времени when и фразовый глагол settle down' },
      { id: 'ks-2', english: 'i woke up this morning and figured i would call you in case i am not here tomorrow', russian: 'я проснулся этим утром и решил позвонить тебе на случай если меня не будет завтра', grammarTip: 'союз in case с настоящим временем для будущего' },
      { id: 'ks-3', english: 'i am hoping that i can borrow a piece of mind i find nothing but trouble in my life', russian: 'я надеюсь одолжить немного спокойствия я нахожу в жизни лишь неприятности', grammarTip: 'конструкция nothing but и устойчивое выражение peace of mind' }
    ]
  },
  {
    id: 'j-cole-4-your-eyez-only',
    title: '4 Your Eyez Only',
    artist: 'J. Cole',
    level: 'C1',
    videoUrl: 'https://www.youtube.com/embed/rT3R6234yVU',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    grammarFocus: 'Prepositions of Concession (Despite), Modals of Possibility (Might), Idioms & Storytelling C1',
    subtitles: [
      makeSub(1, 7.39, 10.42, 'for your eyes only', 'только для твоих глаз'),
      makeSub(2, 13.58, 19.48, 'for your eyes only for your eyes only', 'только для твоих глаз только для твоих глаз'),
      makeSub(3, 22.46, 24.83, 'for your eyes only', 'только для твоих глаз'),
      makeSub(4, 26.74, 30.87, 'it seems my dreams faded for far too long the consequences deadly', 'кажется мои мечты угасли слишком давно а последствия смертельны'),
      makeSub(5, 30.87, 33.75, 'cannot visualize myself as nothing but a criminal', 'не могу представить себя никем кроме преступника'),
      makeSub(6, 33.75, 36.99, 'control the block and stay subliminal', 'контролировать квартал и оставаться в тени'),
      makeSub(7, 40.18, 43.43, 'full of adrenaline ignorant to what death can cause', 'полный адреналина не осознающий что может принести смерть'),
      makeSub(8, 43.43, 45.86, 'there is no coming back family dressed in black', 'пути назад нет семья одета в черное'),
      makeSub(9, 49.80, 52.77, 'and my daughter has got to eat her mama is stressing me', 'а моей дочери нужно есть ее мама давит на меня'),
      makeSub(10, 55.88, 58.01, 'like i am not out in the field like that', 'будто я не пропадаю на улицах ради этого'),
      makeSub(11, 58.01, 61.07, 'i might be low for the moment but i will bounce back', 'возможно сейчас я на дне но я обязательно поднимусь снова'),
      makeSub(12, 61.07, 65.00, 'despite the charges back to the wall i fight regardless', 'несмотря на обвинения прижатый к стене я сражаюсь вопреки всему')
    ],
    grammarBreakdown: [
      { ruleTitle: 'Concession: Despite + Noun', lyricQuote: 'despite the charges back to the wall i fight regardless', explanation: 'Предлог despite («несмотря на») используется сразу с существительным без предлога of.', grammarTag: 'conjunctions' },
      { ruleTitle: 'Phrasal Verb: Bounce Back', lyricQuote: 'i might be low for the moment but i will bounce back', explanation: 'bounce back — яркий фразовый глагол: «быстро оправиться после неудачи, вернуться в строй».', grammarTag: 'phrasal-verbs' },
      { ruleTitle: 'Idiom: Back to the Wall', lyricQuote: 'back to the wall i fight regardless', explanation: 'with one\'s back to the wall — «прижатый к стене, в безвыходной ситуации».', grammarTag: 'idioms' },
      { ruleTitle: 'C1 Vocabulary: Subliminal / Regardless', lyricQuote: 'stay subliminal ... i fight regardless', explanation: 'subliminal — «незаметный, скрытый»; regardless — «несмотря ни на что, вопреки обстоятельствам».', grammarTag: 'vocabulary' }
    ],
    typingSentences: [
      { id: 'jc-1', english: 'for your eyes only it seems my dreams faded for far too long the consequences deadly', russian: 'только для твоих глаз кажется мои мечты угасли слишком давно а последствия смертельны', grammarTip: 'выражение for your eyes only и глагол seem' },
      { id: 'jc-2', english: 'i might be low for the moment but i will bounce back despite the charges i fight regardless', russian: 'возможно сейчас я на дне но я поднимусь снова несмотря на обвинения я сражаюсь вопреки всему', grammarTip: 'модальный might фразовый глагол bounce back и предлог despite' },
      { id: 'jc-3', english: 'full of adrenaline ignorant to what death can cause there is no coming back', russian: 'полный адреналина не осознающий последствий пути назад нет', grammarTip: 'прилагательное ignorant to и герундий coming back' }
    ]
  }
]

export const api = {
  async getTopics(level?: string): Promise<GrammarTopic[]> {
    try {
      const url = level ? `${API_BASE}/topics?level=${encodeURIComponent(level)}` : `${API_BASE}/topics`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)
      return await res.json()
    } catch {
      // Fallback
      if (level) {
        return FALLBACK_TOPICS.filter(t => t.level.toLowerCase() === level.toLowerCase())
      }
      return FALLBACK_TOPICS
    }
  },

  async getLesson(topicId: string): Promise<LessonData> {
    try {
      const res = await fetch(`${API_BASE}/lessons/${topicId}`)
      if (!res.ok) throw new Error(`Failed to load lesson: ${res.status}`)
      return await res.json()
    } catch {
      if (FALLBACK_LESSONS[topicId]) {
        return FALLBACK_LESSONS[topicId]
      }
      return {
        id: topicId,
        title: 'Present Perfect Practice',
        level: 'B1',
        description: 'Отработка грамматики и скорости печати.',
        sentences: FALLBACK_LESSONS['pres-perf'].sentences
      }
    }
  },

  async getAdaptiveLesson(keys: string[]): Promise<LessonData> {
    const keysParam = keys.join(',')
    try {
      const res = await fetch(`${API_BASE}/adaptive/weak-keys?keys=${encodeURIComponent(keysParam)}`)
      if (!res.ok) throw new Error(`Failed to load adaptive lesson`)
      return await res.json()
    } catch {
      return {
        id: 'adaptive-weak-keys',
        title: `тренировка слабых клавиш: [${keys.map(k => k.toLowerCase()).join(', ')}]`,
        level: 'Adaptive',
        description: 'предложения с высокой концентрацией проблемных букв без знаков препинания',
        sentences: [
          {
            id: 'ad-1',
            english: 'rapid prototyping requires proper practice and continuous testing to ensure that all critical software components perform reliably under heavy network load',
            russian: 'быстрое прототипирование требует правильной практики и непрерывного тестирования чтобы гарантировать надежную работу всех компонентов под нагрузкой',
            grammarTip: 'повышенная концентрация букв r p t'
          },
          {
            id: 'ad-2',
            english: 'senior programmers write clean structured code and optimize database queries to achieve the lowest possible response latency across all backend services',
            russian: 'сеньор программисты пишут чистый структурированный код и оптимизируют запросы к базе данных для минимальной задержки ответа сервисов',
            grammarTip: 'тренировка пальцев правой и левой руки'
          }
        ]
      }
    }
  },

  async saveStats(stats: SessionStats): Promise<{ success: boolean; recordId: string }> {
    const res = await fetch(`${API_BASE}/stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stats)
    })
    if (!res.ok) throw new Error('Не удалось сохранить статистику')
    return await res.json()
  },

  async getStatsSummary(): Promise<UserStatsSummary> {
    try {
      const res = await fetch(`${API_BASE}/stats`)
      if (!res.ok) throw new Error('Failed to fetch stats')
      return await res.json()
    } catch {
      return {
        totalSessions: 12,
        avgWpm: 71.4,
        avgAccuracy: 98.1,
        totalErrors: 14,
        weakKeysFrequency: { p: 5, r: 4, t: 3 }
      }
    }
  },

  async getVocabulary(): Promise<VocabularyWord[]> {
    try {
      const res = await fetch(`${API_BASE}/vocabulary`)
      if (!res.ok) throw new Error('Failed to fetch vocabulary')
      return await res.json()
    } catch {
      return [
        {
          id: 'v1',
          word: 'thoroughly',
          translation: 'тщательно, основательно',
          phonetic: '/ˈθʌr.ə.li/',
          partOfSpeech: 'adverb',
          mistakeCount: 3,
          audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/thoroughly-uk.mp3'
        },
        {
          id: 'v2',
          word: 'occurrence',
          translation: 'случай, происшествие',
          phonetic: '/əˈkʌr.əns/',
          partOfSpeech: 'noun',
          mistakeCount: 2,
          audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/occurrence-uk.mp3'
        }
      ]
    }
  },

  async addVocabularyWord(word: { word: string; translation: string; phonetic?: string; partOfSpeech?: string; audioUrl?: string }): Promise<VocabularyWord> {
    const res = await fetch(`${API_BASE}/vocabulary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(word)
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Ошибка при добавлении слова')
    }
    return await res.json()
  },

  async deleteVocabularyWord(id: string): Promise<void> {
    await fetch(`${API_BASE}/vocabulary/${id}`, { method: 'DELETE' })
  },

  async getLeaderboard(level?: string): Promise<LeaderboardEntry[]> {
    try {
      const url = level && level !== 'all' ? `${API_BASE}/leaderboard?level=${encodeURIComponent(level)}` : `${API_BASE}/leaderboard`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Failed to load leaderboard: ${res.status}`)
      return await res.json()
    } catch {
      if (level && level !== 'all') {
        return FALLBACK_LEADERBOARD.filter(e => e.level.toLowerCase() === level.toLowerCase())
      }
      return FALLBACK_LEADERBOARD
    }
  },

  async submitToLeaderboard(entry: { userName: string; wpm: number; accuracy: number; topicTitle: string; level: string }): Promise<LeaderboardEntry> {
    const res = await fetch(`${API_BASE}/leaderboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Ошибка при отправке в лидерборд')
    }
    return await res.json()
  },

  async getMusicLessons(): Promise<Array<{ id: string; title: string; artist: string; level: string; thumbnailUrl: string; grammarFocus: string; sentenceCount: number }>> {
    try {
      const res = await fetch(`${API_BASE}/music-lessons`)
      if (!res.ok) throw new Error(`Failed to load music lessons: ${res.status}`)
      return await res.json()
    } catch {
      return FALLBACK_MUSIC_LESSONS.map(m => ({
        id: m.id,
        title: m.title,
        artist: m.artist,
        level: m.level,
        thumbnailUrl: m.thumbnailUrl,
        grammarFocus: m.grammarFocus,
        sentenceCount: m.typingSentences.length
      }))
    }
  },

  async getMusicLesson(id: string): Promise<MusicLesson> {
    try {
      const res = await fetch(`${API_BASE}/music-lessons/${id}`)
      if (!res.ok) throw new Error(`Failed to load music lesson ${id}: ${res.status}`)
      return await res.json()
    } catch {
      const found = FALLBACK_MUSIC_LESSONS.find(m => m.id === id)
      if (found) return found
      return FALLBACK_MUSIC_LESSONS[0]
    }
  }
}
