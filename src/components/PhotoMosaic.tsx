import { useEffect, useState } from 'react';

interface Photo {
  id: string;
  url: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
}

interface PhotoMosaicProps {
  photos: Photo[];
}

export const PhotoMosaic = ({ photos }: PhotoMosaicProps) => {
  const [animatedPhotos, setAnimatedPhotos] = useState<Photo[]>(photos);

  useEffect(() => {
    setAnimatedPhotos(photos);
  }, [photos]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedPhotos(prevPhotos => 
        prevPhotos.map(photo => ({
          ...photo,
          position: {
            x: Math.random() * 80,
            y: Math.random() * 80
          }
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="tree-text text-8xl opacity-20 select-none">
          QIS FEST 2K25
        </div>
      </div>
      
      <div className="relative z-10">
        {animatedPhotos.map((photo) => (
          <div
            key={photo.id}
            className="photo-leaf absolute transition-all duration-[3000ms] ease-in-out hover:scale-110"
            style={{
              width: '60px',
              height: '60px',
              left: `${photo.position.x}%`,
              top: `${photo.position.y}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            <img
              src={photo.url}
              alt={photo.name}
              className="w-full h-full object-cover rounded-full border-2 border-white/50 shadow-lg"
              title={photo.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};