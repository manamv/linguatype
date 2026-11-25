using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Enable CORS for frontend development
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();
app.UseCors();

// In-Memory Database / Store
var topics = new List<GrammarTopic>
{
    new("pres-perf", "present perfect vs past simple", "B1", 
        "разница между результатом в настоящем и завершенным действием в прошлом",
        [
            new("s1", "she has already completed this difficult engineering report on time and the lead architect has verified all database schema changes with the entire team", "она уже завершила этот сложный инженерный отчёт вовремя и главный архитектор проверил все изменения схемы базы данных со всей командой", "already указывает на результат в настоящем have или has плюс v3"),
            new("s2", "they went to the international tech conference in berlin last tuesday and presented their new automated deployment pipeline to many distributed backend developers", "они поехали на международную технологическую конференцию в берлин в прошлый вторник и представили свой новый автоматизированный пайплайн деплоя разработчикам", "last tuesday указывает на конкретный момент в прошлом past simple"),
            new("s3", "we have never observed such an innovative microservice architecture before in any enterprise software system because the latency was always extremely low", "мы никогда раньше не наблюдали столь инновационной микросервисной архитектуры ни в одной корпоративной системе потому что задержка была низкой", "never в контексте жизненного опыта до настоящего момента present perfect"),
            new("s4", "the core team launched our new cloud service two weeks ago and we have monitored every transaction continuously without any major production incident", "основная команда запустила наш новый облачный сервис две недели назад и мы непрерывно отслеживаем каждую транзакцию без каких либо инцидентов", "ago требует past simple а непрерывный мониторинг до настоящего времени present perfect"),
            new("s5", "have you ever refactored a legacy distributed system under high workload and maintained complete backward compatibility with all external client applications", "вы когда нибудь рефакторили легаси распределенную систему под высокой нагрузкой и сохраняли полную обратную совместимость с внешними приложениями", "ever в вопросе о жизненном опыте требует present perfect")
        ]),

    new("cond-2", "second and third conditionals", "B2", 
        "нереальные условия в настоящем и прошлом без знаков препинания",
        [
            new("c1", "if i had more free time during the working week i would learn three modern programming languages simultaneously and build high performance web applications", "если бы у меня было больше свободного времени на рабочей неделе я бы учил три языка программирования одновременно и создавал быстрые приложения", "второй тип условных предложений нереальное настоящее if плюс past simple would плюс v1"),
            new("c2", "if we had deployed the database migration yesterday the unexpected production incident would not have occurred and the system would be completely stable today", "если бы мы развернули миграцию базы данных вчера непредвиденного инцидента на проде не произошло бы и система была бы стабильна сегодня", "третий тип условных предложений сожаление о прошлом if плюс had v3 would have v3"),
            new("c3", "she would travel around the world if she worked remotely as a senior engineer and had sufficient balance to support long journeys across different continents", "она бы путешествовала по миру если бы работала удаленно сеньор инженером и имела достаточный баланс для долгих поездок по разным континентам", "второй тип условных предложений воображаемая ситуация в настоящем"),
            new("c4", "if they had thoroughly tested all edge cases before the deployment the automated release would have succeeded without any manual intervention from engineers", "если бы они тщательно протестировали все граничные случаи перед деплоем автоматический релиз прошел бы успешно без ручного вмешательства инженеров", "третий тип условных предложений гипотетическое прошлое if плюс had v3")
        ]),

    new("pass-voice", "passive voice in tech contexts", "B1", 
        "страдательный залог объект действия важнее исполнителя",
        [
            new("p1", "all critical microservices are monitored continuously by our automated observability stack and incident reports are delivered immediately to engineers on call", "все критические микросервисы непрерывно мониторятся нашим стеком наблюдаемости и отчеты об инцидентах доставляются дежурным инженерам", "present simple passive are monitored are delivered"),
            new("p2", "the automated integration tests were executed before the pull request was merged into the main development branch by the release manager yesterday afternoon", "автоматические интеграционные тесты были выполнены до того как пулл реквест был слит в основную ветку разработки релиз менеджером вчера днём", "past simple passive were executed was merged"),
            new("p3", "all authentication tokens must be kept confidential by every team member so that unauthorized access to private user records is completely prevented at all times", "все токены аутентификации должны храниться в тайне каждым членом команды чтобы несанкционированный доступ к записям был предотвращен", "modal passive must be kept is prevented")
        ]),

    new("rel-clauses", "defining and non defining relative clauses", "B2", 
        "придаточные определительные предложения со словами who which that",
        [
            new("r1", "the software architect who designed our event driven distributed system received an international award and gave an inspiring lecture on system reliability", "архитектор по который спроектировал нашу событийно ориентированную систему получил международную премию и прочитал вдохновляющую лекцию", "defining relative clause со словом who"),
            new("r2", "docker containers which isolate operating system processes enhance reproducible deployment pipelines and speed up local developer environments everywhere", "контейнеры докер которые изолируют процессы операционной системы улучшают воспроизводимость пайплайнов и ускоряют среду разработки", "relative clause со словом which")
        ]),

    new("a1-basics", "present simple and daily routines", "A1", 
        "базовые утверждения отрицания и вопросы о повседневных привычках",
        [
            new("a1", "she writes clean and readable code every single morning and then reviews pull requests submitted by other software engineers across the development company", "она пишет чистый и читаемый код каждое утро а затем проверяет пулл реквесты отправленные другими инженерами компании", "present simple третье лицо единственное число writes reviews"),
            new("a2", "we always drink fresh hot coffee before our first engineering standup meeting and discuss our daily tasks and upcoming release milestones together as a team", "мы всегда пьем свежий горячий кофе перед первым инженерным стендапом и обсуждаем наши ежедневные задачи и цели релиза вместе", "present simple с наречием частотности always drink discuss"),
            new("a3", "our development team does not ignore software accessibility guidelines because every modern web application must be convenient for all people around the world", "наша команда разработки не игнорирует руководства по доступности по потому что каждое приложение должно быть удобным для всех людей", "отрицание в present simple does not ignore")
        ]),

    new("past-continuous", "past continuous vs past simple", "A2",
        "параллельные и прерванные действия в прошлом без пунктуации",
        [
            new("pc1", "while the backend engineer was deploying the microservice to production the automated pipeline detected a sudden memory leak", "пока бэкенд инженер развертывал микросервис на проде автоматический пайплайн обнаружил внезапную утечку памяти", "длительное действие в прошлом was deploying прервано кратким detected"),
            new("pc2", "they were discussing the new database schema when the lead architect received an urgent notification from the monitor server", "они обсуждали новую схему базы данных когда ведущий архитектор получил срочное уведомление с сервера мониторинга", "past continuous were discussing с союзом when и past simple received"),
            new("pc3", "we were investigating the latency drop all evening yesterday while client applications were experiencing slow response times", "мы расследовали падение задержки весь вчерашний вечер в то время как клиентские приложения испытывали медленный отклик", "два параллельных длительных действия с союзом while were investigating were experiencing")
        ]),

    new("future-forms", "future forms will going to present continuous", "B1",
        "разница между спонтанными решениями планами и точными договоренностями",
        [
            new("ff1", "our engineering team is going to rewrite the legacy authentication module during the next development sprint in march", "наша команда инженеров собирается переписать устаревший модуль аутентификации во время следующего спринта разработки в марте", "намерение и заранее спланированное решение is going to rewrite"),
            new("ff2", "the cloud server is running out of memory so the automated orchestrator will spin up two additional worker instances soon", "на облачном сервере заканчивается память поэтому оркестратор вскоре запустит два дополнительных экземпляра воркеров", "спонтанное решение или логический прогноз will spin up"),
            new("ff3", "we are meeting with the product stakeholders tomorrow morning at ten oclock to review the quarterly roadmap milestones", "мы встречаемся со стейкхолдерами продукта завтра утром в десять часов чтобы обсудить ключевые этапы квартального роадмапа", "запланированная договоренность во времени present continuous are meeting")
        ]),

    new("modal-deduction", "modals of deduction must cannot might", "B2",
        "выражение уверенности и предположений в настоящем и прошлом",
        [
            new("md1", "the distributed database cluster cannot be offline because the health check endpoint is responding with status two hundred ok", "распределенный кластер базы данных не может быть оффлайн так как эндпоинт проверки здоровья отвечает статусом двести", "уверенность в невозможности действия cannot be"),
            new("md2", "the unexpected spike in cpu workload must be caused by an infinite loop in the background synchronization worker thread", "неожиданный скачок нагрузки на процессор должно быть вызван бесконечным циклом в фоновом потоке синхронизации", "логическая уверенность в причине происходящего must be caused"),
            new("md3", "the security audit team might have detected unauthorized access attempts in the network traffic logs earlier this afternoon", "команда аудита безопасности возможно обнаружила попытки несанкционированного доступа в логах сетевого трафика сегодня днем", "предположение о действии в прошлом might have detected")
        ]),

    new("phrasal-tech", "essential phrasal verbs in software engineering", "B2",
        "ключевые фразовые глаголы в разработке и системной инженерии",
        [
            new("pv1", "the devops engineer decided to roll back the broken container image and spin up the previous stable release immediately", "девопс инженер решил откатить поврежденный образ контейнера и немедленно запустить предыдущий стабильный релиз", "фразовые глаголы roll back откатить и spin up запустить контейнер"),
            new("pv2", "our development squad will figure out why the message queue is backing up and sort out all bottleneck queries this morning", "наш отряд разработки выяснит почему очередь сообщений переполняется и разберется с узкими местами этим утром", "figure out понять выяснить и sort out устранить проблему"),
            new("pv3", "we need to carry out comprehensive load testing before we roll out the new payment gateway integration to all active customers", "нам необходимо провести комплексное нагрузочное тестирование перед тем как выкатить новую интеграцию платежного шлюза", "carry out проводить испытания и roll out развертывать релиз")
        ]),

    new("c1-inversion", "advanced inversion and fronting", "C1",
        "эмфатическая инверсия порядка слов после отрицательных наречий",
        [
            new("inv1", "seldom have we witnessed such an elegant software architecture handle millions of concurrent user sessions with zero downtime", "редко когда мы наблюдали столь элегантную архитектуру программного обеспечения выдерживающую миллионы сессий без простоев", "инверсия после seldom вспомогательный глагол have перед подлежащим we"),
            new("inv2", "hardly had the engineers merged the feature branch when the continuous integration pipeline executed all regression test suites", "едва только инженеры слили ветку фичи как пайплайн непрерывной интеграции запустил все регрессионные тесты", "конструкция hardly had v3 when с обратным порядком слов"),
            new("inv3", "not only did the development team refactor the legacy codebase but they also reduced the overall server latency by half", "команда разработки не только провела рефакторинг легаси кода но и сократила общую задержку сервера вдвое", "инверсия с not only did they refactor")
        ]),

    new("reported-speech", "reported speech in technical discussions", "B1",
        "косвенная речь и согласование времен в командных обсуждениях",
        [
            new("rs1", "the lead architect explained that the distributed system would scale horizontally once the cache invalidation bug was fixed", "главный архитектор объяснил что распределенная система будет масштабироваться по горизонтали как только баг будет исправлен", "согласование времен в косвенной речи will переходит в would"),
            new("rs2", "she said that the frontend developers had already verified all accessibility guidelines before submitting the pull request", "она сказала что фронтенд разработчики уже проверили все правила доступности перед отправкой пулл реквеста", "предшествующее действие в косвенной речи past perfect had verified"),
            new("rs3", "our scrum master asked whether the engineering team could complete the database migration before the scheduled maintenance window", "наш скрам мастер спросил сможет ли команда завершить миграцию базы данных до запланированного окна обслуживания", "косвенный вопрос со словом whether и модальным could")
        ]),

    new("a1-articles", "articles a an the and zero article", "A1",
        "определенный неопределенный и нулевой артикль в повседневной речи",
        [
            new("art1", "an experienced developer always writes a clear commit message before pushing the changes to the remote repository", "опытный разработчик всегда пишет понятное сообщение коммита перед отправкой изменений в удаленный репозиторий", "an перед гласным звуком experienced a перед согласным the для конкретных изменений"),
            new("art2", "the laptop on the wooden desk has an aluminum body and runs a fast linux distribution for daily software development", "ноутбук на деревянном столе имеет алюминиевый корпус и работает на быстрой сборке линукс для ежедневной разработки", "the для конкретного предмета на столе an aluminum body"),
            new("art3", "clean code is essential for software engineering because programmers spend hours reading documentation every week", "чистый код необходим для программной инженерии так как программисты тратят часы на чтение документации каждую неделю", "нулевой артикль перед неисчисляемыми и обобщенными понятиями software engineering documentation")
        ]),

    new("a2-prepositions", "prepositions of time and place in on at", "A2",
        "точное употребление предлогов времени и места в рабочих ситуациях",
        [
            new("prep1", "our sprint planning meeting starts at nine oclock on monday morning in the main glass conference room", "наше планирование спринта начинается в девять часов в понедельник утром в главной стеклянной переговорной", "at с точным временем on с днями недели in с помещениями"),
            new("prep2", "the security patch was released in november on the fifteenth day right at midnight without any service downtime", "патч безопасности был выпущен в ноябре пятнадцатого числа ровно в полночь без простоя сервиса", "in с месяцами on с конкретными датами at midnight"),
            new("prep3", "she works at a fintech startup in london and usually reviews architecture diagrams on the train ride home", "она работает в финтех стартапе в лондоне и обычно просматривает схемы архитектуры в поезде по дороге домой", "at с организацией in с городом on the train с общественным транспортом")
        ]),

    new("b1-gerund-inf", "gerund vs infinitive after verbs", "B1",
        "когда после глагола ставить форму с ing а когда инфинитив с to",
        [
            new("gi1", "we decided to postpone deploying the experimental feature because the team wanted to avoid introducing subtle race conditions", "мы решили отложить деплой экспериментальной фичи потому что команда хотела избежать появления тонких состояний гонки", "decide to v1 postpone plus ving avoid plus ving"),
            new("gi2", "the senior engineer suggested refactoring the authentication middleware before attempting to integrate the third party oauth provider", "сеньор инженер предложил отрефакторить прослойку аутентификации перед попыткой интегрировать стороннего провайдера", "suggest plus ving attempt to v1"),
            new("gi3", "she managed to optimize the sql query by indexing the primary columns and stopped running expensive full table scans", "она сумела оптимизировать запрос проиндексировав основные столбцы и прекратила выполнять дорогие полные сканирования таблиц", "manage to v1 stop plus ving прекратить действие")
        ]),

    new("c1-mixed-cond", "mixed conditionals and wish clauses", "C1",
        "смешанные условные предложения связь прошлого с настоящим и сожаления",
        [
            new("mc1", "if we had adopted strict type safety two years ago our production codebase would be far more maintainable right now", "если бы мы внедрили строгую типизацию два года назад наша кодовая база была бы гораздо более поддерживаемой прямо сейчас", "смешанный тип if плюс had v3 прошлое и would v1 результат в настоящем"),
            new("mc2", "i wish we had documented the legacy encryption algorithm thoroughly before the original systems architect left the company", "жаль что мы не задокументировали устаревший алгоритм шифрования подробно до ухода первоначального системного архитектора", "wish плюс past perfect had documented сожаление о прошлом"),
            new("mc3", "if the core server were not under heavy load right now the benchmark suite would have finished ten minutes ago", "если бы основной сервер не был под высокой нагрузкой сейчас набор бенчмарков завершился бы десять минут назад", "смешанный тип постоянное условие в настоящем if were и результат в прошлом would have v3")
        ]),

    new("c1-cleft-sentences", "cleft sentences and academic emphasis", "C1",
        "расщепленные предложения it is that и what is для смыслового акцента",
        [
            new("cs1", "it was the memory allocation bottleneck that caused the sudden drop in throughput during the peak black friday traffic", "именно узкое место выделения памяти вызвало внезапное падение пропускной способности во время пикового трафика", "расщепленное предложение it was x that для усиления фокуса на причине"),
            new("cs2", "what distinguishes a great systems engineer from an average coder is the ability to anticipate hidden failure modes", "что отличает выдающегося системного инженера от обычного кодера так это способность предвидеть скрытые сценарии сбоев", "what cleft sentence what distinguishes ... is ..."),
            new("cs3", "all that the migration script needs is a valid connection string and read only permissions on the staging replica", "все что нужно скрипту миграции это валидная строка подключения и права на чтение для тестовой реплики", "эмфатическая конструкция all that ... is ...")
        ])
};

