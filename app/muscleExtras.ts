export type Lang = "ru" | "en";
export type TrainingMode = "gym" | "home";

type EnglishContent = {
  function: string;
  cue: string;
  exercises: [string, string];
};

export const englishContent: Record<string, EnglishContent> = {
  frontalis: { function: "Raises the eyebrows and creates horizontal forehead lines.", cue: "This is a facial-expression muscle; forceful resistance is not needed.", exercises: ["Gentle forehead relaxation", "Controlled eyebrow movement"] },
  "orbicularis-oculi": { function: "Closes the eyelids for blinking and squinting.", cue: "Never press on the eyeball or pull the skin aggressively.", exercises: ["Relaxed blinking", "Gentle eye-area relaxation"] },
  "orbicularis-oris": { function: "Closes and protrudes the lips and supports speech.", cue: "Keep the jaw relaxed and avoid forceful lip stretching.", exercises: ["Articulation warm-up", "Gentle lip relaxation"] },
  sternocleidomastoid: { function: "Turns and tilts the head and assists neck flexion.", cue: "Move slowly, use very light resistance and stop if you feel dizziness or pain.", exercises: ["Neck isometric hold", "Controlled head rotation"] },
  trapezius: { function: "Moves the shoulder blades and supports the neck and shoulder girdle.", cue: "Keep the neck long; move the shoulder blades before bending the elbows.", exercises: ["Dumbbell shrug", "Face pull"] },
  deltoid: { function: "Raises the arm forward, sideways and backward while stabilizing the shoulder.", cue: "Keep the shoulder away from the ear and lower the weight under control.", exercises: ["Seated dumbbell press", "Dumbbell lateral raise"] },
  pectoralis: { function: "Brings the arm toward the body and powers pressing movements.", cue: "Set the shoulder blades down and back and keep the chest open.", exercises: ["Dumbbell bench press", "Push-up"] },
  biceps: { function: "Bends the elbow and turns the palm upward.", cue: "Keep the elbows close to the torso and do not swing the back.", exercises: ["Barbell curl", "Hammer curl"] },
  brachioradialis: { function: "Flexes the elbow most strongly with a neutral grip.", cue: "Keep the wrist straight and move through the elbow only.", exercises: ["Hammer curl", "Reverse curl"] },
  "flexor-carpi-radialis": { function: "Flexes the wrist and moves it toward the thumb side.", cue: "Use a light load and a slow, comfortable range.", exercises: ["Seated wrist curl", "Plate pinch hold"] },
  "rectus-abdominis": { function: "Flexes the trunk and helps control pelvic position.", cue: "Exhale as you shorten the abdomen and gently tuck the pelvis.", exercises: ["Controlled crunch", "Hanging knee raise"] },
  "external-oblique": { function: "Rotates and side-bends the trunk and braces the abdominal wall.", cue: "Move from the torso without pulling with the arms.", exercises: ["Side plank", "Standing cable rotation"] },
  sartorius: { function: "Flexes and rotates the hip and assists knee flexion.", cue: "Train it through controlled multi-joint movement rather than heavy isolation.", exercises: ["Lateral lunge", "Step-up"] },
  "rectus-femoris": { function: "Extends the knee and assists hip flexion.", cue: "Track the knee in line with the toes and control the bottom position.", exercises: ["Front squat", "Leg extension"] },
  "vastus-lateralis": { function: "Extends the knee and forms the outer quadriceps.", cue: "Avoid snapping the knee into lockout.", exercises: ["Leg press", "Bulgarian split squat"] },
  "tibialis-anterior": { function: "Lifts the front of the foot and stabilizes the ankle while walking.", cue: "Lift the toes while keeping the heels grounded.", exercises: ["Wall tibialis raise", "Heel walk"] },
  zygomaticus: { function: "Raises the corner of the mouth during smiling.", cue: "Relaxation and natural expression are more useful than heavy resistance.", exercises: ["Gentle articulation", "Cheek relaxation"] },
  masseter: { function: "Closes the jaw and produces chewing force.", cue: "Avoid forceful jaw training, especially with clicking or pain.", exercises: ["Jaw relaxation", "Neutral tongue-position practice"] },
  serratus: { function: "Keeps the shoulder blade against the rib cage and rotates it upward.", cue: "At the end of the press, actively push the surface away without shrugging.", exercises: ["Scapular push-up", "Single-arm cable press"] },
  latissimus: { function: "Pulls the arm down and back and contributes to back width.", cue: "Start with the shoulder blade and drive the elbow toward the hip.", exercises: ["Pull-up", "Lat pulldown"] },
  triceps: { function: "Extends the elbow and powers pressing movements.", cue: "Keep the upper arm stable and move through the elbow.", exercises: ["Cable pressdown", "Overhead triceps extension"] },
  palmaris: { function: "Flexes the wrist and tensions the palm fascia.", cue: "Support the forearm and use a small, controlled range.", exercises: ["Wrist curl", "Hand-gripper squeeze"] },
  "flexor-digitorum": { function: "Flexes the fingers and supports gripping strength.", cue: "Stop if the finger or tendon area becomes painful.", exercises: ["Farmer carry", "Dead hang"] },
  "tensor-fasciae": { function: "Helps stabilize the pelvis and abduct the hip.", cue: "Keep the pelvis level and avoid leaning away from the working leg.", exercises: ["Band lateral walk", "Standing hip abduction"] },
  iliopsoas: { function: "Flexes the hip and helps control the lumbar-pelvic region.", cue: "Do not replace hip movement with an exaggerated low-back arch.", exercises: ["Hanging knee raise", "Band-resisted march"] },
  "adductor-longus": { function: "Pulls the thigh toward the midline and stabilizes the pelvis.", cue: "Increase range gradually and avoid sudden groin stretching.", exercises: ["Cable hip adduction", "Lateral lunge"] },
  gracilis: { function: "Adducts the thigh and assists knee flexion.", cue: "Keep the pelvis level and the foot facing forward.", exercises: ["Machine hip adduction", "Copenhagen plank"] },
  "vastus-medialis": { function: "Extends the knee and helps stabilize the kneecap.", cue: "Control the last part of knee extension without snapping the joint.", exercises: ["Step-up", "Leg extension"] },
  "fibularis-longus": { function: "Stabilizes the foot and helps turn it outward.", cue: "Move the foot slowly and avoid rolling the whole leg.", exercises: ["Band foot eversion", "Single-leg balance"] },
  gastrocnemius: { function: "Raises the heel and contributes to walking, running and jumping.", cue: "Use a full range and pause at the top.", exercises: ["Standing calf raise", "Single-leg calf raise"] },
  soleus: { function: "Supports the lower leg and works strongly with the knee bent.", cue: "Keep the knee bent to emphasize the soleus.", exercises: ["Seated calf raise", "Bent-knee calf hold"] },
  "gluteus-maximus": { function: "Extends and externally rotates the hip and provides power in squats, running and jumping.", cue: "Keep the pelvis level and finish with the glutes instead of arching the lower back.", exercises: ["Hip thrust", "Romanian deadlift"] },
  "gluteus-medius": { function: "Abducts the hip and keeps the pelvis stable while standing on one leg.", cue: "Keep the toes forward and avoid leaning the torso away from the working side.", exercises: ["Cable hip abduction", "Lateral band walk"] },
  "biceps-femoris": { function: "Bends the knee and helps extend the hip as part of the hamstrings.", cue: "Hinge from the hips with a long spine and keep a slight bend in the knees.", exercises: ["Romanian deadlift", "Leg curl"] },
  "erector-spinae": { function: "Extends and stabilizes the spine and helps maintain an upright torso.", cue: "Brace the abdomen and move through the hips without forcing the lower back into an extreme arch.", exercises: ["Back extension", "Bird dog"] },
};

