import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useNoteStore from '../store/noteStore';
import NoteForm from '../components/notes/NoteForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

const NoteEditor = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { saving, createNote, updateNote } = useNoteStore();
  const [initialData, setInitialData] = useState(null);
  const [fetched, setFetched] = useState(isNew); // true immediately for new notes

  useEffect(() => {
    if (isNew) return; // already set fetched=true via useState initializer

    let cancelled = false;

    const load = async () => {
      let list = useNoteStore.getState().notes;
      if (!list.length) {
        try {
          await useNoteStore.getState().fetchNotes();
          list = useNoteStore.getState().notes;
        } catch {
          if (!cancelled) navigate('/');
          return;
        }
      }
      if (cancelled) return;
      const note = list.find((n) => n.id === id);
      if (note) {
        setInitialData(note);
        setFetched(true);
      } else {
        navigate('/');
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id, isNew, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const sanitize = (data) => ({
    title: data.title,
    content: data.content,
    color: data.color || '#ffffff',
    tags: data.tags || [],
    is_pinned: data.is_pinned ?? false,
    is_archived: data.is_archived ?? false,
  });

  const handleSubmit = async (data) => {
    try {
      if (isNew) {
        await createNote(sanitize(data));
      } else {
        await updateNote(id, sanitize(data));
      }

      navigate('/');
    } catch {
      // Error toast handled in store
    }
  };

  if (!fetched) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Notes
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">
            {isNew ? 'Create Note' : 'Edit Note'}
          </h2>

          <NoteForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/')}
            loading={saving}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;