var userStatsHistory = new List<SessionStats>
{
    new("init-1", "pres-perf", 68, 98.2, 2, 102, ["p", "r"], DateTime.UtcNow.AddDays(-1)),
    new("init-2", "pass-voice", 74, 99.0, 1, 88, ["t"], DateTime.UtcNow.AddHours(-4))
};

var vocabularyList = new List<VocabularyWord>
{
    new("v1", "thoroughly", "тщательно, основательно", "/ˈθʌr.ə.li/", "adverb", 2, "https://api.dictionaryapi.dev/media/pronunciations/en/thoroughly-uk.mp3"),
    new("v2", "occurrence", "явление, происшествие", "/əˈkʌr.əns/", "noun", 3, "https://api.dictionaryapi.dev/media/pronunciations/en/occurrence-uk.mp3"),
    new("v3", "simultaneously", "одновременно, синхронно", "/ˌsɪm.əlˈteɪ.ni.əs.li/", "adverb", 1, "https://api.dictionaryapi.dev/media/pronunciations/en/simultaneously-us.mp3"),
    new("v4", "confidential", "конфиденциальный, секретный", "/ˌkɒn.fɪˈden.ʃəl/", "adjective", 0, "https://api.dictionaryapi.dev/media/pronunciations/en/confidential-uk.mp3")
};

var leaderboard = new List<LeaderboardEntry>
{
    new("lb-1", "alex_speed", 104, 99.4, "present perfect vs past simple", "B1", DateTime.UtcNow.AddHours(-2)),
    new("lb-2", "elena_code", 96, 98.8, "second and third conditionals", "B2", DateTime.UtcNow.AddHours(-5)),
    new("lb-3", "cyber_typer", 88, 97.5, "passive voice in tech contexts", "B1", DateTime.UtcNow.AddDays(-1)),
    new("lb-4", "dev_master", 82, 99.0, "present simple and daily routines", "A1", DateTime.UtcNow.AddDays(-2)),
    new("lb-5", "ninja_keys", 78, 96.2, "defining and non defining relative clauses", "B2", DateTime.UtcNow.AddDays(-3)),
    new("lb-6", "swift_finger", 74, 98.1, "present perfect vs past simple", "B1", DateTime.UtcNow.AddDays(-4)),
    new("lb-7", "touch_pro", 70, 95.9, "present simple and daily routines", "A1", DateTime.UtcNow.AddDays(-5))
};

// Helper: builds a MusicSubtitle with proportional word-level timings aligned to verified LRC boundaries
MusicSubtitleLine MakeSub(int id, double start, double end, string textEn, string textRu)
{
    var tokens = textEn.Split(' ', StringSplitOptions.RemoveEmptyEntries);
    var weights = tokens.Select(w => Math.Max(2.0, w.Length + 1.5)).ToArray();
    var totalWeight = weights.Sum();
    var rawDuration = Math.Max(0.4, end - start);
    var vocalDuration = Math.Min(rawDuration, Math.Max(3.6, tokens.Length * 0.95));
    var vocalEnd = Math.Round(start + vocalDuration, 2);
    var words = new List<SubtitleWord>(tokens.Length);
    var cursor = start;
    for (int i = 0; i < tokens.Length; i++)
    {
        var wDur = vocalDuration * (weights[i] / totalWeight);
        var wEnd = i == tokens.Length - 1 ? vocalEnd : Math.Round(cursor + wDur, 2);
        words.Add(new SubtitleWord(tokens[i], Math.Round(cursor, 2), wEnd));
        cursor = wEnd;
    }
    return new MusicSubtitleLine(id, start, end, textEn, textRu, words);
}

