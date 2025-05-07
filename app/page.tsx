'use client';
import { useState } from "react";

export default function Home() {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const w = parseInt(width);
  const h = parseInt(height);

  const calc = (value: number | string) => (submitted ? value : "-");

  const panels1000 = Math.floor(w / 500) * Math.floor(h / 1000);
  const panels500 = Math.floor(w / 500) * Math.floor((h % 1000) / 500);
  const panelW = Math.floor(w / 500);
  const panelH1000 = Math.floor(h / 1000);
  const panelH500 = Math.floor((h % 1000) / 500);
  const totalPixels = ((w / 500) * 128) * ((h / 500) * 128);
  const signalLines = Math.ceil(totalPixels / 650000);
  const amp = Math.ceil((w / 1000) * (h / 1000) * 1000 / 220);
  const power4sq = Math.ceil((panels1000 + panels500) / 10);
  const power2_5sq = Math.ceil((panels1000 + panels500) / 6);

  // 📐 대각선 계산
  const diagonalMM = Math.sqrt(w * w + h * h);
  const diagonalInch = (diagonalMM / 25.4).toFixed(1);

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-black">💡 LED 스크린 계산기</h1>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-black">LED 총 가로 길이 (mm)</label>
            <input
              type="number"
              step={50}
              className="w-full border rounded p-2 text-black"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="예: 5000"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-black">LED 총 세로 길이 (mm)</label>
            <input
              type="number"
              step={50}
              className="w-full border rounded p-2 text-black"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="예: 3000"
            />
          </div>

          <button
            onClick={() => setSubmitted(true)}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            입력
          </button>
        </div>

        {submitted && (
          <div className="space-y-2 border-t pt-4">
            <Result label="1000x500 판 개수" value={calc(panels1000)} />
            <Result label="500x500 판 개수" value={calc(panels500)} />
            <Result label="가로 판 개수" value={calc(panelW)} />
            <Result label="세로 판 개수 (1000짜리)" value={calc(panelH1000)} />
            <Result label="세로 판 개수 (500짜리)" value={calc(panelH500)} />
            <Result label="대각선 길이 (인치)" value={calc(diagonalInch)} />
            <Result label="필요 신호선 개수" value={calc(signalLines)} />
            <Result label="전기 용량 (A)" value={calc(amp)} />
            <Result label="파워콘 개수 (4스퀘어)" value={calc(power4sq)} />
            <Result label="파워콘 개수 (2.5스퀘어)" value={calc(power2_5sq)} />
          </div>
        )}
      </div>
    </main>
  );
}

function Result({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex justify-between border-b border-gray-300 py-1 text-sm text-black">
      <span>{label}</span>
      <span className="font-semibold text-black">{value}</span>
    </div>
  );
}