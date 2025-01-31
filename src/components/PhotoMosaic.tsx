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
  'bg-purple-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-pink-500',
  'bg-indigo-500',
];

export const PhotoMosaic = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [bgColor, setBgColor] = useState(colors[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgColor(colors[Math.floor(Math.random() * colors.length)]);
      
      setPhotos(prevPhotos => 
        prevPhotos.map(photo => ({
          ...photo,
          position: {
            x: Math.random() * 80,
            y: Math.random() * 80
          }
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`tree-text text-8xl opacity-20 select-none transition-colors duration-500 ${bgColor}`}>
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