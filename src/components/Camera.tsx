import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import imageCompression from 'browser-image-compression';

interface CameraProps {
  onClose: () => void;
  onPhotoTaken: (photoData: { name: string, photo: File, id: string }) => void;
  photoCount: number;
}

export const Camera = ({ onClose, onPhotoTaken, photoCount }: CameraProps) => {
  const [name, setName] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Failed to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  useEffect(() => {
    if (stream) {
      startCamera();
    }
  }, [facingMode]);

  const takePhoto = async () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    if (photoCount >= 3) {
      alert('You can only upload 3 photos maximum');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    if (facingMode === 'user') {
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0);
    } else {
      context.drawImage(video, 0, 0);
    }

    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert('Failed to capture photo. Please try again.');
        return;
      }

      try {
        const compressedFile = await imageCompression(
          new File([blob], "photo.jpg", { type: 'image/jpeg' }),
          {
            maxSizeMB: 0.05, // 50KB
            maxWidthOrHeight: 400,
            useWebWorker: true,
            initialQuality: 0.5
          }
        );

        onPhotoTaken({ 
          name, 
          photo: compressedFile,
          id: Date.now().toString()
        });
        stopCamera();
      } catch (err) {
        console.error('Error compressing image:', err);
        alert('Failed to process photo. Please try again.');
      }
    }, 'image/jpeg', 0.7);
  };

  return (
    <Card className="p-4 max-w-md mx-auto">
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
        />
        
        {!stream ? (
          <Button onClick={startCamera} className="w-full">
            Start Camera
          </Button>
        ) : (
          <div className="space-y-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
              className="w-full rounded-lg"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex items-center justify-between mb-4">
              <span>Switch Camera</span>
              <Switch onCheckedChange={switchCamera} />
            </div>
            <div className="flex gap-2">
              <Button onClick={takePhoto} className="flex-1" disabled={photoCount >= 3}>
                Take Photo ({3 - photoCount} remaining)
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
