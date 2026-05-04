import type { QmdjFocus } from "@/lib/qmdj";

// ─── Types ────────────────────────────────────────────────────────────────────

export type IChingLine = {
  value: 0 | 1;
  isChanging: boolean;
};

export type IChingLineText = {
  zh: string;
  en: string;
  nature: "auspicious" | "inauspicious" | "neutral";
};

export type IChingHexagram = {
  number: number;
  nameZh: string;
  namePinyin: string;
  nameEn: string;
  lines: [0|1, 0|1, 0|1, 0|1, 0|1, 0|1];
  judgment: { zh: string; en: string };
  image: { zh: string; en: string };
  linesText: IChingLineText[];
};

export type IChingReading = {
  primaryHexagram: IChingHexagram;
  lines: IChingLine[];
  changingLines: number[];
  resultingHexagram: IChingHexagram | null;
  interpretation: string[];
  question?: string;
};

// ─── Hexagram Data (King Wen order 1–64) ─────────────────────────────────────
// lines: [line1, line2, line3, line4, line5, line6] — index 0 = bottom line
// 1 = yang (solid), 0 = yin (broken)

export const HEXAGRAMS: IChingHexagram[] = [
  {
    number: 1,
    nameZh: "乾",
    namePinyin: "Qián",
    nameEn: "The Creative",
    lines: [1, 1, 1, 1, 1, 1],
    judgment: {
      zh: "乾：元亨利貞。",
      en: "The Creative works sublime success, furthering through perseverance.",
    },
    image: {
      zh: "天行健，君子以自強不息。",
      en: "Heaven moves with strength. The superior one ceaselessly strengthens himself.",
    },
    linesText: [
      { zh: "潛龍，勿用。", en: "Hidden dragon — do not act yet.", nature: "neutral" },
      { zh: "見龍在田，利見大人。", en: "Dragon appears in the field; it furthers to see the great person.", nature: "auspicious" },
      { zh: "君子終日乾乾，夕惕若厲，無咎。", en: "All day the superior one is creatively active; at nightfall caution — no blame.", nature: "neutral" },
      { zh: "或躍在淵，無咎。", en: "Wavering flight over the depths — no blame.", nature: "neutral" },
      { zh: "飛龍在天，利見大人。", en: "Flying dragon in the heavens — it furthers to see the great person.", nature: "auspicious" },
      { zh: "亢龍有悔。", en: "Arrogant dragon will have cause to repent.", nature: "inauspicious" },
    ],
  },
  {
    number: 2,
    nameZh: "坤",
    namePinyin: "Kūn",
    nameEn: "The Receptive",
    lines: [0, 0, 0, 0, 0, 0],
    judgment: {
      zh: "坤：元亨，利牝馬之貞。",
      en: "The Receptive brings about sublime success through the perseverance of a mare.",
    },
    image: {
      zh: "地勢坤，君子以厚德載物。",
      en: "The earth's condition is receptive devotion. The superior one carries all things with virtue.",
    },
    linesText: [
      { zh: "履霜，堅冰至。", en: "When there is hoarfrost underfoot, solid ice is not far.", nature: "neutral" },
      { zh: "直方大，不習無不利。", en: "Straight, square, great — without purpose, yet nothing remains unfurthered.", nature: "auspicious" },
      { zh: "含章可貞，或從王事，無成有終。", en: "Hidden lines — perseverance is possible. In service to the king, seek no credit; bring things to completion.", nature: "neutral" },
      { zh: "括囊，無咎，無譽。", en: "A tied-up sack — no blame, no praise.", nature: "neutral" },
      { zh: "黃裳元吉。", en: "A yellow lower garment brings supreme good fortune.", nature: "auspicious" },
      { zh: "龍戰于野，其血玄黃。", en: "Dragons fight in the meadow; their blood is black and yellow.", nature: "inauspicious" },
    ],
  },
  {
    number: 3,
    nameZh: "屯",
    namePinyin: "Zhūn",
    nameEn: "Difficulty at the Beginning",
    lines: [1, 0, 0, 0, 1, 0],
    judgment: {
      zh: "屯：元亨利貞，勿用有攸往，利建侯。",
      en: "Difficulty at the beginning works supreme success. Do not go forward — it furthers to appoint helpers.",
    },
    image: {
      zh: "雲雷屯，君子以經綸。",
      en: "Clouds and thunder — the superior one arranges and organises.",
    },
    linesText: [
      { zh: "磐桓，利居貞，利建侯。", en: "Hesitation and hindrance — it furthers to remain persevering; appoint helpers.", nature: "neutral" },
      { zh: "屯如邅如，乘馬班如。匪寇婚媾，女子貞不字，十年乃字。", en: "Difficulties pile up; a horse-drawn wagon halts. It is not a robber who comes, but a suitor. The maiden remains faithful and does not pledge — ten years pass, then she pledges.", nature: "neutral" },
      { zh: "即鹿無虞，惟入于林中，君子幾不如舍，往吝。", en: "Whoever hunts deer without a forester loses his way in the forest. The superior one understands — it is better to desist. Going brings humiliation.", nature: "inauspicious" },
      { zh: "乘馬班如，求婚媾，往吉，無不利。", en: "Horse and wagon part. Strive for union — going brings good fortune.", nature: "auspicious" },
      { zh: "屯其膏，小貞吉，大貞凶。", en: "Difficulties with the gifts — small perseverance brings good fortune; great perseverance brings misfortune.", nature: "neutral" },
      { zh: "乘馬班如，泣血漣如。", en: "Horse and wagon part. Bloody tears flow.", nature: "inauspicious" },
    ],
  },
  {
    number: 4,
    nameZh: "蒙",
    namePinyin: "Méng",
    nameEn: "Youthful Folly",
    lines: [0, 1, 0, 0, 0, 1],
    judgment: {
      zh: "蒙：亨。匪我求童蒙，童蒙求我。",
      en: "Youthful folly has success. It is not I who seeks the youth, but the youth who seeks me.",
    },
    image: {
      zh: "山下出泉，蒙；君子以果行育德。",
      en: "A spring wells up at the foot of the mountain — youthful folly. The superior one fosters character through decisive action.",
    },
    linesText: [
      { zh: "發蒙，利用刑人，用說桎梏，以往吝。", en: "To make a fool develop — it furthers to use punishment to remove fetters.", nature: "neutral" },
      { zh: "包蒙吉，納婦吉，子克家。", en: "To bear with fools in kindness brings good fortune. To know how to take women brings good fortune.", nature: "auspicious" },
      { zh: "勿用取女，見金夫，不有躬，無攸利。", en: "Take not a maiden who loses her composure when she sees a man of bronze — nothing furthers.", nature: "inauspicious" },
      { zh: "困蒙，吝。", en: "Entangled in youthful folly — humiliation.", nature: "inauspicious" },
      { zh: "童蒙，吉。", en: "Childlike folly brings good fortune.", nature: "auspicious" },
      { zh: "擊蒙，不利為寇，利御寇。", en: "Punishing folly — not furthering to act as a criminal; furthering to ward off criminals.", nature: "neutral" },
    ],
  },
  {
    number: 5,
    nameZh: "需",
    namePinyin: "Xū",
    nameEn: "Waiting",
    lines: [1, 1, 1, 0, 1, 0],
    judgment: {
      zh: "需：有孚，光亨，貞吉，利涉大川。",
      en: "Waiting with sincerity — brilliant success. Perseverance brings good fortune; it furthers to cross the great water.",
    },
    image: {
      zh: "雲上于天，需；君子以飲食宴樂。",
      en: "Clouds rise up to heaven — waiting. The superior one eats, drinks, and is of good cheer.",
    },
    linesText: [
      { zh: "需于郊，利用恆，無咎。", en: "Waiting in the meadow — it furthers to remain in what endures. No blame.", nature: "neutral" },
      { zh: "需于沙，小有言，終吉。", en: "Waiting on sand — there is some gossip. In the end good fortune.", nature: "auspicious" },
      { zh: "需于泥，致寇至。", en: "Waiting in the mud — brings about the arrival of the enemy.", nature: "inauspicious" },
      { zh: "需于血，出自穴。", en: "Waiting in blood — get out of the pit.", nature: "inauspicious" },
      { zh: "需于酒食，貞吉。", en: "Waiting at wine and food — perseverance brings good fortune.", nature: "auspicious" },
      { zh: "入于穴，有不速之客三人來，敬之終吉。", en: "One falls into the pit; three uninvited guests arrive. Honor them and in the end good fortune.", nature: "auspicious" },
    ],
  },
  {
    number: 6,
    nameZh: "訟",
    namePinyin: "Sòng",
    nameEn: "Conflict",
    lines: [0, 1, 0, 1, 1, 1],
    judgment: {
      zh: "訟：有孚，窒惕，中吉，終凶。",
      en: "Conflict — you are sincere but are being obstructed. A cautious halt midway brings good fortune; going through to the end brings misfortune.",
    },
    image: {
      zh: "天與水違行，訟；君子以作事謀始。",
      en: "Heaven and water go their opposite ways — conflict. The superior one carefully considers the beginning in all undertakings.",
    },
    linesText: [
      { zh: "不永所事，小有言，終吉。", en: "If one does not perpetuate the affair, there is a little gossip — in the end, good fortune.", nature: "auspicious" },
      { zh: "不克訟，歸而逋，其邑人三百戶無眚。", en: "One cannot engage in conflict; one returns home and gives way. Three hundred households are freed from guilt.", nature: "neutral" },
      { zh: "食舊德，貞厲，終吉。或從王事，無成。", en: "Nourish yourself on ancient virtue — perseverance despite danger, good fortune in the end.", nature: "neutral" },
      { zh: "不克訟，復即命，渝，安貞吉。", en: "One cannot engage in conflict. One turns back and submits to fate. Change, rest in perseverance, good fortune.", nature: "auspicious" },
      { zh: "訟元吉。", en: "To contend brings supreme good fortune.", nature: "auspicious" },
      { zh: "或錫之鞶帶，終朝三褫之。", en: "Even if a belt of honor is bestowed on him, by the end of the morning it will have been snatched away three times.", nature: "inauspicious" },
    ],
  },
  {
    number: 7,
    nameZh: "師",
    namePinyin: "Shī",
    nameEn: "The Army",
    lines: [0, 1, 0, 0, 0, 0],
    judgment: {
      zh: "師：貞，丈人吉，無咎。",
      en: "The army needs perseverance and a strong man. Good fortune without blame.",
    },
    image: {
      zh: "地中有水，師；君子以容民畜衆。",
      en: "In the middle of the earth is water — the army. The superior one increases the multitude and cares for the people.",
    },
    linesText: [
      { zh: "師出以律，否臧凶。", en: "An army must set forth in proper order — if the order is not good, misfortune threatens.", nature: "neutral" },
      { zh: "在師中吉，無咎，王三錫命。", en: "In the midst of the army — good fortune, no blame. The king bestows a triple decoration.", nature: "auspicious" },
      { zh: "師或輿尸，凶。", en: "The army perhaps carries corpses in the wagon — misfortune.", nature: "inauspicious" },
      { zh: "師左次，無咎。", en: "The army retreats to the left — no blame.", nature: "neutral" },
      { zh: "田有禽，利執言，無咎；長子帥師，弟子輿尸，貞凶。", en: "Game is in the field; it furthers to catch it. No blame. Let the eldest son lead the army; the younger bears corpses — perseverance leads to misfortune.", nature: "neutral" },
      { zh: "大君有命，開國承家，小人勿用。", en: "The great prince issues commands, founds states, bestows fiefs on his family. Inferior men should not be employed.", nature: "auspicious" },
    ],
  },
  {
    number: 8,
    nameZh: "比",
    namePinyin: "Bǐ",
    nameEn: "Holding Together",
    lines: [0, 0, 0, 0, 1, 0],
    judgment: {
      zh: "比：吉。原筮元永貞，無咎。",
      en: "Holding together brings good fortune. Inquire of the oracle whether you have virtue, perseverance, and steadiness — then no blame.",
    },
    image: {
      zh: "地上有水，比；先王以建萬國，親諸侯。",
      en: "On the earth is water — holding together. The kings of antiquity apportioned the land into states and cultivated friendly relations with feudal lords.",
    },
    linesText: [
      { zh: "有孚比之，無咎。有孚盈缶，終來有他吉。", en: "Hold to the other in truth and loyalty — no blame. The vessel overflows. In the end good fortune comes from without.", nature: "auspicious" },
      { zh: "比之自內，貞吉。", en: "Hold to the other from within — perseverance brings good fortune.", nature: "auspicious" },
      { zh: "比之匪人。", en: "You hold together with the wrong people.", nature: "inauspicious" },
      { zh: "外比之，貞吉。", en: "Hold to the other also on the outside — perseverance brings good fortune.", nature: "auspicious" },
      { zh: "顯比，王用三驅，失前禽，邑人不誡，吉。", en: "Manifestation of holding together — the king uses beaters on three sides only and forgoes game that runs off. Good fortune.", nature: "auspicious" },
      { zh: "比之無首，凶。", en: "He finds no head for holding together — misfortune.", nature: "inauspicious" },
    ],
  },
  {
    number: 9,
    nameZh: "小畜",
    namePinyin: "Xiǎo Chù",
    nameEn: "Small Taming",
    lines: [1, 1, 1, 0, 1, 1],
    judgment: {
      zh: "小畜：亨。密雲不雨，自我西郊。",
      en: "Small taming has success. Dense clouds, no rain from our western plains.",
    },
    image: {
      zh: "風行天上，小畜；君子以懿文德。",
      en: "The wind drives across heaven — small taming. The superior one refines the outward aspects of his nature.",
    },
    linesText: [
      { zh: "復自道，何其咎，吉。", en: "Return to the way — what blame could there be? Good fortune.", nature: "auspicious" },
      { zh: "牽復，吉。", en: "He allows himself to be drawn into returning — good fortune.", nature: "auspicious" },
      { zh: "輿說輻，夫妻反目。", en: "The spokes of the wagon wheel are removed. Man and wife roll their eyes.", nature: "inauspicious" },
      { zh: "有孚，血去惕出，無咎。", en: "If you are sincere, blood vanishes and fear gives way — no blame.", nature: "auspicious" },
      { zh: "有孚攣如，富以其鄰。", en: "If you are sincere and loyally attached, you enrich your neighbour.", nature: "auspicious" },
      { zh: "既雨既處，尚德載；婦貞厲，月幾望，君子征凶。", en: "The rain comes, rest comes. This is because virtue accumulates. The wife perseveres — danger. The moon is nearly full. If the superior one sets forth now, misfortune comes.", nature: "inauspicious" },
    ],
  },
  {
    number: 10,
    nameZh: "履",
    namePinyin: "Lǚ",
    nameEn: "Treading",
    lines: [1, 1, 0, 1, 1, 1],
    judgment: {
      zh: "履虎尾，不咥人，亨。",
      en: "Treading upon the tail of the tiger — it does not bite. Success.",
    },
    image: {
      zh: "上天下澤，履；君子以辯上下，定民志。",
      en: "Heaven above, the lake below — treading. The superior one discriminates between high and low and thereby steadies the thinking of the people.",
    },
    linesText: [
      { zh: "素履，往無咎。", en: "Simple conduct — going is without blame.", nature: "auspicious" },
      { zh: "履道坦坦，幽人貞吉。", en: "Treading a smooth, level course — the perseverance of a dark man brings good fortune.", nature: "auspicious" },
      { zh: "眇能視，跛能履，履虎尾，咥人，凶；武人為于大君。", en: "The one-eyed man is able to see; the lame man is able to tread. He treads on the tiger's tail — it bites the man. Misfortune.", nature: "inauspicious" },
      { zh: "履虎尾，愬愬終吉。", en: "He treads on the tail of the tiger — with caution and circumspection, good fortune in the end.", nature: "auspicious" },
      { zh: "夬履，貞厲。", en: "Resolute conduct — perseverance with awareness of danger.", nature: "neutral" },
      { zh: "視履考祥，其旋元吉。", en: "Look to your conduct and weigh the favourable signs — when everything is fulfilled, supreme good fortune comes.", nature: "auspicious" },
    ],
  },
  {
    number: 11,
    nameZh: "泰",
    namePinyin: "Tài",
    nameEn: "Peace",
    lines: [1, 1, 1, 0, 0, 0],
    judgment: {
      zh: "泰：小往大來，吉亨。",
      en: "Peace — the small departs, the great approaches. Good fortune and success.",
    },
    image: {
      zh: "天地交泰，后以財成天地之道，輔相天地之宜，以左右民。",
      en: "Heaven and earth unite — peace. The ruler completes and regulates the course of heaven and earth and assists the people.",
    },
    linesText: [
      { zh: "拔茅茹，以其彙，征吉。", en: "When ribbon-grass is pulled up, the sod comes with it — going brings good fortune.", nature: "auspicious" },
      { zh: "包荒，用馮河，不遐遺，朋亡，得尚于中行。", en: "Bear with the uncultured in kindness; cross the river resolutely; do not neglect what is distant; discard partisanship. One obtains the middle path.", nature: "auspicious" },
      { zh: "無平不陂，無往不復，艱貞無咎。", en: "No plain not followed by a slope; no going not followed by a return. Persevere in difficulty — no blame.", nature: "neutral" },
      { zh: "翩翩不富以其鄰，不戒以孚。", en: "He flutters down, not boasting of his wealth, together with his neighbour, guileless and sincere.", nature: "auspicious" },
      { zh: "帝乙歸妹，以祉元吉。", en: "The sovereign marries off his daughter — this brings blessing and supreme good fortune.", nature: "auspicious" },
      { zh: "城復于隍，勿用師，自邑告命，貞吝。", en: "The wall falls back into the moat. Use no troops now — proclaim your orders in your own town. Perseverance brings humiliation.", nature: "inauspicious" },
    ],
  },
  {
    number: 12,
    nameZh: "否",
    namePinyin: "Pǐ",
    nameEn: "Standstill",
    lines: [0, 0, 0, 1, 1, 1],
    judgment: {
      zh: "否之匪人，不利君子貞，大往小來。",
      en: "Standstill — evil people do not further the perseverance of the superior one. The great departs; the small approaches.",
    },
    image: {
      zh: "天地不交，否；君子以儉德辟難，不可榮以祿。",
      en: "Heaven and earth do not unite — standstill. The superior one falls back upon his inner worth to escape difficulties. He does not allow himself to be honoured with revenue.",
    },
    linesText: [
      { zh: "拔茅茹，以其彙，貞吉亨。", en: "When ribbon-grass is pulled up, the sod comes with it — perseverance brings good fortune and success.", nature: "auspicious" },
      { zh: "包承，小人吉，大人否亨。", en: "They bear and endure — for inferior people good fortune; for the great person standstill, yet success.", nature: "neutral" },
      { zh: "包羞。", en: "They bear shame.", nature: "inauspicious" },
      { zh: "有命無咎，疇離祉。", en: "He who acts at the command of the highest remains without blame — those of like mind partake of the blessing.", nature: "auspicious" },
      { zh: "休否，大人吉；其亡其亡，繫于苞桑。", en: "Standstill gives way — great person, good fortune. 'What if it should fail? What if it should fail?' In this way secure it to a cluster of mulberry shoots.", nature: "auspicious" },
      { zh: "傾否，先否後喜。", en: "The standstill comes to an end — first standstill, then good cheer.", nature: "auspicious" },
    ],
  },
  {
    number: 13,
    nameZh: "同人",
    namePinyin: "Tóng Rén",
    nameEn: "Fellowship",
    lines: [1, 0, 1, 1, 1, 1],
    judgment: {
      zh: "同人于野，亨。利涉大川，利君子貞。",
      en: "Fellowship with people in the open — success. It furthers to cross the great water. Perseverance of the superior one furthers.",
    },
    image: {
      zh: "天與火，同人；君子以類族辨物。",
      en: "Heaven together with fire — fellowship. The superior one sorts and distinguishes things according to their kinds.",
    },
    linesText: [
      { zh: "同人于門，無咎。", en: "Fellowship with people at the gate — no blame.", nature: "auspicious" },
      { zh: "同人于宗，吝。", en: "Fellowship with people in the clan — humiliation.", nature: "inauspicious" },
      { zh: "伏戎于莽，升其高陵，三歲不興。", en: "He hides weapons in the thicket; he climbs the high hill. For three years he does not rise up.", nature: "inauspicious" },
      { zh: "乘其墉，弗克攻，吉。", en: "He climbs up on his wall; he cannot attack. Good fortune.", nature: "auspicious" },
      { zh: "同人先號咷而後笑，大師克相遇。", en: "Men bound in fellowship first weep and lament, but afterward they laugh. After great struggles they succeed in meeting.", nature: "auspicious" },
      { zh: "同人于郊，無悔。", en: "Fellowship with people in the meadow — no remorse.", nature: "neutral" },
    ],
  },
  {
    number: 14,
    nameZh: "大有",
    namePinyin: "Dà Yǒu",
    nameEn: "Great Possession",
    lines: [1, 1, 1, 1, 0, 1],
    judgment: {
      zh: "大有：元亨。",
      en: "Great possession — supreme success.",
    },
    image: {
      zh: "火在天上，大有；君子以遏惡揚善，順天休命。",
      en: "Fire in heaven above — great possession. The superior one curbs evil and furthers good, and thereby obeys the benevolent will of heaven.",
    },
    linesText: [
      { zh: "無交害，匪咎，艱則無咎。", en: "No relationship with what is harmful; there is no blame in this. If one remains conscious of difficulty, one remains without blame.", nature: "neutral" },
      { zh: "大車以載，有攸往，無咎。", en: "A large wagon for loading — one may undertake something. No blame.", nature: "auspicious" },
      { zh: "公用亨于天子，小人弗克。", en: "A prince offers it to the Son of Heaven — a petty man cannot do this.", nature: "auspicious" },
      { zh: "匪其彭，無咎。", en: "He makes a difference between himself and his neighbour — no blame.", nature: "neutral" },
      { zh: "厥孚交如，威如，吉。", en: "He whose truth is accessible, yet dignified, has good fortune.", nature: "auspicious" },
      { zh: "自天祐之，吉，無不利。", en: "He is blessed by heaven — good fortune, nothing that does not further.", nature: "auspicious" },
    ],
  },
  {
    number: 15,
    nameZh: "謙",
    namePinyin: "Qiān",
    nameEn: "Modesty",
    lines: [0, 0, 1, 0, 0, 0],
    judgment: {
      zh: "謙：亨，君子有終。",
      en: "Modesty creates success — the superior one carries things through.",
    },
    image: {
      zh: "地中有山，謙；君子以裒多益寡，稱物平施。",
      en: "Within the earth, a mountain — modesty. The superior one reduces that which is too much and augments that which is too little. He weighs things and makes them equal.",
    },
    linesText: [
      { zh: "謙謙君子，用涉大川，吉。", en: "A superior one modest about his modesty — it furthers to cross the great water. Good fortune.", nature: "auspicious" },
      { zh: "鳴謙，貞吉。", en: "Modesty that comes to expression — perseverance brings good fortune.", nature: "auspicious" },
      { zh: "勞謙，君子有終，吉。", en: "A superior one of meritorious modesty carries things through — good fortune.", nature: "auspicious" },
      { zh: "無不利，撝謙。", en: "Nothing that would not further modesty in movement.", nature: "auspicious" },
      { zh: "不富以其鄰，利用侵伐，無不利。", en: "Not boasting of wealth before one's neighbour — it furthers to attack with force. Nothing that would not further.", nature: "auspicious" },
      { zh: "鳴謙，利用行師，征邑國。", en: "Modesty that comes to expression — it furthers to set armies marching to chastise one's own city and country.", nature: "neutral" },
    ],
  },
  {
    number: 16,
    nameZh: "豫",
    namePinyin: "Yù",
    nameEn: "Enthusiasm",
    lines: [0, 0, 0, 1, 0, 0],
    judgment: {
      zh: "豫：利建侯行師。",
      en: "Enthusiasm — it furthers to install helpers and to set armies marching.",
    },
    image: {
      zh: "雷出地奮，豫；先王以作樂崇德，殷薦之上帝，以配祖考。",
      en: "Thunder comes resounding out of the earth — enthusiasm. The ancient kings made music in order to honour merit, and offered it magnanimously to God, inviting ancestors to be present.",
    },
    linesText: [
      { zh: "鳴豫，凶。", en: "Enthusiasm that expresses itself — misfortune.", nature: "inauspicious" },
      { zh: "介于石，不終日，貞吉。", en: "Firm as a rock — not the whole day. Perseverance brings good fortune.", nature: "auspicious" },
      { zh: "盱豫悔，遲有悔。", en: "Enthusiasm that looks upward creates remorse. Hesitation also creates remorse.", nature: "inauspicious" },
      { zh: "由豫，大有得，勿疑；朋盍簪。", en: "The source of enthusiasm — he achieves great things. Doubt not — friends rally around you.", nature: "auspicious" },
      { zh: "貞疾，恆不死。", en: "Persistently ill, yet does not die.", nature: "neutral" },
      { zh: "冥豫，成有渝，無咎。", en: "Deluded enthusiasm — but if one changes after completion, there is no blame.", nature: "neutral" },
    ],
  },
  {
    number: 17,
    nameZh: "隨",
    namePinyin: "Suí",
    nameEn: "Following",
    lines: [1, 0, 0, 1, 1, 0],
    judgment: { zh: "隨：元亨利貞，無咎。", en: "Following has supreme success. Perseverance brings good fortune and no blame." },
    image: { zh: "澤中有雷，隨；君子以嚮晦入宴息。", en: "Thunder in the middle of the lake — following. The superior one at nightfall withdraws into rest." },
    linesText: [
      { zh: "官有渝，貞吉，出門交有功。", en: "The standard is changing — perseverance brings good fortune. Going out the door in company produces deeds.", nature: "auspicious" },
      { zh: "係小子，失丈夫。", en: "If one clings to the little boy, one loses the strong man.", nature: "inauspicious" },
      { zh: "係丈夫，失小子。隨有求得，利居貞。", en: "If one clings to the strong man, one loses the little boy. Through following one finds what one seeks.", nature: "auspicious" },
      { zh: "隨有獲，貞凶；有孚在道，以明，何咎。", en: "Following creates success — perseverance brings misfortune. To go one's way with sincerity brings clarity.", nature: "neutral" },
      { zh: "孚于嘉，吉。", en: "Sincere in the good — good fortune.", nature: "auspicious" },
      { zh: "拘係之，乃從維之，王用亨于西山。", en: "He meets with firm allegiance and is still further bound. The king sacrifices on the western mountain.", nature: "auspicious" },
    ],
  },
  {
    number: 18,
    nameZh: "蠱",
    namePinyin: "Gǔ",
    nameEn: "Work on the Decayed",
    lines: [0, 1, 1, 0, 0, 1],
    judgment: { zh: "蠱：元亨，利涉大川。", en: "Work on what has been spoiled — supreme success. It furthers to cross the great water." },
    image: { zh: "山下有風，蠱；君子以振民育德。", en: "The wind blows low on the mountain — decay. The superior one stirs up the people and strengthens their spirit." },
    linesText: [
      { zh: "幹父之蠱，有子，考無咎，厲，終吉。", en: "Setting right what the father has spoiled — if there is a son, the father is freed of blame. In the end good fortune.", nature: "auspicious" },
      { zh: "幹母之蠱，不可貞。", en: "Setting right what the mother has spoiled — one must not be too persistent.", nature: "neutral" },
      { zh: "幹父之蠱，小有悔，無大咎。", en: "Setting right what the father spoiled — there will be a little remorse but no great blame.", nature: "neutral" },
      { zh: "裕父之蠱，往見吝。", en: "Tolerating what the father spoiled — going further leads to humiliation.", nature: "inauspicious" },
      { zh: "幹父之蠱，用譽。", en: "Setting right what the father spoiled — one meets with praise.", nature: "auspicious" },
      { zh: "不事王侯，高尚其事。", en: "He does not serve kings and princes — sets himself higher goals.", nature: "auspicious" },
    ],
  },
  {
    number: 19,
    nameZh: "臨",
    namePinyin: "Lín",
    nameEn: "Approach",
    lines: [1, 1, 0, 0, 0, 0],
    judgment: { zh: "臨：元亨利貞，至于八月有凶。", en: "Approach has supreme success. Perseverance furthers. When the eighth month comes, there will be misfortune." },
    image: { zh: "澤上有地，臨；君子以教思無窮，容保民無疆。", en: "The lake rises above the earth — approach. The superior one is inexhaustible in teaching and without limit in protecting the people." },
    linesText: [
      { zh: "咸臨，貞吉。", en: "Joint approach — perseverance brings good fortune.", nature: "auspicious" },
      { zh: "咸臨，吉，無不利。", en: "Joint approach — good fortune. Everything furthers.", nature: "auspicious" },
      { zh: "甘臨，無攸利，既憂之，無咎。", en: "Comfortable approach — nothing furthers. If one grieves over it, one becomes free of blame.", nature: "neutral" },
      { zh: "至臨，無咎。", en: "Complete approach — no blame.", nature: "neutral" },
      { zh: "知臨，大君之宜，吉。", en: "Wise approach — right for a great prince. Good fortune.", nature: "auspicious" },
      { zh: "敦臨，吉，無咎。", en: "Great-hearted approach — good fortune, no blame.", nature: "auspicious" },
    ],
  },
  {
    number: 20,
    nameZh: "觀",
    namePinyin: "Guān",
    nameEn: "Contemplation",
    lines: [0, 0, 0, 0, 1, 1],
    judgment: { zh: "觀：盥而不薦，有孚顒若。", en: "Contemplation — the ablution has been made, but not yet the offering. Full of trust they look up to him." },
    image: { zh: "風行地上，觀；先王以省方觀民設教。", en: "The wind blows over the earth — contemplation. The ancient kings inspected the regions and observed the people to give instruction." },
    linesText: [
      { zh: "童觀，小人無咎，君子吝。", en: "Boy-like contemplation — no blame for inferior people, humiliation for the superior one.", nature: "neutral" },
      { zh: "闚觀，利女貞。", en: "Peeping contemplation — furthers the perseverance of women.", nature: "neutral" },
      { zh: "觀我生進退。", en: "Contemplation of my life — deciding on advance and retreat.", nature: "neutral" },
      { zh: "觀國之光，利用賓于王。", en: "Contemplation of the light of the kingdom — it furthers to be a guest at the court of the king.", nature: "auspicious" },
      { zh: "觀我生，君子無咎。", en: "Contemplation of my life — the superior one is without blame.", nature: "neutral" },
      { zh: "觀其生，君子無咎。", en: "Contemplation of his life — the superior one is without blame.", nature: "neutral" },
    ],
  },
  {
    number: 21,
    nameZh: "噬嗑",
    namePinyin: "Shì Kè",
    nameEn: "Biting Through",
    lines: [1, 0, 0, 1, 0, 1],
    judgment: { zh: "噬嗑：亨，利用獄。", en: "Biting through has success. It furthers to let justice be administered." },
    image: { zh: "雷電，噬嗑；先王以明罰敕法。", en: "Thunder and lightning — biting through. The ancient kings made firm the laws through clearly defined penalties." },
    linesText: [
      { zh: "屨校滅趾，無咎。", en: "His feet are fastened in the stocks so that his toes disappear — no blame.", nature: "neutral" },
      { zh: "噬膚滅鼻，無咎。", en: "Bites through tender meat, so that his nose disappears — no blame.", nature: "neutral" },
      { zh: "噬腊肉，遇毒，小吝，無咎。", en: "Bites on old dried meat and strikes on something poisonous — slight humiliation but no blame.", nature: "neutral" },
      { zh: "噬乾胏，得金矢，利艱貞，吉。", en: "Bites on dried bony meat, gets a metal arrow. It furthers to be mindful of difficulty and persevere. Good fortune.", nature: "auspicious" },
      { zh: "噬乾肉，得黃金，貞厲，無咎。", en: "Bites on dried lean meat, gets yellow gold. Perseverance with awareness of danger — no blame.", nature: "neutral" },
      { zh: "何校滅耳，凶。", en: "His neck is fastened in the wooden cangue so that his ears disappear — misfortune.", nature: "inauspicious" },
    ],
  },
  {
    number: 22,
    nameZh: "賁",
    namePinyin: "Bì",
    nameEn: "Grace",
    lines: [1, 0, 1, 0, 0, 1],
    judgment: { zh: "賁：亨，小利有攸往。", en: "Grace has success. In small matters it is favourable to undertake something." },
    image: { zh: "山下有火，賁；君子以明庶政，無敢折獄。", en: "Fire at the foot of the mountain — grace. The superior one clears up current affairs but does not presume to decide controversial issues." },
    linesText: [
      { zh: "賁其趾，舍車而徒。", en: "He lends grace to his toes, leaves the carriage and walks.", nature: "auspicious" },
      { zh: "賁其須。", en: "Lends grace to the beard on his chin.", nature: "neutral" },
      { zh: "賁如，濡如，永貞吉。", en: "Graceful and moist — eternal perseverance brings good fortune.", nature: "auspicious" },
      { zh: "賁如皤如，白馬翰如，匪寇婚媾。", en: "Grace or simplicity? A white horse comes as if on wings — he is not a robber, he will woo at the right time.", nature: "neutral" },
      { zh: "賁于丘園，束帛戔戔，吝，終吉。", en: "Grace in hills and gardens — rolls of silk, though meagre. Humiliation, but in the end good fortune.", nature: "auspicious" },
      { zh: "白賁，無咎。", en: "Simple grace — no blame.", nature: "auspicious" },
    ],
  },
  {
    number: 23,
    nameZh: "剝",
    namePinyin: "Bō",
    nameEn: "Splitting Apart",
    lines: [0, 0, 0, 0, 0, 1],
    judgment: { zh: "剝：不利有攸往。", en: "Splitting apart — it does not further one to go anywhere." },
    image: { zh: "山附于地，剝；上以厚下安宅。", en: "The mountain rests on the earth — splitting apart. Those above can ensure their position only by giving generously to those below." },
    linesText: [
      { zh: "剝床以足，蔑貞，凶。", en: "The leg of the bed is split — those who persevere are destroyed. Misfortune.", nature: "inauspicious" },
      { zh: "剝床以辨，蔑貞，凶。", en: "The bed is split at the edge — those who persevere are destroyed. Misfortune.", nature: "inauspicious" },
      { zh: "剝之，無咎。", en: "He splits with them — no blame.", nature: "neutral" },
      { zh: "剝床以膚，凶。", en: "The bed is split up to the skin — misfortune.", nature: "inauspicious" },
      { zh: "貫魚，以宮人寵，無不利。", en: "A school of fish — favour through the court ladies. Everything furthers.", nature: "auspicious" },
      { zh: "碩果不食，君子得輿，小人剝廬。", en: "There is a large fruit still uneaten — the superior one receives a carriage; the house of the inferior person is split apart.", nature: "neutral" },
    ],
  },
  {
    number: 24,
    nameZh: "復",
    namePinyin: "Fù",
    nameEn: "Return",
    lines: [1, 0, 0, 0, 0, 0],
    judgment: { zh: "復：亨。出入無疾，朋來無咎，七日來復，利有攸往。", en: "Return — success. Going out and coming in without error; friends come without blame. On the seventh day comes return. It furthers to have somewhere to go." },
    image: { zh: "雷在地中，復；先王以至日閉關。", en: "Thunder within the earth — return. The ancient kings closed the passes at the time of solstice." },
    linesText: [
      { zh: "不遠復，無祗悔，元吉。", en: "Return from a short distance — no need for remorse. Supreme good fortune.", nature: "auspicious" },
      { zh: "休復，吉。", en: "Quiet return — good fortune.", nature: "auspicious" },
      { zh: "頻復，厲無咎。", en: "Repeated return — danger, but no blame.", nature: "neutral" },
      { zh: "中行獨復。", en: "Walking in the midst of others, one returns alone.", nature: "neutral" },
      { zh: "敦復，無悔。", en: "Noble-hearted return — no remorse.", nature: "auspicious" },
      { zh: "迷復，凶，有災眚。", en: "Missing the return — misfortune. Calamity from within and without.", nature: "inauspicious" },
    ],
  },
  {
    number: 25,
    nameZh: "無妄",
    namePinyin: "Wú Wàng",
    nameEn: "Innocence",
    lines: [1, 0, 0, 1, 1, 1],
    judgment: { zh: "無妄：元亨利貞，其匪正有眚，不利有攸往。", en: "Innocence — supreme success. Perseverance furthers. If someone is not as he should be, he has misfortune, and it does not further him to undertake anything." },
    image: { zh: "天下雷行，物與無妄；先王以茂對時育萬物。", en: "Under heaven thunder rolls — all things attain the natural state of innocence. The ancient kings fostered and nourished all beings in harmony with the time." },
    linesText: [
      { zh: "無妄，往吉。", en: "Innocent behaviour brings good fortune.", nature: "auspicious" },
      { zh: "不耕獲，不菑畬，則利有攸往。", en: "If one does not count on the harvest while ploughing — it furthers to undertake something.", nature: "auspicious" },
      { zh: "無妄之災，或繫之牛，行人之得，邑人之災。", en: "Undeserved misfortune — the cow that was tethered by someone is the wanderer's gain, the citizen's loss.", nature: "inauspicious" },
      { zh: "可貞，無咎。", en: "He who can be persevering remains without blame.", nature: "neutral" },
      { zh: "無妄之疾，勿藥有喜。", en: "Use no medicine in an illness incurred through no fault of your own — it will pass of itself.", nature: "auspicious" },
      { zh: "無妄，行有眚，無攸利。", en: "To act brings misfortune if one is without innocence — nothing furthers.", nature: "inauspicious" },
    ],
  },
  {
    number: 26,
    nameZh: "大畜",
    namePinyin: "Dà Chù",
    nameEn: "Great Taming",
    lines: [1, 1, 1, 0, 0, 1],
    judgment: { zh: "大畜：利貞，不家食吉，利涉大川。", en: "The taming power of the great — perseverance furthers. Not eating at home brings good fortune. It furthers to cross the great water." },
    image: { zh: "天在山中，大畜；君子以多識前言往行，以畜其德。", en: "Heaven within the mountain — the taming power of the great. The superior one acquaints himself with many sayings of antiquity to strengthen his character." },
    linesText: [
      { zh: "有厲，利已。", en: "Danger is at hand — it furthers to desist.", nature: "neutral" },
      { zh: "輿說輹。", en: "The axletrees are taken from the wagon.", nature: "neutral" },
      { zh: "良馬逐，利艱貞，利有攸往。", en: "A good horse that follows others — awareness of danger, with perseverance. It furthers to have somewhere to go.", nature: "auspicious" },
      { zh: "童牛之牿，元吉。", en: "The headboard of a young bull — supreme good fortune.", nature: "auspicious" },
      { zh: "豶豕之牙，吉。", en: "The tusk of a gelded boar — good fortune.", nature: "auspicious" },
      { zh: "何天之衢，亨。", en: "One attains the way of heaven — success.", nature: "auspicious" },
    ],
  },
  {
    number: 27,
    nameZh: "頤",
    namePinyin: "Yí",
    nameEn: "Nourishment",
    lines: [1, 0, 0, 0, 0, 1],
    judgment: { zh: "頤：貞吉，觀頤，自求口實。", en: "The corners of the mouth — perseverance brings good fortune. Pay heed to the providing of nourishment and to what a man seeks to fill his own mouth with." },
    image: { zh: "山下有雷，頤；君子以慎言語，節飲食。", en: "At the foot of the mountain, thunder — the corners of the mouth. The superior one is careful of his words and temperate in eating and drinking." },
    linesText: [
      { zh: "舍爾靈龜，觀我朵頤，凶。", en: "You let your magic tortoise go, and look at me with the corners of your mouth drooping — misfortune.", nature: "inauspicious" },
      { zh: "顛頤，拂經于丘頤，征凶。", en: "Turning to the summit for nourishment, deviating from the path — to go on brings misfortune.", nature: "inauspicious" },
      { zh: "拂頤，貞凶，十年勿用。", en: "Turning away from nourishment — perseverance brings misfortune. Do not act thus for ten years.", nature: "inauspicious" },
      { zh: "顛頤，吉，虎視眈眈，其欲逐逐，無咎。", en: "Turning to the summit for provision — good fortune. Spying about with sharp eyes like a tiger with insatiable craving — no blame.", nature: "auspicious" },
      { zh: "拂經，居貞吉，不可涉大川。", en: "Turning away from the path — to remain persevering brings good fortune. One should not cross the great water.", nature: "neutral" },
      { zh: "由頤，厲吉，利涉大川。", en: "The source of nourishment — awareness of danger brings good fortune. It furthers to cross the great water.", nature: "auspicious" },
    ],
  },
  {
    number: 28,
    nameZh: "大過",
    namePinyin: "Dà Guò",
    nameEn: "Great Excess",
    lines: [0, 1, 1, 1, 1, 0],
    judgment: { zh: "大過：棟橈，利有攸往，亨。", en: "Great excess — the ridgepole sags to the breaking point. It furthers to have somewhere to go. Success." },
    image: { zh: "澤滅木，大過；君子以獨立不懼，遯世無悶。", en: "The lake rises above the trees — great excess. The superior one, when he stands alone, is unconcerned, and if he renounces the world, he is undaunted." },
    linesText: [
      { zh: "藉用白茅，無咎。", en: "To spread white rushes underneath — no blame.", nature: "neutral" },
      { zh: "枯楊生稊，老夫得其女妻，無不利。", en: "A dry poplar sprouts at the root — an older man takes a young wife. Everything furthers.", nature: "auspicious" },
      { zh: "棟橈，凶。", en: "The ridgepole sags to the breaking point — misfortune.", nature: "inauspicious" },
      { zh: "棟隆，吉；有它吝。", en: "The ridgepole is braced — good fortune. If there are ulterior motives, it is humiliating.", nature: "auspicious" },
      { zh: "枯楊生華，老婦得其士夫，無咎無譽。", en: "A withered poplar puts forth flowers; an older woman takes a husband. No blame, no praise.", nature: "neutral" },
      { zh: "過涉滅頂，凶，無咎。", en: "One must go through the water — it goes over one's head. Misfortune, but no blame.", nature: "inauspicious" },
    ],
  },
  {
    number: 29,
    nameZh: "坎",
    namePinyin: "Kǎn",
    nameEn: "The Abysmal",
    lines: [0, 1, 0, 0, 1, 0],
    judgment: { zh: "習坎，有孚，維心亨，行有尚。", en: "The abysmal repeated — if you are sincere, you have success in your heart, and whatever you do succeeds." },
    image: { zh: "水洊至，習坎；君子以常德行，習教事。", en: "Water flows on uninterruptedly — the abysmal repeated. The superior one walks in lasting virtue and carries on the business of teaching." },
    linesText: [
      { zh: "習坎，入于坎窞，凶。", en: "Repetition of the abysmal — in the abyss one falls into a pit. Misfortune.", nature: "inauspicious" },
      { zh: "坎有險，求小得。", en: "The abyss is dangerous — one should strive to attain small things only.", nature: "neutral" },
      { zh: "來之坎坎，險且枕，入于坎窞，勿用。", en: "Forward and backward — abyss on abyss. In danger like this, pause and wait; otherwise you will fall into the pit.", nature: "inauspicious" },
      { zh: "樽酒簋貳，用缶，納約自牖，終無咎。", en: "A jug of wine, a bowl of rice, earthen vessels simply handed in through the window. There is certainly no blame in this.", nature: "neutral" },
      { zh: "坎不盈，祗既平，無咎。", en: "The abyss is not filled to overflowing — it is filled only to the rim. No blame.", nature: "neutral" },
      { zh: "係用徽纆，寘于叢棘，三歲不得，凶。", en: "Bound with cords and ropes, shut in between thorn-hedged prison walls — for three years one does not find the way. Misfortune.", nature: "inauspicious" },
    ],
  },
  {
    number: 30,
    nameZh: "離",
    namePinyin: "Lí",
    nameEn: "The Clinging",
    lines: [1, 0, 1, 1, 0, 1],
    judgment: { zh: "離：利貞，亨，畜牝牛吉。", en: "The clinging — perseverance furthers. It brings success. Care of the cow brings good fortune." },
    image: { zh: "明兩作，離；大人以繼明照于四方。", en: "That which is bright rises twice — the clinging. In this way the great person, by perpetuating brightness, illuminates the four quarters of the world." },
    linesText: [
      { zh: "履錯然，敬之，無咎。", en: "The footprints run crisscross — if one is seriously intent, no blame.", nature: "neutral" },
      { zh: "黃離，元吉。", en: "Yellow light — supreme good fortune.", nature: "auspicious" },
      { zh: "日昃之離，不鼓缶而歌，則大耋之嗟，凶。", en: "In the light of the setting sun, men either beat the pot and sing, or loudly bewail the approach of old age. Misfortune.", nature: "inauspicious" },
      { zh: "突如其來如，焚如，死如，棄如。", en: "Its coming is sudden; it flames up, dies down, is thrown away.", nature: "inauspicious" },
      { zh: "出涕沱若，戚嗟若，吉。", en: "Tears in floods, sighing and lamenting — good fortune.", nature: "auspicious" },
      { zh: "王用出征，有嘉折首，獲匪其醜，無咎。", en: "The king uses him to march forth and chastise. Then it is best to kill the leaders and take captive the followers. No blame.", nature: "auspicious" },
    ],
  },
  {
    number: 31,
    nameZh: "咸",
    namePinyin: "Xián",
    nameEn: "Influence",
    lines: [0, 0, 1, 1, 1, 0],
    judgment: { zh: "咸：亨，利貞，取女吉。", en: "Influence — success. Perseverance furthers. To take a maiden to wife brings good fortune." },
    image: { zh: "山上有澤，咸；君子以虛受人。", en: "A lake on the mountain — influence. The superior one encourages people to approach him by his readiness to receive them." },
    linesText: [
      { zh: "咸其拇。", en: "The influence shows itself in the big toe.", nature: "neutral" },
      { zh: "咸其腓，凶，居吉。", en: "The influence shows itself in the calves of the legs — misfortune. Remaining brings good fortune.", nature: "neutral" },
      { zh: "咸其股，執其隨，往吝。", en: "The influence shows itself in the thighs. Holding to that which follows it — to continue is humiliating.", nature: "inauspicious" },
      { zh: "貞吉，悔亡，憧憧往來，朋從爾思。", en: "Perseverance brings good fortune, remorse disappears. If a man is agitated in mind, his comrades follow the direction of his thoughts.", nature: "auspicious" },
      { zh: "咸其脢，無悔。", en: "The influence shows itself in the back of the neck — no remorse.", nature: "neutral" },
      { zh: "咸其輔頰舌。", en: "The influence shows itself in the jaws, cheeks, and tongue.", nature: "neutral" },
    ],
  },
  {
    number: 32,
    nameZh: "恆",
    namePinyin: "Héng",
    nameEn: "Duration",
    lines: [0, 1, 1, 1, 0, 0],
    judgment: { zh: "恆：亨，無咎，利貞，利有攸往。", en: "Duration — success without blame. Perseverance furthers. It furthers to have somewhere to go." },
    image: { zh: "雷風，恆；君子以立不易方。", en: "Thunder and wind — duration. The superior one stands firm and does not change his direction." },
    linesText: [
      { zh: "浚恆，貞凶，無攸利。", en: "Seeking duration too hastily — perseverance brings misfortune. Nothing that would further.", nature: "inauspicious" },
      { zh: "悔亡。", en: "Remorse disappears.", nature: "auspicious" },
      { zh: "不恆其德，或承之羞，貞吝。", en: "He who does not give duration to his character meets with disgrace — persistent humiliation.", nature: "inauspicious" },
      { zh: "田無禽。", en: "No game in the field.", nature: "neutral" },
      { zh: "恆其德，貞，婦人吉，夫子凶。", en: "Giving duration to one's character through perseverance — good fortune for a woman, misfortune for a man.", nature: "neutral" },
      { zh: "振恆，凶。", en: "Restlessness as an enduring condition — misfortune.", nature: "inauspicious" },
    ],
  },
  {
    number: 33,
    nameZh: "遯",
    namePinyin: "Dùn",
    nameEn: "Retreat",
    lines: [0, 0, 1, 1, 1, 1],
    judgment: { zh: "遯：亨，小利貞。", en: "Retreat has success. In what is small, perseverance furthers." },
    image: { zh: "天下有山，遯；君子以遠小人，不惡而嚴。", en: "Mountain under heaven — retreat. The superior one keeps the inferior person at a distance, not angrily but with reserve." },
    linesText: [
      { zh: "遯尾，厲，勿用有攸往。", en: "At the tail in retreat — this is dangerous. One must not seek to undertake anything.", nature: "inauspicious" },
      { zh: "執之用黃牛之革，莫之勝說。", en: "He holds him fast with yellow ox hide — no one can tear him loose.", nature: "neutral" },
      { zh: "係遯，有疾厲，畜臣妾吉。", en: "A halted retreat is nerve-wracking and dangerous — to retain servants and maid servants brings good fortune.", nature: "neutral" },
      { zh: "好遯，君子吉，小人否。", en: "Voluntary retreat brings good fortune to the superior one and downfall to the inferior person.", nature: "auspicious" },
      { zh: "嘉遯，貞吉。", en: "Friendly retreat — perseverance brings good fortune.", nature: "auspicious" },
      { zh: "肥遯，無不利。", en: "Cheerful retreat — nothing that does not further.", nature: "auspicious" },
    ],
  },
  {
    number: 34,
    nameZh: "大壯",
    namePinyin: "Dà Zhuàng",
    nameEn: "Great Power",
    lines: [1, 1, 1, 1, 0, 0],
    judgment: { zh: "大壯：利貞。", en: "The power of the great — perseverance furthers." },
    image: { zh: "雷在天上，大壯；君子以非禮弗履。", en: "Thunder in heaven above — the power of the great. The superior one does not tread upon paths that do not accord with established order." },
    linesText: [
      { zh: "壯于趾，征凶，有孚。", en: "Power in the toes — continuing brings misfortune. This is certainly true.", nature: "inauspicious" },
      { zh: "貞吉。", en: "Perseverance brings good fortune.", nature: "auspicious" },
      { zh: "小人用壯，君子用罔，貞厲。羝羊觸藩，羸其角。", en: "The inferior man works through power; the superior one does not act thus. To continue is dangerous. A ram butts against a fence and entangles his horns.", nature: "inauspicious" },
      { zh: "貞吉悔亡，藩決不羸，壯于大輿之輹。", en: "Perseverance brings good fortune, remorse disappears. The fence opens, there is no entanglement. Power depends upon the axle of a great cart.", nature: "auspicious" },
      { zh: "喪羊于易，無悔。", en: "Loses the sheep at ease — no remorse.", nature: "neutral" },
      { zh: "羝羊觸藩，不能退，不能遂，無攸利，艱則吉。", en: "A ram butts against a fence — he cannot go back, he cannot go forward. Nothing furthers. If one notes the difficulty, this brings good fortune.", nature: "neutral" },
    ],
  },
  {
    number: 35,
    nameZh: "晉",
    namePinyin: "Jìn",
    nameEn: "Progress",
    lines: [0, 0, 0, 1, 0, 1],
    judgment: { zh: "晉：康侯用錫馬蕃庶，晝日三接。", en: "Progress — the powerful prince is honoured with horses in large numbers. In a single day he is granted audience three times." },
    image: { zh: "明出地上，晉；君子以自昭明德。", en: "The sun rises over the earth — progress. The superior one himself brightens his bright virtue." },
    linesText: [
      { zh: "晉如摧如，貞吉，罔孚，裕無咎。", en: "Progressing, but turned back — perseverance brings good fortune. If one meets with no confidence, one should remain gracious. No blame.", nature: "auspicious" },
      { zh: "晉如愁如，貞吉。受茲介福，于其王母。", en: "Progressing, but in sorrow — perseverance brings good fortune. Then one attains great happiness from one's ancestress.", nature: "auspicious" },
      { zh: "眾允，悔亡。", en: "All are in accord — remorse disappears.", nature: "auspicious" },
      { zh: "晉如鼫鼠，貞厲。", en: "Progress like a hamster — perseverance brings danger.", nature: "inauspicious" },
      { zh: "悔亡，失得勿恤，往吉，無不利。", en: "Remorse disappears. Take not gain and loss to heart. Undertakings bring good fortune — everything furthers.", nature: "auspicious" },
      { zh: "晉其角，維用伐邑，厲吉，無咎，貞吝。", en: "Making progress with the horns is permissible only for the purpose of punishing one's own city. To be conscious of danger brings good fortune. No blame. Perseverance brings humiliation.", nature: "neutral" },
    ],
  },
  {
    number: 36,
    nameZh: "明夷",
    namePinyin: "Míng Yí",
    nameEn: "Darkening of the Light",
    lines: [1, 0, 1, 0, 0, 0],
    judgment: { zh: "明夷：利艱貞。", en: "Darkening of the light — in adversity it furthers one to be persevering." },
    image: { zh: "明入地中，明夷；君子以蒞眾，用晦而明。", en: "The light has sunk into the earth — darkening of the light. The superior one lives with the great mass, veiling his light yet still shining." },
    linesText: [
      { zh: "明夷于飛，垂其翼，君子于行，三日不食，有攸往，主人有言。", en: "Darkening of the light during flight — he lowers his wings. The superior man on his wandering eats nothing for three days; but he has somewhere to go.", nature: "neutral" },
      { zh: "明夷，夷于左股，用拯馬壯，吉。", en: "Darkening of the light injures him in the left thigh. He gives aid with the strength of a horse. Good fortune.", nature: "auspicious" },
      { zh: "明夷于南狩，得其大首，不可疾貞。", en: "Darkening of the light during the hunt in the south — their great leader is captured. One must not expect perseverance too soon.", nature: "neutral" },
      { zh: "入于左腹，獲明夷之心，于出門庭。", en: "He penetrates the left side of the belly — one gets at the very heart of the darkening of the light, and leaves gate and courtyard.", nature: "neutral" },
      { zh: "箕子之明夷，利貞。", en: "Darkening of the light as with Prince Chi — perseverance furthers.", nature: "auspicious" },
      { zh: "不明晦，初登于天，後入于地。", en: "Not light but darkness — first he climbed up to heaven, then he plunged into the depths of the earth.", nature: "inauspicious" },
    ],
  },
  {
    number: 37,
    nameZh: "家人",
    namePinyin: "Jiā Rén",
    nameEn: "The Family",
    lines: [1, 0, 1, 0, 1, 1],
    judgment: { zh: "家人：利女貞。", en: "The family — the perseverance of the woman furthers." },
    image: { zh: "風自火出，家人；君子以言有物而行有恆。", en: "Wind comes forth from fire — the family. The superior one has substance in his words and duration in his way of life." },
    linesText: [
      { zh: "閑有家，悔亡。", en: "Firm seclusion within the family — remorse disappears.", nature: "auspicious" },
      { zh: "無攸遂，在中饋，貞吉。", en: "She should not follow her whims; she must attend within to the food. Perseverance brings good fortune.", nature: "auspicious" },
      { zh: "家人嗃嗃，悔厲，吉；婦子嘻嘻，終吝。", en: "When tempers flare in the family, too great severity brings remorse, yet good fortune still. When women and children dally and laugh, it leads in the end to humiliation.", nature: "neutral" },
      { zh: "富家大吉。", en: "She is the treasure of the house — great good fortune.", nature: "auspicious" },
      { zh: "王假有家，勿恤，吉。", en: "As a king he approaches his family — fear not, good fortune.", nature: "auspicious" },
      { zh: "有孚威如，終吉。", en: "His work commands respect. In the end good fortune comes.", nature: "auspicious" },
    ],
  },
  {
    number: 38,
    nameZh: "睽",
    namePinyin: "Kuí",
    nameEn: "Opposition",
    lines: [1, 1, 0, 1, 0, 1],
    judgment: { zh: "睽：小事吉。", en: "Opposition — in small matters, good fortune." },
    image: { zh: "上火下澤，睽；君子以同而異。", en: "Above, fire; below, the lake — opposition. The superior one retains his individuality amid communality." },
    linesText: [
      { zh: "悔亡，喪馬勿逐，自復，見惡人，無咎。", en: "Remorse disappears. If you lose your horse, do not run after it — it will come back of itself. When you see evil people, guard yourself against mistakes. No blame.", nature: "neutral" },
      { zh: "遇主于巷，無咎。", en: "One meets his lord in a narrow street — no blame.", nature: "neutral" },
      { zh: "見輿曳，其牛掣，其人天且劓，無初有終。", en: "One sees the wagon dragged back, the oxen halted, a man's hair and nose cut off. Not a good beginning, but a good end.", nature: "neutral" },
      { zh: "睽孤，遇元夫，交孚，厲，無咎。", en: "Isolated through opposition — one meets a like-minded man with whom one can associate in good faith. Despite the danger, no blame.", nature: "auspicious" },
      { zh: "悔亡，厥宗噬膚，往何咎。", en: "Remorse disappears. The companion bites his way through the wrappings. If one goes to him, how could it be a mistake?", nature: "auspicious" },
      { zh: "睽孤，見豕負塗，載鬼一車，先張之弧，後說之弧，匪寇婚媾，往遇雨則吉。", en: "Isolated through opposition — one sees one's companion as a pig covered with dirt. First one draws a bow against him, then one lays the bow aside, for he is not a robber but a kinsman. Going, one meets the rain, then good fortune comes.", nature: "auspicious" },
    ],
  },
  {
    number: 39,
    nameZh: "蹇",
    namePinyin: "Jiǎn",
    nameEn: "Obstruction",
    lines: [0, 0, 1, 0, 1, 0],
    judgment: { zh: "蹇：利西南，不利東北，利見大人，貞吉。", en: "Obstruction — the southwest furthers. The northeast does not further. It furthers to see the great man. Perseverance brings good fortune." },
    image: { zh: "山上有水，蹇；君子以反身修德。", en: "Water on the mountain — obstruction. The superior one turns his attention to himself and moulds his character." },
    linesText: [
      { zh: "往蹇來譽。", en: "Going leads to obstructions; coming meets with praise.", nature: "auspicious" },
      { zh: "王臣蹇蹇，匪躬之故。", en: "The king's servant is beset by obstruction upon obstruction, but it is not his own fault.", nature: "neutral" },
      { zh: "往蹇來反。", en: "Going leads to obstructions; hence he comes back.", nature: "neutral" },
      { zh: "往蹇來連。", en: "Going leads to obstructions; coming leads to union.", nature: "auspicious" },
      { zh: "大蹇，朋來。", en: "In the midst of the greatest obstructions, friends come.", nature: "auspicious" },
      { zh: "往蹇來碩，吉，利見大人。", en: "Going leads to obstructions, coming leads to great good fortune. It furthers one to see the great man.", nature: "auspicious" },
    ],
  },
  {
    number: 40,
    nameZh: "解",
    namePinyin: "Jiě",
    nameEn: "Deliverance",
    lines: [0, 1, 0, 1, 0, 0],
    judgment: { zh: "解：利西南，無所往，其來復吉；有攸往，夙吉。", en: "Deliverance — the southwest furthers. If there is no longer anything where one has to go, return brings good fortune. If there is still something where one has to go, hastening brings good fortune." },
    image: { zh: "雷雨作，解；君子以赦過宥罪。", en: "Thunder and rain set in — deliverance. The superior one pardons mistakes and forgives misdeeds." },
    linesText: [
      { zh: "無咎。", en: "No blame.", nature: "neutral" },
      { zh: "田獲三狐，得黃矢，貞吉。", en: "One kills three foxes in the field and receives a yellow arrow. Perseverance brings good fortune.", nature: "auspicious" },
      { zh: "負且乘，致寇至，貞吝。", en: "If a man carries a burden on his back and nonetheless rides in a carriage, he thereby encourages robbers to draw near. Perseverance leads to humiliation.", nature: "inauspicious" },
      { zh: "解而拇，朋至斯孚。", en: "Deliver yourself from your great toe — then the companion comes, and him you can trust.", nature: "auspicious" },
      { zh: "君子維有解，吉，有孚于小人。", en: "If only the superior one can deliver himself, it brings good fortune. Thus he proves to inferior men that he is in earnest.", nature: "auspicious" },
      { zh: "公用射隼于高墉之上，獲之，無不利。", en: "The prince shoots at a hawk on a high wall. He kills it. Everything furthers.", nature: "auspicious" },
    ],
  },
  {
    number: 41,
    nameZh: "損",
    namePinyin: "Sǔn",
    nameEn: "Decrease",
    lines: [1, 1, 0, 0, 0, 1],
    judgment: { zh: "損：有孚元吉，無咎，可貞，利有攸往，曷之用，二簋可用享。", en: "Decrease combined with sincerity brings about supreme good fortune without blame. One may be persevering in this. It furthers to undertake something." },
    image: { zh: "山下有澤，損；君子以懲忿窒慾。", en: "At the foot of the mountain, the lake — decrease. The superior one controls his anger and restrains his instincts." },
    linesText: [
      { zh: "已事遄往，無咎，酌損之。", en: "Going quickly when one's tasks are finished is without blame. But one must reflect on how much one is able to decrease others.", nature: "neutral" },
      { zh: "利貞，征凶，弗損益之。", en: "Perseverance furthers. To undertake something brings misfortune. Without decreasing oneself, one is able to bring increase to others.", nature: "auspicious" },
      { zh: "三人行則損一人，一人行則得其友。", en: "When three people journey together, their number decreases by one. When one man journeys alone, he finds a companion.", nature: "neutral" },
      { zh: "損其疾，使遄有喜，無咎。", en: "If a man decreases his faults, it makes the other hasten to come and rejoice. No blame.", nature: "auspicious" },
      { zh: "或益之十朋之龜，弗克違，元吉。", en: "Someone does indeed increase him — ten pairs of tortoises cannot oppose it. Supreme good fortune.", nature: "auspicious" },
      { zh: "弗損益之，無咎，貞吉，利有攸往，得臣無家。", en: "If one is increased without depriving others, there is no blame. Perseverance brings good fortune. It furthers to undertake something. One obtains servants but no longer has a separate home.", nature: "auspicious" },
    ],
  },
  {
    number: 42,
    nameZh: "益",
    namePinyin: "Yì",
    nameEn: "Increase",
    lines: [1, 0, 0, 0, 1, 1],
    judgment: { zh: "益：利有攸往，利涉大川。", en: "Increase — it furthers one to undertake something. It furthers one to cross the great water." },
    image: { zh: "風雷，益；君子以見善則遷，有過則改。", en: "Wind and thunder — increase. The superior one, if he sees good, imitates it; if he has faults, he rids himself of them." },
    linesText: [
      { zh: "利用為大作，元吉，無咎。", en: "It furthers one to accomplish great deeds. Supreme good fortune. No blame.", nature: "auspicious" },
      { zh: "或益之十朋之龜，弗克違，永貞吉，王用享于帝，吉。", en: "Someone does indeed increase him — ten pairs of tortoises cannot oppose it. Constant perseverance brings good fortune. The king presents him before God. Good fortune.", nature: "auspicious" },
      { zh: "益之用凶事，無咎，有孚中行，告公用圭。", en: "One is enriched through unfortunate events. No blame, if you are sincere and walk in the middle, and report with a jade tablet to the prince.", nature: "neutral" },
      { zh: "中行告公從，利用為依遷國。", en: "If you walk in the middle and report to the prince, he will follow. It furthers one to be used in the removal of the capital.", nature: "auspicious" },
      { zh: "有孚惠心，勿問元吉，有孚惠我德。", en: "If in truth you have a kind heart, ask not. Supreme good fortune. Truly, kindness will be recognized as your virtue.", nature: "auspicious" },
      { zh: "莫益之，或擊之，立心勿恆，凶。", en: "He brings increase to no one. Indeed, someone even strikes him. He does not keep his heart constantly steady — misfortune.", nature: "inauspicious" },
    ],
  },
  {
    number: 43,
    nameZh: "夬",
    namePinyin: "Guài",
    nameEn: "Breakthrough",
    lines: [1, 1, 1, 1, 1, 0],
    judgment: { zh: "夬：揚于王庭，孚號有厲，告自邑，不利即戎，利有攸往。", en: "Breakthrough — one must resolutely make the matter known at the court of the king. It must be announced truthfully. Danger. It is necessary to notify one's own city. It does not further to resort to arms. It furthers to undertake something." },
    image: { zh: "澤上于天，夬；君子以施祿及下，居德則忌。", en: "The lake has risen up to heaven — breakthrough. The superior one dispenses riches downward and refrains from resting on his virtue." },
    linesText: [
      { zh: "壯于前趾，往不勝為咎。", en: "Mighty in the forward-striding toes — going forward without being equal to the task leads to misfortune.", nature: "inauspicious" },
      { zh: "惕號，莫夜有戎，勿恤。", en: "A cry of alarm. Arms at evening and at night — fear nothing.", nature: "neutral" },
      { zh: "壯于頄，有凶，君子夬夬，獨行遇雨，若濡有慍，無咎。", en: "To be powerful in the cheekbones brings misfortune. The superior one is firmly resolved. He walks alone and is caught in the rain. He is bespattered, and people murmur against him. No blame.", nature: "neutral" },
      { zh: "臀無膚，其行次且，牽羊悔亡；聞言不信。", en: "There is no skin on his thighs, and walking comes hard. If a man were to let himself be led like a sheep, remorse would disappear. But if these words are heard they will not be believed.", nature: "neutral" },
      { zh: "莧陸夬夬，中行無咎。", en: "In dealing with weeds, firm resolution is necessary. Walking in the middle remains without blame.", nature: "neutral" },
      { zh: "無號，終有凶。", en: "No cry. In the end misfortune comes.", nature: "inauspicious" },
    ],
  },
  {
    number: 44,
    nameZh: "姤",
    namePinyin: "Gòu",
    nameEn: "Coming to Meet",
    lines: [0, 1, 1, 1, 1, 1],
    judgment: { zh: "姤：女壯，勿用取女。", en: "Coming to meet — the maiden is powerful. One should not marry such a maiden." },
    image: { zh: "天下有風，姤；后以施命誥四方。", en: "Under heaven, wind — coming to meet. The sovereign distributes his commands and proclaims them to the four quarters of heaven." },
    linesText: [
      { zh: "繫于金柅，貞吉，有攸往，見凶，羸豕孚蹢躅。", en: "It must be checked with a brake of bronze. Perseverance brings good fortune. If one lets it take its course, one experiences misfortune. Even a lean pig has it in him to rage around.", nature: "neutral" },
      { zh: "包有魚，無咎，不利賓。", en: "There is a fish in the tank. No blame. Does not further guests.", nature: "neutral" },
      { zh: "臀無膚，其行次且，厲，無大咎。", en: "There is no skin on his thighs, and walking comes hard. If one is mindful of the danger, no great mistake is made.", nature: "neutral" },
      { zh: "包無魚，起凶。", en: "No fish in the tank. This leads to misfortune.", nature: "inauspicious" },
      { zh: "以杞包瓜，含章，有隕自天。", en: "A melon covered with willow leaves — hidden lines. Then it drops down to one from heaven.", nature: "auspicious" },
      { zh: "姤其角，吝，無咎。", en: "He comes to meet with his horns. Humiliation, but no blame.", nature: "neutral" },
    ],
  },
  {
    number: 45,
    nameZh: "萃",
    namePinyin: "Cuì",
    nameEn: "Gathering Together",
    lines: [0, 0, 0, 1, 1, 0],
    judgment: { zh: "萃：亨，王假有廟，利見大人，亨，利貞，用大牲吉，利有攸往。", en: "Gathering together — success. The king approaches his temple. It furthers to see the great man. This brings success. Perseverance furthers. To bring great offerings creates good fortune. It furthers to undertake something." },
    image: { zh: "澤上于地，萃；君子以除戎器，戒不虞。", en: "Over the earth, the lake — gathering together. The superior one renews his weapons in order to meet the unforeseen." },
    linesText: [
      { zh: "有孚不終，乃亂乃萃，若號，一握為笑，勿恤，往無咎。", en: "If you are sincere, but not to the end, there will sometimes be confusion, sometimes gathering together. If you call out, then after one grasp of the hand you can laugh again. Regret not — going brings no blame.", nature: "neutral" },
      { zh: "引吉，無咎，孚乃利用禴。", en: "Letting oneself be drawn brings good fortune and remains blameless. If one is sincere, it is furthering to bring even a small offering.", nature: "auspicious" },
      { zh: "萃如嗟如，無攸利，往無咎，小吝。", en: "Gathering together amid sighs — nothing is furthered. Going is without blame. Slight humiliation.", nature: "neutral" },
      { zh: "大吉，無咎。", en: "Great good fortune. No blame.", nature: "auspicious" },
      { zh: "萃有位，無咎，匪孚，元永貞，悔亡。", en: "If in gathering together one has position, no blame. If there are some who are not yet sincerely in the work, sublime and enduring perseverance is needed — then remorse disappears.", nature: "neutral" },
      { zh: "齎咨涕洟，無咎。", en: "Lamenting and sighing, floods of tears — no blame.", nature: "neutral" },
    ],
  },
  {
    number: 46,
    nameZh: "升",
    namePinyin: "Shēng",
    nameEn: "Pushing Upward",
    lines: [0, 1, 1, 0, 0, 0],
    judgment: { zh: "升：元亨，用見大人，勿恤，南征吉。", en: "Pushing upward — supreme success. One must see the great man. Fear not. Departure toward the south brings good fortune." },
    image: { zh: "地中生木，升；君子以順德，積小以高大。", en: "Within the earth, wood grows — pushing upward. The superior one of devoted character heaps up small things in order to achieve something high and great." },
    linesText: [
      { zh: "允升，大吉。", en: "Pushing upward that meets with confidence — great good fortune.", nature: "auspicious" },
      { zh: "孚乃利用禴，無咎。", en: "If one is sincere, it is furthering to bring even a small offering. No blame.", nature: "auspicious" },
      { zh: "升虛邑。", en: "One pushes upward into an empty city.", nature: "neutral" },
      { zh: "王用亨于岐山，吉，無咎。", en: "The king offers him Mount Chi. Good fortune. No blame.", nature: "auspicious" },
      { zh: "貞吉，升階。", en: "Perseverance brings good fortune. One pushes upward by steps.", nature: "auspicious" },
      { zh: "冥升，利于不息之貞。", en: "Pushing upward in darkness — it furthers one to be unremittingly persevering.", nature: "neutral" },
    ],
  },
  {
    number: 47,
    nameZh: "困",
    namePinyin: "Kùn",
    nameEn: "Oppression",
    lines: [0, 1, 0, 1, 1, 0],
    judgment: { zh: "困：亨，貞大人吉，無咎，有言不信。", en: "Oppression — success. Perseverance. The great man brings about good fortune. No blame. When one has something to say, it is not believed." },
    image: { zh: "澤無水，困；君子以致命遂志。", en: "There is no water in the lake — oppression. The superior one stakes his life on following his will." },
    linesText: [
      { zh: "臀困于株木，入于幽谷，三歲不覿。", en: "One sits oppressed under a bare tree and strays into a gloomy valley. For three years one sees nothing.", nature: "inauspicious" },
      { zh: "困于酒食，朱紱方來，利用享祀，征凶，無咎。", en: "One is oppressed while at meat and drink. The man with the scarlet knee bands is just coming. It furthers one to offer sacrifice. To set forth brings misfortune. No blame.", nature: "neutral" },
      { zh: "困于石，據于蒺藜，入于其宮，不見其妻，凶。", en: "A man permits himself to be oppressed by stone, and leans on thorns and thistles. He enters his house and does not see his wife. Misfortune.", nature: "inauspicious" },
      { zh: "來徐徐，困于金車，吝，有終。", en: "He comes very slowly, oppressed in a golden carriage. Humiliation, but the end is reached.", nature: "neutral" },
      { zh: "劓刖，困于赤紱，乃徐有說，利用祭祀。", en: "His nose and feet are cut off. Oppression at the hands of the man with the purple knee bands. Joy comes softly. It furthers one to make offerings and libations.", nature: "neutral" },
      { zh: "困于葛藟，于臲卼，曰動悔，有悔，征吉。", en: "He is oppressed by creeping vines. He moves uncertainly and says, 'Movement brings remorse.' If one feels remorse over this and makes a start, good fortune comes.", nature: "auspicious" },
    ],
  },
  {
    number: 48,
    nameZh: "井",
    namePinyin: "Jǐng",
    nameEn: "The Well",
    lines: [0, 1, 1, 0, 1, 0],
    judgment: { zh: "井：改邑不改井，無喪無得，往來井井，汔至亦未繘井，羸其瓶，凶。", en: "The well — the town may be changed, but the well cannot be changed. It neither decreases nor increases. They come and go and draw from the well. If one gets down almost to the water and the rope does not go all the way, or the jug breaks, it brings misfortune." },
    image: { zh: "木上有水，井；君子以勞民勸相。", en: "Water over wood — the well. The superior one encourages the people at their work, and exhorts them to help one another." },
    linesText: [
      { zh: "井泥不食，舊井無禽。", en: "One does not drink the mud of the well. No animals come to an old well.", nature: "inauspicious" },
      { zh: "井谷射鮒，甕敝漏。", en: "At the well hole one shoots fishes. The jug is broken and leaks.", nature: "inauspicious" },
      { zh: "井渫不食，為我心惻，可用汲，王明，並受其福。", en: "The well is cleaned, but no one drinks from it. This is my heart's sorrow, for one might draw from it. If the king were clear-minded, good fortune might be enjoyed in common.", nature: "neutral" },
      { zh: "井甃，無咎。", en: "The well is being lined — no blame.", nature: "neutral" },
      { zh: "井洌，寒泉食。", en: "In the well there is a clear, cold spring from which one can drink.", nature: "auspicious" },
      { zh: "井收勿幕，有孚元吉。", en: "One draws from the well without hindrance — it is dependable. Supreme good fortune.", nature: "auspicious" },
    ],
  },
  {
    number: 49,
    nameZh: "革",
    namePinyin: "Gé",
    nameEn: "Revolution",
    lines: [1, 0, 1, 1, 1, 0],
    judgment: { zh: "革：己日乃孚，元亨利貞，悔亡。", en: "Revolution — on your own day you are believed. Supreme success. Perseverance furthers. Remorse disappears." },
    image: { zh: "澤中有火，革；君子以治曆明時。", en: "Fire in the lake — revolution. The superior one sets the calendar in order and makes the seasons clear." },
    linesText: [
      { zh: "鞏用黃牛之革。", en: "Wrapped in the hide of a yellow cow.", nature: "neutral" },
      { zh: "己日乃革之，征吉，無咎。", en: "When one's own day comes, one may create revolution. Starting brings good fortune. No blame.", nature: "auspicious" },
      { zh: "征凶，貞厲，革言三就，有孚。", en: "Starting brings misfortune — perseverance brings danger. When talk of revolution has gone the rounds three times, one may commit himself, and men will believe him.", nature: "neutral" },
      { zh: "悔亡，有孚改命，吉。", en: "Remorse disappears. Men believe him. Changing the form of government brings good fortune.", nature: "auspicious" },
      { zh: "大人虎變，未占有孚。", en: "The great man changes like a tiger. Even before he questions the oracle he is believed.", nature: "auspicious" },
      { zh: "君子豹變，小人革面，征凶，居貞吉。", en: "The superior one changes like a panther. The inferior man moulds his face anew. Going forward brings misfortune. To remain persevering brings good fortune.", nature: "neutral" },
    ],
  },
  {
    number: 50,
    nameZh: "鼎",
    namePinyin: "Dǐng",
    nameEn: "The Cauldron",
    lines: [0, 1, 1, 1, 0, 1],
    judgment: { zh: "鼎：元吉亨。", en: "The cauldron — supreme good fortune. Success." },
    image: { zh: "木上有火，鼎；君子以正位凝命。", en: "Fire over wood — the cauldron. The superior one consolidates his fate by making his position correct." },
    linesText: [
      { zh: "鼎顛趾，利出否，得妾以其子，無咎。", en: "A cauldron with legs upturned — it furthers removing stagnating stuff. One takes a concubine for the sake of her son. No blame.", nature: "neutral" },
      { zh: "鼎有實，我仇有疾，不我能即，吉。", en: "There is food in the cauldron. My comrades are envious, but they cannot harm me. Good fortune.", nature: "auspicious" },
      { zh: "鼎耳革，其行塞，雉膏不食，方雨虧悔，終吉。", en: "The handle of the cauldron is altered. One is impeded in his way of life. The fat of the pheasant is not eaten. Once rain falls, remorse is spent. Good fortune comes in the end.", nature: "neutral" },
      { zh: "鼎折足，覆公餗，其形渥，凶。", en: "The legs of the cauldron are broken. The prince's meal is spilled and his person is soiled. Misfortune.", nature: "inauspicious" },
      { zh: "鼎黃耳金鉉，利貞。", en: "The cauldron has yellow handles, golden carrying rings — it furthers to be persevering.", nature: "auspicious" },
      { zh: "鼎玉鉉，大吉，無不利。", en: "The cauldron has rings of jade. Great good fortune. Nothing that would not act to further.", nature: "auspicious" },
    ],
  },
  {
    number: 51,
    nameZh: "震",
    namePinyin: "Zhèn",
    nameEn: "The Arousing",
    lines: [1, 0, 0, 1, 0, 0],
    judgment: { zh: "震：亨，震來虩虩，笑言啞啞，震驚百里，不喪匕鬯。", en: "The arousing — success. Shock comes and one keeps careful. Then laughter and talk. The shock terrifies for a hundred miles, and yet one does not let fall the sacrificial spoon and chalice." },
    image: { zh: "洊雷，震；君子以恐懼修省。", en: "Thunder repeated — the arousing. The superior one in fear and trembling sets his life in order and examines himself." },
    linesText: [
      { zh: "震來虩虩，後笑言啞啞，吉。", en: "Shock comes and one keeps careful — afterwards laughter and talk. Good fortune.", nature: "auspicious" },
      { zh: "震來厲，億喪貝，躋于九陵，勿逐，七日得。", en: "Shock comes bringing danger. A hundred thousand times you lose your treasures — climb the nine hills; do not go after them. After seven days you will get them back again.", nature: "neutral" },
      { zh: "震蘇蘇，震行無眚。", en: "Shock comes and makes one distraught. If shock spurs to action one remains free of misfortune.", nature: "neutral" },
      { zh: "震遂泥。", en: "Shock is mired.", nature: "inauspicious" },
      { zh: "震往來厲，億無喪，有事。", en: "Shock goes hither and thither — danger. However, nothing at all is lost. Yet there are things to be done.", nature: "neutral" },
      { zh: "震索索，視矍矍，征凶。震不于其躬，于其鄰，無咎，婚媾有言。", en: "Shock brings ruin and terrified gazing around. Going ahead brings misfortune. If it has not yet touched one's own body but has reached one's neighbour first, there is no blame. One's comrades have something to talk about.", nature: "neutral" },
    ],
  },
  {
    number: 52,
    nameZh: "艮",
    namePinyin: "Gěn",
    nameEn: "Keeping Still",
    lines: [0, 0, 1, 0, 0, 1],
    judgment: { zh: "艮其背，不獲其身，行其庭，不見其人，無咎。", en: "Keeping still — keeping his back so that he no longer feels his body. He goes into his courtyard and does not see his people. No blame." },
    image: { zh: "兼山，艮；君子以思不出其位。", en: "Mountains standing close together — keeping still. The superior one does not permit his thoughts to go beyond his situation." },
    linesText: [
      { zh: "艮其趾，無咎，利永貞。", en: "Keeping his toes still — no blame. Continued perseverance furthers.", nature: "neutral" },
      { zh: "艮其腓，不拯其隨，其心不快。", en: "Keeping his calves still. He cannot rescue him whom he follows. His heart is not glad.", nature: "neutral" },
      { zh: "艮其限，列其夤，厲薰心。", en: "Keeping his hips still, making his sacrum stiff. Dangerous — the heart suffocates.", nature: "inauspicious" },
      { zh: "艮其身，無咎。", en: "Keeping his trunk still — no blame.", nature: "neutral" },
      { zh: "艮其輔，言有序，悔亡。", en: "Keeping his jaws still. The words are well-ordered — remorse disappears.", nature: "auspicious" },
      { zh: "敦艮，吉。", en: "Noble-hearted keeping still — good fortune.", nature: "auspicious" },
    ],
  },
  {
    number: 53,
    nameZh: "漸",
    namePinyin: "Jiàn",
    nameEn: "Development",
    lines: [0, 0, 1, 0, 1, 1],
    judgment: { zh: "漸：女歸吉，利貞。", en: "Development — the maiden is given in marriage. Good fortune. Perseverance furthers." },
    image: { zh: "山上有木，漸；君子以居賢德善俗。", en: "On the mountain, a tree — development. The superior one abides in dignity and virtue to improve the mores." },
    linesText: [
      { zh: "鴻漸于干，小子厲，有言，無咎。", en: "The wild goose gradually draws near the shore. The young son is in danger. There is talk. No blame.", nature: "neutral" },
      { zh: "鴻漸于磐，飲食衎衎，吉。", en: "The wild goose gradually draws near the cliff. Eating and drinking in peace and concord. Good fortune.", nature: "auspicious" },
      { zh: "鴻漸于陸，夫征不復，婦孕不育，凶，利禦寇。", en: "The wild goose gradually draws near the plateau. The man goes forth and does not return. The woman carries a child but does not bring it forth. Misfortune. It furthers to fight off robbers.", nature: "inauspicious" },
      { zh: "鴻漸于木，或得其桷，無咎。", en: "The wild goose gradually draws near the tree. Perhaps it will find a flat branch. No blame.", nature: "neutral" },
      { zh: "鴻漸于陵，婦三歲不孕，終莫之勝，吉。", en: "The wild goose gradually draws near the summit. For three years the woman has no child. In the end nothing can hinder her. Good fortune.", nature: "auspicious" },
      { zh: "鴻漸于陸，其羽可用為儀，吉。", en: "The wild goose gradually draws near the cloud heights. Its feathers can be used for the sacred dance. Good fortune.", nature: "auspicious" },
    ],
  },
  {
    number: 54,
    nameZh: "歸妹",
    namePinyin: "Guī Mèi",
    nameEn: "The Marrying Maiden",
    lines: [1, 1, 0, 1, 0, 0],
    judgment: { zh: "歸妹：征凶，無攸利。", en: "The marrying maiden — undertakings bring misfortune. Nothing that would further." },
    image: { zh: "澤上有雷，歸妹；君子以永終知敝。", en: "Thunder over the lake — the marrying maiden. The superior one understands the transitory in the light of the eternity of the end." },
    linesText: [
      { zh: "歸妹以娣，跛能履，征吉。", en: "The marrying maiden as a concubine. A lame man who is able to tread. Undertakings bring good fortune.", nature: "auspicious" },
      { zh: "眇能視，利幽人之貞。", en: "A one-eyed man who is able to see. The perseverance of a solitary man furthers.", nature: "neutral" },
      { zh: "歸妹以須，反歸以娣。", en: "The marrying maiden as a slave. She marries as a concubine.", nature: "inauspicious" },
      { zh: "歸妹愆期，遲歸有時。", en: "The marrying maiden draws out the allotted time. A late marriage comes in due course.", nature: "neutral" },
      { zh: "帝乙歸妹，其君之袂不如其娣之袂良，月幾望，吉。", en: "The sovereign gives his maiden in marriage. As embroidered garments are inferior to the simple ones, the moon that is nearly full brings good fortune.", nature: "auspicious" },
      { zh: "女承筐無實，士刲羊無血，無攸利。", en: "The woman holds the basket, but there are no fruits in it. The man stabs the sheep, but no blood flows. Nothing that acts to further.", nature: "inauspicious" },
    ],
  },
  {
    number: 55,
    nameZh: "豐",
    namePinyin: "Fēng",
    nameEn: "Abundance",
    lines: [1, 0, 1, 1, 0, 0],
    judgment: { zh: "豐：亨，王假之，勿憂，宜日中。", en: "Abundance has success. The king attains abundance. Be not sad — be like the sun at midday." },
    image: { zh: "雷電皆至，豐；君子以折獄致刑。", en: "Both thunder and lightning come — abundance. The superior one decides lawsuits and carries out punishments." },
    linesText: [
      { zh: "遇其配主，雖旬無咎，往有尚。", en: "When a man meets his destined ruler, they can be together even if the period lasts ten days. Going is without blame.", nature: "auspicious" },
      { zh: "豐其蔀，日中見斗，往得疑疾，有孚發若，吉。", en: "The curtain is of such fullness that the polar stars can be seen at noon. Through going one meets with mistrust and hate. If one rouses him through truth, good fortune comes.", nature: "neutral" },
      { zh: "豐其沛，日中見沫，折其右肱，無咎。", en: "The underbrush is of such abundance that the small stars can be seen at noon. He breaks his right arm. No blame.", nature: "neutral" },
      { zh: "豐其蔀，日中見斗，遇其夷主，吉。", en: "The curtain is of such fullness that the polar stars can be seen at noon. He meets his ruler, who is of equal kind. Good fortune.", nature: "auspicious" },
      { zh: "來章，有慶譽，吉。", en: "Lines are coming; blessing and fame draw near. Good fortune.", nature: "auspicious" },
      { zh: "豐其屋，蔀其家，闚其戶，闃其無人，三歲不覿，凶。", en: "His house is in a state of abundance. He screens off his family. He peeks in at his door and it is still and empty. For three years no one is to be seen. Misfortune.", nature: "inauspicious" },
    ],
  },
  {
    number: 56,
    nameZh: "旅",
    namePinyin: "Lǚ",
    nameEn: "The Wanderer",
    lines: [0, 0, 1, 1, 0, 1],
    judgment: { zh: "旅：小亨，旅貞吉。", en: "The wanderer — success through smallness. Perseverance brings good fortune to the wanderer." },
    image: { zh: "山上有火，旅；君子以明慎用刑，而不留獄。", en: "Fire on the mountain — the wanderer. The superior one is clear-minded and cautious in imposing penalties, and protracts no lawsuits." },
    linesText: [
      { zh: "旅瑣瑣，斯其所取災。", en: "If the wanderer busies himself with trivial things, he draws down misfortune upon himself.", nature: "inauspicious" },
      { zh: "旅即次，懷其資，得童僕貞。", en: "The wanderer comes to an inn. He has his property with him. He wins the steadfastness of a young servant.", nature: "auspicious" },
      { zh: "旅焚其次，喪其童僕，貞厲。", en: "The wanderer's inn burns down. He loses the steadfastness of his young servant. Danger.", nature: "inauspicious" },
      { zh: "旅于處，得其資斧，我心不快。", en: "The wanderer rests in a shelter. He obtains his property and an axe. My heart is not glad.", nature: "neutral" },
      { zh: "射雉，一矢亡，終以譽命。", en: "He shoots a pheasant. It drops with the first arrow. In the end this brings both praise and a responsible position.", nature: "auspicious" },
      { zh: "鳥焚其巢，旅人先笑後號咷，喪牛于易，凶。", en: "The bird's nest burns up. The wanderer laughs at first, then must needs lament and weep. Through carelessness he loses his cow. Misfortune.", nature: "inauspicious" },
    ],
  },
  {
    number: 57,
    nameZh: "巽",
    namePinyin: "Xùn",
    nameEn: "The Gentle",
    lines: [0, 1, 1, 0, 1, 1],
    judgment: { zh: "巽：小亨，利有攸往，利見大人。", en: "The gentle — success through what is small. It furthers one to have somewhere to go. It furthers one to see the great man." },
    image: { zh: "隨風，巽；君子以申命行事。", en: "Winds following one upon the other — the gentle. The superior one spreads his commands abroad and carries out his undertakings." },
    linesText: [
      { zh: "進退，利武人之貞。", en: "In advancing and in retreating, the perseverance of a warrior furthers.", nature: "neutral" },
      { zh: "巽在床下，用史巫紛若，吉，無咎。", en: "Penetration under the bed. Priests and magicians are used in great number. Good fortune. No blame.", nature: "auspicious" },
      { zh: "頻巽，吝。", en: "Repeated penetration — humiliation.", nature: "inauspicious" },
      { zh: "悔亡，田獲三品。", en: "Remorse vanishes. During the hunt three kinds of game are caught.", nature: "auspicious" },
      { zh: "貞吉悔亡，無不利，無初有終，先庚三日，後庚三日，吉。", en: "Perseverance brings good fortune, remorse vanishes, nothing that does not further. No beginning, but an end. Before the change, three days; after the change, three days. Good fortune.", nature: "auspicious" },
      { zh: "巽在床下，喪其資斧，貞凶。", en: "Penetration under the bed. He loses his property and his axe. Perseverance brings misfortune.", nature: "inauspicious" },
    ],
  },
  {
    number: 58,
    nameZh: "兌",
    namePinyin: "Duì",
    nameEn: "The Joyous",
    lines: [1, 1, 0, 1, 1, 0],
    judgment: { zh: "兌：亨，利貞。", en: "The joyous — success. Perseverance is favourable." },
    image: { zh: "麗澤，兌；君子以朋友講習。", en: "Lakes resting one on the other — the joyous. The superior one joins with his friends for discussion and practice.", },
    linesText: [
      { zh: "和兌，吉。", en: "Contented joyousness — good fortune.", nature: "auspicious" },
      { zh: "孚兌，吉，悔亡。", en: "Sincere joyousness — good fortune. Remorse disappears.", nature: "auspicious" },
      { zh: "來兌，凶。", en: "Coming joyousness — misfortune.", nature: "inauspicious" },
      { zh: "商兌未寧，介疾有喜。", en: "Joyousness that is weighed and deliberated — not yet at rest. After ridding himself of mistakes a man has joy.", nature: "neutral" },
      { zh: "孚于剝，有厲。", en: "Sincerity toward disintegrating influences is dangerous.", nature: "inauspicious" },
      { zh: "引兌。", en: "Seductive joyousness.", nature: "neutral" },
    ],
  },
  {
    number: 59,
    nameZh: "渙",
    namePinyin: "Huàn",
    nameEn: "Dispersion",
    lines: [0, 1, 0, 0, 1, 1],
    judgment: { zh: "渙：亨，王假有廟，利涉大川，利貞。", en: "Dispersion — success. The king approaches his temple. It furthers to cross the great water. Perseverance furthers." },
    image: { zh: "風行水上，渙；先王以享于帝立廟。", en: "The wind drives over the water — dispersion. The ancient kings sacrificed to the Lord and built temples." },
    linesText: [
      { zh: "用拯馬壯，吉。", en: "He brings help with the strength of a horse — good fortune.", nature: "auspicious" },
      { zh: "渙奔其机，悔亡。", en: "At the dissolution he hurries to that which supports him — remorse disappears.", nature: "auspicious" },
      { zh: "渙其躬，無悔。", en: "He dissolves his self — no remorse.", nature: "neutral" },
      { zh: "渙其群，元吉，渙有丘，匪夷所思。", en: "He dissolves his bond with his group — supreme good fortune. Dispersion leads in turn to accumulation. This is something that ordinary men do not think of.", nature: "auspicious" },
      { zh: "渙汗其大號，渙王居，無咎。", en: "His loud cries are as dissolving as sweat. Dissolution — a king abides without blame.", nature: "neutral" },
      { zh: "渙其血，去逖出，無咎。", en: "He dissolves his blood — depart, keep at a distance, go out. No blame.", nature: "neutral" },
    ],
  },
  {
    number: 60,
    nameZh: "節",
    namePinyin: "Jié",
    nameEn: "Limitation",
    lines: [1, 1, 0, 0, 1, 0],
    judgment: { zh: "節：亨，苦節不可貞。", en: "Limitation — success. Galling limitation must not be persevered in." },
    image: { zh: "澤上有水，節；君子以制數度，議德行。", en: "Water over lake — limitation. The superior one creates number and measure, and examines the nature of virtue and correct conduct." },
    linesText: [
      { zh: "不出戶庭，無咎。", en: "Not going out of the door and the courtyard — no blame.", nature: "neutral" },
      { zh: "不出門庭，凶。", en: "Not going out of the gate and the courtyard — misfortune.", nature: "inauspicious" },
      { zh: "不節若，則嗟若，無咎。", en: "He who knows no limitation will have cause to lament. No blame.", nature: "neutral" },
      { zh: "安節，亨。", en: "Contented limitation — success.", nature: "auspicious" },
      { zh: "甘節，吉，往有尚。", en: "Sweet limitation — good fortune. Going brings esteem.", nature: "auspicious" },
      { zh: "苦節，貞凶，悔亡。", en: "Galling limitation — perseverance brings misfortune. Remorse disappears.", nature: "inauspicious" },
    ],
  },
  {
    number: 61,
    nameZh: "中孚",
    namePinyin: "Zhōng Fú",
    nameEn: "Inner Truth",
    lines: [1, 1, 0, 0, 1, 1],
    judgment: { zh: "中孚：豚魚吉，利涉大川，利貞。", en: "Inner truth — pigs and fishes. Good fortune. It furthers one to cross the great water. Perseverance furthers." },
    image: { zh: "澤上有風，中孚；君子以議獄緩死。", en: "Wind over lake — inner truth. The superior one discusses criminal cases in order to delay executions." },
    linesText: [
      { zh: "虞吉，有它不燕。", en: "Being prepared brings good fortune. If there are secret designs, it is disquieting.", nature: "auspicious" },
      { zh: "鳴鶴在陰，其子和之，我有好爵，吾與爾靡之。", en: "A crane calling in the shade. Its young answers it. I have a good goblet. I will share it with you.", nature: "auspicious" },
      { zh: "得敵，或鼓或罷，或泣或歌。", en: "He finds a comrade. Now he beats the drum, now he stops. Now he sobs, now he sings.", nature: "neutral" },
      { zh: "月幾望，馬匹亡，無咎。", en: "The moon nearly at the full. The team horse goes astray. No blame.", nature: "neutral" },
      { zh: "有孚攣如，無咎。", en: "He possesses truth, which links together — no blame.", nature: "auspicious" },
      { zh: "翰音登于天，貞凶。", en: "Cockcrow penetrating to heaven — perseverance brings misfortune.", nature: "inauspicious" },
    ],
  },
  {
    number: 62,
    nameZh: "小過",
    namePinyin: "Xiǎo Guò",
    nameEn: "Small Excess",
    lines: [0, 0, 1, 1, 0, 0],
    judgment: { zh: "小過：亨，利貞，可小事，不可大事。", en: "Small excess — success. Perseverance furthers. Small things may be done; great things should not be done." },
    image: { zh: "山上有雷，小過；君子以行過乎恭，喪過乎哀，用過乎儉。", en: "Thunder on the mountain — small excess. The superior one in his conduct lays the emphasis on reverence, in bereavement on grief, in his expenditures on thrift." },
    linesText: [
      { zh: "飛鳥以凶。", en: "The bird meets with misfortune through flying.", nature: "inauspicious" },
      { zh: "過其祖，遇其妣，不及其君，遇其臣，無咎。", en: "She passes by her ancestor and meets her ancestress; he does not reach his prince and meets the official. No blame.", nature: "neutral" },
      { zh: "弗過防之，從或戕之，凶。", en: "If one is not extremely careful, somebody may come up from behind and strike him. Misfortune.", nature: "inauspicious" },
      { zh: "無咎，弗過遇之，往厲必戒，勿用永貞。", en: "No blame. He meets him without passing by. Going brings danger — one must be on guard. Do not act — be constantly persevering.", nature: "neutral" },
      { zh: "密雲不雨，自我西郊，公弋取彼在穴。", en: "Dense clouds, no rain from our western territory. The prince shoots and hits him who is in the cave.", nature: "neutral" },
      { zh: "弗遇過之，飛鳥離之，凶，是謂災眚。", en: "He passes him by, not meeting him. The flying bird leaves him. Misfortune. This means bad luck and injury.", nature: "inauspicious" },
    ],
  },
  {
    number: 63,
    nameZh: "既濟",
    namePinyin: "Jì Jì",
    nameEn: "After Completion",
    lines: [1, 0, 1, 0, 1, 0],
    judgment: { zh: "既濟：亨小，利貞，初吉終亂。", en: "After completion — success in small matters. Perseverance furthers. At the beginning good fortune; at the end disorder." },
    image: { zh: "水在火上，既濟；君子以思患而豫防之。", en: "Water over fire — after completion. The superior one takes thought of misfortune and arms himself against it in advance." },
    linesText: [
      { zh: "曳其輪，濡其尾，無咎。", en: "He brakes his wheels. He gets his tail in the water. No blame.", nature: "neutral" },
      { zh: "婦喪其茀，勿逐，七日得。", en: "The woman loses the curtain of her carriage. Do not run after it — on the seventh day you will get it back.", nature: "auspicious" },
      { zh: "高宗伐鬼方，三年克之，小人勿用。", en: "The illustrious ancestor disciplines the Devil's Country. After three years he conquers it. Inferior people must not be employed.", nature: "neutral" },
      { zh: "繻有衣袽，終日戒。", en: "The finest clothes turn to rags. Be careful all day long.", nature: "neutral" },
      { zh: "東鄰殺牛，不如西鄰之禴祭，實受其福。", en: "The neighbour in the east who slaughters an ox does not attain as much real happiness as the neighbour in the west with his small offering.", nature: "auspicious" },
      { zh: "濡其首，厲。", en: "He gets his head in the water. Danger.", nature: "inauspicious" },
    ],
  },
  {
    number: 64,
    nameZh: "未濟",
    namePinyin: "Wèi Jì",
    nameEn: "Before Completion",
    lines: [0, 1, 0, 1, 0, 1],
    judgment: { zh: "未濟：亨，小狐汔濟，濡其尾，無攸利。", en: "Before completion — success. But if the little fox, after nearly completing the crossing, gets his tail in the water, there is nothing that would further." },
    image: { zh: "火在水上，未濟；君子以慎辨物居方。", en: "Fire over water — the condition before completion. The superior one is careful in the differentiation of things, so that each finds its place." },
    linesText: [
      { zh: "濡其尾，吝。", en: "He gets his tail in the water — humiliation.", nature: "inauspicious" },
      { zh: "曳其輪，貞吉。", en: "He brakes his wheels — perseverance brings good fortune.", nature: "auspicious" },
      { zh: "未濟，征凶，利涉大川。", en: "Before completion, attack brings misfortune. It furthers one to cross the great water.", nature: "neutral" },
      { zh: "貞吉，悔亡，震用伐鬼方，三年有賞于大國。", en: "Perseverance brings good fortune; remorse disappears. Shock, thus to discipline the Devil's Country — for three years, great realms are rewarded.", nature: "auspicious" },
      { zh: "貞吉，無悔，君子之光，有孚，吉。", en: "Perseverance brings good fortune, no remorse. The light of the superior one is real. Good fortune.", nature: "auspicious" },
      { zh: "有孚于飲酒，無咎，濡其首，有孚失是。", en: "There is drinking of wine in genuine confidence. No blame. But if one wets his head, he loses it, in truth.", nature: "neutral" },
    ],
  },
];

