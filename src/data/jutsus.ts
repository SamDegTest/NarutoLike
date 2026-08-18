import { Jutsu } from "@/types/index";

export const JUTSU_MAP = new Map<string, Jutsu>([
  // ==========================================
  // NARUTO JUTSUS
  // ==========================================
  ["shadow_clone_kid", { id: "shadow_clone_kid", name: "Moltiplicazione del Corpo (Kid)", power: 25, chakraCost: 15, nature: "Taijutsu", sprite: "/sprites/jutsus/shadow_clone.png", description: "Crea cloni per distrarre ed attaccare." }],
  ["rasengan_kid", { id: "rasengan_kid", name: "Rasengan (Kid)", power: 40, chakraCost: 25, nature: "Fuuton", sprite: "/sprites/jutsus/rasengan.png", description: "Sfera rotante di chakra concentrato." }],
  ["wind_bullet", { id: "wind_bullet", name: "Proiettile di Vento", power: 55, chakraCost: 35, nature: "Fuuton", sprite: "/sprites/jutsus/rasengan.png", description: "Spara sfere d'aria compressa." }],
  ["rasengan_shippuden", { id: "rasengan_shippuden", name: "Rasengan Supremo", power: 70, chakraCost: 45, nature: "Fuuton", sprite: "/sprites/jutsus/rasengan.png", description: "Il Rasengan perfezionato di Shippuden." }],
  ["giant_rasengan", { id: "giant_rasengan", name: "Rasengan Gigante", power: 85, chakraCost: 55, nature: "Fuuton", sprite: "/sprites/jutsus/giant_rasengan.png", description: "Un Rasengan ingigantito di grande potenza." }],
  ["sage_art_rasengan", { id: "sage_art_rasengan", name: "Arte Eremitica: Rasengan", power: 100, chakraCost: 65, nature: "Fuuton", sprite: "/sprites/jutsus/sage_rasengan.png", description: "Rasengan potenziato dall'energia della natura." }],
  ["rasenshuriken", { id: "rasenshuriken", name: "Arte del Vento: Rasenshuriken", power: 120, chakraCost: 80, nature: "Fuuton", sprite: "/sprites/jutsus/rasenshuriken.png", description: "Il leggendario shuriken di vento tagliente." }],
  ["kurama_rasengan", { id: "kurama_rasengan", name: "Rasengan di Kurama", power: 135, chakraCost: 90, nature: "Fuuton", sprite: "/sprites/jutsus/rasenshuriken.png", description: "Rasengan fuso con la fiamma dorata della volpe." }],
  ["super_rasenshuriken", { id: "super_rasenshuriken", name: "Terio Rasenshuriken", power: 155, chakraCost: 105, nature: "Fuuton", sprite: "/sprites/jutsus/super_rasenshuriken.png", description: "Rasenshuriken infuso del chakra del Cercoterio." }],
  ["tailed_beast_bomb", { id: "tailed_beast_bomb", name: "Teriosfera (Tailed Beast Bomb)", power: 180, chakraCost: 125, nature: "Fuuton", sprite: "/sprites/jutsus/kurama_beam.png", description: "Attacco supremo con una bomba di chakra concentrato." }],

  // ==========================================
  // SASUKE JUTSUS
  // ==========================================
  ["fireball_jutsu_kid", { id: "fireball_jutsu_kid", name: "Palla di Fuoco Suprema (Kid)", power: 30, chakraCost: 15, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Rilascia una sfera di fuoco dalla bocca." }],
  ["lion_combo_kid", { id: "lion_combo_kid", name: "Concatenazione del Leone", power: 45, chakraCost: 25, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Combo acrobatica aerea basata sul taijutsu." }],
  ["chidori_kid", { id: "chidori_kid", name: "Chidori (Kid)", power: 55, chakraCost: 35, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Chakra elettrico concentrato nella mano." }],
  ["dragon_fire_jutsu", { id: "dragon_fire_jutsu", name: "Fiamma del Drago", power: 70, chakraCost: 45, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Spara fiammate concentrate lungo un filo." }],
  ["chidori_shippuden", { id: "chidori_shippuden", name: "Chidori Perfezionato", power: 85, chakraCost: 55, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Il fulmine perforante di Sasuke Shippuden." }],
  ["chidori_spear", { id: "chidori_spear", name: "Lancia di Chidori", power: 100, chakraCost: 65, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Chidori allungato a forma di lancia perforante." }],
  ["amaterasu", { id: "amaterasu", name: "Fiamme Nere dell'Amaterasu", power: 130, chakraCost: 85, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Fiamme nere inestinguibili evocate dallo Sharingan." }],
  ["susanoo_slash", { id: "susanoo_slash", name: "Fendente del Susanoo", power: 115, chakraCost: 75, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Fendente caricato scagliato con la spada di Susanoo." }],
  ["kirin", { id: "kirin", name: "Kirin (Fulmine Leggendario)", power: 150, chakraCost: 100, nature: "Raiton", sprite: "/sprites/jutsus/kirin.png", description: "Evoca un fulmine naturale a forma di Kirin." }],
  ["indras_arrow", { id: "indras_arrow", name: "Freccia di Indra", power: 180, chakraCost: 125, nature: "Raiton", sprite: "/sprites/jutsus/kirin.png", description: "L'attacco supremo definitivo di Sasuke." }],

  // ==========================================
  // SAKURA JUTSUS
  // ==========================================
  ["cherry_blossom_clash_kid", { id: "cherry_blossom_clash_kid", name: "Pugno di Ciliegio (Kid)", power: 25, chakraCost: 10, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Pugno distruttivo infuso di chakra." }],
  ["basic_healing", { id: "basic_healing", name: "Palmo Rigenerante", power: 35, chakraCost: 20, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Colpo con palmo infuso di chakra curativo." }],
  ["chakra_scalpel", { id: "chakra_scalpel", name: "Bisturi di Chakra", power: 50, chakraCost: 30, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Colpi precisi con lame di chakra." }],
  ["poison_fog", { id: "poison_fog", name: "Nebbia Velenosa", power: 65, chakraCost: 40, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Spara una nube tossica." }],
  ["cherry_blossom_clash_shippuden", { id: "cherry_blossom_clash_shippuden", name: "Impatto del Ciliegio", power: 80, chakraCost: 50, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Pugno che frantuma la terra." }],
  ["giant_impact", { id: "giant_impact", name: "Impatto Titanico", power: 95, chakraCost: 60, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Pugno distruttivo finale." }],
  ["medical_ninjutsu", { id: "medical_ninjutsu", name: "Cura Avanzata", power: 110, chakraCost: 75, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Onda d'urto medica ad alta pressione." }],
  ["mitotic_regeneration", { id: "mitotic_regeneration", name: "Creazione Rinascita", power: 130, chakraCost: 90, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Colpo della Rinascita con rilascio cellulare." }],
  ["byakugou_seal_kid", { id: "byakugou_seal_kid", name: "Sigillo Byakugou", power: 150, chakraCost: 105, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Esplosione di forza dal sigillo Byakugou." }],
  ["byakugou_heal", { id: "byakugou_heal", name: "Cura Totale della Rinascita", power: 180, chakraCost: 125, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Impatto supremo con potenza totale Byakugou." }],

  // ==========================================
  // KAKASHI JUTSUS
  // ==========================================
  ["white_light_slash", { id: "white_light_slash", name: "Fendente di Luce Bianca", power: 35, chakraCost: 15, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Fendente rapido." }],
  ["headhunter_jutsu", { id: "headhunter_jutsu", name: "Decapitazione Sotterranea", power: 45, chakraCost: 20, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Trascina il nemico sottoterra." }],
  ["mud_wall", { id: "mud_wall", name: "Muro di Fango", power: 55, chakraCost: 30, nature: "Doton", sprite: "/sprites/jutsus/sand_shield.png", description: "Muro di fango d'impatto difensivo ed offensivo." }],
  ["shadow_clone_kakashi", { id: "shadow_clone_kakashi", name: "Moltiplicazione Elettrica", power: 65, chakraCost: 40, nature: "Raiton", sprite: "/sprites/jutsus/shadow_clone.png", description: "Cloni caricati a elettricità." }],
  ["chidori_kakashi", { id: "chidori_kakashi", name: "Chidori di Kakashi", power: 80, chakraCost: 50, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Chakra elettrico stridente." }],
  ["lightning_blade", { id: "lightning_blade", name: "Taglio del Fulmine (Raikiri)", power: 95, chakraCost: 60, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Taglio fulmineo letale." }],
  ["water_dragon_bullet", { id: "water_dragon_bullet", name: "Drago Acquatico Copiato", power: 110, chakraCost: 75, nature: "Suiton", sprite: "/sprites/jutsus/sand_burial.png", description: "Drago d'acqua copia." }],
  ["kamui_snare", { id: "kamui_snare", name: "Barriera Kamui", power: 130, chakraCost: 90, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Risucchia spazio-temporalmente." }],
  ["purple_electricity", { id: "purple_electricity", name: "Elettricità Viola", power: 150, chakraCost: 105, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Scariche elettriche viola." }],
  ["kamui_lightning_blade", { id: "kamui_lightning_blade", name: "Kamui Raikiri", power: 180, chakraCost: 125, nature: "Raiton", sprite: "/sprites/jutsus/kirin.png", description: "Raikiri combinato a Kamui." }],

  // ==========================================
  // GAARA JUTSUS
  // ==========================================
  ["sand_binding_coffin", { id: "sand_binding_coffin", name: "Bara di Sabbia", power: 35, chakraCost: 15, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Avvolge il nemico nella sabbia." }],
  ["sand_shield", { id: "sand_shield", name: "Scudo di Sabbia", power: 45, chakraCost: 25, nature: "Doton", sprite: "/sprites/jutsus/sand_shield.png", description: "Scudo di sabbia tagliente d'attacco automatica." }],
  ["sand_shower_kid", { id: "sand_shower_kid", name: "Pioggia di Sabbia", power: 60, chakraCost: 35, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Sabbia scagliata dall'alto." }],
  ["giant_sand_burial", { id: "giant_sand_burial", name: "Funerale del Deserto", power: 75, chakraCost: 45, nature: "Doton", sprite: "/sprites/jutsus/sand_burial.png", description: "Schiaccia il nemico avvolto." }],
  ["shukaku_shield", { id: "shukaku_shield", name: "Scudo dello Shukaku", power: 90, chakraCost: 55, nature: "Doton", sprite: "/sprites/jutsus/shukaku_shield.png", description: "Scudo d'urto dello Shukaku." }],
  ["sand_tsunami", { id: "sand_tsunami", name: "Tsunami di Sabbia", power: 105, chakraCost: 70, nature: "Doton", sprite: "/sprites/jutsus/sand_burial.png", description: "Grande onda di sabbia." }],
  ["sand_desert_coffin", { id: "sand_desert_coffin", name: "Prigione dei Mille Deserti", power: 125, chakraCost: 85, nature: "Doton", sprite: "/sprites/jutsus/sand_desert.png", description: "Immobilizza interamente il nemico." }],
  ["absolute_defense_shield", { id: "absolute_defense_shield", name: "Difesa Assoluta: Cupola", power: 145, chakraCost: 100, nature: "Doton", sprite: "/sprites/jutsus/sand_shield.png", description: "Cupola di sabbia esplosiva ad alta pressione." }],
  ["desert_funeral", { id: "desert_funeral", name: "Funerale Imperiale del Deserto", power: 165, chakraCost: 115, nature: "Doton", sprite: "/sprites/jutsus/sand_desert.png", description: "Sepoltura gigante di sabbia." }],
  ["wind_sand_blade", { id: "wind_sand_blade", name: "Lama Tempesta di Sabbia", power: 185, chakraCost: 130, nature: "Doton", sprite: "/sprites/jutsus/sand_desert.png", description: "Lama d'aria e sabbia tagliente." }],

  // ==========================================
  // ROCK LEE JUTSUS
  // ==========================================
  ["dynamic_entry", { id: "dynamic_entry", name: "Entrata Dinamica", power: 30, chakraCost: 10, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Calcio volante d'irruzione." }],
  ["leaf_hurricane", { id: "leaf_hurricane", name: "Uragano della Foglia", power: 40, chakraCost: 20, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Calcio basso rotante." }],
  ["gate_1_open", { id: "gate_1_open", name: "Primo Cancello: Apertura", power: 55, chakraCost: 30, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Rilascia inibitori muscolari." }],
  ["primary_lotus", { id: "primary_lotus", name: "Loto Frontale", power: 70, chakraCost: 40, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Schianto aereo ravvicinato." }],
  ["gate_3_open", { id: "gate_3_open", name: "Terzo Cancello: Vita", power: 85, chakraCost: 50, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Afflusso massimo di forza." }],
  ["hidden_lotus", { id: "hidden_lotus", name: "Loto Posteriore", power: 100, chakraCost: 65, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Colpi rapidi aerei letali." }],
  ["gate_5_open", { id: "gate_5_open", name: "Quinto Cancello: Chiusura", power: 115, chakraCost: 80, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Forza d'urto estrema." }],
  ["gate_6_open", { id: "gate_6_open", name: "Sesto Cancello: Visione", power: 135, chakraCost: 95, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Aura verde distruttiva." }],
  ["crane_fist", { id: "crane_fist", name: "Pugno dell'Ubriaco", power: 155, chakraCost: 110, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Movimenti confusi imprevedibili." }],
  ["morning_peacock", { id: "morning_peacock", name: "Pavone del Mattino", power: 180, chakraCost: 125, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Pugni di fuoco alla velocità del suono." }],

  // ==========================================
  // NEJI JUTSUS
  // ==========================================
  ["gentle_fist_strike", { id: "gentle_fist_strike", name: "Palmo del Pugno Gentile", power: 30, chakraCost: 15, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Colpo base Byakugan." }],
  ["eight_trigrams_16", { id: "eight_trigrams_16", name: "16 Chiusure degli Hyuga", power: 45, chakraCost: 25, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Blocca i punti di fuga di base." }],
  ["eight_trigrams_32", { id: "eight_trigrams_32", name: "32 Chiusure degli Hyuga", power: 60, chakraCost: 35, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Colpi mirati a bloccare il chakra." }],
  ["rotation_kid", { id: "rotation_kid", name: "Palmo Rotativo (Kid)", power: 75, chakraCost: 45, nature: "Taijutsu", sprite: "/sprites/jutsus/sand_shield.png", description: "Cupola rotante di chakra." }],
  ["air_palm", { id: "air_palm", name: "Palmo del Vuoto", power: 90, chakraCost: 55, nature: "Taijutsu", sprite: "/sprites/jutsus/rasengan.png", description: "Lancia proiettili d'aria." }],
  ["rotation_shippuden", { id: "rotation_shippuden", name: "Palmo Rotativo Supremo", power: 105, chakraCost: 70, nature: "Taijutsu", sprite: "/sprites/jutsus/sand_shield.png", description: "Rotazione difensiva invalicabile." }],
  ["eight_trigrams_64", { id: "eight_trigrams_64", name: "64 Chiusure (Hyuga Style)", power: 125, chakraCost: 85, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Chiusura totale delle 64 porte." }],
  ["eight_trigrams_128", { id: "eight_trigrams_128", name: "128 Chiusure Speciali", power: 145, chakraCost: 100, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Colpi fulminei ad alta velocità." }],
  ["giant_air_palm", { id: "giant_air_palm", name: "Grande Palmo del Vuoto", power: 165, chakraCost: 115, nature: "Taijutsu", sprite: "/sprites/jutsus/rasengan.png", description: "Getto d'aria distruttivo." }],
  ["gentle_fist_body_blow", { id: "gentle_fist_body_blow", name: "Esplosione di Aghi di Chakra", power: 185, chakraCost: 130, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Espelle aghi di chakra dai pori." }],

  // ==========================================
  // SHIKAMARU JUTSUS
  // ==========================================
  ["shadow_imitation_kid", { id: "shadow_imitation_kid", name: "Controllo dell'Ombra (Kid)", power: 30, chakraCost: 15, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Cattura l'avversario bloccandolo con l'ombra." }],
  ["shadow_choke_kid", { id: "shadow_choke_kid", name: "Strozzatura dell'Ombra", power: 45, chakraCost: 25, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "L'ombra strangola lievemente il bersaglio." }],
  ["paper_bomb_trap", { id: "paper_bomb_trap", name: "Trappola di Carte Bomba", power: 60, chakraCost: 35, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Scatena esplosivi posizionati tatticamente." }],
  ["shadow_sewing", { id: "shadow_sewing", name: "Cucitura d'Ombra", power: 75, chakraCost: 45, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Punte d'ombra trafiggono il nemico." }],
  ["shadow_pull", { id: "shadow_pull", name: "Trazione dell'Ombra", power: 90, chakraCost: 55, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Trascina violentemente l'avversario." }],
  ["shadow_imitation_shippuden", { id: "shadow_imitation_shippuden", name: "Possessione d'Ombra Estesa", power: 105, chakraCost: 70, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Possessione a lungo raggio." }],
  ["flash_bomb_tactic", { id: "flash_bomb_tactic", name: "Tattica della Bomba Luce", power: 125, chakraCost: 85, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Allunga le ombre creando luce artificiale." }],
  ["shadow_strangle", { id: "shadow_strangle", name: "Strozzatura d'Ombra Gigante", power: 145, chakraCost: 100, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Strozza con artigli d'ombra massicci." }],
  ["shadow_clutch", { id: "shadow_clutch", name: "Morsa d'Ombra", power: 165, chakraCost: 115, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Afferra e stritola con forza dell'ombra." }],
  ["shadow_binding_field", { id: "shadow_binding_field", name: "Campo di Vincolo dell'Ombra", power: 185, chakraCost: 130, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_desert.png", description: "Immobilizza e schiaccia chiunque nell'area d'ombra." }],

  // ==========================================
  // HINATA JUTSUS
  // ==========================================
  ["gentle_fist_hinata", { id: "gentle_fist_hinata", name: "Pugno Gentile di Hinata", power: 30, chakraCost: 15, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Palmi leggeri che bloccano il chakra." }],
  ["protection_rotation", { id: "protection_rotation", name: "Rotazione Protettiva", power: 45, chakraCost: 25, nature: "Taijutsu", sprite: "/sprites/jutsus/sand_shield.png", description: "Crea barriere ruotando i palmi." }],
  ["twin_lion_fists_intro", { id: "twin_lion_fists_intro", name: "Pre-Passo dei Leoni Gemelli", power: 60, chakraCost: 35, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Chakra dei leoni gemelli concentrato sulle mani." }],
  ["protective_64_palms", { id: "protective_64_palms", name: "64 Palmi Protettivi", power: 75, chakraCost: 45, nature: "Taijutsu", sprite: "/sprites/jutsus/sand_shield.png", description: "Barriera invalicabile di aghi di chakra." }],
  ["twin_lion_fists", { id: "twin_lion_fists", name: "Passo dei Leoni Gemelli", power: 90, chakraCost: 55, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Pugni a testa di leone che assorbono chakra nemico." }],
  ["eight_trigrams_air_palm", { id: "eight_trigrams_air_palm", name: "Palmo del Vuoto degli Hyuga", power: 105, chakraCost: 70, nature: "Taijutsu", sprite: "/sprites/jutsus/rasengan.png", description: "Scaglia onde d'aria dal palmo." }],
  ["gentle_step_lion", { id: "gentle_step_lion", name: "Danza dei Leoni di Giada", power: 125, chakraCost: 85, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Attacchi combinati con leoni gemelli." }],
  ["trigrams_rotation", { id: "trigrams_rotation", name: "Rotazione Divina degli Otto Trigrammi", power: 145, chakraCost: 100, nature: "Taijutsu", sprite: "/sprites/jutsus/sand_shield.png", description: "Rotazione difensiva ad altissima pressione." }],
  ["eight_trigrams_twin_lions", { id: "eight_trigrams_twin_lions", name: "Attacco Supremo dei Leoni Gemelli", power: 165, chakraCost: 115, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Fonde i leoni gemelli in un colpo devastante." }],

  // ==========================================
  // ITACHI JUTSUS
  // ==========================================
  ["shuriken_jutsu_itachi", { id: "shuriken_jutsu_itachi", name: "Lancio Rapido di Shuriken", power: 35, chakraCost: 15, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Trafigge rapidamente con shuriken perfetti." }],
  ["clone_great_explosion", { id: "clone_great_explosion", name: "Clone a Grande Esplosione", power: 65, chakraCost: 35, nature: "Katon", sprite: "/sprites/jutsus/shadow_clone.png", description: "Un clone d'ombra che salta in aria." }],
  ["genjutsu_crow", { id: "genjutsu_crow", name: "illusione dei Corvi", power: 50, chakraCost: 25, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Confonde il nemico trasformandosi in corvi." }],
  ["fireball_itachi", { id: "fireball_itachi", name: "Katon: Palla di Fuoco Suprema", power: 80, chakraCost: 50, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Grande fiammata devastante." }],
  ["tsukuyomi", { id: "tsukuyomi", name: "Tsukuyomi (Illusione Infinita)", power: 100, chakraCost: 65, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_desert.png", description: "Tortura mentale spazio-temporale." }],
  ["amaterasu_itachi", { id: "amaterasu_itachi", name: "Amaterasu di Itachi", power: 120, chakraCost: 80, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Fiamme nere evocate dallo Sharingan Ipnotico." }],
  ["yasaka_beads", { id: "yasaka_beads", name: "Magatama di Yasaka", power: 140, chakraCost: 95, nature: "Raiton", sprite: "/sprites/jutsus/giant_rasengan.png", description: "Proiettili spirituali scagliati da Susanoo." }],
  ["susanoo_shield_itachi", { id: "susanoo_shield_itachi", name: "Specchio di Yata", power: 155, chakraCost: 105, nature: "Doton", sprite: "/sprites/jutsus/shukaku_shield.png", description: "Specchio di Yata: Onda spirituale riflessa." }],
  ["susanoo_slash_itachi", { id: "susanoo_slash_itachi", name: "Lama di Totsuka", power: 175, chakraCost: 120, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Lama spirituale che sigilla chiunque colpisca." }],
  ["izanami", { id: "izanami", name: "Izanami (Ciclo Infinito)", power: 195, chakraCost: 135, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_desert.png", description: "Intriga la mente in un loop temporale infinito." }],

  // ==========================================
  // JIRAIYA JUTSUS
  // ==========================================
  ["needle_senbon", { id: "needle_senbon", name: "Senbon di Capelli", power: 35, chakraCost: 15, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Spara capelli induriti come aghi." }],
  ["hair_shield", { id: "hair_shield", name: "Scudo Spinoso di Capelli", power: 50, chakraCost: 25, nature: "Doton", sprite: "/sprites/jutsus/sand_shield.png", description: "Scudo di capelli spinosi con contrattacco." }],
  ["fire_breath_jiraiya", { id: "fire_breath_jiraiya", name: "Soffio di Fuoco del Rospo", power: 65, chakraCost: 35, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Combina olio e fiamme contro il nemico." }],
  ["toad_summon", { id: "toad_summon", name: "Evocazione: Gamabunta", power: 80, chakraCost: 50, nature: "Suiton", sprite: "/sprites/jutsus/sand_burial.png", description: "Evoca il re dei rospi Gamabunta." }],
  ["rasengan_jiraiya", { id: "rasengan_jiraiya", name: "Rasengan Eremita", power: 95, chakraCost: 65, nature: "Fuuton", sprite: "/sprites/jutsus/rasengan.png", description: "Sfera di chakra appresa da Minato." }],
  ["swamp_of_underworld", { id: "swamp_of_underworld", name: "Palude dell'Oltretomba", power: 115, chakraCost: 80, nature: "Doton", sprite: "/sprites/jutsus/sand_desert.png", description: "Crea una palude di fango che inghiotte i nemici." }],
  ["wild_lion_mane", { id: "wild_lion_mane", name: "Criniera del Leone Selvaggio", power: 135, chakraCost: 95, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Afferra e stritola i bersagli con la capigliatura." }],
  ["sage_mode_intro", { id: "sage_mode_intro", name: "Modalità Eremitica dei Rospi", power: 150, chakraCost: 105, nature: "Fuuton", sprite: "/sprites/jutsus/sage_rasengan.png", description: "Assorbe energia naturale aumentando ATK e DEF." }],
  ["bath_of_boiling_oil", { id: "bath_of_boiling_oil", name: "Bagno di Olio Bollente", power: 170, chakraCost: 120, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Colpo combinato letale di fuoco, vento e olio eremitici." }],
  ["massive_rasengan", { id: "massive_rasengan", name: "Ultra Rasengan Eremitico", power: 190, chakraCost: 135, nature: "Fuuton", sprite: "/sprites/jutsus/giant_rasengan.png", description: "Un Rasengan mastodontico di proporzioni leggendarie." }],

  // ==========================================
  // TSUNADE JUTSUS
  // ==========================================
  ["tsunade_kick", { id: "tsunade_kick", name: "Calcio Spacca-Terreno", power: 35, chakraCost: 15, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Calcio dall'alto ad altissimo impatto." }],
  ["chakra_burst", { id: "chakra_burst", name: "Esplosione di Forza", power: 65, chakraCost: 35, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Rilascia chakra dai pugni aumentando la forza d'urto." }],
  ["body_flicker_tsunade", { id: "body_flicker_tsunade", name: "Scatto del Fulmine Shinobi", power: 50, chakraCost: 25, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Scatto rapido e pugno ad alta velocità." }],
  ["nervous_system_rupture", { id: "nervous_system_rupture", name: "Rottura del Sistema Nervoso", power: 80, chakraCost: 50, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Invia elettricità nel corpo nemico paralizzandolo." }],
  ["heaven_spear_kick", { id: "heaven_spear_kick", name: "Calcio del Paradiso", power: 95, chakraCost: 65, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Colpo da discesa aerea devastante." }],
  ["katsuyu_summon", { id: "katsuyu_summon", name: "Evocazione: Katsuyu", power: 115, chakraCost: 80, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Evocazione Katsuyu con impatto d'acido curativo." }],
  ["medical_regeneration", { id: "medical_regeneration", name: "Rigenerazione Eremitica", power: 135, chakraCost: 95, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Rigenerazione e pugno eremitico." }],
  ["byakugou_healing_tsunade", { id: "byakugou_healing_tsunade", name: "Rilascio del Sigillo Byakugou", power: 155, chakraCost: 110, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Rilascio Byakugou con impatto titanico." }],

  // ==========================================
  // OROCHIMARU JUTSUS
  // ==========================================
  ["snake_strike", { id: "snake_strike", name: "Morsa dei Serpenti d'Ombra", power: 35, chakraCost: 15, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Fila di serpenti sbuca dalle maniche per azzannare." }],
  ["shadow_clone_snake", { id: "shadow_clone_snake", name: "Moltiplicazione dei Serpenti", power: 50, chakraCost: 25, nature: "Doton", sprite: "/sprites/jutsus/shadow_clone.png", description: "Crea cloni che si dissolvono in serpi." }],
  ["sword_kusanagi_strike", { id: "sword_kusanagi_strike", name: "Spada Kusanagi", power: 65, chakraCost: 35, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Estrae la lama Kusanagi dalla gola trafiggendo." }],
  ["triple_rashomon", { id: "triple_rashomon", name: "Triplo Cancello Rashomon", power: 80, chakraCost: 50, nature: "Doton", sprite: "/sprites/jutsus/shukaku_shield.png", description: "Impatto colossale del Triplo Rashomon." }],
  ["poison_snake_summon", { id: "poison_snake_summon", name: "Evocazione: Manda", power: 95, chakraCost: 65, nature: "Doton", sprite: "/sprites/jutsus/sand_desert.png", description: "Evoca il serpente velenoso Manda." }],
  ["wind_gale_orochi", { id: "wind_gale_orochi", name: "Raffica di Vento dell'Ombra", power: 115, chakraCost: 80, nature: "Fuuton", sprite: "/sprites/jutsus/rasengan.png", description: "Crea forti raffiche ventose taglienti." }],
  ["snake_skin_shedding", { id: "snake_skin_shedding", name: "Muta della Pelle", power: 135, chakraCost: 95, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Muta della pelle e contrattacco di veleno." }],
  ["reaper_death_seal_break", { id: "reaper_death_seal_break", name: "Rottura del Sigillo del Mietitore", power: 155, chakraCost: 110, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Recupera le anime delle braccia sigillate." }],
  ["eight_branches_giant_snake", { id: "eight_branches_giant_snake", name: "Serpente a Otto Teste (Yamata)", power: 175, chakraCost: 125, nature: "Doton", sprite: "/sprites/jutsus/sand_desert.png", description: "Si trasforma in un drago/serpente bianco colossale." }],
  ["edo_tensei", { id: "edo_tensei", name: "Resurrezione Impura (Edo Tensei)", power: 195, chakraCost: 140, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Evoca gli Hokage defunti per polverizzare i nemici." }],

  // ==========================================
  // TENTEN JUTSUS
  // ==========================================
  ["twin_rising_dragons", { id: "twin_rising_dragons", name: "Dragi Gemelli Ascendenti", power: 35, chakraCost: 15, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Srotola pergamene evocando una tempesta di armi." }],
  ["iron_ball_strike", { id: "iron_ball_strike", name: "Sfera Ferrata Gigante", power: 55, chakraCost: 30, nature: "Taijutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Lancia una pesante sfera di ferro chiodata." }],
  ["unsealing_technique", { id: "unsealing_technique", name: "Disincanto delle Cento Armi", power: 75, chakraCost: 45, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Rilascia centinaia di armi contemporaneamente." }],
  ["explosing_dragon_strike", { id: "explosing_dragon_strike", name: "Drago di Carte Esplosive", power: 100, chakraCost: 65, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Drago d'armi imbottito di carte bomba." }],
  ["hundred_weapons_storm", { id: "hundred_weapons_storm", name: "Tempesta dei Mille Strumenti", power: 135, chakraCost: 90, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Pioggia ininterrotta di armi leggendarie." }],

  // ==========================================
  // CHOJI JUTSUS
  // ==========================================
  ["human_boulder", { id: "human_boulder", name: "Palla di Carne (Palla Umana)", power: 35, chakraCost: 15, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Si appallottola travolgendo i nemici." }],
  ["expansion_jutsu", { id: "expansion_jutsu", name: "Tecnica dell'Ingrandimento", power: 55, chakraCost: 30, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Aumenta le dimensioni corporee per maggior impatto." }],
  ["partial_expansion_fist", { id: "partial_expansion_fist", name: "Pugno Gigante (Ingrandimento Parziale)", power: 75, chakraCost: 45, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Ingrandisce il pugno per uno schiacciamento." }],
  ["super_expansion_jutsu", { id: "super_expansion_jutsu", name: "Super Ingrandimento Corporeo", power: 105, chakraCost: 70, nature: "Taijutsu", sprite: "/sprites/jutsus/giant_rasengan.png", description: "Diventa un gigante schiacciando il campo." }],
  ["butterfly_bombing", { id: "butterfly_bombing", name: "Modalità Farfalla: Pugno Finale", power: 145, chakraCost: 100, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Converti le calorie in ali di chakra e sferra un colpo devastante." }],

  // ==========================================
  // INO JUTSUS
  // ==========================================
  ["mind_transfer_jutsu", { id: "mind_transfer_jutsu", name: "Capovolgimento del Corpo", power: 35, chakraCost: 15, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Proietta lo spirito bloccando l'avversario." }],
  ["mind_destruction_jutsu", { id: "mind_destruction_jutsu", name: "Sconvolgimento Mentale", power: 55, chakraCost: 30, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Confonde e danneggia la mente nemica." }],
  ["chakra_hair_trap", { id: "chakra_hair_trap", name: "Trappola di Capelli al Chakra", power: 75, chakraCost: 45, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Immobilizza i movimenti avversari con fili di chakra." }],
  ["healing_blossom", { id: "healing_blossom", name: "Cura del Giglio della Foglia", power: 100, chakraCost: 65, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Attacco del Giglio con chakra rigenerante." }],
  ["psycho_mind_transmission", { id: "psycho_mind_transmission", name: "Telepatia Distruttiva", power: 135, chakraCost: 90, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_desert.png", description: "Onda telepatica che destabilizza i punti vitali." }],

  // ==========================================
  // OBITO JUTSUS
  // ==========================================
  ["kamui_phasing", { id: "kamui_phasing", name: "Intangibilità Kamui", power: 40, chakraCost: 20, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_shield.png", description: "Intangibilità e contrattacco aereo Kamui." }],
  ["fireball_obito", { id: "fireball_obito", name: "Katon: Palla di Fuoco di Obito", power: 65, chakraCost: 35, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Fiammata ruotata potenziata da Kamui." }],
  ["wood_release_spikes", { id: "wood_release_spikes", name: "Arte del Legno: Spine di Radici", power: 95, chakraCost: 55, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Trafigge i bersagli con radici di legno letali." }],
  ["kamui_dimension_warp", { id: "kamui_dimension_warp", name: "Risucchio Dimensione Kamui", power: 130, chakraCost: 85, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_desert.png", description: "Risucchia parti del corpo nel'altra dimensione." }],
  ["ten_tails_jinchuriki", { id: "ten_tails_jinchuriki", name: "Sfere della Verità (Truth-Seeker)", power: 175, chakraCost: 120, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Attacco con sfere che disintegrano il chakra." }],

  // ==========================================
  // MADARA JUTSUS
  // ==========================================
  ["majestic_destroyer_flame", { id: "majestic_destroyer_flame", name: "Katon: Distruzione Maestosa", power: 70, chakraCost: 40, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Un oceano di fuoco che travolge l'intero campo." }],
  ["wood_dragon_jutsu", { id: "wood_dragon_jutsu", name: "Arte del Legno: Drago Gigante", power: 105, chakraCost: 65, nature: "Doton", sprite: "/sprites/jutsus/sand_burial.png", description: "Evoca un drago di legno che assorbe chakra." }],
  ["susanoo_perfect_blade", { id: "susanoo_perfect_blade", name: "Susanoo Perfetto: Fendente", power: 140, chakraCost: 90, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Spada colossale che taglia le montagne." }],
  ["shatbered_heaven_meteor", { id: "shatbered_heaven_meteor", name: "Tengai Shinsei (Meteora cadente)", power: 175, chakraCost: 120, nature: "Doton", sprite: "/sprites/jutsus/sand_desert.png", description: "Evoca una gigantesca meteora dal cielo." }],
  ["infinite_tsukuyomi", { id: "infinite_tsukuyomi", name: "Tsukuyomi Infinito", power: 210, chakraCost: 150, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Illumina il mondo intrappolando chiunque nel sogno." }],

  // ==========================================
  // PAIN JUTSUS
  // ==========================================
  ["bansho_tenin", { id: "bansho_tenin", name: "Bansho Ten'in (Attrazione Celeste)", power: 55, chakraCost: 30, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Attira l'avversario a sé con forza gravitazionale." }],
  ["almighty_push", { id: "almighty_push", name: "Shinra Tensei (Repulsione Celeste)", power: 85, chakraCost: 50, nature: "Genjutsu", sprite: "/sprites/jutsus/rasengan.png", description: "Respinge e devasta ogni cosa attorno." }],
  ["summoning_rinnegan", { id: "summoning_rinnegan", name: "Evocazione del Rinnegan (Beast)", power: 115, chakraCost: 75, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_burial.png", description: "Evoca mostri giganti immortali." }],
  ["chibaku_tensei", { id: "chibaku_tensei", name: "Chibaku Tensei (Nascita della Luna)", power: 150, chakraCost: 100, nature: "Doton", sprite: "/sprites/jutsus/sand_desert.png", description: "Crea una sfera gravitazionale che intrappola nella roccia." }],
  ["shinra_tensei_cataclysm", { id: "shinra_tensei_cataclysm", name: "Shinra Tensei Catastrofico", power: 190, chakraCost: 135, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Rasa al suolo un villaggio in un istante." }],

  // ==========================================
  // KONAN JUTSUS
  // ==========================================
  ["paper_shuriken", { id: "paper_shuriken", name: "Shuriken di Carta", power: 35, chakraCost: 15, nature: "Fuuton", sprite: "/sprites/jutsus/basic_healing.png", description: "Lancia fogli affilati come lame." }],
  ["paper_wings_flight", { id: "paper_wings_flight", name: "Ali di Carta dell'Angelo", power: 55, chakraCost: 30, nature: "Fuuton", sprite: "/sprites/jutsus/sand_shield.png", description: "Ali di carta con fendente aereo dell'Angelo." }],
  ["paper_spear_assault", { id: "paper_spear_assault", name: "Lancia di Carta Sacra", power: 80, chakraCost: 50, nature: "Fuuton", sprite: "/sprites/jutsus/chidori.png", description: "Perfetta lancia di fogli induriti." }],
  ["dance_of_the_shikigami", { id: "dance_of_the_shikigami", name: "Danza dello Shikigami", power: 115, chakraCost: 75, nature: "Fuuton", sprite: "/sprites/jutsus/sand_desert.png", description: "Disgrega il corpo in miliardi di fogli volanti." }],
  ["sacred_paper_ocean", { id: "sacred_paper_ocean", name: "Oceano di 600 Miliardi di Carte Bomba", power: 160, chakraCost: 115, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Esplosione continua per 10 minuti ininterrotti." }],

  // ==========================================
  // TEMARI JUTSUS
  // ==========================================
  ["sickle_weasel", { id: "sickle_weasel", name: "Arte del Vento: Danza della Donnola", power: 40, chakraCost: 20, nature: "Fuuton", sprite: "/sprites/jutsus/rasengan.png", description: "Spazza il campo con folate di vento tagliente." }],
  ["wind_fan_slice", { id: "wind_fan_slice", name: "Fendente del Ventaglio Gigante", power: 65, chakraCost: 35, nature: "Fuuton", sprite: "/sprites/jutsus/rasengan.png", description: "Genera una lama d'aria dall'ampiezza del ventaglio." }],
  ["great_sickle_weasel", { id: "great_sickle_weasel", name: "Grande Donnola del Vento", power: 95, chakraCost: 60, nature: "Fuuton", sprite: "/sprites/jutsus/rasenshuriken.png", description: "Tornado tagliente che radde al suolo le foreste." }],
  ["summoning_kamatari", { id: "summoning_kamatari", name: "Evocazione: Kamatari", power: 125, chakraCost: 85, nature: "Fuuton", sprite: "/sprites/jutsus/rasenshuriken.png", description: "Evoca la donnola falciatrice su una scopa d'aria." }],
  ["cyclone_scythe_tempest", { id: "cyclone_scythe_tempest", name: "Tempesta delle Tre Lune", power: 160, chakraCost: 115, nature: "Fuuton", sprite: "/sprites/jutsus/super_rasenshuriken.png", description: "Il potere massimo delle tre lune del ventaglio." }],

  // ==========================================
  // KANKURO JUTSUS
  // ==========================================
  ["karasu_puppet_strike", { id: "karasu_puppet_strike", name: "Attacco del Burattino Karasu", power: 35, chakraCost: 15, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Scatta con lame avvelenate del marionetta." }],
  ["black_secret_technique", { id: "black_secret_technique", name: "Tecnica Segreta Nera: Morsa della Marionetta", power: 65, chakraCost: 35, nature: "Taijutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Rinchiude il nemico dentro Kuroari e lo trafigge." }],
  ["poison_fog_trap", { id: "poison_fog_trap", name: "Bomba a Nebbia Tossica", power: 90, chakraCost: 55, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Rilascia gas velenoso viola inossidabile." }],
  ["sanshouuo_shield", { id: "sanshouuo_shield", name: "Scudo Salamandra (Sanshouuo)", power: 120, chakraCost: 80, nature: "Doton", sprite: "/sprites/jutsus/shukaku_shield.png", description: "Scudo Salamandra con contrattacco di fuoco." }],
  ["puppet_show_execution", { id: "puppet_show_execution", name: "Spettacolo dei Tre Burattini", power: 155, chakraCost: 110, nature: "Taijutsu", sprite: "/sprites/jutsus/sand_burial.png", description: "Attacco combinato di Karasu, Kuroari e Sanshouuo." }],

  // ==========================================
  // SHINO JUTSUS
  // ==========================================
  ["beetle_sphere", { id: "beetle_sphere", name: "Sfera degli Insetti (Kikai)", power: 35, chakraCost: 15, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Avvolge il nemico in una nuvola di insetti." }],
  ["insect_jamming", { id: "insect_jamming", name: "Disturbo degli Insetti", power: 55, chakraCost: 30, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_shield.png", description: "Sciame d'attacco e disturbo degli insetti." }],
  ["parasitic_insects", { id: "parasitic_insects", name: "Parassiti Divoratori di Chakra", power: 80, chakraCost: 50, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Gli insetti succhiano il chakra e gli HP nemici." }],
  ["insect_boulder_crush", { id: "insect_boulder_crush", name: "Cupola di Insetti Distruttori", power: 110, chakraCost: 75, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_desert.png", description: "Migliaia di insetti schiacciano la preda." }],
  ["giant_parasitic_beetle", { id: "giant_parasitic_beetle", name: "Bozzolo del Coleottero Gigante", power: 150, chakraCost: 105, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_desert.png", description: "Insetto che cresce nutrendosi della carne dell'ospite." }],

  // ==========================================
  // KIBA JUTSUS
  // ==========================================
  ["fang_over_fang", { id: "fang_over_fang", name: "Zanna Sopra Zanna (Gatsuga)", power: 40, chakraCost: 20, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Tornado rotante insieme ad Akamaru." }],
  ["man_beast_clone", { id: "man_beast_clone", name: "Clone Uomo-Bestia", power: 65, chakraCost: 35, nature: "Taijutsu", sprite: "/sprites/jutsus/shadow_clone.png", description: "Akamaru si trasforma in una copia di Kiba." }],
  ["tunneling_fang", { id: "tunneling_fang", name: "Zanna Perforante Sotterranea", power: 90, chakraCost: 55, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Trapana il terreno sbucando sotto i piedi nemici." }],
  ["two_headed_wolf", { id: "two_headed_wolf", name: "Lupo a Due Teste (Garouga)", power: 125, chakraCost: 80, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Fusione in un mastodontico lupo bianco." }],
  ["three_headed_wolf_fang", { id: "three_headed_wolf_fang", name: "Zanna del Lupo a Tre Teste", power: 160, chakraCost: 110, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Attacco supremo della fusione con cloni d'ombra." }],

  // ==========================================
  // MIGHT GUY JUTSUS
  // ==========================================
  ["leaf_strong_whirlwind", { id: "leaf_strong_whirlwind", name: "Gran Tornado della Foglia", power: 45, chakraCost: 20, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Spazzata di calci potenti a catena." }],
  ["morning_peacock_guy", { id: "morning_peacock_guy", name: "Pavone del Mattino (Sesto Cancello)", power: 80, chakraCost: 50, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Pugni di fuoco ad altissima velocità." }],
  ["daytime_tiger", { id: "daytime_tiger", name: "Tigre del Mezzogiorno (Settimo Cancello)", power: 120, chakraCost: 80, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Colpo d'aria compressa a forma di tigre sbranante." }],
  ["evening_elephant", { id: "evening_elephant", name: "Elefante della Sera (Ottavo Cancello)", power: 160, chakraCost: 115, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Cannoni d'aria consecutivi sferrati con i piedi." }],
  ["night_guy", { id: "night_guy", name: "Guy della Notte (Ryu Supremo)", power: 210, chakraCost: 155, nature: "Taijutsu", sprite: "/sprites/jutsus/kirin.png", description: "Drago rosso di chakra che piega lo spazio attorno." }],

  // ==========================================
  // MINATO JUTSUS
  // ==========================================
  ["flying_raijin_slice", { id: "flying_raijin_slice", name: "Taglio del Dio del Fulmine", power: 50, chakraCost: 25, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Teletrasporto istantaneo dietro l'avversario con Kunai." }],
  ["rasengan_minato", { id: "rasengan_minato", name: "Rasengan del Lampo Giallo", power: 85, chakraCost: 50, nature: "Fuuton", sprite: "/sprites/jutsus/rasengan.png", description: "L'originale Rasengan perfetto inventato da Minato." }],
  ["flying_raijin_stage_2", { id: "flying_raijin_stage_2", name: "Dio del Fulmine Volante II", power: 120, chakraCost: 75, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Lancia il kunai sopra il nemico per un impatto dall'alto." }],
  ["reaper_death_seal_minato", { id: "reaper_death_seal_minato", name: "Sigillo del Mietitore", power: 155, chakraCost: 105, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Evoca lo Shinigami per sigillare l'anima nemica." }],
  ["space_time_rasengan", { id: "space_time_rasengan", name: "Rasengan Spazio-Temporale", power: 190, chakraCost: 130, nature: "Fuuton", sprite: "/sprites/jutsus/super_rasenshuriken.png", description: "Combo alla velocità della luce con formule di teletrasporto." }],

  // ==========================================
  // KABUTO JUTSUS
  // ==========================================
  ["chakra_scalpel_kabuto", { id: "chakra_scalpel_kabuto", name: "Bisturi di Chakra Medico", power: 40, chakraCost: 20, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Recide i muscoli ed i tendini interni." }],
  ["medical_ninjutsu_drain", { id: "medical_ninjutsu_drain", name: "Rigenerazione e Assorbimento", power: 65, chakraCost: 35, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Assorbimento medico d'urto." }],
  ["white_rage_jutsu", { id: "white_rage_jutsu", name: "Arte Eremitica: Rabbia Bianca", power: 95, chakraCost: 60, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_desert.png", description: "Drago di luce accecante e vibrazioni paralizzanti." }],
  ["snake_sage_mode", { id: "snake_sage_mode", name: "Modalità Eremitica dei Serpenti", power: 130, chakraCost: 85, nature: "Doton", sprite: "/sprites/jutsus/sand_burial.png", description: "Fusione con il chakra del Drago della caverna." }],
  ["edo_tensei_army", { id: "edo_tensei_army", name: "Esercito di Resurrezione Impura", power: 170, chakraCost: 120, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Controlla le leggende del passato risuscitati." }],

  // ==========================================
  // KURENAI JUTSUS
  // ==========================================
  ["tree_binding_death", { id: "tree_binding_death", name: "Illusione Demoniaca: Morte dell'Albero", power: 45, chakraCost: 20, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Legami a un albero d'illusione per trafiggere." }],
  ["flower_petal_escape", { id: "flower_petal_escape", name: "Fuga di Petali di Ciliegio", power: 70, chakraCost: 35, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_shield.png", description: "Fuga di petali taglienti ed illusione." }],
  ["demonic_illusion_tree", { id: "demonic_illusion_tree", name: "Albero delle Illusioni Oscure", power: 95, chakraCost: 60, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Immobilizzazione totale della percezione." }],
  ["phantom_mirror", { id: "phantom_mirror", name: "Specchio del Fantasma", power: 125, chakraCost: 85, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_desert.png", description: "Riflette l'illusione nemica potenziata." }],
  ["nightmare_tree_blossom", { id: "nightmare_tree_blossom", name: "Fioritura Incubo di Kurenai", power: 160, chakraCost: 110, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_desert.png", description: "Incubo sensoriale devastante." }],

  // ==========================================
  // ASUMA JUTSUS
  // ==========================================
  ["trench_knife_chakra", { id: "trench_knife_chakra", name: "Lame da Pugno al Chakra", power: 45, chakraCost: 20, nature: "Fuuton", sprite: "/sprites/jutsus/chidori.png", description: "Condensa chakra Fuuton estendendo la lama." }],
  ["ash_pile_burning", { id: "ash_pile_burning", name: "Katon: Nube di Cenere Bruciante", power: 75, chakraCost: 40, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Soffia polvere di cenere facendola esplodere." }],
  ["flying_swallow", { id: "flying_swallow", name: "Rondine Volante", power: 105, chakraCost: 65, nature: "Fuuton", sprite: "/sprites/jutsus/chidori.png", description: "Fendente di vento in grado di perforare la roccia." }],
  ["thousand_hand_strike", { id: "thousand_hand_strike", name: "Assalto dei Mille Palmi del Tempio", power: 135, chakraCost: 90, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Evoca uno spirito guerriero con cento braccia." }],
  ["fire_ash_explosion", { id: "fire_ash_explosion", name: "Infernale Cenere Esplosiva", power: 170, chakraCost: 115, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Esplosione a catena di cenere incandescente." }],

  // ==========================================
  // HIRUZEN JUTSUS
  // ==========================================
  ["shuriken_shadow_clone", { id: "shuriken_shadow_clone", name: "Moltiplicazione degli Shuriken", power: 45, chakraCost: 20, nature: "Taijutsu", sprite: "/sprites/jutsus/shadow_clone.png", description: "Moltiplica uno shuriken in mille copie volanti." }],
  ["fire_dragon_flame", { id: "fire_dragon_flame", name: "Katon: Soffio del Drago di Fuoco", power: 75, chakraCost: 40, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Fiammata continua a forma di testa di drago." }],
  ["adamantine_staff_wall", { id: "adamantine_staff_wall", name: "Bastone Adamantino: Gabbia", power: 105, chakraCost: 65, nature: "Doton", sprite: "/sprites/jutsus/shukaku_shield.png", description: "Bastone Adamantino con impatto solido." }],
  ["five_elements_combo", { id: "five_elements_combo", name: "Combo dei Cinque Elementi", power: 140, chakraCost: 95, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Spara contemporaneamente Fuoco, Acqua, Vento, Terra e Fulmine." }],
  ["reaper_death_seal_hiruzen", { id: "reaper_death_seal_hiruzen", name: "Sigillo del Mietitore del Terzo", power: 175, chakraCost: 125, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Sacrifica la vita per sigillare i nemici nello Shinigami." }],

  // ==========================================
  // KONOHAMARU JUTSUS
  // ==========================================
  ["sexy_jutsu_konohamaru", { id: "sexy_jutsu_konohamaru", name: "Tecnica della Sduzione", power: 25, chakraCost: 10, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Distrae l'avversario facendolo sbiancare." }],
  ["shadow_clone_blitz", { id: "shadow_clone_blitz", name: "Assalto dei Cloni", power: 50, chakraCost: 25, nature: "Taijutsu", sprite: "/sprites/jutsus/shadow_clone.png", description: "Cloni che caricano in massa." }],
  ["rasengan_konohamaru", { id: "rasengan_konohamaru", name: "Rasengan di Konohamaru", power: 75, chakraCost: 45, nature: "Fuuton", sprite: "/sprites/jutsus/rasengan.png", description: "Rasengan appreso direttamente da Naruto." }],
  ["fireball_konohamaru", { id: "fireball_konohamaru", name: "Katon: Palla di Fuoco", power: 100, chakraCost: 65, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Fiammata concentrata ad alto raggio." }],
  ["monkey_king_summon", { id: "monkey_king_summon", name: "Evocazione del Re Scimmia Enra", power: 135, chakraCost: 90, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Evoca la scimmia alleata in combattimento." }],

  // ==========================================
  // KISAME JUTSUS
  // ==========================================
  ["water_shark_bullet", { id: "water_shark_bullet", name: "Suiton: Proiettile Squalo d'Acqua", power: 50, chakraCost: 25, nature: "Suiton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Spara uno squalo d'acqua ad alta pressione." }],
  ["samehada_chakra_drain", { id: "samehada_chakra_drain", name: "Morsa di Samehada", power: 80, chakraCost: 45, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "La spada Samehada strappa e mangia il chakra nemico." }],
  ["super_exploding_water_wave", { id: "super_exploding_water_wave", name: "Grande Tsunami d'Acqua", power: 110, chakraCost: 70, nature: "Suiton", sprite: "/sprites/jutsus/sand_desert.png", description: "Crea una cupola d'acqua gigante trasformando il campo." }],
  ["five_feeding_sharks", { id: "five_feeding_sharks", name: "Cinque Squali Affamati", power: 145, chakraCost: 95, nature: "Suiton", sprite: "/sprites/jutsus/sand_burial.png", description: "Evoca 5 squali che sbranano continuamente il bersaglio." }],
  ["giant_vortex_shark", { id: "giant_vortex_shark", name: "Squalo Gigante Assorbe Chakra", power: 185, chakraCost: 125, nature: "Suiton", sprite: "/sprites/jutsus/kirin.png", description: "Squalo titanico che cresce assorbendo ogni ninjutsu." }],

  // ==========================================
  // IRUKA JUTSUS
  // ==========================================
  ["academy_reprimand", { id: "academy_reprimand", name: "Rimprovero del Maestro", power: 25, chakraCost: 10, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Colpo di disciplina severo." }],
  ["bomb_seal_trap", { id: "bomb_seal_trap", name: "Sigillo della Trappola Esplosiva", power: 45, chakraCost: 25, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Carta bomba nascosta sotto il terreno." }],
  ["shuriken_barrage", { id: "shuriken_barrage", name: "Lancio Precisione Shuriken", power: 65, chakraCost: 35, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Lancio multiplo preciso da accademia." }],
  ["will_of_fire_defense", { id: "will_of_fire_defense", name: "Protezione della Volontà del Fuoco", power: 85, chakraCost: 50, nature: "Taijutsu", sprite: "/sprites/jutsus/sand_shield.png", description: "Contrattacco e protezione della Volontà del Fuoco." }],
  ["sealing_barrier_spear", { id: "sealing_barrier_spear", name: "Barriera del Sigillo di Legno", power: 110, chakraCost: 70, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Immobilizza e sigilla l'avversario con formule." }],

  // ==========================================
  // TOBIRAMA JUTSUS
  // ==========================================
  ["water_bullet_tobirama", { id: "water_bullet_tobirama", name: "Suiton: Proiettile d'Acqua", power: 40, chakraCost: 20, nature: "Suiton", sprite: "/sprites/jutsus/sand_burial.png", description: "Proiettile d'acqua ad alta pressione." }],
  ["water_dragon_tobirama", { id: "water_dragon_tobirama", name: "Suiton: Drago Acquatico Supremo", power: 75, chakraCost: 45, nature: "Suiton", sprite: "/sprites/jutsus/sand_burial.png", description: "Potente drago d'acqua scagliato contro il nemico." }],
  ["flying_raijin_slash", { id: "flying_raijin_slash", name: "Fendente del Raijin Volante", power: 110, chakraCost: 70, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Teletrasporto fulmineo seguito da un fendente letale." }],
  ["water_severing_wave", { id: "water_severing_wave", name: "Suiton: Onda della Tranciatura", power: 145, chakraCost: 95, nature: "Suiton", sprite: "/sprites/jutsus/sand_burial.png", description: "Gettata d'acqua a pressione capace di tagliare tutto." }],
  ["edo_tensei_mutually_multiplying", { id: "edo_tensei_mutually_multiplying", name: "Edo Tensei: Carte Esplosive", power: 180, chakraCost: 120, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Esplosione continua inarrestabile a catena." }],

  // ==========================================
  // HASHIRAMA JUTSUS
  // ==========================================
  ["wood_expulsion", { id: "wood_expulsion", name: "Arte del Legno: Palizzata", power: 45, chakraCost: 25, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Spunta tronchi di legno appuntiti dal terreno." }],
  ["wood_dragon_hashirama", { id: "wood_dragon_hashirama", name: "Arte del Legno: Drago di Legno", power: 80, chakraCost: 50, nature: "Doton", sprite: "/sprites/jutsus/sand_burial.png", description: "Drago di legno gigante che assorbe il chakra." }],
  ["deep_forest_emergence", { id: "deep_forest_emergence", name: "Arte del Legno: Foresta Rigogliosa", power: 115, chakraCost: 75, nature: "Doton", sprite: "/sprites/jutsus/sand_desert.png", description: "Crea istantaneamente una vasta foresta d'attacco." }],
  ["wood_human_technique", { id: "wood_human_technique", name: "Arte del Legno: Golem di Legno", power: 150, chakraCost: 100, nature: "Doton", sprite: "/sprites/jutsus/shukaku_shield.png", description: "Gigantesco colosso di legno combattente." }],
  ["sage_art_shinsusenju", { id: "sage_art_shinsusenju", name: "Arte Eremitica: Statua 1000 Braccia", power: 190, chakraCost: 130, nature: "Doton", sprite: "/sprites/jutsus/sand_desert.png", description: "Mille pugni di legno devastanti della divinità." }],

  // ==========================================
  // SUIGETSU JUTSUS
  // ==========================================
  ["hydrification_technique", { id: "hydrification_technique", name: "Tecnica dell'Idratazione", power: 30, chakraCost: 15, nature: "Suiton", sprite: "/sprites/jutsus/sand_burial.png", description: "Trasforma il corpo in acqua per attacchi fluidi." }],
  ["water_gun_suigetsu", { id: "water_gun_suigetsu", name: "Pistola d'Acqua", power: 55, chakraCost: 30, nature: "Suiton", sprite: "/sprites/jutsus/sand_burial.png", description: "Spara un proiettile d'acqua dalla punta del dito." }],
  ["executioner_blade_strike", { id: "executioner_blade_strike", name: "Fendente della Tagliatesta", power: 85, chakraCost: 50, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Colpo pesante sferrato con la grande spada." }],
  ["torrent_water_demon", { id: "torrent_water_demon", name: "Demone d'Acqua del Torrente", power: 115, chakraCost: 75, nature: "Suiton", sprite: "/sprites/jutsus/sand_burial.png", description: "Massa muscolare d'acqua gigante potenziata." }],
  ["great_water_wave_monster", { id: "great_water_wave_monster", name: "Onda del Demone d'Acqua", power: 145, chakraCost: 95, nature: "Suiton", sprite: "/sprites/jutsus/sand_burial.png", description: "Gigantesca onda sferzante a forma di demone." }],

  // ==========================================
  // JUGO JUTSUS
  // ==========================================
  ["sage_transformation_blast", { id: "sage_transformation_blast", name: "Impulso di Trasformazione", power: 35, chakraCost: 15, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Prima mutazione del corpo da energia naturale." }],
  ["piston_fist_jugo", { id: "piston_fist_jugo", name: "Pugno del Pistone", power: 60, chakraCost: 35, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Pugno propulso da jet di chakra dalle braccia." }],
  ["cellular_cannons", { id: "cellular_cannons", name: "Cannoni Cellulari Maledetti", power: 90, chakraCost: 55, nature: "Taijutsu", sprite: "/sprites/jutsus/fireball.png", description: "Cannoni sulla schiena che sparano energia." }],
  ["rampage_piston_blast", { id: "rampage_piston_blast", name: "Carica Berserk Devastante", power: 120, chakraCost: 80, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Furia cieca con colpi di pistone a ripetizione." }],
  ["full_transformation_annihilation", { id: "full_transformation_annihilation", name: "Annientamento Totale Berserk", power: 150, chakraCost: 100, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Trasformazione completa del demone distruttore." }],

  // ==========================================
  // KARIN JUTSUS
  // ==========================================
  ["minds_eye_kagura", { id: "minds_eye_kagura", name: "Occhio della Mente di Kagura", power: 20, chakraCost: 10, nature: "Genjutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Percepisce ed analizza il chakra nemico." }],
  ["heal_bite_karin", { id: "heal_bite_karin", name: "Morso Rigenerante", power: 40, chakraCost: 20, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Rilascia chakra curativo di classe medica." }],
  ["chakra_sensory_pulse", { id: "chakra_sensory_pulse", name: "Impulso Sensoriale Uzumaki", power: 65, chakraCost: 35, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Onda di chakra che cura gli alleati e destabilizza i nemici." }],
  ["adamantine_chains_karin", { id: "adamantine_chains_karin", name: "Catene di Chakra Uzumaki", power: 90, chakraCost: 55, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Evoca catene indissolubili dal corpo." }],
  ["sacred_healing_surge", { id: "sacred_healing_surge", name: "Esplosione Vitalistica Uzumaki", power: 120, chakraCost: 75, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Rilascio supremo di vitalità e chakra curativo." }],

  // ==========================================
  // DANZO JUTSUS
  // ==========================================
  ["vacuum_slash_danzo", { id: "vacuum_slash_danzo", name: "Fuuton: Lama del Vuoto", power: 40, chakraCost: 20, nature: "Fuuton", sprite: "/sprites/jutsus/rasengan.png", description: "Lama di vento affilata come un rasoio." }],
  ["vacuum_wave_danzo", { id: "vacuum_wave_danzo", name: "Fuuton: Onda del Vuoto", power: 75, chakraCost: 45, nature: "Fuuton", sprite: "/sprites/jutsus/rasenshuriken.png", description: "Raffica di lame d'aria falcianti." }],
  ["baku_summon_swallow", { id: "baku_summon_swallow", name: "Evocazione: Baku Risucchiatore", power: 105, chakraCost: 65, nature: "Fuuton", sprite: "/sprites/jutsus/sand_burial.png", description: "La Bestia Baku crea un vuoto che risucchia il nemico." }],
  ["izanagi_danzo", { id: "izanagi_danzo", name: "Izanagi: Alterazione della Realtà", power: 135, chakraCost: 90, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Annulla i danni subiti risegando il destino." }],
  ["reverse_four_symbols", { id: "reverse_four_symbols", name: "Sigillo dei Quattro Simboli Inversi", power: 170, chakraCost: 115, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Sigillo finale di sacrificio che risucchia tutto." }],

  // ==========================================
  // ONOKI JUTSUS
  // ==========================================
  ["rock_heavy_technique", { id: "rock_heavy_technique", name: "Doton: Roccia Pesante", power: 45, chakraCost: 25, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Aumenta enormemente la gravità sul nemico." }],
  ["weighted_rock_golem", { id: "weighted_rock_golem", name: "Golem di Roccia del Tsuchikage", power: 80, chakraCost: 50, nature: "Doton", sprite: "/sprites/jutsus/sand_shield.png", description: "Evoca un imponente golem di pietra." }],
  ["particle_style_cube", { id: "particle_style_cube", name: "Arte della Polvere: Cubo", power: 120, chakraCost: 75, nature: "Doton", sprite: "/sprites/jutsus/kirin.png", description: "Rinchiude il nemico in un cubo di disintegrazione." }],
  ["particle_style_atomic_dismantling", { id: "particle_style_atomic_dismantling", name: "Arte della Polvere: Distruzione Atomica", power: 155, chakraCost: 100, nature: "Doton", sprite: "/sprites/jutsus/kirin.png", description: "Riduce il bersaglio in molecole a livello atomico." }],
  ["particle_style_world_dismantling", { id: "particle_style_world_dismantling", name: "Arte della Polvere: Distruzione Totale", power: 185, chakraCost: 125, nature: "Doton", sprite: "/sprites/jutsus/kirin.png", description: "Raggio di disintegrazione supremo del Tsuchikage." }],

  // ==========================================
  // 4° RAIKAGE JUTSUS
  // ==========================================
  ["lightning_armor_dash", { id: "lightning_armor_dash", name: "Armatura di Fulmine: Scatto", power: 45, chakraCost: 25, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Scatto alla velocità del fulmine infuso di Raiton." }],
  ["lariat_raikage4", { id: "lariat_raikage4", name: "Lariat del Raikage", power: 80, chakraCost: 50, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Colpo al collo devastante ad altissima velocità." }],
  ["guillotine_drop", { id: "guillotine_drop", name: "Calcio della Ghigliottina", power: 115, chakraCost: 75, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Calcio dall'alto a martello fulmineo." }],
  ["liger_bomb_raikage", { id: "liger_bomb_raikage", name: "Liger Bomb Supremum", power: 150, chakraCost: 100, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Solleva e schianta il nemico al suolo sgretolando la terra." }],
  ["lightning_straight_blitz", { id: "lightning_straight_blitz", name: "Fulmine Diretto Assoluto", power: 185, chakraCost: 125, nature: "Raiton", sprite: "/sprites/jutsus/kirin.png", description: "Carica a massima velocità che supera la barriera del suono." }],

  // ==========================================
  // GENGETSU JUTSUS
  // ==========================================
  ["water_balloon_bullet", { id: "water_balloon_bullet", name: "Proiettile di Bolla d'Acqua", power: 35, chakraCost: 18, nature: "Suiton", sprite: "/sprites/jutsus/sand_burial.png", description: "Colpo di bolla d'acqua pressurizzata." }],
  ["giant_clam_mirage", { id: "giant_clam_mirage", name: "Illusione della Vongola Gigante", power: 70, chakraCost: 40, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_shield.png", description: "Miraggio di vapore che rende inafferrabile l'utilizzatore." }],
  ["steaming_danger_tyranny", { id: "steaming_danger_tyranny", name: "Tirannia del Vapore Esplosivo", power: 105, chakraCost: 65, nature: "Suiton", sprite: "/sprites/jutsus/fireball.png", description: "Clone d'olio ed acqua che crea esplosioni a catena." }],
  ["jokey_boy_blast", { id: "jokey_boy_blast", name: "Jokey Boy: Esplosione di Vapore", power: 140, chakraCost: 90, nature: "Suiton", sprite: "/sprites/jutsus/fireball.png", description: "Esplosione continua causata dal surriscaldamento del clone." }],
  ["infinite_clashing_explosions", { id: "infinite_clashing_explosions", name: "Catastrofe del Secondo Mizukage", power: 175, chakraCost: 115, nature: "Suiton", sprite: "/sprites/jutsus/fireball.png", description: "Tempesta continua di vapore ed esplosioni inarrestabili." }],

  // ==========================================
  // 3° RAIKAGE JUTSUS
  // ==========================================
  ["black_lightning_panther", { id: "black_lightning_panther", name: "Raiton: Pantera di Fulmine Nero", power: 45, chakraCost: 25, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Evoca una pantera di fulmine nero elettrificante." }],
  ["hell_stab_four_fingers", { id: "hell_stab_four_fingers", name: "Hell Stab: 4 Dita", power: 85, chakraCost: 50, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Stoccata perforante con quattro dita cariche di Raiton." }],
  ["hell_stab_three_fingers", { id: "hell_stab_three_fingers", name: "Hell Stab: 3 Dita", power: 120, chakraCost: 75, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Stoccata concentrata con tre dita ad alta pressione." }],
  ["hell_stab_one_finger", { id: "hell_stab_one_finger", name: "Hell Stab: 1 Dito (Lancia Assoluta)", power: 160, chakraCost: 105, nature: "Raiton", sprite: "/sprites/jutsus/kirin.png", description: "Lancia di perforazione suprema capace di trafiggere qualsiasi scudo." }],
  ["indestructible_shield_strike", { id: "indestructible_shield_strike", name: "Impatto dello Scudo Indistruttibile", power: 190, chakraCost: 130, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Carica del corpo d'acciaio impenetrabile del Terzo Raikage." }],

  // ==========================================
  // CHIYO JUTSUS
  // ==========================================
  ["chakra_threads_chiyo", { id: "chakra_threads_chiyo", name: "Fili di Chakra", power: 30, chakraCost: 15, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Fili trasparenti di chakra per manipolare alleati ed attacchi." }],
  ["mother_and_father_puppets", { id: "mother_and_father_puppets", name: "Burattini Padre e Madre", power: 55, chakraCost: 30, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Assalto combinato dei due burattini storici." }],
  ["three_jewels_suction_crush", { id: "three_jewels_suction_crush", name: "Aspirazione delle Tre Gemme", power: 85, chakraCost: 50, nature: "Taijutsu", sprite: "/sprites/jutsus/sand_burial.png", description: "Crea un vortice di risucchio d'aria distruttivo." }],
  ["ten_puppets_chikamatsu", { id: "ten_puppets_chikamatsu", name: "Collezione di Chikamatsu (10 Burattini)", power: 120, chakraCost: 75, nature: "Taijutsu", sprite: "/sprites/jutsus/sand_desert.png", description: "Armata di dieci burattini bianchi coordinati." }],
  ["secret_reanimation_transfer", { id: "secret_reanimation_transfer", name: "Trasferimento di Reincarnazione", power: 150, chakraCost: 95, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Rilascia l'intera forza vitale per curare e potenziare totalmente." }],

  // ==========================================
  // ZETSU JUTSUS
  // ==========================================
  ["mayfly_technique", { id: "mayfly_technique", name: "Tecnica della Mosca di Maggio", power: 20, chakraCost: 10, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Si fonde col terreno muovendosi inosservato." }],
  ["spore_technique_zetsu", { id: "spore_technique_zetsu", name: "Tecnica delle Spore Assorbenti", power: 40, chakraCost: 20, nature: "Doton", sprite: "/sprites/jutsus/basic_healing.png", description: "Spore che crescono sul nemico assorbendo chakra." }],
  ["parasitic_clone_attack", { id: "parasitic_clone_attack", name: "Assalto dei Cloni Parassiti", power: 65, chakraCost: 35, nature: "Taijutsu", sprite: "/sprites/jutsus/shadow_clone.png", description: "Molteplici cloni di Zetsu Bianco che travolgono il bersaglio." }],
  ["wood_release_underground_roots", { id: "wood_release_underground_roots", name: "Radici di Legno Parassite", power: 90, chakraCost: 55, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Radici di legno che spuntano per bloccare e colpire." }],
  ["black_zetsu_subjugation", { id: "black_zetsu_subjugation", name: "Sottomissione dell'Ombra Nera", power: 120, chakraCost: 75, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Zetsu Nero avvolge il corpo nemico prendendone il controllo." }],

  // ==========================================
  // KILLER BEE JUTSUS
  // ==========================================
  ["super_vibrating_lightning_blade", { id: "super_vibrating_lightning_blade", name: "Lama Elettrica ad Alta Frequenza", power: 45, chakraCost: 25, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Spada vibrante di Raiton capace di perforare ogni cosa." }],
  ["seven_swords_dance", { id: "seven_swords_dance", name: "Danza delle Sette Spade", power: 80, chakraCost: 50, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Stile acrobatico a sette spade imprevedibile." }],
  ["lariat_killer_bee", { id: "lariat_killer_bee", name: "Lariat dell'Ottacoda", power: 115, chakraCost: 75, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Lariat infuso del manto del cercoterio Gyuki." }],
  ["tailed_beast_twister_bee", { id: "tailed_beast_twister_bee", name: "Tornado del Cercoterio Gyuki", power: 150, chakraCost: 100, nature: "Taijutsu", sprite: "/sprites/jutsus/sand_desert.png", description: "Vortice gigantesco generato dai tentacoli del Polpo." }],
  ["eight_tails_tailed_beast_bomb", { id: "eight_tails_tailed_beast_bomb", name: "Teriosfera dell'Ottacoda", power: 185, chakraCost: 125, nature: "Raiton", sprite: "/sprites/jutsus/kurama_beam.png", description: "Bomba di chakra supremo scagliata dal Polpo a Otto Code." }],

  // ==========================================
  // DARUI JUTSUS
  // ==========================================
  ["water_wall_darui", { id: "water_wall_darui", name: "Suiton: Muro d'Acqua", power: 25, chakraCost: 12, nature: "Suiton", sprite: "/sprites/jutsus/sand_shield.png", description: "Muro d'acqua protettivo ed impattante." }],
  ["black_panther_lightning", { id: "black_panther_lightning", name: "Raiton: Pantera Nera", power: 45, chakraCost: 25, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Scarica di fulmine nero guidata." }],
  ["double_black_panther", { id: "double_black_panther", name: "Doppia Pantera Nera", power: 70, chakraCost: 40, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Due pantere di fulmine nero che azzannano da due lati." }],
  ["storm_release_laser_circus", { id: "storm_release_laser_circus", name: "Arte della Tempesta: Circo Laser", power: 95, chakraCost: 60, nature: "Raiton", sprite: "/sprites/jutsus/kirin.png", description: "Fasci di luce laser guidati che colpiscono a raffica." }],
  ["cleaver_sword_black_lightning", { id: "cleaver_sword_black_lightning", name: "Fendente con Fulmine Nero", power: 125, chakraCost: 80, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Sciabolata letale caricata di fulmine nero." }],

  // ==========================================
  // MU JUTSUS
  // ==========================================
  ["dustless_bewildering_cover", { id: "dustless_bewildering_cover", name: "Mimetizzazione Perfetta", power: 35, chakraCost: 18, nature: "Doton", sprite: "/sprites/jutsus/sand_shield.png", description: "Diventa invisibile cancellando chakra e presenza." }],
  ["fission_technique_mu", { id: "fission_technique_mu", name: "Tecnica della Fissione Corporea", power: 70, chakraCost: 40, nature: "Doton", sprite: "/sprites/jutsus/shadow_clone.png", description: "Si divide in due corpi indipendenti." }],
  ["dust_release_beam_mu", { id: "dust_release_beam_mu", name: "Arte della Polvere: Raggio", power: 105, chakraCost: 65, nature: "Doton", sprite: "/sprites/jutsus/kirin.png", description: "Fascio conico di smaterializzazione atomica." }],
  ["dust_release_conical_disintegration", { id: "dust_release_conical_disintegration", name: "Arte della Polvere: Cono Spaziale", power: 140, chakraCost: 90, nature: "Doton", sprite: "/sprites/jutsus/kirin.png", description: "Esplosione a cono che disintegrato la materia." }],
  ["dust_release_absolute_annihilation", { id: "dust_release_absolute_annihilation", name: "Arte della Polvere: Annullamento Totale", power: 175, chakraCost: 115, nature: "Doton", sprite: "/sprites/jutsus/kirin.png", description: "Disintegrazione suprema del Secondo Tsuchikage." }],

  // ==========================================
  // NAGATO JUTSUS
  // ==========================================
  ["animal_path_summoning", { id: "animal_path_summoning", name: "Via degli Animali: Evocazioni", power: 45, chakraCost: 25, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_burial.png", description: "Evoca rinoceronti e cani giganti immensamente forti." }],
  ["asura_path_cannon", { id: "asura_path_cannon", name: "Via degli Asura: Cannone", power: 85, chakraCost: 50, nature: "Taijutsu", sprite: "/sprites/jutsus/fireball.png", description: "Raffica di proiettili e missili meccanici." }],
  ["almighty_push_nagato", { id: "almighty_push_nagato", name: "Shinra Tensei di Nagato", power: 120, chakraCost: 75, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Onda di gravità repulsiva devastante." }],
  ["human_path_soul_absorption", { id: "human_path_soul_absorption", name: "Via dell'Umano: Estrazione Anima", power: 155, chakraCost: 100, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Afferra il nemico ed estrae la sua energia vitale." }],
  ["chibaku_tensei_nagato", { id: "chibaku_tensei_nagato", name: "Chibaku Tensei Assoluto", power: 190, chakraCost: 130, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Sfera di gravità che crea un vero e proprio satellite roccioso." }],

  // ==========================================
  // YAMATO JUTSUS
  // ==========================================
  ["wood_pillar_strike", { id: "wood_pillar_strike", name: "Arte del Legno: Pilastro", power: 25, chakraCost: 12, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Pilastro di legno che spunta dal terreno." }],
  ["wood_locking_wall_yamato", { id: "wood_locking_wall_yamato", name: "Arte del Legno: Cupola Protettiva", power: 45, chakraCost: 25, nature: "Doton", sprite: "/sprites/jutsus/sand_shield.png", description: "Cupola di legno intrecciato che blocca ed impatta." }],
  ["great_forest_technique", { id: "great_forest_technique", name: "Tecnica della Grande Foresta", power: 70, chakraCost: 40, nature: "Doton", sprite: "/sprites/jutsus/sand_desert.png", description: "Trasforma il braccio in rami intrecciati." }],
  ["wood_binding_strangle", { id: "wood_binding_strangle", name: "Prigione di Legno Avvolgente", power: 95, chakraCost: 60, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Prigione di tronchi che avvolge e schiaccia." }],
  ["hokage_six_year_old_style", { id: "hokage_six_year_old_style", name: "Stile Hokage: Soppressione Chakra", power: 125, chakraCost: 80, nature: "Doton", sprite: "/sprites/jutsus/sand_desert.png", description: "Raffica di palizzate con sigillo di soppressione." }],
]);