export const ui = {
  ru: {
    subtitle: "Интерактивная анатомия", poster: "Плакат", allMuscles: "Все мышцы", training: "Тренировка", muscles: "мышц",
    surface: "Передняя поверхность", mapA: "Карта мышц", mapB: "человека", click: "Нажми на подпись или прямо на мышцу", selected: "Выбрано",
    more: "Подробнее ↓", scroll: "Листать полный список", sheet: "Мышечный лист", allA: "Все мышцы.", allB: "В одном месте.",
    intro: "Ищи по русскому или латинскому названию. Список прокручивается отдельно — тело и описание остаются рядом.",
    does: "Что делает", technique: "Ключ техники", exercises: "Базовые упражнения", tutorial: "Пошаговый туториал", video: "Выбранное видео",
    videoNote: "Ролик открывается прямо на YouTube — без ошибки встроенного проигрывателя.", watch: "Смотреть на YouTube", show: "Показать на теле ↑", moreVideos: "Ещё видео по теме", openVideo: "Открыть видео",
    search: "Найти мышцу...", filter: "Фильтр мышц", list: "Прокручиваемый список мышц", empty: "Ничего не найдено. Попробуй другое название.",
    educational: "Учебная карта мышц", footer: "Тренируйся осознанно. Острая боль — повод остановиться.", top: "Наверх ↑", best: "Выбор редакции",
    place: "Где тренируешься?", placeHint: "Упражнения, туториал и видео поменяются автоматически.", gym: "Зал / есть инвентарь", gymDesc: "Гантели, штанга, блоки и тренажёры", home: "Дома / без инвентаря", homeDesc: "Только вес тела и свободное место", homeBadge: "Без инвентаря", gymBadge: "С инвентарём", flexPose: "Поза сгибания локтя", extendedPose: "Руки выпрямлены в стороны", male: "Мужчина", female: "Женщина", front: "Спереди", back: "Сзади", posterior: "Задняя поверхность", rotateHint: "Потяни тело в сторону, чтобы повернуть",
  },
  en: {
    subtitle: "Interactive anatomy", poster: "Poster", allMuscles: "All muscles", training: "Training", muscles: "muscles",
    surface: "Anterior view", mapA: "Human muscle", mapB: "map", click: "Select a label or click directly on a muscle", selected: "Selected",
    more: "Details ↓", scroll: "Browse the full list", sheet: "Muscle index", allA: "Every muscle.", allB: "One clear place.",
    intro: "Search by English, Latin or Russian name. The list scrolls independently while the details stay beside it.",
    does: "What it does", technique: "Technique cue", exercises: "Key exercises", tutorial: "Step-by-step tutorial", video: "Selected video",
    videoNote: "The video opens directly on YouTube, avoiding embedded-player errors.", watch: "Watch on YouTube", show: "Show on body ↑", moreVideos: "More videos on this topic", openVideo: "Open video",
    search: "Find a muscle...", filter: "Muscle filter", list: "Scrollable muscle list", empty: "Nothing found. Try another name.",
    educational: "Educational muscle map", footer: "Train with control. Sharp pain is a reason to stop.", top: "Back to top ↑", best: "Editor’s pick",
    place: "Where do you train?", placeHint: "Exercises, tutorial and video update automatically.", gym: "Gym / equipment", gymDesc: "Dumbbells, barbells, cables and machines", home: "Home / no equipment", homeDesc: "Just bodyweight and a little floor space", homeBadge: "No equipment", gymBadge: "Equipment", flexPose: "Elbow-flexion pose", extendedPose: "Arms extended to the sides", male: "Male", female: "Female", front: "Front", back: "Back", posterior: "Posterior view", rotateHint: "Drag the body sideways to rotate",
  },
} as const;

