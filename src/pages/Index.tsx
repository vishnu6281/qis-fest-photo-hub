import { useState } from 'react';
import { Camera } from '@/components/Camera';
import { PhotoMosaic } from '@/components/PhotoMosaic';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PhotoCounter } from '@/components/PhotoCounter';
import { Link } from 'react-router-dom';

const Index = () => {
  const [showCamera, setShowCamera] = useState(false);
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background p-4">
      <header className="text-center mb-8">
        <div className="flex justify-end mb-4">
          <Link to="/admin">
            <Button variant="outline">Admin Panel</Button>
          </Link>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">QIS FEST 2K25</h1>
        <PhotoCounter />
      </header>

      <div className="container mx-auto">
        {!showCamera ? (
          <div className="text-center mb-8">
            <Button 
              onClick={() => setShowCamera(true)}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Add Your Photo
            </Button>
          </div>
        ) : (
          <Camera 
            onClose={() => setShowCamera(false)}
            onPhotoTaken={() => {
              setShowCamera(false);
              toast({
                title: "Success!",
                description: "Your photo has been added to the mosaic.",
              });
            }}
          />
        )}

        <PhotoMosaic />
      </div>
    </div>
  );
};

export default Index;