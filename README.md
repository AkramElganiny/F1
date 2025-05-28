# Formula 1 Explorer

A modern React application for exploring Formula 1 seasons, races, and race results using the Ergast API.

## Setup and Installation

### Prerequisites

- npm package manager

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd formula1-explorer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run dev:hmr` - Start development server with HMR on all network interfaces
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Technical Approach and Architecture

### Core Technologies

- **React 19** with TypeScript for type-safe component development
- **Vite** as the build tool for fast development and optimized production builds
- **React Router 7** for client-side routing and navigation
- **TailwindCSS 4** for utility-first styling with custom configuration
- **Vitest** with Testing Library for comprehensive testing

### Architecture Overview

#### Component Structure

The application follows a modular component architecture:

- **Pages**: Route-level components (`Home`, `SeasonsPage`, `RacesPage`, `RaceDetailsPage`)
- **Feature Components**: Domain-specific components (`SeasonsListing`, `RacesListing`, `RaceDetails`)
- **Shared Components**: Reusable UI components (`Navbar`, `Pagination`, `LoadingSkeleton`)

#### Data Management

- **API Service Layer**: Centralized API calls using the Ergast F1 API
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures
- **Error Handling**: Robust error handling with user-friendly error states

#### Routing Strategy

- Hierarchical routing structure: `/seasons` → `/seasons/:year/races` → `/seasons/:year/races/:round`
- URL-driven navigation with proper parameter handling
- Centralized route configuration for maintainability

#### Styling Approach

- **TailwindCSS 4**: Latest version with enhanced performance
- **Responsive Design**: Mobile-first approach with consistent breakpoints
- **Component-Scoped Styling**: Utility classes for maintainable and scalable styles

#### Performance Considerations

- **Code Splitting**: Route-based code splitting for optimal loading
- **Optimized Builds**: Vite's fast bundling and tree-shaking
- **Efficient Re-renders**: React best practices for component optimization

#### Testing Strategy

- **Unit Testing**: Component testing with React Testing Library
- **Integration Testing**: User interaction flows and API integration
- **Type Safety**: TypeScript compilation as part of the testing pipeline

### External Dependencies

- **Ergast API**: Free Formula 1 data API (no authentication required)
- **Date-fns**: Lightweight date manipulation library
- **Modern React Ecosystem**: Latest stable versions for optimal performance and developer experience