export const zoneEnglish: Record<string, string> = {
  "Все": "All", "Голова и шея": "Head & neck", "Верх тела": "Upper body", "Кор": "Core", "Низ тела": "Lower body",
};

const videos = {
  face: { id: "uKVw2iBP7gw", title: "Muscles of facial expression — anatomy", channel: "Sam Webster" },
  neck: { id: "awJP4gENHLM", title: "Neck & shoulder strength — 4 exercises", channel: "E3 Rehab" },
  shoulder: { id: "fbV6EpgXIaw", title: "Shoulder strengthening and control", channel: "E3 Rehab" },
  chest: { id: "hWbUlkb5Ms4", title: "How to bench press with perfect technique", channel: "Jeff Nippard" },
  biceps: { id: "GNO4OtYoCYk", title: "The best and worst biceps exercises", channel: "Jeff Nippard" },
  triceps: { id: "sah-sHCZDS0", title: "The best exercises for bigger triceps", channel: "Jeff Nippard" },
  core: { id: "C_nsk6PRSp0", title: "Rectus abdominis & oblique strengthening", channel: "E3 Rehab" },
  quads: { id: "GjRRQKpB8z0", title: "Quadriceps loading and exercise guide", channel: "E3 Rehab" },
  shin: { id: "_OyNx5VMzzc", title: "Shin strengthening and exercise progressions", channel: "E3 Rehab" },
  calf: { id: "wF450Q1lYjU", title: "Calf exercises: gastrocnemius & soleus", channel: "E3 Rehab" },
} as const;

