import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import NoteForm from '../components/notes/NoteForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes, createNote, updateNote, loading } = useNotes();
  const [initialData, setInitialData] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      const note = notes.find((n) => n.id === parseInt(id));
      if (note) {
        setInitialData(note);
      } else {
        // Note not found, redirect to dashboard
        navigate('/');
      }
    }
  }, [id, notes, navigate]);

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (id === 'new') {
        await createNote(data);
      } else {
        await updateNote(parseInt(id), data);
      }
      navigate('/');
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
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
            {id === 'new' ? 'Create Note' : 'Edit Note'}
          </h2>

          <NoteForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={formLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;