// ─── Domain Map ───────────────────────────────────────────────────────────────

export const HEXAGRAM_DOMAIN_MAP: Record<number, QmdjFocus> = {
  1: "career", 2: "general", 3: "career", 4: "general",
  5: "general", 6: "career", 7: "career", 8: "love",
  9: "finance", 10: "career", 11: "finance", 12: "general",
  13: "love", 14: "finance", 15: "general", 16: "career",
  17: "general", 18: "health", 19: "career", 20: "general",
  21: "career", 22: "general", 23: "health", 24: "health",
  25: "general", 26: "career", 27: "health", 28: "health",
  29: "health", 30: "career", 31: "love", 32: "career",
  33: "general", 34: "career", 35: "career", 36: "career",
  37: "love", 38: "love", 39: "health", 40: "health",
  41: "finance", 42: "finance", 43: "career", 44: "love",
  45: "finance", 46: "career", 47: "health", 48: "health",
  49: "career", 50: "career", 51: "general", 52: "health",
  53: "love", 54: "love", 55: "finance", 56: "general",
  57: "career", 58: "love", 59: "general", 60: "finance",
  61: "love", 62: "general", 63: "general", 64: "general",
};

// ─── Casting Logic ────────────────────────────────────────────────────────────

export function castLine(): IChingLine {
  // Simulate 3 coins: heads=3, tails=2
  const sum = [0, 1, 2].reduce((acc) => acc + (Math.random() < 0.5 ? 3 : 2), 0);
  // 6=old yin (changing), 7=young yang, 8=young yin, 9=old yang (changing)
  const value: 0 | 1 = sum === 7 || sum === 9 ? 1 : 0;
  return { value, isChanging: sum === 6 || sum === 9 };
}

