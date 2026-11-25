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
  const duration = Math.max(0.4, endSeconds - startSeconds)
  let cursor = startSeconds
  const words = tokens.map((word, idx) => {
    const wDur = duration * (weights[idx] / totalWeight)
    const wEnd = idx === tokens.length - 1 ? endSeconds : Math.round((cursor + wDur) * 100) / 100
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
    videoUrl: 'https://www.youtube.com/embed/NrgmdOz227I',
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