const videoGroups: Record<string, keyof typeof videos> = {
  frontalis: "face", "orbicularis-oculi": "face", "orbicularis-oris": "face", zygomaticus: "face", masseter: "face",
  sternocleidomastoid: "neck", trapezius: "neck", deltoid: "shoulder", serratus: "shoulder", latissimus: "shoulder",
  pectoralis: "chest", biceps: "biceps", brachioradialis: "biceps", "flexor-carpi-radialis": "biceps", palmaris: "biceps", "flexor-digitorum": "biceps",
  triceps: "triceps", "rectus-abdominis": "core", "external-oblique": "core", iliopsoas: "core", "tensor-fasciae": "core",
  sartorius: "quads", "rectus-femoris": "quads", "vastus-lateralis": "quads", "adductor-longus": "quads", gracilis: "quads", "vastus-medialis": "quads",
  "gluteus-maximus": "quads", "gluteus-medius": "quads", "biceps-femoris": "quads", "erector-spinae": "shoulder",
  "tibialis-anterior": "shin", "fibularis-longus": "shin", gastrocnemius: "calf", soleus: "calf",
};

export function videoFor(id: string) {
  return videos[videoGroups[id] ?? "shoulder"];
}

const homeVideos = {
  face: { id: "uKVw2iBP7gw", title: "Muscles of facial expression — anatomy", channel: "Sam Webster" },
  neck: { id: "awJP4gENHLM", title: "Neck & shoulder strength — 4 exercises", channel: "E3 Rehab" },
  push: { id: "IODxDxX7oi4", title: "The Perfect Push Up — do it right", channel: "Calisthenicmovement" },
  shoulder: { id: "KBeF8u70ZvA", title: "The best shoulder workout without weights", channel: "Calisthenicmovement" },
  back: { id: "0qLP2RNKX4A", title: "How to do reverse snow angels", channel: "Leap Fitness" },
  arms: { id: "oI0-FtVQQhY", title: "Bodyweight forearm exercises — no equipment", channel: "WorkoutEndomondo" },
  core: { id: "oj3Ef-nCNsM", title: "15-minute core workout — no equipment", channel: "Calisthenics Family" },
  legs: { id: "0wkQqZoF4-U", title: "Three bodyweight squat variations", channel: "Dr. Carl Baird" },
  shin: { id: "_OyNx5VMzzc", title: "Shin strengthening and exercise progressions", channel: "E3 Rehab" },
  calf: { id: "wF450Q1lYjU", title: "Calf exercises: gastrocnemius & soleus", channel: "E3 Rehab" },
} as const;

