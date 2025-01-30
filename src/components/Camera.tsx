import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import imageCompression from 'browser-image-compression';

interface CameraProps {
  onClose: () => void;
  onPhotoTaken: () => void;
}

export const Camera = ({ onClose, onPhotoTaken }: CameraProps) => {
  const [name, setName] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
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

  const takePhoto = async () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Flip horizontally if using front camera
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0);
    context.setTransform(1, 0, 0, 1, 0, 0);

    try {
      const blob = await new Promise<Blob>((resolve, reject) => 
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create blob'));
          },
          'image/jpeg',
          0.8
        )
      );

      const compressedFile = await imageCompression(new File([blob], "photo.jpg", {
        type: 'image/jpeg'
      }), {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 800,
        useWebWorker: true
      });

      // Here you would typically upload the photo
      console.log('Photo taken:', { name, photo: compressedFile });
      
      stopCamera();
      onPhotoTaken();
    } catch (err) {
      console.error('Error processing photo:', err);
      alert('Failed to take photo. Please try again.');
    }
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
              className="w-full rounded-lg"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-2">
              <Button onClick={takePhoto} className="flex-1">
                Take Photo
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