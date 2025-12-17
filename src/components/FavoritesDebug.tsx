import React from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const FavoritesDebug: React.FC<{ eventId: string }> = ({ eventId }) => {
  const { user } = useAuth();
  const { toggleFavorite, isFavorite, favorites, loading } = useFavorites();
  const favorited = isFavorite(eventId);

  console.log('FavoritesDebug render:', {
    user,
    eventId,
    favorited,
    favorites,
    loading
  });

  const handleToggle = async () => {
    console.log('FavoritesDebug: Toggle clicked', { eventId, user });
    try {
      await toggleFavorite(eventId);
      console.log('FavoritesDebug: Toggle completed');
    } catch (error) {
      console.error('FavoritesDebug: Toggle failed', error);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-100 mb-4">
      <h3 className="font-bold mb-2">Favorites Debug Component</h3>
      <div className="space-y-2 text-sm">
        <div>Event ID: {eventId}</div>
        <div>User: {user ? 'Authenticated' : 'Not authenticated'}</div>
        <div>Favorited: {favorited ? 'Yes' : 'No'}</div>
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>All Favorites: {favorites.join(', ')}</div>
      </div>
      <Button 
        onClick={handleToggle} 
        className="mt-2"
        disabled={loading}
      >
        {favorited ? 'Remove from Favorites' : 'Add to Favorites'}
      </Button>
    </div>
  );
};

export default FavoritesDebug;
