"use client";

import { useEffect, useMemo, useState } from "react";

type Cell = string | null;
type Shape = { id: string; color: string; cells: [number, number][] };

const SIZE = 8;
const COLORS = ["pink", "cyan", "yellow", "purple", "lime"];
const SHAPES: [number, number][][] = [
  [[0, 0]],
  [[0, 0], [0, 1]],
  [[0, 0], [1, 0]],
  [[0, 0], [0, 1], [0, 2]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  [[0, 0], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [2, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 1]],
];

const emptyBoard = () => Array.from({ length: SIZE * SIZE }, () => null as Cell);

function makeShapes(): Shape[] {
  return Array.from({ length: 3 }, (_, i) => ({
    id: `${Date.now()}-${i}-${Math.random()}`,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    cells: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  }));
}

function fits(board: Cell[], shape: Shape, row: number, col: number) {
  return shape.cells.every(([r, c]) => {
    const nr = row + r, nc = col + c;
    return nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && !board[nr * SIZE + nc];
  });
}

function canPlace(board: Cell[], shape: Shape) {
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    if (fits(board, shape, r, c)) return true;
  }
  return false;
}

export default function Home() {
  const [board, setBoard] = useState<Cell[]>(emptyBoard);
  const [pieces, setPieces] = useState<Shape[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [combo, setCombo] = useState(0);
  const [message, setMessage] = useState("ВЫБЕРИ ФИГУРУ");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setPieces(makeShapes());
    setBest(Number(localStorage.getItem("pixel-pop-best") || 0));
  }, []);

  const active = useMemo(() => pieces.find(p => p.id === selected), [pieces, selected]);

  function reset() {
    setBoard(emptyBoard());
    setPieces(makeShapes());
    setSelected(null);
    setScore(0);
    setCombo(0);
    setGameOver(false);
    setMessage("НОВАЯ ИГРА!");
  }

  function place(row: number, col: number) {
    if (!active || !fits(board, active, row, col)) {
      if (active) setMessage("ТУТ НЕ ВЛЕЗАЕТ");
      return;
    }

    const next = [...board];
    active.cells.forEach(([r, c]) => { next[(row + r) * SIZE + col + c] = active.color; });

    const fullRows = Array.from({ length: SIZE }, (_, r) => r)
      .filter(r => Array.from({ length: SIZE }, (_, c) => next[r * SIZE + c]).every(Boolean));
    const fullCols = Array.from({ length: SIZE }, (_, c) => c)
      .filter(c => Array.from({ length: SIZE }, (_, r) => next[r * SIZE + c]).every(Boolean));
    const cleared = new Set<number>();
    fullRows.forEach(r => { for (let c = 0; c < SIZE; c++) cleared.add(r * SIZE + c); });
    fullCols.forEach(c => { for (let r = 0; r < SIZE; r++) cleared.add(r * SIZE + c); });
    cleared.forEach(i => { next[i] = null; });

    const lines = fullRows.length + fullCols.length;
    const nextCombo = lines ? combo + 1 : 0;
    const gained = active.cells.length * 10 + lines * 120 * Math.max(1, nextCombo);
    const nextScore = score + gained;
    const remaining = pieces.filter(p => p.id !== active.id);
    const refill = remaining.length ? remaining : makeShapes();

    setBoard(next);
    setPieces(refill);
    setSelected(null);
    setScore(nextScore);
    setCombo(nextCombo);
    setMessage(lines ? `${lines > 1 ? "МЕГА!" : "БАМ!"} +${gained}` : `+${gained} ОЧКОВ`);

    if (nextScore > best) {
      setBest(nextScore);
      localStorage.setItem("pixel-pop-best", String(nextScore));
    }
    if (!refill.some(p => canPlace(next, p))) {
      setGameOver(true);
      setMessage("ИГРА ОКОНЧЕНА");
    }
  }

  return (
    <main className="game-shell">
      <div className="sticker sticker-one">WOW!</div>
      <div className="sticker sticker-two">★</div>

      <header>
        <div className="eyebrow"><span /> АРКАДНЫЙ РЕЖИМ <span /></div>
        <h1>PIXEL<span>POP!</span></h1>
        <p className="tagline">СОБИРАЙ • ВЗРЫВАЙ • ПОБЕЖДАЙ</p>
      </header>

      <section className="score-row" aria-label="Счёт">
        <div className="score-box"><small>СЧЁТ</small><strong>{String(score).padStart(6, "0")}</strong></div>
        <div className="combo-box"><small>КОМБО</small><strong>×{combo}</strong></div>
        <div className="score-box"><small>РЕКОРД</small><strong>{String(best).padStart(6, "0")}</strong></div>
      </section>

      <section className="cabinet">
        <div className="cabinet-top"><i /><span>{message}</span><i /></div>
        <div className="board" role="grid" aria-label="Игровое поле 8 на 8">
          {board.map((cell, i) => {
            const r = Math.floor(i / SIZE), c = i % SIZE;
            const preview = active && fits(board, active, r, c) &&
              active.cells.some(([sr, sc]) => i === (r + sr) * SIZE + c + sc);
            return (
              <button
                key={i}
                className={`cell ${cell ? `filled ${cell}` : ""} ${preview ? `preview ${active?.color}` : ""}`}
                onClick={() => place(r, c)}
                aria-label={`Клетка ${r + 1}, ${c + 1}`}
              />
            );
          })}
        </div>
        <div className="scanline" />
      </section>

      <section className="tray" aria-label="Фигуры">
        <div className="tray-label">ВЫБЕРИ БЛОК</div>
        <div className="pieces">
          {pieces.map(piece => {
            const width = Math.max(...piece.cells.map(c => c[1])) + 1;
            const height = Math.max(...piece.cells.map(c => c[0])) + 1;
            return (
              <button
                key={piece.id}
                className={`piece ${selected === piece.id ? "selected" : ""}`}
                onClick={() => { setSelected(piece.id); setMessage("ТЕПЕРЬ НА ПОЛЕ!"); }}
                aria-label="Выбрать фигуру"
              >
                <span className="mini-grid" style={{ gridTemplateColumns: `repeat(${width}, 1fr)`, gridTemplateRows: `repeat(${height}, 1fr)` }}>
                  {Array.from({ length: width * height }, (_, i) => {
                    const on = piece.cells.some(([r, c]) => i === r * width + c);
                    return <i key={i} className={on ? piece.color : "blank"} />;
                  })}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <button className="new-game" onClick={reset}>↻ НОВАЯ ИГРА</button>
      <p className="hint">Выбери фигуру → нажми на поле → собери линию</p>

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
