import { useState } from 'react';
import { Camera } from '@/components/Camera';
import { PhotoMosaic } from '@/components/PhotoMosaic';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PhotoCounter } from '@/components/PhotoCounter';
import { Link } from 'react-router-dom';

interface Photo {
  id: string;
  url: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
}

const Index = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [bgGradient, setBgGradient] = useState('from-purple-500 to-blue-500');
  const { toast } = useToast();

  const handlePhotoTaken = async (photoData: { name: string; photo: File; id: string }) => {
    if (photos.length >= 3) {
      toast({
        title: "Error",
        description: "You can only upload 3 photos maximum",
        variant: "destructive"
      });
      return;
    }

    const url = URL.createObjectURL(photoData.photo);
    const newPhoto: Photo = {
      id: photoData.id,
      url,
      name: photoData.name,
      position: {
        x: Math.random() * 80,
        y: Math.random() * 80
      }
    };

    setPhotos(prev => [...prev, newPhoto]);
    setShowCamera(false);
    toast({
      title: "Success!",
      description: "Your photo has been added to the mosaic.",
    });
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  return (
    <div className={`min-h-screen bg-gradient-to-r ${bgGradient} transition-colors duration-1000 ease-in-out`}>
      <div className="min-h-screen bg-white/90 backdrop-blur-sm transition-colors duration-1000">
        <div className="container mx-auto p-4">
          <header className="text-center mb-8">
            <div className="flex justify-end mb-4">
              <Link to="/admin">
                <Button variant="outline" className="bg-white/50 backdrop-blur-sm hover:bg-white/70">
                  Admin Panel
                </Button>
              </Link>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">QIS FEST 2K25</h1>
            <PhotoCounter count={photos.length} />
          </header>

          <div className="container mx-auto">
            {!showCamera ? (
              <div className="text-center mb-8">
                <Button 
                  onClick={() => setShowCamera(true)}
                  className="bg-primary/80 hover:bg-primary/90 text-white backdrop-blur-sm"
                  disabled={photos.length >= 3}
                >
                  Add Your Photo ({3 - photos.length} remaining)
                </Button>
              </div>
            ) : (
              <Camera 
                onClose={() => setShowCamera(false)}
                onPhotoTaken={handlePhotoTaken}
                photoCount={photos.length}
              />
            )}

            <PhotoMosaic photos={photos} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;