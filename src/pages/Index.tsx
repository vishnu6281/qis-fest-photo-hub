import { useState } from 'react';
import { Camera } from '@/components/Camera';
import { PhotoMosaic } from '@/components/PhotoMosaic';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PhotoCounter } from '@/components/PhotoCounter';
import { Link } from 'react-router-dom';

const Index = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const { toast } = useToast();

  const handlePhotoTaken = (photoData: { name: string, photo: File }) => {
    if (photoCount >= 3) {
      toast({
        title: "Error",
        description: "You can only upload 3 photos maximum",
        variant: "destructive"
      });
      return;
    }

    setPhotoCount(prev => prev + 1);
    setShowCamera(false);
    toast({
      title: "Success!",
      description: "Your photo has been added to the mosaic.",
    });

    // Here you would typically upload the photo to your backend
    console.log('Photo taken:', photoData);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <header className="text-center mb-8">
        <div className="flex justify-end mb-4">
          <Link to="/admin">
            <Button variant="outline">Admin Panel</Button>
          </Link>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">QIS FEST 2K25</h1>
        <PhotoCounter count={photoCount} />
      </header>

      <div className="container mx-auto">
        {!showCamera ? (
          <div className="text-center mb-8">
            <Button 
              onClick={() => setShowCamera(true)}
              className="bg-primary hover:bg-primary/90 text-white"
              disabled={photoCount >= 3}
            >
              Add Your Photo ({3 - photoCount} remaining)
            </Button>
          </div>
        ) : (
          <Camera 
            onClose={() => setShowCamera(false)}
            onPhotoTaken={handlePhotoTaken}
            photoCount={photoCount}
          />
        )}

        <PhotoMosaic />
      </div>
    </div>
  );
};

export default Index;