var musicLessons = new List<MusicLesson>
{
    new(
        "queen-champions",
        "We Are the Champions",
        "Queen",
        "B1",
        "https://www.youtube.com/embed/04854XqcfCY",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
        "Present Perfect vs Past Simple, gerunds and colloquial contractions",
        // Duration-matched LRC from lrclib.net for Queen - We Are The Champions (04854XqcfCY, 185s)
        [
            MakeSub(1, 1.20, 4.68, "i have paid my dues", "я платил по счетам"),
            MakeSub(2, 4.68, 8.64, "time after time", "снова и снова"),
            MakeSub(3, 8.64, 11.89, "i have done my sentence", "я отбыл свой срок"),
            MakeSub(4, 11.89, 15.83, "but committed no crime", "но не совершал преступления"),
            MakeSub(5, 15.83, 19.78, "and bad mistakes", "и тяжких ошибок"),
            MakeSub(6, 19.78, 23.51, "i have made a few", "я совершил немного"),
            MakeSub(7, 23.51, 27.16, "i have had my share of sand kicked in my face", "мне тоже швыряли песок в лицо"),
            MakeSub(8, 27.16, 34.26, "but i have come through and we mean to go on and on and on", "но я выстоял и мы намерены идти вперед снова и снова"),
            MakeSub(9, 34.26, 41.36, "we are the champions my friends", "мы чемпионы друзья мои"),
            MakeSub(10, 41.36, 48.80, "and we will keep on fighting till the end", "и мы продолжим бороться до конца"),
            MakeSub(11, 48.80, 56.40, "we are the champions we are the champions", "мы чемпионы мы чемпионы"),
            MakeSub(12, 56.40, 67.50, "no time for losers because we are the champions of the world", "не время для проигравших потому что мы чемпионы мира")
        ],
        [
            new("Present Perfect for Life Experience", "i have paid my dues time after time", "have paid (V3) выражает жизненный опыт до момента речи с фокусом на результат в настоящем.", "present-perfect"),
            new("Past Simple for Definite Events", "i have done my sentence but committed no crime", "committed в Past Simple выражает завершенное действие в прошлом в контрасте с Present Perfect.", "past-simple"),
            new("Keep on + Gerund", "we will keep on fighting till the end", "фразовый глагол keep on в сочетании с герундием fighting означает непрерывное продолжение действия.", "phrasal-verbs"),
            new("Colloquial Contraction", "no time for losers because we are the champions", "в песне часто используется 'cause как разговорное сокращение от because.", "informal-english")
        ],
        [
            new("qc-1", "i have paid my dues time after time and i have done my sentence but committed no crime", "я платил по счетам снова и снова и я отбыл свой срок но не совершал преступления", "контраст present perfect have paid и past simple committed"),
            new("qc-2", "and bad mistakes i have made a few i have had my share of sand kicked in my face", "и тяжких ошибок я совершил немного мне тоже швыряли песок в лицо", "present perfect have made have had для жизненного опыта"),
            new("qc-3", "we are the champions my friends and we will keep on fighting till the end", "мы чемпионы друзья мои и мы продолжим бороться до конца", "keep on fighting конструкция продолжения действия"),
            new("qc-4", "we are the champions no time for losers because we are the champions of the world", "мы чемпионы не время для проигравших потому что мы чемпионы мира", "утвердительные конструкции и ритм песни")
        ]
    ),
    new(
        "coldplay-scientist",
        "The Scientist",
        "Coldplay",
        "B1",
        "https://www.youtube.com/embed/RB-RcX5DS5A",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
        "Infinitive of purpose, modal verbs and expressions of regret",
        // Duration-matched LRC from lrclib.net for Coldplay - The Scientist Official 4K Video (RB-RcX5DS5A, 265s)
        [
            MakeSub(1, 2.17, 8.52, "come up to meet you tell you i am sorry", "прийти чтобы встретиться с тобой сказать что мне жаль"),
            MakeSub(2, 8.52, 15.26, "you do not know how lovely you are", "ты даже не знаешь насколько ты прекрасна"),
            MakeSub(3, 15.26, 21.80, "i had to find you tell you i need you", "я должен был найти тебя сказать что ты мне нужна"),
            MakeSub(4, 21.80, 28.27, "tell you i set you apart", "сказать что ты для меня особенная"),
            MakeSub(5, 28.27, 35.14, "tell me your secrets and ask me your questions", "открой мне свои секреты и задай свои вопросы"),
            MakeSub(6, 35.14, 41.56, "oh let us go back to the start", "давай вернемся к самому началу"),
            MakeSub(7, 41.56, 47.96, "running in circles coming up tails", "бежим по кругу выпадает решка"),
            MakeSub(8, 47.96, 54.11, "heads on a science apart", "головы погружены в отдельную науку"),
            MakeSub(9, 54.11, 60.69, "nobody said it was easy", "никто не говорил что будет легко"),
            MakeSub(10, 60.69, 67.40, "it is such a shame for us to part", "так жаль что нам пришлось расстаться")
        ],
        [
            new("Infinitive of Purpose", "come up to meet you tell you i am sorry", "Инфинитив с частицей to (to meet, to tell) указывает на цель действия: зачем пришёл.", "infinitive"),
            new("Modal Verb of Obligation in Past", "i had to find you tell you i need you", "had to это форма прошедшего времени от must/have to выражающая внешнюю необходимость.", "modals"),
            new("Phrasal Verb Set Apart", "tell you i set you apart", "set apart означает выделять кого-то, считать особенным среди всех.", "phrasal-verbs"),
            new("Impersonal Construction", "it is such a shame for us to part", "it is such a shame выражает сожаление и сочувствие по поводу ситуации.", "constructions")
        ],
        [
            new("cs-1", "come up to meet you tell you i am sorry you do not know how lovely you are", "прийти чтобы встретиться с тобой сказать что мне жаль ты не знаешь как ты прекрасна", "infinitive of purpose to meet you to tell you"),
            new("cs-2", "i had to find you tell you i need you tell you i set you apart", "я должен был найти тебя сказать что ты мне нужна сказать что ты особенная", "had to прошедшее время от must"),
            new("cs-3", "tell me your secrets and ask me your questions oh let us go back to the start", "открой мне свои секреты и задай вопросы давай вернемся к началу", "повелительное наклонение tell me let us go back"),
            new("cs-4", "nobody said it was easy it is such a shame for us to part", "никто не говорил что будет легко так жаль что нам приходится расстаться", "согласование времен nobody said it was easy")
        ]
    ),
    new(
        "beatles-yesterday",
        "Yesterday",
        "The Beatles",
        "A2",
        "https://www.youtube.com/embed/ogKi-58S26Y",
        "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80",
        "Past Simple, Used to and contrast with present",
        // Duration-matched LRC from lrclib.net for The Beatles - Yesterday Remastered 2009 (ogKi-58S26Y, 124s)
        [
            MakeSub(1, 5.06, 13.53, "yesterday all my troubles seemed so far away", "вчера все мои невзгоды казались такими далекими"),
            MakeSub(2, 13.53, 17.24, "now it looks as though they are here to stay", "теперь кажется будто они останутся навсегда"),
            MakeSub(3, 17.24, 22.64, "oh i believe in yesterday", "о я верю во вчерашний день"),
            MakeSub(4, 22.64, 30.02, "suddenly i am not half the man i used to be", "вдруг я больше не тот человек кем был раньше"),
            MakeSub(5, 30.02, 34.37, "there is a shadow hanging over me", "надо мной нависла тень"),
            MakeSub(6, 34.37, 39.88, "oh yesterday came suddenly", "о вчерашний день ушел внезапно"),
            MakeSub(7, 39.88, 44.20, "why she had to go", "почему она должна была уйти"),
            MakeSub(8, 44.20, 49.54, "i do not know she would not say", "я не знаю она не сказала"),
            MakeSub(9, 49.54, 54.10, "i said something wrong", "я сказал что то не так"),
            MakeSub(10, 54.10, 59.87, "now i long for yesterday", "теперь я тоскую по вчерашнему дню")
        ],
        [
            new("Past Simple for Past States", "all my troubles seemed so far away", "seemed правильный глагол в Past Simple указывает на состояние в прошлом.", "past-simple"),
            new("Used to for Past Habits or States", "i am not half the man i used to be", "used to выражает состояние или привычку в прошлом которая больше не актуальна в настоящем.", "used-to"),
            new("As Though / As If", "it looks as though they are here to stay", "as though используется для описания того как что-то выглядит или кажется.", "conjunctions")
        ],
        [
            new("by-1", "yesterday all my troubles seemed so far away now it looks as though they are here to stay", "вчера все невзгоды казались далекими теперь кажется будто они здесь навсегда", "past simple seemed в контрасте с настоящим looks"),
            new("by-2", "suddenly i am not half the man i used to be there is a shadow hanging over me", "вдруг я больше не тот кем был раньше надо мной нависла тень", "конструкция used to для прошлых состояний"),
            new("by-3", "why she had to go i do not know she would not say i said something wrong", "почему она должна была уйти я не знаю она не сказала я сказал что-то не то", "косвенный вопрос why she had to go и модальный would")
        ]
    ),
    new(
        "steve-lacy-the-feeling",
        "The Feeling",
        "Steve Lacy",
        "B2",
        "https://www.youtube.com/embed/ZNvgxCQbHf4",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
        "Idioms, participle clauses, modals (could / would rather) and conditionals",
        // Duration-matched LRC from lrclib.net for Steve Lacy - the feeling (Official Video) (ZNvgxCQbHf4, 276s)
        [
            MakeSub(1, 23.82, 34.73, "something is burning i smell fire", "что то горит я чувствую запах огня"),
            MakeSub(2, 34.73, 45.84, "the devil is working hard to keep me alone", "дьявол усердно старается оставить меня одного"),
            MakeSub(3, 45.84, 52.63, "i know we are down to the wire", "я знаю мы на самом пределе"),
            MakeSub(4, 52.63, 57.19, "oh i cannot be without you", "о я не могу быть без тебя"),
            MakeSub(5, 57.19, 67.00, "i often wonder where your head is so confused", "я часто гадаю где твои мысли так запутался"),
            MakeSub(6, 67.00, 69.59, "the heart takes what it wants", "сердце берет то что хочет"),
            MakeSub(7, 69.59, 77.56, "i am not scared to bleed you know our history", "я не боюсь боли ты знаешь нашу историю"),
            MakeSub(8, 77.56, 85.86, "after all there is one thing i do not know", "в конце концов есть одна вещь которую я не знаю"),
            MakeSub(9, 85.86, 97.04, "am i your baby am i your baby", "я твой малыш я твой малыш"),
            MakeSub(10, 111.82, 117.28, "staring at your pictures wishing i was with you", "смотрю на твои фото желая быть с тобой"),
            MakeSub(11, 117.28, 120.30, "i could let it go but i am not a quitter", "я мог бы отпустить это но я не сдаюсь"),
            MakeSub(12, 120.30, 122.94, "i cannot let you go i am in love with you", "я не могу тебя отпустить я влюблен в тебя"),
            MakeSub(13, 122.94, 128.57, "sending all the signals pay me some attention", "посылаю все сигналы обрати на меня внимание"),
            MakeSub(14, 128.57, 131.26, "kept it to myself because i did not want to be a burden", "держал в себе потому что не хотел быть обузой"),
            MakeSub(15, 131.26, 136.48, "this is not going to heal if we do not make a deal", "это не заживет если мы не договоримся"),
            MakeSub(16, 142.37, 147.64, "because i could spend my whole life waiting", "потому что я мог бы провести всю жизнь в ожидании"),
            MakeSub(17, 147.64, 153.30, "i would rather not so baby let us get on", "я бы предпочел этого не делать так что давай двигаться дальше")
        ],
        [
            new("Idiom: Down to the Wire", "i know we are down to the wire", "down to the wire — популярная английская идиома, означающая «до самого последнего момента / на пределе».", "idioms"),
            new("Participle Clauses (-ing)", "staring at your pictures wishing i was with you", "Причастные обороты staring и wishing передают одновременные действия и переживания без лишних союзов.", "participles"),
            new("Would Rather (Preference)", "i would rather not so baby let us get on", "Конструкция would rather (not) выражает личное предпочтение — «я бы предпочёл не делать этого».", "modals"),
            new("First Conditional", "this is not going to heal if we do not make a deal", "Реальное условие будущего: be going to в главной части и Present Simple после if.", "conditionals")
        ],
        [
            new("sl-1", "something is burning i smell fire the devil is working hard to keep me alone", "что-то горит я чувствую запах огня дьявол усердно старается оставить меня одного", "present continuous is burning is working для текущих процессов"),
            new("sl-2", "i know we are down to the wire oh i cannot be without you the heart takes what it wants", "я знаю мы на пределе о я не могу быть без тебя сердце берет то что хочет", "идиома down to the wire и модальный глагол cannot"),
            new("sl-3", "staring at your pictures wishing i was with you i could let it go but i am not a quitter", "смотрю на твои фото желая быть с тобой я мог бы отпустить это но я не сдаюсь", "причастные обороты staring wishing и модальный could"),
            new("sl-4", "this is not going to heal if we do not make a deal i would rather not so baby let us get on", "это не заживет если мы не договоримся я бы предпочел этого не делать так что давай двигаться дальше", "first conditional и конструкция would rather not")
        ]
    ),
    new(
        "wham-last-christmas",
        "Last Christmas",
        "Wham!",
        "A2",
        "https://www.youtube.com/embed/E8gmARGvPlI",
        "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&auto=format&fit=crop&q=80",
        "Past Simple, Future Will, Second Conditional and English idioms",
        // Duration-matched LRC from lrclib.net for Wham! - Last Christmas (Official Video E8gmARGvPlI, 279s)
        [
            MakeSub(1, 17.41, 22.29, "last christmas i gave you my heart", "в прошлое рождество я отдал тебе свое сердце"),
            MakeSub(2, 22.29, 26.87, "but the very next day you gave it away", "но на следующий же день ты от него избавилась"),
            MakeSub(3, 26.87, 31.79, "this year to save me from tears", "в этом году чтобы уберечь себя от слез"),
            MakeSub(4, 31.79, 34.98, "i will give it to someone special", "я отдам его кому то особенному"),
            MakeSub(5, 34.98, 42.72, "last christmas i gave you my heart", "в прошлое рождество я отдал тебе свое сердце"),
            MakeSub(6, 42.72, 49.08, "but the very next day you gave it away this year to save me from tears", "но на следующий же день ты отдала его в этом году чтобы спасти себя от слез"),
            MakeSub(7, 49.08, 56.00, "i will give it to someone special", "я отдам его кому то особенному"),
            MakeSub(8, 72.06, 77.05, "once bitten and twice shy", "обжегшись однажды дуешь на воду"),
            MakeSub(9, 77.05, 80.57, "i keep my distance but you still catch my eye", "я держу дистанцию но ты все еще привлекаешь мой взгляд"),
            MakeSub(10, 80.57, 85.11, "tell me baby do you recognize me", "скажи мне детка ты узнаешь меня"),
            MakeSub(11, 85.11, 91.16, "well it has been a year it does not surprise me", "ну прошел уже год меня это не удивляет"),
            MakeSub(12, 91.16, 94.38, "happy christmas i wrapped it up and sent it", "с рождеством я упаковал это и отправил"),
            MakeSub(13, 94.38, 98.66, "with a note saying i love you i meant it", "с запиской я люблю тебя я говорил это искренне"),
            MakeSub(14, 98.66, 103.15, "now i know what a fool i have been", "теперь я знаю каким глупцом я был"),
            MakeSub(15, 103.15, 107.83, "but if you kissed me now i know you would fool me again", "но если бы ты поцеловала меня сейчас я знаю ты бы снова меня обманула"),
            MakeSub(16, 162.05, 166.87, "a crowded room friends with tired eyes", "полная комната друзей с уставшими глазами"),
            MakeSub(17, 166.87, 171.93, "i am hiding from you and your soul of ice", "я прячусь от тебя и твоей ледяной души")
        ],
        [
            new("Past Simple vs Future Will", "last christmas i gave you my heart ... i will give it to someone special", "Чёткий контраст времён: gave (Past Simple для прошлого Рождества) и will give (решение на будущее).", "tenses"),
            new("Phrasal Verb: Give Away", "the very next day you gave it away", "Фразовый глагол give away означает «отдать даром / избавиться от чего-то небрежно».", "phrasal-verbs"),
            new("Second Conditional (Unreal Present)", "if you kissed me now i know you would fool me again", "Нереальное условие настоящего: if + Past Simple (kissed), would + V1 (would fool).", "conditionals"),
            new("Classic Proverb: Once Bitten, Twice Shy", "once bitten and twice shy", "Знаменитая пословица: «обжегшись однажды, в следующий раз будешь вдвойне осторожен».", "idioms")
        ],
        [
            new("lc-1", "last christmas i gave you my heart but the very next day you gave it away", "в прошлое рождество я отдал тебе свое сердце но на следующий же день ты отдала его", "past simple gave и фразовый глагол give away"),
            new("lc-2", "this year to save me from tears i will give it to someone special", "в этом году чтобы уберечь себя от слез я отдам его кому то особенному", "infinitive of purpose to save и будущее время will give"),
            new("lc-3", "once bitten and twice shy i keep my distance but you still catch my eye", "обжегшись однажды дуешь на воду я держу дистанцию но ты все еще притягиваешь взгляд", "идиомы once bitten twice shy и catch my eye"),
            new("lc-4", "now i know what a fool i have been but if you kissed me now i know you would fool me again", "теперь я знаю каким глупцом я был но если бы ты поцеловала меня сейчас ты бы снова меня обманула", "present perfect i have been и second conditional if kissed would fool")
        ]
    ),
    new(
        "harry-styles-coming-up-roses",
        "Coming Up Roses",
        "Harry Styles",
        "B1",
        "https://www.youtube.com/embed/2XdPlgeg71Y",
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80",
        "English idioms (coming up roses, stay the course), First Conditional and Present Perfect",
        // Duration-matched LRC from lrclib.net (38917132) for Harry Styles - Coming Up Roses (_3GKsIFtEoE, 249s)
        [
            MakeSub(1, 38.82, 40.79, "tell me your fears", "расскажи мне о своих страхах"),
            MakeSub(2, 40.79, 44.73, "i have turned back the clocks it is that time of year", "я перевел часы назад пришло то самое время года"),
            MakeSub(3, 44.73, 48.89, "if we stay the course we could get it right", "если мы не сойдем с пути у нас может получиться"),
            MakeSub(4, 48.89, 55.15, "but i am not devoid of an appetite", "но я не лишен жажды жизни"),
            MakeSub(5, 55.15, 59.23, "and everything seems to be coming up roses", "и кажется что все складывается как нельзя лучше"),
            MakeSub(6, 59.23, 63.88, "but i am scared if we are both right", "но мне страшно что если мы оба правы"),
            MakeSub(7, 63.88, 67.78, "does that mean we are not aligned", "значит ли это что мы не на одной волне"),
            MakeSub(8, 70.38, 74.46, "just for tonight let us go hangover chasing", "только сегодня вечером давай сбежим от реальности"),
            MakeSub(9, 74.46, 77.96, "and i will talk your ear off about why it is safe", "и я прожужжу тебе все уши почему это безопасно"),
            MakeSub(10, 77.96, 84.10, "as i fumble my words and fall flat on my face through the truth", "путаясь в словах и терпя неудачу перед правдой"),
            MakeSub(11, 86.56, 90.05, "just say the word and we will take up the test", "только скажи слово и мы примем это испытание"),
            MakeSub(12, 90.05, 94.16, "where we flirt with the bad ones and skip all the rest", "где мы играем с опасным и пропускаем все остальное"),
            MakeSub(13, 94.16, 100.11, "but we will see out the night with your head on my chest me and you", "но мы проведем эту ночь с твоей головой на моей груди ты и я"),
            MakeSub(14, 104.52, 109.03, "there is only me and you", "есть только я и ты")
        ],
        [
            new("Idiom: Coming Up Roses", "everything seems to be coming up roses", "coming up roses — классическая идиома: «всё складывается блестяще, дела идут в гору».", "idioms"),
            new("Idiom: Stay the Course", "if we stay the course we could get it right", "stay the course означает «продолжать выбранный путь до конца, несмотря на трудности».", "idioms"),
            new("Idiom: Talk Someone's Ear Off", "i will talk your ear off about why it is safe", "talk someone's ear off — разговорная идиома «говорить без умолку, прожужжать все уши».", "idioms"),
            new("Present Perfect (Result)", "i have turned back the clocks", "Present Perfect подчёркивает действие, результат которого ощущается прямо сейчас.", "present-perfect")
        ],
        [
            new("hs-1", "tell me your fears if we stay the course we could get it right", "расскажи мне о своих страхах если мы не сойдем с пути у нас может получиться", "идиома stay the course и модальный could"),
            new("hs-2", "and everything seems to be coming up roses does that mean we are not aligned", "и кажется все складывается прекрасно значит ли это что мы не на одной волне", "идиома coming up roses и глагол seem to be"),
            new("hs-3", "just say the word and we will take up the test there is only me and you", "только скажи слово и мы примем испытание есть только я и ты", "фразовый глагол take up и будущее время will")
        ]
    ),
    new(
        "frank-ocean-ivy",
        "Ivy",
        "Frank Ocean",
        "B1",
        "https://www.youtube.com/embed/MAJPYBN7LRU",
        "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
        "Past Continuous, Second Conditional (If I could), Would for past habits",
        // Duration-matched LRC from lrclib.net (34000789) for Frank Ocean - Ivy (MAJPYBN7LRU, 249s)
        [
            MakeSub(1, 0.84, 7.57, "i thought that i was dreaming when you said you love me", "я думал что сплю когда ты сказала что любишь меня"),
            MakeSub(2, 7.57, 9.47, "the start of nothing", "начало ничего"),
            MakeSub(3, 9.47, 15.78, "i had no chance to prepare i could not see you coming", "у меня не было шанса подготовиться я не предвидел тебя"),
            MakeSub(4, 15.78, 16.94, "the start of nothing", "начало ничего"),
            MakeSub(5, 16.94, 21.13, "ooh i could hate you now", "о я мог бы ненавидеть тебя сейчас"),
            MakeSub(6, 21.13, 25.58, "it is quite alright to hate me now", "вполне нормально ненавидеть меня сейчас"),
            MakeSub(7, 25.58, 27.56, "when we both know that deep down", "когда мы оба знаем что в глубине души"),
            MakeSub(8, 27.56, 31.67, "the feeling still deep down is good", "это чувство в глубине души все еще светлое"),
            MakeSub(9, 33.72, 35.68, "if i could see through walls", "если бы я мог видеть сквозь стены"),
            MakeSub(10, 35.68, 37.92, "i could see you are faking", "я бы увидел что ты притворяешься"),
            MakeSub(11, 37.92, 39.66, "if you could see my thoughts", "если бы ты могла видеть мои мысли"),
            MakeSub(12, 39.66, 41.40, "you would see our faces", "ты бы увидела наши лица"),
            MakeSub(13, 41.40, 46.27, "safe in my rental like an armored truck back then", "в безопасности в моей арендованной машине как в броневике тогда"),
            MakeSub(14, 48.83, 52.26, "i am not a kid no more", "я больше не ребенок"),
            MakeSub(15, 52.26, 57.06, "we will never be those kids again", "мы уже никогда не станем теми детьми снова"),
            MakeSub(16, 64.59, 66.53, "no matter what i did", "что бы я ни делал")
        ],
        [
            new("Past Continuous in Reported Speech", "i thought that i was dreaming when you said you love me", "was dreaming передаёт длительное фоновое состояние в момент, когда прозвучала фраза.", "past-continuous"),
            new("Second Conditional (Hypothetical)", "if you could see my thoughts you would see our faces", "Условие воображаемого настоящего: if + could + V1, would + V1.", "conditionals"),
            new("No Matter What", "no matter what i did", "Конструкция no matter what + Past Simple означает «что бы я ни делал / несмотря ни на что».", "conjunctions")
        ],
        [
            new("fo-1", "i thought that i was dreaming when you said you love me i had no chance to prepare", "я думал что сплю когда ты сказала что любишь меня у меня не было шанса подготовиться", "past continuous was dreaming и past simple thought"),
            new("fo-2", "if i could see through walls i could see you are faking if you could see my thoughts you would see our faces", "если бы я видел сквозь стены я бы увидел что ты притворяешься если бы ты видела мои мысли ты бы увидела наши лица", "second conditional if could would"),
            new("fo-3", "we will never be those kids again no matter what i did the feeling still deep down is good", "мы никогда не станем теми детьми снова что бы я ни делал чувство в глубине души все еще светлое", "будущее время will never be и оборот no matter what")
        ]
    ),
    new(
        "sting-shape-of-my-heart",
        "Shape of My Heart",
        "Sting",
        "B1",
        "https://www.youtube.com/embed/NlwIDxCjL-8",
        "https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=600&auto=format&fit=crop&q=80",
        "Present Simple habits, Modal May (possibility), Infinitive of Purpose and Metaphors",
        // Duration-matched LRC from lrclib.net (33534655) for Sting - Shape of My Heart (cYiw-2mDlDU, 275s)
        [
            MakeSub(1, 33.84, 39.52, "he deals the cards as a meditation", "он раздает карты словно медитирует"),
            MakeSub(2, 39.52, 44.34, "and those he plays never suspect", "и те с кем он играет никогда не подозревают"),
            MakeSub(3, 44.34, 50.16, "he does not play for the money he wins", "он играет не ради денег которые выигрывает"),
            MakeSub(4, 50.16, 56.60, "he does not play for respect", "он играет не ради уважения"),
            MakeSub(5, 56.60, 61.98, "he deals the cards to find the answer", "он раздает карты чтобы найти ответ"),
            MakeSub(6, 61.98, 67.25, "the sacred geometry of chance", "священная геометрия случая"),
            MakeSub(7, 67.25, 73.45, "the hidden law of a probable outcome", "скрытый закон вероятного исхода"),
            MakeSub(8, 73.45, 79.11, "the numbers lead a dance", "числа ведут свой танец"),
            MakeSub(9, 79.11, 84.72, "i know that the spades are the swords of a soldier", "я знаю что пики это мечи солдата"),
            MakeSub(10, 84.72, 89.73, "i know that the clubs are weapons of war", "я знаю что трефы это орудия войны"),
            MakeSub(11, 89.73, 94.76, "i know that diamonds mean money for this art", "я знаю что бубны означают деньги за это искусство"),
            MakeSub(12, 94.76, 102.09, "but that is not the shape of my heart", "но это не форма моего сердца"),
            MakeSub(13, 102.09, 107.19, "he may play the jack of diamonds", "он может разыграть бубнового валета"),
            MakeSub(14, 107.19, 112.82, "he may lay the queen of spades", "он может выложить пиковую даму"),
            MakeSub(15, 112.82, 118.55, "he may conceal a king in his hand", "он может скрыть короля в своей руке"),
            MakeSub(16, 118.55, 124.61, "while the memory of it fades", "пока память об этом угасает")
        ],
        [
            new("Present Simple (3rd Person -s)", "he deals the cards as a meditation", "В Present Simple с местоимением he к глаголу добавляется окончание -s (deals, plays, wins).", "present-simple"),
            new("Infinitive of Purpose (to + V1)", "he deals the cards to find the answer", "Инфинитив цели to find объясняет, зачем выполняется действие («чтобы найти ответ»).", "infinitive"),
            new("Modal Verb May (Possibility)", "he may conceal a king in his hand", "Модальный глагол may выражает вероятность или допущение («он может скрыть»).", "modals"),
            new("Card Suit Symbolism", "the spades are the swords of a soldier", "Английские названия карточных мастей: spades (пики), clubs (трефы), diamonds (бубны), hearts (червы).", "vocabulary")
        ],
        [
            new("sh-1", "he deals the cards as a meditation he deals the cards to find the answer", "он раздает карты как медитацию он раздает карты чтобы найти ответ", "present simple 3 лицо deals и инфинитив цели to find"),
            new("sh-2", "i know that the spades are the swords of a soldier i know that the clubs are weapons of war", "я знаю что пики это мечи солдата я знаю что трефы это орудия войны", "придаточные с that и лексика карточных мастей"),
            new("sh-3", "he may conceal a king in his hand while the memory of it fades but that is not the shape of my heart", "он может скрыть короля в руке пока память угасает но это не форма моего сердца", "модальный глагол may и союз while")
        ]
    ),
    new(
        "eagles-hotel-california",
        "Hotel California",
        "Eagles",
        "B2",
        "https://www.youtube.com/embed/8y7WGPWYsa0",
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&auto=format&fit=crop&q=80",
        "Narrative Past Tenses, Past Continuous, Present Perfect with Since",
        // Duration-matched LRC from lrclib.net (33331874) for Eagles - Hotel California (8y7WGPWYsa0, 390s)
        [
            MakeSub(1, 52.78, 59.17, "on a dark desert highway cool wind in my hair", "на темном пустынном шоссе прохладный ветер в моих волосах"),
            MakeSub(2, 59.17, 65.75, "warm smell of colitas rising up through the air", "теплый аромат поднимается в воздух"),
            MakeSub(3, 65.75, 72.09, "up ahead in the distance i saw a shimmering light", "впереди вдалеке я увидел мерцающий свет"),
            MakeSub(4, 72.09, 78.73, "my head grew heavy and my sight grew dim i had to stop for the night", "голова отяжелела и взгляд померк мне пришлось остановиться на ночь"),
            MakeSub(5, 78.73, 85.77, "there she stood in the doorway i heard the mission bell", "там она стояла в дверном проеме я услышал звон колокола"),
            MakeSub(6, 85.77, 91.86, "and i was thinking to myself this could be heaven or this could be hell", "и я думал про себя это может быть рай или это может быть ад"),
            MakeSub(7, 91.86, 98.35, "then she lit up a candle and she showed me the way", "затем она зажгла свечу и показала мне путь"),
            MakeSub(8, 98.35, 104.83, "there were voices down the corridor i thought i heard them say", "в коридоре звучали голоса мне показалось я слышал как они говорят"),
            MakeSub(9, 104.83, 110.45, "welcome to the hotel california", "добро пожаловать в отель калифорния"),
            MakeSub(10, 110.45, 117.40, "such a lovely place such a lovely face", "такое чудесное место такое прекрасное лицо"),
            MakeSub(11, 117.40, 123.66, "plenty of room at the hotel california", "много места в отеле калифорния"),
            MakeSub(12, 123.66, 130.71, "any time of year you can find it here", "в любое время года ты найдешь его здесь"),
            MakeSub(13, 144.05, 150.31, "how they dance in the courtyard sweet summer sweat", "как они танцуют во внутреннем дворе сладкий летний пот"),
            MakeSub(14, 150.31, 156.94, "some dance to remember some dance to forget", "одни танцуют чтобы помнить другие чтобы забыть"),
            MakeSub(15, 156.94, 162.51, "so i called up the captain please bring me my wine", "и я позвал капитана пожалуйста принесите мне вина"),
            MakeSub(16, 162.51, 169.00, "he said we have not had that spirit here since nineteen sixty nine", "он сказал у нас не было этого духа здесь с 1969 года")
        ],
        [
            new("Narrative Past Simple + Irregular Verbs", "my head grew heavy and my sight grew dim ... she lit up a candle", "Литературное повествование в прошлом: grow→grew, light→lit, stand→stood, hear→heard.", "irregular-verbs"),
            new("Present Perfect + Since", "we have not had that spirit here since nineteen sixty nine", "Классическое правило Present Perfect с точкой отсчёта в прошлом: have not had + since + год.", "present-perfect"),
            new("Wordplay: Spirit (Double Meaning)", "we have not had that spirit here since nineteen sixty nine", "Тонкая игра слов: spirit означает одновременно и «крепкий алкоголь», и «дух свободы 60-х».", "vocabulary"),
            new("Parallel Infinitives of Purpose", "some dance to remember some dance to forget", "Параллельная риторическая конструкция с инфинитивами цели to remember / to forget.", "infinitive")
        ],
        [
            new("hc-1", "on a dark desert highway cool wind in my hair up ahead in the distance i saw a shimmering light", "на темном пустынном шоссе прохладный ветер в волосах впереди вдалеке я увидел мерцающий свет", "повествовательный past simple saw и описательные прилагательные"),
            new("hc-2", "and i was thinking to myself this could be heaven or this could be hell", "и я думал про себя это может быть рай или это может быть ад", "past continuous was thinking и модальный could"),
            new("hc-3", "some dance to remember some dance to forget welcome to the hotel california", "одни танцуют чтобы помнить другие чтобы забыть добро пожаловать в отель калифорния", "параллельные инфинитивы цели to remember to forget"),
            new("hc-4", "he said we have not had that spirit here since nineteen sixty nine", "он сказал у нас не было этого духа здесь с 1969 года", "present perfect have not had с предлогом since")
        ]
    ),
    new(
        "hozier-take-me-to-church",
        "Take Me to Church",
        "Hozier",
        "B2",
        "https://www.youtube.com/embed/PVjiKRfKpPI",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80",
        "Past Modals (should have), Passive Voice, Future Will and Literary Metaphors",
        // Duration-matched LRC from lrclib.net (16504502) for Hozier - Take Me to Church (NGNk6u_kLso, 240s)
        [
            MakeSub(1, 2.82, 8.40, "my lover has got humor she is the giggle at a funeral", "у моей возлюбленной есть чувство юмора она смех на похоронах"),
            MakeSub(2, 8.40, 9.96, "knows everybody disapproval", "знает всеобщее неодобрение"),
            MakeSub(3, 9.96, 14.31, "they should have worshipped her sooner", "им следовало поклоняться ей раньше"),
            MakeSub(4, 14.31, 20.07, "if the heavens ever did speak she is the last true mouthpiece", "если небеса когда либо говорили она последний истинный голос"),
            MakeSub(5, 20.07, 25.91, "every sunday is getting more bleak a fresh poison each week", "каждое воскресенье становится мрачнее свежий яд каждую неделю"),
            MakeSub(6, 25.91, 29.68, "we were born sick you heard them say it", "мы родились больными ты слышала как они говорили это"),
            MakeSub(7, 29.68, 35.09, "my church offers no absolutes she tells me worship in the bedroom", "моя церковь не предлагает абсолютов она говорит мне молись в спальне"),
            MakeSub(8, 35.09, 40.87, "the only heaven i will be sent to is when i am alone with you", "единственный рай куда меня отправят это когда я наедине с тобой"),
            MakeSub(9, 40.87, 44.20, "i was born sick but i love it", "я родился больным но мне это нравится"),
            MakeSub(10, 44.20, 47.03, "command me to be well", "прикажи мне исцелиться"),
            MakeSub(11, 59.01, 64.08, "take me to church i will worship like a dog at the shrine of your lies", "отведи меня в церковь я буду поклоняться у алтаря твоей лжи"),
            MakeSub(12, 64.08, 67.90, "i will tell you my sins and you can sharpen your knife", "я расскажу тебе свои грехи и ты можешь наточить свой нож"),
            MakeSub(13, 67.90, 73.85, "offer me that deathless death oh good god let me give you my life", "подари мне эту бессмертную смерть о боже позволь мне отдать тебе свою жизнь"),
            MakeSub(14, 90.15, 95.20, "if i am a pagan of the good times my lover is the sunlight", "если я язычник добрых времен моя возлюбленная это солнечный свет")
        ],
        [
            new("Past Modal: Should Have + V3", "they should have worshipped her sooner", "should have + V3 выражает упрёк или сожаление о действии, которое не произошло в прошлом.", "modals"),
            new("Future Passive Voice", "the only heaven i will be sent to", "Пассивный залог будущего времени: will be + V3 (will be sent — «куда меня отправят»).", "passive"),
            new("Emphatic Do in Past", "if the heavens ever did speak", "Вспомогательный глагол did в утвердительном предложении усиливает смысл («если бы небеса действительно заговорили»).", "emphasis"),
            new("Comparative: Getting + More + Adj", "every sunday is getting more bleak", "Present Continuous + get + сравнительная степень описывает постепенное нарастающее изменение.", "comparatives")
        ],
        [
            new("hz-1", "they should have worshipped her sooner if the heavens ever did speak she is the last true mouthpiece", "им следовало поклоняться ей раньше если небеса когда либо говорили она последний истинный голос", "модальный глагол в прошлом should have worshipped и эмфатический did"),
            new("hz-2", "the only heaven i will be sent to is when i am alone with you command me to be well", "единственный рай куда меня отправят это когда я наедине с тобой прикажи мне исцелиться", "пассивный залог будущего времени will be sent"),
            new("hz-3", "take me to church i will tell you my sins and you can sharpen your knife let me give you my life", "отведи меня в церковь я расскажу тебе грехи и ты можешь наточить нож позволь мне отдать тебе жизнь", "повелительное наклонение take me let me и будущее время will")
        ]
    ),
    new(
        "kendrick-count-me-out",
        "Count Me Out",
        "Kendrick Lamar",
        "B2",
        "https://www.youtube.com/embed/6nTcdw7bVdc",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
        "Phrasal Verbs (count out, shut down), Modals (may), Colloquial Speech & Rhetorical Questions",
        // Duration-matched LRC from lrclib.net (36363856) for Kendrick Lamar - Count Me Out (uEbRjy7RNKU, 284s)
        [
            MakeSub(1, 0.64, 8.79, "we may not know which way to go on this dark road", "мы можем не знать куда идти по этой темной дороге"),
            MakeSub(2, 21.50, 27.88, "session ten breakthrough", "десятая сессия прорыв"),
            MakeSub(3, 27.88, 29.46, "one of these lives i am going to make things right", "в одной из этих жизней я все исправлю"),
            MakeSub(4, 29.46, 31.28, "with the wrongs i have done that is one of you now", "с ошибками что я совершил теперь это часть пути"),
            MakeSub(5, 31.28, 33.24, "with the father son until then i fight", "с верой а до тех пор я сражаюсь"),
            MakeSub(6, 33.24, 34.69, "rain on me put the blame on me", "пусть льет на меня возложите вину на меня"),
            MakeSub(7, 34.69, 36.52, "got guilt got hurt got shame on me", "на мне вина на мне боль на мне стыд"),
            MakeSub(8, 36.52, 38.26, "got six magazines that are aimed at me", "шесть журналов нацелены на меня"),
            MakeSub(9, 38.26, 40.06, "done every magazine what is fame to me", "был на каждой обложке что для меня слава"),
            MakeSub(10, 40.06, 42.21, "it is a game to me and i am tripping and falling", "для меня это игра и я спотыкаюсь и падаю"),
            MakeSub(11, 43.95, 45.45, "what is fed when the hearts and the words do not reach", "чем питаться когда сердца и слова не доходят"),
            MakeSub(12, 45.45, 47.33, "what is fair when the money does not take things back", "что справедливо когда деньги не возвращают прошлое"),
            MakeSub(13, 47.33, 49.18, "it is rare when somebody takes your dreams back", "редкость когда кто то возвращает твои мечты"),
            MakeSub(14, 49.18, 50.94, "i care too much want to share too much", "я переживаю слишком сильно хочу делиться слишком многим"),
            MakeSub(15, 50.94, 54.00, "in my head too much i shut down too", "слишком много в своей голове я тоже закрываюсь")
        ],
        [
            new("Phrasal Verb: Count Someone Out", "count me out", "count someone out означает «списать кого-то со счетов / не рассчитывать на него».", "phrasal-verbs"),
            new("Phrasal Verb: Shut Down", "in my head too much i shut down too", "shut down в психологическом контексте — «эмоционально закрыться, уйти в себя».", "phrasal-verbs"),
            new("Modal May Not + Indirect Question", "we may not know which way to go on this dark road", "Косвенный вопрос с инфинитивом: know + which way + to go.", "modals"),
            new("Present Perfect (Experience)", "with the wrongs i have done", "Present Perfect для накопленного жизненного опыта и последствий прошлых поступков.", "present-perfect")
        ],
        [
            new("kc-1", "we may not know which way to go on this dark road one of these lives i am going to make things right", "мы можем не знать куда идти по этой темной дороге однажды я все исправлю", "косвенный вопрос which way to go и конструкция be going to"),
            new("kc-2", "rain on me put the blame on me what is fair when the money does not take things back", "возложите вину на меня что справедливо когда деньги не возвращают прошлое", "риторический вопрос и фразовый глагол take back"),
            new("kc-3", "i care too much want to share too much in my head too much i shut down too", "я переживаю слишком сильно хочу делиться слишком многим я тоже закрываюсь", "наречие too much и фразовый глагол shut down")
        ]
    ),
    new(
        "kendrick-prayer",
        "Prayer",
        "Kendrick Lamar",
        "C1",
        "https://www.youtube.com/embed/BPbFD41Jyso",
        "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&auto=format&fit=crop&q=80",
        "Passive Voice in Past, Causative Make, Advanced Literary Vocabulary & Allegory",
        // Duration-matched LRC from lrclib.net (33382284) for Kendrick Lamar - Prayer (Jug6yCFhAMo)
        [
            MakeSub(1, 25.53, 31.10, "i was born on february twenty fourth nineteen seventy", "я родился двадцать четвертого февраля тысяча девятьсот семидесятого года"),
            MakeSub(2, 31.10, 34.26, "the day i was delivered they said i would build a legacy", "в день моего появления они сказали что я создам наследие"),
            MakeSub(3, 34.26, 36.98, "picture me with influence that lasts generations", "представь меня с влиянием которое длится поколениями"),
            MakeSub(4, 36.98, 40.22, "i was made out of love to keep you happy and educated", "я был создан из любви чтобы делать вас счастливыми и просвещенными"),
            MakeSub(5, 40.22, 43.18, "the first three letters of the alphabet my name", "первые три буквы алфавита мое имя"),
            MakeSub(6, 43.18, 46.42, "i made you laugh i made you dance i made you sing", "я заставил вас смеяться танцевать и петь"),
            MakeSub(7, 46.42, 49.78, "i have been around the world and back you recorded my almanac", "я объехал весь мир и вернулся вы записали мой альманах"),
            MakeSub(8, 49.78, 52.89, "so dearly way before the fact me and pops were estranged", "задолго до того как мы с отцом отдалились друг от друга"),
            MakeSub(9, 52.89, 56.06, "my father was a public figure bigger than life", "мой отец был публичной фигурой масштабнее самой жизни"),
            MakeSub(10, 56.06, 58.86, "lived as a winner on stages alike", "жил как победитель на всех сценах мира"),
            MakeSub(11, 58.86, 61.30, "rivers of people surely united just to see our bond", "реки людей объединялись лишь чтобы увидеть нашу связь"),
            MakeSub(12, 61.30, 63.82, "time carried on that was a common thread", "время шло дальше это была общая нить"),
            MakeSub(13, 63.82, 66.10, "my perfect father had many flaws", "у моего идеального отца было много изъянов"),
            MakeSub(14, 66.10, 68.62, "still they moved their legs and shook their heads in unison", "но они все равно двигались в унисон"),
            MakeSub(15, 80.18, 83.50, "the price of being iconic was heavy and cruel", "цена того чтобы быть культовым оказалась тяжелой и жестокой"),
            MakeSub(16, 83.50, 87.40, "i stood on stage and had to watch my father on the news", "я стоял на сцене и был вынужден смотреть на отца в новостях")
        ],
        [
            new("Past Simple Passive", "the day i was delivered ... i was made out of love", "Пассивный залог в прошлом (was + V3) используется для описания происхождения и судьбы лирического героя (песни ABC).", "passive"),
            new("Causative Structure: Make + Obj + V1", "i made you laugh i made you dance i made you sing", "После глагола make в значении «заставлять/побуждать» инфинитив идёт без частицы to.", "causative"),
            new("Future in the Past (would)", "they said i would build a legacy", "Согласование времён в косвенной речи: will превращается в would после глагола said.", "reported-speech"),
            new("C1 Vocabulary: Estranged / Common Thread", "me and pops were estranged ... that was a common thread", "estranged — «отчуждённый, отдалившийся»; common thread — «связующая нить, лейтмотив».", "vocabulary")
        ],
        [
            new("kp-1", "the day i was delivered they said i would build a legacy picture me with influence that lasts generations", "в день моего появления они сказали что я создам наследие представь меня с влиянием на поколения", "пассивный залог was delivered и future in the past would build"),
            new("kp-2", "i was made out of love to keep you happy and educated i made you laugh i made you dance i made you sing", "я был создан из любви чтобы делать вас счастливыми я заставил вас смеяться танцевать и петь", "каузативная конструкция make somebody do"),
            new("kp-3", "my perfect father had many flaws time carried on that was a common thread", "у моего идеального отца было много изъянов время шло это была общая нить", "фразовый глагол carry on и идиома common thread")
        ]
    ),
    new(
        "kendrick-samidot",
        "Sing About Me, I'm Dying of Thirst",
        "Kendrick Lamar",
        "C1",
        "https://www.youtube.com/embed/xtIr8k4eC7o",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
        "Time Clauses (When + Present Simple), Phrasal Verbs (settle down), Complex Storytelling C1",
        // Duration-matched LRC from lrclib.net (31462934) for Kendrick Lamar - Sing About Me (xtIr8k4eC7o, Part 1 420s)
        [
            MakeSub(1, 14.10, 15.70, "when the lights shut off", "когда погаснет свет"),
            MakeSub(2, 15.70, 17.86, "and it is my turn to settle down", "и придет мой черед обрести покой"),
            MakeSub(3, 17.86, 19.43, "my main concern", "моя главная забота"),
            MakeSub(4, 19.43, 22.31, "promise that you will sing about me", "пообещай что ты споешь обо мне"),
            MakeSub(5, 22.31, 25.55, "promise that you will sing about me", "пообещай что ты споешь обо мне"),
            MakeSub(6, 25.55, 27.25, "i said when the lights shut off", "я сказал когда погаснет свет"),
            MakeSub(7, 27.25, 29.40, "and it is my turn to settle down", "и придет мой черед уйти на покой"),
            MakeSub(8, 29.40, 31.01, "my main concern", "моя главная тревога"),
            MakeSub(9, 31.01, 33.92, "promise that you will sing about me", "пообещай что ты споешь обо мне"),
            MakeSub(10, 38.13, 40.10, "i woke up this morning and figured i would call you", "я проснулся этим утром и решил позвонить тебе"),
            MakeSub(11, 40.10, 41.52, "in case i am not here tomorrow", "на случай если меня не будет здесь завтра"),
            MakeSub(12, 41.52, 43.70, "i am hoping that i can borrow a piece of mind", "я надеюсь что смогу одолжить немного спокойствия"),
            MakeSub(13, 43.70, 45.80, "i am behind on what is really important", "я отстаю в том что действительно важно"),
            MakeSub(14, 45.80, 46.95, "my mind is really distorted", "мой разум сильно искажен"),
            MakeSub(15, 46.95, 49.64, "i find nothing but trouble in my life", "я нахожу в своей жизни лишь неприятности"),
            MakeSub(16, 49.64, 51.22, "i am fortunate you believe in a dream", "мне повезло что ты веришь в мечту"),
            MakeSub(17, 54.46, 56.52, "and last night was just another distraction", "и прошлая ночь была лишь очередным отвлечением"),
            MakeSub(18, 56.52, 59.50, "or a reaction of what we consider madness", "или реакцией на то что мы считаем безумием")
        ],
        [
            new("Future Time Clause (When + Present Simple)", "when the lights shut off ... promise that you will sing about me", "После when в значении будущего времени используется Present Simple (shut off), а will — в главной части.", "time-clauses"),
            new("In Case + Present Simple", "in case i am not here tomorrow", "Союз in case («на случай, если») также требует Present Simple вместо will для описания будущего.", "conjunctions"),
            new("Phrasal Verb: Settle Down", "it is my turn to settle down", "settle down — «успокоиться, остепениться», а в контексте песни также эвфемизм ухода из жизни.", "phrasal-verbs"),
            new("Idiom: Nothing But", "i find nothing but trouble in my life", "Конструкция nothing but + существительное означает «ничего, кроме / сплошные неприятности».", "idioms")
        ],
        [
            new("ks-1", "when the lights shut off and it is my turn to settle down my main concern promise that you will sing about me", "когда погаснет свет и придет мой черед обрести покой пообещай что споешь обо мне", "придаточное времени when и фразовый глагол settle down"),
            new("ks-2", "i woke up this morning and figured i would call you in case i am not here tomorrow", "я проснулся этим утром и решил позвонить тебе на случай если меня не будет завтра", "союз in case с настоящим временем для будущего"),
            new("ks-3", "i am hoping that i can borrow a piece of mind i find nothing but trouble in my life", "я надеюсь одолжить немного спокойствия я нахожу в жизни лишь неприятности", "конструкция nothing but и устойчивое выражение peace of mind")
        ]
    ),
    new(
        "j-cole-4-your-eyez-only",
        "4 Your Eyez Only",
        "J. Cole",
        "C1",
        "https://www.youtube.com/embed/rT3R6234yVU",
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80",
        "Prepositions of Concession (Despite), Modals of Possibility (Might), Idioms & Storytelling C1",
        // Duration-matched LRC from lrclib.net (972188) for J. Cole - 4 Your Eyez Only (rT3R6234yVU, 530s)
        [
            MakeSub(1, 7.39, 10.42, "for your eyes only", "только для твоих глаз"),
            MakeSub(2, 13.58, 19.48, "for your eyes only for your eyes only", "только для твоих глаз только для твоих глаз"),
            MakeSub(3, 22.46, 24.83, "for your eyes only", "только для твоих глаз"),
            MakeSub(4, 26.74, 30.87, "it seems my dreams faded for far too long the consequences deadly", "кажется мои мечты угасли слишком давно а последствия смертельны"),
            MakeSub(5, 30.87, 33.75, "cannot visualize myself as nothing but a criminal", "не могу представить себя никем кроме преступника"),
            MakeSub(6, 33.75, 36.99, "control the block and stay subliminal", "контролировать квартал и оставаться в тени"),
            MakeSub(7, 40.18, 43.43, "full of adrenaline ignorant to what death can cause", "полный адреналина не осознающий что может принести смерть"),
            MakeSub(8, 43.43, 45.86, "there is no coming back family dressed in black", "пути назад нет семья одета в черное"),
            MakeSub(9, 49.80, 52.77, "and my daughter has got to eat her mama is stressing me", "а моей дочери нужно есть ее мама давит на меня"),
            MakeSub(10, 55.88, 58.01, "like i am not out in the field like that", "будто я не пропадаю на улицах ради этого"),
            MakeSub(11, 58.01, 61.07, "i might be low for the moment but i will bounce back", "возможно сейчас я на дне но я обязательно поднимусь снова"),
            MakeSub(12, 61.07, 65.00, "despite the charges back to the wall i fight regardless", "несмотря на обвинения прижатый к стене я сражаюсь вопреки всему")
        ],
        [
            new("Concession: Despite + Noun", "despite the charges back to the wall i fight regardless", "Предлог despite («несмотря на») используется сразу с существительным без предлога of.", "conjunctions"),
            new("Phrasal Verb: Bounce Back", "i might be low for the moment but i will bounce back", "bounce back — яркий фразовый глагол: «быстро оправиться после неудачи, вернуться в строй».", "phrasal-verbs"),
            new("Idiom: Back to the Wall", "back to the wall i fight regardless", "with one's back to the wall — «прижатый к стене, в безвыходной ситуации».", "idioms"),
            new("C1 Vocabulary: Subliminal / Regardless", "stay subliminal ... i fight regardless", "subliminal — «незаметный, скрытый»; regardless — «несмотря ни на что, вопреки обстоятельствам».", "vocabulary")
        ],
        [
            new("jc-1", "for your eyes only it seems my dreams faded for far too long the consequences deadly", "только для твоих глаз кажется мои мечты угасли слишком давно а последствия смертельны", "выражение for your eyes only и глагол seem"),
            new("jc-2", "i might be low for the moment but i will bounce back despite the charges i fight regardless", "возможно сейчас я на дне но я поднимусь снова несмотря на обвинения я сражаюсь вопреки всему", "модальный might фразовый глагол bounce back и предлог despite"),
            new("jc-3", "full of adrenaline ignorant to what death can cause there is no coming back", "полный адреналина не осознающий последствий пути назад нет", "прилагательное ignorant to и герундий coming back")
        ]
    )
};

