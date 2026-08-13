"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { backViewProfiles, englishContent, glowProfiles, glowShapeFor, homePlanFor, relatedVideosFor, tutorialFor, type Lang, type TrainingMode, ui, videoFor, zoneEnglish } from "./muscleExtras";
import MuscleModel3D from "./MuscleModel3D";

type Zone = "Голова и шея" | "Верх тела" | "Кор" | "Низ тела";
type Side = "left" | "right";
type BodyType = "male" | "female";
type BodyView = "front" | "back";
type Theme = "dark" | "light";

const publicAsset = (file: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${file}`;

type Muscle = {
  id: string;
  name: string;
  latin: string;
  zone: Zone;
  side: Side;
  labelY: number;
  targetX: number;
  targetY: number;
  color: string;
  function: string;
  cue: string;
  exercises: string[];
};

const muscles: Muscle[] = [
  { id: "frontalis", name: "Лобная", latin: "Frontalis", zone: "Голова и шея", side: "left", labelY: 8, targetX: 50, targetY: 8, color: "#d7c96e", function: "Поднимает брови и образует горизонтальные складки на лбу.", cue: "Это мимическая мышца: отдельная силовая нагрузка обычно не нужна.", exercises: ["Мягкое расслабление лба", "Контроль мимического напряжения"] },
  { id: "orbicularis-oculi", name: "Круговая глаза", latin: "Orbicularis oculi", zone: "Голова и шея", side: "left", labelY: 12, targetX: 49, targetY: 10, color: "#536f9f", function: "Закрывает веки и участвует в моргании и прищуривании.", cue: "Не дави на глазное яблоко и не растягивай кожу резкими движениями.", exercises: ["Спокойное моргание", "Расслабление области вокруг глаз"] },
  { id: "orbicularis-oris", name: "Круговая рта", latin: "Orbicularis oris", zone: "Голова и шея", side: "left", labelY: 16, targetX: 50, targetY: 13, color: "#7b63a8", function: "Смыкает и вытягивает губы, участвует в речи и мимике.", cue: "Работай без сильного растяжения губ и челюстного напряжения.", exercises: ["Артикуляционная разминка", "Расслабление губ"] },
  { id: "sternocleidomastoid", name: "Грудино-ключично-сосцевидная", latin: "Sternocleidomastoid", zone: "Голова и шея", side: "left", labelY: 20, targetX: 48.8, targetY: 18, color: "#e17a93", function: "Наклоняет и поворачивает голову, помогает сгибать шею.", cue: "Движения шеи выполняй медленно, без давления руками и боли.", exercises: ["Изометрия шеи", "Мягкие повороты головы"] },
  { id: "trapezius", name: "Трапециевидная", latin: "Trapezius", zone: "Верх тела", side: "left", labelY: 24, targetX: 47.5, targetY: 21, color: "#6f8f75", function: "Двигает лопатки и поддерживает плечевой пояс и шею.", cue: "В тягах сначала опускай плечи, а затем своди лопатки.", exercises: ["Шраги с гантелями", "Тяга каната к лицу"] },
  { id: "deltoid", name: "Дельтовидная", latin: "Deltoid", zone: "Верх тела", side: "left", labelY: 28, targetX: 42.5, targetY: 24, color: "#d76472", function: "Поднимает руку вперёд, в сторону и назад, стабилизирует плечо.", cue: "Не поднимай плечи к ушам и не бросай вес вниз.", exercises: ["Жим гантелей сидя", "Махи гантелей в стороны"] },
  { id: "pectoralis", name: "Большая грудная", latin: "Pectoralis major", zone: "Верх тела", side: "left", labelY: 32, targetX: 46.5, targetY: 28, color: "#a76061", function: "Приводит руку к корпусу и участвует во всех жимовых движениях.", cue: "Сведи лопатки и держи грудь раскрытой.", exercises: ["Жим гантелей лёжа", "Отжимания"] },
  { id: "biceps", name: "Двуглавая плеча", latin: "Biceps brachii", zone: "Верх тела", side: "left", labelY: 36, targetX: 41.8, targetY: 34, color: "#5f758f", function: "Сгибает локоть и разворачивает предплечье ладонью вверх.", cue: "Зафиксируй локти у корпуса и не раскачивай спину.", exercises: ["Подъём штанги на бицепс", "Молотковые сгибания"] },
  { id: "brachioradialis", name: "Плечелучевая", latin: "Brachioradialis", zone: "Верх тела", side: "left", labelY: 40, targetX: 39.7, targetY: 40, color: "#6d8ca9", function: "Сгибает предплечье, особенно при нейтральном положении кисти.", cue: "Сохраняй кисть прямой и двигай только предплечьем.", exercises: ["Молотковые сгибания", "Обратные сгибания"] },
  { id: "flexor-carpi-radialis", name: "Лучевой сгибатель кисти", latin: "Flexor carpi radialis", zone: "Верх тела", side: "left", labelY: 44, targetX: 38.8, targetY: 45, color: "#c8a65a", function: "Сгибает кисть и отводит её в сторону большого пальца.", cue: "Используй небольшой вес и полную контролируемую амплитуду.", exercises: ["Сгибание кистей сидя", "Удержание диска пальцами"] },
  { id: "rectus-abdominis", name: "Прямая мышца живота", latin: "Rectus abdominis", zone: "Кор", side: "left", labelY: 48, targetX: 49, targetY: 41, color: "#c47b58", function: "Сгибает позвоночник и помогает удерживать положение таза.", cue: "Выдыхай и подкручивай таз в точке сокращения.", exercises: ["Скручивания", "Подъём коленей в висе"] },
  { id: "external-oblique", name: "Наружная косая", latin: "External oblique", zone: "Кор", side: "left", labelY: 52, targetX: 45.5, targetY: 44, color: "#739e88", function: "Поворачивает и наклоняет корпус, стабилизирует брюшную стенку.", cue: "Не тяни корпус руками и не спеши в повороте.", exercises: ["Боковая планка", "Повороты блока стоя"] },
  { id: "sartorius", name: "Портняжная", latin: "Sartorius", zone: "Низ тела", side: "left", labelY: 58, targetX: 45.5, targetY: 56, color: "#8f6b9f", function: "Сгибает и вращает бедро, помогает сгибать колено.", cue: "Развивай через многосуставные движения, а не изоляцию.", exercises: ["Выпады в сторону", "Шаги на платформу"] },
  { id: "rectus-femoris", name: "Прямая бедра", latin: "Rectus femoris", zone: "Низ тела", side: "left", labelY: 64, targetX: 47.5, targetY: 62, color: "#bd655f", function: "Разгибает колено и помогает сгибать бедро.", cue: "В приседе веди колено по линии носка.", exercises: ["Фронтальные приседания", "Разгибание ног"] },
  { id: "vastus-lateralis", name: "Латеральная широкая", latin: "Vastus lateralis", zone: "Низ тела", side: "left", labelY: 70, targetX: 44.5, targetY: 66, color: "#4c7891", function: "Разгибает колено и формирует наружную часть квадрицепса.", cue: "Не блокируй колено резко в верхней точке.", exercises: ["Жим ногами", "Болгарские выпады"] },
  { id: "tibialis-anterior", name: "Передняя большеберцовая", latin: "Tibialis anterior", zone: "Низ тела", side: "left", labelY: 82, targetX: 47, targetY: 81, color: "#98a852", function: "Поднимает носок стопы и стабилизирует голеностоп при ходьбе.", cue: "Двигай стопой, не отрывая пятку от опоры.", exercises: ["Подъёмы носков у стены", "Ходьба на пятках"] },

  { id: "zygomaticus", name: "Скуловая", latin: "Zygomaticus", zone: "Голова и шея", side: "right", labelY: 8, targetX: 51, targetY: 11, color: "#6d7f62", function: "Поднимает угол рта и участвует в улыбке.", cue: "Для мимических мышц важнее расслабление, чем силовая нагрузка.", exercises: ["Мягкая артикуляция", "Расслабление щёк"] },
  { id: "masseter", name: "Жевательная", latin: "Masseter", zone: "Голова и шея", side: "right", labelY: 12, targetX: 51.5, targetY: 14, color: "#8c8d93", function: "Поднимает нижнюю челюсть и обеспечивает жевательное усилие.", cue: "При напряжении челюсти избегай сильного самомассажа.", exercises: ["Расслабление челюсти", "Контроль положения языка"] },
  { id: "serratus", name: "Передняя зубчатая", latin: "Serratus anterior", zone: "Верх тела", side: "right", labelY: 18, targetX: 55.5, targetY: 34, color: "#4e8e82", function: "Прижимает лопатку к грудной клетке и вращает её вверх.", cue: "В конце движения активно толкай поверхность от себя.", exercises: ["Лопаточные отжимания", "Жим одной рукой в блоке"] },
  { id: "latissimus", name: "Широчайшая спины", latin: "Latissimus dorsi", zone: "Верх тела", side: "right", labelY: 23, targetX: 55, targetY: 37, color: "#485d89", function: "Тянет руку вниз и назад, формирует ширину спины.", cue: "Начинай тягу лопаткой и веди локоть к тазу.", exercises: ["Подтягивания", "Тяга верхнего блока"] },
  { id: "triceps", name: "Трёхглавая плеча", latin: "Triceps brachii", zone: "Верх тела", side: "right", labelY: 28, targetX: 58, targetY: 35, color: "#806d85", function: "Разгибает локоть и создаёт силу в жимовых движениях.", cue: "Плечо остаётся неподвижным, работает только локоть.", exercises: ["Разгибание рук на блоке", "Французский жим"] },
  { id: "palmaris", name: "Длинная ладонная", latin: "Palmaris longus", zone: "Верх тела", side: "right", labelY: 33, targetX: 60, targetY: 43, color: "#9e9763", function: "Сгибает кисть и натягивает ладонный апоневроз.", cue: "Предплечье держи на опоре, амплитуда небольшая.", exercises: ["Сгибание кистей", "Эспандер для кисти"] },
  { id: "flexor-digitorum", name: "Сгибатель пальцев", latin: "Flexor digitorum", zone: "Верх тела", side: "right", labelY: 38, targetX: 60.5, targetY: 47, color: "#bd6d62", function: "Сгибает пальцы и помогает удерживать спортивные снаряды.", cue: "Не перегружай пальцы, если есть боль в сухожилиях.", exercises: ["Фермерская прогулка", "Вис на перекладине"] },
  { id: "tensor-fasciae", name: "Напрягатель широкой фасции", latin: "Tensor fasciae latae", zone: "Низ тела", side: "right", labelY: 44, targetX: 55, targetY: 54, color: "#527e98", function: "Стабилизирует таз и участвует в отведении бедра.", cue: "Не заваливай таз при упражнениях на одной ноге.", exercises: ["Шаги с резинкой", "Отведение бедра стоя"] },
  { id: "iliopsoas", name: "Подвздошно-поясничная", latin: "Iliopsoas", zone: "Кор", side: "right", labelY: 49, targetX: 52.5, targetY: 52, color: "#d17b55", function: "Главный сгибатель бедра, помогает стабилизировать поясницу.", cue: "Не компенсируй движение прогибом в пояснице.", exercises: ["Подъём коленей в висе", "Марш с резинкой"] },
  { id: "adductor-longus", name: "Длинная приводящая", latin: "Adductor longus", zone: "Низ тела", side: "right", labelY: 54, targetX: 52.5, targetY: 59, color: "#7771a0", function: "Приводит бедро к средней линии и стабилизирует таз.", cue: "Увеличивай амплитуду постепенно, без резкого растяжения.", exercises: ["Приведение ноги в блоке", "Боковые выпады"] },
  { id: "gracilis", name: "Тонкая", latin: "Gracilis", zone: "Низ тела", side: "right", labelY: 59, targetX: 51, targetY: 66, color: "#9e826e", function: "Приводит бедро и помогает сгибать колено.", cue: "Держи таз ровным и не разворачивай стопу.", exercises: ["Сведение ног в тренажёре", "Копенгагенская планка"] },
  { id: "vastus-medialis", name: "Медиальная широкая", latin: "Vastus medialis", zone: "Низ тела", side: "right", labelY: 65, targetX: 52.5, targetY: 69, color: "#4f8c79", function: "Разгибает колено и стабилизирует надколенник.", cue: "Контролируй последние градусы разгибания без удара.", exercises: ["Шаги на платформу", "Разгибание ног"] },
  { id: "fibularis-longus", name: "Длинная малоберцовая", latin: "Fibularis longus", zone: "Низ тела", side: "right", labelY: 72, targetX: 54, targetY: 80, color: "#5d7396", function: "Стабилизирует стопу и помогает отводить её наружу.", cue: "Делай движения стопой медленно и без рывков.", exercises: ["Эверсия стопы с резинкой", "Баланс на одной ноге"] },
  { id: "gastrocnemius", name: "Икроножная", latin: "Gastrocnemius", zone: "Низ тела", side: "right", labelY: 80, targetX: 53, targetY: 83, color: "#bb6959", function: "Поднимает пятку и участвует в беге, прыжках и ходьбе.", cue: "Используй полную амплитуду и паузу наверху.", exercises: ["Подъёмы на носки стоя", "Подъёмы на одной ноге"] },
  { id: "soleus", name: "Камбаловидная", latin: "Soleus", zone: "Низ тела", side: "right", labelY: 86, targetX: 53, targetY: 87, color: "#8e8c59", function: "Поддерживает положение голени и работает при согнутом колене.", cue: "Для акцента держи колено согнутым примерно под прямым углом.", exercises: ["Подъёмы на носки сидя", "Удержание на носках"] },
  { id: "erector-spinae", name: "Выпрямитель позвоночника", latin: "Erector spinae", zone: "Кор", side: "left", labelY: 37, targetX: 50, targetY: 38, color: "#b98b68", function: "Разгибает и стабилизирует позвоночник, помогает удерживать корпус вертикально.", cue: "Напряги живот и двигайся через тазобедренные суставы, не усиливая прогиб в пояснице.", exercises: ["Гиперэкстензия", "Птичья собака"] },
  { id: "gluteus-medius", name: "Средняя ягодичная", latin: "Gluteus medius", zone: "Низ тела", side: "left", labelY: 45, targetX: 46.3, targetY: 45.2, color: "#bd6e7a", function: "Отводит бедро и удерживает таз ровным при опоре на одну ногу.", cue: "Носок направь вперёд и не наклоняй корпус в сторону от рабочей ноги.", exercises: ["Отведение бедра в блоке", "Боковые шаги с резинкой"] },
  { id: "gluteus-maximus", name: "Большая ягодичная", latin: "Gluteus maximus", zone: "Низ тела", side: "right", labelY: 49, targetX: 46.7, targetY: 50.2, color: "#d47a68", function: "Разгибает и вращает бедро наружу, создаёт силу в приседаниях, беге и прыжках.", cue: "Завершай движение ягодицами, не переразгибая поясницу и не разворачивая таз.", exercises: ["Ягодичный мост", "Румынская тяга"] },
  { id: "biceps-femoris", name: "Двуглавая бедра", latin: "Biceps femoris", zone: "Низ тела", side: "right", labelY: 62, targetX: 46.2, targetY: 62.4, color: "#7c829c", function: "Сгибает колено и помогает разгибать бедро в составе задней поверхности бедра.", cue: "Отводи таз назад, сохраняй длинную спину и небольшой сгиб в коленях.", exercises: ["Румынская тяга", "Сгибание ног"] },
];

const zoneFilters = ["Все", "Голова и шея", "Верх тела", "Кор", "Низ тела"] as const;
const backMuscleIds = new Set(["trapezius", "deltoid", "triceps", "latissimus", "erector-spinae", "gluteus-medius", "gluteus-maximus", "biceps-femoris", "gastrocnemius", "soleus"]);
const backOnlyMuscleIds = new Set(["erector-spinae", "gluteus-medius", "gluteus-maximus", "biceps-femoris"]);

type HotspotProfile = [number, number, number, number, number];

export default function Home() {
  const [selectedId, setSelectedId] = useState("pectoralis");
  const [zone, setZone] = useState<(typeof zoneFilters)[number]>("Все");
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState<Lang>("ru");
  const [trainingMode, setTrainingMode] = useState<TrainingMode>("home");
  const [bodyType, setBodyType] = useState<BodyType>("male");
  const [bodyView, setBodyView] = useState<BodyView>("front");
  const [theme, setTheme] = useState<Theme>("dark");
  const [bodyZoom, setBodyZoom] = useState(1);
  const dragStart = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const suppressNextClick = useRef(false);

  const selected = muscles.find((muscle) => muscle.id === selectedId) ?? muscles[0];
  const words = ui[lang];
  const selectedEnglish = englishContent[selected.id];
  const selectedName = lang === "ru" ? selected.name : selected.latin;
  const selectedFunction = lang === "ru" ? selected.function : selectedEnglish.function;
  const selectedCue = lang === "ru" ? selected.cue : selectedEnglish.cue;
  const gymExercises = lang === "ru" ? selected.exercises : selectedEnglish.exercises;
  const homePlan = homePlanFor(selected.id, lang);
  const selectedExercises = trainingMode === "home" ? homePlan.exercises : gymExercises;
  const selectedVideo = trainingMode === "home" ? homePlan.video : videoFor(selected.id);
  const relatedVideos = relatedVideosFor(selected.id, selectedVideo.id);
  const tutorial = tutorialFor(selected, lang, selectedCue, [...selectedExercises], trainingMode);
  const poseKey = `${bodyType}-${bodyView}`;
  const bodyImage = bodyView === "back"
    ? publicAsset(`muscle-anatomy-${bodyType}-back.webp`)
    : bodyType === "female"
      ? publicAsset("muscle-anatomy-female-front.webp")
      : publicAsset("muscle-anatomy-front.webp");
  const posterMuscles = bodyView === "back" ? muscles.filter((muscle) => backMuscleIds.has(muscle.id)) : muscles.filter((muscle) => !backOnlyMuscleIds.has(muscle.id));
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return muscles.filter((muscle) => {
      const inZone = zone === "Все" || muscle.zone === zone;
      const inSearch = !normalized || muscle.name.toLowerCase().includes(normalized) || muscle.latin.toLowerCase().includes(normalized);
      return inZone && inSearch;
    });
  }, [query, zone]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function choose(id: string) {
    setSelectedId(id);
    if (backOnlyMuscleIds.has(id)) setBodyView("back");
    else if (bodyView === "back" && !backMuscleIds.has(id)) setBodyView("front");
  }

  function changeBodyView(nextView: BodyView) {
    setBodyView(nextView);
    if (nextView === "back" && !backMuscleIds.has(selectedId)) setSelectedId("latissimus");
    if (nextView === "front" && backOnlyMuscleIds.has(selectedId)) setSelectedId("pectoralis");
  }

  function femaleAdjustedX(x: number, y: number) {
    const scale = y < 20 ? .94 : y < 35 ? .89 : y < 43 ? .9 : y < 60 ? 1.065 : y < 72 ? 1.03 : .98;
    return 50 + (x - 50) * scale;
  }

  function handlePosterPointerDown(event: React.PointerEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest(".body-controls, .poster-selection, .callout, .poster-scroll, .body-hotspot")) return;
    dragStart.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
    if (event.pointerType !== "touch") event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePosterPointerUp(event: React.PointerEvent<HTMLElement>) {
    const start = dragStart.current;
    dragStart.current = null;
    if (!start) return;
    const distanceX = event.clientX - start.x;
    const distanceY = event.clientY - start.y;
    if (Math.abs(distanceX) > 56 && Math.abs(distanceX) > Math.abs(distanceY) * 1.2) {
      suppressNextClick.current = true;
      window.setTimeout(() => { suppressNextClick.current = false; }, 350);
      changeBodyView(bodyView === "front" ? "back" : "front");
    }
  }

  function handlePosterClickCapture(event: React.MouseEvent<HTMLElement>) {
    const clickedHotspot = (event.target as HTMLElement).closest<HTMLElement>(".body-hotspot");
    const mobilePointer = window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
    if (clickedHotspot && mobilePointer && event.detail > 0) {
      const nearestHotspot = [...event.currentTarget.querySelectorAll<HTMLElement>(".body-hotspot")]
        .map((hotspot) => {
          const bounds = hotspot.getBoundingClientRect();
          return {
            hotspot,
            distance: Math.hypot(
              event.clientX - (bounds.left + bounds.width / 2),
              event.clientY - (bounds.top + bounds.height / 2),
            ),
          };
        })
        .sort((a, b) => a.distance - b.distance)[0]?.hotspot;
      const muscleId = nearestHotspot?.dataset.muscleId;
      if (muscleId) {
        event.preventDefault();
        event.stopPropagation();
        choose(muscleId);
        return;
      }
    }
    if (!suppressNextClick.current) return;
    suppressNextClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  }

  function chooseFromCatalog(id: string) {
    choose(id);
    if (!window.matchMedia("(max-width: 820px)").matches) return;
    window.requestAnimationFrame(() => {
      document.getElementById("details")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function displayName(muscle: Muscle) {
    return lang === "ru" ? muscle.name : muscle.latin;
  }

  function displayZone(value: string) {
    return lang === "ru" ? value : (zoneEnglish[value] ?? value);
  }

  function hotspotFor(muscle: Muscle): HotspotProfile {
    if (bodyView === "back") {
      const profile = backViewProfiles[muscle.id];
      if (profile) {
        const x = bodyType === "female" ? femaleAdjustedX(profile.target[0], profile.target[1]) : profile.target[0];
        return [x, profile.target[1], profile.glow[0] * .78, profile.glow[1] * .68, profile.glow[2]];
      }
    }
    const muscleGlow = glowProfiles[muscle.id] ?? [54, 84, 0];
    const x = bodyType === "female" ? femaleAdjustedX(muscle.targetX, muscle.targetY) : muscle.targetX;
    return [
      x,
      muscle.targetY,
      Math.max(28, muscleGlow[0] * .78),
      Math.max(24, muscleGlow[1] * .68),
      muscleGlow[2],
    ];
  }

  return (
    <main className={`anatomy-site theme-${theme}`}>
      <header className="anatomy-nav">
        <a href="#poster" className="index-logo" aria-label={lang === "ru" ? "К анатомическому плакату" : "Go to the anatomy poster"}>
          <span>MI</span>
          <div><b>MUSCLE INDEX</b><small>{words.subtitle}</small></div>
        </a>
        <nav aria-label={lang === "ru" ? "Навигация" : "Navigation"}>
          <a href="#poster">{words.poster}</a>
          <a href="#catalog">{words.allMuscles}</a>
          <a href="#details">{words.training}</a>
        </nav>
        <div className="nav-tools">
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? words.lightTheme : words.darkTheme}
            title={theme === "dark" ? words.lightTheme : words.darkTheme}
          >
            <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
          </button>
          <div className="language-toggle" aria-label={lang === "ru" ? "Выбор языка" : "Language selection"}>
            <button className={lang === "ru" ? "active" : ""} onClick={() => setLang("ru")} aria-pressed={lang === "ru"}>RU</button>
            <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
          </div>
          <span className="nav-count"><i /> {muscles.length} {words.muscles}</span>
        </div>
      </header>

      <section className="anatomy-poster" id="poster" style={{ "--body-zoom": bodyZoom } as React.CSSProperties} onPointerDown={handlePosterPointerDown} onPointerUp={handlePosterPointerUp} onPointerCancel={() => { dragStart.current = null; }} onClickCapture={handlePosterClickCapture}>
        <div className="poster-art">
          <Image
            key={poseKey}
            src={bodyImage}
            alt={`${bodyType === "female" ? "Женская" : "Мужская"} мышечная система, вид ${bodyView === "front" ? "спереди" : "сзади"}`}
            fill
            unoptimized
            priority
            sizes="100vw"
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className="poster-noise" aria-hidden="true" />

        <div className="body-controls">
          <div className="body-type-toggle" aria-label={lang === "ru" ? "Тип тела" : "Body type"}>
            <button className={bodyType === "male" ? "active" : ""} onClick={() => setBodyType("male")} aria-pressed={bodyType === "male"}><span>M</span>{words.male}</button>
            <button className={bodyType === "female" ? "active" : ""} onClick={() => setBodyType("female")} aria-pressed={bodyType === "female"}><span>W</span>{words.female}</button>
          </div>
          <div className="body-view-toggle" aria-label={lang === "ru" ? "Сторона тела" : "Body view"}>
            <button className={bodyView === "front" ? "active" : ""} onClick={() => changeBodyView("front")} aria-pressed={bodyView === "front"}>{words.front}</button>
            <button className={bodyView === "back" ? "active" : ""} onClick={() => changeBodyView("back")} aria-pressed={bodyView === "back"}>{words.back}</button>
          </div>
          <div className="body-zoom" aria-label={words.zoom}>
            <button onClick={() => setBodyZoom((value) => Math.max(.84, Number((value - .08).toFixed(2))))} disabled={bodyZoom <= .84} aria-label={words.zoomOut}>−</button>
            <span>{Math.round(bodyZoom * 100)}%</span>
            <button onClick={() => setBodyZoom((value) => Math.min(1.16, Number((value + .08).toFixed(2))))} disabled={bodyZoom >= 1.16} aria-label={words.zoomIn}>+</button>
          </div>
          <small>↔ {words.rotateHint}</small>
        </div>

        <div className="poster-heading">
          <span>{bodyView === "front" ? words.surface : words.posterior}</span>
          <h1>{words.mapA}<br />{" "}{words.mapB}</h1>
          <p>{words.click}</p>
        </div>

        <div className="poster-meta">
          <span>{bodyView === "front" ? "ANTERIOR / 01" : "POSTERIOR / 02"}</span>
          <b>{String(posterMuscles.length).padStart(2, "0")}</b>
        </div>

        {posterMuscles.map((muscle) => (
          <button
            key={muscle.id}
            className={`callout ${muscle.side} ${selectedId === muscle.id ? "active" : ""}`}
            style={{
              "--label-y": `${muscle.labelY}%`,
              "--tag": muscle.color,
            } as React.CSSProperties}
            onClick={() => choose(muscle.id)}
            aria-label={`${lang === "ru" ? "Выбрать мышцу" : "Select muscle"}: ${displayName(muscle)}`}
          >
            <span>{displayName(muscle)}</span>
            <i />
          </button>
        ))}

        <div className="body-map-layer">
          <div className="body-hotspots" aria-label={lang === "ru" ? "Мышцы на теле" : "Muscles on the body"}>
            {posterMuscles.map((muscle) => {
              const hotspot = hotspotFor(muscle);
              return (
                <button
                  key={`${poseKey}-${muscle.id}`}
                  data-muscle-id={muscle.id}
                  className={`body-hotspot shape-${glowShapeFor(muscle.id)} ${selectedId === muscle.id ? "active" : ""} ${hotspot[0] > 55 ? "tooltip-left" : ""}`}
                  style={{
                    left: `${hotspot[0]}%`,
                    top: `${hotspot[1]}%`,
                    "--hit-w": `${hotspot[2]}px`,
                    "--hit-h": `${hotspot[3]}px`,
                    "--hit-r": `${hotspot[4]}deg`,
                    "--hit-color": muscle.color,
                  } as React.CSSProperties}
                  onClick={() => choose(muscle.id)}
                  aria-label={`${lang === "ru" ? "Это мышца" : "This muscle is"}: ${displayName(muscle)}`}
                  title={displayName(muscle)}
                >
                  <span>{displayName(muscle)}</span>
                </button>
              );
            })}
          </div>

        </div>

        <div className="poster-selection">
          <span>{words.selected}</span>
          <b aria-live="polite">{selectedName}</b>
          <i>{lang === "ru" ? selected.latin : selected.name}</i>
          <p>{selectedFunction}</p>
          <a href="#details">{words.more}</a>
        </div>

        <a className="poster-scroll" href="#catalog"><span>↓</span> {words.scroll}</a>
      </section>

      <section className="mobile-muscle-directory" aria-label={lang === "ru" ? "Названия мышц на плакате" : "Muscle names on the poster"}>
        <div className="mobile-directory-heading">
          <div>
            <span>{lang === "ru" ? "Легенда плаката" : "Poster legend"}</span>
            <h2>{lang === "ru" ? "Мышцы текущего вида" : "Muscles in this view"}</h2>
          </div>
          <b>{String(posterMuscles.length).padStart(2, "0")}</b>
        </div>
        <div className="mobile-directory-grid">
          {posterMuscles.map((muscle) => (
            <button
              key={`mobile-${poseKey}-${muscle.id}`}
              className={selectedId === muscle.id ? "active" : ""}
              style={{ "--tag": muscle.color } as React.CSSProperties}
              onClick={() => choose(muscle.id)}
              aria-pressed={selectedId === muscle.id}
            >
              <i />
              <span>{displayName(muscle)}</span>
              <small>{displayZone(muscle.zone)}</small>
            </button>
          ))}
        </div>
      </section>

      <MuscleModel3D
        activeId={selected.id}
        activeColor={selected.color}
        activeName={selectedName}
        lang={lang}
        onSelect={choose}
      />

      <section className="catalog-section" id="catalog">
        <div className="catalog-intro">
          <p>{words.sheet} / {String(muscles.length).padStart(2, "0")}</p>
          <h2>{words.allA}<br /><em>{words.allB}</em></h2>
          <span>{words.intro}</span>
        </div>

        <div className="training-mode-panel" aria-label={words.place}>
          <div className="mode-copy">
            <span>{words.place}</span>
            <p>{words.placeHint}</p>
          </div>
          <div className="mode-options">
            <button className={trainingMode === "home" ? "active" : ""} onClick={() => setTrainingMode("home")} aria-pressed={trainingMode === "home"}>
              <i>⌂</i><span><b>{words.home}</b><small>{words.homeDesc}</small></span>
            </button>
            <button className={trainingMode === "gym" ? "active" : ""} onClick={() => setTrainingMode("gym")} aria-pressed={trainingMode === "gym"}>
              <i>+</i><span><b>{words.gym}</b><small>{words.gymDesc}</small></span>
            </button>
          </div>
        </div>

        <div className="catalog-grid">
          <aside className="selected-card" id="details">
            <div className="selected-number">{String(muscles.indexOf(selected) + 1).padStart(2, "0")}</div>
            <span className="selected-zone">{displayZone(selected.zone)}</span>
            <span className={`mode-badge ${trainingMode}`}>{trainingMode === "home" ? words.homeBadge : words.gymBadge}</span>
            <h3>{selectedName}</h3>
            <p className="selected-latin">{lang === "ru" ? selected.latin : selected.name}</p>

            <div className="selected-block">
              <small>{words.does}</small>
              <p>{selectedFunction}</p>
            </div>

            <div className="selected-cue">
              <span>!</span>
              <div><small>{words.technique}</small><p>{selectedCue}</p></div>
            </div>

            <div className="selected-exercises">
              <small>{words.exercises}</small>
              {selectedExercises.map((exercise, index) => (
                <div key={exercise}><span>{index + 1}</span><b>{exercise}</b></div>
              ))}
            </div>

            <div className="tutorial-block">
              <small>{words.tutorial}</small>
              <ol>
                {tutorial.map((step, index) => (
                  <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>
                ))}
              </ol>
            </div>

            <div className="video-block">
              <div className="video-heading">
                <div><small>{words.video}</small><b>{selectedVideo.title}</b><span>{selectedVideo.channel} · {words.best}</span></div>
                <i>▶</i>
              </div>
              <a
                className="video-preview"
                href={`https://www.youtube.com/watch?v=${selectedVideo.id}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`${words.openVideo}: ${selectedVideo.title}`}
                style={{ "--video-thumb": `url(https://i.ytimg.com/vi/${selectedVideo.id}/hqdefault.jpg)` } as React.CSSProperties}
              >
                <span className="video-play">▶</span>
                <span className="video-open">YouTube ↗</span>
              </a>
              <p>{words.videoNote}</p>
            </div>

            <div className="more-videos">
              <div className="more-videos-heading"><small>{words.moreVideos}</small><span>{relatedVideos.length}</span></div>
              <div className="video-shelf">
                {relatedVideos.map((video) => (
                  <a key={video.id} href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer" aria-label={`${words.openVideo}: ${video.title}`}>
                    <span className="video-card-thumb" style={{ "--video-thumb": `url(https://i.ytimg.com/vi/${video.id}/mqdefault.jpg)` } as React.CSSProperties}><i>▶</i></span>
                    <b>{video.title}</b>
                    <small>{video.channel} ↗</small>
                  </a>
                ))}
              </div>
            </div>

            <div className="selected-actions">
              <a href={`https://www.youtube.com/watch?v=${selectedVideo.id}`} target="_blank" rel="noreferrer"><span>▶</span> {words.watch}</a>
              <a href="#poster" className="ghost-action">{words.show}</a>
            </div>
          </aside>

          <div className="muscle-browser">
            <div className="browser-toolbar">
              <label>
                <span>⌕</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={words.search} aria-label={words.search} />
              </label>
              <strong>{String(filtered.length).padStart(2, "0")}</strong>
            </div>

            <div className="catalog-filters" aria-label={words.filter}>
              {zoneFilters.map((item) => (
                <button key={item} className={zone === item ? "active" : ""} onClick={() => setZone(item)}>{displayZone(item)}</button>
              ))}
            </div>

            <div className="scroll-list" tabIndex={0} aria-label={words.list}>
              {filtered.map((muscle, index) => (
                <button key={muscle.id} className={selectedId === muscle.id ? "active" : ""} onClick={() => chooseFromCatalog(muscle.id)}>
                  <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
                  <i style={{ background: muscle.color }} />
                  <div><b>{displayName(muscle)}</b><small>{lang === "ru" ? muscle.latin : muscle.name}</small></div>
                  <span className="row-zone">{displayZone(muscle.zone)}</span>
                  <strong>↗</strong>
                </button>
              ))}
              {!filtered.length && <p className="empty-list">{words.empty}</p>}
            </div>
          </div>
        </div>
      </section>

      <footer className="anatomy-footer">
        <div><b>MUSCLE INDEX</b><span>{words.educational}</span></div>
        <p>{words.footer}</p>
        <a href="#poster">{words.top}</a>
      </footer>
    </main>
  );
}
