# GitHub Search

Search GitHub users and explore their repositories with a clean, responsive interface.

## Demo

🔗 **Live Demo**: [https://mfikria.github.io/github-search/](https://mfikria.github.io/github-search/)
📂 **Repository**: [https://github.com/mfikria/github-search](https://github.com/mfikria/github-search)

**Try the demo**: Visit the live demo link above and search for any GitHub username (e.g., "john", or "alice") to see the app in action. Click on user cards to expand and explore their repositories.

## Features

- **User Search**: Find up to 5 GitHub users with similar usernames
- **Repository Explorer**: View all repositories for selected users (no limit)
- **Responsive Design**: Works on desktop and mobile

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mfikria/github-search.git
   cd github-search
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**: [http://localhost:3000](http://localhost:3000)

## Usage Instructions

1. **Search Users**: Enter a GitHub username in the search box
2. **View Results**: Click on any user card to expand and see their repositories
3. **Explore Repos**: Click on repository cards to visit them on GitHub
4. **New Search**: Enter a new search term to reset and find different users

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run test     # Run tests
npm run lint     # ESLint check
```

## Architecture & Tech Stack Choices

### Why This Structure?

**Component-Based Architecture**: Organized into reusable UI components (`/components`) for maintainability and consistency across the app.

**State Management**: Zustand chosen over Redux for its simplicity and minimal boilerplate while providing powerful state management capabilities.

**Service Layer**: Separated API logic (`/services`) from UI components for better testability and code organization.

**Custom Hooks**: Extracted reusable logic (`/hooks`) like debouncing and infinite scroll for better code reuse.

### Tech Stack

- **Next.js 15**: Latest features, App Router for better performance, built-in optimization
- **TypeScript**: Type safety reduces bugs and improves developer experience
- **Tailwind CSS**: Utility-first approach for rapid UI development and consistent design
- **Zustand**: Lightweight state management without Redux complexity
- **Axios**: Robust HTTP client with interceptors for API token handling
- **Jest + Testing Library**: Industry standard for reliable testing

## Deployment

Auto-deploys to GitHub Pages on push to `main`. Configure in Settings → Pages → GitHub Actions.
