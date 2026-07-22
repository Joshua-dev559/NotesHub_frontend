import { useState } from 'react';
import { Pin, Archive, Trash, Edit, MoreVertical, Copy, Share2 } from 'lucide-react';
import { formatDate, truncateText } from '../../utils/helpers';
import Button from '../common/Button';

const NoteCard = ({ note, onEdit, onDelete, onPin, onArchive, onShare }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(note.content);
    toast.success('Note content copied!');
  };

  return (
    <div
      className="relative p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg cursor-pointer group"
      style={{ backgroundColor: note.color || '#ffffff' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(note)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg pr-6 line-clamp-2">
          {note.title || 'Untitled'}
        </h3>
        {note.is_pinned && (
          <Pin className="w-4 h-4 text-yellow-500 flex-shrink-0" />
        )}
      </div>

      {/* Content */}
      <p className="text-gray-700 text-sm line-clamp-3">
        {truncateText(note.content, 150)}
      </p>

      {/* Tags */}
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

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-gray-500">
          {formatDate(note.updated_at)}
        </span>
      </div>

      {/* Action Buttons - Show on hover */}
      <div
        className={`absolute bottom-2 right-2 flex gap-1 bg-white/90 rounded-lg p-1 shadow-sm transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPin(note.id);
          }}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
          title="Pin/Unpin"
        >
          <Pin className={`w-3.5 h-3.5 ${note.is_pinned ? 'text-yellow-500' : ''}`} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onArchive(note.id);
          }}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
          title="Archive/Unarchive"
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
      </div>
    </div>
  );
};

export default NoteCard;