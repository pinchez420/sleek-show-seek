# TODO: Remove Favorites Functionality





## Frontend Changes
- [x] Remove favorites hook (src/hooks/useFavorites.tsx)
- [x] Update EventCard.tsx - remove Heart button and favorites logic
- [x] Update EventCardFixed.tsx - remove Heart button and favorites logic  
- [x] Update EventCardRobust.tsx - remove Heart button and favorites logic
- [x] Update Header.tsx - remove "My Favorites" menu items and navigation
- [x] Update TrendingSection.tsx - remove favorites fallback, use only orders-based trending
- [x] Remove FavoritesDebug.tsx component
- [x] Update App.tsx - remove /favorites route
- [x] Clean up imports across all affected files
- [x] Update Auth.tsx - remove favorites reference
- [x] Update supabase types.ts - remove favorites table


## Database Changes
- [x] Create migration to drop favorites table
- [x] Create migration file (supabase/migrations/20251217010000_drop_favorites_table.sql)

## Testing
- [x] Verify no remaining references to favorites in codebase
- [x] Check that EventCard components no longer have Heart buttons
- [x] Ensure Header component no longer has favorites navigation
- [x] Verify trending section works without favorites fallback
- [x] Confirm Auth page no longer references favorites
- [x] Check supabase types no longer include favorites table
