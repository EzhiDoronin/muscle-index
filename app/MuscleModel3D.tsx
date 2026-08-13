"use client";

import { useEffect, useRef, useState } from "react";
import type { Group, Mesh, MeshStandardMaterial, PerspectiveCamera, WebGLRenderer } from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type ModelView = "front" | "back";

type Runtime = {
  camera: PerspectiveCamera;
  controls: OrbitControls;
  meshes: Mesh[];
  renderer: WebGLRenderer;
  model: Group;
  render: () => void;
  setView: (view: ModelView) => void;
};

type Props = {
  activeId: string;
  activeColor: string;
  activeName: string;
  lang: "ru" | "en";
  onSelect: (id: string) => void;
};

const publicAsset = (file: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/${file}`;

export default function MuscleModel3D({ activeId, activeColor, activeName, lang, onSelect }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<Runtime | null>(null);
  const selectionRef = useRef({ activeId, activeColor });
  const onSelectRef = useRef(onSelect);
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [view, setView] = useState<ModelView>("front");

  selectionRef.current = { activeId, activeColor };
  onSelectRef.current = onSelect;

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;
    for (const mesh of runtime.meshes) {
      const material = mesh.material as MeshStandardMaterial;
      const isActive = mesh.userData.muscleId === activeId;
      material.color.set(isActive ? activeColor : "#8f3f36");
      material.emissive.set(isActive ? activeColor : "#170504");
      material.emissiveIntensity = isActive ? 0.42 : 0.08;
    }
    runtime.render();
  }, [activeColor, activeId]);

  useEffect(() => {
    runtimeRef.current?.setView(view);
  }, [view]);

  useEffect(() => {
    if (!enabled || !mountRef.current) return;

    let cancelled = false;
    let cleanup = () => {};
    setStatus("loading");

    Promise.all([
      import("three"),
      import("three/examples/jsm/loaders/GLTFLoader.js"),
      import("three/examples/jsm/controls/OrbitControls.js"),
    ]).then(([THREE, { GLTFLoader }, { OrbitControls }]) => {
      if (cancelled || !mountRef.current) return;
      const mount = mountRef.current;
      const mobileMode = window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
      const renderer = new THREE.WebGLRenderer({ antialias: !mobileMode, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(mobileMode ? 1 : Math.min(window.devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.sortObjects = false;
      renderer.domElement.className = "model3d-canvas";
      renderer.domElement.setAttribute("role", "application");
      renderer.domElement.setAttribute(
        "aria-label",
        lang === "ru" ? "Интерактивная 3D-модель мышц: вращайте, масштабируйте и выбирайте мышцы" : "Interactive 3D muscle model: rotate, zoom and select muscles",
      );
      mount.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xe9f7ff, 0x23100a, 2.2));
      const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
      keyLight.position.set(3, 5, 5);
      scene.add(keyLight);
      const rimLight = new THREE.DirectionalLight(0x61c9ff, 2.4);
      rimLight.position.set(-4, 1, -4);
      scene.add(rimLight);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = false;
      controls.enablePan = false;
      controls.minDistance = 6.2;
      controls.maxDistance = 18;
      controls.target.set(0, 0, 0);

      const render = () => renderer.render(scene, camera);
      const onControlsChange = () => render();
      controls.addEventListener("change", onControlsChange);
      const resize = () => {
        const width = Math.max(1, mount.clientWidth);
        const height = Math.max(1, mount.clientHeight);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        render();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      resize();

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      let pointerStart: { x: number; y: number } | null = null;
      const onPointerDown = (event: PointerEvent) => {
        pointerStart = { x: event.clientX, y: event.clientY };
      };
      const onPointerUp = (event: PointerEvent) => {
        if (!pointerStart || !runtimeRef.current) return;
        const moved = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
        pointerStart = null;
        if (moved > 8) return;
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.set(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          -((event.clientY - rect.top) / rect.height) * 2 + 1,
        );
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(runtimeRef.current.meshes, false)[0];
        const id = hit?.object.userData.muscleId as string | undefined;
        if (id) onSelectRef.current(id);
      };
      renderer.domElement.addEventListener("pointerdown", onPointerDown);
      renderer.domElement.addEventListener("pointerup", onPointerUp);

      const loader = new GLTFLoader();
      loader.load(
        publicAsset(mobileMode ? "muscle-model-mobile.glb" : "muscle-model.glb"),
        (gltf) => {
          if (cancelled) return;
          const model = gltf.scene;
          const meshes: Mesh[] = [];
          model.traverse((object) => {
            if (!(object as Mesh).isMesh) return;
            const mesh = object as Mesh;
            const match = /^muscle__(.+?)__/.exec(mesh.name);
            if (!match) return;
            mesh.userData.muscleId = match[1];
            const isActive = match[1] === selectionRef.current.activeId;
            mesh.material = new THREE.MeshStandardMaterial({
              color: isActive ? selectionRef.current.activeColor : "#8f3f36",
              emissive: isActive ? selectionRef.current.activeColor : "#170504",
              emissiveIntensity: isActive ? 0.42 : 0.08,
              roughness: 0.76,
              metalness: 0,
              transparent: false,
            });
            meshes.push(mesh);
          });

          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const modelScale = 5.45 / Math.max(size.y, 0.001);
          model.scale.setScalar(modelScale);
          model.position.copy(center).multiplyScalar(-modelScale);
          scene.add(model);

          const setCameraView = (nextView: ModelView) => {
            camera.position.set(0, 0.05, nextView === "front" ? 11.4 : -11.4);
            camera.lookAt(0, 0, 0);
            controls.target.set(0, 0, 0);
            controls.update();
            render();
          };
          runtimeRef.current = { camera, controls, meshes, renderer, model, render, setView: setCameraView };
          setCameraView(view);
          setProgress(100);
          setStatus("ready");
        },
        (event) => {
          if (event.total > 0) setProgress(Math.round((event.loaded / event.total) * 100));
        },
        () => setStatus("error"),
      );

      cleanup = () => {
        resizeObserver.disconnect();
        renderer.domElement.removeEventListener("pointerdown", onPointerDown);
        renderer.domElement.removeEventListener("pointerup", onPointerUp);
        controls.removeEventListener("change", onControlsChange);
        controls.dispose();
        runtimeRef.current?.meshes.forEach((mesh) => {
          mesh.geometry.dispose();
          (mesh.material as MeshStandardMaterial).dispose();
        });
        renderer.dispose();
        renderer.domElement.remove();
        runtimeRef.current = null;
      };
    }).catch(() => setStatus("error"));

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [enabled, lang]);

  const copy = lang === "ru" ? {
    eyebrow: "Настоящая геометрия · 35 групп мышц",
    title: "Интерактивная 3D-модель",
    text: "Вращай модель одним пальцем, масштабируй щипком и нажимай на мышцу, чтобы открыть её карточку.",
    start: "Загрузить облегчённую 3D-модель",
    loading: "Загрузка модели",
    error: "Не удалось загрузить WebGL-модель. Двумерная карта выше остаётся доступна.",
    front: "Спереди",
    back: "Сзади",
    selected: "Выбрано",
    source: "Модель адаптирована из открытого проекта Z-Anatomy, лицензия CC BY-SA 4.0.",
  } : {
    eyebrow: "Real geometry · 35 muscle groups",
    title: "Interactive 3D model",
    text: "Drag to rotate, pinch to zoom, and tap a muscle to open its card.",
    start: "Load optimized 3D model",
    loading: "Loading model",
    error: "The WebGL model could not be loaded. The 2D map above remains available.",
    front: "Front",
    back: "Back",
    selected: "Selected",
    source: "Model adapted from the open Z-Anatomy project under CC BY-SA 4.0.",
  };

  return (
    <section className="model3d-section" id="model-3d" aria-labelledby="model3d-title">
      <div className="model3d-copy">
        <span>{copy.eyebrow}</span>
        <h2 id="model3d-title">{copy.title}</h2>
        <p>{copy.text}</p>
        <div className="model3d-selected"><small>{copy.selected}</small><b>{activeName}</b></div>
        <a href="https://github.com/LluisV/Z-Anatomy" target="_blank" rel="noreferrer">{copy.source}</a>
      </div>
      <div className={`model3d-stage state-${status}`}>
        {!enabled && <button className="model3d-start" onClick={() => setEnabled(true)}><span>3D</span>{copy.start}</button>}
        {enabled && <div ref={mountRef} className="model3d-mount" />}
        {status === "loading" && <div className="model3d-status" role="status"><i style={{ "--progress": `${progress}%` } as React.CSSProperties} />{copy.loading} {progress > 0 ? `${progress}%` : "…"}</div>}
        {status === "error" && <div className="model3d-status is-error" role="alert">{copy.error}</div>}
        {status === "ready" && (
          <div className="model3d-toolbar" aria-label={lang === "ru" ? "Ориентация 3D-модели" : "3D model orientation"}>
            <button className={view === "front" ? "active" : ""} onClick={() => setView("front")}>{copy.front}</button>
            <button className={view === "back" ? "active" : ""} onClick={() => setView("back")}>{copy.back}</button>
          </div>
        )}
      </div>
    </section>
  );
}
