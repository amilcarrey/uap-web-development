import React, { createContext, useContext, useState } from 'react';

export type PhotoItem = {
  id: string;
  uri: string;
  latitude: number | null;
  longitude: number | null;
  timestamp: number;
};

type PhotosContextType = {
  photos: PhotoItem[];
  addPhoto: (p: Omit<PhotoItem, 'id'>) => void;
  clearAll: () => void;
};

const PhotosContext = createContext<PhotosContextType | null>(null);

export const PhotosProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  const addPhoto: PhotosContextType['addPhoto'] = (p) => {
    setPhotos((prev) => [{ id: Math.random().toString(36).slice(2), ...p }, ...prev]);
  };

  const clearAll = () => setPhotos([]);

  return (
    <PhotosContext.Provider value={{ photos, addPhoto, clearAll }}>
      {children}
    </PhotosContext.Provider>
  );
};

export const usePhotos = () => {
  const ctx = useContext(PhotosContext);
  if (!ctx) throw new Error('usePhotos must be used within PhotosProvider');
  return ctx;
};
