import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../hooks/useNotes';
import NoteList from '../components/notes/NoteList';
import Button from '../components/common/Button';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    filteredNotes,
    loading,
    searchQuery,
    filters,
    sortBy,
    sortOrder,
    setSearchQuery,
    setFilter,
    setSortBy,
    setSortOrder,
    deleteNote,
    togglePin,
    toggleArchive,
    stats,
  } = useNotes();

  const [showStats, setShowStats] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">NotesHub</h1>
              <span className="text-sm text-gray-500">
                {stats.total} notes
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Stats Button */}
              <button
                onClick={() => setShowStats(!showStats)}
                className="text-gray-600 hover:text-gray-900"
              >
                <User className="w-5 h-5" />
              </button>

              <span className="text-sm text-gray-600">
                {user?.username}
              </span>

              <Button
                variant="secondary"
                size="sm"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Panel */}
      {showStats && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-8 flex-wrap">
              <div>
                <span className="text-sm text-gray-500">Total</span>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Pinned</span>
                <p className="text-2xl font-bold">{stats.pinned}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Archived</span>
                <p className="text-2xl font-bold">{stats.archived}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Tags</span>
                <p className="text-2xl font-bold">{stats.tags.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NoteList
          notes={filteredNotes}
          loading={loading}
          searchQuery={searchQuery}
          filters={filters}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSearch={setSearchQuery}
          onFilter={setFilter}
          onSort={(value, order) => {
            setSortBy(value);
            if (order) setSortOrder(order);
          }}
          onEdit={(note) => navigate(`/note/${note.id}`)}
          onDelete={deleteNote}
          onPin={togglePin}
          onArchive={toggleArchive}
        />
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/note/new')}
        className="fixed bottom-8 right-8 p-4 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Dashboard;