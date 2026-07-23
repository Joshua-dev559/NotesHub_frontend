import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, User, Archive, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../hooks/useNotes';
import NoteList from '../components/notes/NoteList';
import Button from '../components/common/Button';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { notes, loading, stats, deleteNote, togglePin, toggleArchive } = useNotes();

  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'archives'
  const [showStats, setShowStats] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isPinnedFilter, setIsPinnedFilter] = useState(null);

  const displayNotes = (() => {
    let result = Array.isArray(notes) ? [...notes] : [];

    // Tab filter
    result = result.filter((n) => activeTab === 'archives' ? n.is_archived : !n.is_archived);

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.content?.toLowerCase().includes(q) ||
          n.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Pinned filter (only relevant on notes tab)
    if (activeTab === 'notes' && isPinnedFilter !== null) {
      result = result.filter((n) => n.is_pinned === isPinnedFilter);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'title') cmp = a.title.localeCompare(b.title);
      else if (sortBy === 'created_at') cmp = new Date(a.created_at) - new Date(b.created_at);
      else cmp = new Date(a.updated_at) - new Date(b.updated_at);
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">NotesHub</h1>
              <span className="text-sm text-gray-500">{stats.total} notes</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowStats(!showStats)} className="text-gray-600 hover:text-gray-900">
                <User className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">{user?.username}</span>
              <Button variant="secondary" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 pb-0">
            <button
              onClick={() => { setActiveTab('notes'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              Notes
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-100 rounded-full">
                {stats.total - stats.archived}
              </span>
            </button>
            <button
              onClick={() => { setActiveTab('archives'); setSearchQuery(''); setIsPinnedFilter(null); }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'archives'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Archive className="w-4 h-4" />
              Archives
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-100 rounded-full">
                {stats.archived}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Panel */}
      {showStats && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-8 flex-wrap">
              <div><span className="text-sm text-gray-500">Total</span><p className="text-2xl font-bold">{stats.total}</p></div>
              <div><span className="text-sm text-gray-500">Pinned</span><p className="text-2xl font-bold">{stats.pinned}</p></div>
              <div><span className="text-sm text-gray-500">Archived</span><p className="text-2xl font-bold">{stats.archived}</p></div>
              <div><span className="text-sm text-gray-500">Tags</span><p className="text-2xl font-bold">{stats.tags.length}</p></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NoteList
          notes={displayNotes}
          loading={loading}
          searchQuery={searchQuery}
          isArchiveView={activeTab === 'archives'}
          isPinnedFilter={isPinnedFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSearch={setSearchQuery}
          onPinnedFilter={setIsPinnedFilter}
          onSort={(value, order) => { setSortBy(value); if (order) setSortOrder(order); }}
          onEdit={(note) => navigate(`/note/${note.id}`)}
          onDelete={deleteNote}
          onPin={togglePin}
          onArchive={toggleArchive}
        />
      </main>

      {/* FAB — only show on notes tab */}
      {activeTab === 'notes' && (
        <button
          onClick={() => navigate('/note/new')}
          className="fixed bottom-8 right-8 p-4 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Dashboard;
