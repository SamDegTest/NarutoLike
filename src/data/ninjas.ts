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
  "susanoo_slash",
  "amaterasu",
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
  "genjutsu_crow",
  "clone_great_explosion",
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
  "body_flicker_tsunade",
  "chakra_burst",
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

const TENTEN_JUTSUS = [
  "twin_rising_dragons",
  "iron_ball_strike",
  "unsealing_technique",
  "explosing_dragon_strike",
  "hundred_weapons_storm"
];

const CHOJI_JUTSUS = [
  "human_boulder",
  "expansion_jutsu",
  "partial_expansion_fist",
  "super_expansion_jutsu",
  "butterfly_bombing"
];

const INO_JUTSUS = [
  "mind_transfer_jutsu",
  "mind_destruction_jutsu",
  "chakra_hair_trap",
  "healing_blossom",
  "psycho_mind_transmission"
];

const OBITO_JUTSUS = [
  "kamui_phasing",
  "fireball_obito",
  "wood_release_spikes",
  "kamui_dimension_warp",
  "ten_tails_jinchuriki"
];

const MADARA_JUTSUS = [
  "majestic_destroyer_flame",
  "wood_dragon_jutsu",
  "susanoo_perfect_blade",
  "shatbered_heaven_meteor",
  "infinite_tsukuyomi"
];

const PAIN_JUTSUS = [
  "bansho_tenin",
  "almighty_push",
  "summoning_rinnegan",
  "chibaku_tensei",
  "shinra_tensei_cataclysm"
];

const KONAN_JUTSUS = [
  "paper_shuriken",
  "paper_wings_flight",
  "paper_spear_assault",
  "dance_of_the_shikigami",
  "sacred_paper_ocean"
];

const TEMARI_JUTSUS = [
  "sickle_weasel",
  "wind_fan_slice",
  "great_sickle_weasel",
  "summoning_kamatari",
  "cyclone_scythe_tempest"
];

const KANKURO_JUTSUS = [
  "karasu_puppet_strike",
  "black_secret_technique",
  "poison_fog_trap",
  "sanshouuo_shield",
  "puppet_show_execution"
];

const SHINO_JUTSUS = [
  "beetle_sphere",
  "insect_jamming",
  "parasitic_insects",
  "insect_boulder_crush",
  "giant_parasitic_beetle"
];

const KIBA_JUTSUS = [
  "fang_over_fang",
  "man_beast_clone",
  "tunneling_fang",
  "two_headed_wolf",
  "three_headed_wolf_fang"
];

const GUY_JUTSUS = [
  "leaf_strong_whirlwind",
  "morning_peacock_guy",
  "daytime_tiger",
  "evening_elephant",
  "night_guy"
];

const MINATO_JUTSUS = [
  "flying_raijin_slice",
  "rasengan_minato",
  "flying_raijin_stage_2",
  "reaper_death_seal_minato",
  "space_time_rasengan"
];

const KABUTO_JUTSUS = [
  "chakra_scalpel_kabuto",
  "medical_ninjutsu_drain",
  "white_rage_jutsu",
  "snake_sage_mode",
  "edo_tensei_army"
];

const KURENAI_JUTSUS = [
  "tree_binding_death",
  "flower_petal_escape",
  "demonic_illusion_tree",
  "phantom_mirror",
  "nightmare_tree_blossom"
];

const ASUMA_JUTSUS = [
  "trench_knife_chakra",
  "ash_pile_burning",
  "flying_swallow",
  "thousand_hand_strike",
  "fire_ash_explosion"
];

const HIRUZEN_JUTSUS = [
  "shuriken_shadow_clone",
  "fire_dragon_flame",
  "adamantine_staff_wall",
  "five_elements_combo",
  "reaper_death_seal_hiruzen"
];

const KONOHAMARU_JUTSUS = [
  "sexy_jutsu_konohamaru",
  "shadow_clone_blitz",
  "rasengan_konohamaru",
  "fireball_konohamaru",
  "monkey_king_summon"
];

