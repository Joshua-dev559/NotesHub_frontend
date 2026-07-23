import { useState } from 'react';
import { Search, Grid, List, X } from 'lucide-react';
import NoteCard from './NoteCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { SORT_OPTIONS } from '../../utils/constants';

const NoteList = ({
  notes,
  loading,
  searchQuery,
  isArchiveView,
  isPinnedFilter,
  sortBy,
  sortOrder,
  onSearch,
  onPinnedFilter,
  onSort,
  onEdit,
  onDelete,
  onPin,
  onArchive,
}) => {
  const [viewMode, setViewMode] = useState('grid');

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={isArchiveView ? 'Search archives...' : 'Search notes...'}
            className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {searchQuery && (
            <button onClick={() => onSearch('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2 items-center">
          {/* Pinned filter — notes tab only */}
          {!isArchiveView && (
            <select
              value={isPinnedFilter === null ? 'all' : isPinnedFilter ? 'pinned' : 'unpinned'}
              onChange={(e) => {
                const v = e.target.value;
                onPinnedFilter(v === 'all' ? null : v === 'pinned');
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All</option>
              <option value="pinned">Pinned</option>
              <option value="unpinned">Unpinned</option>
            </select>
          )}

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => onSort(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={() => onSort(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>

          {/* View toggle */}
          <div className="flex rounded-md overflow-hidden border border-gray-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {notes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {isArchiveView ? 'No archived notes' : 'No notes found'}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {searchQuery
              ? 'Try adjusting your search'
              : isArchiveView
              ? 'Notes you archive will appear here'
              : 'Create your first note'}
          </p>
        </div>
      )}

      {/* Notes Grid */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-2'
      }>
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            isArchiveView={isArchiveView}
            onEdit={onEdit}
            onDelete={onDelete}
            onPin={onPin}
            onArchive={onArchive}
          />
        ))}
      </div>
    </div>
  );
};

export default NoteList;
