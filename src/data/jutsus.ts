import { Jutsu } from "@/types/index";

export const JUTSU_MAP = new Map<string, Jutsu>([
  // ==========================================
  // NARUTO JUTSUS
  // ==========================================
  ["shadow_clone_kid", { id: "shadow_clone_kid", name: "Moltiplicazione del Corpo (Kid)", power: 20, chakraCost: 15, nature: "Taijutsu", sprite: "/sprites/jutsus/shadow_clone.png", description: "Crea cloni per distrarre ed attaccare." }],
  ["rasengan_kid", { id: "rasengan_kid", name: "Rasengan (Kid)", power: 40, chakraCost: 30, nature: "Fuuton", sprite: "/sprites/jutsus/rasengan.png", description: "Sfera rotante di chakra concentrato." }],
  ["wind_bullet", { id: "wind_bullet", name: "Proiettile di Vento", power: 50, chakraCost: 25, nature: "Fuuton", sprite: "/sprites/jutsus/rasengan.png", description: "Spara sfere d'aria compressa." }],
  ["rasengan_shippuden", { id: "rasengan_shippuden", name: "Rasengan Supremo", power: 65, chakraCost: 40, nature: "Fuuton", sprite: "/sprites/jutsus/rasengan.png", description: "Il Rasengan perfezionato di Shippuden." }],
  ["giant_rasengan", { id: "giant_rasengan", name: "Rasengan Gigante", power: 75, chakraCost: 50, nature: "Fuuton", sprite: "/sprites/jutsus/giant_rasengan.png", description: "Un Rasengan ingigantito di grande potenza." }],
  ["sage_art_rasengan", { id: "sage_art_rasengan", name: "Arte Eremitica: Rasengan", power: 90, chakraCost: 65, nature: "Fuuton", sprite: "/sprites/jutsus/sage_rasengan.png", description: "Rasengan potenziato dall'energia della natura." }],
  ["rasenshuriken", { id: "rasenshuriken", name: "Arte del Vento: Rasenshuriken", power: 120, chakraCost: 80, nature: "Fuuton", sprite: "/sprites/jutsus/rasenshuriken.png", description: "Il leggendario shuriken di vento tagliente." }],
  ["kurama_rasengan", { id: "kurama_rasengan", name: "Rasengan di Kurama", power: 135, chakraCost: 85, nature: "Fuuton", sprite: "/sprites/jutsus/rasenshuriken.png", description: "Rasengan fuso con la fiamma dorata della volpe." }],
  ["super_rasenshuriken", { id: "super_rasenshuriken", name: "Terio Rasenshuriken", power: 150, chakraCost: 100, nature: "Fuuton", sprite: "/sprites/jutsus/super_rasenshuriken.png", description: "Rasenshuriken infuso del chakra del Cercoterio." }],
  ["tailed_beast_bomb", { id: "tailed_beast_bomb", name: "Teriosfera (Tailed Beast Bomb)", power: 175, chakraCost: 120, nature: "Fuuton", sprite: "/sprites/jutsus/kurama_beam.png", description: "Attacco supremo con una bomba di chakra concentrato." }],

  // ==========================================
  // SASUKE JUTSUS
  // ==========================================
  ["fireball_jutsu_kid", { id: "fireball_jutsu_kid", name: "Palla di Fuoco Suprema (Kid)", power: 30, chakraCost: 15, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Rilascia una sfera di fuoco dalla bocca." }],
  ["lion_combo_kid", { id: "lion_combo_kid", name: "Concatenazione del Leone", power: 40, chakraCost: 20, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Combo acrobatica aerea basata sul taijutsu." }],
  ["chidori_kid", { id: "chidori_kid", name: "Chidori (Kid)", power: 45, chakraCost: 30, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Chakra elettrico concentrato nella mano." }],
  ["dragon_fire_jutsu", { id: "dragon_fire_jutsu", name: "Fiamma del Drago", power: 55, chakraCost: 35, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Spara fiammate concentrate lungo un filo." }],
  ["chidori_shippuden", { id: "chidori_shippuden", name: "Chidori Perfezionato", power: 70, chakraCost: 45, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Il fulmine perforante di Sasuke Shippuden." }],
  ["chidori_spear", { id: "chidori_spear", name: "Lancia di Chidori", power: 85, chakraCost: 55, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Chidori allungato a forma di lancia perforante." }],
  ["amaterasu", { id: "amaterasu", name: "Fiamme Nere dell'Amaterasu", power: 110, chakraCost: 75, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Fiamme nere inestinguibili evocate dallo Sharingan." }],
  ["susanoo_slash", { id: "susanoo_slash", name: "Fendente del Susanoo", power: 100, chakraCost: 65, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Fendente caricato scagliato con la spada di Susanoo." }],
  ["kirin", { id: "kirin", name: "Kirin (Fulmine Leggendario)", power: 140, chakraCost: 95, nature: "Raiton", sprite: "/sprites/jutsus/kirin.png", description: "Evoca un fulmine naturale a forma di Kirin." }],
  ["indras_arrow", { id: "indras_arrow", name: "Freccia di Indra", power: 180, chakraCost: 130, nature: "Raiton", sprite: "/sprites/jutsus/kirin.png", description: "L'attacco supremo definitivo di Sasuke." }],

  // ==========================================
  // SAKURA JUTSUS
  // ==========================================
  ["cherry_blossom_clash_kid", { id: "cherry_blossom_clash_kid", name: "Pugno di Ciliegio (Kid)", power: 25, chakraCost: 10, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Pugno distruttivo infuso di chakra." }],
  ["basic_healing", { id: "basic_healing", name: "Palmo Rigenerante", power: -30, chakraCost: 15, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Cura lievemente le ferite." }],
  ["chakra_scalpel", { id: "chakra_scalpel", name: "Bisturi di Chakra", power: 35, chakraCost: 20, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Colpi precisi con lame di chakra." }],
  ["poison_fog", { id: "poison_fog", name: "Nebbia Velenosa", power: 45, chakraCost: 25, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Spara una nube tossica." }],
  ["cherry_blossom_clash_shippuden", { id: "cherry_blossom_clash_shippuden", name: "Impatto del Ciliegio", power: 70, chakraCost: 35, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Pugno che frantuma la terra." }],
  ["giant_impact", { id: "giant_impact", name: "Impatto Titanico", power: 85, chakraCost: 45, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Pugno distruttivo finale." }],
  ["medical_ninjutsu", { id: "medical_ninjutsu", name: "Cura Avanzata", power: -75, chakraCost: 40, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Cura ferite moderate." }],
  ["mitotic_regeneration", { id: "mitotic_regeneration", name: "Creazione Rinascita", power: -110, chakraCost: 70, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Rigenera istantaneamente le cellule." }],
  ["byakugou_seal_kid", { id: "byakugou_seal_kid", name: "Sigillo Byakugou", power: -130, chakraCost: 80, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Rilascia il sigillo sulla fronte." }],
  ["byakugou_heal", { id: "byakugou_heal", name: "Cura Totale della Rinascita", power: -180, chakraCost: 110, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Cura completa al 100%." }],

  // ==========================================
  // KAKASHI JUTSUS
  // ==========================================
  ["white_light_slash", { id: "white_light_slash", name: "Fendente di Luce Bianca", power: 35, chakraCost: 15, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Fendente rapido." }],
  ["headhunter_jutsu", { id: "headhunter_jutsu", name: "Decapitazione Sotterranea", power: 40, chakraCost: 20, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Trascina il nemico sottoterra." }],
  ["mud_wall", { id: "mud_wall", name: "Muro di Fango", power: 0, chakraCost: 15, nature: "Doton", sprite: "/sprites/jutsus/sand_shield.png", description: "Muro difensivo di fango." }],
  ["shadow_clone_kakashi", { id: "shadow_clone_kakashi", name: "Moltiplicazione Elettrica", power: 45, chakraCost: 25, nature: "Raiton", sprite: "/sprites/jutsus/shadow_clone.png", description: "Cloni caricati a elettricità." }],
  ["chidori_kakashi", { id: "chidori_kakashi", name: "Chidori di Kakashi", power: 65, chakraCost: 35, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Chakra elettrico stridente." }],
  ["lightning_blade", { id: "lightning_blade", name: "Taglio del Fulmine (Raikiri)", power: 85, chakraCost: 50, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Taglio fulmineo letale." }],
  ["water_dragon_bullet", { id: "water_dragon_bullet", name: "Drago Acquatico Copiato", power: 90, chakraCost: 60, nature: "Suiton", sprite: "/sprites/jutsus/sand_burial.png", description: "Drago d'acqua copia." }],
  ["kamui_snare", { id: "kamui_snare", name: "Barriera Kamui", power: 115, chakraCost: 80, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Risucchia spazio-temporalmente." }],
  ["purple_electricity", { id: "purple_electricity", name: "Elettricità Viola", power: 130, chakraCost: 90, nature: "Raiton", sprite: "/sprites/jutsus/chidori.png", description: "Scariche elettriche viola." }],
  ["kamui_lightning_blade", { id: "kamui_lightning_blade", name: "Kamui Raikiri", power: 170, chakraCost: 120, nature: "Raiton", sprite: "/sprites/jutsus/kirin.png", description: "Raikiri combinato a Kamui." }],

  // ==========================================
  // GAARA JUTSUS
  // ==========================================
  ["sand_binding_coffin", { id: "sand_binding_coffin", name: "Bara di Sabbia", power: 35, chakraCost: 20, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Avvolge il nemico nella sabbia." }],
  ["sand_shield", { id: "sand_shield", name: "Scudo di Sabbia", power: 0, chakraCost: 10, nature: "Doton", sprite: "/sprites/jutsus/sand_shield.png", description: "Scudo difensivo di sabbia automatica." }],
  ["sand_shower_kid", { id: "sand_shower_kid", name: "Pioggia di Sabbia", power: 45, chakraCost: 30, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Sabbia scagliata dall'alto." }],
  ["giant_sand_burial", { id: "giant_sand_burial", name: "Funerale del Deserto", power: 75, chakraCost: 45, nature: "Doton", sprite: "/sprites/jutsus/sand_burial.png", description: "Schiaccia il nemico avvolto." }],
  ["shukaku_shield", { id: "shukaku_shield", name: "Scudo dello Shukaku", power: 0, chakraCost: 30, nature: "Doton", sprite: "/sprites/jutsus/shukaku_shield.png", description: "Difesa inscalfibile dello Shukaku." }],
  ["sand_tsunami", { id: "sand_tsunami", name: "Tsunami di Sabbia", power: 95, chakraCost: 60, nature: "Doton", sprite: "/sprites/jutsus/sand_burial.png", description: "Grande onda di sabbia." }],
  ["sand_desert_coffin", { id: "sand_desert_coffin", name: "Prigione dei Mille Deserti", power: 110, chakraCost: 75, nature: "Doton", sprite: "/sprites/jutsus/sand_desert.png", description: "Immobilizza interamente il nemico." }],
  ["absolute_defense_shield", { id: "absolute_defense_shield", name: "Difesa Assoluta: Cupola", power: 0, chakraCost: 50, nature: "Doton", sprite: "/sprites/jutsus/sand_shield.png", description: "Erigere una cupola di sabbia." }],
  ["desert_funeral", { id: "desert_funeral", name: "Funerale Imperiale del Deserto", power: 140, chakraCost: 95, nature: "Doton", sprite: "/sprites/jutsus/sand_desert.png", description: "Sepoltura gigante di sabbia." }],
  ["wind_sand_blade", { id: "wind_sand_blade", name: "Lama Tempesta di Sabbia", power: 165, chakraCost: 115, nature: "Doton", sprite: "/sprites/jutsus/sand_desert.png", description: "Lama d'aria e sabbia tagliente." }],

  // ==========================================
  // ROCK LEE JUTSUS
  // ==========================================
  ["dynamic_entry", { id: "dynamic_entry", name: "Entrata Dinamica", power: 30, chakraCost: 10, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Calcio volante d'irruzione." }],
  ["leaf_hurricane", { id: "leaf_hurricane", name: "Uragano della Foglia", power: 40, chakraCost: 15, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Calcio basso rotante." }],
  ["gate_1_open", { id: "gate_1_open", name: "Primo Cancello: Apertura", power: 50, chakraCost: 20, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Rilascia inibitori muscolari." }],
  ["primary_lotus", { id: "primary_lotus", name: "Loto Frontale", power: 60, chakraCost: 35, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Schianto aereo ravvicinato." }],
  ["gate_3_open", { id: "gate_3_open", name: "Terzo Cancello: Vita", power: 75, chakraCost: 40, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Afflusso massimo di forza." }],
  ["hidden_lotus", { id: "hidden_lotus", name: "Loto Posteriore", power: 85, chakraCost: 55, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Colpi rapidi aerei letali." }],
  ["gate_5_open", { id: "gate_5_open", name: "Quinto Cancello: Chiusura", power: 100, chakraCost: 65, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Forza d'urto estrema." }],
  ["gate_6_open", { id: "gate_6_open", name: "Sesto Cancello: Visione", power: 120, chakraCost: 80, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Aura verde distruttiva." }],
  ["crane_fist", { id: "crane_fist", name: "Pugno dell'Ubriaco", power: 140, chakraCost: 95, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Movimenti confusi imprevedibili." }],
  ["morning_peacock", { id: "morning_peacock", name: "Pavone del Mattino", power: 175, chakraCost: 125, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Pugni di fuoco alla velocità del suono." }],

  // ==========================================
  // NEJI JUTSUS
  // ==========================================
  ["gentle_fist_strike", { id: "gentle_fist_strike", name: "Palmo del Pugno Gentile", power: 25, chakraCost: 10, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Colpo base Byakugan." }],
  ["eight_trigrams_16", { id: "eight_trigrams_16", name: "16 Chiusure degli Hyuga", power: 40, chakraCost: 20, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Blocca i punti di fuga di base." }],
  ["eight_trigrams_32", { id: "eight_trigrams_32", name: "32 Chiusure degli Hyuga", power: 55, chakraCost: 30, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Colpi mirati a bloccare il chakra." }],
  ["rotation_kid", { id: "rotation_kid", name: "Palmo Rotativo (Kid)", power: 50, chakraCost: 35, nature: "Taijutsu", sprite: "/sprites/jutsus/sand_shield.png", description: "Cupola rotante di chakra." }],
  ["air_palm", { id: "air_palm", name: "Palmo del Vuoto", power: 70, chakraCost: 40, nature: "Taijutsu", sprite: "/sprites/jutsus/rasengan.png", description: "Lancia proiettili d'aria." }],
  ["rotation_shippuden", { id: "rotation_shippuden", name: "Palmo Rotativo Supremo", power: 75, chakraCost: 45, nature: "Taijutsu", sprite: "/sprites/jutsus/sand_shield.png", description: "Rotazione difensiva invalicabile." }],
  ["eight_trigrams_64", { id: "eight_trigrams_64", name: "64 Chiusure (Hyuga Style)", power: 100, chakraCost: 65, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Chiusura totale delle 64 porte." }],
  ["eight_trigrams_128", { id: "eight_trigrams_128", name: "128 Chiusure Speciali", power: 135, chakraCost: 90, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Colpi fulminei ad alta velocità." }],
  ["giant_air_palm", { id: "giant_air_palm", name: "Grande Palmo del Vuoto", power: 150, chakraCost: 105, nature: "Taijutsu", sprite: "/sprites/jutsus/rasengan.png", description: "Getto d'aria distruttivo." }],
  ["gentle_fist_body_blow", { id: "gentle_fist_body_blow", name: "Esplosione di Aghi di Chakra", power: 170, chakraCost: 120, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Espelle aghi di chakra dai pori." }],

  // ==========================================
  // SHIKAMARU JUTSUS
  // ==========================================
  ["shadow_imitation_kid", { id: "shadow_imitation_kid", name: "Controllo dell'Ombra (Kid)", power: 20, chakraCost: 10, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Cattura l'avversario bloccandolo con l'ombra." }],
  ["shadow_choke_kid", { id: "shadow_choke_kid", name: "Strozzatura dell'Ombra", power: 35, chakraCost: 20, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "L'ombra strangola lievemente il bersaglio." }],
  ["paper_bomb_trap", { id: "paper_bomb_trap", name: "Trappola di Carte Bomba", power: 45, chakraCost: 25, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Scatena esplosivi posizionati tatticamente." }],
  ["shadow_sewing", { id: "shadow_sewing", name: "Cucitura d'Ombra", power: 60, chakraCost: 35, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Punte d'ombra trafiggono il nemico." }],
  ["shadow_pull", { id: "shadow_pull", name: "Trazione dell'Ombra", power: 70, chakraCost: 40, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Trascina violentemente l'avversario." }],
  ["shadow_imitation_shippuden", { id: "shadow_imitation_shippuden", name: "Possessione d'Ombra Estesa", power: 85, chakraCost: 50, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Possessione a lungo raggio." }],
  ["flash_bomb_tactic", { id: "flash_bomb_tactic", name: "Tattica della Bomba Luce", power: 95, chakraCost: 55, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Allunga le ombre creando luce artificiale." }],
  ["shadow_strangle", { id: "shadow_strangle", name: "Strozzatura d'Ombra Gigante", power: 110, chakraCost: 70, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Strozza con artigli d'ombra massicci." }],
  ["shadow_clutch", { id: "shadow_clutch", name: "Morsa d'Ombra", power: 130, chakraCost: 85, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Afferra e stritola con forza dell'ombra." }],
  ["shadow_binding_field", { id: "shadow_binding_field", name: "Campo di Vincolo dell'Ombra", power: 160, chakraCost: 115, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_desert.png", description: "Immobilizza e schiaccia chiunque nell'area d'ombra." }],

  // ==========================================
  // HINATA JUTSUS
  // ==========================================
  ["gentle_fist_hinata", { id: "gentle_fist_hinata", name: "Pugno Gentile di Hinata", power: 25, chakraCost: 10, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Palmi leggeri che bloccano il chakra." }],
  ["protection_rotation", { id: "protection_rotation", name: "Rotazione Protettiva", power: 40, chakraCost: 20, nature: "Taijutsu", sprite: "/sprites/jutsus/sand_shield.png", description: "Crea barriere ruotando i palmi." }],
  ["twin_lion_fists_intro", { id: "twin_lion_fists_intro", name: "Pre-Passo dei Leoni Gemelli", power: 55, chakraCost: 30, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Chakra dei leoni gemelli concentrato sulle mani." }],
  ["protective_64_palms", { id: "protective_64_palms", name: "64 Palmi Protettivi", power: 65, chakraCost: 40, nature: "Taijutsu", sprite: "/sprites/jutsus/sand_shield.png", description: "Barriera invalicabile di aghi di chakra." }],
  ["twin_lion_fists", { id: "twin_lion_fists", name: "Passo dei Leoni Gemelli", power: 85, chakraCost: 50, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Pugni a testa di leone che assorbono chakra nemico." }],
  ["eight_trigrams_air_palm", { id: "eight_trigrams_air_palm", name: "Palmo del Vuoto degli Hyuga", power: 95, chakraCost: 55, nature: "Taijutsu", sprite: "/sprites/jutsus/rasengan.png", description: "Scaglia onde d'aria dal palmo." }],
  ["gentle_step_lion", { id: "gentle_step_lion", name: "Danza dei Leoni di Giada", power: 115, chakraCost: 75, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Attacchi combinati con leoni gemelli." }],
  ["trigrams_rotation", { id: "trigrams_rotation", name: "Rotazione Divina degli Otto Trigrammi", power: 130, chakraCost: 85, nature: "Taijutsu", sprite: "/sprites/jutsus/sand_shield.png", description: "Rotazione difensiva ad altissima pressione." }],
  ["eight_trigrams_twin_lions", { id: "eight_trigrams_twin_lions", name: "Attacco Supremo dei Leoni Gemelli", power: 165, chakraCost: 110, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Fonde i leoni gemelli in un colpo devastante." }],

  // ==========================================
  // ITACHI JUTSUS
  // ==========================================
  ["shuriken_jutsu_itachi", { id: "shuriken_jutsu_itachi", name: "Lancio Rapido di Shuriken", power: 35, chakraCost: 15, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Trafigge rapidamente con shuriken perfetti." }],
  ["clone_great_explosion", { id: "clone_great_explosion", name: "Clone a Grande Esplosione", power: 55, chakraCost: 30, nature: "Katon", sprite: "/sprites/jutsus/shadow_clone.png", description: "Un clone d'ombra che salta in aria." }],
  ["genjutsu_crow", { id: "genjutsu_crow", name: "illusione dei Corvi", power: 45, chakraCost: 20, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_coffin.png", description: "Confonde il nemico trasformandosi in corvi." }],
  ["fireball_itachi", { id: "fireball_itachi", name: "Katon: Palla di Fuoco Suprema", power: 75, chakraCost: 40, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Grande fiammata devastante." }],
  ["tsukuyomi", { id: "tsukuyomi", name: "Tsukuyomi (Illusione Infinita)", power: 100, chakraCost: 65, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_desert.png", description: "Tortura mentale spazio-temporale." }],
  ["amaterasu_itachi", { id: "amaterasu_itachi", name: "Amaterasu di Itachi", power: 125, chakraCost: 85, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Fiamme nere evocate dallo Sharingan Ipnotico." }],
  ["yasaka_beads", { id: "yasaka_beads", name: "Magatama di Yasaka", power: 135, chakraCost: 90, nature: "Raiton", sprite: "/sprites/jutsus/giant_rasengan.png", description: "Proiettili spirituali scagliati da Susanoo." }],
  ["susanoo_shield_itachi", { id: "susanoo_shield_itachi", name: "Specchio di Yata", power: 0, chakraCost: 50, nature: "Doton", sprite: "/sprites/jutsus/shukaku_shield.png", description: "Scudo spirituale impenetrabile che riflette gli attacchi." }],
  ["susanoo_slash_itachi", { id: "susanoo_slash_itachi", name: "Lama di Totsuka", power: 150, chakraCost: 100, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Lama spirituale che sigilla chiunque colpisca." }],
  ["izanami", { id: "izanami", name: "Izanami (Ciclo Infinito)", power: 180, chakraCost: 130, nature: "Genjutsu", sprite: "/sprites/jutsus/sand_desert.png", description: "Intriga la mente in un loop temporale infinito." }],

  // ==========================================
  // JIRAIYA JUTSUS
  // ==========================================
  ["needle_senbon", { id: "needle_senbon", name: "Senbon di Capelli", power: 30, chakraCost: 15, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Spara capelli induriti come aghi." }],
  ["hair_shield", { id: "hair_shield", name: "Scudo Spinoso di Capelli", power: 0, chakraCost: 10, nature: "Doton", sprite: "/sprites/jutsus/sand_shield.png", description: "Barriera protettiva di capelli corazzati." }],
  ["fire_breath_jiraiya", { id: "fire_breath_jiraiya", name: "Soffio di Fuoco del Rospo", power: 50, chakraCost: 25, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Combina olio e fiamme contro il nemico." }],
  ["toad_summon", { id: "toad_summon", name: "Evocazione: Gamabunta", power: 70, chakraCost: 45, nature: "Suiton", sprite: "/sprites/jutsus/sand_burial.png", description: "Evoca il re dei rospi Gamabunta." }],
  ["rasengan_jiraiya", { id: "rasengan_jiraiya", name: "Rasengan Eremita", power: 85, chakraCost: 55, nature: "Fuuton", sprite: "/sprites/jutsus/rasengan.png", description: "Sfera di chakra appresa da Minato." }],
  ["swamp_of_underworld", { id: "swamp_of_underworld", name: "Palude dell'Oltretomba", power: 95, chakraCost: 65, nature: "Doton", sprite: "/sprites/jutsus/sand_desert.png", description: "Crea una palude di fango che inghiotte i nemici." }],
  ["wild_lion_mane", { id: "wild_lion_mane", name: "Criniera del Leone Selvaggio", power: 110, chakraCost: 75, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Afferra e stritola i bersagli con la capigliatura." }],
  ["sage_mode_intro", { id: "sage_mode_intro", name: "Modalità Eremitica dei Rospi", power: 125, chakraCost: 85, nature: "Fuuton", sprite: "/sprites/jutsus/sage_rasengan.png", description: "Assorbe energia naturale aumentando ATK e DEF." }],
  ["bath_of_boiling_oil", { id: "bath_of_boiling_oil", name: "Bagno di Olio Bollente", power: 145, chakraCost: 100, nature: "Katon", sprite: "/sprites/jutsus/fireball.png", description: "Colpo combinato letale di fuoco, vento e olio eremitici." }],
  ["massive_rasengan", { id: "massive_rasengan", name: "Ultra Rasengan Eremitico", power: 175, chakraCost: 125, nature: "Fuuton", sprite: "/sprites/jutsus/giant_rasengan.png", description: "Un Rasengan mastodontico di proporzioni leggendarie." }],

  // ==========================================
  // TSUNADE JUTSUS
  // ==========================================
  ["tsunade_kick", { id: "tsunade_kick", name: "Calcio Spacca-Terreno", power: 35, chakraCost: 15, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Calcio dall'alto ad altissimo impatto." }],
  ["chakra_burst", { id: "chakra_burst", name: "Esplosione di Forza", power: 50, chakraCost: 25, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Rilascia chakra dai pugni aumentando la forza d'urto." }],
  ["body_flicker_tsunade", { id: "body_flicker_tsunade", name: "Scatto del Fulmine Shinobi", power: 0, chakraCost: 15, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Aumenta la velocità di movimento eludendo i colpi." }],
  ["nervous_system_rupture", { id: "nervous_system_rupture", name: "Rottura del Sistema Nervoso", power: 65, chakraCost: 40, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Invia elettricità nel corpo nemico paralizzandolo." }],
  ["heaven_spear_kick", { id: "heaven_spear_kick", name: "Calcio del Paradiso", power: 85, chakraCost: 50, nature: "Taijutsu", sprite: "/sprites/jutsus/basic_healing.png", description: "Colpo da discesa aerea devastante." }],
  ["katsuyu_summon", { id: "katsuyu_summon", name: "Evocazione: Katsuyu", power: -75, chakraCost: 50, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Evoca la lumaca Katsuyu per curare la squadra." }],
  ["medical_regeneration", { id: "medical_regeneration", name: "Rigenerazione Eremitica", power: -100, chakraCost: 65, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Cura intensamente le ferite." }],
  ["byakugou_healing_tsunade", { id: "byakugou_healing_tsunade", name: "Rilascio del Sigillo Byakugou", power: -150, chakraCost: 95, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Rigenerazione istantanea continua di Tsunade." }],

  // ==========================================
  // OROCHIMARU JUTSUS
  // ==========================================
  ["snake_strike", { id: "snake_strike", name: "Morsa dei Serpenti d'Ombra", power: 30, chakraCost: 15, nature: "Doton", sprite: "/sprites/jutsus/sand_coffin.png", description: "Fila di serpenti sbuca dalle maniche per azzannare." }],
  ["shadow_clone_snake", { id: "shadow_clone_snake", name: "Moltiplicazione dei Serpenti", power: 45, chakraCost: 20, nature: "Doton", sprite: "/sprites/jutsus/shadow_clone.png", description: "Crea cloni che si dissolvono in serpi." }],
  ["sword_kusanagi_strike", { id: "sword_kusanagi_strike", name: "Spada Kusanagi", power: 60, chakraCost: 35, nature: "Taijutsu", sprite: "/sprites/jutsus/chidori.png", description: "Estrae la lama Kusanagi dalla gola trafiggendo." }],
  ["triple_rashomon", { id: "triple_rashomon", name: "Triplo Cancello Rashomon", power: 0, chakraCost: 45, nature: "Doton", sprite: "/sprites/jutsus/shukaku_shield.png", description: "Evoca tre porte colossali per neutralizzare gli attacchi." }],
  ["poison_snake_summon", { id: "poison_snake_summon", name: "Evocazione: Manda", power: 85, chakraCost: 60, nature: "Doton", sprite: "/sprites/jutsus/sand_desert.png", description: "Evoca il serpente velenoso Manda." }],
  ["wind_gale_orochi", { id: "wind_gale_orochi", name: "Raffica di Vento dell'Ombra", power: 95, chakraCost: 55, nature: "Fuuton", sprite: "/sprites/jutsus/rasengan.png", description: "Crea forti raffiche ventose taglienti." }],
  ["snake_skin_shedding", { id: "snake_skin_shedding", name: "Muta della Pelle", power: -75, chakraCost: 50, nature: "Iryo", sprite: "/sprites/jutsus/basic_healing.png", description: "Rigenera il corpo emergendo intatto da una vecchia pelle." }],
  ["reaper_death_seal_break", { id: "reaper_death_seal_break", name: "Rottura del Sigillo del Mietitore", power: 120, chakraCost: 80, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Recupera le anime delle braccia sigillate." }],
  ["eight_branches_giant_snake", { id: "eight_branches_giant_snake", name: "Serpente a Otto Teste (Yamata)", power: 155, chakraCost: 105, nature: "Doton", sprite: "/sprites/jutsus/sand_desert.png", description: "Si trasforma in un drago/serpente bianco colossale." }],
  ["edo_tensei", { id: "edo_tensei", name: "Resurrezione Impura (Edo Tensei)", power: 185, chakraCost: 135, nature: "Genjutsu", sprite: "/sprites/jutsus/kirin.png", description: "Evoca gli Hokage defunti per polverizzare i nemici." }],
]);