const KISAME_JUTSUS = [
  "water_shark_bullet",
  "samehada_chakra_drain",
  "super_exploding_water_wave",
  "five_feeding_sharks",
  "giant_vortex_shark"
];

const IRUKA_JUTSUS = [
  "academy_reprimand",
  "bomb_seal_trap",
  "shuriken_barrage",
  "will_of_fire_defense",
  "sealing_barrier_spear"
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
      rank: "A",
      chakraNature: "Wind",
      version: "kid",
      baseStats: { hp: 175, chakra: 205, attack: 34, defense: 22, speed: 26 },
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
      rank: "A",
      chakraNature: "Wind",
      version: "shippuden",
      baseStats: { hp: 175, chakra: 205, attack: 34, defense: 22, speed: 26 },
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
      rank: "S",
      chakraNature: "Wind",
      version: "special",
      baseStats: { hp: 215, chakra: 265, attack: 43, defense: 29, speed: 32 },
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
      rank: "S",
      chakraNature: "Wind",
      version: "special",
      baseStats: { hp: 235, chakra: 285, attack: 47, defense: 31, speed: 36 },
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
      rank: "A",
      chakraNature: "Lightning",
      version: "kid",
      baseStats: { hp: 170, chakra: 195, attack: 35, defense: 21, speed: 28 },
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
      rank: "A",
      chakraNature: "Lightning",
      version: "shippuden",
      baseStats: { hp: 168, chakra: 195, attack: 35, defense: 20, speed: 28 },
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
      rank: "A",
      chakraNature: "Lightning",
      version: "shippuden",
      baseStats: { hp: 172, chakra: 200, attack: 36, defense: 21, speed: 29 },
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
      rank: "S",
      chakraNature: "Lightning",
      version: "special",
      baseStats: { hp: 210, chakra: 260, attack: 45, defense: 33, speed: 31 },
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
      rank: "S",
      chakraNature: "Lightning",
      version: "special",
      baseStats: { hp: 230, chakra: 275, attack: 48, defense: 30, speed: 35 },
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
      rank: "C",
      chakraNature: "Taijutsu",
      version: "kid",
      baseStats: { hp: 105, chakra: 115, attack: 15, defense: 11, speed: 13 },
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
      rank: "A",
      chakraNature: "Taijutsu",
      version: "shippuden",
      baseStats: { hp: 180, chakra: 195, attack: 36, defense: 25, speed: 23 },
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
      name: "Kakashi Hatake",
      rank: "S",
      chakraNature: "Lightning",
      version: "kid",
      baseStats: { hp: 210, chakra: 255, attack: 42, defense: 28, speed: 32 },
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
      rank: "A",
      chakraNature: "Lightning",
      version: "shippuden",
      baseStats: { hp: 170, chakra: 200, attack: 35, defense: 23, speed: 27 },
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
      rank: "S",
      chakraNature: "Earth",
      version: "kid",
      baseStats: { hp: 215, chakra: 250, attack: 43, defense: 31, speed: 27 },
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
      rank: "A",
      chakraNature: "Earth",
      version: "shippuden",
      baseStats: { hp: 180, chakra: 210, attack: 34, defense: 27, speed: 24 },
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
      rank: "A",
      chakraNature: "Taijutsu",
      version: "kid",
      baseStats: { hp: 165, chakra: 145, attack: 37, defense: 19, speed: 29 },
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
      rank: "A",
      chakraNature: "Taijutsu",
      version: "shippuden",
      baseStats: { hp: 165, chakra: 145, attack: 37, defense: 19, speed: 29 },
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
      rank: "A",
      chakraNature: "Taijutsu",
      version: "kid",
      baseStats: { hp: 165, chakra: 190, attack: 33, defense: 23, speed: 26 },
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
      rank: "A",
      chakraNature: "Taijutsu",
      version: "shippuden",
      baseStats: { hp: 165, chakra: 190, attack: 33, defense: 22, speed: 26 },
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
      rank: "B",
      chakraNature: "YinYang",
      version: "kid",
      baseStats: { hp: 135, chakra: 160, attack: 24, defense: 15, speed: 20 },
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
      rank: "A",
      chakraNature: "YinYang",
      version: "shippuden",
      baseStats: { hp: 160, chakra: 190, attack: 31, defense: 21, speed: 25 },
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
      rank: "C",
      chakraNature: "Taijutsu",
      version: "kid",
      baseStats: { hp: 110, chakra: 120, attack: 16, defense: 13, speed: 14 },
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
      rank: "B",
      chakraNature: "Taijutsu",
      version: "shippuden",
      baseStats: { hp: 145, chakra: 160, attack: 25, defense: 17, speed: 20 },
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
      rank: "S",
      chakraNature: "Fire",
      version: "shippuden",
      baseStats: { hp: 205, chakra: 265, attack: 44, defense: 27, speed: 33 },
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
      rank: "S",
      chakraNature: "Fire",
      version: "special",
      baseStats: { hp: 220, chakra: 285, attack: 46, defense: 34, speed: 31 },
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
      rank: "S",
      chakraNature: "Fire",
      version: "shippuden",
      baseStats: { hp: 220, chakra: 255, attack: 44, defense: 28, speed: 29 },
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
      rank: "S",
      chakraNature: "Fire",
      version: "special",
      baseStats: { hp: 235, chakra: 285, attack: 47, defense: 31, speed: 32 },
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
      rank: "S",
      chakraNature: "YinYang",
      version: "shippuden",
      baseStats: { hp: 240, chakra: 245, attack: 43, defense: 32, speed: 27 },
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
      rank: "S",
      chakraNature: "Wind",
      version: "shippuden",
      baseStats: { hp: 215, chakra: 265, attack: 44, defense: 29, speed: 31 },
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
      rank: "C",
      chakraNature: "Wind",
      version: "kid",
      baseStats: { hp: 115, chakra: 105, attack: 17, defense: 12, speed: 14 },
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
      rank: "B",
      chakraNature: "Ice",
      version: "kid",
      baseStats: { hp: 145, chakra: 165, attack: 26, defense: 16, speed: 23 },
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
      rank: "A",
      chakraNature: "Water",
      version: "shippuden",
      baseStats: { hp: 180, chakra: 190, attack: 35, defense: 22, speed: 23 },
      sprite: "/sprites/zabuza.png",
      activeJutsuId: "sand_binding_coffin",
      jutsuList: GAARA_JUTSUS,
    },
  ],

  // ==========================================
  // TEAM GUY / TENTEN / MIGHT GUY
  // ==========================================
  [
    "tenten_kid",
    {
      id: "tenten_kid",
      characterId: "tenten",
      name: "Tenten (Kid)",
      rank: "C",
      chakraNature: "Taijutsu",
      version: "kid",
      baseStats: { hp: 105, chakra: 100, attack: 17, defense: 11, speed: 15 },
      sprite: "/sprites/tenten_kid.png",
      activeJutsuId: "twin_rising_dragons",
      jutsuList: TENTEN_JUTSUS,
    },
  ],
  [
    "tenten_shippuden",
    {
      id: "tenten_shippuden",
      characterId: "tenten",
      name: "Tenten (Shippuden)",
      rank: "B",
      chakraNature: "Taijutsu",
      version: "shippuden",
      baseStats: { hp: 135, chakra: 140, attack: 24, defense: 15, speed: 19 },
      sprite: "/sprites/tenten_shippuden.png",
      activeJutsuId: "unsealing_technique",
      jutsuList: TENTEN_JUTSUS,
    },
  ],
  [
    "guy_shippuden",
    {
      id: "guy_shippuden",
      characterId: "guy",
      name: "Might Guy (Shippuden)",
      rank: "S",
      chakraNature: "Taijutsu",
      version: "shippuden",
      baseStats: { hp: 225, chakra: 225, attack: 48, defense: 28, speed: 36 },
      sprite: "/sprites/guy_shippuden.png",
      activeJutsuId: "daytime_tiger",
      jutsuList: GUY_JUTSUS,
    },
  ],

  // ==========================================
  // TEAM ASUMA / CHOJI / INO / ASUMA
  // ==========================================
  [
    "choji_kid",
    {
      id: "choji_kid",
      characterId: "choji",
      name: "Chōji Akimichi (Kid)",
      rank: "C",
      chakraNature: "Earth",
      version: "kid",
      baseStats: { hp: 120, chakra: 95, attack: 18, defense: 13, speed: 11 },
      sprite: "/sprites/choji_kid.png",
      activeJutsuId: "human_boulder",
      jutsuList: CHOJI_JUTSUS,
    },
  ],
  [
    "choji_shippuden",
    {
      id: "choji_shippuden",
      characterId: "choji",
      name: "Chōji Akimichi (Shippuden)",
      rank: "B",
      chakraNature: "Earth",
      version: "shippuden",
      baseStats: { hp: 155, chakra: 135, attack: 28, defense: 17, speed: 16 },
      sprite: "/sprites/choji_shippuden.png",
      activeJutsuId: "super_expansion_jutsu",
      jutsuList: CHOJI_JUTSUS,
    },
  ],
  [
    "ino_kid",
    {
      id: "ino_kid",
      characterId: "ino",
      name: "Ino Yamanaka (Kid)",
      rank: "C",
      chakraNature: "YinYang",
      version: "kid",
      baseStats: { hp: 100, chakra: 110, attack: 14, defense: 10, speed: 14 },
      sprite: "/sprites/ino_kid.png",
      activeJutsuId: "mind_transfer_jutsu",
      jutsuList: INO_JUTSUS,
    },
  ],
  [
    "ino_shippuden",
    {
      id: "ino_shippuden",
      characterId: "ino",
      name: "Ino Yamanaka (Shippuden)",
      rank: "B",
      chakraNature: "YinYang",
      version: "shippuden",
      baseStats: { hp: 135, chakra: 155, attack: 23, defense: 15, speed: 18 },
      sprite: "/sprites/ino_shippuden.png",
      activeJutsuId: "mind_destruction_jutsu",
      jutsuList: INO_JUTSUS,
    },
  ],
  [
    "asuma_shippuden",
    {
      id: "asuma_shippuden",
      characterId: "asuma",
      name: "Asuma Sarutobi",
      rank: "A",
      chakraNature: "Wind",
      version: "shippuden",
      baseStats: { hp: 170, chakra: 180, attack: 34, defense: 22, speed: 24 },
      sprite: "/sprites/asuma_shippuden.png",
      activeJutsuId: "ash_pile_burning",
      jutsuList: ASUMA_JUTSUS,
    },
  ],

  // ==========================================
  // TEAM KURENAI / KIBA / SHINO / KURENAI
  // ==========================================
  [
    "kiba_kid",
    {
      id: "kiba_kid",
      characterId: "kiba",
      name: "Kiba Inuzuka (Kid)",
      rank: "C",
      chakraNature: "Taijutsu",
      version: "kid",
      baseStats: { hp: 110, chakra: 105, attack: 18, defense: 12, speed: 16 },
      sprite: "/sprites/kiba_kid.png",
      activeJutsuId: "fang_over_fang",
      jutsuList: KIBA_JUTSUS,
    },
  ],
  [
    "kiba_shippuden",
    {
      id: "kiba_shippuden",
      characterId: "kiba",
      name: "Kiba Inuzuka (Shippuden)",
      rank: "B",
      chakraNature: "Taijutsu",
      version: "shippuden",
      baseStats: { hp: 145, chakra: 140, attack: 26, defense: 16, speed: 22 },
      sprite: "/sprites/kiba_shippuden.png",
      activeJutsuId: "two_headed_wolf",
      jutsuList: KIBA_JUTSUS,
    },
  ],
  [
    "shino_kid",
    {
      id: "shino_kid",
      characterId: "shino",
      name: "Shino Aburame (Kid)",
      rank: "C",
      chakraNature: "Earth",
      version: "kid",
      baseStats: { hp: 115, chakra: 125, attack: 17, defense: 13, speed: 15 },
      sprite: "/sprites/shino_kid.png",
      activeJutsuId: "beetle_sphere",
      jutsuList: SHINO_JUTSUS,
    },
  ],
  [
    "shino_shippuden",
    {
      id: "shino_shippuden",
      characterId: "shino",
      name: "Shino Aburame (Shippuden)",
      rank: "B",
      chakraNature: "Earth",
      version: "shippuden",
      baseStats: { hp: 145, chakra: 170, attack: 26, defense: 18, speed: 20 },
      sprite: "/sprites/shino_shippuden.png",
      activeJutsuId: "parasitic_insects",
      jutsuList: SHINO_JUTSUS,
    },
  ],
  [
    "kurenai_shippuden",
    {
      id: "kurenai_shippuden",
      characterId: "kurenai",
      name: "Kurenai Yuhi",
      rank: "B",
      chakraNature: "YinYang",
      version: "shippuden",
      baseStats: { hp: 140, chakra: 165, attack: 24, defense: 16, speed: 20 },
      sprite: "/sprites/kurenai_shippuden.png",
      activeJutsuId: "tree_binding_death",
      jutsuList: KURENAI_JUTSUS,
    },
  ],

  // ==========================================
  // SAND VILLAGE (TEMARI & KANKURO)
  // ==========================================
  [
    "temari_kid",
    {
      id: "temari_kid",
      characterId: "temari",
      name: "Temari (Kid)",
      rank: "B",
      chakraNature: "Wind",
      version: "kid",
      baseStats: { hp: 135, chakra: 145, attack: 24, defense: 14, speed: 18 },
      sprite: "/sprites/temari_kid.png",
      activeJutsuId: "sickle_weasel",
      jutsuList: TEMARI_JUTSUS,
    },
  ],
  [
    "temari_shippuden",
    {
      id: "temari_shippuden",
      characterId: "temari",
      name: "Temari (Shippuden)",
      rank: "A",
      chakraNature: "Wind",
      version: "shippuden",
      baseStats: { hp: 165, chakra: 190, attack: 33, defense: 20, speed: 25 },
      sprite: "/sprites/temari_shippuden.png",
      activeJutsuId: "great_sickle_weasel",
      jutsuList: TEMARI_JUTSUS,
    },
  ],
  [
    "kankuro_kid",
    {
      id: "kankuro_kid",
      characterId: "kankuro",
      name: "Kankuro (Kid)",
      rank: "B",
      chakraNature: "YinYang",
      version: "kid",
      baseStats: { hp: 130, chakra: 140, attack: 23, defense: 15, speed: 17 },
      sprite: "/sprites/kankuro_kid.png",
      activeJutsuId: "karasu_puppet_strike",
      jutsuList: KANKURO_JUTSUS,
    },
  ],
  [
    "kankuro_shippuden",
    {
      id: "kankuro_shippuden",
      characterId: "kankuro",
      name: "Kankuro (Shippuden)",
      rank: "B",
      chakraNature: "YinYang",
      version: "shippuden",
      baseStats: { hp: 150, chakra: 165, attack: 27, defense: 18, speed: 20 },
      sprite: "/sprites/kankuro_shippuden.png",
      activeJutsuId: "black_secret_technique",
      jutsuList: KANKURO_JUTSUS,
    },
  ],

  // ==========================================
  // KONOHA LEADERS & ACADEMY (HIRUZEN, MINATO, KONOHAMARU, IRUKA)
  // ==========================================
  [
    "hiruzen_shippuden",
    {
      id: "hiruzen_shippuden",
      characterId: "hiruzen",
      name: "Hiruzen Sarutobi (Terzo Hokage)",
      rank: "S",
      chakraNature: "Fire",
      version: "shippuden",
      baseStats: { hp: 205, chakra: 255, attack: 42, defense: 27, speed: 27 },
      sprite: "/sprites/hiruzen_shippuden.png",
      activeJutsuId: "fire_dragon_flame",
      jutsuList: HIRUZEN_JUTSUS,
    },
  ],
  [
    "minato_shippuden",
    {
      id: "minato_shippuden",
      characterId: "minato",
      name: "Minato Namikaze (Quarto Hokage)",
      rank: "S",
      chakraNature: "Lightning",
      version: "shippuden",
      baseStats: { hp: 215, chakra: 275, attack: 46, defense: 26, speed: 37 },
      sprite: "/sprites/minato_shippuden.png",
      activeJutsuId: "flying_raijin_stage_2",
      jutsuList: MINATO_JUTSUS,
    },
  ],
  [
    "konohamaru_kid",
    {
      id: "konohamaru_kid",
      characterId: "konohamaru",
      name: "Konohamaru Sarutobi",
      rank: "C",
      chakraNature: "Fire",
      version: "kid",
      baseStats: { hp: 100, chakra: 110, attack: 16, defense: 10, speed: 14 },
      sprite: "/sprites/konohamaru_kid.png",
      activeJutsuId: "rasengan_konohamaru",
      jutsuList: KONOHAMARU_JUTSUS,
    },
  ],
  [
    "iruka_kid",
    {
      id: "iruka_kid",
      characterId: "iruka",
      name: "Iruka Umino",
      rank: "C",
      chakraNature: "Fire",
      version: "kid",
      baseStats: { hp: 105, chakra: 105, attack: 15, defense: 11, speed: 13 },
      sprite: "/sprites/iruka_kid.png",
      activeJutsuId: "academy_reprimand",
      jutsuList: IRUKA_JUTSUS,
    },
  ],

  // ==========================================
  // BOSSES & ANTAGONISTS (PAIN, KONAN, OBITO, MADARA, KISAME, KABUTO)
  // ==========================================
  [
    "pain_boss",
    {
      id: "pain_boss",
      characterId: "pain",
      name: "Pain (Sei Vie di Pain)",
      rank: "S",
      chakraNature: "YinYang",
      version: "special",
      baseStats: { hp: 235, chakra: 285, attack: 47, defense: 30, speed: 29 },
      sprite: "/sprites/pain_boss.png",
      activeJutsuId: "almighty_push",
      jutsuList: PAIN_JUTSUS,
    },
  ],
  [
    "konan_shippuden",
    {
      id: "konan_shippuden",
      characterId: "konan",
      name: "Konan (Angelo della Pioggia)",
      rank: "A",
      chakraNature: "YinYang",
      version: "shippuden",
      baseStats: { hp: 170, chakra: 215, attack: 34, defense: 21, speed: 27 },
      sprite: "/sprites/konan_shippuden.png",
      activeJutsuId: "dance_of_the_shikigami",
      jutsuList: KONAN_JUTSUS,
    },
  ],
  [
    "obito_boss",
    {
      id: "obito_boss",
      characterId: "obito",
      name: "Obito Uchiha (Tobi)",
      rank: "S",
      chakraNature: "Fire",
      version: "special",
      baseStats: { hp: 240, chakra: 280, attack: 46, defense: 32, speed: 31 },
      sprite: "/sprites/obito_boss.png",
      activeJutsuId: "kamui_phasing",
      jutsuList: OBITO_JUTSUS,
    },
  ],
  [
    "obito_tt",
    {
      id: "obito_tt",
      characterId: "obito",
      name: "Obito Uchiha (Forza Portante del Decacoda)",
      rank: "S",
      chakraNature: "Fire",
      version: "special",
      baseStats: { hp: 265, chakra: 325, attack: 53, defense: 36, speed: 34 },
      sprite: "/sprites/obito_tt.png",
      activeJutsuId: "ten_tails_jinchuriki",
      jutsuList: OBITO_JUTSUS,
    },
  ],
  [
    "madara_boss",
    {
      id: "madara_boss",
      characterId: "madara",
      name: "Madara Uchiha (Rinnegan)",
      rank: "S",
      chakraNature: "Fire",
      version: "special",
      baseStats: { hp: 255, chakra: 305, attack: 50, defense: 34, speed: 33 },
      sprite: "/sprites/madara_boss.png",
      activeJutsuId: "majestic_destroyer_flame",
      jutsuList: MADARA_JUTSUS,
    },
  ],
  [
    "madara_tt",
    {
      id: "madara_tt",
      characterId: "madara",
      name: "Madara Uchiha (Eremita dei Sei Percorsi / Decacoda)",
      rank: "S",
      chakraNature: "Fire",
      version: "special",
      baseStats: { hp: 285, chakra: 355, attack: 57, defense: 39, speed: 37 },
      sprite: "/sprites/madara_tt.png",
      activeJutsuId: "infinite_tsukuyomi",
      jutsuList: MADARA_JUTSUS,
    },
  ],
  [
    "deidara_boss",
    {
      id: "deidara_boss",
      characterId: "deidara",
      name: "Deidara (Arte dell'Argilla)",
      rank: "A",
      chakraNature: "Earth",
      version: "shippuden",
      baseStats: { hp: 180, chakra: 215, attack: 36, defense: 21, speed: 26 },
      sprite: "/sprites/deidara_boss.png",
      activeJutsuId: "fireball_obito",
      jutsuList: OBITO_JUTSUS,
    },
  ],
  [
    "sasori_boss",
    {
      id: "sasori_boss",
      characterId: "sasori",
      name: "Sasori della Sabbia Rossa",
      rank: "A",
      chakraNature: "Water",
      version: "shippuden",
      baseStats: { hp: 185, chakra: 220, attack: 35, defense: 24, speed: 23 },
      sprite: "/sprites/sasori_boss.png",
      activeJutsuId: "karasu_puppet_strike",
      jutsuList: KANKURO_JUTSUS,
    },
  ],
  [
    "hidan_boss",
    {
      id: "hidan_boss",
      characterId: "hidan",
      name: "Hidan (Rituale di Jashin)",
      rank: "A",
      chakraNature: "Taijutsu",
      version: "shippuden",
      baseStats: { hp: 190, chakra: 185, attack: 37, defense: 25, speed: 24 },
      sprite: "/sprites/hidan_boss.png",
      activeJutsuId: "white_light_slash",
      jutsuList: KAKASHI_JUTSUS,
    },
  ],
  [
    "kakuzu_boss",
    {
      id: "kakuzu_boss",
      characterId: "kakuzu",
      name: "Kakuzu (I Cinque Cuori)",
      rank: "A",
      chakraNature: "Earth",
      version: "shippuden",
      baseStats: { hp: 200, chakra: 235, attack: 38, defense: 26, speed: 23 },
      sprite: "/sprites/kakuzu_boss.png",
      activeJutsuId: "five_elements_combo",
      jutsuList: HIRUZEN_JUTSUS,
    },
  ],
  [
    "kisame_shippuden",
    {
      id: "kisame_shippuden",
      characterId: "kisame",
      name: "Kisame Hoshigaki",
      rank: "A",
      chakraNature: "Water",
      version: "shippuden",
      baseStats: { hp: 195, chakra: 240, attack: 37, defense: 25, speed: 22 },
      sprite: "/sprites/kisame_shippuden.png",
      activeJutsuId: "water_shark_bullet",
      jutsuList: KISAME_JUTSUS,
    },
  ],
  [
    "kabuto_shippuden",
    {
      id: "kabuto_shippuden",
      characterId: "kabuto",
      name: "Kabuto Yakushi (Eremita)",
      rank: "A",
      chakraNature: "Water",
      version: "shippuden",
      baseStats: { hp: 180, chakra: 225, attack: 34, defense: 24, speed: 26 },
      sprite: "/sprites/kabuto_shippuden.png",
      activeJutsuId: "snake_sage_mode",
      jutsuList: KABUTO_JUTSUS,
    },
  ],
]);