// ----------------- API ENDPOINTS -----------------

// 1. Get all topics or filter by CEFR level
app.MapGet("/api/topics", (string? level) =>
{
    var result = string.IsNullOrWhiteSpace(level) 
        ? topics 
        : topics.Where(t => t.Level.Equals(level, StringComparison.OrdinalIgnoreCase)).ToList();

    return Results.Ok(result.Select(t => new
    {
        t.Id,
        t.Title,
        t.Level,
        t.Description,
        SentenceCount = t.Sentences.Count
    }));
});

// 2. Get lesson sentences for a topic
app.MapGet("/api/lessons/{topicId}", (string topicId) =>
{
    var topic = topics.FirstOrDefault(t => t.Id == topicId);
    if (topic == null)
    {
        return Results.NotFound(new { error = $"Topic '{topicId}' not found." });
    }

    return Results.Ok(new
    {
        topic.Id,
        topic.Title,
        topic.Level,
        topic.Description,
        Sentences = topic.Sentences
    });
});

// 3. Adaptive lesson targeting user's weak keys
app.MapGet("/api/adaptive/weak-keys", (string? keys) =>
{
    var targetKeys = (keys ?? "r,t,p")
        .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
        .Select(k => k.ToLowerInvariant())
        .ToHashSet();

    // Find sentences with the highest density of target keys
    var allSentences = topics.SelectMany(t => t.Sentences).ToList();
    var scored = allSentences
        .Select(s => new
        {
            Sentence = s,
            MatchCount = s.English.Count(c => targetKeys.Contains(char.ToLowerInvariant(c).ToString()))
        })
        .OrderByDescending(x => x.MatchCount)
        .Take(4)
        .Select(x => x.Sentence)
        .ToList();

    return Results.Ok(new
    {
        Id = "adaptive-weak-keys",
        Title = $"Адаптивная тренировка слабых букв: [{string.Join(", ", targetKeys.Select(k => k.ToLowerInvariant()))}]",
        Level = "Adaptive",
        Description = "Фразы с максимальной концентрацией ваших проблемных клавиш для тренировки мышечной памяти.",
        Sentences = scored
    });
});

