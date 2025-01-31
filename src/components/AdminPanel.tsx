import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface Photo {
  id: string;
  url: string;
  name: string;
}

interface AdminPanelProps {
  photos: Photo[];
  onDeletePhoto: (id: string) => void;
}

export const AdminPanel = ({ photos, onDeletePhoto }: AdminPanelProps) => {
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    onDeletePhoto(id);
    toast({
      title: "Photo deleted",
      description: "The photo has been successfully removed.",
    });
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
            <Button
              onClick={() => handleDelete(photo.id)}
              variant="destructive"
              className="mt-2 w-full"
            >
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};