# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Palworld guide application built with React, TypeScript, and CSS Modules. It features:

- Pal database with search functionality
- Breeding calculator
- Responsive design with modern UI
- React Router for navigation

## Code Style Guidelines

- Use TypeScript for all React components
- Use CSS Modules for styling (`.module.css` files)
- Follow React functional components with hooks
- Use proper TypeScript interfaces for props and data structures
- Keep components small and focused on single responsibility
- Use semantic HTML elements
- Implement proper error handling and loading states

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page-level components
- `src/styles/` - Global styles and CSS modules
- `src/types/` - TypeScript type definitions
- `src/data/` - Static data and mock data
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions

## Naming Conventions

- Components: PascalCase (e.g., `PalCard.tsx`)
- CSS Modules: PascalCase with `.module.css` (e.g., `PalCard.module.css`)
- Hooks: camelCase starting with "use" (e.g., `usePalSearch.ts`)
- Types: PascalCase (e.g., `PalData.ts`)
- Utils: camelCase (e.g., `formatBreedingRank.ts`)

## CSS Modules Guidelines

- Use CSS Modules for component-specific styles
- Define CSS classes in camelCase in the CSS file
- Import styles as an object: `import styles from './Component.module.css'`
- Use `styles.className` syntax in JSX
- Avoid global styles except for base styles in `index.css`
