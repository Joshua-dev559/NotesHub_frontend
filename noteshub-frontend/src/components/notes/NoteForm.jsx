import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Plus, Bold, Italic, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { NOTE_COLORS } from '../../utils/constants';

const ToolbarButton = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    title={title}
    className={`p-1.5 rounded transition-colors ${
      active ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

const NoteForm = ({ initialData = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    color: '#ffffff',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [activeFormats, setActiveFormats] = useState({});
  const editorRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        color: initialData.color || '#ffffff',
        tags: initialData.tags || [],
      });
      // Set HTML content into editor
      if (editorRef.current) {
        editorRef.current.innerHTML = initialData.content || '';
      }
    }
  }, [initialData]);

  const updateActiveFormats = useCallback(() => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
      justifyLeft: document.queryCommandState('justifyLeft'),
      justifyCenter: document.queryCommandState('justifyCenter'),
      justifyRight: document.queryCommandState('justifyRight'),
    });
  }, []);

  const exec = useCallback((command) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    if (!editor.innerHTML.trim()) {
      document.execCommand('insertHTML', false, '<p><br></p>');
    }
    if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
      const tag = command === 'insertUnorderedList' ? 'ul' : 'ol';
      const isActive = document.queryCommandState(command);
      if (isActive) {
        document.execCommand(command, false, null);
      } else {
        const before = editor.innerHTML;
        document.execCommand(command, false, null);
        if (editor.innerHTML === before) {
          const sel = window.getSelection();
          const range = sel?.getRangeAt(0);
          if (range) {
            const list = document.createElement(tag);
            const li = document.createElement('li');
            li.innerHTML = '<br>';
            list.appendChild(li);
            range.deleteContents();
            range.insertNode(list);
            const newRange = document.createRange();
            newRange.setStart(li, 0);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
          }
        }
      }
    } else {
      document.execCommand(command, false, null);
    }
    editor.focus();
    updateActiveFormats();
  }, [updateActiveFormats]);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((f) => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = editorRef.current?.innerHTML || '';
    onSubmit({ ...formData, content });
  };

  const toolbarGroups = [
    [
      { cmd: 'bold', icon: <Bold className="w-4 h-4" />, title: 'Bold' },
      { cmd: 'italic', icon: <Italic className="w-4 h-4" />, title: 'Italic' },
    ],
    [
      { cmd: 'insertUnorderedList', icon: <List className="w-4 h-4" />, title: 'Bullet List' },
      { cmd: 'insertOrderedList', icon: <ListOrdered className="w-4 h-4" />, title: 'Numbered List' },
    ],
    [
      { cmd: 'justifyLeft', icon: <AlignLeft className="w-4 h-4" />, title: 'Align Left' },
      { cmd: 'justifyCenter', icon: <AlignCenter className="w-4 h-4" />, title: 'Align Center' },
      { cmd: 'justifyRight', icon: <AlignRight className="w-4 h-4" />, title: 'Align Right' },
    ],
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
        placeholder="Note title"
        className="text-lg font-semibold"
      />

      {/* Rich Text Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
          {/* Toolbar */}
          <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 border-b border-gray-200 flex-wrap">
            {toolbarGroups.map((group, gi) => (
              <div key={gi} className="flex items-center gap-0.5">
                {gi > 0 && <div className="w-px h-5 bg-gray-300 mx-1" />}
                {group.map(({ cmd, icon, title }) => (
                  <ToolbarButton
                    key={cmd}
                    onClick={() => exec(cmd)}
                    active={!!activeFormats[cmd]}
                    title={title}
                  >
                    {icon}
                  </ToolbarButton>
                ))}
              </div>
            ))}
          </div>

          {/* Editable area */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onKeyUp={updateActiveFormats}
            onMouseUp={updateActiveFormats}
            onSelect={updateActiveFormats}
            onFocus={() => {
              // Ensure there's always a block element so execCommand works
              if (editorRef.current && !editorRef.current.innerHTML.trim()) {
                document.execCommand('insertHTML', false, '<p><br></p>');
              }
            }}
            data-placeholder="Start writing your note..."
            className="min-h-[200px] px-3 py-2 outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
          />
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
        <div className="flex flex-wrap gap-2">
          {NOTE_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData((f) => ({ ...f, color }))}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                formData.color === color
                  ? 'border-primary-600 ring-2 ring-primary-600 ring-offset-2'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded-md text-sm">
              #{tag}
              <button type="button" onClick={() => handleRemoveTag(tag)} className="text-primary-600 hover:text-primary-800">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add a tag and press Enter"
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <Plus className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Update Note' : 'Create Note'}
        </Button>
      </div>
    </form>
  );
};

export default NoteForm;