// 4. Save session results
app.MapPost("/api/stats", (SessionStatsRequest request) =>
{
    if (request.Wpm < 0 || request.Accuracy < 0 || request.Accuracy > 100)
    {
        return Results.BadRequest(new { error = "Некорректные метрики скорости или точности." });
    }

    var record = new SessionStats(
        Guid.NewGuid().ToString("N")[..8],
        request.TopicId,
        request.Wpm,
        request.Accuracy,
        request.Errors,
        request.DurationSeconds,
        request.WeakKeys ?? [],
        DateTime.UtcNow
    );

    userStatsHistory.Add(record);

    return Results.Created($"/api/stats/{record.Id}", new
    {
        success = true,
        recordId = record.Id,
        message = "Статистика успешно сохранена в профиле."
    });
});

// 5. Get aggregate statistics
app.MapGet("/api/stats", () =>
{
    if (userStatsHistory.Count == 0)
    {
        return Results.Ok(new
        {
            totalSessions = 0,
            avgWpm = 0.0,
            avgAccuracy = 0.0,
            totalErrors = 0,
            weakKeysFrequency = new Dictionary<string, int>()
        });
    }

    var totalSessions = userStatsHistory.Count;
    var avgWpm = Math.Round(userStatsHistory.Average(s => s.Wpm), 1);
    var avgAccuracy = Math.Round(userStatsHistory.Average(s => s.Accuracy), 1);
    var totalErrors = userStatsHistory.Sum(s => s.Errors);

    var weakKeyFreq = userStatsHistory
        .SelectMany(s => s.WeakKeys)
        .GroupBy(k => k.ToLowerInvariant())
        .ToDictionary(g => g.Key, g => g.Count());

    return Results.Ok(new
    {
        totalSessions,
        avgWpm,
        avgAccuracy,
        totalErrors,
        weakKeysFrequency = weakKeyFreq,
        recentSessions = userStatsHistory.OrderByDescending(s => s.Timestamp).Take(5).ToList()
    });
});

