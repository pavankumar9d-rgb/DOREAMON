/**
 * cast-data.js
 * Bios, quotes, signature moves and metadata for Nobi Family, Empty Lot Gang, and Neighborhood Polaroids
 */

const NOBI_FAMILY = [
  {
    id: "doraemon",
    name: "Doraemon",
    kanji: "ドラえもん",
    role: "Factory MS-903 • 22nd Century Guardian",
    bio: "Manufactured on September 3, 2112 at Matsushiba Robot Factory. Earless, blue, and terrified of mice. Possesses a 4-dimensional pocket housing thousands of secret gadgets.",
    favorite: "Dorayaki (Red bean pancake)",
    weakness: "Mice & cold winters",
    moveButton: "🥞 Summon Giant Dorayaki",
    moveSpeech: "Bean-paste perfection! Nothing beats freshly steamed dorayaki!",
    moveImg: "doraemonDorayaki",
    actionType: "dorayaki",
    spotlight: { x: "27%", y: "66%", rx: "15%", ry: "24%", badge: "Doraemon ドラえもん" }
  },
  {
    id: "nobita",
    name: "Nobita Nobi",
    kanji: "野比のび太",
    role: "Age 10 • Grade 4 • Nap Champion",
    bio: "Can fall asleep in 0.93 seconds flat. Phenomenal marksman with an itchy trigger finger, terrible at mathematics, but possesses a heart that feels empathy for all living creatures.",
    favorite: "Sleeping in tatami sunlight",
    weakness: "Math exams & barking stray dogs",
    moveButton: "💯 Reveal Test Score",
    moveSpeech: "Doraemoooon! Help me hide this 0-point test before Mom gets home!!",
    moveImg: "nobitaScore",
    actionType: "testScore",
    spotlight: { x: "49%", y: "54%", rx: "13%", ry: "34%", badge: "Nobita のび太" }
  },
  {
    id: "tamako",
    name: "Tamako Nobi (Mom)",
    kanji: "野比玉子",
    role: "Mom, and the True Final Boss",
    bio: "The undisputed supreme commander of the Nobi household. Can detect a hidden zero-point test score through three solid walls. Famous for her devastating 60-minute living room lectures.",
    favorite: "Peace and quiet in the garden",
    weakness: "Nobita forgetting his homework",
    moveButton: "💢 Trigger 60-Min Lecture",
    moveSpeech: "NOBITAAA!! Sit down right there and listen to me for an hour!!",
    moveImg: "tamakoScold",
    actionType: "scold",
    spotlight: { x: "36%", y: "36%", rx: "14%", ry: "26%", badge: "Tamako (Mom) 玉子" }
  },
  {
    id: "nobisuke",
    name: "Nobisuke Nobi (Dad)",
    kanji: "野比のび助",
    role: "Salaryman & Sunday Golfer",
    bio: "Gentle, hard-working section chief who dreams of shaving strokes off his golf handicap and finally passing his driver's license exam. Loves relaxing with hot tea after a long commute.",
    favorite: "Practicing golf in slippers",
    weakness: "Driving school parallel parking",
    moveButton: "⛳ Practice Golf Swing",
    moveSpeech: "FORE!! This new swing grip from the golf magazine feels promising!",
    moveImg: "nobisukeGolf",
    actionType: "golf",
    spotlight: { x: "67%", y: "38%", rx: "17%", ry: "28%", badge: "Nobisuke (Dad) のび助" }
  },
  {
    id: "dorami",
    name: "Dorami",
    kanji: "ドラミ",
    role: "10,000 Horsepower Little Sister",
    bio: "Doraemon's brilliant, highly capable younger sister. Equipped with a cute red ribbon ear and a sparkling gingham pocket. Whenever Doraemon is in serious trouble, she arrives to save the day.",
    favorite: "Sweet Melon Bread (Melon-Pan)",
    weakness: "Cockroaches (Gokiburi)",
    moveButton: "🍈 Offer Melon Bread",
    moveSpeech: "Big brother! Have some delicious sweet melon bread and cheer up!",
    moveImg: "doramiMelonPan",
    actionType: "melonPan",
    spotlight: { x: "71%", y: "68%", rx: "15%", ry: "24%", badge: "Dorami ドラミ" }
  }
];

