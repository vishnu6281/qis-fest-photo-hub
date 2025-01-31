import { useState } from 'react';
import { Camera } from '@/components/Camera';
import { PhotoMosaic } from '@/components/PhotoMosaic';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PhotoCounter } from '@/components/PhotoCounter';
import { KeyRound, Instagram } from 'lucide-react';

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

  return (
    <div className={`min-h-screen bg-gradient-to-r ${bgGradient} transition-colors duration-1000 ease-in-out`}>
      <div className="min-h-screen bg-white/90 backdrop-blur-sm transition-colors duration-1000">
        <div className="container mx-auto p-4">
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">QIS FEST 2K25</h1>
            <PhotoCounter count={photos.length} />
          </header>

          <div className="container mx-auto">
            {!showCamera ? (
              <div className="text-center mb-8">
                <Button 
                  onClick={() => setShowCamera(true)}
                  className="bg-primary/80 hover:bg-primary/90 text-white backdrop-blur-sm transition-all duration-300"
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

            <footer className="mt-8 flex flex-col items-center gap-4">
              <Button 
                variant="outline" 
                className="bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300"
              >
                <KeyRound className="w-4 h-4 mr-2" />
                Admin
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>©2K25 By VK CREATIONS</span>
                <a 
                  href="https://instagram.com/thereelsstudioo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-pink-500 hover:text-pink-600 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  @thereelsstudioo
                </a>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;