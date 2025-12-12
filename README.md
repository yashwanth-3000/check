# Content Hub

A modern Next.js application for content creation with web3 integration.

## Features

- **Content Creation Flow**: Interactive canvas for creating and managing content workflows
- **Web3 Integration**: MNEE token payment system for premium features
- **Modern UI**: Built with Tailwind CSS, Framer Motion, and React Flow

## Project Structure

- **`/src`**: Main application source code
  - **`/app`**: Next.js app router pages
  - **`/components`**: Reusable React components
  - **`/lib`**: Utility functions
- **`/mnee`**: Web3 payment integration components and hooks
- **`/markdown`**: Markdown content files

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
```

## Technologies

- Next.js 15.5.0
- React 19.1.0
- TypeScript
- Tailwind CSS 4
- Framer Motion
- React Flow (@xyflow/react)
- Web3 (wagmi, viem, RainbowKit)
- Lucide React Icons

## Web3 Features

The `/mnee` directory contains:
- Payment gateway components
- MNEE token balance tracking
- Wallet connection functionality
- Smart contract integration (ERC20 and payment contracts)
