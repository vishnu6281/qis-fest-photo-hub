import { useState } from 'react';
import { Card } from '@/components/ui/card';

interface Photo {
  id: string;
  url: string;
  name: string;
}

export const AdminPanel = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const handleDelete = (id: string) => {
    setPhotos(photos.filter(photo => photo.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {photos.map(photo => (
          <Card key={photo.id} className="p-4">
            <img
              src={photo.url}
              alt={photo.name}
              className="w-full h-48 object-cover rounded-lg mb-2"
            />
            <p className="font-medium">{photo.name}</p>
            <button
              onClick={() => handleDelete(photo.id)}
              className="mt-2 text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};