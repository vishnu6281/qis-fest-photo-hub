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
  const [bgGradient, setBgGradient] = useState('from-purple-500 to-blue-500');
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

    console.log('Photo taken:', photoData);
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
            <PhotoCounter count={photoCount} />
          </header>

          <div className="container mx-auto">
            {!showCamera ? (
              <div className="text-center mb-8">
                <Button 
                  onClick={() => setShowCamera(true)}
                  className="bg-primary/80 hover:bg-primary/90 text-white backdrop-blur-sm"
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
      </div>
    </div>
  );
};

export default Index;