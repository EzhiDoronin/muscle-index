"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Cell = string | null;
type Point = [number, number];
type Piece = { cells: Point[]; color: string; row: number; col: number };

const ROWS = 16;
const COLS = 10;
const COLORS = ["pink", "cyan", "yellow", "purple", "lime"];
const SHAPES: Point[][] = [
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  [[0, 1], [1, 0], [1, 1], [1, 2]],
  [[0, 1], [0, 2], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [1, 1], [1, 2]],
  [[0, 0], [1, 0], [1, 1], [1, 2]],
  [[0, 2], [1, 0], [1, 1], [1, 2]],
];

const emptyBoard = () => Array<Cell>(ROWS * COLS).fill(null);

function nextPiece(): Piece {
  const cells = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  return {
    cells: cells.map(([r, c]) => [r, c]),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    row: 0,
    col: Math.floor((COLS - (Math.max(...cells.map(([, c]) => c)) + 1)) / 2),
  };
}

function valid(board: Cell[], piece: Piece) {
  return piece.cells.every(([r, c]) => {
    const nr = piece.row + r, nc = piece.col + c;
    return nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !board[nr * COLS + nc];
  });
}

function rotateCells(cells: Point[]): Point[] {
  const rotated = cells.map(([r, c]) => [c, -r] as Point);
  const minR = Math.min(...rotated.map(([r]) => r));
  const minC = Math.min(...rotated.map(([, c]) => c));
  return rotated.map(([r, c]) => [r - minR, c - minC]);
}

