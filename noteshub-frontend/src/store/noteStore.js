import { create } from 'zustand';
import api from '../api/client';
import toast from 'react-hot-toast';

const useNoteStore = create((set, get) => ({
  notes: [],
  loading: false,
  saving: false,
  error: null,

  fetchNotes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/notes/');
      const notes = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.results)
        ? response.data.results
        : [];
      set({ notes, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.detail || 'Failed to fetch notes', loading: false });
      throw error;
    }
  },

  createNote: async (noteData) => {
    set({ saving: true });
    try {
      const response = await api.post('/notes/', noteData);
      set((state) => ({ notes: [response.data, ...state.notes], saving: false }));
      toast.success('Note created successfully!');
      return response.data;
    } catch (error) {
      set({ saving: false });
      toast.error('Failed to create note');
      throw error;
    }
  },

  updateNote: async (id, noteData) => {
    set({ saving: true });
    try {
      const response = await api.put(`/notes/${id}/`, noteData);
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? response.data : n)),
        saving: false,
      }));
      toast.success('Note updated successfully!');
      return response.data;
    } catch (error) {
      set({ saving: false });
      toast.error('Failed to update note');
      throw error;
    }
  },

  deleteNote: async (id) => {
    try {
      await api.delete(`/notes/${id}/`);
      set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
      toast.success('Note deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete note');
      throw error;
    }
  },

  togglePin: async (id) => {
    try {
      const response = await api.post(`/notes/${id}/toggle_pin/`);
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? response.data : n)),
      }));
    } catch (error) {
      toast.error('Failed to toggle pin');
      throw error;
    }
  },

  toggleArchive: async (id) => {
    try {
      const response = await api.post(`/notes/${id}/archive/`);
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? response.data : n)),
      }));
    } catch (error) {
      toast.error('Failed to toggle archive');
      throw error;
    }
  },

  deleteMultiple: async (ids) => {
    try {
      await Promise.all(ids.map((id) => api.delete(`/notes/${id}/`)));
      set((state) => ({ notes: state.notes.filter((n) => !ids.includes(n.id)) }));
      toast.success(`${ids.length} notes deleted`);
    } catch (error) {
      toast.error('Failed to delete notes');
      throw error;
    }
  },
}));

export default useNoteStore;