type HomeGroup = keyof typeof homeVideos;

const homeGroups: Record<string, HomeGroup> = {
  frontalis: "face", "orbicularis-oculi": "face", "orbicularis-oris": "face", zygomaticus: "face", masseter: "face",
  sternocleidomastoid: "neck", pectoralis: "push", triceps: "push", serratus: "push",
  trapezius: "shoulder", deltoid: "shoulder", latissimus: "back",
  biceps: "arms", brachioradialis: "arms", "flexor-carpi-radialis": "arms", palmaris: "arms", "flexor-digitorum": "arms",
  "rectus-abdominis": "core", "external-oblique": "core", iliopsoas: "core", "tensor-fasciae": "core",
  sartorius: "legs", "rectus-femoris": "legs", "vastus-lateralis": "legs", "adductor-longus": "legs", gracilis: "legs", "vastus-medialis": "legs",
  "gluteus-maximus": "legs", "gluteus-medius": "legs", "biceps-femoris": "legs", "erector-spinae": "back",
  "tibialis-anterior": "shin", "fibularis-longus": "shin", gastrocnemius: "calf", soleus: "calf",
};

const homeExercises: Record<HomeGroup, Record<Lang, [string, string]>> = {
  face: { ru: ["Мягкое расслабление лица", "Контролируемая мимика"], en: ["Gentle facial relaxation", "Controlled facial movement"] },
  neck: { ru: ["Изометрия шеи ладонью", "Медленные повороты головы"], en: ["Hand-resisted neck isometric", "Slow head rotation"] },
  push: { ru: ["Отжимания от стены или с колен", "Лопаточные отжимания"], en: ["Wall or knee push-up", "Scapular push-up"] },
  shoulder: { ru: ["Пайк-отжимания", "Подъёмы рук Y лёжа"], en: ["Pike push-up", "Prone Y raise"] },
  back: { ru: ["Обратные снежные ангелы", "Тяга локтей лёжа на животе"], en: ["Reverse snow angel", "Prone elbow pull-down"] },
  arms: { ru: ["Сгибание руки с сопротивлением ладони", "Отжимания на пальцах от стены"], en: ["Self-resisted arm curl", "Wall fingertip push-up"] },
  core: { ru: ["Мёртвый жук", "Планка или боковая планка"], en: ["Dead bug", "Front or side plank"] },
  legs: { ru: ["Приседания с весом тела", "Обратные выпады"], en: ["Bodyweight squat", "Reverse lunge"] },
  shin: { ru: ["Подъёмы носков у стены", "Ходьба на пятках"], en: ["Wall tibialis raise", "Heel walk"] },
  calf: { ru: ["Подъёмы на носки стоя", "Подъёмы на носки с согнутыми коленями"], en: ["Standing calf raise", "Bent-knee calf raise"] },
};

export function homePlanFor(id: string, lang: Lang) {
  const group = homeGroups[id] ?? "core";
  return { exercises: homeExercises[group][lang], video: homeVideos[group] };
}

export type TrainingVideo = { id: string; title: string; channel: string };

const relatedVideoGroups: Record<keyof typeof videos, TrainingVideo[]> = {
  face: [videos.face, videos.neck, videos.shoulder, homeVideos.shoulder],
  neck: [videos.neck, videos.shoulder, homeVideos.shoulder, videos.face],
  shoulder: [videos.shoulder, homeVideos.shoulder, homeVideos.back, videos.neck],
  chest: [videos.chest, homeVideos.push, homeVideos.shoulder, videos.triceps],
  biceps: [videos.biceps, homeVideos.arms, videos.triceps, homeVideos.push],
  triceps: [videos.triceps, homeVideos.push, videos.biceps, homeVideos.arms],
  core: [videos.core, homeVideos.core, homeVideos.push, videos.quads],
  quads: [videos.quads, homeVideos.legs, videos.calf, videos.core],
  shin: [videos.shin, videos.calf, homeVideos.legs, videos.quads],
  calf: [videos.calf, videos.shin, homeVideos.legs, videos.quads],
};

