# SuiteCloud Visual Learning Platform

An interactive, modular learning platform for SuiteCloud development featuring visual guides, animations, code playgrounds, and Feynman-style explanations.

## Features

- 🎯 **Modular Learning Paths**: Choose between Functional Users, Developers, or Advanced tracks
- 🚀 **Rapid 101**: Get started in 15 minutes with a Hello World tutorial
- 💡 **Feynman Technique**: Simple explanations that build to technical details
- 🎨 **Visual Learning**: Interactive diagrams, animations, and workflows
- 💻 **Code Playground**: Live code editor with NetSuite API support
- 📊 **Progress Tracking**: Track your learning progress across modules
- 🔍 **Search**: Find learning paths, modules, and concepts quickly
- 📱 **Mobile Responsive**: Works seamlessly on all devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
suitecloud-learning-platform/
├── app/                    # Next.js app directory
│   ├── learn/             # Learning path pages
│   ├── rapid-101/         # Rapid 101 tutorial
│   └── playground/        # Code playground
├── components/
│   ├── learning/          # Learning components
│   ├── interactive/       # Interactive components
│   ├── animations/        # Animation components
│   └── ui/                # UI components
├── content/               # MDX content files
│   └── paths/            # Learning path content
├── data/                  # JSON data files
└── types/                 # TypeScript types
```

## Key Components

### PathSelector
Allows users to choose their learning path with visual cards showing prerequisites and time estimates.

### ConceptExplainer
Feynman-style explanation component with simple explanations, expandable technical details, and real-world examples.

### CodePlayground
Monaco Editor-based code playground with NetSuite API autocomplete and live execution.

### DeploymentFlow
Animated diagram showing the complete deployment process from code to NetSuite.

### SPAArchitecture
Interactive React Flow diagram showing SPA client/server architecture.

### ProgressTracker
Tracks user progress through learning paths with localStorage persistence.

## Learning Paths

### Functional Users → Developers
For NetSuite users learning development concepts
- What is SuiteCloud?
- Understanding NetSuite's Structure
- Your First Customization
- Deploying Changes
- Common Patterns

### Developers → NetSuite
For developers learning NetSuite-specific concepts
- NetSuite Architecture Overview
- SuiteScript Basics
- SDF Project Structure
- SPA Development
- Suitelet Development
- Deployment & CI/CD

### Advanced Topics
Deep dives for experienced developers
- CI/CD Integration
- Performance Optimization
- Testing Strategies
- Custom Integrations

## Technologies Used

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Monaco Editor**: Code editing
- **React Flow**: Interactive diagrams
- **MDX**: Markdown with React components

## Contributing

This is a learning platform project. Contributions welcome!

## License

MIT
