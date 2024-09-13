'use client'
import { ImageEditorComponent } from "@/components/image-editor";


export default function Home() {
  if (typeof window !== "undefined") {
    // Client-side-only code
    return <ImageEditorComponent />;
  }
  return <div>Loading...</div>
}
