import { create } from 'zustand';

interface FilterState {
  // Filter states
  searchQuery: string;
  selectedFolder: string | null;
  selectedTags: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
  lastSearchUpdate: number;  // Track the last time search was updated
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedFolder: (folder: string | null) => void;
  setSelectedTags: (tags: string[]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  toggleTag: (tag: string) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
  // New batched update methods
  updateFilters: (updates: Partial<{
    searchQuery: string;
    selectedFolder: string | null;
    selectedTags: string[];
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    page: number;
  }>) => void;
}

// Minimum time between search updates to reduce API calls (in milliseconds)
const SEARCH_THROTTLE = 500;

export const useFilterStore = create<FilterState>((set, get) => ({
  // Initial state
  searchQuery: '',
  selectedFolder: null,
  selectedTags: [],
  sortBy: 'updated_at',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
  lastSearchUpdate: 0,
  
  // Actions
  setSearchQuery: (query) => {
    const now = Date.now();
    const { lastSearchUpdate } = get();
    
    // Only update if enough time has passed since the last update or query is empty
    if (query === '' || now - lastSearchUpdate > SEARCH_THROTTLE) {
      set({ 
        searchQuery: query, 
        page: 1,
        lastSearchUpdate: now 
      });
    } else {
      // Schedule an update after the throttle time
      setTimeout(() => {
        // Check if the current query is still the same
        const currentQuery = get().searchQuery;
        if (currentQuery !== query) {
          set({ 
            searchQuery: query, 
            page: 1,
            lastSearchUpdate: Date.now() 
          });
        }
      }, SEARCH_THROTTLE);
    }
  },
  setSelectedFolder: (folder) => set({ selectedFolder: folder, page: 1 }),
  setSelectedTags: (tags) => set({ selectedTags: tags, page: 1 }),
  addTag: (tag) => set((state) => {
    // Only add if not already present
    if (!state.selectedTags.includes(tag)) {
      return { selectedTags: [...state.selectedTags, tag], page: 1 };
    }
    return state;
  }),
  removeTag: (tag) => set((state) => ({ 
    selectedTags: state.selectedTags.filter(t => t !== tag),
    page: 1
  })),
  toggleTag: (tag) => set((state) => {
    if (state.selectedTags.includes(tag)) {
      return { 
        selectedTags: state.selectedTags.filter(t => t !== tag),
        page: 1 
      };
    } else {
      return { 
        selectedTags: [...state.selectedTags, tag],
        page: 1 
      };
    }
  }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setPage: (page) => set({ page }),
  resetFilters: () => set({ 
    searchQuery: '', 
    selectedFolder: null, 
    selectedTags: [],
    page: 1 
  }),
  // New method to batch update multiple filters at once
  updateFilters: (updates) => {
    // Always reset to page 1 when filters change
    const withPageReset = { ...updates, page: 1 };
    
    // If search query is included, add timestamp
    if ('searchQuery' in updates) {
      const now = Date.now();
      const lastUpdate = get().lastSearchUpdate;
      
      // Only update if enough time has passed since the last update or query is empty
      if (updates.searchQuery === '' || now - lastUpdate > SEARCH_THROTTLE) {
        set({ 
          ...withPageReset, 
          lastSearchUpdate: now 
        });
      } else {
        // Schedule an update after the throttle time
        setTimeout(() => {
          // Only update if another update hasn't happened since
          if (get().lastSearchUpdate === lastUpdate) {
            set({ 
              ...withPageReset, 
              lastSearchUpdate: Date.now() 
            });
          }
        }, SEARCH_THROTTLE);
      }
    } else {
      set(withPageReset);
    }
  }
})); 