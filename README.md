# AlgoView

> An interactive platform to visualize Data Structures & Algorithms — step by step.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)](https://vitejs.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=flat&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)

---

## Overview

AlgoView is a structured DSA learning platform built for developers who want to *understand* algorithms, not just memorize them.

It features a custom generator-based **Algorithm Execution Engine** that drives step-by-step visualization across 20+ data structures and algorithms — with real-time complexity analysis, memory simulation, and multi-language code references.

---

## Features

- **Step-by-step Execution** — Move forward and backward through any algorithm with full state caching
- **20+ Interactive Modules** — From primitive types to graphs and advanced patterns
- **Complexity Analyzer** — Visual Big-O analysis with time and space breakdowns
- **Memory Simulation** — See actual memory addresses and pointer behavior
- **Multi-language Code** — Every operation shown in Java, Python, and C++
- **DSA Pattern Library** — Two Pointers, Sliding Window, Prefix Sum, Hashing, Binary Search, Backtracking, and more

---

## Modules

| Category | Modules |
|---|---|
| **Primitives** | Integer, Float, Character, Boolean |
| **Linear Structures** | Static Array, Dynamic Array, Linked List, Stack, Queue |
| **Non-Linear** | Binary Search Tree, Graph |
| **Sorting** | Bubble Sort, Quick Sort, Merge Sort |
| **Searching** | Linear Search, Binary Search |
| **Array Patterns** | Two Pointers, Sliding Window, Prefix Sum, Hashing |
| **Search Patterns** | Binary Search, BS on Answer, Cyclic Sort |
| **Recursion** | Recursion, Backtracking, Bit Manipulation |
| **Complexity** | Big-O Analysis |

---

## Tech Stack

- **Frontend** — React 18, JavaScript (ES2024)
- **Build Tool** — Vite
- **Styling** — CSS Modules / Vanilla CSS
- **Routing** — React Router v6
- **Architecture** — Custom Generator-based Algorithm Engine

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Clone the repository
git clone https://github.com/yashshinde8585/AlgoView-frontend-.git
cd AlgoView-frontend-

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
src/
├── engine/             # Core algorithm execution engine
│   ├── AlgorithmEngine.js
│   ├── useAlgorithm.js
│   └── algorithms/
├── components/         # Reusable UI components
│   ├── layout/         # Header, MemoryGrid, LogicTrace, ComplexityPulse
│   └── dashboard/      # Hero, ModuleCard, HierarchyTree
├── pages/              # Individual module pages
├── constants/          # Code templates (Java, Python, C++)
└── data/               # DSA patterns data
```

---

## How the Engine Works

AlgoView's core is a **generator-based execution engine** that decouples algorithm logic from the UI.

```js
// Each algorithm is a generator function
// The engine steps through it one yield at a time

engine.stepForward()   // execute next step, cache state
engine.stepBackward()  // return to previous cached state
engine.reset()         // restart with new parameters
```

This enables true bidirectional navigation through any algorithm without replaying from the start.

---

## Related

- **Backend** — [AlgoView Backend](https://github.com/yashshinde8585/AlgoView-Backed)

---

## License

MIT © [Yash Shinde](https://github.com/yashshinde8585)
