"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Upload,
  Image as ImageIcon,
  Type,
  Download,
  Settings,
  Layers,
} from "lucide-react";
import watermark from "watermarkjs";
import ColorPicker from "./color-picker";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function ImageEditorComponent() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading indicator
  }

  const [image, setImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("add-watermark");
  const [watermarkOpacity, setWatermarkOpacity] = useState(80);
  const [watermarkTextOpacity, setWatermarkTextOpacity] = useState(25);
  const [watermarkText, setWatermarkText] = useState("prendas by felicity");
  const [watermarkedImage, setWatermarkedImage] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(175);
  const [logoDarkMode, setLogoDarkMode] = useState<boolean>(false);
  const [textColor, setTextColor] = useState("rgba(255, 255, 255, 0.7)"); // Default color

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (color: {
    r: number;
    g: number;
    b: number;
    a?: number;
  }) => {
    // Convert RGB to RGBA string for text color
    const rgbaColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${
      color.a || 1
    })`;
    setTextColor(rgbaColor);
  };

  const handleAddWatermark = () => {
    if (image) {
      watermark([logoDarkMode ? "/logo-dark.png" : "/logo-light.png", image])
        .image((logoCanvas: any, imgCanvas: any) => {
          const context = imgCanvas.getContext("2d");
          const logoX = 10; // X position of the logo
          const logoY = 10; // Y position of the logo
          const buffer = 100; // Buffer distance around the logo
          context.save();

          context.globalAlpha = watermarkOpacity / 100; // Apply opacity

          // Draw the logo, resizing it by specifying width and height
          context.drawImage(logoCanvas, logoX, logoY, logoSize, logoSize); // Adjust position and size

          // Define the gap between watermarks
          const xGap = 250; // Horizontal gap between watermarks
          const yGap = 200; // Vertical gap between watermarks

          // Calculate positions dynamically based on watermark size and gaps
          const positions: { x: number; y: number }[] = [];
          for (let x = 30; x < imgCanvas.width; x += xGap) {
            for (let y = imgCanvas.height - 3; y > 0; y -= yGap) {
              // Exclude positions that are too close to the logo
              if (
                x < logoX - buffer ||
                x > logoX + logoSize + buffer ||
                y < logoY - buffer ||
                y > logoY + logoSize + buffer
              ) {
                positions.push({ x, y });
              }
            }
          }

          positions.forEach((pos) => {
            context.save(); // Save the current state before rotation

            context.globalAlpha = watermarkTextOpacity / 100; // Apply the same opacity
            context.font = "30px Montserrat"; // Set the font and size for the text
            context.fillStyle = textColor; // Text color (white with some transparency)

            // Translate to the position and rotate
            context.translate(pos.x, pos.y);
            context.rotate((-40 * Math.PI) / 180); // Rotate -40 degrees

            // Draw the text
            context.fillText(watermarkText, 0, 0); // Position is now relative to the translation and rotation

            context.restore(); // Restore to the original state
          });

          context.restore();
          return imgCanvas;
        })
        .then((img: HTMLImageElement) => {
          setWatermarkedImage(img.src);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Editor de Imágenes</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Vista Previa de la Imagen</CardTitle>
              <CardDescription>Sube o edita tu imagen aquí</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                {watermarkedImage ? (
                  <img
                    src={watermarkedImage}
                    alt="Con marca de agua"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : image ? (
                  <img
                    src={image}
                    alt="Subida"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <label
                      htmlFor="image-upload"
                      className="mt-2 cursor-pointer text-blue-500 hover:text-blue-600"
                    >
                      Sube una imagen
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                )}
              </div>
              {watermarkedImage && (
                <Card className="mt-8">
                  <CardContent className="pt-6">
                    <Button
                      className="w-full"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = watermarkedImage;
                        link.download = "imagen-con-marca-de-agua.png";
                        link.click();
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" /> Descargar Imagen
                      Editada
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opciones de Edición</CardTitle>
              <CardDescription>Personaliza tu imagen</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="add-watermark">
                    <Type className="mr-2 h-4 w-4" />
                    Marca de Agua
                  </TabsTrigger>
                  <TabsTrigger disabled value="remove-bg">
                    <Layers className="mr-2 h-4 w-4" />
                    Eliminar Fondo
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="remove-bg" className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Elimina el fondo de tu imagen.
                  </p>
                  <Button className="w-full">
                    <Upload className="mr-2 h-4 w-4" /> Eliminar Fondo
                  </Button>
                </TabsContent>
                <TabsContent value="add-watermark" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={logoDarkMode}
                      onClick={() => setLogoDarkMode(!logoDarkMode)}
                      id="logo-dark-mode"
                    />
                    <Label htmlFor="logo-dark-mode">
                      Logo {logoDarkMode ? "Oscuro" : "Claro"}
                    </Label>
                  </div>
                  <Input
                    placeholder="Texto de la marca de agua"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                  />
                  <div>
                    <Label className="mb-2 block">Color del Texto</Label>
                    <ColorPicker onChange={handleColorChange} />
                  </div>
                  <div>
                    <Label className="mb-2 block">
                      Tamaño del Logo: {logoSize}
                    </Label>
                    <Slider
                      max={1000}
                      step={1}
                      value={[logoSize]}
                      onValueChange={(e) => setLogoSize(e[0])}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">
                      Opacidad del Texto: {watermarkTextOpacity}%
                    </Label>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[watermarkTextOpacity]}
                      onValueChange={(value) =>
                        setWatermarkTextOpacity(value[0])
                      }
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">
                      Opacidad del Logo: {watermarkOpacity}%
                    </Label>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[watermarkOpacity]}
                      onValueChange={(value) => setWatermarkOpacity(value[0])}
                    />
                  </div>
                  <Button onClick={handleAddWatermark} className="w-full">
                    <Settings className="mr-2 h-4 w-4" /> Aplicar Marca de Agua
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
