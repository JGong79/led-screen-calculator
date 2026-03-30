'use client';

import { useState } from 'react';

export default function Home() {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState('mm');
  const [result, setResult] = useState<any>(null);

  const convertToMm = (value: number) => {
    if (unit === 'cm') return value * 10;
    if (unit === 'm') return value * 1000;
    return value;
  };

  const calculate = () => {
    const w = convertToMm(Number(width));
    const h = convertToMm(Number(height));

    if (!w || !h) return;

    // ===== 판 계산 =====
    const horizontal = Math.floor(w / 500);
    const verticalRows = Math.floor(h / 500);

    const evenRows = Math.floor(verticalRows / 2);
    const oddRows = verticalRows % 2;

    const count1000x500 = evenRows * Math.floor(horizontal / 2);
    const count500x500 =
      evenRows * (horizontal % 2) + oddRows * horizontal;

    const ver1000 = evenRows;
    const ver500 = oddRows;

    // ===== 해상도 =====
    const widthPx = Math.floor((w / 1000) * 256);
    const heightPx = Math.floor((h / 1000) * 256);

    // ===== 신호선 =====
    const totalPixels = widthPx * heightPx;
    const signal = Math.ceil(totalPixels / 600000);

    // ===== 전기 =====
    const area = (w / 1000) * (h / 1000);
    const powerA = Math.ceil(((area * 800) / 220) * 1.2);

    // ===== 파워콘 =====
    // 4스퀘어 (보통 20A 기준)
    const powercon4 = Math.ceil(powerA / 20);

    // 2.5스퀘어 (보통 15A 기준)
    const powercon25 = Math.ceil(powerA / 15);

    // ===== 대각선 =====
    const diagonal = Math.sqrt(w * w + h * h) / 25.4;

    // ===== 비율 =====
    const gcd = (a: number, b: number): number =>
      b === 0 ? a : gcd(b, a % b);

    const ratioW = Math.round(w);
    const ratioH = Math.round(h);
    const divisor = gcd(ratioW, ratioH);
    const ratio = `${ratioW / divisor}:${ratioH / divisor}`;

    setResult({
      count1000x500,
      count500x500,
      horizontal,
      ver1000,
      ver500,
      signal,
      powerA,
      powercon4,
      powercon25,
      diagonal: diagonal.toFixed(1),
      resolution: `${widthPx} x ${heightPx}`,
      ratio,
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>LED 스크린 계산기</h1>
        
        <p style={styles.subtitle}>
          * 본 계산기는 3.9mm 픽셀 피치 기준으로 계산됩니다
        </p>

        <div style={styles.field}>
          <label>단위</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value)} style={styles.input}>
            <option value="mm">mm</option>
            <option value="cm">cm</option>
            <option value="m">m</option>
          </select>
        </div>

        <div style={styles.field}>
          <label>가로 길이</label>
          <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} style={styles.input} />
        </div>

        <div style={styles.field}>
          <label>세로 길이</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} style={styles.input} />
        </div>

        <button onClick={calculate} style={styles.button}>
          입력
        </button>

        {result && (
          <div style={styles.resultBox}>
            {renderRow("1000x500 판 개수", result.count1000x500)}
            {renderRow("500x500 판 개수", result.count500x500)}
            {renderRow("가로 판 개수", result.horizontal)}
            {renderRow("세로 판 개수 (1000짜리)", result.ver1000)}
            {renderRow("세로 판 개수 (500짜리)", result.ver500)}

            <div style={styles.divider}></div>

            {renderRow("필요 신호선 개수", result.signal)}
            {renderRow("전기 용량 (A)", result.powerA)}
            {renderRow("파워콘 개수 (4SQ)", result.powercon4)}
            {renderRow("파워콘 개수 (2.5SQ)", result.powercon25)}

            <div style={styles.divider}></div>

            {renderRow("대각선 길이 (인치)", result.diagonal)}
            {renderRow("해상도", result.resolution)}
            {renderRow("비율", result.ratio)}
          </div>
        )}
      </div>
    </div>
  );
}

function renderRow(label: string, value: any) {
  return (
    <div style={styles.row}>
      <span>{label}</span>
      <span style={styles.value}>{value}</span>
    </div>
  );
}

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
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#000",
  },
  subtitle: {
    fontSize: "12px",
    color: "#666",
    marginTop: "-10px",
    marginBottom: "16px",
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
    margin: "8px 0 12px 0",
  },
};