export function relatedVideosFor(id: string, selectedVideoId: string) {
  const group = videoGroups[id] ?? "shoulder";
  const seen = new Set<string>();
  return relatedVideoGroups[group]
    .filter((video) => video.id !== selectedVideoId && !seen.has(video.id) && Boolean(seen.add(video.id)))
    .slice(0, 3);
}

export function glowShapeFor(id: string) {
  if (["pectoralis", "trapezius", "latissimus", "gluteus-maximus"].includes(id)) return "fan";
  if (["rectus-abdominis", "external-oblique", "serratus"].includes(id)) return "core";
  if (["frontalis", "orbicularis-oculi", "orbicularis-oris", "zygomaticus", "masseter", "deltoid", "gluteus-medius"].includes(id)) return "round";
  if (["sternocleidomastoid", "sartorius", "gracilis", "flexor-carpi-radialis", "palmaris", "flexor-digitorum", "erector-spinae"].includes(id)) return "strap";
  return "long";
}

export const glowProfiles: Record<string, [number, number, number]> = {
  frontalis: [42, 24, 0], "orbicularis-oculi": [42, 23, 0], "orbicularis-oris": [34, 20, 0], zygomaticus: [38, 24, -18], masseter: [34, 44, 8],
  sternocleidomastoid: [34, 70, -20], trapezius: [150, 54, 0], deltoid: [76, 82, 14], pectoralis: [150, 92, 5], biceps: [52, 108, -5],
  brachioradialis: [42, 118, -14], "flexor-carpi-radialis": [35, 120, -13], "rectus-abdominis": [105, 175, 0], "external-oblique": [70, 150, -8],
  sartorius: [34, 190, -20], "rectus-femoris": [64, 190, 0], "vastus-lateralis": [62, 180, 8], "tibialis-anterior": [42, 170, 2], serratus: [54, 105, 10],
  latissimus: [72, 150, -8], triceps: [50, 118, 8], palmaris: [34, 120, 12], "flexor-digitorum": [38, 120, 12], "tensor-fasciae": [48, 80, 15],
  iliopsoas: [54, 80, 0], "adductor-longus": [54, 150, -8], gracilis: [34, 210, -2], "vastus-medialis": [56, 105, -12], "fibularis-longus": [38, 170, -4],
  gastrocnemius: [52, 160, 4], soleus: [42, 145, 4],
  "gluteus-maximus": [112, 108, 5], "gluteus-medius": [82, 66, -8], "biceps-femoris": [58, 180, 3], "erector-spinae": [52, 185, 0],
};

export const backViewProfiles: Record<string, { target: [number, number]; glow: [number, number, number] }> = {
  trapezius: { target: [49, 22], glow: [145, 105, 0] },
  deltoid: { target: [42.8, 24], glow: [70, 72, 0] },
  triceps: { target: [42.1, 31.5], glow: [48, 112, 5] },
  latissimus: { target: [46.2, 35.5], glow: [82, 145, 6] },
  "erector-spinae": { target: [50, 38], glow: [50, 180, 0] },
  "gluteus-medius": { target: [46.3, 45.2], glow: [78, 62, -8] },
  "gluteus-maximus": { target: [46.7, 50.2], glow: [110, 105, 5] },
  "biceps-femoris": { target: [46.2, 62.4], glow: [55, 175, 3] },
  gastrocnemius: { target: [46.2, 77.5], glow: [52, 155, 1] },
  soleus: { target: [53.5, 84], glow: [40, 120, 0] },
};

export const flexedPoseProfiles: Record<string, { target: [number, number]; glow: [number, number, number] }> = {
  biceps: { target: [40.2, 23.2], glow: [104, 48, -5] },
  brachioradialis: { target: [36.8, 20.5], glow: [40, 92, -4] },
  "flexor-carpi-radialis": { target: [36.6, 16.8], glow: [32, 86, -3] },
  palmaris: { target: [63.4, 16.7], glow: [31, 86, 3] },
  "flexor-digitorum": { target: [63.2, 20.4], glow: [38, 92, 4] },
};

