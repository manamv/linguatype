export interface SongVocabItem {
  word: string
  ipa: string
  pos: string
  level: string
  translation: string
  contextQuote: string
}

export const SONG_VOCABULARY: Record<string, SongVocabItem[]> = {
  'queen-champions': [
    {
      word: 'pay my dues',
      ipa: '/peɪ maɪ djuːz/',
      pos: 'idiom',
      level: 'B2',
      translation: 'заплатить по счетам, пройти через все трудности и заслужить успех',
      contextQuote: 'i have paid my dues time after time'
    },
    {
      word: 'sentence',
      ipa: '/ˈsen.təns/',
      pos: 'noun',
      level: 'B1',
      translation: 'срок наказания, приговор (в переносном смысле — тяжёлый период)',
      contextQuote: 'i have done my sentence but committed no crime'
    },
    {
      word: 'commit a crime',
      ipa: '/kəˈmɪt ə kraɪm/',
      pos: 'collocation',
      level: 'B1',
      translation: 'совершить преступление',
      contextQuote: 'i have done my sentence but committed no crime'
    },
    {
      word: 'bed of roses',
      ipa: '/bed əv ˈrəʊ.zɪz/',
      pos: 'idiom',
      level: 'B2',
      translation: 'лёгкая, беззаботная жизнь («ложе из роз»)',
      contextQuote: 'it has been no bed of roses no pleasure cruise'
    },
    {
      word: 'come through',
      ipa: '/kʌm θruː/',
      pos: 'phrasal verb',
      level: 'B1',
      translation: 'выдержать испытание, справиться',
      contextQuote: 'i have had my share of sand kicked in my face but i have come through'
    },
    {
      word: 'take a bow',
      ipa: '/teɪk ə baʊ/',
      pos: 'idiom',
      level: 'B2',
      translation: 'выйти на поклон, принять аплодисменты',
      contextQuote: 'i have taken my bows and my curtain calls'
    }
  ],
  'coldplay-scientist': [
    {
      word: 'set apart',
      ipa: '/set əˈpɑːt/',
      pos: 'phrasal verb',
      level: 'B2',
      translation: 'выделять среди других, отличать',
      contextQuote: 'tell you i need you tell you i set you apart'
    },
    {
      word: 'shame',
      ipa: '/ʃeɪm/',
      pos: 'noun',
      level: 'B1',
      translation: 'жалость, досада («как жаль»)',
      contextQuote: 'it is such a shame for us to part'
    },
    {
      word: 'part',
      ipa: '/pɑːt/',
      pos: 'verb',
      level: 'B2',
      translation: 'расставаться, расходиться',
      contextQuote: 'it is such a shame for us to part'
    },
    {
      word: 'pull apart',
      ipa: '/pʊl əˈpɑːt/',
      pos: 'phrasal verb',
      level: 'B2',
      translation: 'разбирать на части, разрывать',
      contextQuote: 'pulling the puzzles apart'
    },
    {
      word: 'come up tails',
      ipa: '/kʌm ʌp teɪlz/',
      pos: 'idiom',
      level: 'B2',
      translation: 'выпасть решкой (проиграть, не повезти)',
      contextQuote: 'running in circles coming up tails'
    },
    {
      word: 'figure out',
      ipa: '/ˈfɪɡ.ər aʊt/',
      pos: 'phrasal verb',
      level: 'B1',
      translation: 'понять, разгадать, разобраться',
      contextQuote: 'nobody said it was easy'
    }
  ],
  'beatles-yesterday': [
    {
      word: 'troubles',
      ipa: '/ˈtrʌb.əlz/',
      pos: 'noun',
      level: 'A2',
      translation: 'невзгоды, неприятности, заботы',
      contextQuote: 'yesterday all my troubles seemed so far away'
    },
    {
      word: 'as though',
      ipa: '/æz ðəʊ/',
      pos: 'conjunction',
      level: 'B1',
      translation: 'словно, как будто',
      contextQuote: 'now it looks as though they are here to stay'
    },
    {
      word: 'suddenly',
      ipa: '/ˈsʌd.ən.li/',
      pos: 'adverb',
      level: 'A2',
      translation: 'внезапно, вдруг',
      contextQuote: 'oh yesterday came suddenly'
    },
    {
      word: 'shadow',
      ipa: '/ˈʃæd.əʊ/',
      pos: 'noun',
      level: 'A2',
      translation: 'тень (перен. — тревога, мрачное предчувствие)',
      contextQuote: 'there is a shadow hanging over me'
    },
    {
      word: 'long for',
      ipa: '/lɒŋ fɔːr/',
      pos: 'phrasal verb',
      level: 'B2',
      translation: 'сильно тосковать по, жаждать чего-либо',
      contextQuote: 'now i long for yesterday'
    }
  ],
  'steve-lacy-the-feeling': [
    {
      word: 'down to the wire',
      ipa: '/daʊn tuː ðə ˈwaɪər/',
      pos: 'idiom',
      level: 'B2',
      translation: 'на самом пределе, до последней секунды',
      contextQuote: 'i know we are down to the wire'
    },
    {
      word: 'bleed',
      ipa: '/bliːd/',
      pos: 'verb',
      level: 'B1',
      translation: 'истекать кровью (перен. — испытывать душевную боль)',
      contextQuote: 'i am not scared to bleed you know our history'
    },
    {
      word: 'quitter',
      ipa: '/ˈkwɪt.ər/',
      pos: 'noun',
      level: 'B2',
      translation: 'человек, который легко сдаётся',
      contextQuote: 'i could let it go but i am not a quitter'
    },
    {
      word: 'burden',
      ipa: '/ˈbɜː.dən/',
      pos: 'noun',
      level: 'B2',
      translation: 'обуза, бремя, тяжёлая ноша',
      contextQuote: 'kept it to myself because i did not want to be a burden'
    },
    {
      word: 'heal',
      ipa: '/hiːl/',
      pos: 'verb',
      level: 'B1',
      translation: 'заживать, исцеляться',
      contextQuote: 'this is not going to heal if we do not make a deal'
    },
    {
      word: 'would rather',
      ipa: '/wʊd ˈrɑː.ðər/',
      pos: 'modal',
      level: 'B1',
      translation: 'предпочёл бы',
      contextQuote: 'i would rather not so baby let us get on'
    }
  ],
  'wham-last-christmas': [
    {
      word: 'give away',
      ipa: '/ɡɪv əˈweɪ/',
      pos: 'phrasal verb',
      level: 'B1',
      translation: 'отдать даром, легко избавиться',
      contextQuote: 'but the very next day you gave it away'
    },
    {
      word: 'once bitten, twice shy',
      ipa: '/wʌns ˈbɪt.ən twaɪs ʃaɪ/',
      pos: 'proverb',
      level: 'B2',
      translation: 'обжёгшись на молоке, дуют на воду',
      contextQuote: 'once bitten and twice shy'
    },
    {
      word: 'catch my eye',
      ipa: '/kætʃ maɪ aɪ/',
      pos: 'idiom',
      level: 'B1',
      translation: 'привлечь мой взгляд, броситься в глаза',
      contextQuote: 'i keep my distance but you still catch my eye'
    },
    {
      word: 'recognize',
      ipa: '/ˈrek.əɡ.naɪz/',
      pos: 'verb',
      level: 'A2',
      translation: 'узнавать (кого-то)',
      contextQuote: 'tell me baby do you recognize me'
    },
    {
      word: 'wrap up',
      ipa: '/ræp ʌp/',
      pos: 'phrasal verb',
      level: 'B1',
      translation: 'упаковать, завернуть (подарок)',
      contextQuote: 'happy christmas i wrapped it up and sent it'
    },
    {
      word: 'fool',
      ipa: '/fuːl/',
      pos: 'verb / noun',
      level: 'B1',
      translation: 'обманывать, одурачивать; глупец',
      contextQuote: 'if you kissed me now i know you would fool me again'
    }
  ],
  'harry-styles-coming-up-roses': [
    {
      word: 'coming up roses',
      ipa: '/ˈkʌm.ɪŋ ʌp ˈrəʊ.zɪz/',
      pos: 'idiom',
      level: 'B2',
      translation: 'складываться блестяще, идти как нельзя лучше',
      contextQuote: 'and everything seems to be coming up roses'
    },
    {
      word: 'stay the course',
      ipa: '/steɪ ðə kɔːs/',
      pos: 'idiom',
      level: 'B2',
      translation: 'не сходить с пути, доводить дело до конца',
      contextQuote: 'if we stay the course we could get it right'
    },
    {
      word: 'devoid of',
      ipa: '/dɪˈvɔɪd əv/',
      pos: 'adjective',
      level: 'C1',
      translation: 'лишённый чего-либо',
      contextQuote: 'but i am not devoid of an appetite'
    },
    {
      word: 'aligned',
      ipa: '/əˈlaɪnd/',
      pos: 'adjective',
      level: 'B2',
      translation: 'согласованный, на одной волне',
      contextQuote: 'does that mean we are not aligned'
    },
    {
      word: 'talk your ear off',
      ipa: '/tɔːk jɔːr ɪər ɒf/',
      pos: 'idiom',
      level: 'B2',
      translation: 'прожужжать все уши, говорить без умолку',
      contextQuote: 'and i will talk your ear off about why it is safe'
    },
    {
      word: 'fumble',
      ipa: '/ˈfʌm.bəl/',
      pos: 'verb',
      level: 'B2',
      translation: 'путаться (в словах), неловко ронять',
      contextQuote: 'as i fumble my words and fall flat on my face'
    }
  ],
  'frank-ocean-ivy': [
    {
      word: 'quite alright',
      ipa: '/kwaɪt ɔːlˈraɪt/',
      pos: 'phrase',
      level: 'B1',
      translation: 'вполне нормально, совершенно ничего страшного',
      contextQuote: 'it is quite alright to hate me now'
    },
    {
      word: 'deep down',
      ipa: '/diːp daʊn/',
      pos: 'adverb',
      level: 'B1',
      translation: 'в глубине души',
      contextQuote: 'when we both know that deep down the feeling is good'
    },
    {
      word: 'see through',
      ipa: '/siː θruː/',
      pos: 'phrasal verb',
      level: 'B2',
      translation: 'видеть насквозь, раскусить',
      contextQuote: 'if i could see through walls i could see you are faking'
    },
    {
      word: 'faking',
      ipa: '/ˈfeɪ.kɪŋ/',
      pos: 'verb',
      level: 'B1',
      translation: 'притворяться, симулировать',
      contextQuote: 'i could see you are faking'
    },
    {
      word: 'armored truck',
      ipa: '/ˈɑː.məd trʌk/',
      pos: 'noun',
      level: 'B2',
      translation: 'броневик, бронированный грузовик',
      contextQuote: 'safe in my rental like an armored truck back then'
    },
    {
      word: 'no matter what',
      ipa: '/nəʊ ˈmæt.ər wɒt/',
      pos: 'conjunction',
      level: 'B1',
      translation: 'что бы ни случилось, несмотря ни на что',
      contextQuote: 'no matter what i did'
    }
  ],
  'sting-shape-of-my-heart': [
    {
      word: 'deal the cards',
      ipa: '/diːl ðə kɑːdz/',
      pos: 'collocation',
      level: 'B1',
      translation: 'раздавать карты',
      contextQuote: 'he deals the cards as a meditation'
    },
    {
      word: 'suspect',
      ipa: '/səˈspekt/',
      pos: 'verb',
      level: 'B1',
      translation: 'подозревать, догадываться',
      contextQuote: 'and those he plays never suspect'
    },
    {
      word: 'sacred',
      ipa: '/ˈseɪ.krɪd/',
      pos: 'adjective',
      level: 'B2',
      translation: 'священный, сакральный',
      contextQuote: 'the sacred geometry of chance'
    },
    {
      word: 'probable outcome',
      ipa: '/ˈprɒb.ə.bəl ˈaʊt.kʌm/',
      pos: 'collocation',
      level: 'B2',
      translation: 'вероятный исход, возможный результат',
      contextQuote: 'the hidden law of a probable outcome'
    },
    {
      word: 'spades / clubs',
      ipa: '/speɪdz / klʌbz/',
      pos: 'noun',
      level: 'B2',
      translation: 'пики / трефы (карточные масти)',
      contextQuote: 'i know that the spades are the swords of a soldier'
    },
    {
      word: 'conceal',
      ipa: '/kənˈsiːl/',
      pos: 'verb',
      level: 'B2',
      translation: 'скрывать, прятать',
      contextQuote: 'he may conceal a king in his hand'
    },
    {
      word: 'fade',
      ipa: '/feɪd/',
      pos: 'verb',
      level: 'B1',
      translation: 'угасать, блекнуть, стираться из памяти',
      contextQuote: 'while the memory of it fades'
    }
  ],
  'eagles-hotel-california': [
    {
      word: 'shimmering',
      ipa: '/ˈʃɪm.ər.ɪŋ/',
      pos: 'adjective',
      level: 'C1',
      translation: 'мерцающий, переливающийся',
      contextQuote: 'up ahead in the distance i saw a shimmering light'
    },
    {
      word: 'grow dim',
      ipa: '/ɡrəʊ dɪm/',
      pos: 'collocation',
      level: 'B2',
      translation: 'померкнуть, затуманиться (о зрении/свете)',
      contextQuote: 'my head grew heavy and my sight grew dim'
    },
    {
      word: 'doorway',
      ipa: '/ˈdɔː.weɪ/',
      pos: 'noun',
      level: 'B1',
      translation: 'дверной проём, порог',
      contextQuote: 'there she stood in the doorway i heard the mission bell'
    },
    {
      word: 'plenty of',
      ipa: '/ˈplen.ti əv/',
      pos: 'quantifier',
      level: 'B1',
      translation: 'предостаточно, множество',
      contextQuote: 'plenty of room at the hotel california'
    },
    {
      word: 'courtyard',
      ipa: '/ˈkɔːt.jɑːd/',
      pos: 'noun',
      level: 'B2',
      translation: 'внутренний двор',
      contextQuote: 'how they dance in the courtyard sweet summer sweat'
    },
    {
      word: 'spirit',
      ipa: '/ˈspɪr.ɪt/',
      pos: 'noun',
      level: 'B2',
      translation: 'дух (эпохи); крепкий алкогольный напиток (игра слов)',
      contextQuote: 'we have not had that spirit here since nineteen sixty nine'
    }
  ],
  'hozier-take-me-to-church': [
    {
      word: 'disapproval',
      ipa: '/ˌdɪs.əˈpruː.vəl/',
      pos: 'noun',
      level: 'B2',
      translation: 'неодобрение, осуждение',
      contextQuote: 'knows everybody disapproval'
    },
    {
      word: 'worship',
      ipa: '/ˈwɜː.ʃɪp/',
      pos: 'verb',
      level: 'B2',
      translation: 'поклоняться, боготворить',
      contextQuote: 'they should have worshipped her sooner'
    },
    {
      word: 'mouthpiece',
      ipa: '/ˈmaʊθ.piːs/',
      pos: 'noun',
      level: 'C1',
      translation: 'рупор, выразитель идей/истины',
      contextQuote: 'if the heavens ever did speak she is the last true mouthpiece'
    },
    {
      word: 'bleak',
      ipa: '/bliːk/',
      pos: 'adjective',
      level: 'C1',
      translation: 'мрачный, унылый, безрадостный',
      contextQuote: 'every sunday is getting more bleak'
    },
    {
      word: 'shrine',
      ipa: '/ʃraɪn/',
      pos: 'noun',
      level: 'C1',
      translation: 'святилище, алтарь',
      contextQuote: 'i will worship like a dog at the shrine of your lies'
    },
    {
      word: 'sharpen',
      ipa: '/ˈʃɑː.pən/',
      pos: 'verb',
      level: 'B2',
      translation: 'точить, заострять',
      contextQuote: 'i will tell you my sins and you can sharpen your knife'
    },
    {
      word: 'pagan',
      ipa: '/ˈpeɪ.ɡən/',
      pos: 'noun',
      level: 'C1',
      translation: 'язычник',
      contextQuote: 'if i am a pagan of the good times my lover is the sunlight'
    }
  ],
  'kendrick-count-me-out': [
    {
      word: 'count someone out',
      ipa: '/kaʊnt aʊt/',
      pos: 'phrasal verb',
      level: 'B2',
      translation: 'списать со счетов, не рассчитывать на кого-то',
      contextQuote: 'count me out'
    },
    {
      word: 'breakthrough',
      ipa: '/ˈbreɪk.θruː/',
      pos: 'noun',
      level: 'B2',
      translation: 'прорыв, переломный момент',
      contextQuote: 'session ten breakthrough'
    },
    {
      word: 'put the blame on',
      ipa: '/pʊt ðə bleɪm ɒn/',
      pos: 'collocation',
      level: 'B1',
      translation: 'возложить вину на кого-то',
      contextQuote: 'rain on me put the blame on me'
    },
    {
      word: 'guilt / shame',
      ipa: '/ɡɪlt / ʃeɪm/',
      pos: 'noun',
      level: 'B1',
      translation: 'чувство вины / стыд',
      contextQuote: 'got guilt got hurt got shame on me'
    },
    {
      word: 'aimed at',
      ipa: '/eɪmd æt/',
      pos: 'verb',
      level: 'B2',
      translation: 'нацеленный на, направленный против',
      contextQuote: 'got six magazines that are aimed at me'
    },
    {
      word: 'shut down',
      ipa: '/ʃʌt daʊn/',
      pos: 'phrasal verb',
      level: 'B2',
      translation: 'эмоционально закрыться, отключиться',
      contextQuote: 'in my head too much i shut down too'
    }
  ],
  'kendrick-prayer': [
    {
      word: 'legacy',
      ipa: '/ˈleɡ.ə.si/',
      pos: 'noun',
      level: 'C1',
      translation: 'наследие (культурное или историческое)',
      contextQuote: 'the day i was delivered they said i would build a legacy'
    },
    {
      word: 'estranged',
      ipa: '/ɪˈstreɪndʒd/',
      pos: 'adjective',
      level: 'C1',
      translation: 'отчуждённый, отдалившийся от близких',
      contextQuote: 'so dearly way before the fact me and pops were estranged'
    },
    {
      word: 'bigger than life',
      ipa: '/ˈbɪɡ.ər ðæn laɪf/',
      pos: 'idiom',
      level: 'C1',
      translation: 'легендарный, масштабнее самой жизни',
      contextQuote: 'my father was a public figure bigger than life'
    },
    {
      word: 'common thread',
      ipa: '/ˈkɒm.ən θred/',
      pos: 'idiom',
      level: 'C1',
      translation: 'связующая нить, общий лейтмотив',
      contextQuote: 'time carried on that was a common thread'
    },
    {
      word: 'flaws',
      ipa: '/flɔːz/',
      pos: 'noun',
      level: 'B2',
      translation: 'изъяны, недостатки, пороки',
      contextQuote: 'my perfect father had many flaws'
    },
    {
      word: 'in unison',
      ipa: '/ɪn ˈjuː.nɪ.sən/',
      pos: 'phrase',
      level: 'C1',
      translation: 'в унисон, слаженно, одновременно',
      contextQuote: 'still they moved their legs and shook their heads in unison'
    }
  ],
  'kendrick-samidot': [
    {
      word: 'settle down',
      ipa: '/ˈset.əl daʊn/',
      pos: 'phrasal verb',
      level: 'B2',
      translation: 'остепениться, успокоиться (в песне — обрести вечный покой)',
      contextQuote: 'when the lights shut off and it is my turn to settle down'
    },
    {
      word: 'main concern',
      ipa: '/meɪn kənˈsɜːn/',
      pos: 'collocation',
      level: 'B2',
      translation: 'главная забота, основное беспокойство',
      contextQuote: 'my main concern promise that you will sing about me'
    },
    {
      word: 'piece / peace of mind',
      ipa: '/piːs əv maɪnd/',
      pos: 'idiom',
      level: 'B2',
      translation: 'душевное спокойствие (игра слов piece / peace)',
      contextQuote: 'i am hoping that i can borrow a piece of mind'
    },
    {
      word: 'distorted',
      ipa: '/dɪˈstɔː.tɪd/',
      pos: 'adjective',
      level: 'C1',
      translation: 'искажённый, деформированный',
      contextQuote: 'my mind is really distorted'
    },
    {
      word: 'fortunate',
      ipa: '/ˈfɔː.tʃən.ət/',
      pos: 'adjective',
      level: 'B2',
      translation: 'удачливый, счастливый («мне повезло»)',
      contextQuote: 'i am fortunate you believe in a dream'
    },
    {
      word: 'distraction',
      ipa: '/dɪˈstræk.ʃən/',
      pos: 'noun',
      level: 'B2',
      translation: 'отвлечение, то, что сбивает с пути',
      contextQuote: 'and last night was just another distraction'
    }
  ],
  'j-cole-4-your-eyez-only': [
    {
      word: 'consequences',
      ipa: '/ˈkɒn.sɪ.kwən.sɪz/',
      pos: 'noun',
      level: 'B2',
      translation: 'последствия',
      contextQuote: 'it seems my dreams faded for far too long the consequences deadly'
    },
    {
      word: 'subliminal',
      ipa: '/ˌsʌbˈlɪm.ɪ.nəl/',
      pos: 'adjective',
      level: 'C1',
      translation: 'скрытый, незаметный, подсознательный',
      contextQuote: 'control the block and stay subliminal'
    },
    {
      word: 'ignorant to',
      ipa: '/ˈɪɡ.nər.ənt tuː/',
      pos: 'adjective',
      level: 'C1',
      translation: 'не осознающий, несведущий в чём-либо',
      contextQuote: 'full of adrenaline ignorant to what death can cause'
    },
    {
      word: 'bounce back',
      ipa: '/baʊns bæk/',
      pos: 'phrasal verb',
      level: 'B2',
      translation: 'оправиться после неудачи, снова встать на ноги',
      contextQuote: 'i might be low for the moment but i will bounce back'
    },
    {
      word: 'despite',
      ipa: '/dɪˈspaɪt/',
      pos: 'preposition',
      level: 'B2',
      translation: 'несмотря на, вопреки',
      contextQuote: 'despite the charges back to the wall i fight regardless'
    },
    {
      word: 'regardless',
      ipa: '/rɪˈɡɑːd.ləs/',
      pos: 'adverb',
      level: 'C1',
      translation: 'несмотря ни на что, вопреки обстоятельствам',
      contextQuote: 'back to the wall i fight regardless'
    }
  ]
}
