import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/client';
import toast from 'react-hot-toast';

const useNoteStore = create(
  persist(
    (set, get) => ({
      notes: [],
      loading: false,
      error: null,
      searchQuery: '',
      filters: {
        isArchived: false,
        isPinned: null,
        tags: [],
      },
      sortBy: 'updated_at',
      sortOrder: 'desc',

      // Fetch all notes
      fetchNotes: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.get('/notes/');
          set({ notes: response.data, loading: false });
        } catch (error) {
          set({ 
            error: error.response?.data?.detail || 'Failed to fetch notes', 
            loading: false 
          });
          throw error;
        }
      },

      // Create new note
      createNote: async (noteData) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/notes/', noteData);
          set((state) => ({
            notes: [response.data, ...state.notes],
            loading: false,
          }));
          toast.success('Note created successfully!');
          return response.data;
        } catch (error) {
          set({ 
            error: error.response?.data?.detail || 'Failed to create note', 
            loading: false 
          });
          toast.error('Failed to create note');
          throw error;
        }
      },

      // Update note
      updateNote: async (id, noteData) => {
        set({ loading: true, error: null });
        try {
          const response = await api.put(`/notes/${id}/`, noteData);
          set((state) => ({
            notes: state.notes.map((note) =>
              note.id === id ? response.data : note
            ),
            loading: false,
          }));
          toast.success('Note updated successfully!');
          return response.data;
        } catch (error) {
          set({ 
            error: error.response?.data?.detail || 'Failed to update note', 
            loading: false 
          });
          toast.error('Failed to update note');
          throw error;
        }
      },

      // Delete note
      deleteNote: async (id) => {
        try {
          await api.delete(`/notes/${id}/`);
          set((state) => ({
            notes: state.notes.filter((note) => note.id !== id),
          }));
          toast.success('Note deleted successfully!');
        } catch (error) {
          toast.error('Failed to delete note');
          throw error;
        }
      },

      // Toggle pin
      togglePin: async (id) => {
        try {
          const response = await api.post(`/notes/${id}/toggle_pin/`);
          set((state) => ({
            notes: state.notes.map((note) =>
              note.id === id ? response.data : note
            ),
          }));
          return response.data;
        } catch (error) {
          toast.error('Failed to toggle pin');
          throw error;
        }
      },

      // Toggle archive
      toggleArchive: async (id) => {
        try {
          const response = await api.post(`/notes/${id}/toggle_archive/`);
          set((state) => ({
            notes: state.notes.map((note) =>
              note.id === id ? response.data : note
            ),
          }));
          return response.data;
        } catch (error) {
          toast.error('Failed to toggle archive');
          throw error;
        }
      },

      // Bulk operations
      deleteMultiple: async (ids) => {
        try {
          await Promise.all(ids.map(id => api.delete(`/notes/${id}/`)));
          set((state) => ({
            notes: state.notes.filter((note) => !ids.includes(note.id)),
          }));
          toast.success(`${ids.length} notes deleted`);
        } catch (error) {
          toast.error('Failed to delete notes');
          throw error;
        }
      },

      // Search and filter
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value },
      })),

      setSortBy: (sortBy) => set({ sortBy }),
      
      setSortOrder: (sortOrder) => set({ sortOrder }),

      // Get filtered and sorted notes
      getFilteredNotes: () => {
        const { notes, searchQuery, filters, sortBy, sortOrder } = get();
        
        let filtered = [...notes];

        // Search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (note) =>
              note.title.toLowerCase().includes(query) ||
              note.content.toLowerCase().includes(query) ||
              note.tags?.some((tag) => tag.toLowerCase().includes(query))
          );
        }

        // Filters
        if (filters.isArchived !== null) {
          filtered = filtered.filter((note) => note.is_archived === filters.isArchived);
        }

        if (filters.isPinned !== null) {
          filtered = filtered.filter((note) => note.is_pinned === filters.isPinned);
        }

        if (filters.tags.length > 0) {
          filtered = filtered.filter((note) =>
            filters.tags.some((tag) => note.tags?.includes(tag))
          );
        }

        // Sort
        filtered.sort((a, b) => {
          let comparison = 0;
          if (sortBy === 'title') {
            comparison = a.title.localeCompare(b.title);
          } else if (sortBy === 'created_at') {
            comparison = new Date(a.created_at) - new Date(b.created_at);
          } else {
            comparison = new Date(a.updated_at) - new Date(b.updated_at);
          }
          return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
      },

      // Get statistics
      getStats: () => {
        const { notes } = get();
        return {
          total: notes.length,
          archived: notes.filter((n) => n.is_archived).length,
          pinned: notes.filter((n) => n.is_pinned && !n.is_archived).length,
          tags: [...new Set(notes.flatMap((n) => n.tags || []))],
        };
      },

      // Reset store
      reset: () => {
        set({
          notes: [],
          loading: false,
          error: null,
          searchQuery: '',
          filters: {
            isArchived: false,
            isPinned: null,
            tags: [],
          },
          sortBy: 'updated_at',
          sortOrder: 'desc',
        });
      },
    }),
    {
      name: 'notes-storage',
      partialize: (state) => ({
        filters: state.filters,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
);

export default useNoteStore;