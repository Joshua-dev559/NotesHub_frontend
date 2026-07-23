import { useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import useNoteStore from '../store/noteStore';

export const useNotes = () => {
  const { isAuthenticated } = useAuth();

  // Select only the values needed from the store
  const notes = useNoteStore((state) => state.notes);
  const loading = useNoteStore((state) => state.loading);
  const saving = useNoteStore((state) => state.saving);
  const error = useNoteStore((state) => state.error);

  const fetchNotes = useNoteStore((state) => state.fetchNotes);
  const createNote = useNoteStore((state) => state.createNote);
  const updateNote = useNoteStore((state) => state.updateNote);
  const deleteNote = useNoteStore((state) => state.deleteNote);
  const togglePin = useNoteStore((state) => state.togglePin);
  const toggleArchive = useNoteStore((state) => state.toggleArchive);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated, fetchNotes]);

  const filteredNotes = useMemo(() => {
    return Array.isArray(notes)
      ? notes.filter((note) => !note.is_archived)
      : [];
  }, [notes]);

  const stats = useMemo(() => {
    const noteList = Array.isArray(notes) ? notes : [];

    return {
      total: noteList.length,
      pinned: noteList.filter(
        (note) => note.is_pinned && !note.is_archived
      ).length,
      archived: noteList.filter((note) => note.is_archived).length,
      tags: [...new Set(noteList.flatMap((note) => note.tags || []))],
    };
  }, [notes]);

  return {
    notes,
    loading,
    saving,
    error,
    filteredNotes,
    stats,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive,
  };
};

export default useNotes;