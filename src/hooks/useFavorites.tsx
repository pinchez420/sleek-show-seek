import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('favorites')
      .select('event_id')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error fetching favorites:', error);
    } else {
      setFavorites(data.map(f => f.event_id));
    }
    setLoading(false);
  };



  const toggleFavorite = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorite events",
        variant: "destructive"
      });
      return;
    }

    const isFavorited = favorites.includes(eventId);

    if (isFavorited) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', eventId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to remove from favorites",
          variant: "destructive"
        });
      } else {
        setFavorites(prev => prev.filter(id => id !== eventId));
        toast({
          title: "Removed from favorites",
          description: "Event removed from your favorites"
        });
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, event_id: eventId });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add to favorites",
          variant: "destructive"
        });
      } else {
        setFavorites(prev => [...prev, eventId]);
        toast({
          title: "Added to favorites",
          description: "Event saved to your favorites"
        });
      }
    }
  };

  const isFavorite = (eventId: string) => favorites.includes(eventId);

  return { favorites, loading, toggleFavorite, isFavorite };
};
