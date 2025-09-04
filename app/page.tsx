import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function Home() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [unit, setUnit] = useState("mm");

  const convertToInches = (value: number): number => {
    if (unit === "mm") return value / 25.4;
    if (unit === "cm") return value / 2.54;
    if (unit === "m") return value / 0.0254;
    return value;
  };

  const getRatio = () => {
    if (!width || !height) return "";
    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b);
    };
    const ratioGCD = gcd(width, height);
    return `${width / ratioGCD} : ${height / ratioGCD}`;
  };

  const getDiagonal = () => {
    const widthInch = convertToInches(width);
    const heightInch = convertToInches(height);
    const diagonal = Math.sqrt(Math.pow(widthInch, 2) + Math.pow(heightInch, 2));
    return diagonal.toFixed(2);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <div className="flex items-end gap-2">
        <div>
          <Label>가로 사이즈</Label>
          <Input
            type="number"
            value={width || ""}
            onChange={(e) => setWidth(parseFloat(e.target.value))}
            className="w-[200px]"
          />
        </div>
        <div>
          <Label>세로 사이즈</Label>
          <Input
            type="number"
            value={height || ""}
            onChange={(e) => setHeight(parseFloat(e.target.value))}
            className="w-[200px]"
          />
        </div>
        <div>
          <Label>단위</Label>
          <ToggleGroup
            type="single"
            value={unit}
            onValueChange={(value) => value && setUnit(value)}
            className="mt-2"
          >
            <ToggleGroupItem value="mm">mm</ToggleGroupItem>
            <ToggleGroupItem value="cm">cm</ToggleGroupItem>
            <ToggleGroupItem value="m">m</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {width > 0 && height > 0 && (
        <div className="text-center">
          <p className="text-xl font-semibold">비율: {getRatio()}</p>
          <p className="text-lg">대각선 길이: {getDiagonal()} inch</p>
          <div className="mt-6 border border-gray-400 relative bg-white" style={{
            width: 300,
            height: 300 * (height / width),
            maxHeight: 200,
            maxWidth: 400
          }}>
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-600">
              {width}:{height} ({getRatio()})
            </div>
          </div>
        </div>
      )}
    </main>
  );
}