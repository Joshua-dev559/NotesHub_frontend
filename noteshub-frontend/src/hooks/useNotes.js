import { useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import useNoteStore from '../store/noteStore';

export const useNotes = () => {
  const { isAuthenticated } = useAuth();
  const store = useNoteStore();

  useEffect(() => {
    if (isAuthenticated) {
      store.fetchNotes();
    }
  }, [isAuthenticated]);

  const filteredNotes = useMemo(() => {
    return Array.isArray(store.notes) ? store.notes.filter((n) => !n.is_archived) : [];
  }, [store.notes]);

  const stats = useMemo(() => {
    const notes = Array.isArray(store.notes) ? store.notes : [];
    return {
      total: notes.length,
      pinned: notes.filter((n) => n.is_pinned && !n.is_archived).length,
      archived: notes.filter((n) => n.is_archived).length,
      tags: [...new Set(notes.flatMap((n) => n.tags || []))],
    };
  }, [store.notes]);

  return { ...store, filteredNotes, stats };
};
