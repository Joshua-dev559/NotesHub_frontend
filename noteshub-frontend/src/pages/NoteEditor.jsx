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

  const { notes, loading, saving, fetchNotes, createNote, updateNote } = useNoteStore();
  const [initialData, setInitialData] = useState(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (isNew) {
      setFetched(true);
      return;
    }

    const load = async () => {
      let list = notes;

      // If store is empty, fetch first
      if (!list.length) {
        try {
          await fetchNotes();
          list = useNoteStore.getState().notes;
        } catch {
          navigate('/');
          return;
        }
      }

      const note = list.find((n) => n.id === id);
      if (note) {
        setInitialData(note);
        setFetched(true);
      } else {
        navigate('/');
      }
    };

    load();
  }, [id]);

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
      // toast handled in store
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