// 6. Vocabulary of hard words
app.MapGet("/api/vocabulary", () => Results.Ok(vocabularyList));

app.MapPost("/api/vocabulary", (AddWordRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Word) || string.IsNullOrWhiteSpace(request.Translation))
    {
        return Results.BadRequest(new { error = "Слово и перевод обязательны для заполнения." });
    }

    var existing = vocabularyList.FirstOrDefault(v => v.Word.Equals(request.Word.Trim(), StringComparison.OrdinalIgnoreCase));
    if (existing != null)
    {
        existing.MistakeCount++;
        return Results.Ok(existing);
    }

    var newWord = new VocabularyWord(
        Guid.NewGuid().ToString("N")[..8],
        request.Word.Trim().ToLowerInvariant(),
        request.Translation.Trim(),
        request.Phonetic ?? "/.../",
        request.PartOfSpeech ?? "word",
        1,
        request.AudioUrl
    );

    vocabularyList.Add(newWord);
    return Results.Created($"/api/vocabulary/{newWord.Id}", newWord);
});

app.MapDelete("/api/vocabulary/{id}", (string id) =>
{
    var word = vocabularyList.FirstOrDefault(w => w.Id == id);
    if (word == null) return Results.NotFound();
    vocabularyList.Remove(word);
    return Results.NoContent();
});

