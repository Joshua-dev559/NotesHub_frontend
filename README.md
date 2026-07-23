# NotesHub Frontend

React frontend for the NotesHub note-taking application.

## Tech Stack

- React 19
- Vite
- Tailwind CSS v4
- Zustand — state management
- TanStack Query
- Axios — HTTP client
- React Router v7
- React Hot Toast

## Setup

```bash
# Clone and enter the project
git clone https://github.com/Joshua-dev559/NotesHub_frontend.git
cd NotesHub_frontend/noteshub-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env   # then fill in values

# Start dev server
npm run dev
```

App runs at `http://localhost:5173`

## Environment Variables

Create a `.env` file inside `noteshub-frontend/`:

```
VITE_API_URL=http://localhost:8001/api
VITE_APP_NAME=NotesHub
```

## Project Structure

```
src/
├── api/
│   └── client.js         # Axios instance with JWT interceptors
├── components/
│   ├── auth/
│   │   └── PrivateRoute.jsx
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── LoadingSpinner.jsx
│   └── notes/
│       ├── NoteCard.jsx
│       ├── NoteForm.jsx
│       └── NoteList.jsx
├── context/
│   └── AuthContext.jsx   # Auth state, login, register, logout
├── hooks/
│   └── useNotes.js       # Notes state + stats derived from store
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   └── NoteEditor.jsx
├── store/
│   └── noteStore.js      # Zustand store for notes CRUD
└── utils/
    ├── constants.js
    └── helpers.js
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Key Features

- JWT authentication with automatic token refresh
- Create, edit, delete notes with rich text editor
- Pin and archive notes
- Color-coded notes
- Tag support
- Search and filter notes
- Sort by title, created date, or last modified
- Grid and list view toggle

## API Integration

All API calls go through `src/api/client.js` which:
- Attaches `Authorization: Bearer <token>` to every request
- Automatically refreshes expired access tokens using the refresh token
- Redirects to `/login` if refresh fails
- Shows error toasts for failed requests (except 401s)

The backend base URL is set via `VITE_API_URL` in `.env`.

## Auth Flow

```
Register → auto login → Dashboard
Login    → Dashboard
Logout   → blacklists refresh token → Login
```

On app load, if an `access_token` exists in localStorage, `GET /api/me/` is called to restore the session.

## Branch Strategy

```
feature/* → develop → main
```
- All features are developed on `feature/` branches
- PRs are merged into `develop` after review
- `develop` is merged into `main` after testing

## CI

GitHub Actions runs on every push and PR:
- `npm ci` — install dependencies
- `npm run lint` — lint check
- `npm run build` — production build check
