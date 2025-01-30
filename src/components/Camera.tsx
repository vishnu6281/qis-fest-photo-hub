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
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(console.error);
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

    // Wait for video to be ready
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      console.log('Video not ready yet');
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame
    context.drawImage(video, 0, 0);

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error('Failed to create blob');
        }

        try {
          const compressedFile = await imageCompression(
            new File([blob], "photo.jpg", { type: 'image/jpeg' }),
            {
              maxSizeMB: 0.3,
              maxWidthOrHeight: 800,
              useWebWorker: true
            }
          );

          console.log('Photo taken:', { name, photo: compressedFile });
          stopCamera();
          onPhotoTaken();
        } catch (err) {
          console.error('Error compressing image:', err);
          alert('Failed to process photo. Please try again.');
        }
      }, 'image/jpeg', 0.8);
    } catch (err) {
      console.error('Error taking photo:', err);
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