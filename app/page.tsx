'use client';

import { useState } from 'react';

export default function Home() {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState('mm');
  const [result, setResult] = useState<any>(null);

  // 단위 변환
  const convertToMm = (value: number, unit: string) => {
    if (unit === 'cm') return value * 10;
    if (unit === 'm') return value * 1000;
    return value;
  };

  const calculate = () => {
    const w = convertToMm(Number(width), unit);
    const h = convertToMm(Number(height), unit);

    if (!w || !h) return;

    // 판 계산
    const horizontalCount = Math.floor(w / 500);
    const verticalCount = Math.floor(h / 500);

    const count1000x500 =
      Math.floor(w / 1000) * Math.floor(h / 500);
    const count500x500 =
      horizontalCount * verticalCount - count1000x500;

    const ver1000 = Math.floor(h / 1000);
    const ver500 = verticalCount - ver1000;

    // 대각선 (인치)
    const diagonal =
      Math.sqrt(w * w + h * h) / 25.4;

    // 신호선
    const signal = Math.ceil(horizontalCount / 6);

    // 전력
    const powerA = Math.ceil((w * h) / 220000);
    const powercon4 = Math.ceil(powerA / 20);
    const powercon25 = Math.ceil(powerA / 12);

    // ⭐ 픽셀 계산 (3.9mm 실제 기준)
    const pixelPerMm = 256 / 1000;
    const pixelWidth = Math.round(w * pixelPerMm);
    const pixelHeight = Math.round(h * pixelPerMm);

    // ⭐ 비율 계산 (최대공약수)
    const gcd = (a: number, b: number): number =>
      b === 0 ? a : gcd(b, a % b);

    const ratioGcd = gcd(pixelWidth, pixelHeight);
    const ratioW = pixelWidth / ratioGcd;
    const ratioH = pixelHeight / ratioGcd;

    setResult({
      count1000x500,
      count500x500,
      horizontalCount,
      ver1000,
      ver500,
      diagonal: diagonal.toFixed(1),
      signal,
      powerA,
      powercon4,
      powercon25,
      pixelWidth,
      pixelHeight,
      resolution: `${pixelWidth} x ${pixelHeight}`,
      ratio: `${ratioW}:${ratioH}`,
    });
  };

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🖩 LED 스크린 계산기</h1>

        {/* 단위 선택 */}
        <div style={styles.field}>
          <label>단위 선택</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            style={styles.input}
          >
            <option value="mm">mm</option>
            <option value="cm">cm</option>
            <option value="m">m</option>
          </select>
        </div>

        {/* 가로 */}
        <div style={styles.field}>
          <label>가로 길이</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* 세로 */}
        <div style={styles.field}>
          <label>세로 길이</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            style={styles.input}
          />
        </div>

        <button onClick={calculate} style={styles.button}>
          입력
        </button>

        {/* 결과 */}
        {result && (
          <div style={styles.resultBox}>

            {/* 1번 그룹 */}
            {renderRow("1000x500 판 개수", result.count1000x500)}
            {renderRow("500x500 판 개수", result.count500x500)}
            {renderRow("가로 판 개수", result.horizontalCount)}
            {renderRow("세로 판 개수 (1000짜리)", result.ver1000)}
            {renderRow("세로 판 개수 (500짜리)", result.ver500)}

            <div style={styles.divider}></div>

            {/* 2번 그룹 */}
            {renderRow("필요 신호선 개수", result.signal)}
            {renderRow("전기 용량 (A)", result.powerA)}
            {renderRow("파워콘 개수 (4스퀘어)", result.powercon4)}
            {renderRow("파워콘 개수 (2.5스퀘어)", result.powercon25)}

            <div style={styles.divider}></div>

            {/* 3번 그룹 */}
            {renderRow("대각선 길이 (인치)", result.diagonal)}
            {renderRow("해상도", result.resolution)}
            {renderRow("비율", result.ratio)}

          </div>
)}
      </div>
    </main>
  );
}

// 결과 줄
function renderRow(label: string, value: any) {
  return (
    <div style={styles.row}>
      <span>{label}</span>
      <span style={styles.value}>{value}</span>
    </div>
  );
}

// 스타일
const styles: any = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "40px",
    background: "#f5f5f5",
    minHeight: "100vh",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#000",
  },
  field: {
    marginBottom: "12px",
    display: "flex",
    flexDirection: "column",
    color: "#000",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginTop: "4px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    marginTop: "10px",
    cursor: "pointer",
  },
  resultBox: {
    marginTop: "20px",
    borderTop: "1px solid #ddd",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
    color: "#000",
  },
  value: {
    fontWeight: "bold",
    color: "#2563eb",
  },
  divider: {
    height: "12px",
    borderBottom: "2px solid #e5e7eb",
    margin: "8px 0 12px 0"
  },
};