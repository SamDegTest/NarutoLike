import { Ninja } from "@/types/index";

// Helper lists of 10 moves per character to avoid redundancy
const NARUTO_JUTSUS = [
  "shadow_clone_kid",
  "rasengan_kid",
  "wind_bullet",
  "rasengan_shippuden",
  "giant_rasengan",
  "sage_art_rasengan",
  "rasenshuriken",
  "kurama_rasengan",
  "super_rasenshuriken",
  "tailed_beast_bomb"
];

const SASUKE_JUTSUS = [
  "fireball_jutsu_kid",
  "lion_combo_kid",
  "chidori_kid",
  "dragon_fire_jutsu",
  "chidori_shippuden",
  "chidori_spear",
  "amaterasu",
  "susanoo_slash",
  "kirin",
  "indras_arrow"
];

const SAKURA_JUTSUS = [
  "cherry_blossom_clash_kid",
  "basic_healing",
  "chakra_scalpel",
  "poison_fog",
  "cherry_blossom_clash_shippuden",
  "giant_impact",
  "medical_ninjutsu",
  "mitotic_regeneration",
  "byakugou_seal_kid",
  "byakugou_heal"
];

const KAKASHI_JUTSUS = [
  "white_light_slash",
  "headhunter_jutsu",
  "mud_wall",
  "shadow_clone_kakashi",
  "chidori_kakashi",
  "lightning_blade",
  "water_dragon_bullet",
  "kamui_snare",
  "purple_electricity",
  "kamui_lightning_blade"
];

const GAARA_JUTSUS = [
  "sand_binding_coffin",
  "sand_shield",
  "sand_shower_kid",
  "giant_sand_burial",
  "shukaku_shield",
  "sand_tsunami",
  "sand_desert_coffin",
  "absolute_defense_shield",
  "desert_funeral",
  "wind_sand_blade"
];

const LEE_JUTSUS = [
  "dynamic_entry",
  "leaf_hurricane",
  "gate_1_open",
  "primary_lotus",
  "gate_3_open",
  "hidden_lotus",
  "gate_5_open",
  "gate_6_open",
  "crane_fist",
  "morning_peacock"
];

const NEJI_JUTSUS = [
  "gentle_fist_strike",
  "eight_trigrams_16",
  "eight_trigrams_32",
  "rotation_kid",
  "air_palm",
  "rotation_shippuden",
  "eight_trigrams_64",
  "eight_trigrams_128",
  "giant_air_palm",
  "gentle_fist_body_blow"
];

const SHIKAMARU_JUTSUS = [
  "shadow_imitation_kid",
  "shadow_choke_kid",
  "paper_bomb_trap",
  "shadow_sewing",
  "shadow_pull",
  "shadow_imitation_shippuden",
  "flash_bomb_tactic",
  "shadow_strangle",
  "shadow_clutch",
  "shadow_binding_field"
];

const HINATA_JUTSUS = [
  "gentle_fist_hinata",
  "protection_rotation",
  "twin_lion_fists_intro",
  "protective_64_palms",
  "twin_lion_fists",
  "eight_trigrams_air_palm",
  "gentle_step_lion",
  "trigrams_rotation",
  "eight_trigrams_twin_lions",
  "gentle_fist_body_blow"
];

const ITACHI_JUTSUS = [
  "shuriken_jutsu_itachi",
  "clone_great_explosion",
  "genjutsu_crow",
  "fireball_itachi",
  "tsukuyomi",
  "amaterasu_itachi",
  "yasaka_beads",
  "susanoo_shield_itachi",
  "susanoo_slash_itachi",
  "izanami"
];

const JIRAIYA_JUTSUS = [
  "needle_senbon",
  "hair_shield",
  "fire_breath_jiraiya",
  "toad_summon",
  "rasengan_jiraiya",
  "swamp_of_underworld",
  "wild_lion_mane",
  "sage_mode_intro",
  "bath_of_boiling_oil",
  "massive_rasengan"
];

