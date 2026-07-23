import { useState } from 'react';
import { Pin, Archive, Trash, Edit, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate, truncateText } from '../../utils/helpers';

const NoteCard = ({ note, isArchiveView, onEdit, onDelete, onPin, onArchive }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(note.content);
    toast.success('Note copied!');
  };

  return (
    <div
      className="relative p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg cursor-pointer group"
      style={{ backgroundColor: note.color || '#ffffff' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !isArchiveView && onEdit(note)}
    >
      {/* Archived badge */}
      {isArchiveView && (
        <span className="inline-flex items-center gap-1 mb-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full">
          <Archive className="w-3 h-3" /> Archived
        </span>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg pr-6 line-clamp-2">
          {note.title || 'Untitled'}
        </h3>
        {note.is_pinned && !isArchiveView && (
          <Pin className="w-4 h-4 text-yellow-500 flex-shrink-0" />
        )}
      </div>

      <p
        className="text-gray-700 text-sm line-clamp-3"
        onDoubleClick={handleCopy}
        title="Double-click to copy"
      >
        {truncateText(note.content?.replace(/<[^>]*>/g, '') || '', 150)}
      </p>

      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {note.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-xs bg-black/5 rounded-full"
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs bg-black/5 rounded-full">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-gray-500">
          {formatDate(note.updated_at)}
        </span>
      </div>

      {/* Action Buttons */}
      <div
        className={`absolute bottom-2 right-2 flex gap-1 bg-white/90 rounded-lg p-1 shadow-sm transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {isArchiveView ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchive(note.id);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors font-medium"
              title="Restore to Notes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restore
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="p-1.5 rounded hover:bg-red-100 transition-colors"
              title="Delete permanently"
            >
              <Trash className="w-3.5 h-3.5 text-red-500" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPin(note.id);
              }}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Pin/Unpin"
            >
              <Pin
                className={`w-3.5 h-3.5 ${
                  note.is_pinned ? 'text-yellow-500' : ''
                }`}
              />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchive(note.id);
              }}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Archive"
            >
              <Archive className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
              }}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors"
              title="Edit"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="p-1.5 rounded hover:bg-red-100 transition-colors"
              title="Delete"
            >
              <Trash className="w-3.5 h-3.5 text-red-500" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NoteCard;