export const extendedPoseProfiles: Record<string, { target: [number, number]; glow: [number, number, number] }> = {
  deltoid: { target: [43.2, 21.4], glow: [72, 70, 0] },
  triceps: { target: [63.8, 22.3], glow: [108, 46, 0] },
};

type TutorialInput = { zone: string; cue: string; exercises: string[] };

export function tutorialFor(muscle: TutorialInput, lang: Lang, localizedCue: string, localizedExercises: string[], mode: TrainingMode = "gym") {
  const gentle = muscle.zone === "Голова и шея";
  if (!gentle && mode === "home") {
    return lang === "en" ? [
      `Clear a safe space and warm up for 5 minutes. Start with one easy set of ${localizedExercises[0].toLowerCase()}.`,
      localizedCue,
      "Use only a comfortable range. Brace the torso and stop before technique changes or a joint starts to hurt.",
      "Move for 2 seconds in each direction and exhale during the hardest part. No dumbbells, bands or machines are needed.",
      "Start with 2–3 sets of 8–15 clean repetitions. Progress with extra repetitions, a slower tempo or a harder bodyweight variation.",
    ] : [
      `Освободи безопасное место и разомнись 5 минут. Начни с одного лёгкого подхода упражнения «${localizedExercises[0]}».`,
      localizedCue,
      "Работай только в комфортной амплитуде. Зафиксируй корпус и остановись, если техника меняется или появляется боль в суставе.",
      "Двигайся примерно по 2 секунды в каждую сторону и выдыхай на усилии. Гантели, резинки и тренажёры не нужны.",
      "Начни с 2–3 подходов по 8–15 чистых повторений. Усложняй дополнительными повторами, медленным темпом или более трудным вариантом с весом тела.",
    ];
  }
  if (lang === "en") {
    return gentle ? [
      "Sit tall, relax the jaw and shoulders, and take three slow breaths.",
      localizedCue,
      `Practice ${localizedExercises[0].toLowerCase()} for 5 slow, pain-free repetitions. Do not add heavy resistance.`,
      "Rest for 30–45 seconds and repeat once. Stop with dizziness, tingling, headache or sharp pain.",
      "Use this as gentle motor-control work, not as a muscle-building session.",
    ] : [
      `Warm up for 5 minutes, then perform one very light set of ${localizedExercises[0].toLowerCase()}.`,
      localizedCue,
      "Move through the largest comfortable range. Keep the rest of the body still and avoid momentum.",
      "Use a controlled 2-second lifting phase and a 2–3-second return; exhale during the effort.",
      "Start with 2–3 sets of 8–12 clean repetitions. Add load only when every rep looks the same and remains pain-free.",
    ];
  }
  return gentle ? [
    "Сядь ровно, расслабь челюсть и плечи, сделай три спокойных вдоха.",
    localizedCue,
    `Выполни «${localizedExercises[0]}» 5 раз медленно и без боли. Не добавляй сильное сопротивление.`,
    "Отдохни 30–45 секунд и повтори ещё один подход. Остановись при головокружении, онемении, головной или острой боли.",
    "Используй это как мягкую тренировку контроля движения, а не как силовую накачку.",
  ] : [
    `Разомнись 5 минут, затем сделай один очень лёгкий подход упражнения «${localizedExercises[0]}».`,
    localizedCue,
    "Работай в максимально комфортной амплитуде. Корпус держи неподвижно и не помогай себе рывком.",
    "Подъём выполняй примерно за 2 секунды, возврат — за 2–3 секунды; выдыхай на усилии.",
    "Начни с 2–3 подходов по 8–12 чистых повторений. Добавляй вес только когда все повторения одинаковые и без боли.",
  ];
}
