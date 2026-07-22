export const APP_NAME = import.meta.env.VITE_APP_NAME || 'NotesHub';

export const NOTE_COLORS = [
  '#ffffff',
  '#f28b82',
  '#fbbc04',
  '#fff475',
  '#ccff90',
  '#a7ffeb',
  '#cbf0f8',
  '#d7aefb',
  '#fdcfe8',
  '#e6c9a8',
];

export const SORT_OPTIONS = [
  { value: 'updated_at', label: 'Last Modified' },
  { value: 'created_at', label: 'Created Date' },
  { value: 'title', label: 'Title' },
];

export const FILTER_OPTIONS = [
  { value: 'all', label: 'All Notes' },
  { value: 'pinned', label: 'Pinned' },
  { value: 'archived', label: 'Archived' },
];

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  NOTE: '/note/:id',
  NEW_NOTE: '/note/new',
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
};