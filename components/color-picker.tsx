import React, { useState } from "react";
import { SketchPicker, ColorResult } from "react-color";

const ColorPicker = ({ onChange }: { onChange: (color: { r: number; g: number; b: number; a?: number }) => void }) => {
  const [color, setColor] = useState<ColorResult['rgb']>({ r: 255, g: 255, b: 255, a: 0.7 });

  const handleChangeComplete = (color: ColorResult) => {
    setColor(color.rgb);
    onChange(color.rgb);
  };

  return (
    <div>
      <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
      <div style={{ marginTop: "10px" }}>
        <span>Selected Color:</span>
        <div
          style={{
            width: "50px",
            height: "50px",
            backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${
              color.a || 1
            })`,
            border: "1px solid #ccc",
            marginTop: "5px",
          }}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
