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
    return Array.isArray(store.notes)
      ? store.notes.filter((note) => !note.is_archived)
      : [];
  }, [store.notes]);

  const stats = useMemo(() => {
    const notes = Array.isArray(store.notes) ? store.notes : [];

    return {
      total: notes.length,
      pinned: notes.filter((note) => note.is_pinned && !note.is_archived).length,
      archived: notes.filter((note) => note.is_archived).length,
      tags: [...new Set(notes.flatMap((note) => note.tags || []))],
    };
  }, [store.notes]);

  return {
    ...store,
    filteredNotes,
    stats,
  };
};