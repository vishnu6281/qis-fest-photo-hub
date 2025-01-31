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

const colors = [
  'from-purple-500 to-blue-500',
  'from-blue-500 to-green-500',
  'from-green-500 to-yellow-500',
  'from-yellow-500 to-red-500',
  'from-red-500 to-pink-500',
  'from-pink-500 to-indigo-500',
  'from-indigo-500 to-purple-500',
];

export const PhotoMosaic = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [bgGradient, setBgGradient] = useState(colors[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgGradient(colors[Math.floor(Math.random() * colors.length)]);
      
      setPhotos(prevPhotos => 
        prevPhotos.map(photo => ({
          ...photo,
          position: {
            x: Math.random() * 80,
            y: Math.random() * 80
          }
        }))
      );
    }, 5000); // Changed to 5 seconds for smoother transitions

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
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="photo-leaf absolute transition-all duration-1000 ease-in-out"
            style={{
              width: '60px',
              height: '60px',
              left: `${photo.position.x}%`,
              top: `${photo.position.y}%`,
            }}
          >
            <img
              src={photo.url}
              alt={photo.name}
              className="w-full h-full object-cover rounded-full"
              title={photo.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};