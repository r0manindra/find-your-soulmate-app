import type { QuizQuestion } from '@/src/core/entities/types';

interface QuizTemplate {
  chapterId: number;
  locale: 'en' | 'de';
  questions: QuizQuestion[];
}

const quizTemplates: QuizTemplate[] = [
  // ──────────────────────────────────────────────
  // Chapter 21 – The Foundation
  // ──────────────────────────────────────────────
  {
    chapterId: 21,
    locale: 'en',
    questions: [
      {
        question:
          'Before you start dating, a friend asks you what you\'re really looking for. You realize you haven\'t thought about it. What should you do first?',
        options: [
          'Jump on a dating app and figure it out as you go',
          'Take time to reflect on your core values and what matters most to you in a partner',
          'Ask your friends what they think you need',
          'Copy the preferences of someone you admire',
        ],
        correctIndex: 1,
        explanation:
          'Understanding your own values and priorities before dating helps you make intentional choices rather than drifting into relationships that don\'t fit.',
      },
      {
        question:
          'You keep attracting the same type of partner and the relationships always end the same way. What does this pattern most likely indicate?',
        options: [
          'You\'re just unlucky in love',
          'All people of that type are the same',
          'There may be an unexamined pattern in what you\'re drawn to or how you behave in relationships',
          'You should stop dating entirely',
        ],
        correctIndex: 2,
        explanation:
          'Repeating relationship patterns usually point to unconscious preferences or behaviors. Self-awareness lets you recognize and break those cycles.',
      },
      {
        question:
          'Why is knowing your own identity important before entering the dating world?',
        options: [
          'So you can create a perfect dating profile',
          'Because people with strong identities are more attractive on social media',
          'So you don\'t lose yourself trying to become what someone else wants',
          'It isn\'t important — you\'ll discover yourself through relationships',
        ],
        correctIndex: 2,
        explanation:
          'A solid sense of self prevents you from shape-shifting to please others, which leads to resentment and inauthenticity over time.',
      },
      {
        question:
          'You\'re journaling about what you want in life and realize your goals have been heavily influenced by your parents\' expectations. What\'s the healthiest next step?',
        options: [
          'Reject everything your parents value out of principle',
          'Examine which of those values genuinely resonate with you and which don\'t',
          'Keep following their expectations to avoid conflict',
          'Stop journaling because it\'s making you overthink',
        ],
        correctIndex: 1,
        explanation:
          'Building a foundation means distinguishing between inherited values and authentic ones. Some overlap is natural — the key is conscious choice.',
      },
      {
        question:
          'Which of the following best describes a strong personal foundation for dating?',
        options: [
          'Having a high income and attractive appearance',
          'Knowing your values, being emotionally stable, and having a life you enjoy independent of a relationship',
          'Having dated at least ten people so you know what you want',
          'Being willing to compromise on everything to keep a partner happy',
        ],
        correctIndex: 1,
        explanation:
          'A strong foundation combines self-knowledge, emotional health, and a fulfilling life. These make you a better partner and help you choose better partners.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 22 – Your Voice
  // ──────────────────────────────────────────────
  {
    chapterId: 22,
    locale: 'en',
    questions: [
      {
        question:
          'You\'re telling a story at a dinner party and notice people are leaning in. Which vocal quality is most likely keeping them engaged?',
        options: [
          'Speaking as fast as possible to keep the energy up',
          'Varying your pace and tone to create suspense and emphasis',
          'Keeping a steady monotone so you sound calm and collected',
          'Speaking as loudly as you can so everyone can hear',
        ],
        correctIndex: 1,
        explanation:
          'Vocal variety — changes in pace, pitch, and volume — is the number one factor in keeping listeners engaged. Monotone delivery kills interest fast.',
      },
      {
        question:
          'During a first date at a noisy restaurant, your date keeps asking you to repeat yourself. What should you adjust?',
        options: [
          'Speak from your diaphragm and project your voice without shouting',
          'Lean in and whisper to create intimacy',
          'Talk louder by straining your throat',
          'Switch to texting each other across the table',
        ],
        correctIndex: 0,
        explanation:
          'Diaphragmatic projection lets you be heard clearly without yelling. It sounds confident and relaxed, whereas throat-straining sounds tense.',
      },
      {
        question:
          'You notice you tend to speak very quickly when you\'re nervous around someone you find attractive. What\'s the best strategy?',
        options: [
          'Deliberately slow down and add pauses — they signal confidence',
          'Keep talking fast so there are no awkward silences',
          'Memorize a script so you don\'t have to think on the spot',
          'Avoid speaking and just let the other person talk',
        ],
        correctIndex: 0,
        explanation:
          'Slowing down and pausing projects calm confidence. Rushed speech signals anxiety, while deliberate pacing shows you\'re comfortable.',
      },
      {
        question:
          'What effect does "upspeak" (ending statements with a rising tone like a question) typically have on how others perceive you?',
        options: [
          'It makes you sound friendly and approachable',
          'It can make you sound uncertain or like you\'re seeking approval',
          'It has no impact on perception',
          'It makes you sound authoritative and decisive',
        ],
        correctIndex: 1,
        explanation:
          'Upspeak can undermine your authority and make statements sound like questions. Ending sentences with a downward inflection conveys certainty.',
      },
      {
        question:
          'You\'re practicing improving your vocal presence. Which daily habit would be most effective?',
        options: [
          'Recording yourself reading aloud and listening back for areas to improve',
          'Only speaking when absolutely necessary to conserve your voice',
          'Imitating a celebrity\'s voice exactly',
          'Drinking hot tea before every conversation',
        ],
        correctIndex: 0,
        explanation:
          'Recording and reviewing your own speech is one of the most effective ways to improve. You\'ll quickly notice habits you never realized you had.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 23 – Discipline & Habits
  // ──────────────────────────────────────────────
  {
    chapterId: 23,
    locale: 'en',
    questions: [
      {
        question:
          'You want to build a habit of going to social events weekly but keep skipping. According to habit science, what\'s the best fix?',
        options: [
          'Rely on willpower and push through',
          'Attach it to an existing routine and start with a smaller version — like going for just 30 minutes',
          'Wait until you feel motivated enough',
          'Commit to going to five events per week right away',
        ],
        correctIndex: 1,
        explanation:
          'Habit stacking (linking new habits to existing ones) and starting small dramatically increase follow-through. Willpower alone is unreliable.',
      },
      {
        question:
          'You\'ve been consistently working out for three weeks, but today you really don\'t feel like it. What\'s the best approach for maintaining your streak?',
        options: [
          'Skip it — one day won\'t matter',
          'Do a minimal version (even 10 minutes) to maintain the habit loop',
          'Do an extra-long workout tomorrow to compensate',
          'Switch to a completely different habit instead',
        ],
        correctIndex: 1,
        explanation:
          'Never-zero days keep the habit loop intact. A shortened version maintains consistency, which matters more than any single session\'s intensity.',
      },
      {
        question:
          'Why is discipline considered more important than motivation when it comes to self-improvement for dating?',
        options: [
          'Because motivation is always available when you need it',
          'Because discipline ensures you show up even when motivation fades, creating lasting change',
          'Because disciplined people are more attractive than motivated people',
          'Because motivation leads to burnout',
        ],
        correctIndex: 1,
        explanation:
          'Motivation fluctuates, but discipline creates systems that keep you progressing regardless of how you feel on any given day.',
      },
      {
        question:
          'You\'re trying to build better social skills. Which approach to habit formation is most effective?',
        options: [
          'Set a vague goal like "be more social"',
          'Create a specific, scheduled practice like "start one conversation with a stranger every Tuesday and Thursday at the coffee shop"',
          'Read about social skills for an hour every day without practicing',
          'Wait for social situations to come to you naturally',
        ],
        correctIndex: 1,
        explanation:
          'Specific, time-bound habits with clear triggers are far more likely to stick than vague intentions. Implementation intentions ("when X, I will Y") are powerful.',
      },
      {
        question:
          'After two months of solid progress, you fall off your routine for a full week. What should you do?',
        options: [
          'Give up — you clearly don\'t have what it takes',
          'Start over from scratch with an entirely new system',
          'Resume your routine immediately without self-judgment — lapses are normal, quitting is the only real failure',
          'Wait until New Year\'s to try again',
        ],
        correctIndex: 2,
        explanation:
          'Lapses are a normal part of habit building. What separates people who succeed from those who don\'t is how quickly they get back on track.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 24 – Presence & Manners
  // ──────────────────────────────────────────────
  {
    chapterId: 24,
    locale: 'en',
    questions: [
      {
        question:
          'You\'re on a date and your phone buzzes with a notification. What does being truly "present" look like?',
        options: [
          'Quickly glance at it to make sure it\'s not urgent, then put it back',
          'Keep your phone on silent and face-down (or in your pocket) for the entire date, giving your full attention',
          'Check it openly — they\'ll understand you\'re a busy person',
          'Excuse yourself to the bathroom to check it privately',
        ],
        correctIndex: 1,
        explanation:
          'True presence means eliminating distractions. Keeping your phone away signals that the person in front of you is your priority.',
      },
      {
        question:
          'You\'re meeting your date\'s friends for the first time. Which behavior best demonstrates good manners and social awareness?',
        options: [
          'Dominate the conversation to show you\'re interesting',
          'Stay quiet and let your date do all the talking',
          'Greet everyone warmly, remember names, ask genuine questions, and include quieter people in the conversation',
          'Focus entirely on impressing your date and ignore their friends',
        ],
        correctIndex: 2,
        explanation:
          'Good manners mean making everyone feel seen and valued. How you treat your date\'s friends reveals a lot about your character.',
      },
      {
        question:
          'Why does good posture matter in social and dating contexts?',
        options: [
          'It only matters for physical health, not social situations',
          'It communicates confidence, openness, and self-respect before you even speak',
          'It makes you look taller, which is the only thing that matters',
          'It doesn\'t matter — people only care about what you say',
        ],
        correctIndex: 1,
        explanation:
          'Posture is one of the first things people subconsciously read. Open, upright posture signals confidence and approachability.',
      },
      {
        question:
          'You arrive at a restaurant for a first date. Which of these grooming and etiquette details makes the strongest positive impression?',
        options: [
          'Wearing your most expensive outfit regardless of the venue',
          'Being clean, well-groomed, appropriately dressed for the venue, and arriving on time',
          'Wearing strong cologne or perfume so they remember you',
          'Showing up fashionably late to seem mysterious',
        ],
        correctIndex: 1,
        explanation:
          'Appropriate grooming and punctuality show respect for the other person and the occasion. Over-dressing or lateness signals poor calibration.',
      },
      {
        question:
          'During a conversation, you catch yourself mentally rehearsing what you\'re going to say next instead of listening. What should you do?',
        options: [
          'Keep rehearsing — being articulate matters more than listening',
          'Gently redirect your attention back to what they\'re saying and trust that your response will come naturally',
          'Interrupt them with your thought before you forget it',
          'Zone out completely since you already missed part of what they said',
        ],
        correctIndex: 1,
        explanation:
          'Presence means staying with the other person\'s words, not your internal monologue. Trust that genuine listening leads to more authentic responses.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 25 – Social Practice
  // ──────────────────────────────────────────────
  {
    chapterId: 25,
    locale: 'en',
    questions: [
      {
        question:
          'You want to get better at small talk but the idea of approaching strangers feels overwhelming. What\'s the best way to start?',
        options: [
          'Force yourself to talk to 20 strangers in one day',
          'Start with low-stakes interactions — thanking a barista, complimenting a cashier, chatting with an Uber driver',
          'Practice conversation scripts in front of a mirror until they\'re perfect',
          'Wait until your anxiety goes away naturally',
        ],
        correctIndex: 1,
        explanation:
          'Gradual exposure through low-stakes interactions builds your social muscle without overwhelming your nervous system. Comfort zones expand incrementally.',
      },
      {
        question:
          'You\'re at a networking event and don\'t know anyone. What\'s an effective strategy to start conversations?',
        options: [
          'Stand by the wall and wait for someone to approach you',
          'Look for someone else who\'s standing alone and introduce yourself with a simple observation or question about the event',
          'Interrupt a group mid-conversation to introduce yourself',
          'Leave after five minutes because it\'s too uncomfortable',
        ],
        correctIndex: 1,
        explanation:
          'Other solo attendees are usually the most receptive to being approached. A situational opener ("How did you hear about this event?") works naturally.',
      },
      {
        question:
          'What is the main purpose of expanding your comfort zone gradually?',
        options: [
          'To prove to others that you\'re brave',
          'To build tolerance for discomfort so that situations that once felt scary become normal',
          'To collect impressive stories to tell on dates',
          'To eliminate all social anxiety permanently',
        ],
        correctIndex: 1,
        explanation:
          'Comfort zone expansion works by normalizing discomfort. What feels terrifying today becomes routine with repeated exposure. The goal isn\'t zero anxiety — it\'s functioning despite it.',
      },
      {
        question:
          'You successfully chatted with a stranger at a coffee shop, but the conversation was a bit awkward. How should you view this experience?',
        options: [
          'As a failure because it wasn\'t smooth',
          'As a success — you did the hard part (initiating) and each attempt builds your skills',
          'As a sign that you\'re not cut out for socializing',
          'As a reason to avoid that coffee shop forever',
        ],
        correctIndex: 1,
        explanation:
          'In social practice, the attempt IS the success. Awkwardness is the natural byproduct of growth, not evidence of failure.',
      },
      {
        question:
          'Which of these is the most effective way to make small talk feel less forced?',
        options: [
          'Memorize a list of interesting facts to share',
          'Be genuinely curious about the other person — ask about what they\'re doing, reading, or experiencing in the moment',
          'Steer every conversation toward topics you\'re an expert in',
          'Keep conversations as short as possible so there\'s no chance of it getting awkward',
        ],
        correctIndex: 1,
        explanation:
          'Genuine curiosity transforms small talk from a performance into a real interaction. People can tell when you actually care versus when you\'re going through the motions.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 1 – The Mirror
  // ──────────────────────────────────────────────
  {
    chapterId: 1,
    locale: 'en',
    questions: [
      {
        question:
          'You ask a trusted friend for honest feedback about your dating life, and they mention you tend to talk about yourself too much. What\'s the growth mindset response?',
        options: [
          'Get defensive — they don\'t know what they\'re talking about',
          'Thank them for the honesty and start paying attention to the balance of conversation in your next interactions',
          'Dismiss it because they\'re single too',
          'Stop talking about yourself entirely on dates',
        ],
        correctIndex: 1,
        explanation:
          'Honest self-assessment requires hearing hard truths without defensiveness. Feedback is data — the growth mindset uses it rather than fighting it.',
      },
      {
        question:
          'Why is self-reflection considered the critical first step before learning any dating skill?',
        options: [
          'Because it makes you more attractive immediately',
          'Because you can\'t fix what you\'re not aware of — knowing your starting point determines the right path forward',
          'Because introspective people are more popular',
          'It\'s not actually important — skills matter more than self-awareness',
        ],
        correctIndex: 1,
        explanation:
          'Self-reflection creates the map. Without knowing where you currently stand — your strengths, blind spots, and patterns — you can\'t chart an effective course.',
      },
      {
        question:
          'You notice that every time a relationship starts getting serious, you pull away. What does "looking in the mirror" mean in this context?',
        options: [
          'Checking your appearance more frequently',
          'Blaming your partners for moving too fast',
          'Examining what fears or past experiences might be driving your avoidance pattern',
          'Deciding that you\'re simply not the relationship type',
        ],
        correctIndex: 2,
        explanation:
          'The mirror metaphor is about looking inward with honesty. Recognizing your own patterns and their roots is the first step toward changing them.',
      },
      {
        question:
          'Which statement best reflects a growth mindset toward dating?',
        options: [
          '"I\'m just not naturally charming — some people have it and some don\'t"',
          '"I\'m not where I want to be yet, but social skills can be learned and improved with practice"',
          '"If someone doesn\'t like me, there\'s something wrong with them"',
          '"I need to completely reinvent my personality"',
        ],
        correctIndex: 1,
        explanation:
          'A growth mindset sees social and dating skills as learnable, not fixed traits. The word "yet" is powerful — it implies progress is coming.',
      },
      {
        question:
          'You\'ve written down your honest self-assessment. Which area should you focus on improving first?',
        options: [
          'Your biggest weakness, regardless of how difficult it is to change',
          'Something you\'re already good at, to boost confidence',
          'A meaningful area where small improvement would have the biggest positive impact on your dating life',
          'Whatever your friends are working on',
        ],
        correctIndex: 2,
        explanation:
          'Prioritize high-impact, achievable improvements. Tackling your biggest weakness head-on can be demoralizing, while strategic wins build momentum.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 2 – Confidence Bootcamp
  // ──────────────────────────────────────────────
  {
    chapterId: 2,
    locale: 'en',
    questions: [
      {
        question:
          'You\'re about to walk into a party where you don\'t know anyone. Which approach best builds genuine confidence?',
        options: [
          'Fake it till you make it — pretend to be someone you\'re not',
          'Remind yourself of past social successes, stand tall, and set a small achievable goal like "I\'ll introduce myself to three people"',
          'Have several drinks before arriving to calm your nerves',
          'Stay near the exit in case you need to leave quickly',
        ],
        correctIndex: 1,
        explanation:
          'Genuine confidence comes from evidence of your own competence plus small achievable goals. Remembering past wins and setting manageable targets keeps you grounded.',
      },
      {
        question:
          'What is the relationship between body language and confidence?',
        options: [
          'Body language only reflects confidence — it can\'t create it',
          'Body language both reflects AND influences your internal state — standing tall can actually make you feel more confident',
          'Body language is irrelevant; only your words matter',
          'Confident body language will make you seem arrogant',
        ],
        correctIndex: 1,
        explanation:
          'Research shows the mind-body connection works both ways. Adopting confident posture (open stance, shoulders back, head up) sends feedback signals that actually shift your emotional state.',
      },
      {
        question:
          'A friend says, "You\'re either born confident or you\'re not." Why is this wrong?',
        options: [
          'It\'s actually correct — confidence is genetic',
          'Because confidence is a skill built through repeated exposure to uncomfortable situations, not a fixed personality trait',
          'Because everyone is born confident — some people just lose it',
          'Because confidence comes from external validation, which anyone can get',
        ],
        correctIndex: 1,
        explanation:
          'Confidence is built through action and experience, not inherited. Every socially skilled person started somewhere, and most had to push through discomfort to get there.',
      },
      {
        question:
          'You notice that you feel confident at work but completely lose it on dates. What does this suggest?',
        options: [
          'You\'re a fraud and your work confidence is fake',
          'Dating is inherently harder than work and you should give up',
          'Confidence is context-specific — you can build it in dating the same way you built it at work: through practice and competence',
          'You should only date people from your workplace',
        ],
        correctIndex: 2,
        explanation:
          'Confidence often doesn\'t transfer across domains. The good news is that the same process that made you confident at work — repeated practice and small wins — works for dating too.',
      },
      {
        question:
          'Which of these is an example of a "power pose" you might use before a date to boost confidence?',
        options: [
          'Crossing your arms and legs to feel protected',
          'Standing with your feet shoulder-width apart, hands on hips, chest open, for two minutes',
          'Sitting hunched over your phone',
          'Pacing back and forth rapidly',
        ],
        correctIndex: 1,
        explanation:
          'Expansive postures that take up space (like the "Wonder Woman" pose) have been shown to increase feelings of power and reduce stress hormones.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 3 – The Art of Eye Contact
  // ──────────────────────────────────────────────
  {
    chapterId: 3,
    locale: 'en',
    questions: [
      {
        question:
          'You\'re at a bar and make eye contact with someone across the room. They hold your gaze for about three seconds and smile. What does this most likely mean?',
        options: [
          'They\'re staring at something behind you',
          'They\'re challenging you to a fight',
          'They\'re signaling openness to being approached — this is a classic invitation',
          'It means nothing; people look around randomly',
        ],
        correctIndex: 2,
        explanation:
          'Sustained eye contact (around 3 seconds) plus a smile is one of the strongest non-verbal invitations. It\'s a deliberate signal, not an accident.',
      },
      {
        question:
          'What\'s the ideal way to use eye contact during a one-on-one conversation?',
        options: [
          'Stare unblinkingly into their eyes the entire time to show intensity',
          'Maintain eye contact about 60-70% of the time, naturally glancing away occasionally',
          'Avoid eye contact to show you\'re a good listener',
          'Only look at them when you\'re speaking, not when they are',
        ],
        correctIndex: 1,
        explanation:
          'The 60-70% rule creates connection without discomfort. Breaking eye contact occasionally (and naturally) prevents it from feeling like a stare.',
      },
      {
        question:
          'You tend to look at the floor when speaking to attractive people. What\'s the best way to improve?',
        options: [
          'Force yourself to maintain intense eye contact from day one',
          'Practice gradually — start with holding eye contact with cashiers and baristas for a few seconds, then build up',
          'Wear sunglasses so they can\'t tell where you\'re looking',
          'Look at their forehead instead — they won\'t notice the difference',
        ],
        correctIndex: 1,
        explanation:
          'Like any skill, eye contact improves with gradual practice. Low-stakes daily interactions are the perfect training ground.',
      },
      {
        question:
          'What\'s the difference between confident eye contact and staring?',
        options: [
          'There is no difference — more eye contact is always better',
          'Confident eye contact is warm, relaxed, and includes natural breaks; staring is fixed, intense, and doesn\'t break',
          'Staring is just eye contact from someone you\'re not attracted to',
          'Confident eye contact lasts exactly five seconds, staring is six or more',
        ],
        correctIndex: 1,
        explanation:
          'The quality matters more than the duration. Soft, warm eye contact with natural breaks reads as confident and inviting. Rigid, unblinking focus reads as threatening.',
      },
      {
        question:
          'You\'re on a first date and notice your date keeps breaking eye contact and looking down. What might this indicate?',
        options: [
          'They definitely aren\'t interested in you',
          'They\'re rude and not listening',
          'They could be nervous or shy — it doesn\'t necessarily mean disinterest, especially if they keep looking back',
          'They\'re bored and want to leave',
        ],
        correctIndex: 2,
        explanation:
          'Looking down can be a sign of shyness or nervousness, not just disinterest. If they keep re-engaging and returning their gaze, they\'re likely interested but anxious.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 4 – Starting Conversations
  // ──────────────────────────────────────────────
  {
    chapterId: 4,
    locale: 'en',
    questions: [
      {
        question:
          'You\'re at a coffee shop and notice someone reading a book you love. What\'s the best way to start a conversation?',
        options: [
          '"Excuse me, I couldn\'t help but notice you\'re reading [title] — I loved that book. What do you think of it so far?"',
          '"Hey, are you single?"',
          '"That book is terrible, you should read something else"',
          'Sit silently next to them hoping they\'ll notice you',
        ],
        correctIndex: 0,
        explanation:
          'Situational openers that reference something genuine in the moment feel natural and give the other person an easy way to respond. They create an instant shared topic.',
      },
      {
        question:
          'Why are open-ended questions better than yes/no questions when starting a conversation?',
        options: [
          'They aren\'t — yes/no questions are more efficient',
          'They make you sound smarter',
          'They invite the other person to share more, creating natural conversation flow and showing genuine interest',
          'They confuse people into talking longer',
        ],
        correctIndex: 2,
        explanation:
          'Open-ended questions ("What brought you here?" vs "Do you come here often?") give people room to share and make it easier to find connection points.',
      },
      {
        question:
          'You\'re waiting in line at a grocery store. Which conversation starter feels most natural?',
        options: [
          'Reciting a memorized pickup line',
          'Making an observation about the shared situation: "This line is unreal — I think we\'ll be here long enough to become friends"',
          'Asking for their phone number immediately',
          'Complimenting their body',
        ],
        correctIndex: 1,
        explanation:
          'Shared-experience observations are the most natural openers because they\'re relevant, low-pressure, and create instant common ground.',
      },
      {
        question:
          'What\'s the biggest mistake people make when trying to start conversations with strangers?',
        options: [
          'Not having a witty enough opening line',
          'Overthinking it — the words matter far less than your energy, timing, and willingness to initiate',
          'Not being attractive enough',
          'Being too friendly',
        ],
        correctIndex: 1,
        explanation:
          'Most people never start the conversation because they\'re waiting for the perfect line. In reality, a warm, confident delivery of an average opener beats a perfect line delivered nervously.',
      },
      {
        question:
          'You start a conversation and the other person gives short, one-word answers. What should you do?',
        options: [
          'Keep pushing and ask more questions — they\'ll warm up eventually',
          'Take it as a cue that they may not want to chat right now, gracefully exit with "Well, nice chatting — enjoy your day!"',
          'Get offended and tell them they\'re being rude',
          'Switch to a more personal topic to get them engaged',
        ],
        correctIndex: 1,
        explanation:
          'Respecting disinterest signals is a core social skill. A graceful exit preserves your dignity and their comfort. Not everyone is available for conversation, and that\'s okay.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 5 – The Approach
  // ──────────────────────────────────────────────
  {
    chapterId: 5,
    locale: 'en',
    questions: [
      {
        question:
          'You spot someone you\'d like to talk to at a bookstore. They\'re browsing alone, glancing around occasionally. Is this a good "approach window"?',
        options: [
          'No — they\'re shopping and don\'t want to be bothered',
          'Yes — they\'re alone, seem open to their environment, and are in a relaxed social setting',
          'Only if they make eye contact with you first',
          'Only if you\'re buying the same book',
        ],
        correctIndex: 1,
        explanation:
          'Good approach windows include: the person is alone or in a small group, in a social-friendly environment, appears relaxed, and isn\'t deeply absorbed in something else.',
      },
      {
        question:
          'What\'s the most important element of a successful approach?',
        options: [
          'Having the perfect opening line prepared',
          'Being tall and conventionally attractive',
          'Your energy and body language — approaching with calm, positive energy and open body language',
          'Approaching from behind so they don\'t see you coming',
        ],
        correctIndex: 2,
        explanation:
          'Energy transfers. If you approach with warmth, calm, and a genuine smile, the other person will mirror that. Nervous, hesitant energy creates uncomfortable interactions.',
      },
      {
        question:
          'Someone is sitting at a cafe wearing headphones and typing intensely on their laptop. Should you approach?',
        options: [
          'Yes — headphones aren\'t a real barrier',
          'Yes, but only if they\'re attractive enough to justify the interruption',
          'No — headphones and focused work are clear signals they don\'t want to be interrupted',
          'Yes, but tap them on the shoulder first',
        ],
        correctIndex: 2,
        explanation:
          'Reading social signals includes recognizing when someone does NOT want to be approached. Headphones plus focused activity is a clear "do not disturb" signal.',
      },
      {
        question:
          'You approach someone and they seem receptive at first but then start giving shorter answers and looking at their phone. What\'s happening?',
        options: [
          'They\'re playing hard to get — keep pushing',
          'They\'re testing your persistence',
          'They\'re signaling that the conversation has run its course — it\'s time to exit gracefully',
          'Their phone is more interesting — grab it playfully to get their attention back',
        ],
        correctIndex: 2,
        explanation:
          'Declining engagement signals (shorter answers, checking phone, angled-away body) mean it\'s time to leave gracefully. Pushing past these signals is what makes approaches feel uncomfortable.',
      },
      {
        question:
          'After a pleasant approach and short conversation, what\'s the best way to end it?',
        options: [
          'Keep talking as long as possible to maximize connection',
          'Leave on a high note while the energy is still good: "I\'ve got to run, but I\'d love to continue this — can I get your number?"',
          'Just walk away without saying anything to seem mysterious',
          'Ask them to come with you to another location immediately',
        ],
        correctIndex: 1,
        explanation:
          'Leaving on a high note creates a positive memory. Overstaying kills the energy. A confident, clear close ("Can I get your number?") is direct and respectful.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 6 – Reading the Room
  // ──────────────────────────────────────────────
  {
    chapterId: 6,
    locale: 'en',
    questions: [
      {
        question:
          'You arrive at a house party. Before jumping into conversations, what should you do first?',
        options: [
          'Immediately find the most attractive person and approach them',
          'Take a few minutes to observe the room — notice who\'s open, who\'s in closed groups, what the overall energy is like',
          'Go straight to the drinks table and wait for people to come to you',
          'Start talking loudly to get everyone\'s attention',
        ],
        correctIndex: 1,
        explanation:
          'Reading the room before acting gives you a social map. You\'ll spot open groups, available individuals, and the general vibe — all of which help you choose your approach.',
      },
      {
        question:
          'You want to join a group conversation at a party. How can you tell if the group is "open" or "closed"?',
        options: [
          'There\'s no way to tell — just jump in',
          'An open group stands in a loose formation with space between people; a closed group is tightly formed with bodies angled inward',
          'A closed group is always louder than an open group',
          'Groups of more than three people are always open',
        ],
        correctIndex: 1,
        explanation:
          'Group body language reveals openness. Loose formations with gaps (like a horseshoe shape) invite newcomers. Tight circles with inward-facing bodies signal a private conversation.',
      },
      {
        question:
          'During a date at a restaurant, your date crosses their arms, leans back, and stops making eye contact after you bring up a certain topic. What should you read from this?',
        options: [
          'They\'re cold and need a jacket',
          'Nothing — body language doesn\'t mean anything',
          'They\'re likely uncomfortable with this topic — smoothly transition to something lighter',
          'They\'re challenging you to defend your opinion more strongly',
        ],
        correctIndex: 2,
        explanation:
          'Closed-off body language (crossed arms, leaning back, broken eye contact) in response to a topic is a strong signal of discomfort. Socially aware people pivot naturally.',
      },
      {
        question:
          'What does "social calibration" mean?',
        options: [
          'Calculating how many people you should talk to at an event',
          'Adjusting your energy, topics, and behavior to match the context and the people around you',
          'Always being the loudest person in the room',
          'Having the same approach regardless of the situation',
        ],
        correctIndex: 1,
        explanation:
          'Social calibration is reading signals and adapting in real time. The energy you bring to a quiet wine bar should differ from a loud rooftop party.',
      },
      {
        question:
          'You\'re at a networking event and notice someone standing alone, scanning the room with open body language. What does this likely mean?',
        options: [
          'They want to be left alone',
          'They\'re waiting for someone specific',
          'They\'re open to being approached and would likely welcome a conversation',
          'They\'re about to leave',
        ],
        correctIndex: 2,
        explanation:
          'Open body language plus scanning the room is a signal of social availability. These are the easiest and most receptive people to approach at any event.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 7 – Active Listening
  // ──────────────────────────────────────────────
  {
    chapterId: 7,
    locale: 'en',
    questions: [
      {
        question:
          'Your date mentions they recently ran a half-marathon. Which response demonstrates active listening?',
        options: [
          '"Cool. So anyway, I\'ve been really into CrossFit lately..."',
          '"That\'s amazing! What made you decide to take that on? How did it feel crossing the finish line?"',
          '"I could never do that — I hate running"',
          '"Yeah, my friend did one of those too"',
        ],
        correctIndex: 1,
        explanation:
          'Active listening means engaging with what was said through relevant follow-up questions that show genuine curiosity. It makes the speaker feel valued and deepens connection.',
      },
      {
        question:
          'What is the biggest difference between hearing and actively listening?',
        options: [
          'There\'s no difference — they\'re the same thing',
          'Hearing is passive; active listening involves full attention, processing meaning, and responding in a way that shows understanding',
          'Active listening means repeating everything back word for word',
          'Active listening means staying silent the entire time',
        ],
        correctIndex: 1,
        explanation:
          'Hearing happens automatically. Active listening is intentional — it involves focus, processing, and response that demonstrates comprehension and care.',
      },
      {
        question:
          'Your date is telling you about a difficult day at work. What\'s the most powerful thing you can do?',
        options: [
          'Immediately offer solutions to their problems',
          'Share a story about a worse day you had to put things in perspective',
          'Listen fully, validate their feelings ("That sounds really frustrating"), and ask if they want to vent or want advice',
          'Change the subject to something more positive',
        ],
        correctIndex: 2,
        explanation:
          'Often people want to feel heard, not fixed. Validating emotions first and asking how they\'d like you to respond shows emotional intelligence.',
      },
      {
        question:
          'You realize you zoned out during a story your date was telling. What\'s the best recovery?',
        options: [
          'Nod and pretend you heard everything',
          'Be honest: "I\'m sorry, I got distracted for a moment — can you back up? I want to hear this properly"',
          'Change the subject so they don\'t notice',
          'Make a generic comment like "Wow, that\'s crazy"',
        ],
        correctIndex: 1,
        explanation:
          'Honesty about a momentary lapse is more respectful than faking attention. It shows you care enough to hear the full story rather than pretend.',
      },
      {
        question:
          'Which body language signals show someone that you\'re actively listening?',
        options: [
          'Leaning back with arms crossed',
          'Checking your watch periodically',
          'Leaning slightly forward, nodding occasionally, maintaining eye contact, and having an open posture',
          'Staring intensely without moving',
        ],
        correctIndex: 2,
        explanation:
          'Active listening has a physical component. Leaning in, nodding, and eye contact signal engagement. These cues encourage the speaker and build rapport.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 8 – Humor & Wit
  // ──────────────────────────────────────────────
  {
    chapterId: 8,
    locale: 'en',
    questions: [
      {
        question:
          'You\'re on a first date and the waiter brings you the wrong dish. What type of humor works best here?',
        options: [
          'Angrily mocking the waiter to seem dominant',
          'Making a light, playful observation: "Well, the universe clearly thinks I need to try something new tonight"',
          'Ignoring it completely — humor is risky on first dates',
          'Making a sarcastic complaint to seem witty',
        ],
        correctIndex: 1,
        explanation:
          'Light, situational humor that doesn\'t target anyone is the safest and most attractive type. It shows you\'re easy-going and can roll with unexpected moments.',
      },
      {
        question:
          'What\'s the key difference between self-deprecating humor that works and self-deprecating humor that backfires?',
        options: [
          'Self-deprecating humor never works — always avoid it',
          'Good self-deprecating humor is confident and playful (laughing WITH yourself); bad self-deprecating humor reveals genuine insecurity',
          'It depends entirely on how attractive you are',
          'Self-deprecating humor always works because it shows humility',
        ],
        correctIndex: 1,
        explanation:
          'The line is confidence. "I tried to cook once — the fire department asked me to stick to reservations" is playful. Constantly putting yourself down signals insecurity, not humor.',
      },
      {
        question:
          'Your date makes a joke and you don\'t find it funny. What\'s the best response?',
        options: [
          'Fake a big laugh to keep them happy',
          'Tell them their joke wasn\'t funny',
          'Give a genuine smile, perhaps a light chuckle, and keep the conversation going — you don\'t have to fake hysteria',
          'Immediately try to top their joke with a better one',
        ],
        correctIndex: 2,
        explanation:
          'A warm, genuine reaction is always better than a fake one. You can appreciate someone\'s attempt at humor without forcing a laugh. Authenticity matters more than performance.',
      },
      {
        question:
          'Why is timing considered the most important element of humor?',
        options: [
          'Because the same joke told at the wrong moment can be offensive or fall flat, while perfect timing makes even simple observations hilarious',
          'Because you need to wait exactly 3 seconds before delivering a punchline',
          'Timing doesn\'t actually matter — the content of the joke is everything',
          'Because you should always be the first person to make a joke in any situation',
        ],
        correctIndex: 0,
        explanation:
          'Comedy is about surprise and context. The funniest people aren\'t the ones with the best jokes — they\'re the ones who say the right thing at the right moment.',
      },
      {
        question:
          'You want to be funnier on dates. What\'s the most effective way to develop your humor?',
        options: [
          'Memorize jokes from the internet and use them in conversation',
          'Practice observational humor in daily life — notice the absurd in ordinary moments and learn to comment on it playfully',
          'Watch comedy specials and repeat the comedian\'s jokes word for word',
          'Always be "on" — never have a serious moment',
        ],
        correctIndex: 1,
        explanation:
          'The best conversational humor is observational and spontaneous. Training yourself to notice funny things in everyday life builds the muscle of natural wit.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 9 – The Compliment
  // ──────────────────────────────────────────────
  {
    chapterId: 9,
    locale: 'en',
    questions: [
      {
        question:
          'You want to compliment someone you just met at a friend\'s dinner party. Which compliment is most effective?',
        options: [
          '"You\'re the hottest person here"',
          '"I love how you told that story about your trip — you really have a way with words"',
          '"You have beautiful eyes"',
          '"You\'re way out of my league"',
        ],
        correctIndex: 1,
        explanation:
          'Specific compliments about someone\'s character, skills, or choices are far more impactful than generic physical compliments. They show you\'re actually paying attention.',
      },
      {
        question:
          'What makes a compliment feel genuine rather than creepy?',
        options: [
          'Saying it as many times as possible so they know you mean it',
          'It\'s specific, appropriate to the context, delivered casually without expecting anything in return, and about something they chose (style, skill, humor) rather than just their body',
          'Making strong eye contact and whispering it',
          'It\'s impossible to control — some people will always find compliments creepy',
        ],
        correctIndex: 1,
        explanation:
          'The key factors are: specificity (not generic), context-appropriate, no strings attached, and focused on choices/actions rather than body parts. Delivery should be natural, not intense.',
      },
      {
        question:
          'You give someone a compliment and they deflect it by saying, "Oh, it\'s nothing." What should you do?',
        options: [
          'Repeat the compliment louder so they accept it',
          'Argue with them about why they should accept the compliment',
          'Let it go naturally — don\'t push. A simple "Well, I think so" with a smile is enough',
          'Take it back since they clearly don\'t want compliments',
        ],
        correctIndex: 2,
        explanation:
          'Many people are uncomfortable receiving compliments. A brief, confident reaffirmation without pressure respects their response while still standing by what you said.',
      },
      {
        question:
          'When is the WORST time to give someone a compliment?',
        options: [
          'When they\'ve just accomplished something',
          'During a natural moment of connection in conversation',
          'Right after they\'ve done something you want (it feels manipulative) or when the power dynamic makes them uncomfortable',
          'At the beginning of a date',
        ],
        correctIndex: 2,
        explanation:
          'Timing and context matter. Compliments that seem like they\'re buttering someone up for a favor feel manipulative, and compliments in certain power dynamics (boss to employee) can feel coercive.',
      },
      {
        question:
          'Which of these is an example of a "specificity upgrade" — turning a generic compliment into a great one?',
        options: [
          'Changing "You look nice" to "You look REALLY nice"',
          'Changing "You\'re funny" to "The way you told that story about the airport had me actually crying — your comedic timing is incredible"',
          'Changing "Nice outfit" to "Nice outfit, it must have been expensive"',
          'Changing "You\'re pretty" to "You\'re the prettiest person I\'ve ever seen"',
        ],
        correctIndex: 1,
        explanation:
          'Specificity is what turns a compliment from forgettable to memorable. Referencing a particular moment or detail shows you were genuinely paying attention.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 10 – Digital Game
  // ──────────────────────────────────────────────
  {
    chapterId: 10,
    locale: 'en',
    questions: [
      {
        question:
          'You\'re building an online dating profile. Which photo strategy works best?',
        options: [
          'All selfies, including several bathroom mirror shots',
          'A mix of photos: a clear face shot with a genuine smile, full-body photo, and candid shots of you doing activities you enjoy',
          'Only group photos so you seem popular',
          'Heavily filtered photos that make you look significantly different from real life',
        ],
        correctIndex: 1,
        explanation:
          'Variety, authenticity, and clarity are key. A clear face photo builds trust, a full-body photo sets honest expectations, and activity photos show your personality.',
      },
      {
        question:
          'You match with someone on a dating app. Which opening message is most likely to get a response?',
        options: [
          '"Hey"',
          '"You\'re gorgeous"',
          'A specific comment or question about something in their profile: "I see you\'re into rock climbing — have you been to any outdoor spots, or are you mostly a gym climber?"',
          'A copy-pasted pickup line you send to every match',
        ],
        correctIndex: 2,
        explanation:
          'Personalized messages that reference something specific from their profile show you actually looked at who they are. This dramatically increases response rates compared to generic openers.',
      },
      {
        question:
          'You\'ve been chatting with someone online for a week and it\'s going well. When should you suggest meeting in person?',
        options: [
          'After the first message',
          'After establishing some rapport (a few days of good conversation) — something like "I\'m really enjoying this conversation. Want to grab coffee this weekend?"',
          'Never — online is safer',
          'After at least a month of daily texting',
        ],
        correctIndex: 1,
        explanation:
          'The sweet spot is after enough rapport to feel comfortable but before the conversation goes stale. Extended texting without meeting often leads to fantasy bonds that don\'t survive reality.',
      },
      {
        question:
          'What\'s the biggest mistake people make in their dating profiles?',
        options: [
          'Not being attractive enough in their photos',
          'Being generic — listing things like "I love travel, food, and laughing" that apply to almost everyone',
          'Being too honest about their personality',
          'Having too few photos',
        ],
        correctIndex: 1,
        explanation:
          'Specificity makes you memorable. "I love food" is forgettable. "I\'m on a mission to find the best birria tacos in every city I visit" gives someone something to connect with.',
      },
      {
        question:
          'Your match suggests meeting at their apartment for a first date. What\'s the best response?',
        options: [
          'Agree — they probably just prefer a chill setting',
          'Suggest a public place instead: "I\'d love to meet up! How about that coffee shop downtown? I think it\'d be a great spot"',
          'Ghost them — this is a red flag and means they\'re dangerous',
          'Agree but bring a friend',
        ],
        correctIndex: 1,
        explanation:
          'First meetings should always be in public for safety. Redirecting to a public venue is standard practice and anyone reasonable will understand and respect it.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 11 – The First Date
  // ──────────────────────────────────────────────
  {
    chapterId: 11,
    locale: 'en',
    questions: [
      {
        question:
          'You\'re planning a first date. Which option creates the best environment for connection?',
        options: [
          'An expensive fine dining restaurant to impress them',
          'A movie — so you don\'t have to talk',
          'A casual, low-pressure setting like a coffee shop, a walk, or a low-key bar that makes conversation easy',
          'An adrenaline activity like skydiving to seem exciting',
        ],
        correctIndex: 2,
        explanation:
          'First dates are about getting to know each other. Low-pressure settings with easy conversation flow beat expensive or activity-heavy options that can feel overwhelming or prevent real connection.',
      },
      {
        question:
          'You\'re incredibly nervous before a first date. Which strategy is most effective?',
        options: [
          'Have a few drinks before to take the edge off',
          'Remind yourself that a date is just a conversation — reframe it as "I\'m going to find out if I enjoy this person\'s company"',
          'Cancel the date — if you\'re this nervous, you\'re not ready',
          'Memorize a list of conversation topics so you never run out of things to say',
        ],
        correctIndex: 1,
        explanation:
          'Reframing a date from "performance" to "discovery" reduces pressure dramatically. You\'re not auditioning — you\'re exploring mutual compatibility.',
      },
      {
        question:
          'During a first date, which topic should you generally AVOID going deep on?',
        options: [
          'Their hobbies and passions',
          'Detailed stories about your ex-relationships',
          'What they do for work and whether they enjoy it',
          'A fun travel experience',
        ],
        correctIndex: 1,
        explanation:
          'Extensive ex-talk on a first date signals you may not be over the past. Save those conversations for when you know each other better. First dates should be forward-looking.',
      },
      {
        question:
          'The date is going well and you\'re having a great time. When should you end it?',
        options: [
          'Never — keep it going as long as possible',
          'After exactly one hour, no matter what',
          'While the energy is still high — ending on a positive note leaves them wanting more',
          'Only when the venue closes',
        ],
        correctIndex: 2,
        explanation:
          'Leaving while the energy is good creates a positive last impression and anticipation for next time. Overstaying can drain the energy and end on a flat note.',
      },
      {
        question:
          'Your date says something you disagree with. What\'s the best approach on a first date?',
        options: [
          'Agree with everything to avoid conflict',
          'Start a heated debate to show you have strong opinions',
          'Express your different perspective respectfully and with curiosity: "Interesting — I see it a bit differently. I think... What makes you see it that way?"',
          'Change the subject immediately',
        ],
        correctIndex: 2,
        explanation:
          'Respectful disagreement shows you have a backbone while still being open-minded. Blind agreement is boring, and heated debates create tension. Curiosity bridges the gap.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 12 – Conversation Flow
  // ──────────────────────────────────────────────
  {
    chapterId: 12,
    locale: 'en',
    questions: [
      {
        question:
          'The conversation hits a lull and silence stretches out awkwardly. What\'s the best way to revive it?',
        options: [
          'Panic and start talking about the weather',
          'Use the last thing they mentioned as a springboard: "Going back to what you said about learning to cook — what inspired that?"',
          'Stare at them until they say something',
          'Pull out your phone to fill the silence',
        ],
        correctIndex: 1,
        explanation:
          'Callback references (revisiting earlier topics) feel natural and show you were listening. They\'re one of the easiest tools for reviving conversation flow.',
      },
      {
        question:
          'What is "conversational threading" and why is it powerful?',
        options: [
          'Staying on one topic until it\'s completely exhausted',
          'Picking up on the multiple topics embedded in someone\'s statement and choosing which thread to follow — it makes conversation feel effortless and you never run out of things to say',
          'Threading your own stories into every conversation',
          'Only talking about topics you\'ve prepared in advance',
        ],
        correctIndex: 1,
        explanation:
          'Every sentence someone says contains multiple possible threads. "I just got back from Italy with my sister" contains threads about travel, Italy specifically, their sister, and more.',
      },
      {
        question:
          'You realize you\'ve been talking about yourself for five minutes straight. What should you do?',
        options: [
          'Keep going — your story is really interesting',
          'Stop mid-sentence and say "Sorry, I\'m rambling"',
          'Smoothly pivot back to them: "But enough about me — I\'m curious, have you ever experienced anything like that?"',
          'Go silent to compensate',
        ],
        correctIndex: 2,
        explanation:
          'The best conversationalists are aware of the talk ratio. Pivoting back to the other person with a related question feels natural and shows you value the conversation as a two-way exchange.',
      },
      {
        question:
          'Which technique helps avoid "interview mode" (rapid-fire questions that feel like an interrogation)?',
        options: [
          'Ask even more questions so it feels conversational',
          'Share a brief related thought or story between questions — create a give-and-take rhythm rather than just asking',
          'Only ask one question per hour',
          'Stop asking questions entirely and just make statements',
        ],
        correctIndex: 1,
        explanation:
          'Interview mode happens when you ask questions without sharing anything yourself. The fix is alternating: ask, share something related, then ask again. It creates natural rhythm.',
      },
      {
        question:
          'What\'s the best way to transition between unrelated topics without it feeling abrupt?',
        options: [
          '"Anyway, totally random, but..." — just force the transition',
          'Use bridging phrases that connect to the new topic: "That reminds me..." or "Speaking of adventures, I\'ve been meaning to ask..."',
          'Wait for the other person to change topics',
          'There\'s no way to do this smoothly — topic changes are always awkward',
        ],
        correctIndex: 1,
        explanation:
          'Bridge phrases create a logical connection between topics, even when the link is loose. They make transitions feel intentional rather than random.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 13 – Touch & Proximity
  // ──────────────────────────────────────────────
  {
    chapterId: 13,
    locale: 'en',
    questions: [
      {
        question:
          'You\'re on a second date and wondering about initiating physical contact. What\'s the proper approach to escalation?',
        options: [
          'Go straight for a kiss to show confidence',
          'Start with casual, social touches (brief touch on the arm during a laugh) and gradually increase based on their positive response',
          'Don\'t touch them at all until they explicitly ask you to',
          'Ask permission before any physical contact — "May I touch your arm?"',
        ],
        correctIndex: 1,
        explanation:
          'Physical escalation should be gradual and responsive. Start small (arm touch, shoulder touch) and gauge their reaction. If they lean in or reciprocate, you can progress naturally.',
      },
      {
        question:
          'You touch your date\'s arm lightly and they subtly pull away. What should you do?',
        options: [
          'Try again — they probably didn\'t notice',
          'Respect the signal by pulling back naturally, without making it awkward or drawing attention to it',
          'Ask them why they pulled away',
          'Stop touching them for the rest of the date and act hurt',
        ],
        correctIndex: 1,
        explanation:
          'Pulling away is a clear boundary signal. The respectful response is to naturally reduce physical contact without making it a "thing." Don\'t interrogate, don\'t sulk — just adjust.',
      },
      {
        question:
          'What does "reading comfort" mean in the context of physical proximity?',
        options: [
          'Making sure the seats are comfortable',
          'Paying attention to whether someone leans in (comfortable) or creates distance (uncomfortable) in response to your closeness',
          'Asking them to rate their comfort on a scale of 1-10',
          'Assuming everyone has the same comfort level with touch',
        ],
        correctIndex: 1,
        explanation:
          'Comfort is communicated through body language. Leaning in, orienting toward you, and relaxed posture signal comfort. Leaning away, crossed arms, and tension signal discomfort.',
      },
      {
        question:
          'Why is respecting physical boundaries considered attractive rather than weak?',
        options: [
          'It isn\'t — people respect boldness more',
          'Because it demonstrates emotional intelligence, self-control, and genuine respect — qualities that build deep trust and safety',
          'Because it avoids legal trouble',
          'It\'s only important if the other person tells you they have boundaries',
        ],
        correctIndex: 1,
        explanation:
          'People are most attracted to those they feel safe with. Reading and respecting boundaries shows you\'re attuned, in control, and prioritize mutual comfort — which is deeply attractive.',
      },
      {
        question:
          'Which seating arrangement on a date creates the best opportunity for natural physical connection?',
        options: [
          'Sitting directly across a wide table',
          'Sitting side-by-side or at a 90-degree angle — close enough for incidental contact',
          'Sitting as far apart as possible to respect boundaries',
          'It doesn\'t matter where you sit',
        ],
        correctIndex: 1,
        explanation:
          'Side-by-side or 90-degree seating naturally creates proximity and opportunities for casual contact (shoulder touches, leaning in) that feel organic rather than forced.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 14 – Handling Rejection
  // ──────────────────────────────────────────────
  {
    chapterId: 14,
    locale: 'en',
    questions: [
      {
        question:
          'You ask someone for their number and they politely decline. What\'s the best response?',
        options: [
          '"Why not? Give me a chance — you don\'t even know me yet"',
          '"No problem at all — it was nice chatting with you. Have a great night!" and walk away with a genuine smile',
          'Ask them if there\'s someone else or what you did wrong',
          'Show visible disappointment so they feel guilty and reconsider',
        ],
        correctIndex: 1,
        explanation:
          'Graceful rejection handling is one of the most attractive things you can demonstrate. It shows confidence, respect, and emotional maturity — and people notice.',
      },
      {
        question:
          'After being rejected, you keep replaying it and feeling terrible. What\'s the healthiest mindset shift?',
        options: [
          '"I\'ll never put myself out there again"',
          '"Rejection is information, not a verdict. They said no to this interaction, not to my worth as a person. Compatibility is a two-way street"',
          '"They must have terrible taste"',
          '"I need to completely change who I am"',
        ],
        correctIndex: 1,
        explanation:
          'Rejection reflects compatibility, not your value. Internalizing rejection as a personal failing leads to avoidance. Seeing it as neutral data keeps you resilient and willing to try again.',
      },
      {
        question:
          'A friend says, "Just stop caring about rejection and it won\'t hurt." Why is this advice unhelpful?',
        options: [
          'Because rejection genuinely activates the same brain pathways as physical pain — it\'s supposed to hurt',
          'Because if you stop caring, you become a sociopath',
          'Because caring about rejection is actually a sign of strength',
          'This advice is actually correct',
        ],
        correctIndex: 0,
        explanation:
          'Neuroscience shows rejection literally activates pain pathways. The goal isn\'t to not feel it — it\'s to develop resilience so you recover faster and don\'t let it stop you.',
      },
      {
        question:
          'You\'ve been rejected several times in a row and your confidence is shaken. What\'s the most productive thing to do?',
        options: [
          'Keep approaching immediately until you get a yes',
          'Take a brief pause to recharge, reflect on whether you can improve anything, talk to supportive friends, and then get back out there',
          'Conclude that you\'re fundamentally unattractive',
          'Switch to a different dating app and hope for better results',
        ],
        correctIndex: 1,
        explanation:
          'Self-care after a rough streak is important. Reflect constructively (not destructively), lean on your support system, and return when you\'ve recharged. Persistence without self-care leads to burnout.',
      },
      {
        question:
          'What\'s the best way to "learn from rejection" without spiraling into self-criticism?',
        options: [
          'Analyze every detail of the interaction obsessively',
          'Never think about it again',
          'Ask yourself one constructive question: "Is there anything I\'d do differently next time?" — then accept the answer and move on',
          'Ask the person who rejected you for detailed feedback',
        ],
        correctIndex: 2,
        explanation:
          'One focused reflection question extracts the lesson without the spiral. Often the answer is "nothing — it just wasn\'t a match." And that\'s a perfectly valid answer.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 15 – The Follow-Up
  // ──────────────────────────────────────────────
  {
    chapterId: 15,
    locale: 'en',
    questions: [
      {
        question:
          'You just had a great first date. When should you text them?',
        options: [
          'Wait exactly three days to seem not too eager',
          'Send a brief, warm text that evening or the next morning: "I had a really great time tonight. Let\'s do it again soon!"',
          'Wait for them to text you first',
          'Send a long paragraph about how amazing they are',
        ],
        correctIndex: 1,
        explanation:
          'The "three-day rule" is outdated. A genuine, low-pressure text that same evening or next day signals confidence and interest. Overthinking the timing makes it worse.',
      },
      {
        question:
          'You\'re texting with someone after a date and they take hours to respond. What should you do?',
        options: [
          'Double or triple text to make sure they saw your message',
          'Match their general pace — people have lives. Avoid reading too much into response times early on',
          'Confront them about their slow replies',
          'Respond to their next message instantly to show you\'re more interested',
        ],
        correctIndex: 1,
        explanation:
          'Response time anxiety is normal but usually overblown. People work, sleep, and get busy. Generally matching their pace avoids seeming over-eager or playing games.',
      },
      {
        question:
          'What\'s the main purpose of texting between dates?',
        options: [
          'To have the deepest possible conversations over text',
          'To maintain interest and rapport while setting up the next in-person meeting — save the deep stuff for face-to-face',
          'To text as frequently as possible so they don\'t forget about you',
          'To test whether they\'re as interested as you are',
        ],
        correctIndex: 1,
        explanation:
          'Texting is best used as a bridge between real interactions. Light, warm messages that maintain connection and move toward the next date are ideal. Don\'t try to build a relationship over text.',
      },
      {
        question:
          'You want to ask them on a second date. Which approach is best?',
        options: [
          '"Do you maybe want to hang out sometime again... if you want to... no pressure"',
          '"There\'s this great Thai place I\'ve been wanting to try — are you free Thursday evening?"',
          '"We should totally hang out again"',
          'Wait for them to suggest the next date',
        ],
        correctIndex: 1,
        explanation:
          'Specific plans with a concrete time show initiative and confidence. Vague suggestions ("We should hang out sometime") put the work on the other person and often go nowhere.',
      },
      {
        question:
          'After two dates with no third date being planned and fewer texts, what\'s the healthiest approach?',
        options: [
          'Send more texts to reignite their interest',
          'Send one clear, low-pressure text: "Hey, I\'ve enjoyed getting to know you. Would you be up for getting together again, or are you not feeling it? Either way, no hard feelings"',
          'Post thirst traps on social media to remind them what they\'re missing',
          'Show up at their workplace to have an "honest conversation"',
        ],
        correctIndex: 1,
        explanation:
          'Direct, emotionally mature communication cuts through ambiguity. It gives them an easy out if they\'re not interested and shows you\'re secure enough to handle the answer.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 16 – Building Connection
  // ──────────────────────────────────────────────
  {
    chapterId: 16,
    locale: 'en',
    questions: [
      {
        question:
          'You\'ve been dating someone for a few weeks and conversations stay surface-level. What\'s the best way to deepen the connection?',
        options: [
          'Demand that they open up about their feelings',
          'Lead by sharing something vulnerable about yourself — vulnerability invites vulnerability',
          'Keep things light — deep conversations happen naturally after months',
          'Ask them directly why they won\'t share their feelings',
        ],
        correctIndex: 1,
        explanation:
          'Vulnerability is reciprocal. When you share something meaningful about yourself, it creates psychological safety for the other person to do the same. You have to go first.',
      },
      {
        question:
          'What\'s the difference between vulnerability and oversharing?',
        options: [
          'There is no difference — all sharing is good',
          'Vulnerability is intentional sharing that creates connection; oversharing is dumping unprocessed emotional weight on someone before trust is established',
          'Vulnerability is for relationships; oversharing is for friendships',
          'Oversharing is just vulnerability that other people aren\'t ready for',
        ],
        correctIndex: 1,
        explanation:
          'Vulnerability is appropriate to the level of trust in the relationship and serves connection. Oversharing ignores the other person\'s comfort level and often serves the sharer\'s need to process, not the relationship.',
      },
      {
        question:
          'Your date shares a difficult personal experience with you. What response builds the deepest connection?',
        options: [
          'Immediately share your own similar experience to relate',
          'Listen fully, acknowledge their courage in sharing, validate their feelings, and ask a thoughtful follow-up — hold space for THEIR experience before shifting focus',
          'Offer advice on how to fix the problem',
          'Change the subject to something lighter to ease the tension',
        ],
        correctIndex: 1,
        explanation:
          'When someone is vulnerable, they need to feel heard first. Jumping to your own story, fixing, or deflecting all shift the focus away from them. Holding space is the most connecting response.',
      },
      {
        question:
          'What role do "deeper questions" play in building emotional intimacy?',
        options: [
          'They make you seem intellectual and impressive',
          'They bypass surface-level small talk to reveal values, dreams, fears, and experiences — the things that create genuine bond',
          'They\'re manipulative — you\'re trying to get information to use later',
          'They only work if you\'re already in a relationship',
        ],
        correctIndex: 1,
        explanation:
          'Questions like "What\'s something you\'re really proud of that most people don\'t know about?" or "What shaped who you are today?" accelerate intimacy by getting to who someone really is.',
      },
      {
        question:
          'You want to feel more connected to your partner but you\'re not naturally emotional. What can you do?',
        options: [
          'Accept that you\'ll never be good at emotional connection',
          'Practice identifying and naming your own emotions, share small truths about how you feel, and ask your partner meaningful questions — emotional skills are learnable',
          'Express everything as thoughts instead of feelings — "I think that\'s nice" instead of "I feel happy about that"',
          'Let your partner do all the emotional work in the relationship',
        ],
        correctIndex: 1,
        explanation:
          'Emotional intelligence is a skill, not a trait. Starting small (naming your emotions, sharing how something made you feel) builds the muscle over time.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 17 – Reading Signals
  // ──────────────────────────────────────────────
  {
    chapterId: 17,
    locale: 'en',
    questions: [
      {
        question:
          'Your date keeps finding excuses to touch your arm, faces you directly, and asks lots of questions about your life. What are these signals?',
        options: [
          'They\'re just being polite',
          'Clear interest signals — initiating touch, full body orientation toward you, and curiosity about you are strong indicators of attraction',
          'They\'re trying to sell you something',
          'These signals don\'t mean anything on their own',
        ],
        correctIndex: 1,
        explanation:
          'Interest is communicated through clusters of signals: initiating touch, oriented body language, sustained eye contact, asking personal questions, and finding reasons to be near you.',
      },
      {
        question:
          'Someone you\'re interested in is warm in person but takes days to respond to texts and never initiates plans. What signal should you read?',
        options: [
          'They\'re definitely interested — they\'re warm in person!',
          'Their behavior is showing mixed signals — when words and actions conflict, pay more attention to consistent patterns of behavior (especially effort and initiative)',
          'They\'re playing hard to get and you should pursue harder',
          'Texting habits don\'t mean anything about interest level',
        ],
        correctIndex: 1,
        explanation:
          'Mixed signals usually mean lukewarm interest. The most reliable indicator isn\'t any single interaction — it\'s the pattern of effort and initiative over time.',
      },
      {
        question:
          'What does it mean when someone responds to your advances with "Maybe" or "We\'ll see"?',
        options: [
          'They\'re being mysterious to build attraction',
          'In most cases, "maybe" is a soft no — if someone is enthusiastic, their answer is usually a clear yes',
          'They\'re definitely interested but busy',
          'You should ask again with more pressure',
        ],
        correctIndex: 1,
        explanation:
          'A useful rule: if it\'s not a "hell yes," it\'s probably a no. Enthusiastic interest is usually unmistakable. Vague responses often mean someone doesn\'t want to reject you directly.',
      },
      {
        question:
          'Which is more reliable: what someone says or what they do?',
        options: [
          'What they say — words are the primary communication tool',
          'What they do — actions consistently reveal true intentions, especially when words and actions don\'t match',
          'Both are equally reliable in all situations',
          'Neither — you can never truly know what someone is thinking',
        ],
        correctIndex: 1,
        explanation:
          'When words and actions align, great. When they don\'t, trust the actions. Someone who says "I really like you" but never makes time for you is telling you where their priorities actually are.',
      },
      {
        question:
          'You\'re unsure whether someone is interested in you. What\'s the most direct way to find out?',
        options: [
          'Analyze their social media activity for clues',
          'Ask mutual friends to investigate',
          'Create a situation that requires them to reveal their interest (like getting jealous)',
          'Ask them with warm directness: "I\'ve been enjoying spending time with you. I\'d love to take you on a proper date — what do you think?"',
        ],
        correctIndex: 3,
        explanation:
          'When in doubt, ask directly. Clear communication eliminates guessing games, demonstrates confidence, and respects both your time and theirs.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 18 – The Relationship Talk
  // ──────────────────────────────────────────────
  {
    chapterId: 18,
    locale: 'en',
    questions: [
      {
        question:
          'You\'ve been dating someone for two months and want to have "the talk." When is the right time to bring it up?',
        options: [
          'After the first date to lock things down early',
          'When you both seem invested, you\'re seeing each other regularly, and you want clarity — there\'s no universal timeline, but avoiding it indefinitely causes more anxiety than having it',
          'Only after they bring it up first',
          'On a major holiday or birthday for dramatic effect',
        ],
        correctIndex: 1,
        explanation:
          'The right time for the DTR talk is when you feel the need for clarity. Waiting for a "perfect" moment or for the other person to go first just prolongs uncertainty.',
      },
      {
        question:
          'How should you frame "the relationship talk" to make it productive rather than pressuring?',
        options: [
          '"We need to talk about where this is going" (serious, ominous tone)',
          '"I\'ve been really enjoying this and I want to be honest — I\'m starting to develop real feelings. How are you feeling about us?"',
          '"Are we exclusive or what?"',
          'Give them an ultimatum: "Commit to me or I\'m leaving"',
        ],
        correctIndex: 1,
        explanation:
          'Leading with your own feelings (vulnerability) rather than demands creates safety. It invites an honest response rather than a defensive one.',
      },
      {
        question:
          'During "the talk," they say they\'re not ready for a label but they clearly enjoy spending time with you. What should you consider?',
        options: [
          'Immediately walk away — if they don\'t want a label, they don\'t want you',
          'Wait indefinitely without ever bringing it up again',
          'Decide what YOU need — if you want commitment and they don\'t, it\'s fair to set a personal timeline and communicate that respectfully',
          'Pretend you don\'t want a label either, even though you do',
        ],
        correctIndex: 2,
        explanation:
          'Respecting their pace doesn\'t mean abandoning your needs. Knowing what you require and communicating it honestly is the mature approach. You can give space without waiting forever.',
      },
      {
        question:
          'What is the biggest mistake people make during the DTR (Define The Relationship) conversation?',
        options: [
          'Having it too early',
          'Not planning what to say in advance',
          'Approaching it as a negotiation or ultimatum instead of an open, honest exchange of feelings and intentions',
          'Doing it in person instead of over text',
        ],
        correctIndex: 2,
        explanation:
          'The DTR should be a dialogue, not a courtroom. When it feels like a demand or negotiation, it triggers defensiveness. When it feels like two people sharing honestly, it builds trust.',
      },
      {
        question:
          'Why is being honest about your intentions important, even if it might scare the other person away?',
        options: [
          'Because honesty is a moral obligation, regardless of consequences',
          'Because hiding your intentions to keep someone around means you\'re building a connection on a false foundation — and the truth always comes out eventually',
          'Because people always prefer directness to mystery',
          'It isn\'t important — strategic ambiguity keeps them interested longer',
        ],
        correctIndex: 1,
        explanation:
          'Authenticity filters for compatibility. If your real intentions scare someone off, they weren\'t right for you. Pretending to want something you don\'t just delays an inevitable mismatch.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 19 – Keeping the Spark
  // ──────────────────────────────────────────────
  {
    chapterId: 19,
    locale: 'en',
    questions: [
      {
        question:
          'You\'ve been in a relationship for a year and things feel routine. What\'s the most effective way to reignite the spark?',
        options: [
          'Accept that the spark always dies and settle into companionship',
          'Introduce novelty — try new experiences together, break routines, plan surprise dates, and keep growing individually',
          'Create drama and conflict to keep things exciting',
          'Spend more time apart so you miss each other',
        ],
        correctIndex: 1,
        explanation:
          'Novelty triggers dopamine, the same chemical responsible for early-relationship excitement. New shared experiences recreate that feeling of discovery together.',
      },
      {
        question:
          'What does relationship research say is the number one predictor of long-term relationship satisfaction?',
        options: [
          'Physical attraction',
          'Having the same hobbies',
          'The ratio of positive to negative interactions — maintaining at least 5 positive interactions for every 1 negative one',
          'Financial compatibility',
        ],
        correctIndex: 2,
        explanation:
          'John Gottman\'s research shows the 5:1 ratio of positive to negative interactions is the strongest predictor of relationship success. Small positive gestures matter enormously.',
      },
      {
        question:
          'Your partner mentions they\'ve always wanted to take a pottery class. What\'s the "keeping the spark" move?',
        options: [
          'Say "That\'s cool" and forget about it',
          'Sign up for one and tell them about it to make them jealous',
          'Remember it and surprise them by signing you both up — showing you listen and care about their interests',
          'Buy them a pottery set for Christmas and call it even',
        ],
        correctIndex: 2,
        explanation:
          'Remembering and acting on small wishes shows deep attentiveness. It says "I hear you, I care about what you want, and I want to experience it with you."',
      },
      {
        question:
          'Why does complacency kill relationships?',
        options: [
          'Because people get bored of each other\'s appearance',
          'Because when you stop putting in effort — planning dates, flirting, expressing appreciation — your partner starts feeling taken for granted',
          'Because relationships have a natural expiration date',
          'Complacency doesn\'t actually kill relationships — that\'s a myth',
        ],
        correctIndex: 1,
        explanation:
          'Relationships require ongoing investment. The biggest threat isn\'t conflict — it\'s the slow drift that happens when both people stop actively choosing each other.',
      },
      {
        question:
          'What\'s one simple daily habit that helps maintain long-term attraction?',
        options: [
          'Working out so you stay physically attractive',
          'Expressing genuine appreciation — telling your partner specifically what you value about them and not taking small things for granted',
          'Keeping some mystery by never fully opening up',
          'Making sure you always win arguments',
        ],
        correctIndex: 1,
        explanation:
          'Daily appreciation combats the "habituation effect" where we stop noticing good things. A specific "I love how you..." goes further than grand gestures.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Chapter 20 – The Graduation
  // ──────────────────────────────────────────────
  {
    chapterId: 20,
    locale: 'en',
    questions: [
      {
        question:
          'You\'ve completed all the chapters. A friend asks for your best dating advice. Which response shows you\'ve truly internalized the lessons?',
        options: [
          '"Just be yourself and the right person will come along"',
          '"Work on becoming someone you\'re proud of, develop genuine social skills, put yourself out there consistently, and treat every person with respect — dating is a skill, not just luck"',
          '"Use these specific lines I learned — they work every time"',
          '"Lower your standards and you\'ll find someone"',
        ],
        correctIndex: 1,
        explanation:
          'True graduation means understanding that dating success combines self-development, learnable skills, consistent action, and respect. It\'s not about tricks — it\'s about becoming a better person.',
      },
      {
        question:
          'Which concept ties together everything you\'ve learned across all chapters?',
        options: [
          'Physical attractiveness is all that really matters',
          'Authentic self-improvement combined with genuine interest in others — the skills are tools, but the foundation is real growth and real connection',
          'The right technique can make anyone fall for you',
          'Dating is a numbers game — approach enough people and someone will say yes',
        ],
        correctIndex: 1,
        explanation:
          'Every chapter reinforces the same core: improve yourself authentically, show genuine interest in others, and the techniques serve the connection — not the other way around.',
      },
      {
        question:
          'You\'re at a social event and everything comes together — confident body language, great conversation, genuine connection. But it doesn\'t lead to a phone number. Was it a failure?',
        options: [
          'Yes — if you didn\'t get a number, you failed',
          'No — the real success is who you\'ve become. Each interaction builds your skills whether it leads to a date or not',
          'It depends on how attractive the other person was',
          'Yes, because the whole point is getting dates',
        ],
        correctIndex: 1,
        explanation:
          'Outcome independence is the final lesson. When you detach your self-worth from specific results and focus on growth, dating becomes genuinely enjoyable rather than a source of anxiety.',
      },
      {
        question:
          'Now that you\'ve "graduated," what should your ongoing practice look like?',
        options: [
          'You\'re done — you\'ve learned everything you need to know',
          'Continue pushing yourself socially, reflect on interactions, stay curious about people, and keep growing — social skills are a lifelong practice',
          'Only practice when you\'re actively looking for a partner',
          'Teach others what you\'ve learned instead of practicing yourself',
        ],
        correctIndex: 1,
        explanation:
          'Social skills are like a muscle — they atrophy without use. The "graduation" is really the beginning of a lifelong practice of connection, growth, and genuine engagement with others.',
      },
      {
        question:
          'If you could only take ONE lesson from this entire program into your dating life, which would have the biggest impact?',
        options: [
          'The best opening lines to use on dating apps',
          'How to use power poses before dates',
          'Genuine curiosity about others combined with the courage to be authentically yourself — everything else is just tactics supporting these two fundamentals',
          'The three-second eye contact rule',
        ],
        correctIndex: 2,
        explanation:
          'Curiosity and authenticity are the two pillars everything else rests on. If you\'re genuinely interested in people and brave enough to be yourself, the specific techniques become natural extensions of who you are.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 21 – Das Fundament (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 21,
    locale: 'de',
    questions: [
      {
        question:
          'Bevor du anfängst zu daten, fragt dich ein Freund, was du eigentlich wirklich suchst. Dir fällt auf, dass du darüber noch nie richtig nachgedacht hast. Was solltest du zuerst tun?',
        options: [
          'Einfach eine Dating-App runterladen und schauen, was passiert',
          'Dir Zeit nehmen, über deine Werte nachzudenken und was dir bei einem Partner wirklich wichtig ist',
          'Deine Freunde fragen, was sie denken, was du brauchst',
          'Die Vorlieben von jemandem kopieren, den du bewunderst',
        ],
        correctIndex: 1,
        explanation:
          'Die eigenen Werte und Prioritäten zu kennen, bevor man datet, hilft dir, bewusste Entscheidungen zu treffen, statt in Beziehungen zu schlittern, die nicht zu dir passen.',
      },
      {
        question:
          'Du ziehst immer denselben Typ Partner an und die Beziehungen enden immer gleich. Was deutet dieses Muster am ehesten an?',
        options: [
          'Du hast einfach Pech in der Liebe',
          'Alle Menschen dieses Typs sind gleich',
          'Es gibt möglicherweise ein unbewusstes Muster in dem, was dich anzieht oder wie du dich in Beziehungen verhältst',
          'Du solltest komplett aufhören zu daten',
        ],
        correctIndex: 2,
        explanation:
          'Sich wiederholende Beziehungsmuster deuten meist auf unbewusste Vorlieben oder Verhaltensweisen hin. Selbstwahrnehmung hilft dir, diese Zyklen zu erkennen und zu durchbrechen.',
      },
      {
        question:
          'Warum ist es wichtig, die eigene Identität zu kennen, bevor man in die Dating-Welt eintaucht?',
        options: [
          'Damit du ein perfektes Dating-Profil erstellen kannst',
          'Weil Menschen mit starker Identität auf Social Media attraktiver wirken',
          'Damit du dich nicht selbst verlierst, indem du versuchst, jemand anderes\' Wunschbild zu werden',
          'Das ist nicht wichtig — du entdeckst dich selbst durch Beziehungen',
        ],
        correctIndex: 2,
        explanation:
          'Ein starkes Selbstbild verhindert, dass du dich ständig anpasst, um anderen zu gefallen — was langfristig zu Frustration und Unauthentizität führt.',
      },
      {
        question:
          'Du schreibst Tagebuch über deine Lebensziele und merkst, dass diese stark von den Erwartungen deiner Eltern geprägt sind. Was ist der gesündeste nächste Schritt?',
        options: [
          'Alles ablehnen, was deine Eltern wertschätzen — aus Prinzip',
          'Prüfen, welche dieser Werte wirklich zu dir passen und welche nicht',
          'Weiter ihren Erwartungen folgen, um Konflikte zu vermeiden',
          'Aufhören Tagebuch zu schreiben, weil es dich zum Überdenken bringt',
        ],
        correctIndex: 1,
        explanation:
          'Ein solides Fundament aufzubauen bedeutet, zwischen übernommenen und authentischen Werten zu unterscheiden. Überschneidungen sind normal — entscheidend ist die bewusste Wahl.',
      },
      {
        question:
          'Was beschreibt am besten ein starkes persönliches Fundament fürs Dating?',
        options: [
          'Ein hohes Einkommen und attraktives Aussehen',
          'Die eigenen Werte kennen, emotional stabil sein und ein Leben führen, das auch ohne Beziehung erfüllend ist',
          'Mindestens zehn Leute gedatet haben, damit man weiß, was man will',
          'Bereit sein, bei allem Kompromisse einzugehen, um einen Partner glücklich zu machen',
        ],
        correctIndex: 1,
        explanation:
          'Ein starkes Fundament kombiniert Selbsterkenntnis, emotionale Gesundheit und ein erfüllendes Leben. Das macht dich zu einem besseren Partner und hilft dir, bessere Partner zu wählen.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 22 – Deine Stimme (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 22,
    locale: 'de',
    questions: [
      {
        question:
          'Du erzählst bei einem Abendessen eine Geschichte und merkst, dass sich alle zu dir lehnen. Welche stimmliche Eigenschaft hält sie am ehesten bei der Stange?',
        options: [
          'So schnell wie möglich sprechen, um die Energie hochzuhalten',
          'Tempo und Tonlage variieren, um Spannung und Betonung zu erzeugen',
          'Einen gleichmäßigen Monoton beibehalten, um ruhig und souverän zu wirken',
          'So laut wie möglich sprechen, damit alle dich hören können',
        ],
        correctIndex: 1,
        explanation:
          'Stimmliche Abwechslung — Veränderungen in Tempo, Tonhöhe und Lautstärke — ist der wichtigste Faktor, um Zuhörer zu fesseln. Monotones Sprechen killt das Interesse sofort.',
      },
      {
        question:
          'Bei einem ersten Date in einem lauten Restaurant bittet dich dein Date ständig, dich zu wiederholen. Was solltest du anpassen?',
        options: [
          'Aus dem Zwerchfell sprechen und die Stimme projizieren, ohne zu schreien',
          'Dich vorbeugen und flüstern, um Intimität aufzubauen',
          'Lauter reden, indem du den Hals anstrengst',
          'Stattdessen per Handy texten — über den Tisch hinweg',
        ],
        correctIndex: 0,
        explanation:
          'Zwerchfellprojektion lässt dich klar gehört werden, ohne zu brüllen. Es klingt selbstbewusst und entspannt, während Halsanstrengung angespannt wirkt.',
      },
      {
        question:
          'Du merkst, dass du sehr schnell sprichst, wenn du nervös bist in Gegenwart von jemandem, den du attraktiv findest. Was ist die beste Strategie?',
        options: [
          'Bewusst langsamer werden und Pausen einbauen — sie signalisieren Selbstbewusstsein',
          'Weiter schnell reden, damit keine peinlichen Stille entsteht',
          'Einen Text auswendig lernen, damit du nicht spontan denken musst',
          'Vermeiden zu sprechen und die andere Person reden lassen',
        ],
        correctIndex: 0,
        explanation:
          'Langsamer werden und Pausen setzen strahlt ruhiges Selbstvertrauen aus. Schnelles Sprechen signalisiert Nervosität, während bewusstes Tempo zeigt, dass du dich wohlfühlst.',
      },
      {
        question:
          'Welchen Effekt hat „Upspeak" (Aussagen mit steigender Tonlage wie eine Frage beenden) typischerweise darauf, wie andere dich wahrnehmen?',
        options: [
          'Es lässt dich freundlich und nahbar klingen',
          'Es kann dich unsicher wirken lassen, als würdest du nach Bestätigung suchen',
          'Es hat keinen Einfluss auf die Wahrnehmung',
          'Es lässt dich autoritär und entschlossen klingen',
        ],
        correctIndex: 1,
        explanation:
          'Upspeak kann deine Wirkung untergraben und Aussagen wie Fragen klingen lassen. Sätze mit fallender Intonation zu beenden vermittelt Sicherheit.',
      },
      {
        question:
          'Du übst, deine stimmliche Präsenz zu verbessern. Welche tägliche Gewohnheit wäre am effektivsten?',
        options: [
          'Dich selbst beim Vorlesen aufnehmen und anhören, um Verbesserungsbereiche zu finden',
          'Nur sprechen, wenn es absolut nötig ist, um deine Stimme zu schonen',
          'Die Stimme eines Prominenten exakt imitieren',
          'Vor jedem Gespräch heißen Tee trinken',
        ],
        correctIndex: 0,
        explanation:
          'Dich selbst aufzunehmen und anzuhören ist eine der effektivsten Methoden zur Verbesserung. Du wirst schnell Gewohnheiten bemerken, die dir vorher nie aufgefallen sind.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 23 – Disziplin & Gewohnheiten (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 23,
    locale: 'de',
    questions: [
      {
        question:
          'Du willst dir angewöhnen, wöchentlich zu sozialen Events zu gehen, aber schwänzt ständig. Was ist laut Gewohnheitsforschung die beste Lösung?',
        options: [
          'Auf Willenskraft setzen und durchbeißen',
          'Es an eine bestehende Routine koppeln und mit einer kleineren Version starten — z. B. nur 30 Minuten hingehen',
          'Warten, bis du motiviert genug bist',
          'Dich sofort verpflichten, fünf Events pro Woche zu besuchen',
        ],
        correctIndex: 1,
        explanation:
          'Habit Stacking (neue Gewohnheiten an bestehende koppeln) und klein anfangen erhöhen die Durchhaltequote enorm. Willenskraft allein ist unzuverlässig.',
      },
      {
        question:
          'Du trainierst seit drei Wochen regelmäßig, aber heute hast du überhaupt keine Lust. Was ist der beste Ansatz, um deine Serie aufrechtzuerhalten?',
        options: [
          'Auslassen — ein Tag macht nichts',
          'Eine Minimalversion machen (auch nur 10 Minuten), um den Gewohnheitsloop aufrechtzuerhalten',
          'Morgen extra lang trainieren, um es auszugleichen',
          'Stattdessen zu einer komplett anderen Gewohnheit wechseln',
        ],
        correctIndex: 1,
        explanation:
          'Never-Zero-Days halten den Gewohnheitsloop intakt. Eine verkürzte Version hält die Konsistenz aufrecht — und die ist wichtiger als die Intensität einer einzelnen Einheit.',
      },
      {
        question:
          'Warum gilt Disziplin als wichtiger als Motivation, wenn es um Selbstverbesserung fürs Dating geht?',
        options: [
          'Weil Motivation immer verfügbar ist, wenn man sie braucht',
          'Weil Disziplin sicherstellt, dass du auch dann dranbleibst, wenn die Motivation nachlässt — und so dauerhafte Veränderung entsteht',
          'Weil disziplinierte Menschen attraktiver sind als motivierte',
          'Weil Motivation zu Burnout führt',
        ],
        correctIndex: 1,
        explanation:
          'Motivation schwankt, aber Disziplin schafft Systeme, die dich unabhängig davon voranbringen, wie du dich an einem bestimmten Tag fühlst.',
      },
      {
        question:
          'Du versuchst, bessere soziale Fähigkeiten aufzubauen. Welcher Ansatz zur Gewohnheitsbildung ist am effektivsten?',
        options: [
          'Ein vages Ziel setzen wie „geselliger sein"',
          'Eine konkrete, geplante Übung erstellen wie „jeden Dienstag und Donnerstag ein Gespräch mit einem Fremden im Café anfangen"',
          'Jeden Tag eine Stunde über soziale Fähigkeiten lesen, ohne zu üben',
          'Darauf warten, dass soziale Situationen von selbst zu dir kommen',
        ],
        correctIndex: 1,
        explanation:
          'Spezifische, zeitgebundene Gewohnheiten mit klaren Auslösern halten viel eher als vage Absichten. Implementierungsintentionen („Wenn X, dann mache ich Y") sind besonders wirkungsvoll.',
      },
      {
        question:
          'Nach zwei Monaten solidem Fortschritt fällt deine Routine eine ganze Woche lang aus. Was solltest du tun?',
        options: [
          'Aufgeben — du hast offensichtlich nicht das Zeug dazu',
          'Von vorne anfangen mit einem komplett neuen System',
          'Sofort wieder einsteigen ohne Selbstvorwürfe — Rückfälle sind normal, Aufgeben ist das einzige echte Scheitern',
          'Bis Neujahr warten, um es erneut zu versuchen',
        ],
        correctIndex: 2,
        explanation:
          'Rückfälle sind ein normaler Teil des Gewohnheitsaufbaus. Was erfolgreiche von erfolglosen Menschen unterscheidet, ist, wie schnell sie wieder auf Kurs kommen.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 24 – Präsenz & Umgangsformen (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 24,
    locale: 'de',
    questions: [
      {
        question:
          'Du bist auf einem Date und dein Handy vibriert mit einer Benachrichtigung. Wie sieht echte „Präsenz" aus?',
        options: [
          'Kurz draufschauen, ob es dringend ist, und dann wieder weglegen',
          'Dein Handy auf lautlos stellen und mit dem Display nach unten hinlegen (oder in der Tasche lassen) — für das gesamte Date deine volle Aufmerksamkeit schenken',
          'Offen draufschauen — die Person wird verstehen, dass du beschäftigt bist',
          'Dich auf die Toilette entschuldigen, um privat nachzuschauen',
        ],
        correctIndex: 1,
        explanation:
          'Echte Präsenz bedeutet, Ablenkungen zu eliminieren. Dein Handy wegzulegen signalisiert, dass die Person vor dir deine Priorität ist.',
      },
      {
        question:
          'Du triffst zum ersten Mal die Freunde deines Dates. Welches Verhalten zeigt am besten gute Umgangsformen und soziales Bewusstsein?',
        options: [
          'Das Gespräch dominieren, um interessant zu wirken',
          'Still bleiben und dein Date alles reden lassen',
          'Alle herzlich begrüßen, Namen merken, ehrliche Fragen stellen und auch ruhigere Personen ins Gespräch einbinden',
          'Dich voll darauf konzentrieren, dein Date zu beeindrucken, und die Freunde ignorieren',
        ],
        correctIndex: 2,
        explanation:
          'Gute Umgangsformen bedeuten, allen das Gefühl zu geben, gesehen und wertgeschätzt zu werden. Wie du die Freunde deines Dates behandelst, verrät viel über deinen Charakter.',
      },
      {
        question:
          'Warum ist eine gute Haltung in sozialen und Dating-Kontexten wichtig?',
        options: [
          'Sie ist nur für die Gesundheit wichtig, nicht für soziale Situationen',
          'Sie vermittelt Selbstbewusstsein, Offenheit und Selbstrespekt, noch bevor du ein Wort sagst',
          'Sie lässt dich größer aussehen — und nur das zählt',
          'Sie ist egal — Leute achten nur darauf, was du sagst',
        ],
        correctIndex: 1,
        explanation:
          'Haltung ist eines der ersten Dinge, die Menschen unbewusst wahrnehmen. Eine offene, aufrechte Haltung signalisiert Selbstvertrauen und Nahbarkeit.',
      },
      {
        question:
          'Du kommst für ein erstes Date in einem Restaurant an. Welches Grooming- und Etikette-Detail macht den stärksten positiven Eindruck?',
        options: [
          'Dein teuerstes Outfit tragen, egal ob es zum Ort passt',
          'Gepflegt, sauber, dem Anlass entsprechend gekleidet und pünktlich sein',
          'Starkes Parfüm oder Aftershave auftragen, damit man sich an dich erinnert',
          'Fashionably late erscheinen, um geheimnisvoll zu wirken',
        ],
        correctIndex: 1,
        explanation:
          'Angemessene Pflege und Pünktlichkeit zeigen Respekt gegenüber der anderen Person und dem Anlass. Overdressing oder Zuspätkommen signalisiert schlechtes Fingerspitzengefühl.',
      },
      {
        question:
          'Während eines Gesprächs ertappst du dich dabei, im Kopf schon deine nächste Antwort zu formulieren, statt zuzuhören. Was solltest du tun?',
        options: [
          'Weiter formulieren — eloquent zu sein ist wichtiger als zuzuhören',
          'Deine Aufmerksamkeit sanft zurück auf das lenken, was die andere Person sagt, und darauf vertrauen, dass deine Antwort von allein kommt',
          'Die Person unterbrechen, bevor du deinen Gedanken vergisst',
          'Komplett abschalten, weil du eh schon einen Teil verpasst hast',
        ],
        correctIndex: 1,
        explanation:
          'Präsenz bedeutet, bei den Worten der anderen Person zu bleiben, nicht bei deinem inneren Monolog. Vertraue darauf, dass echtes Zuhören zu authentischeren Antworten führt.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 25 – Soziale Praxis (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 25,
    locale: 'de',
    questions: [
      {
        question:
          'Du willst besser im Smalltalk werden, aber der Gedanke, Fremde anzusprechen, ist überwältigend. Wie fängst du am besten an?',
        options: [
          'Dich zwingen, an einem Tag 20 Fremde anzusprechen',
          'Mit Low-Stakes-Interaktionen starten — dem Barista danken, der Kassiererin ein Kompliment machen, mit dem Uber-Fahrer plaudern',
          'Gesprächsskripte vor dem Spiegel üben, bis sie perfekt sind',
          'Warten, bis deine Angst von allein verschwindet',
        ],
        correctIndex: 1,
        explanation:
          'Schrittweise Exposition durch unverbindliche Interaktionen baut deinen sozialen Muskel auf, ohne dein Nervensystem zu überfordern. Komfortzonen erweitern sich stückchenweise.',
      },
      {
        question:
          'Du bist auf einem Networking-Event und kennst niemanden. Was ist eine gute Strategie, um Gespräche zu starten?',
        options: [
          'An der Wand stehen und warten, bis jemand auf dich zukommt',
          'Jemand anderen suchen, der allein steht, und dich mit einer einfachen Beobachtung oder Frage zum Event vorstellen',
          'Eine Gruppe mitten im Gespräch unterbrechen, um dich vorzustellen',
          'Nach fünf Minuten gehen, weil es zu unangenehm ist',
        ],
        correctIndex: 1,
        explanation:
          'Andere Alleinsteher sind meist am offensten für ein Gespräch. Ein situationsbezogener Opener („Wie hast du von diesem Event erfahren?") wirkt ganz natürlich.',
      },
      {
        question:
          'Was ist der Hauptzweck davon, die eigene Komfortzone schrittweise zu erweitern?',
        options: [
          'Anderen zu beweisen, dass du mutig bist',
          'Toleranz für Unbehagen aufzubauen, damit Situationen, die einmal beängstigend waren, zur Normalität werden',
          'Beeindruckende Geschichten zu sammeln, die man auf Dates erzählen kann',
          'Soziale Ängste ein für alle Mal komplett zu eliminieren',
        ],
        correctIndex: 1,
        explanation:
          'Komfortzonen-Erweiterung funktioniert durch das Normalisieren von Unbehagen. Was sich heute furchtbar anfühlt, wird durch wiederholte Exposition zur Routine. Das Ziel ist nicht null Angst — sondern trotz Angst zu handeln.',
      },
      {
        question:
          'Du hast erfolgreich mit einem Fremden im Café geplaudert, aber das Gespräch war etwas holprig. Wie solltest du diese Erfahrung bewerten?',
        options: [
          'Als Misserfolg, weil es nicht smooth war',
          'Als Erfolg — du hast den schwierigsten Teil geschafft (den Anfang), und jeder Versuch baut deine Fähigkeiten aus',
          'Als Zeichen dafür, dass du nicht fürs Socializen gemacht bist',
          'Als Grund, dieses Café für immer zu meiden',
        ],
        correctIndex: 1,
        explanation:
          'Bei sozialer Übung IST der Versuch der Erfolg. Unbeholfenheit ist das natürliche Nebenprodukt von Wachstum, nicht der Beweis für Scheitern.',
      },
      {
        question:
          'Was ist der effektivste Weg, damit sich Smalltalk weniger gezwungen anfühlt?',
        options: [
          'Eine Liste interessanter Fakten auswendig lernen',
          'Echte Neugier auf die andere Person haben — fragen, was sie gerade macht, liest oder erlebt',
          'Jedes Gespräch auf Themen lenken, in denen du Experte bist',
          'Gespräche so kurz wie möglich halten, damit es gar nicht erst peinlich werden kann',
        ],
        correctIndex: 1,
        explanation:
          'Echte Neugier verwandelt Smalltalk von einer Performance in eine echte Interaktion. Menschen merken, ob du dich wirklich für sie interessierst oder nur ein Programm abspulst.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 1 – Der Spiegel (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 1,
    locale: 'de',
    questions: [
      {
        question:
          'Du bittest einen guten Freund um ehrliches Feedback zu deinem Dating-Leben und er sagt dir, dass du dazu neigst, zu viel über dich selbst zu reden. Wie reagierst du mit einer Wachstums-Mentalität?',
        options: [
          'Defensiv werden — der hat doch keine Ahnung',
          'Dich für die Ehrlichkeit bedanken und bei den nächsten Interaktionen auf die Balance im Gespräch achten',
          'Es abtun, weil er ja selbst Single ist',
          'Auf Dates komplett aufhören, über dich selbst zu reden',
        ],
        correctIndex: 1,
        explanation:
          'Ehrliche Selbsteinschätzung erfordert, harte Wahrheiten ohne Abwehr anzunehmen. Feedback sind Daten — die Wachstums-Mentalität nutzt sie, statt dagegen anzukämpfen.',
      },
      {
        question:
          'Warum gilt Selbstreflexion als der entscheidende erste Schritt, bevor man irgendeine Dating-Fähigkeit erlernt?',
        options: [
          'Weil es dich sofort attraktiver macht',
          'Weil du nicht reparieren kannst, was du nicht wahrnimmst — deinen Startpunkt zu kennen bestimmt den richtigen Weg',
          'Weil introspektive Menschen beliebter sind',
          'Es ist eigentlich nicht wichtig — Fähigkeiten zählen mehr als Selbstwahrnehmung',
        ],
        correctIndex: 1,
        explanation:
          'Selbstreflexion erstellt die Landkarte. Ohne zu wissen, wo du gerade stehst — deine Stärken, blinden Flecken und Muster — kannst du keinen effektiven Kurs planen.',
      },
      {
        question:
          'Du merkst, dass du jedes Mal, wenn eine Beziehung ernst wird, dich zurückziehst. Was bedeutet „in den Spiegel schauen" in diesem Zusammenhang?',
        options: [
          'Öfter dein Aussehen überprüfen',
          'Deine Partner beschuldigen, zu schnell vorzugehen',
          'Untersuchen, welche Ängste oder vergangene Erfahrungen dein Vermeidungsmuster antreiben könnten',
          'Entscheiden, dass du einfach nicht der Beziehungstyp bist',
        ],
        correctIndex: 2,
        explanation:
          'Die Spiegel-Metapher bedeutet, ehrlich nach innen zu schauen. Die eigenen Muster und deren Ursachen zu erkennen, ist der erste Schritt, um sie zu verändern.',
      },
      {
        question:
          'Welche Aussage spiegelt am besten eine Wachstums-Mentalität beim Dating wider?',
        options: [
          '„Ich bin einfach nicht von Natur aus charmant — manche haben es, manche nicht"',
          '„Ich bin noch nicht da, wo ich sein will, aber soziale Fähigkeiten kann man lernen und mit Übung verbessern"',
          '„Wenn mich jemand nicht mag, stimmt mit der Person etwas nicht"',
          '„Ich muss meine Persönlichkeit komplett neu erfinden"',
        ],
        correctIndex: 1,
        explanation:
          'Eine Wachstums-Mentalität sieht soziale und Dating-Fähigkeiten als erlernbar, nicht als feste Eigenschaften. Das Wort „noch" ist kraftvoll — es impliziert, dass Fortschritt kommt.',
      },
      {
        question:
          'Du hast deine ehrliche Selbsteinschätzung aufgeschrieben. Auf welchen Bereich solltest du dich zuerst konzentrieren?',
        options: [
          'Deine größte Schwäche, egal wie schwer sie zu ändern ist',
          'Etwas, worin du schon gut bist, um dein Selbstvertrauen zu stärken',
          'Einen bedeutsamen Bereich, in dem eine kleine Verbesserung den größten positiven Einfluss auf dein Dating-Leben hätte',
          'Was auch immer deine Freunde gerade verbessern',
        ],
        correctIndex: 2,
        explanation:
          'Priorisiere wirkungsvolle, erreichbare Verbesserungen. Die größte Schwäche direkt anzugehen kann entmutigend sein, während strategische Erfolge Schwung aufbauen.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 2 – Selbstvertrauens-Bootcamp (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 2,
    locale: 'de',
    questions: [
      {
        question:
          'Du stehst kurz davor, auf eine Party zu gehen, wo du niemanden kennst. Welcher Ansatz baut echtes Selbstvertrauen auf?',
        options: [
          'Fake it till you make it — tu so, als wärst du jemand anderes',
          'Dich an vergangene soziale Erfolge erinnern, aufrecht stehen und dir ein kleines, erreichbares Ziel setzen wie „Ich stelle mich drei Leuten vor"',
          'Vorher ein paar Drinks nehmen, um die Nervosität zu beruhigen',
          'In der Nähe des Ausgangs bleiben, falls du schnell gehen musst',
        ],
        correctIndex: 1,
        explanation:
          'Echtes Selbstvertrauen entsteht durch Beweise der eigenen Kompetenz plus kleine erreichbare Ziele. Sich an vergangene Erfolge erinnern und machbare Ziele setzen hält dich geerdet.',
      },
      {
        question:
          'Was ist die Beziehung zwischen Körpersprache und Selbstvertrauen?',
        options: [
          'Körpersprache spiegelt nur Selbstvertrauen wider — sie kann es nicht erzeugen',
          'Körpersprache spiegelt UND beeinflusst deinen inneren Zustand — aufrecht stehen kann dich tatsächlich selbstbewusster fühlen lassen',
          'Körpersprache ist irrelevant; nur deine Worte zählen',
          'Selbstbewusste Körpersprache lässt dich arrogant wirken',
        ],
        correctIndex: 1,
        explanation:
          'Forschung zeigt, dass die Geist-Körper-Verbindung in beide Richtungen funktioniert. Eine selbstbewusste Haltung (offene Stellung, Schultern zurück, Kopf hoch) sendet Feedback-Signale, die deinen emotionalen Zustand tatsächlich verändern.',
      },
      {
        question:
          'Ein Freund sagt: „Man wird entweder selbstbewusst geboren oder nicht." Warum stimmt das nicht?',
        options: [
          'Es stimmt tatsächlich — Selbstvertrauen ist genetisch',
          'Weil Selbstvertrauen eine Fähigkeit ist, die durch wiederholte Konfrontation mit unbequemen Situationen aufgebaut wird — keine feste Persönlichkeitseigenschaft',
          'Weil jeder selbstbewusst geboren wird — manche verlieren es einfach',
          'Weil Selbstvertrauen von externer Bestätigung kommt, die jeder bekommen kann',
        ],
        correctIndex: 1,
        explanation:
          'Selbstvertrauen wird durch Handeln und Erfahrung aufgebaut, nicht vererbt. Jeder sozial versierte Mensch hat irgendwo angefangen, und die meisten mussten sich durch Unbehagen kämpfen.',
      },
      {
        question:
          'Du merkst, dass du dich bei der Arbeit selbstbewusst fühlst, aber beim Dating völlig die Fassung verlierst. Was sagt dir das?',
        options: [
          'Du bist ein Hochstapler und dein berufliches Selbstvertrauen ist fake',
          'Dating ist grundsätzlich schwieriger als Arbeit und du solltest aufgeben',
          'Selbstvertrauen ist kontextabhängig — du kannst es beim Dating genauso aufbauen wie bei der Arbeit: durch Übung und Kompetenz',
          'Du solltest nur Leute vom Arbeitsplatz daten',
        ],
        correctIndex: 2,
        explanation:
          'Selbstvertrauen überträgt sich oft nicht zwischen verschiedenen Bereichen. Die gute Nachricht: Der gleiche Prozess, der dich bei der Arbeit selbstbewusst gemacht hat — wiederholte Übung und kleine Erfolge — funktioniert auch beim Dating.',
      },
      {
        question:
          'Was ist ein Beispiel für eine „Power Pose", die du vor einem Date nutzen könntest, um dein Selbstvertrauen zu stärken?',
        options: [
          'Arme und Beine verschränken, um dich geschützt zu fühlen',
          'Hüftbreit stehen, Hände in die Hüften, Brust raus — für zwei Minuten',
          'Über dein Handy gebeugt sitzen',
          'Schnell hin und her laufen',
        ],
        correctIndex: 1,
        explanation:
          'Expansive Haltungen, die Raum einnehmen (wie die „Wonder Woman"-Pose), steigern nachweislich das Machtgefühl und reduzieren Stresshormone.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 3 – Die Kunst des Blickkontakts (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 3,
    locale: 'de',
    questions: [
      {
        question:
          'Du bist in einer Bar und stellst Blickkontakt mit jemandem auf der anderen Seite des Raums her. Die Person hält deinen Blick etwa drei Sekunden lang und lächelt. Was bedeutet das höchstwahrscheinlich?',
        options: [
          'Sie starrt auf etwas hinter dir',
          'Sie fordert dich zu einem Kampf heraus',
          'Sie signalisiert Offenheit, angesprochen zu werden — das ist eine klassische Einladung',
          'Das bedeutet nichts; Leute schauen einfach zufällig umher',
        ],
        correctIndex: 2,
        explanation:
          'Anhaltender Blickkontakt (ca. 3 Sekunden) plus ein Lächeln ist eines der stärksten nonverbalen Signale. Es ist ein bewusstes Zeichen, kein Zufall.',
      },
      {
        question:
          'Wie setzt man Blickkontakt idealerweise in einem Vier-Augen-Gespräch ein?',
        options: [
          'Ununterbrochen in die Augen starren, um Intensität zu zeigen',
          'Etwa 60-70 % der Zeit Blickkontakt halten und gelegentlich natürlich wegschauen',
          'Blickkontakt vermeiden, um zu zeigen, dass du gut zuhörst',
          'Nur schauen, wenn du sprichst, nicht wenn die andere Person spricht',
        ],
        correctIndex: 1,
        explanation:
          'Die 60-70 %-Regel schafft Verbindung ohne Unbehagen. Gelegentlich den Blick natürlich abzuwenden verhindert, dass es sich wie Starren anfühlt.',
      },
      {
        question:
          'Du neigst dazu, auf den Boden zu schauen, wenn du mit attraktiven Menschen sprichst. Wie verbesserst du das am besten?',
        options: [
          'Dich vom ersten Tag an zwingen, intensiven Blickkontakt zu halten',
          'Schrittweise üben — zunächst einige Sekunden Blickkontakt mit Kassierern und Baristas halten und dann steigern',
          'Eine Sonnenbrille tragen, damit man nicht sieht, wohin du schaust',
          'Stattdessen auf die Stirn schauen — sie werden den Unterschied nicht merken',
        ],
        correctIndex: 1,
        explanation:
          'Wie jede Fähigkeit verbessert sich Blickkontakt durch schrittweises Üben. Alltägliche Low-Stakes-Interaktionen sind das perfekte Trainingsfeld.',
      },
      {
        question:
          'Was ist der Unterschied zwischen selbstbewusstem Blickkontakt und Starren?',
        options: [
          'Es gibt keinen Unterschied — mehr Blickkontakt ist immer besser',
          'Selbstbewusster Blickkontakt ist warm, entspannt und enthält natürliche Pausen; Starren ist fixiert, intensiv und wird nicht unterbrochen',
          'Starren ist einfach Blickkontakt von jemandem, den du nicht attraktiv findest',
          'Selbstbewusster Blickkontakt dauert genau fünf Sekunden, Starren ab sechs',
        ],
        correctIndex: 1,
        explanation:
          'Die Qualität zählt mehr als die Dauer. Weicher, warmer Blickkontakt mit natürlichen Pausen wirkt selbstbewusst und einladend. Starrer, ungebrochener Fokus wirkt bedrohlich.',
      },
      {
        question:
          'Du bist auf einem ersten Date und bemerkst, dass dein Date immer wieder den Blickkontakt bricht und nach unten schaut. Was könnte das bedeuten?',
        options: [
          'Die Person ist definitiv nicht an dir interessiert',
          'Sie ist unhöflich und hört nicht zu',
          'Sie könnte nervös oder schüchtern sein — das bedeutet nicht zwingend Desinteresse, besonders wenn sie immer wieder zurückschaut',
          'Sie ist gelangweilt und will gehen',
        ],
        correctIndex: 2,
        explanation:
          'Nach unten schauen kann ein Zeichen von Schüchternheit oder Nervosität sein, nicht nur von Desinteresse. Wenn die Person immer wieder den Blick sucht, ist sie wahrscheinlich interessiert, aber ängstlich.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 4 – Gespräche starten (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 4,
    locale: 'de',
    questions: [
      {
        question:
          'Du bist in einem Café und bemerkst, dass jemand ein Buch liest, das du liebst. Wie startest du am besten ein Gespräch?',
        options: [
          '„Entschuldigung, ich hab gesehen, dass du [Titel] liest — ich fand das Buch großartig. Wie findest du es bisher?"',
          '„Hey, bist du Single?"',
          '„Das Buch ist furchtbar, du solltest was anderes lesen"',
          'Dich schweigend daneben setzen und hoffen, dass die Person dich bemerkt',
        ],
        correctIndex: 0,
        explanation:
          'Situationsbezogene Opener, die sich auf etwas Echtes im Moment beziehen, fühlen sich natürlich an und geben der anderen Person eine einfache Möglichkeit zu antworten. Sie schaffen sofort ein gemeinsames Thema.',
      },
      {
        question:
          'Warum sind offene Fragen besser als Ja/Nein-Fragen, wenn man ein Gespräch beginnt?',
        options: [
          'Sind sie nicht — Ja/Nein-Fragen sind effizienter',
          'Sie lassen dich klüger klingen',
          'Sie laden die andere Person ein, mehr zu teilen, erzeugen natürlichen Gesprächsfluss und zeigen echtes Interesse',
          'Sie verwirren Leute, damit sie länger reden',
        ],
        correctIndex: 2,
        explanation:
          'Offene Fragen („Was hat dich hierher geführt?" statt „Kommst du öfter her?") geben Menschen Raum zum Erzählen und machen es leichter, Anknüpfungspunkte zu finden.',
      },
      {
        question:
          'Du stehst in der Schlange im Supermarkt. Welcher Gesprächseinstieg fühlt sich am natürlichsten an?',
        options: [
          'Einen auswendig gelernten Anmachspruch aufsagen',
          'Eine Beobachtung über die gemeinsame Situation machen: „Diese Schlange ist irreal — ich glaube, wir sind hier lang genug, um Freunde zu werden"',
          'Sofort nach der Handynummer fragen',
          'Den Körper der anderen Person komplimentieren',
        ],
        correctIndex: 1,
        explanation:
          'Beobachtungen über eine geteilte Erfahrung sind die natürlichsten Opener, weil sie relevant, druckfrei und sofort verbindend sind.',
      },
      {
        question:
          'Was ist der größte Fehler, den Leute machen, wenn sie versuchen, mit Fremden ein Gespräch anzufangen?',
        options: [
          'Keinen witzigen genug Einstieg parat haben',
          'Es zu sehr überdenken — die Worte sind viel weniger wichtig als deine Ausstrahlung, dein Timing und deine Bereitschaft, den ersten Schritt zu machen',
          'Nicht attraktiv genug sein',
          'Zu freundlich sein',
        ],
        correctIndex: 1,
        explanation:
          'Die meisten Leute starten nie das Gespräch, weil sie auf den perfekten Satz warten. In Wirklichkeit schlägt eine warme, selbstbewusste Ausführung eines durchschnittlichen Openers einen perfekten Satz, der nervös vorgetragen wird.',
      },
      {
        question:
          'Du startest ein Gespräch und die andere Person gibt kurze Ein-Wort-Antworten. Was solltest du tun?',
        options: [
          'Weiter Fragen stellen — die Person wird sich schon aufwärmen',
          'Es als Hinweis nehmen, dass sie gerade nicht reden möchte, und elegant austeigen: „Na dann, nett geplaudert — schönen Tag noch!"',
          'Beleidigt sein und sagen, dass sie unhöflich ist',
          'Zu einem persönlicheren Thema wechseln, um sie zu engagieren',
        ],
        correctIndex: 1,
        explanation:
          'Desinteresse-Signale zu respektieren ist eine zentrale soziale Fähigkeit. Ein eleganter Abgang wahrt deine Würde und ihren Komfort. Nicht jeder ist gerade gesprächsbereit, und das ist okay.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 5 – Der Approach (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 5,
    locale: 'de',
    questions: [
      {
        question:
          'Du siehst jemanden in einer Buchhandlung, mit dem du gern reden würdest. Die Person stöbert allein und schaut sich gelegentlich um. Ist das ein gutes „Approach-Fenster"?',
        options: [
          'Nein — die Person shoppt und will nicht gestört werden',
          'Ja — sie ist allein, wirkt offen für die Umgebung und befindet sich in einem entspannten sozialen Setting',
          'Nur wenn sie zuerst Blickkontakt mit dir herstellt',
          'Nur wenn du das gleiche Buch kaufst',
        ],
        correctIndex: 1,
        explanation:
          'Gute Approach-Fenster sind: Die Person ist allein oder in einer kleinen Gruppe, in einer sozialfreundlichen Umgebung, wirkt entspannt und ist nicht tief in etwas vertieft.',
      },
      {
        question:
          'Was ist das wichtigste Element eines erfolgreichen Approachs?',
        options: [
          'Den perfekten Eröffnungssatz vorbereitet haben',
          'Groß und konventionell attraktiv sein',
          'Deine Ausstrahlung und Körpersprache — mit ruhiger, positiver Energie und offener Körperhaltung auf jemanden zugehen',
          'Von hinten kommen, damit die Person dich nicht kommen sieht',
        ],
        correctIndex: 2,
        explanation:
          'Energie überträgt sich. Wenn du mit Wärme, Ruhe und einem echten Lächeln auf jemanden zugehst, spiegelt die andere Person das. Nervöse, zögerliche Energie erzeugt unbequeme Interaktionen.',
      },
      {
        question:
          'Jemand sitzt in einem Café mit Kopfhörern und tippt konzentriert auf dem Laptop. Solltest du die Person ansprechen?',
        options: [
          'Ja — Kopfhörer sind keine echte Barriere',
          'Ja, aber nur wenn die Person attraktiv genug ist, um die Störung zu rechtfertigen',
          'Nein — Kopfhörer und konzentriertes Arbeiten sind klare Signale, dass sie nicht gestört werden möchte',
          'Ja, aber klopf ihr zuerst auf die Schulter',
        ],
        correctIndex: 2,
        explanation:
          'Soziale Signale lesen beinhaltet auch zu erkennen, wenn jemand NICHT angesprochen werden will. Kopfhörer plus konzentrierte Arbeit ist ein klares „Bitte nicht stören"-Signal.',
      },
      {
        question:
          'Du sprichst jemanden an und die Person scheint anfangs offen, gibt dann aber kürzere Antworten und schaut aufs Handy. Was passiert hier?',
        options: [
          'Sie spielt hart-to-get — bleib dran',
          'Sie testet deine Beharrlichkeit',
          'Sie signalisiert, dass das Gespräch seinen Lauf genommen hat — es ist Zeit, elegant zu gehen',
          'Ihr Handy ist interessanter — nimm es ihr spielerisch weg, um ihre Aufmerksamkeit zurückzugewinnen',
        ],
        correctIndex: 2,
        explanation:
          'Nachlassendes Engagement (kürzere Antworten, Handy checken, abgewandte Körperhaltung) bedeutet, dass es Zeit ist, elegant zu gehen. Über diese Signale hinauszugehen macht Approaches unangenehm.',
      },
      {
        question:
          'Nach einem angenehmen Approach und kurzem Gespräch — wie beendest du es am besten?',
        options: [
          'So lange wie möglich weiterreden, um die Verbindung zu maximieren',
          'Auf einem Höhepunkt gehen, solange die Energie noch gut ist: „Ich muss los, aber ich würde gern weitersprechen — kann ich deine Nummer haben?"',
          'Einfach weggehen ohne etwas zu sagen, um geheimnisvoll zu wirken',
          'Die Person bitten, sofort mit dir woanders hinzugehen',
        ],
        correctIndex: 1,
        explanation:
          'Auf einem Höhepunkt zu gehen hinterlässt eine positive Erinnerung. Zu lange zu bleiben tötet die Energie. Ein selbstbewusster, klarer Abschluss („Kann ich deine Nummer haben?") ist direkt und respektvoll.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 6 – Den Raum lesen (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 6,
    locale: 'de',
    questions: [
      {
        question:
          'Du kommst auf einer Hausparty an. Was solltest du tun, bevor du dich in Gespräche stürzt?',
        options: [
          'Sofort die attraktivste Person finden und ansprechen',
          'Dir ein paar Minuten nehmen, um den Raum zu beobachten — wer ist offen, wer ist in geschlossenen Gruppen, wie ist die allgemeine Stimmung',
          'Direkt zum Getränketisch gehen und warten, dass Leute auf dich zukommen',
          'Anfangen, laut zu reden, um die Aufmerksamkeit aller zu bekommen',
        ],
        correctIndex: 1,
        explanation:
          'Den Raum zu lesen, bevor man handelt, gibt dir eine soziale Landkarte. Du erkennst offene Gruppen, verfügbare Einzelpersonen und die allgemeine Stimmung — all das hilft dir bei deinem Approach.',
      },
      {
        question:
          'Du willst dich an einer Gruppenunterhaltung auf einer Party beteiligen. Wie erkennst du, ob die Gruppe „offen" oder „geschlossen" ist?',
        options: [
          'Das kann man nicht erkennen — einfach reingehen',
          'Eine offene Gruppe steht in lockerer Formation mit Lücken zwischen den Leuten; eine geschlossene Gruppe steht eng zusammen mit nach innen gerichteten Körpern',
          'Eine geschlossene Gruppe ist immer lauter als eine offene',
          'Gruppen mit mehr als drei Personen sind immer offen',
        ],
        correctIndex: 1,
        explanation:
          'Die Körpersprache der Gruppe verrät die Offenheit. Lockere Formationen mit Lücken (wie eine Hufeisenform) laden Neuankömmlinge ein. Enge Kreise mit nach innen gerichteten Körpern signalisieren ein privates Gespräch.',
      },
      {
        question:
          'Während eines Dates im Restaurant verschränkt dein Date die Arme, lehnt sich zurück und stellt den Blickkontakt ein, nachdem du ein bestimmtes Thema angesprochen hast. Was solltest du daraus lesen?',
        options: [
          'Ihr ist kalt und sie braucht eine Jacke',
          'Nichts — Körpersprache bedeutet nichts',
          'Die Person fühlt sich bei diesem Thema wahrscheinlich unwohl — wechsle geschmeidig zu etwas Leichterem',
          'Sie fordert dich heraus, deine Meinung stärker zu verteidigen',
        ],
        correctIndex: 2,
        explanation:
          'Verschlossene Körpersprache (verschränkte Arme, Zurücklehnen, fehlender Blickkontakt) als Reaktion auf ein Thema ist ein starkes Signal für Unbehagen. Sozial bewusste Menschen wechseln natürlich das Thema.',
      },
      {
        question:
          'Was bedeutet „soziale Kalibrierung"?',
        options: [
          'Berechnen, mit wie vielen Leuten du auf einem Event sprechen solltest',
          'Deine Energie, Themen und dein Verhalten an den Kontext und die Menschen um dich herum anpassen',
          'Immer die lauteste Person im Raum sein',
          'Unabhängig von der Situation denselben Approach haben',
        ],
        correctIndex: 1,
        explanation:
          'Soziale Kalibrierung bedeutet, Signale zu lesen und sich in Echtzeit anzupassen. Die Energie, die du in eine ruhige Weinbar bringst, sollte sich von der einer lauten Rooftop-Party unterscheiden.',
      },
      {
        question:
          'Du bist auf einem Networking-Event und siehst jemanden, der allein steht, den Raum scannt und eine offene Körperhaltung hat. Was bedeutet das wahrscheinlich?',
        options: [
          'Die Person will allein gelassen werden',
          'Sie wartet auf jemand Bestimmtes',
          'Sie ist offen dafür, angesprochen zu werden, und würde ein Gespräch wahrscheinlich begrüßen',
          'Sie ist im Begriff zu gehen',
        ],
        correctIndex: 2,
        explanation:
          'Offene Körpersprache plus Raum-Scannen ist ein Signal sozialer Verfügbarkeit. Das sind die einfachsten und empfänglichsten Personen zum Ansprechen auf jedem Event.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 7 – Aktives Zuhören (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 7,
    locale: 'de',
    questions: [
      {
        question:
          'Dein Date erwähnt, dass es kürzlich einen Halbmarathon gelaufen ist. Welche Antwort zeigt aktives Zuhören?',
        options: [
          '„Cool. Also jedenfalls, ich bin voll auf CrossFit im Moment..."',
          '„Das ist beeindruckend! Was hat dich dazu gebracht, das anzugehen? Wie hat es sich angefühlt, die Ziellinie zu überqueren?"',
          '„Das könnte ich nie — ich hasse Laufen"',
          '„Ja, mein Freund hat auch mal so einen gemacht"',
        ],
        correctIndex: 1,
        explanation:
          'Aktives Zuhören bedeutet, auf das Gesagte mit relevanten Folgefragen einzugehen, die echte Neugier zeigen. Es gibt dem Sprecher das Gefühl, wertgeschätzt zu werden, und vertieft die Verbindung.',
      },
      {
        question:
          'Was ist der größte Unterschied zwischen Hören und aktivem Zuhören?',
        options: [
          'Es gibt keinen Unterschied — es ist dasselbe',
          'Hören ist passiv; aktives Zuhören beinhaltet volle Aufmerksamkeit, Bedeutungsverarbeitung und eine Antwort, die Verständnis zeigt',
          'Aktives Zuhören bedeutet, alles Wort für Wort zu wiederholen',
          'Aktives Zuhören bedeutet, die ganze Zeit still zu sein',
        ],
        correctIndex: 1,
        explanation:
          'Hören passiert automatisch. Aktives Zuhören ist bewusst — es beinhaltet Fokus, Verarbeitung und eine Reaktion, die Verständnis und Anteilnahme demonstriert.',
      },
      {
        question:
          'Dein Date erzählt dir von einem schwierigen Tag auf der Arbeit. Was ist das Wirkungsvollste, das du tun kannst?',
        options: [
          'Sofort Lösungen für die Probleme anbieten',
          'Eine Geschichte von einem schlimmeren Tag erzählen, den du hattest, um die Sache in Perspektive zu setzen',
          'Richtig zuhören, die Gefühle validieren („Das klingt echt frustrierend") und fragen, ob die Person sich auskotzen will oder einen Rat möchte',
          'Das Thema wechseln zu etwas Positivem',
        ],
        correctIndex: 2,
        explanation:
          'Oft wollen Menschen gehört werden, nicht „repariert". Erst die Emotionen zu validieren und dann zu fragen, wie du reagieren sollst, zeigt emotionale Intelligenz.',
      },
      {
        question:
          'Du merkst, dass du während einer Geschichte deines Dates abgeschweift bist. Wie rettest du die Situation am besten?',
        options: [
          'Nicken und so tun, als hättest du alles gehört',
          'Ehrlich sein: „Sorry, ich war gerade kurz abgelenkt — kannst du noch mal zurückgehen? Ich will das richtig hören"',
          'Das Thema wechseln, damit es nicht auffällt',
          'Einen generischen Kommentar machen wie „Wow, das ist ja krass"',
        ],
        correctIndex: 1,
        explanation:
          'Ehrlichkeit über einen kurzen Aussetzer ist respektvoller als so zu tun, als hätte man zugehört. Es zeigt, dass dir die vollständige Geschichte wichtig genug ist, um nachzufragen.',
      },
      {
        question:
          'Welche Körpersprache-Signale zeigen jemandem, dass du aktiv zuhörst?',
        options: [
          'Zurücklehnen mit verschränkten Armen',
          'Regelmäßig auf die Uhr schauen',
          'Sich leicht nach vorn lehnen, gelegentlich nicken, Blickkontakt halten und eine offene Haltung haben',
          'Intensiv starren, ohne dich zu bewegen',
        ],
        correctIndex: 2,
        explanation:
          'Aktives Zuhören hat eine körperliche Komponente. Sich vorbeugen, nicken und Blickkontakt signalisieren Engagement. Diese Signale ermutigen den Sprecher und bauen Rapport auf.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 8 – Humor & Schlagfertigkeit (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 8,
    locale: 'de',
    questions: [
      {
        question:
          'Du bist auf einem ersten Date und der Kellner bringt dir das falsche Gericht. Welche Art von Humor funktioniert hier am besten?',
        options: [
          'Den Kellner wütend verspotten, um dominant zu wirken',
          'Eine leichte, spielerische Beobachtung machen: „Na, das Universum findet wohl, ich sollte heute mal was Neues probieren"',
          'Es komplett ignorieren — Humor ist auf ersten Dates riskant',
          'Einen sarkastischen Kommentar machen, um witzig zu wirken',
        ],
        correctIndex: 1,
        explanation:
          'Leichter, situationsbezogener Humor, der niemanden angreift, ist die sicherste und attraktivste Art. Er zeigt, dass du locker bist und mit unerwarteten Momenten umgehen kannst.',
      },
      {
        question:
          'Was ist der Hauptunterschied zwischen Selbstironie, die funktioniert, und Selbstironie, die nach hinten losgeht?',
        options: [
          'Selbstironie funktioniert nie — immer vermeiden',
          'Gute Selbstironie ist selbstbewusst und spielerisch (MIT sich selbst lachen); schlechte Selbstironie offenbart echte Unsicherheit',
          'Es hängt nur davon ab, wie attraktiv du bist',
          'Selbstironie funktioniert immer, weil sie Demut zeigt',
        ],
        correctIndex: 1,
        explanation:
          'Die Grenze ist Selbstvertrauen. „Ich hab mal versucht zu kochen — die Feuerwehr hat mich gebeten, bei Reservierungen zu bleiben" ist spielerisch. Sich ständig selbst runtermachen signalisiert Unsicherheit, nicht Humor.',
      },
      {
        question:
          'Dein Date macht einen Witz und du findest ihn nicht lustig. Was ist die beste Reaktion?',
        options: [
          'Ein großes Lachen vortäuschen, um die Person glücklich zu machen',
          'Sagen, dass der Witz nicht lustig war',
          'Ein echtes Lächeln zeigen, vielleicht ein leichtes Schmunzeln, und das Gespräch weiterführen — du musst keine Hysterie vortäuschen',
          'Sofort versuchen, den Witz mit einem besseren zu toppen',
        ],
        correctIndex: 2,
        explanation:
          'Eine warme, ehrliche Reaktion ist immer besser als eine falsche. Du kannst den Humor-Versuch einer Person anerkennen, ohne ein Lachen zu erzwingen. Authentizität zählt mehr als Performance.',
      },
      {
        question:
          'Warum gilt Timing als das wichtigste Element von Humor?',
        options: [
          'Weil derselbe Witz zum falschen Zeitpunkt beleidigend sein kann oder ins Leere läuft, während perfektes Timing selbst einfache Beobachtungen urkomisch macht',
          'Weil man genau 3 Sekunden warten muss, bevor man die Pointe bringt',
          'Timing ist eigentlich egal — der Inhalt des Witzes ist alles',
          'Weil man in jeder Situation immer der Erste sein sollte, der einen Witz macht',
        ],
        correctIndex: 0,
        explanation:
          'Comedy lebt von Überraschung und Kontext. Die lustigsten Menschen sind nicht die mit den besten Witzen — es sind die, die das Richtige im richtigen Moment sagen.',
      },
      {
        question:
          'Du willst auf Dates lustiger sein. Was ist der effektivste Weg, deinen Humor zu entwickeln?',
        options: [
          'Witze aus dem Internet auswendig lernen und im Gespräch verwenden',
          'Beobachtungshumor im Alltag üben — das Absurde in gewöhnlichen Momenten bemerken und spielerisch kommentieren lernen',
          'Comedy-Specials schauen und die Witze des Comedians wörtlich wiederholen',
          'Immer „on" sein — nie einen ernsten Moment haben',
        ],
        correctIndex: 1,
        explanation:
          'Der beste Gesprächshumor ist beobachtend und spontan. Dich zu trainieren, witzige Dinge im Alltag zu bemerken, baut den Muskel für natürliche Schlagfertigkeit auf.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 9 – Das Kompliment (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 9,
    locale: 'de',
    questions: [
      {
        question:
          'Du willst jemandem ein Kompliment machen, den du gerade auf einer Dinnerparty kennengelernt hast. Welches Kompliment ist am wirkungsvollsten?',
        options: [
          '„Du bist die heißeste Person hier"',
          '„Ich fand toll, wie du die Geschichte über deine Reise erzählt hast — du hast echt ein Talent für Geschichten"',
          '„Du hast wunderschöne Augen"',
          '„Du bist total aus meiner Liga"',
        ],
        correctIndex: 1,
        explanation:
          'Spezifische Komplimente über den Charakter, die Fähigkeiten oder Entscheidungen einer Person sind viel wirkungsvoller als generische Äußerlichkeits-Komplimente. Sie zeigen, dass du wirklich aufmerksam bist.',
      },
      {
        question:
          'Was macht ein Kompliment ehrlich statt creepy?',
        options: [
          'Es so oft wie möglich sagen, damit die Person weiß, dass man es ernst meint',
          'Es ist spezifisch, kontextangemessen, wird beiläufig ohne Erwartung einer Gegenleistung gegeben und bezieht sich auf etwas Gewähltes (Stil, Fähigkeit, Humor) statt nur auf den Körper',
          'Intensiven Blickkontakt halten und es flüstern',
          'Es ist unmöglich zu kontrollieren — manche finden Komplimente immer creepy',
        ],
        correctIndex: 1,
        explanation:
          'Die Schlüsselfaktoren sind: Spezifität (nicht generisch), Kontextangemessenheit, keine Hintergedanken und Fokus auf Entscheidungen/Handlungen statt auf Körperteile. Die Umsetzung sollte natürlich, nicht intensiv sein.',
      },
      {
        question:
          'Du machst jemandem ein Kompliment und die Person wehrt es ab mit „Ach, das war doch nichts." Was solltest du tun?',
        options: [
          'Das Kompliment lauter wiederholen, damit die Person es annimmt',
          'Streiten, warum sie das Kompliment annehmen sollte',
          'Es natürlich stehen lassen — nicht drängen. Ein einfaches „Ich find schon" mit einem Lächeln reicht',
          'Es zurücknehmen, weil sie offenbar keine Komplimente will',
        ],
        correctIndex: 2,
        explanation:
          'Viele Menschen fühlen sich unwohl dabei, Komplimente anzunehmen. Eine kurze, selbstbewusste Bekräftigung ohne Druck respektiert ihre Reaktion und steht trotzdem zu dem, was du gesagt hast.',
      },
      {
        question:
          'Wann ist der SCHLECHTESTE Zeitpunkt, jemandem ein Kompliment zu machen?',
        options: [
          'Wenn die Person gerade etwas erreicht hat',
          'In einem natürlichen Moment der Verbindung im Gespräch',
          'Direkt nachdem sie etwas getan hat, was du willst (wirkt manipulativ), oder wenn ein Machtgefälle die Person in eine unangenehme Lage bringt',
          'Am Anfang eines Dates',
        ],
        correctIndex: 2,
        explanation:
          'Timing und Kontext zählen. Komplimente, die wie Einschmeicheln für einen Gefallen wirken, fühlen sich manipulativ an, und Komplimente in bestimmten Machtdynamiken (Chef an Mitarbeiter) können sich aufgezwungen anfühlen.',
      },
      {
        question:
          'Was ist ein Beispiel für ein „Spezifitäts-Upgrade" — ein generisches Kompliment in ein großartiges verwandeln?',
        options: [
          '„Du siehst gut aus" zu „Du siehst ECHT gut aus" ändern',
          '„Du bist lustig" zu „Wie du die Geschichte vom Flughafen erzählt hast, da hab ich echt Tränen gelacht — dein komödiantisches Timing ist unglaublich" ändern',
          '„Nettes Outfit" zu „Nettes Outfit, war bestimmt teuer" ändern',
          '„Du bist hübsch" zu „Du bist die hübscheste Person, die ich je gesehen hab" ändern',
        ],
        correctIndex: 1,
        explanation:
          'Spezifität macht ein Kompliment von vergesslich zu unvergesslich. Einen bestimmten Moment oder ein Detail zu benennen zeigt, dass du wirklich aufmerksam warst.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 10 – Digitales Spiel (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 10,
    locale: 'de',
    questions: [
      {
        question:
          'Du erstellst ein Online-Dating-Profil. Welche Foto-Strategie funktioniert am besten?',
        options: [
          'Nur Selfies, inklusive mehrerer Badezimmerspiegel-Aufnahmen',
          'Ein Mix aus Fotos: ein klares Gesichtsfoto mit echtem Lächeln, ein Ganzkörperfoto und spontane Aufnahmen von dir bei Aktivitäten, die du magst',
          'Nur Gruppenfotos, damit du beliebt wirkst',
          'Stark gefilterte Fotos, die dich deutlich anders aussehen lassen als in echt',
        ],
        correctIndex: 1,
        explanation:
          'Vielfalt, Authentizität und Klarheit sind entscheidend. Ein klares Gesichtsfoto schafft Vertrauen, ein Ganzkörperfoto setzt ehrliche Erwartungen, und Aktivitätsfotos zeigen deine Persönlichkeit.',
      },
      {
        question:
          'Du matchst mit jemandem auf einer Dating-App. Welche erste Nachricht wird am ehesten beantwortet?',
        options: [
          '„Hey"',
          '„Du bist wunderschön"',
          'Ein spezifischer Kommentar oder eine Frage zu etwas in deren Profil: „Ich seh, du bist beim Klettern — warst du schon draußen an echten Felsen oder bist du eher der Hallentyp?"',
          'Ein kopierter Anmachspruch, den du an jedes Match schickst',
        ],
        correctIndex: 2,
        explanation:
          'Personalisierte Nachrichten, die sich auf etwas Spezifisches im Profil beziehen, zeigen, dass du dir wirklich angeschaut hast, wer die Person ist. Das erhöht die Antwortrate dramatisch im Vergleich zu generischen Openern.',
      },
      {
        question:
          'Du schreibst seit einer Woche mit jemandem online und es läuft gut. Wann solltest du ein Treffen vorschlagen?',
        options: [
          'Nach der ersten Nachricht',
          'Nachdem sich etwas Rapport aufgebaut hat (ein paar Tage gutes Gespräch) — so etwas wie „Ich find unsere Unterhaltung echt gut. Hast du Lust, am Wochenende auf einen Kaffee?"',
          'Nie — online ist sicherer',
          'Erst nach mindestens einem Monat täglichem Schreiben',
        ],
        correctIndex: 1,
        explanation:
          'Der Sweet Spot liegt nach genug Rapport für ein gutes Gefühl, aber bevor das Gespräch einschläft. Langes Schreiben ohne Treffen führt oft zu Fantasie-Verbindungen, die der Realität nicht standhalten.',
      },
      {
        question:
          'Was ist der größte Fehler, den Leute in ihren Dating-Profilen machen?',
        options: [
          'Auf den Fotos nicht attraktiv genug sein',
          'Generisch sein — Sachen auflisten wie „Ich liebe Reisen, Essen und Lachen", die auf fast jeden zutreffen',
          'Zu ehrlich über die eigene Persönlichkeit sein',
          'Zu wenige Fotos haben',
        ],
        correctIndex: 1,
        explanation:
          'Spezifität macht dich unvergesslich. „Ich liebe Essen" ist vergesslich. „Ich bin auf der Mission, die besten Birria-Tacos in jeder Stadt zu finden" gibt jemandem etwas, woran er anknüpfen kann.',
      },
      {
        question:
          'Dein Match schlägt vor, sich bei ihm/ihr zuhause für ein erstes Date zu treffen. Was ist die beste Antwort?',
        options: [
          'Zustimmen — die Person bevorzugt wahrscheinlich eine chillige Atmosphäre',
          'Stattdessen einen öffentlichen Ort vorschlagen: „Ich würd dich voll gern treffen! Wie wäre es mit dem Café in der Innenstadt? Ich glaub, das wäre ein super Spot"',
          'Ghosten — das ist eine Red Flag und bedeutet, die Person ist gefährlich',
          'Zustimmen, aber einen Freund mitbringen',
        ],
        correctIndex: 1,
        explanation:
          'Erste Treffen sollten immer an öffentlichen Orten stattfinden — aus Sicherheitsgründen. Auf einen öffentlichen Ort umzulenken ist Standardpraxis, und jede vernünftige Person wird das verstehen und respektieren.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 11 – Das erste Date (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 11,
    locale: 'de',
    questions: [
      {
        question:
          'Du planst ein erstes Date. Welche Option schafft die beste Umgebung für eine echte Verbindung?',
        options: [
          'Ein teures Feinschmecker-Restaurant, um Eindruck zu schinden',
          'Ein Kinofilm — damit du nicht reden musst',
          'Ein lockeres, entspanntes Setting wie ein Café, ein Spaziergang oder eine gemütliche Bar, wo Gespräche leicht fallen',
          'Eine Adrenalin-Aktivität wie Fallschirmspringen, um aufregend zu wirken',
        ],
        correctIndex: 2,
        explanation:
          'Beim ersten Date geht es ums Kennenlernen. Lockere Settings mit einfachem Gesprächsfluss schlagen teure oder aktivitätslastige Optionen, die überwältigend sein können oder echte Verbindung verhindern.',
      },
      {
        question:
          'Du bist wahnsinnig nervös vor einem ersten Date. Welche Strategie ist am effektivsten?',
        options: [
          'Vorher ein paar Drinks nehmen, um lockerer zu werden',
          'Dir klarmachen, dass ein Date nur ein Gespräch ist — es umrahmen als „Ich finde heraus, ob ich diese Person mag"',
          'Das Date absagen — wenn du so nervös bist, bist du nicht bereit',
          'Eine Liste von Gesprächsthemen auswendig lernen, damit dir nie der Stoff ausgeht',
        ],
        correctIndex: 1,
        explanation:
          'Ein Date von „Performance" zu „Entdeckung" umzudeuten reduziert den Druck enorm. Du bewirbst dich nicht — du erkundest gegenseitige Kompatibilität.',
      },
      {
        question:
          'Welches Thema solltest du auf einem ersten Date generell NICHT vertiefen?',
        options: [
          'Hobbys und Leidenschaften der anderen Person',
          'Ausführliche Geschichten über deine Ex-Beziehungen',
          'Was die Person beruflich macht und ob sie es mag',
          'Ein spannendes Reiseerlebnis',
        ],
        correctIndex: 1,
        explanation:
          'Ausgiebig über Ex-Partner zu reden auf einem ersten Date signalisiert, dass du die Vergangenheit vielleicht nicht verarbeitet hast. Heb solche Gespräche auf, bis ihr euch besser kennt. Erste Dates sollten nach vorn schauen.',
      },
      {
        question:
          'Das Date läuft super und ihr habt eine tolle Zeit. Wann solltest du es beenden?',
        options: [
          'Gar nicht — so lange wie möglich weitermachen',
          'Nach genau einer Stunde, egal was',
          'Solange die Energie noch hoch ist — auf einem positiven Punkt aufzuhören, lässt die Person mehr wollen',
          'Erst wenn der Laden schließt',
        ],
        correctIndex: 2,
        explanation:
          'Gehen, solange die Stimmung gut ist, hinterlässt einen positiven letzten Eindruck und Vorfreude aufs nächste Mal. Zu lange zu bleiben kann die Energie abflachen lassen.',
      },
      {
        question:
          'Dein Date sagt etwas, dem du nicht zustimmst. Wie gehst du auf einem ersten Date am besten damit um?',
        options: [
          'Bei allem zustimmen, um Konflikte zu vermeiden',
          'Eine hitzige Debatte starten, um zu zeigen, dass du starke Meinungen hast',
          'Deine andere Sichtweise respektvoll und neugierig äußern: „Interessant — ich seh das etwas anders. Ich denke... Was bringt dich zu deiner Sicht?"',
          'Sofort das Thema wechseln',
        ],
        correctIndex: 2,
        explanation:
          'Respektvolle Meinungsverschiedenheit zeigt, dass du Rückgrat hast und gleichzeitig offen bist. Blinde Zustimmung ist langweilig und hitzige Debatten erzeugen Spannung. Neugier überbrückt die Kluft.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 12 – Gesprächsfluss (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 12,
    locale: 'de',
    questions: [
      {
        question:
          'Das Gespräch kommt zum Stillstand und eine unangenehme Stille breitet sich aus. Wie belebst du es am besten wieder?',
        options: [
          'In Panik geraten und übers Wetter reden',
          'Das Letzte aufgreifen, was die Person erwähnt hat: „Nochmal zu dem, was du über Kochen lernen gesagt hast — was hat dich dazu inspiriert?"',
          'Die Person anstarren, bis sie etwas sagt',
          'Dein Handy rausholen, um die Stille zu füllen',
        ],
        correctIndex: 1,
        explanation:
          'Rückbezüge (auf frühere Themen zurückkommen) fühlen sich natürlich an und zeigen, dass du zugehört hast. Sie sind eines der einfachsten Werkzeuge, um den Gesprächsfluss wiederzubeleben.',
      },
      {
        question:
          'Was ist „Conversational Threading" und warum ist es so mächtig?',
        options: [
          'Bei einem Thema bleiben, bis es komplett erschöpft ist',
          'Die verschiedenen Themen aufgreifen, die in einer Aussage stecken, und auswählen, welchem Faden du folgst — es lässt Gespräche mühelos wirken und dir geht nie der Stoff aus',
          'Die eigenen Geschichten in jedes Gespräch einflechten',
          'Nur über vorher vorbereitete Themen reden',
        ],
        correctIndex: 1,
        explanation:
          'Jeder Satz enthält mehrere mögliche Fäden. „Ich bin gerade aus Italien zurück, mit meiner Schwester" enthält Fäden über Reisen, Italien, die Schwester und mehr.',
      },
      {
        question:
          'Du merkst, dass du seit fünf Minuten am Stück über dich selbst redest. Was solltest du tun?',
        options: [
          'Weitermachen — deine Geschichte ist echt interessant',
          'Mitten im Satz aufhören und sagen „Sorry, ich schwafle"',
          'Geschmeidig zurück zur anderen Person lenken: „Aber genug von mir — ich bin neugierig, hast du schon mal sowas erlebt?"',
          'Schweigen, um es auszugleichen',
        ],
        correctIndex: 2,
        explanation:
          'Die besten Gesprächspartner achten auf das Redeverhältnis. Mit einer verwandten Frage zurück zur anderen Person zu lenken fühlt sich natürlich an und zeigt, dass dir ein beidseitiger Austausch wichtig ist.',
      },
      {
        question:
          'Welche Technik hilft, den „Interview-Modus" zu vermeiden (schnelle Feuerfragen, die sich wie ein Verhör anfühlen)?',
        options: [
          'Noch mehr Fragen stellen, damit es sich gesprächig anfühlt',
          'Zwischen den Fragen einen kurzen verwandten Gedanken oder eine Geschichte teilen — ein Geben und Nehmen statt nur Fragen',
          'Nur eine Frage pro Stunde stellen',
          'Aufhören Fragen zu stellen und nur noch Aussagen machen',
        ],
        correctIndex: 1,
        explanation:
          'Interview-Modus entsteht, wenn du Fragen stellst, ohne selbst etwas zu teilen. Die Lösung: abwechseln — fragen, etwas Verwandtes teilen, dann wieder fragen. Das erzeugt natürlichen Rhythmus.',
      },
      {
        question:
          'Wie wechselst du am besten zwischen nicht verwandten Themen, ohne dass es abrupt wirkt?',
        options: [
          '„Egal, total random, aber..." — einfach den Wechsel erzwingen',
          'Überbrückungsphrasen verwenden, die zum neuen Thema hinführen: „Das erinnert mich an..." oder „Apropos Abenteuer, ich wollte dich mal fragen..."',
          'Warten, bis die andere Person das Thema wechselt',
          'Das geht nicht smooth — Themenwechsel sind immer awkward',
        ],
        correctIndex: 1,
        explanation:
          'Überbrückungsphrasen schaffen eine logische Verbindung zwischen Themen, auch wenn der Zusammenhang nur locker ist. Sie lassen Übergänge absichtlich statt zufällig wirken.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 13 – Berührung & Nähe (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 13,
    locale: 'de',
    questions: [
      {
        question:
          'Du bist auf einem zweiten Date und überlegst, körperlichen Kontakt zu initiieren. Wie geht man bei der Eskalation richtig vor?',
        options: [
          'Direkt zum Kuss übergehen, um Selbstbewusstsein zu zeigen',
          'Mit beiläufigen, sozialen Berührungen anfangen (kurze Berührung am Arm beim Lachen) und basierend auf positiver Reaktion schrittweise steigern',
          'Die Person überhaupt nicht berühren, bis sie explizit darum bittet',
          'Vor jedem Kontakt um Erlaubnis fragen — „Darf ich deinen Arm berühren?"',
        ],
        correctIndex: 1,
        explanation:
          'Körperliche Eskalation sollte schrittweise und reaktionsbasiert sein. Klein anfangen (Arm, Schulter) und die Reaktion beobachten. Wenn die Person sich nähert oder erwidert, kannst du natürlich weitergehen.',
      },
      {
        question:
          'Du berührst leicht den Arm deines Dates und die Person zieht sich subtil zurück. Was solltest du tun?',
        options: [
          'Nochmal versuchen — die Person hat es wahrscheinlich nicht bemerkt',
          'Das Signal respektieren, indem du natürlich zurückweichst, ohne es peinlich zu machen oder Aufmerksamkeit darauf zu lenken',
          'Fragen, warum die Person sich zurückgezogen hat',
          'Die Person den Rest des Dates nicht mehr berühren und beleidigt wirken',
        ],
        correctIndex: 1,
        explanation:
          'Zurückweichen ist ein klares Grenzsignal. Die respektvolle Reaktion ist, den körperlichen Kontakt natürlich zu reduzieren, ohne ein Thema daraus zu machen. Nicht nachfragen, nicht schmollen — einfach anpassen.',
      },
      {
        question:
          'Was bedeutet „Komfort lesen" im Kontext von körperlicher Nähe?',
        options: [
          'Sicherstellen, dass die Sitze bequem sind',
          'Darauf achten, ob sich jemand nähert (komfortabel) oder Distanz schafft (unkomfortabel) als Reaktion auf deine Nähe',
          'Die Person bitten, ihren Komfort auf einer Skala von 1-10 zu bewerten',
          'Davon ausgehen, dass alle dasselbe Komfortlevel mit Berührung haben',
        ],
        correctIndex: 1,
        explanation:
          'Komfort wird durch Körpersprache kommuniziert. Sich nähern, dir zugewandt sein und entspannte Haltung signalisieren Komfort. Sich zurücklehnen, verschränkte Arme und Anspannung signalisieren Unbehagen.',
      },
      {
        question:
          'Warum gilt das Respektieren körperlicher Grenzen als attraktiv statt als schwach?',
        options: [
          'Ist es nicht — Leute respektieren Kühnheit mehr',
          'Weil es emotionale Intelligenz, Selbstkontrolle und echten Respekt zeigt — Eigenschaften, die tiefes Vertrauen und Sicherheit aufbauen',
          'Weil es rechtliche Probleme vermeidet',
          'Es ist nur wichtig, wenn die andere Person dir sagt, dass sie Grenzen hat',
        ],
        correctIndex: 1,
        explanation:
          'Menschen fühlen sich am meisten zu denen hingezogen, bei denen sie sich sicher fühlen. Grenzen zu lesen und zu respektieren zeigt, dass du aufmerksam bist, Kontrolle hast und gegenseitigen Komfort priorisierst — das ist zutiefst attraktiv.',
      },
      {
        question:
          'Welche Sitzanordnung auf einem Date schafft die beste Gelegenheit für natürlichen körperlichen Kontakt?',
        options: [
          'Direkt gegenüber an einem breiten Tisch sitzen',
          'Nebeneinander oder im 90-Grad-Winkel sitzen — nah genug für beiläufigen Kontakt',
          'So weit wie möglich auseinander sitzen, um Grenzen zu respektieren',
          'Es ist egal, wo man sitzt',
        ],
        correctIndex: 1,
        explanation:
          'Nebeneinander oder im 90-Grad-Winkel zu sitzen schafft natürlich Nähe und Gelegenheiten für beiläufigen Kontakt (Schulterberührung, sich näherlehnen), die sich organisch statt erzwungen anfühlen.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 14 – Mit Ablehnung umgehen (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 14,
    locale: 'de',
    questions: [
      {
        question:
          'Du fragst jemanden nach der Nummer und die Person lehnt höflich ab. Was ist die beste Reaktion?',
        options: [
          '„Warum nicht? Gib mir eine Chance — du kennst mich doch noch gar nicht"',
          '„Kein Ding — war nett, mit dir zu plaudern. Schönen Abend noch!" und mit einem echten Lächeln weggehen',
          'Fragen, ob es jemand anderen gibt oder was du falsch gemacht hast',
          'Sichtbare Enttäuschung zeigen, damit die Person sich schuldig fühlt und es sich nochmal überlegt',
        ],
        correctIndex: 1,
        explanation:
          'Elegant mit Ablehnung umzugehen ist eines der attraktivsten Dinge, die du zeigen kannst. Es signalisiert Selbstvertrauen, Respekt und emotionale Reife — und Menschen bemerken das.',
      },
      {
        question:
          'Nach einer Ablehnung spielst du die Situation immer wieder im Kopf durch und fühlst dich schrecklich. Was ist der gesündeste Perspektivwechsel?',
        options: [
          '„Ich werde mich nie wieder raustrauen"',
          '„Ablehnung ist Information, kein Urteil. Die Person hat zu dieser Interaktion Nein gesagt, nicht zu meinem Wert als Mensch. Kompatibilität ist eine Zweibahnstraße"',
          '„Die hat einfach keinen Geschmack"',
          '„Ich muss mich komplett verändern"',
        ],
        correctIndex: 1,
        explanation:
          'Ablehnung spiegelt Kompatibilität wider, nicht deinen Wert. Ablehnung als persönliches Versagen zu verinnerlichen führt zu Vermeidung. Sie als neutrale Daten zu sehen hält dich widerstandsfähig und offen für neue Versuche.',
      },
      {
        question:
          'Ein Freund sagt: „Hör einfach auf, dir was draus zu machen, dann tut Ablehnung auch nicht weh." Warum ist dieser Rat wenig hilfreich?',
        options: [
          'Weil Ablehnung tatsächlich dieselben Gehirnareale aktiviert wie physischer Schmerz — es SOLL wehtun',
          'Weil man zum Soziopathen wird, wenn es einem egal ist',
          'Weil sich etwas aus Ablehnung zu machen eigentlich ein Zeichen von Stärke ist',
          'Dieser Rat stimmt eigentlich',
        ],
        correctIndex: 0,
        explanation:
          'Neurowissenschaft zeigt, dass Ablehnung buchstäblich Schmerzareale aktiviert. Das Ziel ist nicht, nichts zu fühlen — es ist, Resilienz zu entwickeln, damit du dich schneller erholst und dich nicht aufhalten lässt.',
      },
      {
        question:
          'Du wurdest mehrmals hintereinander abgelehnt und dein Selbstvertrauen wackelt. Was ist das Produktivste, was du tun kannst?',
        options: [
          'Sofort weitermachen und Leute ansprechen, bis du ein Ja bekommst',
          'Eine kurze Pause einlegen zum Aufladen, reflektieren ob du etwas verbessern kannst, mit unterstützenden Freunden reden und dann wieder rausgehen',
          'Schlussfolgern, dass du grundsätzlich unattraktiv bist',
          'Zu einer anderen Dating-App wechseln und auf bessere Ergebnisse hoffen',
        ],
        correctIndex: 1,
        explanation:
          'Selbstfürsorge nach einer Pechsträhne ist wichtig. Konstruktiv (nicht destruktiv) reflektieren, sich auf sein Umfeld stützen und zurückkehren, wenn man aufgeladen ist. Durchhalten ohne Selbstfürsorge führt zu Burnout.',
      },
      {
        question:
          'Was ist der beste Weg, „aus Ablehnung zu lernen", ohne in Selbstkritik abzurutschen?',
        options: [
          'Jedes Detail der Interaktion obsessiv analysieren',
          'Nie wieder daran denken',
          'Dir eine konstruktive Frage stellen: „Gibt es etwas, das ich nächstes Mal anders machen würde?" — dann die Antwort akzeptieren und weitermachen',
          'Die Person, die dich abgelehnt hat, um detailliertes Feedback bitten',
        ],
        correctIndex: 2,
        explanation:
          'Eine fokussierte Reflexionsfrage zieht die Lektion heraus, ohne die Spirale. Oft ist die Antwort „nichts — es hat einfach nicht gepasst." Und das ist eine völlig valide Antwort.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 15 – Das Follow-Up (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 15,
    locale: 'de',
    questions: [
      {
        question:
          'Du hattest gerade ein tolles erstes Date. Wann solltest du schreiben?',
        options: [
          'Genau drei Tage warten, um nicht zu eager zu wirken',
          'Noch am selben Abend oder am nächsten Morgen eine kurze, warme Nachricht schicken: „Ich hatte einen echt schönen Abend. Lass uns das bald wiederholen!"',
          'Warten, bis die andere Person zuerst schreibt',
          'Einen langen Absatz schreiben, wie toll die Person ist',
        ],
        correctIndex: 1,
        explanation:
          'Die „Drei-Tage-Regel" ist veraltet. Eine ehrliche, druckfreie Nachricht am selben Abend oder nächsten Tag signalisiert Selbstvertrauen und Interesse. Über das Timing nachzugrübeln macht es schlimmer.',
      },
      {
        question:
          'Du schreibst mit jemandem nach einem Date und die Person braucht Stunden zum Antworten. Was solltest du tun?',
        options: [
          'Doppelt oder dreifach nachschreiben, um sicherzugehen, dass die Nachricht gesehen wurde',
          'Deren allgemeines Tempo matchen — Menschen haben ein Leben. Interpretiere Antwortzeiten am Anfang nicht über',
          'Die Person konfrontieren wegen der langsamen Antworten',
          'Auf die nächste Nachricht sofort antworten, um zu zeigen, dass du mehr Interesse hast',
        ],
        correctIndex: 1,
        explanation:
          'Angst wegen Antwortzeiten ist normal, aber meist übertrieben. Leute arbeiten, schlafen und sind beschäftigt. Deren Tempo ungefähr zu matchen vermeidet, zu eager oder spielerisch zu wirken.',
      },
      {
        question:
          'Was ist der Hauptzweck von Texten zwischen Dates?',
        options: [
          'Die tiefstmöglichen Gespräche per Text zu führen',
          'Interesse und Rapport aufrechterhalten und das nächste persönliche Treffen planen — die tiefen Sachen fürs echte Gespräch aufheben',
          'So häufig wie möglich schreiben, damit die Person dich nicht vergisst',
          'Testen, ob die andere Person genauso interessiert ist wie du',
        ],
        correctIndex: 1,
        explanation:
          'Texten dient am besten als Brücke zwischen echten Treffen. Leichte, warme Nachrichten, die die Verbindung halten und aufs nächste Date hinarbeiten, sind ideal. Versuch nicht, eine Beziehung per Text aufzubauen.',
      },
      {
        question:
          'Du willst die Person zu einem zweiten Date einladen. Welcher Ansatz ist am besten?',
        options: [
          '„Willst du vielleicht nochmal irgendwann was machen... wenn du magst... kein Druck"',
          '„Ich wollte schon immer mal diesen Thai-Laden ausprobieren — hast du Donnerstagabend Zeit?"',
          '„Wir sollten unbedingt mal wieder was machen"',
          'Warten, bis die andere Person das nächste Date vorschlägt',
        ],
        correctIndex: 1,
        explanation:
          'Konkrete Pläne mit einem festen Zeitpunkt zeigen Initiative und Selbstvertrauen. Vage Vorschläge („Wir sollten mal...") überlassen die Arbeit der anderen Person und führen oft ins Leere.',
      },
      {
        question:
          'Nach zwei Dates wird kein drittes geplant und die Nachrichten werden weniger. Was ist der gesündeste Ansatz?',
        options: [
          'Mehr Nachrichten schicken, um das Interesse wieder zu entfachen',
          'Eine klare, druckfreie Nachricht schicken: „Hey, ich hab es genossen, dich kennenzulernen. Hast du Lust, dich nochmal zu treffen, oder passt es nicht? So oder so, alles gut"',
          'Thirst Traps auf Social Media posten, um die Person daran zu erinnern, was sie verpasst',
          'Auf der Arbeit der Person auftauchen, um ein „ehrliches Gespräch" zu führen',
        ],
        correctIndex: 1,
        explanation:
          'Direkte, emotional reife Kommunikation schneidet durch Ambiguität. Es gibt der Person einen einfachen Ausweg, falls kein Interesse besteht, und zeigt, dass du sicher genug bist, die Antwort zu akzeptieren.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 16 – Verbindung aufbauen (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 16,
    locale: 'de',
    questions: [
      {
        question:
          'Du datest jemanden seit ein paar Wochen und die Gespräche bleiben oberflächlich. Wie vertiefst du die Verbindung am besten?',
        options: [
          'Verlangen, dass die Person sich über ihre Gefühle öffnet',
          'Selbst vorangehen, indem du etwas Verletzliches über dich teilst — Verletzlichkeit lädt zu Verletzlichkeit ein',
          'Alles locker halten — tiefe Gespräche passieren von selbst nach Monaten',
          'Direkt fragen, warum die Person ihre Gefühle nicht teilt',
        ],
        correctIndex: 1,
        explanation:
          'Verletzlichkeit ist reziprok. Wenn du etwas Bedeutungsvolles über dich teilst, schaffst du psychologische Sicherheit, damit die andere Person dasselbe tun kann. Du musst den ersten Schritt machen.',
      },
      {
        question:
          'Was ist der Unterschied zwischen Verletzlichkeit und Oversharing?',
        options: [
          'Es gibt keinen Unterschied — jedes Teilen ist gut',
          'Verletzlichkeit ist bewusstes Teilen, das Verbindung schafft; Oversharing ist unverarbeitetes emotionales Gewicht auf jemanden abladen, bevor Vertrauen aufgebaut ist',
          'Verletzlichkeit ist für Beziehungen; Oversharing für Freundschaften',
          'Oversharing ist einfach Verletzlichkeit, für die andere Leute nicht bereit sind',
        ],
        correctIndex: 1,
        explanation:
          'Verletzlichkeit ist dem Vertrauenslevel in der Beziehung angemessen und dient der Verbindung. Oversharing ignoriert das Komfortlevel der anderen Person und dient oft dem eigenen Verarbeitungsbedürfnis, nicht der Beziehung.',
      },
      {
        question:
          'Dein Date teilt eine schwierige persönliche Erfahrung mit dir. Welche Reaktion baut die tiefste Verbindung auf?',
        options: [
          'Sofort eine eigene ähnliche Erfahrung teilen, um sich zu identifizieren',
          'Richtig zuhören, den Mut anerkennen, die Gefühle validieren und eine durchdachte Rückfrage stellen — Raum für DEREN Erfahrung halten, bevor du den Fokus verschiebst',
          'Ratschläge geben, wie man das Problem lösen kann',
          'Das Thema zu etwas Leichterem wechseln, um die Spannung zu lösen',
        ],
        correctIndex: 1,
        explanation:
          'Wenn jemand verletzlich ist, braucht die Person zuerst das Gefühl, gehört zu werden. Zur eigenen Geschichte springen, reparieren oder ablenken verschieben alle den Fokus. Raum halten ist die verbindendste Reaktion.',
      },
      {
        question:
          'Welche Rolle spielen „tiefergehende Fragen" beim Aufbau emotionaler Intimität?',
        options: [
          'Sie lassen dich intellektuell und beeindruckend wirken',
          'Sie überspringen oberflächlichen Smalltalk und enthüllen Werte, Träume, Ängste und Erfahrungen — die Dinge, die echte Bindung schaffen',
          'Sie sind manipulativ — du versuchst, Informationen zu sammeln, die du später nutzen kannst',
          'Sie funktionieren nur, wenn man bereits in einer Beziehung ist',
        ],
        correctIndex: 1,
        explanation:
          'Fragen wie „Was ist etwas, worauf du richtig stolz bist, das die meisten Leute nicht wissen?" oder „Was hat dich zu dem Menschen gemacht, der du heute bist?" beschleunigen Intimität, indem sie zum wahren Kern einer Person vordringen.',
      },
      {
        question:
          'Du möchtest dich deinem Partner näher fühlen, bist aber nicht von Natur aus emotional. Was kannst du tun?',
        options: [
          'Akzeptieren, dass du nie gut in emotionaler Verbindung sein wirst',
          'Üben, die eigenen Emotionen zu erkennen und zu benennen, kleine Wahrheiten über deine Gefühle teilen und deinem Partner bedeutungsvolle Fragen stellen — emotionale Fähigkeiten sind erlernbar',
          'Alles als Gedanken statt als Gefühle ausdrücken — „Ich denke, das ist nett" statt „Ich freue mich darüber"',
          'Deinen Partner die ganze emotionale Arbeit in der Beziehung machen lassen',
        ],
        correctIndex: 1,
        explanation:
          'Emotionale Intelligenz ist eine Fähigkeit, keine Eigenschaft. Klein anfangen (eigene Emotionen benennen, teilen, wie etwas dich hat fühlen lassen) baut den Muskel über die Zeit auf.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 17 – Signale lesen (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 17,
    locale: 'de',
    questions: [
      {
        question:
          'Dein Date findet ständig Gründe, deinen Arm zu berühren, ist dir direkt zugewandt und stellt viele Fragen über dein Leben. Was sind das für Signale?',
        options: [
          'Die Person ist einfach höflich',
          'Klare Interessenssignale — Berührung initiieren, volle Körperorientierung zu dir hin und Neugier auf dich sind starke Anzeichen für Anziehung',
          'Die Person versucht, dir etwas zu verkaufen',
          'Diese Signale bedeuten für sich allein nichts',
        ],
        correctIndex: 1,
        explanation:
          'Interesse wird durch Signalbündel kommuniziert: Berührung initiieren, zugewandte Körpersprache, anhaltender Blickkontakt, persönliche Fragen stellen und Gründe finden, in deiner Nähe zu sein.',
      },
      {
        question:
          'Jemand, an dem du interessiert bist, ist persönlich warm, braucht aber Tage zum Antworten auf Nachrichten und plant nie Treffen. Welches Signal solltest du lesen?',
        options: [
          'Die Person ist definitiv interessiert — sie ist ja warm, wenn ihr euch seht!',
          'Das Verhalten zeigt gemischte Signale — wenn Worte und Taten nicht zusammenpassen, achte mehr auf konsistente Verhaltensmuster (besonders Einsatz und Initiative)',
          'Die Person spielt hart-to-get und du solltest stärker hinterherlaufen',
          'Textgewohnheiten sagen nichts über Interesse aus',
        ],
        correctIndex: 1,
        explanation:
          'Gemischte Signale bedeuten meist lauwarmes Interesse. Der zuverlässigste Indikator ist nicht eine einzelne Interaktion — es ist das Muster von Einsatz und Initiative über die Zeit.',
      },
      {
        question:
          'Was bedeutet es, wenn jemand auf deine Avancen mit „Vielleicht" oder „Mal schauen" antwortet?',
        options: [
          'Die Person gibt sich geheimnisvoll, um Anziehung aufzubauen',
          'In den meisten Fällen ist „Vielleicht" ein sanftes Nein — wenn jemand begeistert ist, ist die Antwort meist ein klares Ja',
          'Die Person ist definitiv interessiert, aber beschäftigt',
          'Du solltest nochmal nachfragen, mit mehr Druck',
        ],
        correctIndex: 1,
        explanation:
          'Eine nützliche Regel: Wenn es kein „Hell yes" ist, ist es wahrscheinlich ein Nein. Begeistertes Interesse ist normalerweise unmissverständlich. Vage Antworten bedeuten oft, dass die Person dich nicht direkt ablehnen möchte.',
      },
      {
        question:
          'Was ist zuverlässiger: was jemand sagt oder was jemand tut?',
        options: [
          'Was die Person sagt — Worte sind das primäre Kommunikationsmittel',
          'Was die Person tut — Taten enthüllen konsistent die wahren Absichten, besonders wenn Worte und Taten nicht übereinstimmen',
          'Beides ist in allen Situationen gleich zuverlässig',
          'Keines von beiden — man kann nie wirklich wissen, was jemand denkt',
        ],
        correctIndex: 1,
        explanation:
          'Wenn Worte und Taten übereinstimmen, super. Wenn nicht, vertrau den Taten. Jemand, der sagt „Ich mag dich wirklich", aber sich nie Zeit für dich nimmt, zeigt dir, wo die Prioritäten wirklich liegen.',
      },
      {
        question:
          'Du bist unsicher, ob jemand an dir interessiert ist. Was ist der direkteste Weg, es herauszufinden?',
        options: [
          'Die Social-Media-Aktivität der Person auf Hinweise analysieren',
          'Gemeinsame Freunde bitten, zu recherchieren',
          'Eine Situation schaffen, die die Person dazu bringt, ihr Interesse zu zeigen (z. B. eifersüchtig machen)',
          'Mit warmherziger Direktheit fragen: „Ich genieße die Zeit mit dir sehr. Ich würde dich gern auf ein richtiges Date einladen — was denkst du?"',
        ],
        correctIndex: 3,
        explanation:
          'Im Zweifel direkt fragen. Klare Kommunikation eliminiert Ratespiele, demonstriert Selbstvertrauen und respektiert sowohl deine als auch deren Zeit.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 18 – Das Beziehungsgespräch (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 18,
    locale: 'de',
    questions: [
      {
        question:
          'Du datest jemanden seit zwei Monaten und willst „das Gespräch" führen. Wann ist der richtige Zeitpunkt?',
        options: [
          'Nach dem ersten Date, um die Sache frühzeitig zu klären',
          'Wenn ihr beide investiert seid, euch regelmäßig seht und du Klarheit möchtest — es gibt keine universelle Timeline, aber es endlos aufzuschieben verursacht mehr Angst als es zu führen',
          'Nur wenn die andere Person es zuerst anspricht',
          'An einem großen Feiertag oder Geburtstag für dramatischen Effekt',
        ],
        correctIndex: 1,
        explanation:
          'Der richtige Zeitpunkt für das DTR-Gespräch ist, wenn du das Bedürfnis nach Klarheit spürst. Auf den „perfekten" Moment zu warten oder dass die andere Person anfängt, verlängert nur die Unsicherheit.',
      },
      {
        question:
          'Wie rahmst du „das Beziehungsgespräch" so, dass es produktiv statt druckvoll wird?',
        options: [
          '„Wir müssen reden, wo das hier hingeht" (ernster, bedrohlicher Ton)',
          '„Ich genieße das hier wirklich und will ehrlich sein — ich fange an, echte Gefühle zu entwickeln. Wie geht es dir damit?"',
          '„Sind wir jetzt exklusiv oder was?"',
          'Ein Ultimatum stellen: „Verpflichte dich oder ich gehe"',
        ],
        correctIndex: 1,
        explanation:
          'Mit den eigenen Gefühlen zu führen (Verletzlichkeit) statt mit Forderungen schafft Sicherheit. Es lädt zu einer ehrlichen Antwort ein statt einer defensiven.',
      },
      {
        question:
          'Beim Gespräch sagt die Person, dass sie noch nicht bereit für ein Label ist, aber offensichtlich gern Zeit mit dir verbringt. Was solltest du bedenken?',
        options: [
          'Sofort gehen — wenn die Person kein Label will, will sie dich nicht',
          'Unendlich warten, ohne es je wieder anzusprechen',
          'Entscheide, was DU brauchst — wenn du Commitment willst und die Person nicht, ist es fair, eine persönliche Timeline zu setzen und das respektvoll zu kommunizieren',
          'So tun, als wolltest du auch kein Label, obwohl du es willst',
        ],
        correctIndex: 2,
        explanation:
          'Das Tempo der anderen Person zu respektieren bedeutet nicht, die eigenen Bedürfnisse aufzugeben. Zu wissen, was du brauchst, und es ehrlich zu kommunizieren ist der reife Ansatz. Du kannst Raum geben, ohne ewig zu warten.',
      },
      {
        question:
          'Was ist der größte Fehler, den Leute beim DTR-Gespräch (Define The Relationship) machen?',
        options: [
          'Es zu früh zu führen',
          'Nicht vorher zu planen, was man sagen will',
          'Es als Verhandlung oder Ultimatum anzugehen statt als offenen, ehrlichen Austausch von Gefühlen und Absichten',
          'Es persönlich statt per Text zu machen',
        ],
        correctIndex: 2,
        explanation:
          'Das DTR sollte ein Dialog sein, kein Gerichtssaal. Wenn es sich wie eine Forderung oder Verhandlung anfühlt, löst es Abwehr aus. Wenn es sich nach zwei Menschen anfühlt, die ehrlich teilen, baut es Vertrauen auf.',
      },
      {
        question:
          'Warum ist es wichtig, ehrlich über deine Absichten zu sein, auch wenn es die andere Person abschrecken könnte?',
        options: [
          'Weil Ehrlichkeit eine moralische Pflicht ist, ungeachtet der Konsequenzen',
          'Weil deine Absichten zu verbergen, um jemanden zu halten, bedeutet, eine Verbindung auf einem falschen Fundament aufzubauen — und die Wahrheit kommt immer raus',
          'Weil Menschen immer Direktheit gegenüber Geheimnis bevorzugen',
          'Das ist nicht wichtig — strategische Ambiguität hält das Interesse länger aufrecht',
        ],
        correctIndex: 1,
        explanation:
          'Authentizität filtert nach Kompatibilität. Wenn deine echten Absichten jemanden abschrecken, war die Person nicht die Richtige für dich. So zu tun, als wolltest du etwas anderes, verzögert nur einen unvermeidlichen Mismatch.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 19 – Den Funken am Leben halten (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 19,
    locale: 'de',
    questions: [
      {
        question:
          'Du bist seit einem Jahr in einer Beziehung und es fühlt sich routiniert an. Was ist der effektivste Weg, den Funken neu zu entfachen?',
        options: [
          'Akzeptieren, dass der Funke immer stirbt, und sich in Kameradschaft einrichten',
          'Neues einführen — gemeinsam neue Erfahrungen machen, Routinen brechen, Überraschungs-Dates planen und individuell weiter wachsen',
          'Drama und Konflikte erzeugen, um die Dinge aufregend zu halten',
          'Mehr Zeit getrennt verbringen, damit ihr euch vermisst',
        ],
        correctIndex: 1,
        explanation:
          'Neues löst Dopamin aus — denselben Botenstoff, der für die Aufregung in frühen Beziehungen verantwortlich ist. Neue gemeinsame Erfahrungen erschaffen das Gefühl der Entdeckung neu.',
      },
      {
        question:
          'Was sagt die Beziehungsforschung als stärksten Prädiktor für langfristige Beziehungszufriedenheit voraus?',
        options: [
          'Physische Anziehung',
          'Dieselben Hobbys haben',
          'Das Verhältnis von positiven zu negativen Interaktionen — mindestens 5 positive Interaktionen für jede negative',
          'Finanzielle Kompatibilität',
        ],
        correctIndex: 2,
        explanation:
          'John Gottmans Forschung zeigt, dass das 5:1-Verhältnis von positiven zu negativen Interaktionen der stärkste Prädiktor für Beziehungserfolg ist. Kleine positive Gesten zählen enorm.',
      },
      {
        question:
          'Dein Partner erwähnt, dass er/sie schon immer mal einen Töpferkurs machen wollte. Was ist der „Funken-am-Leben-halten"-Move?',
        options: [
          '„Cool" sagen und es vergessen',
          'Dich selbst für einen anmelden und davon erzählen, um die Person eifersüchtig zu machen',
          'Es dir merken und euch beide überraschend anmelden — zeigen, dass du zuhörst und dir die Interessen der Person wichtig sind',
          'Der Person ein Töpferset zu Weihnachten kaufen und es dabei belassen',
        ],
        correctIndex: 2,
        explanation:
          'Sich an kleine Wünsche zu erinnern und danach zu handeln zeigt tiefe Aufmerksamkeit. Es sagt: „Ich höre dir zu, mir ist wichtig, was du willst, und ich möchte es mit dir erleben."',
      },
      {
        question:
          'Warum tötet Selbstgefälligkeit Beziehungen?',
        options: [
          'Weil Leute sich am Aussehen des anderen satt sehen',
          'Weil wenn du aufhörst, dir Mühe zu geben — Dates zu planen, zu flirten, Wertschätzung auszudrücken — dein Partner sich als selbstverständlich genommen fühlt',
          'Weil Beziehungen ein natürliches Ablaufdatum haben',
          'Selbstgefälligkeit tötet eigentlich keine Beziehungen — das ist ein Mythos',
        ],
        correctIndex: 1,
        explanation:
          'Beziehungen brauchen fortwährende Investition. Die größte Bedrohung ist nicht Konflikt — es ist das langsame Auseinanderdriften, das passiert, wenn beide aufhören, sich aktiv füreinander zu entscheiden.',
      },
      {
        question:
          'Was ist eine einfache tägliche Gewohnheit, die langfristige Anziehung aufrechterhält?',
        options: [
          'Trainieren, damit du körperlich attraktiv bleibst',
          'Echte Wertschätzung ausdrücken — deinem Partner konkret sagen, was du an ihm/ihr schätzt, und kleine Dinge nicht als selbstverständlich nehmen',
          'Etwas Geheimnis bewahren, indem du dich nie vollständig öffnest',
          'Sicherstellen, dass du immer Streitgespräche gewinnst',
        ],
        correctIndex: 1,
        explanation:
          'Tägliche Wertschätzung bekämpft den „Gewöhnungseffekt", bei dem wir aufhören, gute Dinge wahrzunehmen. Ein spezifisches „Ich liebe es, wie du..." bringt mehr als große Gesten.',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // Kapitel 20 – Der Abschluss (DE)
  // ──────────────────────────────────────────────
  {
    chapterId: 20,
    locale: 'de',
    questions: [
      {
        question:
          'Du hast alle Kapitel abgeschlossen. Ein Freund fragt dich nach deinem besten Dating-Rat. Welche Antwort zeigt, dass du die Lektionen wirklich verinnerlicht hast?',
        options: [
          '„Sei einfach du selbst und die richtige Person wird kommen"',
          '„Arbeite daran, jemand zu werden, auf den du stolz bist, entwickle echte soziale Fähigkeiten, geh konsequent raus und behandle jeden Menschen mit Respekt — Dating ist eine Fähigkeit, nicht nur Glück"',
          '„Benutze diese bestimmten Sprüche, die ich gelernt hab — die funktionieren immer"',
          '„Senk deine Standards und du findest jemanden"',
        ],
        correctIndex: 1,
        explanation:
          'Den Abschluss wirklich geschafft zu haben bedeutet zu verstehen, dass Dating-Erfolg Selbstentwicklung, erlernbare Fähigkeiten, konsequentes Handeln und Respekt kombiniert. Es geht nicht um Tricks — es geht darum, ein besserer Mensch zu werden.',
      },
      {
        question:
          'Welches Konzept verbindet alles, was du in allen Kapiteln gelernt hast?',
        options: [
          'Physische Attraktivität ist alles, was wirklich zählt',
          'Authentische Selbstverbesserung kombiniert mit echtem Interesse an anderen — die Fähigkeiten sind Werkzeuge, aber das Fundament ist echtes Wachstum und echte Verbindung',
          'Die richtige Technik kann jeden dazu bringen, sich in dich zu verlieben',
          'Dating ist ein Zahlenspiel — sprich genug Leute an und jemand wird Ja sagen',
        ],
        correctIndex: 1,
        explanation:
          'Jedes Kapitel unterstreicht denselben Kern: Verbessere dich authentisch, zeige echtes Interesse an anderen, und die Techniken dienen der Verbindung — nicht umgekehrt.',
      },
      {
        question:
          'Du bist auf einem sozialen Event und alles kommt zusammen — selbstbewusste Körpersprache, großartige Unterhaltung, echte Verbindung. Aber es führt nicht zu einer Nummer. War es ein Misserfolg?',
        options: [
          'Ja — wenn du keine Nummer bekommen hast, hast du versagt',
          'Nein — der wahre Erfolg ist, wer du geworden bist. Jede Interaktion baut deine Fähigkeiten aus, ob sie zu einem Date führt oder nicht',
          'Kommt darauf an, wie attraktiv die andere Person war',
          'Ja, denn der ganze Sinn ist, Dates zu bekommen',
        ],
        correctIndex: 1,
        explanation:
          'Ergebnisunabhängigkeit ist die letzte Lektion. Wenn du deinen Selbstwert von bestimmten Ergebnissen löst und dich auf Wachstum konzentrierst, wird Dating echt angenehm statt eine Quelle von Angst.',
      },
      {
        question:
          'Jetzt, wo du „abgeschlossen" hast, wie sollte deine laufende Praxis aussehen?',
        options: [
          'Du bist fertig — du hast alles gelernt, was du wissen musst',
          'Dich weiterhin sozial herausfordern, Interaktionen reflektieren, neugierig auf Menschen bleiben und weiter wachsen — soziale Fähigkeiten sind eine lebenslange Praxis',
          'Nur üben, wenn du aktiv nach einem Partner suchst',
          'Anderen beibringen, was du gelernt hast, statt selbst zu üben',
        ],
        correctIndex: 1,
        explanation:
          'Soziale Fähigkeiten sind wie ein Muskel — sie verkümmern ohne Gebrauch. Der „Abschluss" ist eigentlich der Beginn einer lebenslangen Praxis von Verbindung, Wachstum und echtem Engagement mit anderen.',
      },
      {
        question:
          'Wenn du nur EINE Lektion aus diesem gesamten Programm in dein Dating-Leben mitnehmen könntest, welche hätte den größten Impact?',
        options: [
          'Die besten Eröffnungssprüche für Dating-Apps',
          'Wie man Power Poses vor Dates einsetzt',
          'Echte Neugier auf andere kombiniert mit dem Mut, authentisch du selbst zu sein — alles andere sind nur Taktiken, die diese zwei Grundlagen unterstützen',
          'Die Drei-Sekunden-Blickkontakt-Regel',
        ],
        correctIndex: 2,
        explanation:
          'Neugier und Authentizität sind die zwei Säulen, auf denen alles andere ruht. Wenn du dich wirklich für Menschen interessierst und mutig genug bist, du selbst zu sein, werden die spezifischen Techniken zu natürlichen Erweiterungen dessen, wer du bist.',
      },
    ],
  },
];

export function getQuizTemplate(chapterId: number, locale: string): QuizQuestion[] {
  const template = quizTemplates.find(t => t.chapterId === chapterId && t.locale === locale);
  if (!template) {
    // Fallback to English
    const fallback = quizTemplates.find(t => t.chapterId === chapterId && t.locale === 'en');
    return fallback?.questions ?? [];
  }
  return template.questions;
}
