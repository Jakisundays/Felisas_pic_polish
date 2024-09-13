"use client";
import dynamic from "next/dynamic";

const ImageEditorComponent = dynamic(
  () =>
    import("@/components/image-editor").then((mod) => mod.ImageEditorComponent),
  { ssr: false, suspense: true, loading: () => <p>Loading...</p> }
);

export default function Home() {
  return <ImageEditorComponent />;
}