const EMPTY_LOT_GANG = [
  {
    id: "shizuka",
    name: "Shizuka Minamoto",
    kanji: "源静香",
    trait: "Gentle soul & Secret Sweet Potato Lover",
    quote: "Nobita-san, let's practice piano after we finish our homework!",
    badge: "YAKI-IMO! 🍠",
    popText: "Warm sweet potato fresh from the fire! Please don't tell the boys!",
    imgKey: "shizukaPotato",
    doodle: "🍠",
    spotlight: { x: "64.5%", y: "44%", rx: "5.5%", ry: "14%", badge: "Shizuka Minamoto 源静香" }
  },
  {
    id: "gian",
    name: "Takeshi 'Gian' Gouda",
    kanji: "剛田武",
    trait: "Empty Lot King & Dreaded Vocalist",
    quote: "What's mine is mine, and what's yours is also mine!",
    badge: "BOE~!! 🎤",
    popText: "MY VOICE IS PURE SOUL! LISTEN TO MY 3-HOUR RECITAL!!",
    imgKey: "gianConcert",
    doodle: "🎤",
    spotlight: { x: "72%", y: "40%", rx: "7%", ry: "16%", badge: "Takeshi 'Gian' Gouda 剛田武" }
  },
  {
    id: "suneo",
    name: "Suneo Honekawa",
    kanji: "骨川スネ夫",
    trait: "Rich Kid, RC Collector & Fox-faced Brag",
    quote: "My cousin in Hawaii sent me this brand-new custom radio-controlled jet!",
    badge: "VIP RC JET! ✈️",
    popText: "Sorry Nobita, this high-end yacht trip only has seats for three!",
    imgKey: "suneoAirplane",
    doodle: "✈️",
    spotlight: { x: "81%", y: "44%", rx: "5.5%", ry: "14%", badge: "Suneo Honekawa 骨川スネ夫" }
  },
  {
    id: "dekisugi",
    name: "Hidetoshi Dekisugi",
    kanji: "出木杉英才",
    trait: "Straight-A Scholar & Future Astronomer",
    quote: "Knowledge is the greatest adventure. I brought the encyclopedia!",
    badge: "100 PTS! ✨",
    popText: "I finished summarizing the astronomy chapter. Would you like to study together, Nobita?",
    imgKey: "dekisugiBook",
    doodle: "📚",
    spotlight: { x: "50%", y: "50%", rx: "48%", ry: "48%", badge: "Hidetoshi Dekisugi 出木杉英才 (Honors Scholar)" }
  }
];

const NEIGHBORHOOD_POLAROIDS = [
  {
    id: "sensei",
    name: "Sensei (The Teacher)",
    title: "Classroom Guardian & Roster Master",
    imgKey: "senseiPolaroid",
    tilt: "-3deg",
    backNote: "Scolds me every single Tuesday for daydreaming and napping in class, but stayed late in the pouring rain to make sure I got home safe. — Nobita",
    year: "Showa 52 • Elementary Grade 4"
  },
  {
    id: "kaminari",
    name: "Mr. Kaminari (Kaminari-san)",
    title: "Neighborhood Bonsai Defender",
    imgKey: "kaminariPolaroid",
    tilt: "2.5deg",
    backNote: "Total window & prized bonsai casualties this month: 14 baseballs. Always keep an Anywhere Door ready on standby before Nobita takes his batting stance! — Doraemon",
    year: "Showa 54 • Corner House"
  },
  {
    id: "jaiko",
    name: "Jaiko Gouda (Christine Goda)",
    title: "Passionate Shojo Manga Artist",
    imgKey: "jaikoPolaroid",
    tilt: "-2deg",
    backNote: "Her shojo romance manga manuscripts under pen-name 'Christine Goda' are genuine masterpieces of emotional storytelling. Never let Gian edit the ending! — Doraemon & Nobita",
    year: "Showa 55 • Mangaka Debut"
  }
];

window.NOBI_FAMILY = NOBI_FAMILY;
window.EMPTY_LOT_GANG = EMPTY_LOT_GANG;
window.NEIGHBORHOOD_POLAROIDS = NEIGHBORHOOD_POLAROIDS;