export default function Home() {
  const [board, setBoard] = useState<Cell[]>(emptyBoard);
  const [piece, setPiece] = useState<Piece | null>(null);
  const [preview, setPreview] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [lines, setLines] = useState(0);
  const [message, setMessage] = useState("ГОТОВЬСЯ!");
  const [gameOver, setGameOver] = useState(false);
  const stateRef = useRef({ board, piece, score, lines, gameOver });

  useEffect(() => {
    const first = nextPiece();
    setPiece(first);
    setPreview(nextPiece());
    setBest(Number(localStorage.getItem("pixel-drop-best") || 0));
  }, []);

  useEffect(() => {
    stateRef.current = { board, piece, score, lines, gameOver };
  }, [board, piece, score, lines, gameOver]);

  const speed = Math.max(160, 720 - Math.floor(lines / 5) * 70);

  const lockPiece = useCallback((locked: Piece) => {
    const s = stateRef.current;
    const next = [...s.board];
    locked.cells.forEach(([r, c]) => { next[(locked.row + r) * COLS + locked.col + c] = locked.color; });

    const kept: Cell[][] = [];
    let cleared = 0;
    for (let r = 0; r < ROWS; r++) {
      const row = next.slice(r * COLS, (r + 1) * COLS);
      if (row.every(Boolean)) cleared++;
      else kept.push(row);
    }
    while (kept.length < ROWS) kept.unshift(Array<Cell>(COLS).fill(null));
    const clean = kept.flat();
    const gained = 20 + [0, 100, 300, 600, 1000][cleared];
    const newScore = s.score + gained;
    const incoming = preview ?? nextPiece();
    const spawned = { ...incoming, row: 0 };

    setBoard(clean);
    setScore(newScore);
    setLines(s.lines + cleared);
    setMessage(cleared ? `${cleared > 1 ? "МЕГА!" : "ЛИНИЯ!"} +${gained}` : "+20");
    setPreview(nextPiece());

    if (newScore > best) {
      setBest(newScore);
      localStorage.setItem("pixel-drop-best", String(newScore));
    }
    if (!valid(clean, spawned)) {
      setPiece(null);
      setGameOver(true);
      setMessage("ИГРА ОКОНЧЕНА");
    } else {
      setPiece(spawned);
    }
  }, [best, preview]);

  const move = useCallback((dr: number, dc: number) => {
    const s = stateRef.current;
    if (!s.piece || s.gameOver) return false;
    const moved = { ...s.piece, row: s.piece.row + dr, col: s.piece.col + dc };
    if (valid(s.board, moved)) {
      setPiece(moved);
      return true;
    }
    if (dr === 1 && dc === 0) lockPiece(s.piece);
    return false;
  }, [lockPiece]);

  const rotate = useCallback(() => {
    const s = stateRef.current;
    if (!s.piece || s.gameOver) return;
    const cells = rotateCells(s.piece.cells);
    for (const kick of [0, -1, 1, -2, 2]) {
      const turned = { ...s.piece, cells, col: s.piece.col + kick };
      if (valid(s.board, turned)) {
        setPiece(turned);
        setMessage("ПОВОРОТ!");
        return;
      }
    }
  }, []);

  const hardDrop = useCallback(() => {
    const s = stateRef.current;
    if (!s.piece || s.gameOver) return;
    let dropped = { ...s.piece };
    let distance = 0;
    while (valid(s.board, { ...dropped, row: dropped.row + 1 })) {
      dropped = { ...dropped, row: dropped.row + 1 };
      distance++;
    }
    setScore(v => v + distance * 2);
    stateRef.current.score += distance * 2;
    lockPiece(dropped);
  }, [lockPiece]);

  useEffect(() => {
    if (gameOver || !piece) return;
    const timer = window.setInterval(() => move(1, 0), speed);
    return () => window.clearInterval(timer);
  }, [gameOver, piece, speed, move]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " ", "z", "Z"].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowLeft") move(0, -1);
      if (e.key === "ArrowRight") move(0, 1);
      if (e.key === "ArrowDown") move(1, 0);
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "z") rotate();
      if (e.key === " ") hardDrop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, rotate, hardDrop]);

  function reset() {
    const first = nextPiece();
    setBoard(emptyBoard());
    setPiece(first);
    setPreview(nextPiece());
    setScore(0);
    setLines(0);
    setGameOver(false);
    setMessage("ПОЕХАЛИ!");
  }

  const display = useMemo(() => {
    const result = [...board];
    if (piece) piece.cells.forEach(([r, c]) => {
      const nr = piece.row + r, nc = piece.col + c;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) result[nr * COLS + nc] = piece.color;
    });
    return result;
  }, [board, piece]);

  return (
    <main className="game-shell">
      <div className="sticker sticker-one">DROP!</div>
      <div className="sticker sticker-two">★</div>
      <header>
        <div className="eyebrow"><span /> АРКАДНЫЙ РЕЖИМ <span /></div>
        <h1>PIXEL<span>DROP!</span></h1>
        <p className="tagline">ДВИГАЙ • КРУТИ • ВЗРЫВАЙ</p>
      </header>

      <section className="score-row" aria-label="Счёт">
        <div className="score-box"><small>СЧЁТ</small><strong>{String(score).padStart(6, "0")}</strong></div>
        <div className="combo-box"><small>ЛИНИИ</small><strong>{lines}</strong></div>
        <div className="score-box"><small>РЕКОРД</small><strong>{String(best).padStart(6, "0")}</strong></div>
      </section>

      <div className="play-layout">
        <section className="cabinet">
          <div className="cabinet-top"><i /><span>{message}</span><i /></div>
          <div className="board falling-board" role="grid" aria-label="Игровое поле 10 на 16">
            {display.map((cell, i) => <div key={i} className={`cell ${cell ? `filled ${cell}` : ""}`} />)}
          </div>
        </section>
        <aside className="next-box">
          <span>ДАЛЬШЕ</span>
          <div className="next-grid">
            {preview?.cells.map(([r, c], i) => (
              <i key={i} className={preview.color} style={{ gridRow: r + 1, gridColumn: c + 1 }} />
            ))}
          </div>
          <small>УРОВЕНЬ</small>
          <strong>{Math.floor(lines / 5) + 1}</strong>
        </aside>
      </div>

      <section className="controls" aria-label="Управление">
        <button onPointerDown={() => move(0, -1)} aria-label="Влево">◀</button>
        <button className="rotate-btn" onPointerDown={rotate} aria-label="Повернуть">↻</button>
        <button onPointerDown={() => move(0, 1)} aria-label="Вправо">▶</button>
        <button className="down-btn" onPointerDown={() => move(1, 0)} aria-label="Вниз">▼</button>
        <button className="drop-btn" onPointerDown={hardDrop}>БРОСИТЬ!</button>
      </section>

      <button className="new-game" onClick={reset}>↻ НОВАЯ ИГРА</button>
      <p className="hint">← → двигать · ↑ крутить · ↓ ускорить · пробел бросить</p>

      {gameOver && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-card">
            <span>GAME OVER</span>
            <h2>КРУТАЯ ИГРА!</h2>
            <p>Твой счёт: <strong>{score}</strong></p>
            <button onClick={reset}>ЕЩЁ РАЗ!</button>
          </div>
        </div>
      )}
    </main>
  );
}
