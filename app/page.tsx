import dynamic from 'next/dynamic';

const ImageEditorComponent = dynamic(
  () => import('@/components/image-editor').then((mod) => mod.ImageEditorComponent),
  { ssr: false }
);

export default function Home() {
  return <ImageEditorComponent />;
}
