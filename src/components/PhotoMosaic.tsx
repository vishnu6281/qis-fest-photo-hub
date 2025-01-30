import { useEffect, useState } from 'react';

interface Photo {
  id: string;
  url: string;
  name: string;
}

export const PhotoMosaic = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  return (
    <div className="relative min-h-[600px] w-full">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="tree-text text-8xl opacity-20 select-none">
          QIS FEST 2K25
        </div>
      </div>
      
      <div className="relative z-10">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="photo-leaf absolute"
            style={{
              width: '60px', // Reduced size
              height: '60px', // Reduced size
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 80}%`,
              zIndex: index,
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