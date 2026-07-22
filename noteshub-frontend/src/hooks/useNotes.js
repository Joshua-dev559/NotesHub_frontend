import { useEffect } from 'react';
import useNoteStore from '../store/noteStore';
import { useAuth } from '../context/AuthContext';

export const useNotes = () => {
  const { isAuthenticated } = useAuth();
  const {
    notes,
    loading,
    error,
    searchQuery,
    filters,
    sortBy,
    sortOrder,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive,
    deleteMultiple,
    setSearchQuery,
    setFilter,
    setSortBy,
    setSortOrder,
    getFilteredNotes,
    getStats,
    reset,
  } = useNoteStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    }
    return () => {
      reset();
    };
  }, [isAuthenticated]);

  const filteredNotes = getFilteredNotes();
  const stats = getStats();

  return {
    // State
    notes,
    loading,
    error,
    filteredNotes,
    searchQuery,
    filters,
    sortBy,
    sortOrder,
    stats,

    // Actions
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive,
    deleteMultiple,
    setSearchQuery,
    setFilter,
    setSortBy,
    setSortOrder,
    reset,
  };
};
