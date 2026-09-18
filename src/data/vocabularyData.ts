import { Chapter, Question } from '../types';

export const CHAPTERS: Chapter[] = [
  {
    id: 'lesson3-core',
    title: '동아(윤정미) 3과 : 핵심 어휘 & 본문 15제',
    subtitle: 'Lesson 3 Core Vocabulary',
    badge: '동아 중1 • 3과 Part 1',
    description: '태도, 대회, 연습, 실수 등 3과 본문 및 대화문 필수 15문제',
    questions: [
      {
        id: 301,
        sentence: 'His ______ towards life changed.',
        koreanSentence: '그의 삶에 대한 태도가 바뀌었다.',
        correctWord: 'attitude',
        correctMeaning: '태도',
        options: [
          { id: '301-1', word: 'attitude', meaning: '태도, 마음가짐' },
          { id: '301-2', word: 'height', meaning: '키, 높이' },
          { id: '301-3', word: 'bakery', meaning: '빵집' }
        ],
        explanation: '삶을 대하는 마음가짐이나 자세를 나타내는 단어는 attitude(태도)입니다.'
      },
      {
        id: 302,
        sentence: '______ ! Everything will be okay.',
        koreanSentence: '기운 내! 모든 것이 괜찮아질 거야.',
        correctWord: 'Cheer up',
        correctMeaning: '기운 내다',
        options: [
          { id: '302-1', word: 'Cheer up', meaning: '기운 내다' },
          { id: '302-2', word: 'Turn off', meaning: '끄다' },
          { id: '302-3', word: 'Fall off', meaning: '떨어지다' }
        ],
        explanation: '낙담한 친구를 격려할 때 쓰는 표현은 "Cheer up!(기운 내!)"입니다.'
      },
      {
        id: 303,
        sentence: 'You ______ make a spending plan.',
        koreanSentence: '너는 소비 계획을 세워야 해.',
        correctWord: 'should',
        correctMeaning: '~해야 한다',
        options: [
          { id: '303-1', word: 'wig', meaning: '가발' },
          { id: '303-2', word: 'should', meaning: '~해야 한다 (조동사)' },
          { id: '303-3', word: 'flash', meaning: '플래시' }
        ],
        explanation: '상대방에게 조언이나 충고를 할 때 사용하는 조동사는 should(~해야 한다)입니다.'
      },
      {
        id: 304,
        sentence: 'She won a ______ in the drawing contest.',
        koreanSentence: '그녀는 그리기 대회에서 상을 받았다.',
        correctWord: 'prize',
        correctMeaning: '상',
        options: [
          { id: '304-1', word: 'scene', meaning: '현장' },
          { id: '304-2', word: 'crime', meaning: '범죄' },
          { id: '304-3', word: 'prize', meaning: '상, 상품' }
        ],
        explanation: '대회에서 이기거나 좋은 성적을 거두어 받는 것은 prize(상)입니다.'
      },
      {
        id: 305,
        sentence: 'He ______ his bad habits.',
        koreanSentence: '그는 나쁜 습관들을 그만두었다.',
        correctWord: 'quit',
        correctMeaning: '그만두다',
        options: [
          { id: '305-1', word: 'quit', meaning: '그만두다, 끊다' },
          { id: '305-2', word: 'hold', meaning: '개최하다' },
          { id: '305-3', word: 'sell', meaning: '팔다' }
        ],
        explanation: '나쁜 습관이나 하던 행동을 멈추고 포기할 때는 quit(그만두다)을 씁니다.'
      },
      {
        id: 306,
        sentence: 'She ______ piano for two hours every day.',
        koreanSentence: '그녀는 매일 두 시간 동안 피아노를 연습한다.',
        correctWord: 'practices',
        correctMeaning: '연습하다',
        options: [
          { id: '306-1', word: 'practices', meaning: '연습하다' },
          { id: '306-2', word: 'wastes', meaning: '낭비하다' },
          { id: '306-3', word: 'touches', meaning: '만지다' }
        ],
        explanation: '피아노 연주 실력을 기르기 위해 규칙적으로 훈련하는 것은 practices(연습하다)입니다.'
      },
      {
        id: 307,
        sentence: 'Our team ______ the first game.',
        koreanSentence: '우리 팀이 첫 번째 게임을 이겼다.',
        correctWord: 'won',
        correctMeaning: '이겼다 (win의 과거형)',
        options: [
          { id: '307-1', word: 'texted', meaning: '문자를 보냈다' },
          { id: '307-2', word: 'won', meaning: '이겼다 (win-won)' },
          { id: '307-3', word: 'fell', meaning: '떨어졌다' }
        ],
        explanation: '경기(game)에서 승리를 거두었다는 뜻으로 win의 과거형 won이 들어갑니다.'
      },
      {
        id: 308,
        sentence: 'They ______ the race.',
        koreanSentence: '그들은 경주에 참가했다.',
        correctWord: 'entered',
        correctMeaning: '참가했다 (enter의 과거형)',
        options: [
          { id: '308-1', word: 'damaged', meaning: '손상시켰다' },
          { id: '308-2', word: 'stopped', meaning: '멈췄다' },
          { id: '308-3', word: 'entered', meaning: '참가했다, 출전했다' }
        ],
        explanation: '경주나 대회에 공식적으로 출전하거나 참여할 때 enter(entered)를 씁니다.'
      },
      {
        id: 309,
        sentence: 'She is ______ of her parents.',
        koreanSentence: '그녀는 자신의 부모님이 자랑스럽다.',
        correctWord: 'proud',
        correctMeaning: '자랑스러운',
        options: [
          { id: '309-1', word: 'proud', meaning: '자랑스러운' },
          { id: '309-2', word: 'terrible', meaning: '형편없는' },
          { id: '309-3', word: 'sick', meaning: '아픈' }
        ],
        explanation: '~을 자랑스러워하다는 숙어 "be proud of"에서 형용사 proud가 들어갑니다.'
      },
      {
        id: 310,
        sentence: 'She is always ______ and smiles brightly.',
        koreanSentence: '그녀는 항상 긍정적이고 밝게 웃는다.',
        correctWord: 'positive',
        correctMeaning: '긍정적인',
        options: [
          { id: '310-1', word: 'unhappy', meaning: '불만스러운' },
          { id: '310-2', word: 'positive', meaning: '긍정적인' },
          { id: '310-3', word: 'hopeless', meaning: '가망 없는' }
        ],
        explanation: '밝고 좋은 면을 생각하는 성격을 나타낼 때 positive(긍정적인)를 사용합니다.'
      },
      {
        id: 311,
        sentence: 'She ______ passed the difficult exam.',
        koreanSentence: '그녀는 마침내 그 어려운 시험에 합격했다.',
        correctWord: 'finally',
        correctMeaning: '마침내, 드디어',
        options: [
          { id: '311-1', word: 'clearly', meaning: '명확하게' },
          { id: '311-2', word: 'finally', meaning: '마침내, 결국' },
          { id: '311-3', word: 'terribly', meaning: '몹시' }
        ],
        explanation: '오랜 노력 끝에 끝내 목적을 달성했을 때 부사 finally(마침내)를 씁니다.'
      },
      {
        id: 312,
        sentence: 'She has great ______ in the relay team.',
        koreanSentence: '그녀는 이어달리기 팀에 훌륭한 팀원들이 있다.',
        correctWord: 'teammates',
        correctMeaning: '팀원들',
        options: [
          { id: '312-1', word: 'teammates', meaning: '팀원들, 동료들' },
          { id: '312-2', word: 'mistakes', meaning: '실수들' },
          { id: '312-3', word: 'prizes', meaning: '상들' }
        ],
        explanation: '같은 팀에서 함께 활동하는 사람들을 teammates(팀원들)라고 부릅니다.'
      },
      {
        id: 313,
        sentence: 'I am ______ in science and math.',
        koreanSentence: '나는 과학과 수학에 관심이 있다.',
        correctWord: 'interested',
        correctMeaning: '관심이 있는',
        options: [
          { id: '313-1', word: 'different', meaning: '다른' },
          { id: '313-2', word: 'worried', meaning: '걱정하는' },
          { id: '313-3', word: 'interested', meaning: '관심이 있는, 흥미 있는' }
        ],
        explanation: '~에 관심이 있다(흥미가 있다)는 표현은 "be interested in"입니다.'
      },
      {
        id: 314,
        sentence: 'Will you enter the singing ______ ?',
        koreanSentence: '너는 노래 대회에 참가할 거야?',
        correctWord: 'contest',
        correctMeaning: '대회, 경연',
        options: [
          { id: '314-1', word: 'contest', meaning: '대회, 콘테스트' },
          { id: '314-2', word: 'janitor', meaning: '관리인' },
          { id: '314-3', word: 'language', meaning: '언어' }
        ],
        explanation: '노래나 실력을 겨루는 경연 행사는 contest(대회)입니다.'
      },
      {
        id: 315,
        sentence: 'We can learn from our ______ .',
        koreanSentence: '우리는 우리의 실수로부터 배울 수 있다.',
        correctWord: 'mistakes',
        correctMeaning: '실수들',
        options: [
          { id: '315-1', word: 'mistakes', meaning: '실수들' },
          { id: '315-2', word: 'habits', meaning: '습관들' },
          { id: '315-3', word: 'situations', meaning: '상황들' }
        ],
        explanation: '잘못한 일이나 오류를 통해 배움을 얻는다는 격언에서 mistakes(실수들)가 맞습니다.'
      }
    ]
  },
  {
    id: 'lesson3-deep',
    title: '동아(윤정미) 3과 : 필수 표현 & 다의어 15제',
    subtitle: 'Lesson 3 Phrases & Expressions',
    badge: '동아 중1 • 3과 Part 2',
    description: 'fair, waste, hold, upset 등 3과 추가 어휘와 다의어 15문제',
    questions: [
      {
        id: 316,
        sentence: 'The local ______ had many fun activities.',
        koreanSentence: '지역 박람회에는 재미있는 많은 활동들이 있었다.',
        correctWord: 'fair',
        correctMeaning: '박람회, 축제',
        options: [
          { id: '316-1', word: 'fair', meaning: '박람회' },
          { id: '316-2', word: 'attitude', meaning: '태도' },
          { id: '316-3', word: 'wheelchair', meaning: '휠체어' }
        ],
        explanation: '여러 부스와 볼거리가 마련된 큰 행사나 박람회는 fair입니다.'
      },
      {
        id: 317,
        sentence: 'Answer the ______ question carefully.',
        koreanSentence: '다음에 나오는 질문에 주의 깊게 대답하시오.',
        correctWord: 'following',
        correctMeaning: '다음에 나오는, 다음의',
        options: [
          { id: '317-1', word: 'following', meaning: '다음에 나오는' },
          { id: '317-2', word: 'terrible', meaning: '형편없는' },
          { id: '317-3', word: 'proud', meaning: '자랑스러운' }
        ],
        explanation: '뒤이어 제시되는 질문을 지칭할 때는 following(다음에 나오는)을 씁니다.'
      },
      {
        id: 318,
        sentence: 'I saw John today, ______ the way.',
        koreanSentence: '그런데, 오늘 John을 봤어요.',
        correctWord: 'by',
        correctMeaning: '그런데 (by the way)',
        options: [
          { id: '318-1', word: 'by', meaning: '그런데 (by the way)' },
          { id: '318-2', word: 'with', meaning: '~와 함께' },
          { id: '318-3', word: 'for', meaning: '~를 위해' }
        ],
        explanation: '화제를 전환할 때 쓰는 "그런데"는 숙어 "by the way"입니다.'
      },
      {
        id: 319,
        sentence: 'Please don’t ______ fresh water.',
        koreanSentence: '맑은 물을 낭비하지 마세요.',
        correctWord: 'waste',
        correctMeaning: '낭비하다',
        options: [
          { id: '319-1', word: 'practice', meaning: '연습하다' },
          { id: '319-2', word: 'waste', meaning: '낭비하다' },
          { id: '319-3', word: 'cheer', meaning: '응원하다' }
        ],
        explanation: '자원이나 물을 헛되이 소비하지 말라고 할 때 waste(낭비하다)를 씁니다.'
      },
      {
        id: 320,
        sentence: 'We are ______ about the new computer game.',
        koreanSentence: '우리는 새 컴퓨터 게임에 신이 나 있다.',
        correctWord: 'excited',
        correctMeaning: '신이 난, 들뜬',
        options: [
          { id: '320-1', word: 'excited', meaning: '신이 난' },
          { id: '320-2', word: 'hopeless', meaning: '절망적인' },
          { id: '320-3', word: 'sick', meaning: '아픈' }
        ],
        explanation: '새 게임에 대해 기쁘고 설레는 감정 상태는 excited(신이 난)입니다.'
      },
      {
        id: 321,
        sentence: 'I really need your ______ and encouragement.',
        koreanSentence: '저는 여러분의 응원과 격려가 정말 필요해요.',
        correctWord: 'support',
        correctMeaning: '응원, 지지',
        options: [
          { id: '321-1', word: 'support', meaning: '응원, 지지' },
          { id: '321-2', word: 'mistake', meaning: '실수' },
          { id: '321-3', word: 'fault', meaning: '잘못' }
        ],
        explanation: '격려와 도움, 지지를 부탁할 때 support(응원, 지지)를 씁니다.'
      },
      {
        id: 322,
        sentence: 'Our school ______ a music concert every year.',
        koreanSentence: '우리 학교는 매년 음악회를 연다(개최한다).',
        correctWord: 'holds',
        correctMeaning: '열다, 개최하다',
        options: [
          { id: '322-1', word: 'holds', meaning: '개최하다, 열다' },
          { id: '322-2', word: 'throws', meaning: '던지다' },
          { id: '322-3', word: 'falls', meaning: '떨어지다' }
        ],
        explanation: '행사나 콘서트를 주최하여 개최하는 동작을 hold(holds)라고 합니다.'
      },
      {
        id: 323,
        sentence: 'She has a ______ opinion on this topic.',
        koreanSentence: '그녀는 이 주제에 대해 다른 의견을 가지고 있다.',
        correctWord: 'different',
        correctMeaning: '다른',
        options: [
          { id: '323-1', word: 'different', meaning: '다른' },
          { id: '323-2', word: 'green', meaning: '친환경적인' },
          { id: '323-3', word: 'fast', meaning: '빠른' }
        ],
        explanation: '남들과 같지 않고 구별되는 생각을 different(다른)라고 합니다.'
      },
      {
        id: 324,
        sentence: 'A strange thing ______ this morning.',
        koreanSentence: '오늘 아침에 이상한 일이 일어났다.',
        correctWord: 'happened',
        correctMeaning: '일어났다, 발생했다',
        options: [
          { id: '324-1', word: 'happened', meaning: '일어났다' },
          { id: '324-2', word: 'practiced', meaning: '연습했다' },
          { id: '324-3', word: 'damaged', meaning: '손상시켰다' }
        ],
        explanation: '어떤 일이나 사건이 발생한 것을 나타내는 동사는 happened(일어났다)입니다.'
      },
      {
        id: 325,
        sentence: 'She worked hard and finally ______ it.',
        koreanSentence: '그녀는 열심히 일했고 마침내 해냈다(성공했다).',
        correctWord: 'made',
        correctMeaning: '해냈다 (make it의 과거)',
        options: [
          { id: '325-1', word: 'made', meaning: '해냈다 (made it)' },
          { id: '325-2', word: 'won', meaning: '이겼다' },
          { id: '325-3', word: 'quit', meaning: '그만두었다' }
        ],
        explanation: '성공하다, 목적을 이루다라는 숙어 표현은 "make it (과거: made it)"입니다.'
      },
      {
        id: 326,
        sentence: 'He studied ______ for the final exam.',
        koreanSentence: '그는 기말 시험을 위해 열심히 공부했다.',
        correctWord: 'hard',
        correctMeaning: '열심히 (부사)',
        options: [
          { id: '326-1', word: 'hard', meaning: '열심히, 애써서' },
          { id: '326-2', word: 'over', meaning: '끝난' },
          { id: '326-3', word: 'upset', meaning: '속상한' }
        ],
        explanation: '노력을 다해 열정적으로 공부한 모습을 수식하는 부사는 hard(열심히)입니다.'
      },
      {
        id: 327,
        sentence: 'The service at the restaurant was ______ .',
        koreanSentence: '그 식당의 서비스는 형편없었다(끔찍했다).',
        correctWord: 'terrible',
        correctMeaning: '형편없는, 끔찍한',
        options: [
          { id: '327-1', word: 'positive', meaning: '긍정적인' },
          { id: '327-2', word: 'terrible', meaning: '형편없는, 끔찍한' },
          { id: '327-3', word: 'proud', meaning: '자랑스러운' }
        ],
        explanation: '매우 안 좋거나 불쾌한 품질을 나타내는 형용사는 terrible(형편없는)입니다.'
      },
      {
        id: 328,
        sentence: 'I am ______ about my poor test results.',
        koreanSentence: '나는 좋지 않은 시험 결과 때문에 속상하다.',
        correctWord: 'upset',
        correctMeaning: '속상한, 마음이 상한',
        options: [
          { id: '328-1', word: 'upset', meaning: '속상한' },
          { id: '328-2', word: 'excited', meaning: '신이 난' },
          { id: '328-3', word: 'green', meaning: '친환경적인' }
        ],
        explanation: '원치 않는 결과로 마음이 아프고 불만스러울 때 upset(속상한)을 씁니다.'
      },
      {
        id: 329,
        sentence: 'Parents often ______ about their children.',
        koreanSentence: '부모님은 자녀들에 대해 자주 걱정하신다.',
        correctWord: 'worry',
        correctMeaning: '걱정하다',
        options: [
          { id: '329-1', word: 'worry', meaning: '걱정하다' },
          { id: '329-2', word: 'waste', meaning: '낭비하다' },
          { id: '329-3', word: 'enter', meaning: '참가하다' }
        ],
        explanation: '불안해하거나 마음을 쓰는 행위의 동사는 worry(걱정하다)입니다.'
      },
      {
        id: 330,
        sentence: 'They want to live a ______ lifestyle for nature.',
        koreanSentence: '그들은 자연을 위해 환경 친화적인 삶을 살고 싶어 한다.',
        correctWord: 'green',
        correctMeaning: '환경 친화적인',
        options: [
          { id: '330-1', word: 'green', meaning: '환경 친화적인' },
          { id: '330-2', word: 'sick', meaning: '아픈' },
          { id: '330-3', word: 'terrible', meaning: '형편없는' }
        ],
        explanation: '지구와 환경을 지키는 생활 방식을 green lifestyle(친환경적인 삶)이라고 합니다.'
      }
    ]
  },
  {
    id: 'lesson5-detective',
    title: '동아(윤정미) 5과 : 사건 해결 & 인물 명사 15제',
    subtitle: 'Lesson 5 Crime & Investigation',
    badge: '동아 중1 • 5과 Part 1',
    description: '용의자, 목격자, 범죄 현장, 경비원 등 5과 본문 핵심 15문제',
    questions: [
      {
        id: 501,
        sentence: 'The police came to the crime ______ .',
        koreanSentence: '경찰이 범죄 현장에 왔다.',
        correctWord: 'scene',
        correctMeaning: '현장, 장면',
        options: [
          { id: '501-1', word: 'scene', meaning: '현장, 일어난 자리' },
          { id: '501-2', word: 'attitude', meaning: '태도' },
          { id: '501-3', word: 'prize', meaning: '상' }
        ],
        explanation: '사건이 일어난 실제 장소를 crime scene(범죄 현장)이라고 합니다.'
      },
      {
        id: 502,
        sentence: 'Many people saw the suspicious ______ .',
        koreanSentence: '많은 사람들이 그 의심스러운 용의자를 보았다.',
        correctWord: 'suspect',
        correctMeaning: '용의자',
        options: [
          { id: '502-1', word: 'contest', meaning: '대회' },
          { id: '502-2', word: 'suspect', meaning: '용의자' },
          { id: '502-3', word: 'wheelchair', meaning: '휠체어' }
        ],
        explanation: '범죄를 저질렀을 것으로 의심을 받는 사람을 suspect(용의자)라고 합니다.'
      },
      {
        id: 503,
        sentence: 'The police finally caught the ______ .',
        koreanSentence: '경찰이 마침내 범인을 잡았다.',
        correctWord: 'criminal',
        correctMeaning: '범인, 범죄자',
        options: [
          { id: '503-1', word: 'criminal', meaning: '범인, 범죄자' },
          { id: '503-2', word: 'teammate', meaning: '팀원' },
          { id: '503-3', word: 'janitor', meaning: '관리인' }
        ],
        explanation: '법을 어기고 죄를 지은 사람을 criminal(범인, 범죄자)이라고 합니다.'
      },
      {
        id: 504,
        sentence: 'She is an ______ to this bank robbery.',
        koreanSentence: '그녀는 이번 은행 강도 사건의 목격자이다.',
        correctWord: 'eyewitness',
        correctMeaning: '목격자',
        options: [
          { id: '504-1', word: 'eyewitness', meaning: '목격자' },
          { id: '504-2', word: 'owner', meaning: '주인' },
          { id: '504-3', word: 'visitor', meaning: '방문객' }
        ],
        explanation: '현장을 직접 눈으로 본 사람을 eyewitness(목격자)라고 부릅니다.'
      },
      {
        id: 505,
        sentence: 'The ______ is standing by the museum door.',
        koreanSentence: '경비원이 박물관 문 옆에 서 있다.',
        correctWord: 'guard',
        correctMeaning: '경비원, 경호원',
        options: [
          { id: '505-1', word: 'guard', meaning: '경비원' },
          { id: '505-2', word: 'mistake', meaning: '실수' },
          { id: '505-3', word: 'wig', meaning: '가발' }
        ],
        explanation: '장소나 사람을 안전하게 지키고 보호하는 사람을 guard(경비원)라고 합니다.'
      },
      {
        id: 506,
        sentence: 'The old lady uses a ______ every day.',
        koreanSentence: '그 할머니는 매일 휠체어를 사용하신다.',
        correctWord: 'wheelchair',
        correctMeaning: '휠체어',
        options: [
          { id: '506-1', word: 'bakery', meaning: '빵집' },
          { id: '506-2', word: 'wheelchair', meaning: '휠체어' },
          { id: '506-3', word: 'flashlight', meaning: '손전등' }
        ],
        explanation: '걷기 힘든 분들이 앉아서 이동할 수 있도록 바퀴가 달린 의자는 wheelchair(휠체어)입니다.'
      },
      {
        id: 507,
        sentence: 'The ______ is cleaning the school hallway.',
        koreanSentence: '관리인이 학교 복도를 청소하고 있다.',
        correctWord: 'janitor',
        correctMeaning: '청소부, 관리인',
        options: [
          { id: '507-1', word: 'janitor', meaning: '관리인, 청소부' },
          { id: '507-2', word: 'criminal', meaning: '범인' },
          { id: '507-3', word: 'suspect', meaning: '용의자' }
        ],
        explanation: '학교나 건물의 시설을 청소하고 돌보아 주시는 분은 janitor(관리인)입니다.'
      },
      {
        id: 508,
        sentence: 'We bought delicious bread at the ______ .',
        koreanSentence: '우리는 빵집에서 맛있는 빵을 샀다.',
        correctWord: 'bakery',
        correctMeaning: '빵집, 제과점',
        options: [
          { id: '508-1', word: 'scene', meaning: '현장' },
          { id: '508-2', word: 'bakery', meaning: '빵집, 베이커리' },
          { id: '508-3', word: 'contest', meaning: '대회' }
        ],
        explanation: '빵과 케이크를 굽고 판매하는 가게는 bakery(빵집)입니다.'
      },
      {
        id: 509,
        sentence: 'He is the ______ of this coffee shop.',
        koreanSentence: '그는 이 커피숍의 주인이다.',
        correctWord: 'owner',
        correctMeaning: '주인, 소유자',
        options: [
          { id: '509-1', word: 'owner', meaning: '주인, 소유자' },
          { id: '509-2', word: 'visitor', meaning: '방문객' },
          { id: '509-3', word: 'teammate', meaning: '팀원' }
        ],
        explanation: '가게나 물건을 합법적으로 소유하고 있는 사람을 owner(주인)라고 합니다.'
      },
      {
        id: 510,
        sentence: 'My brother was wearing a funny blonde ______ .',
        koreanSentence: '내 남동생은 재미있는 금발 가발을 쓰고 있었다.',
        correctWord: 'wig',
        correctMeaning: '가발',
        options: [
          { id: '510-1', word: 'sign', meaning: '표지판' },
          { id: '510-2', word: 'wig', meaning: '가발' },
          { id: '510-3', word: 'crime', meaning: '범죄' }
        ],
        explanation: '머리에 쓰는 인공 머리카락 장식은 wig(가발)입니다.'
      },
      {
        id: 511,
        sentence: 'She can speak three foreign ______ .',
        koreanSentence: '그녀는 3개의 외국어를 말할 수 있다.',
        correctWord: 'languages',
        correctMeaning: '언어들',
        options: [
          { id: '511-1', word: 'languages', meaning: '언어들' },
          { id: '511-2', word: 'prizes', meaning: '상들' },
          { id: '511-3', word: 'mistakes', meaning: '실수들' }
        ],
        explanation: '스페인어, 영어 등 나라마다 의사소통에 사용하는 말과 글은 language(languages)입니다.'
      },
      {
        id: 512,
        sentence: 'This guidebook has a lot of useful ______ .',
        koreanSentence: '이 안내서는 많은 유용한 정보를 담고 있다.',
        correctWord: 'information',
        correctMeaning: '정보',
        options: [
          { id: '512-1', word: 'information', meaning: '정보' },
          { id: '512-2', word: 'attitude', meaning: '태도' },
          { id: '512-3', word: 'wheelchair', meaning: '휠체어' }
        ],
        explanation: '지식이나 사실을 알려주는 유익한 내용을 information(정보)이라고 합니다.'
      },
      {
        id: 513,
        sentence: 'My ______ is 160 cm now.',
        koreanSentence: '내 키는 지금 160cm이다.',
        correctWord: 'height',
        correctMeaning: '키, 높이',
        options: [
          { id: '513-1', word: 'height', meaning: '키, 신장' },
          { id: '513-2', word: 'weight', meaning: '무게' },
          { id: '513-3', word: 'speed', meaning: '속도' }
        ],
        explanation: '사람의 신장이나 물건의 높이를 나타내는 단위는 height(키)입니다.'
      },
      {
        id: 514,
        sentence: 'There is a warning ______ near the entrance.',
        koreanSentence: '입구 근처에 경고 표지판이 있다.',
        correctWord: 'sign',
        correctMeaning: '표지판, 신호',
        options: [
          { id: '514-1', word: 'sign', meaning: '표지판, 안내판' },
          { id: '514-2', word: 'flash', meaning: '플래시' },
          { id: '514-3', word: 'piece', meaning: '조각' }
        ],
        explanation: '정보나 주의사항을 알리는 알림판은 sign(표지판)입니다.'
      },
      {
        id: 515,
        sentence: 'All museum ______ must register at the desk.',
        koreanSentence: '모든 박물관 방문객들은 안내소에서 등록해야 한다.',
        correctWord: 'visitors',
        correctMeaning: '방문객들',
        options: [
          { id: '515-1', word: 'visitors', meaning: '방문객들' },
          { id: '515-2', word: 'criminals', meaning: '범죄자들' },
          { id: '515-3', word: 'guards', meaning: '경비원들' }
        ],
        explanation: '특정 장소를 찾아와 둘러보는 손님들을 visitors(방문객들)라고 부릅니다.'
      }
    ]
  },
  {
    id: 'lesson5-actions',
    title: '동아(윤정미) 5과 : 필수 동사 & 표현 15제',
    subtitle: 'Lesson 5 Action Verbs & Idioms',
    badge: '동아 중1 • 5과 Part 2',
    description: 'throw, caught, turn off, damage, run after 등 5과 핵심 표현 15문제',
    questions: [
      {
        id: 516,
        sentence: 'Mike can ______ the baseball very fast.',
        koreanSentence: 'Mike는 야구공을 매우 빠르게 던질 수 있다.',
        correctWord: 'throw',
        correctMeaning: '던지다',
        options: [
          { id: '516-1', word: 'throw', meaning: '던지다' },
          { id: '516-2', word: 'touch', meaning: '만지다' },
          { id: '516-3', word: 'damage', meaning: '훼손하다' }
        ],
        explanation: '손으로 공을 공중으로 날려 보내는 동작은 throw(던지다)입니다.'
      },
      {
        id: 517,
        sentence: 'Please ______ this book to the library.',
        koreanSentence: '이 책을 도서관으로 가지고 가주세요.',
        correctWord: 'take',
        correctMeaning: '가지고 가다',
        options: [
          { id: '517-1', word: 'take', meaning: '가지고 가다' },
          { id: '517-2', word: 'quit', meaning: '그만두다' },
          { id: '517-3', word: 'fall', meaning: '떨어지다' }
        ],
        explanation: '어떤 장소로 물건을 운반해 가져가는 동사는 take(가지고 가다)입니다.'
      },
      {
        id: 518,
        sentence: 'He talked to me ______ the phone yesterday.',
        koreanSentence: '그는 어제 나에게 전화로 이야기했다.',
        correctWord: 'on',
        correctMeaning: '전화로 (on the phone)',
        options: [
          { id: '518-1', word: 'on', meaning: '전화로 (on the phone)' },
          { id: '518-2', word: 'in', meaning: '~안에' },
          { id: '518-3', word: 'at', meaning: '~에서' }
        ],
        explanation: '전화를 통해 통화할 때 쓰는 전치사구는 "on the phone"입니다.'
      },
      {
        id: 519,
        sentence: 'The thief ______ away into the dark alley.',
        koreanSentence: '도둑이 어두운 골목으로 도망갔다.',
        correctWord: 'ran',
        correctMeaning: '도망갔다 (run away의 과거)',
        options: [
          { id: '519-1', word: 'ran', meaning: '도망갔다 (ran away)' },
          { id: '519-2', word: 'spoke', meaning: '말했다' },
          { id: '519-3', word: 'turned', meaning: '돌았다' }
        ],
        explanation: '자리를 피해 달아나다는 표현은 "run away (과거: ran away)"입니다.'
      },
      {
        id: 520,
        sentence: 'You ______ follow the rules in the classroom.',
        koreanSentence: '너는 교실에서 규칙을 따라야 한다.',
        correctWord: 'must',
        correctMeaning: '~해야 한다 (강한 의무)',
        options: [
          { id: '520-1', word: 'must', meaning: '~해야 한다 (의무)' },
          { id: '520-2', word: 'may', meaning: '~해도 되다' },
          { id: '520-3', word: 'can', meaning: '~할 수 있다' }
        ],
        explanation: '반드시 지켜야 할 규칙이나 의무를 전달할 때는 must(~해야 한다)를 씁니다.'
      },
      {
        id: 521,
        sentence: 'They sell ______ orange juice in the store.',
        koreanSentence: '그들은 가게에서 병에 든 오렌지 주스를 판다.',
        correctWord: 'bottled',
        correctMeaning: '병에 담긴, 병에 든',
        options: [
          { id: '521-1', word: 'golden', meaning: '황금빛의' },
          { id: '521-2', word: 'bottled', meaning: '병에 담긴' },
          { id: '521-3', word: 'short', meaning: '짧은' }
        ],
        explanation: '병(bottle)에 담아 판매하는 음료 형태는 bottled(병에 든)입니다.'
      },
      {
        id: 522,
        sentence: 'He ______ off his bicycle and hurt his knee.',
        koreanSentence: '그는 자전거에서 떨어져 무릎을 다쳤다.',
        correctWord: 'fell',
        correctMeaning: '떨어졌다 (fall off의 과거)',
        options: [
          { id: '522-1', word: 'fell', meaning: '떨어졌다 (fall off)' },
          { id: '522-2', word: 'ran', meaning: '달렸다' },
          { id: '522-3', word: 'took', meaning: '가져갔다' }
        ],
        explanation: '물체나 자전거 위에서 아래로 떨어지다는 표현은 "fall off (과거: fell off)"입니다.'
      },
      {
        id: 523,
        sentence: 'Camera ______ can hurt precious artworks.',
        koreanSentence: '카메라 플래시는 귀중한 미술품들을 손상시킬 수 있다.',
        correctWord: 'flash',
        correctMeaning: '플래시, 번쩍이는 빛',
        options: [
          { id: '523-1', word: 'flash', meaning: '카메라 플래시' },
          { id: '523-2', word: 'wig', meaning: '가발' },
          { id: '523-3', word: 'sign', meaning: '표지판' }
        ],
        explanation: '사진 촬영 시 번쩍이며 터지는 강한 빛은 flash(플래시)입니다.'
      },
      {
        id: 524,
        sentence: '______ I ask a question, teacher?',
        koreanSentence: '선생님, 질문 하나 해도 되나요?',
        correctWord: 'May',
        correctMeaning: '~해도 되나요? (허가)',
        options: [
          { id: '524-1', word: 'May', meaning: '~해도 되나요? (공손한 허가)' },
          { id: '524-2', word: 'Must', meaning: '~해야만 한다' },
          { id: '524-3', word: 'Quit', meaning: '그만두다' }
        ],
        explanation: '상대방에게 공손하게 허가를 구할 때 "May I ~?"를 씁니다.'
      },
      {
        id: 525,
        sentence: 'He ______ around quickly when he heard footsteps.',
        koreanSentence: '그는 발자국 소리를 들었을 때 빠르게 뒤돌아보았다.',
        correctWord: 'turned',
        correctMeaning: '돌았다 (turn around)',
        options: [
          { id: '525-1', word: 'turned', meaning: '돌았다 (turned around)' },
          { id: '525-2', word: 'threw', meaning: '던졌다' },
          { id: '525-3', word: 'caught', meaning: '잡았다' }
        ],
        explanation: '몸을 뒤쪽으로 회전시켜 보는 동작은 "turn around (과거: turned around)"입니다.'
      },
      {
        id: 526,
        sentence: 'Please ______ off the computer after class.',
        koreanSentence: '수업 후에 컴퓨터 전원을 꺼주세요.',
        correctWord: 'turn',
        correctMeaning: '끄다 (turn off)',
        options: [
          { id: '526-1', word: 'turn', meaning: '끄다 (turn off)' },
          { id: '526-2', word: 'take', meaning: '가져가다' },
          { id: '526-3', word: 'hold', meaning: '열다' }
        ],
        explanation: '전자제품이나 불을 끄는 표현은 "turn off"입니다.'
      },
      {
        id: 527,
        sentence: 'She ate two ______ of strawberry cake.',
        koreanSentence: '그녀는 딸기 케이크 두 조각을 먹었다.',
        correctWord: 'pieces',
        correctMeaning: '조각들',
        options: [
          { id: '527-1', word: 'pieces', meaning: '조각들' },
          { id: '527-2', word: 'scenes', meaning: '현장들' },
          { id: '527-3', word: 'signs', meaning: '표지판들' }
        ],
        explanation: '케이크나 피자의 썰어낸 단위는 pieces(조각들)입니다.'
      },
      {
        id: 528,
        sentence: 'He wrote his answers ______ on the test sheet.',
        koreanSentence: '그는 시험지에 답을 명확하게 썼다.',
        correctWord: 'clearly',
        correctMeaning: '명확하게, 분명히',
        options: [
          { id: '528-1', word: 'clearly', meaning: '명확하게, 똑똑히' },
          { id: '528-2', word: 'hopelessly', meaning: '가망 없이' },
          { id: '528-3', word: 'fastly', meaning: '빠르게' }
        ],
        explanation: '알아보기 쉽고 분명하게 나타내는 부사는 clearly(명확하게)입니다.'
      },
      {
        id: 529,
        sentence: 'Don’t ______ after the barking dog!',
        koreanSentence: '짖는 개를 뒤쫓아가지 마!',
        correctWord: 'run',
        correctMeaning: '뒤쫓다 (run after)',
        options: [
          { id: '529-1', word: 'run', meaning: '뒤쫓다 (run after)' },
          { id: '529-2', word: 'throw', meaning: '던지다' },
          { id: '529-3', word: 'fall', meaning: '떨어지다' }
        ],
        explanation: '뒤에서 쫓아가며 따라붙는 것은 "run after"입니다.'
      },
      {
        id: 530,
        sentence: 'Loud noise can ______ your ears.',
        koreanSentence: '시끄러운 소음은 당신의 귀를 손상시킬 수 있다.',
        correctWord: 'damage',
        correctMeaning: '손상시키다, 훼손하다',
        options: [
          { id: '530-1', word: 'damage', meaning: '손상시키다' },
          { id: '530-2', word: 'understand', meaning: '이해하다' },
          { id: '530-3', word: 'remember', meaning: '기억하다' }
        ],
        explanation: '신체 기관이나 물건에 해를 입혀 훼손시키는 동사는 damage입니다.'
      }
    ]
  }
];

export function getRandomCurriculumQuestions(count: number = 15): Question[] {
  const all = CHAPTERS.flatMap(c => c.questions);
  const shuffled = [...all].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