const TSUNADE_JUTSUS = [
  "tsunade_kick",
  "chakra_burst",
  "body_flicker_tsunade",
  "basic_healing",
  "nervous_system_rupture",
  "heaven_spear_kick",
  "katsuyu_summon",
  "medical_regeneration",
  "byakugou_healing_tsunade",
  "byakugou_heal"
];

const OROCHIMARU_JUTSUS = [
  "snake_strike",
  "shadow_clone_snake",
  "sword_kusanagi_strike",
  "triple_rashomon",
  "poison_snake_summon",
  "wind_gale_orochi",
  "snake_skin_shedding",
  "reaper_death_seal_break",
  "eight_branches_giant_snake",
  "edo_tensei"
];

export const NINJA_MAP = new Map<string, Ninja>([
  // ==========================================
  // NARUTO UZUMAKI
  // ==========================================
  [
    "naruto_kid",
    {
      id: "naruto_kid",
      characterId: "naruto",
      name: "Naruto Uzumaki (Kid)",
      version: "kid",
      baseStats: { hp: 100, chakra: 120, attack: 15, defense: 10, speed: 12 },
      sprite: "/sprites/naruto_kid.png",
      activeJutsuId: "shadow_clone_kid",
      jutsuList: NARUTO_JUTSUS,
    },
  ],
  [
    "naruto_shippuden",
    {
      id: "naruto_shippuden",
      characterId: "naruto",
      name: "Naruto Uzumaki (Shippuden)",
      version: "shippuden",
      baseStats: { hp: 150, chakra: 200, attack: 28, defense: 18, speed: 22 },
      sprite: "/sprites/naruto_shippuden.png",
      activeJutsuId: "rasengan_shippuden",
      jutsuList: NARUTO_JUTSUS,
    },
  ],
  [
    "naruto_sage",
    {
      id: "naruto_sage",
      characterId: "naruto",
      name: "Naruto Uzumaki (Sage Mode)",
      version: "special",
      baseStats: { hp: 200, chakra: 250, attack: 40, defense: 25, speed: 30 },
      sprite: "/sprites/naruto_sage.png",
      activeJutsuId: "rasenshuriken",
      jutsuList: NARUTO_JUTSUS,
    },
  ],
  [
    "naruto_kcm",
    {
      id: "naruto_kcm",
      characterId: "naruto",
      name: "Naruto Uzumaki (KCM)",
      version: "special",
      baseStats: { hp: 240, chakra: 300, attack: 46, defense: 30, speed: 34 },
      sprite: "/sprites/naruto_kcm.png",
      activeJutsuId: "kurama_rasengan",
      jutsuList: NARUTO_JUTSUS,
    },
  ],

  // ==========================================
  // SASUKE UCHIHA
  // ==========================================
  [
    "sasuke_kid",
    {
      id: "sasuke_kid",
      characterId: "sasuke",
      name: "Sasuke Uchiha (Kid)",
      version: "kid",
      baseStats: { hp: 90, chakra: 100, attack: 18, defense: 8, speed: 15 },
      sprite: "/sprites/sasuke_kid.png",
      activeJutsuId: "fireball_jutsu_kid",
      jutsuList: SASUKE_JUTSUS,
    },
  ],
  [
    "sasuke_hebi",
    {
      id: "sasuke_hebi",
      characterId: "sasuke",
      name: "Sasuke Uchiha (Hebi)",
      version: "shippuden",
      baseStats: { hp: 130, chakra: 160, attack: 28, defense: 14, speed: 24 },
      sprite: "/sprites/sasuke_hebi.png",
      activeJutsuId: "chidori_shippuden",
      jutsuList: SASUKE_JUTSUS,
    },
  ],
  [
    "sasuke_shippuden",
    {
      id: "sasuke_shippuden",
      characterId: "sasuke",
      name: "Sasuke Uchiha (Shippuden)",
      version: "shippuden",
      baseStats: { hp: 140, chakra: 180, attack: 30, defense: 16, speed: 26 },
      sprite: "/sprites/sasuke_shippuden.png",
      activeJutsuId: "chidori_shippuden",
      jutsuList: SASUKE_JUTSUS,
    },
  ],
  [
    "sasuke_susanoo",
    {
      id: "sasuke_susanoo",
      characterId: "sasuke",
      name: "Sasuke Uchiha (Mangekyou)",
      version: "special",
      baseStats: { hp: 180, chakra: 240, attack: 38, defense: 35, speed: 28 },
      sprite: "/sprites/sasuke_susanoo.png",
      activeJutsuId: "amaterasu",
      jutsuList: SASUKE_JUTSUS,
    },
  ],
  [
    "sasuke_rinnegan",
    {
      id: "sasuke_rinnegan",
      characterId: "sasuke",
      name: "Sasuke Uchiha (Rinnegan)",
      version: "special",
      baseStats: { hp: 220, chakra: 270, attack: 45, defense: 28, speed: 33 },
      sprite: "/sprites/sasuke_rinnegan.png",
      activeJutsuId: "susanoo_slash",
      jutsuList: SASUKE_JUTSUS,
    },
  ],

  // ==========================================
  // SAKURA HARUNO
  // ==========================================
  [
    "sakura_kid",
    {
      id: "sakura_kid",
      characterId: "sakura",
      name: "Sakura Haruno (Kid)",
      version: "kid",
      baseStats: { hp: 80, chakra: 80, attack: 10, defense: 8, speed: 10 },
      sprite: "/sprites/sakura_kid.png",
      activeJutsuId: "cherry_blossom_clash_kid",
      jutsuList: SAKURA_JUTSUS,
    },
  ],
  [
    "sakura_shippuden",
    {
      id: "sakura_shippuden",
      characterId: "sakura",
      name: "Sakura Haruno (Shippuden)",
      version: "shippuden",
      baseStats: { hp: 160, chakra: 180, attack: 35, defense: 22, speed: 18 },
      sprite: "/sprites/sakura_shippuden.png",
      activeJutsuId: "cherry_blossom_clash_shippuden",
      jutsuList: SAKURA_JUTSUS,
    },
  ],

  // ==========================================
  // KAKASHI HATAKE
  // ==========================================
  [
    "kakashi_kid",
    {
      id: "kakashi_kid",
      characterId: "kakashi",
      name: "Kakashi Hatake (Kid)",
      version: "kid",
      baseStats: { hp: 95, chakra: 90, attack: 16, defense: 9, speed: 16 },
      sprite: "/sprites/kakashi_kid.png",
      activeJutsuId: "white_light_slash",
      jutsuList: KAKASHI_JUTSUS,
    },
  ],
  [
    "kakashi_shippuden",
    {
      id: "kakashi_shippuden",
      characterId: "kakashi",
      name: "Kakashi Hatake (Shippuden)",
      version: "shippuden",
      baseStats: { hp: 150, chakra: 170, attack: 32, defense: 22, speed: 26 },
      sprite: "/sprites/kakashi_shippuden.png",
      activeJutsuId: "lightning_blade",
      jutsuList: KAKASHI_JUTSUS,
    },
  ],

  // ==========================================
  // GAARA
  // ==========================================
  [
    "gaara_kid",
    {
      id: "gaara_kid",
      characterId: "gaara",
      name: "Gaara (Kid)",
      version: "kid",
      baseStats: { hp: 120, chakra: 100, attack: 14, defense: 18, speed: 8 },
      sprite: "/sprites/gaara_kid.png",
      activeJutsuId: "sand_binding_coffin",
      jutsuList: GAARA_JUTSUS,
    },
  ],
  [
    "gaara_shippuden",
    {
      id: "gaara_shippuden",
      characterId: "gaara",
      name: "Gaara (Shippuden / Kazekage)",
      version: "shippuden",
      baseStats: { hp: 180, chakra: 210, attack: 26, defense: 32, speed: 16 },
      sprite: "/sprites/gaara_shippuden.png",
      activeJutsuId: "giant_sand_burial",
      jutsuList: GAARA_JUTSUS,
    },
  ],

  // ==========================================
  // ROCK LEE
  // ==========================================
  [
    "lee_kid",
    {
      id: "lee_kid",
      characterId: "lee",
      name: "Rock Lee (Kid)",
      version: "kid",
      baseStats: { hp: 95, chakra: 50, attack: 18, defense: 10, speed: 15 },
      sprite: "/sprites/lee_kid.png",
      activeJutsuId: "dynamic_entry",
      jutsuList: LEE_JUTSUS,
    },
  ],
  [
    "lee_shippuden",
    {
      id: "lee_shippuden",
      characterId: "lee",
      name: "Rock Lee (Shippuden)",
      version: "shippuden",
      baseStats: { hp: 145, chakra: 80, attack: 30, defense: 18, speed: 25 },
      sprite: "/sprites/lee_shippuden.png",
      activeJutsuId: "gate_1_open",
      jutsuList: LEE_JUTSUS,
    },
  ],

  // ==========================================
  // NEJI HYUGA
  // ==========================================
  [
    "neji_kid",
    {
      id: "neji_kid",
      characterId: "neji",
      name: "Neji Hyuga (Kid)",
      version: "kid",
      baseStats: { hp: 95, chakra: 90, attack: 17, defense: 11, speed: 14 },
      sprite: "/sprites/neji_kid.png",
      activeJutsuId: "gentle_fist_strike",
      jutsuList: NEJI_JUTSUS,
    },
  ],
  [
    "neji_shippuden",
    {
      id: "neji_shippuden",
      characterId: "neji",
      name: "Neji Hyuga (Shippuden)",
      version: "shippuden",
      baseStats: { hp: 145, chakra: 160, attack: 31, defense: 20, speed: 23 },
      sprite: "/sprites/neji_shippuden.png",
      activeJutsuId: "air_palm",
      jutsuList: NEJI_JUTSUS,
    },
  ],

  // ==========================================
  // SHIKAMARU NARA
  // ==========================================
  [
    "shikamaru_kid",
    {
      id: "shikamaru_kid",
      characterId: "shikamaru",
      name: "Shikamaru Nara (Kid)",
      version: "kid",
      baseStats: { hp: 85, chakra: 90, attack: 12, defense: 9, speed: 13 },
      sprite: "/sprites/shikamaru_kid.png",
      activeJutsuId: "shadow_imitation_kid",
      jutsuList: SHIKAMARU_JUTSUS,
    },
  ],
  [
    "shikamaru_shippuden",
    {
      id: "shikamaru_shippuden",
      characterId: "shikamaru",
      name: "Shikamaru Nara (Shippuden)",
      version: "shippuden",
      baseStats: { hp: 135, chakra: 160, attack: 24, defense: 16, speed: 20 },
      sprite: "/sprites/shikamaru_shippuden.png",
      activeJutsuId: "shadow_imitation_shippuden",
      jutsuList: SHIKAMARU_JUTSUS,
    },
  ],

  // ==========================================
  // HINATA HYUGA
  // ==========================================
  [
    "hinata_kid",
    {
      id: "hinata_kid",
      characterId: "hinata",
      name: "Hinata Hyuga (Kid)",
      version: "kid",
      baseStats: { hp: 85, chakra: 85, attack: 11, defense: 10, speed: 11 },
      sprite: "/sprites/hinata_kid.png",
      activeJutsuId: "gentle_fist_hinata",
      jutsuList: HINATA_JUTSUS,
    },
  ],
  [
    "hinata_shippuden",
    {
      id: "hinata_shippuden",
      characterId: "hinata",
      name: "Hinata Hyuga (Shippuden)",
      version: "shippuden",
      baseStats: { hp: 140, chakra: 150, attack: 25, defense: 19, speed: 18 },
      sprite: "/sprites/hinata_shippuden.png",
      activeJutsuId: "twin_lion_fists_intro",
      jutsuList: HINATA_JUTSUS,
    },
  ],

  // ==========================================
  // ITACHI UCHIHA
  // ==========================================
  [
    "itachi_shippuden",
    {
      id: "itachi_shippuden",
      characterId: "itachi",
      name: "Itachi Uchiha (Shippuden)",
      version: "shippuden",
      baseStats: { hp: 130, chakra: 220, attack: 36, defense: 18, speed: 30 },
      sprite: "/sprites/itachi_shippuden.png",
      activeJutsuId: "shuriken_jutsu_itachi",
      jutsuList: ITACHI_JUTSUS,
    },
  ],
  [
    "itachi_susanoo",
    {
      id: "itachi_susanoo",
      characterId: "itachi",
      name: "Itachi Uchiha (Susanoo)",
      version: "special",
      baseStats: { hp: 170, chakra: 280, attack: 44, defense: 38, speed: 28 },
      sprite: "/sprites/itachi_susanoo.png",
      activeJutsuId: "tsukuyomi",
      jutsuList: ITACHI_JUTSUS,
    },
  ],

  // ==========================================
  // JIRAIYA
  // ==========================================
  [
    "jiraiya_shippuden",
    {
      id: "jiraiya_shippuden",
      characterId: "jiraiya",
      name: "Jiraiya (Shippuden)",
      version: "shippuden",
      baseStats: { hp: 180, chakra: 220, attack: 32, defense: 22, speed: 22 },
      sprite: "/sprites/jiraiya_shippuden.png",
      activeJutsuId: "needle_senbon",
      jutsuList: JIRAIYA_JUTSUS,
    },
  ],
  [
    "jiraiya_sage",
    {
      id: "jiraiya_sage",
      characterId: "jiraiya",
      name: "Jiraiya (Sage Mode)",
      version: "special",
      baseStats: { hp: 220, chakra: 270, attack: 42, defense: 28, speed: 28 },
      sprite: "/sprites/jiraiya_sage.png",
      activeJutsuId: "sage_mode_intro",
      jutsuList: JIRAIYA_JUTSUS,
    },
  ],

  // ==========================================
  // TSUNADE
  // ==========================================
  [
    "tsunade_shippuden",
    {
      id: "tsunade_shippuden",
      characterId: "tsunade",
      name: "Tsunade (Shippuden)",
      version: "shippuden",
      baseStats: { hp: 200, chakra: 200, attack: 38, defense: 25, speed: 20 },
      sprite: "/sprites/tsunade_shippuden.png",
      activeJutsuId: "tsunade_kick",
      jutsuList: TSUNADE_JUTSUS,
    },
  ],

  // ==========================================
  // OROCHIMARU
  // ==========================================
  [
    "orochimaru_shippuden",
    {
      id: "orochimaru_shippuden",
      characterId: "orochimaru",
      name: "Orochimaru (Shippuden)",
      version: "shippuden",
      baseStats: { hp: 170, chakra: 240, attack: 34, defense: 24, speed: 24 },
      sprite: "/sprites/orochimaru_shippuden.png",
      activeJutsuId: "snake_strike",
      jutsuList: OROCHIMARU_JUTSUS,
    },
  ],
  [
    "mizuki",
    {
      id: "mizuki",
      characterId: "mizuki",
      name: "Mizuki",
      version: "kid",
      baseStats: { hp: 120, chakra: 100, attack: 16, defense: 10, speed: 10 },
      sprite: "/sprites/mizuki.png",
      activeJutsuId: "white_light_slash",
      jutsuList: KAKASHI_JUTSUS,
    },
  ],
  [
    "haku",
    {
      id: "haku",
      characterId: "haku",
      name: "Haku",
      version: "kid",
      baseStats: { hp: 140, chakra: 120, attack: 18, defense: 12, speed: 18 },
      sprite: "/sprites/haku.png",
      activeJutsuId: "gentle_fist_strike",
      jutsuList: NEJI_JUTSUS,
    },
  ],
  [
    "zabuza",
    {
      id: "zabuza",
      characterId: "zabuza",
      name: "Zabuza Momochi",
      version: "shippuden",
      baseStats: { hp: 180, chakra: 150, attack: 28, defense: 16, speed: 14 },
      sprite: "/sprites/zabuza.png",
      activeJutsuId: "sand_binding_coffin",
      jutsuList: GAARA_JUTSUS,
    },
  ],
]);