// 7. AI Grammar & Translation verification endpoint
app.MapPost("/api/check-translation", (CheckTranslationRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.UserText))
    {
        return Results.BadRequest(new { error = "Текст не может быть пустым." });
    }

    var expected = request.ExpectedText.Trim().ToLowerInvariant().TrimEnd('.', '!', '?');
    var actual = request.UserText.Trim().ToLowerInvariant().TrimEnd('.', '!', '?');

    bool isExact = expected == actual;
    int levenshtein = ComputeLevenshtein(expected, actual);
    double similarity = Math.Max(0, 1.0 - (double)levenshtein / Math.Max(expected.Length, actual.Length));

    string feedback;
    if (isExact)
    {
        feedback = "Идеально! Грамматическая конструкция использована абсолютно верно.";
    }
    else if (similarity > 0.85)
    {
        feedback = "Отлично! Небольшая опечатка в символах, но грамматика верна.";
    }
    else
    {
        feedback = $"Обратите внимание на конструкцию: эталонный вариант «{request.ExpectedText}». Попробуйте ещё раз.";
    }

    return Results.Ok(new
    {
        isCorrect = similarity >= 0.85,
        similarity = Math.Round(similarity * 100, 1),
        feedback,
        grammarTip = request.GrammarTip ?? "Следите за временами глаголов и порядком слов."
    });
});