export function getHexagramByLines(lines: (0 | 1)[]): IChingHexagram {
  const found = HEXAGRAMS.find(
    (h) => h.lines.every((v, i) => v === lines[i])
  );
  // Fallback to hexagram 1 if not found (should never happen with valid input)
  return found ?? HEXAGRAMS[0];
}

export function buildInterpretation(
  reading: Omit<IChingReading, "interpretation">
): string[] {
  const lines: string[] = [];
  const { primaryHexagram, changingLines, resultingHexagram } = reading;

  lines.push(`## ${primaryHexagram.nameZh} ${primaryHexagram.namePinyin} — ${primaryHexagram.nameEn}`);
  lines.push(`**Judgment 彖辭:** ${primaryHexagram.judgment.en}`);
  lines.push(primaryHexagram.judgment.zh);
  lines.push(`**Image 象辭:** ${primaryHexagram.image.en}`);
  lines.push(primaryHexagram.image.zh);

  if (changingLines.length > 0) {
    lines.push("## Changing Lines 爻辭");
    for (const idx of changingLines) {
      const lineNum = idx + 1;
      const lt = primaryHexagram.linesText[idx];
      lines.push(`**Line ${lineNum}:** ${lt.en}`);
      lines.push(lt.zh);
    }
  }

  if (resultingHexagram) {
    lines.push(`## Resulting Hexagram 之卦: ${resultingHexagram.nameZh} ${resultingHexagram.namePinyin} — ${resultingHexagram.nameEn}`);
    lines.push(`**Judgment:** ${resultingHexagram.judgment.en}`);
    lines.push(resultingHexagram.judgment.zh);
  }

  return lines;
}

export function performIChingReading(question?: string): IChingReading {
  const castLines: IChingLine[] = Array.from({ length: 6 }, () => castLine());
  const primaryLines = castLines.map((l) => l.value) as [0|1, 0|1, 0|1, 0|1, 0|1, 0|1];
  const primaryHexagram = getHexagramByLines(primaryLines);

  const changingLineIndices = castLines
    .map((l, i) => (l.isChanging ? i : -1))
    .filter((i) => i !== -1);

  let resultingHexagram: IChingHexagram | null = null;
  if (changingLineIndices.length > 0) {
    const resultLines = primaryLines.map((v, i) =>
      changingLineIndices.includes(i) ? ((1 - v) as 0 | 1) : v
    ) as [0|1, 0|1, 0|1, 0|1, 0|1, 0|1];
    resultingHexagram = getHexagramByLines(resultLines);
  }

  const partial: Omit<IChingReading, "interpretation"> = {
    primaryHexagram,
    lines: castLines,
    changingLines: changingLineIndices,
    resultingHexagram,
    question,
  };

  const interpretation = buildInterpretation(partial);
  return { ...partial, interpretation };
}