// 10. Get leaderboard
app.MapGet("/api/leaderboard", (string? level) =>
{
    var query = string.IsNullOrWhiteSpace(level) || level.Equals("all", StringComparison.OrdinalIgnoreCase)
        ? leaderboard
        : leaderboard.Where(e => e.Level.Equals(level, StringComparison.OrdinalIgnoreCase)).ToList();

    var sorted = query.OrderByDescending(e => e.Wpm).ThenByDescending(e => e.Accuracy).ToList();
    return Results.Ok(sorted);
});

// 11. Submit entry to leaderboard
app.MapPost("/api/leaderboard", (LeaderboardRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.UserName) || request.UserName.Trim().Length < 2)
    {
        return Results.BadRequest(new { error = "Имя пользователя должно содержать не менее 2 символов." });
    }

    if (request.Wpm <= 0 || request.Accuracy < 0 || request.Accuracy > 100)
    {
        return Results.BadRequest(new { error = "Некорректные параметры скорости или точности." });
    }

    var entry = new LeaderboardEntry(
        Guid.NewGuid().ToString("N")[..8],
        request.UserName.Trim(),
        request.Wpm,
        request.Accuracy,
        string.IsNullOrWhiteSpace(request.TopicTitle) ? "тренировка" : request.TopicTitle,
        string.IsNullOrWhiteSpace(request.Level) ? "B1" : request.Level,
        DateTime.UtcNow
    );

    leaderboard.Add(entry);
    return Results.Created($"/api/leaderboard/{entry.Id}", entry);
});

// 12. Music & Video Lessons with Subtitles, Grammar Breakdown and Lyrics Typing
app.MapGet("/api/music-lessons", () => Results.Ok(musicLessons.Select(m => new
{
    m.Id,
    m.Title,
    m.Artist,
    m.Level,
    m.ThumbnailUrl,
    m.GrammarFocus,
    SentenceCount = m.TypingSentences.Count
})));

app.MapGet("/api/music-lessons/{id}", (string id) =>
{
    var lesson = musicLessons.FirstOrDefault(m => m.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
    return lesson != null ? Results.Ok(lesson) : Results.NotFound(new { error = $"Music lesson '{id}' not found." });
});

app.Run();

// Helper Levenshtein distance
static int ComputeLevenshtein(string a, string b)
{
    if (string.IsNullOrEmpty(a)) return b?.Length ?? 0;
    if (string.IsNullOrEmpty(b)) return a.Length;

    int[,] d = new int[a.Length + 1, b.Length + 1];
    for (int i = 0; i <= a.Length; i++) d[i, 0] = i;
    for (int j = 0; j <= b.Length; j++) d[0, j] = j;

    for (int i = 1; i <= a.Length; i++)
    {
        for (int j = 1; j <= b.Length; j++)
        {
            int cost = a[i - 1] == b[j - 1] ? 0 : 1;
            d[i, j] = Math.Min(
                Math.Min(d[i - 1, j] + 1, d[i, j - 1] + 1),
                d[i - 1, j - 1] + cost
            );
        }
    }
    return d[a.Length, b.Length];
}

// ----------------- DATA RECORDS -----------------

public record GrammarTopic(
    string Id, 
    string Title, 
    string Level, 
    string Description, 
    List<SentenceItem> Sentences
);

public record SentenceItem(
    string Id, 
    string English, 
    string Russian, 
    string GrammarTip
);

public record SessionStats(
    string Id, 
    string TopicId, 
    double Wpm, 
    double Accuracy, 
    int Errors, 
    int DurationSeconds, 
    List<string> WeakKeys, 
    DateTime Timestamp
);

public record SessionStatsRequest(
    string TopicId, 
    double Wpm, 
    double Accuracy, 
    int Errors, 
    int DurationSeconds, 
    List<string>? WeakKeys
);

public record VocabularyWord(
    string Id, 
    string Word, 
    string Translation, 
    string Phonetic, 
    string PartOfSpeech, 
    int MistakeCount, 
    string? AudioUrl
) {
    public int MistakeCount { get; set; } = MistakeCount;
}

public record AddWordRequest(
    string Word, 
    string Translation, 
    string? Phonetic, 
    string? PartOfSpeech, 
    string? AudioUrl
);

public record CheckTranslationRequest(
    string ExpectedText, 
    string UserText, 
    string? GrammarTip
);

public record LeaderboardEntry(
    string Id,
    string UserName,
    double Wpm,
    double Accuracy,
    string TopicTitle,
    string Level,
    DateTime Timestamp
);

public record LeaderboardRequest(
    string UserName,
    double Wpm,
    double Accuracy,
    string TopicTitle,
    string Level
);

public record SubtitleWord(
    string Word,
    double Start,
    double End
);

public record MusicSubtitleLine(
    int Id,
    double StartSeconds,
    double EndSeconds,
    string TextEn,
    string TextRu,
    List<SubtitleWord>? Words = null
);

public record GrammarBreakdownItem(
    string RuleTitle,
    string LyricQuote,
    string Explanation,
    string GrammarTag
);

public record MusicLesson(
    string Id,
    string Title,
    string Artist,
    string Level,
    string VideoUrl,
    string ThumbnailUrl,
    string GrammarFocus,
    List<MusicSubtitleLine> Subtitles,
    List<GrammarBreakdownItem> GrammarBreakdown,
    List<SentenceItem> TypingSentences
);
