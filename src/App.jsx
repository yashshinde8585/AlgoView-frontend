import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ComplexityManager from "./pages/ComplexityManager"
import ListManager from "./pages/ListManager"
import StaticArrayManager from "./pages/StaticArrayManager"
import LinkedListManager from "./pages/LinkedListManager"
import StackManager from "./pages/StackManager"
import QueueManager from "./pages/QueueManager"
import BSTManager from "./pages/BSTManager"
import IntegerManager from "./pages/IntegerManager"
import FloatManager from "./pages/FloatManager"
import CharacterManager from "./pages/CharacterManager"
import BooleanManager from "./pages/BooleanManager"
import GraphManager from "./pages/GraphManager"
import SortingManager from "./pages/SortingManager"
import SearchingManager from "./pages/SearchingManager"
import PatternManager from "./pages/PatternManager"
import SearchPatternManager from "./pages/SearchPatternManager"
import RecursionManager from "./pages/RecursionManager"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/complexity-module" element={<ComplexityManager />} />
        <Route path="/list-module" element={<ListManager />} />
        <Route path="/static-array-module" element={<StaticArrayManager />} />
        <Route path="/linked-list-module" element={<LinkedListManager />} />
        <Route path="/stack-module" element={<StackManager />} />
        <Route path="/queue-module" element={<QueueManager />} />
        <Route path="/bst-module" element={<BSTManager />} />
        <Route path="/integer-module" element={<IntegerManager />} />
        <Route path="/float-module" element={<FloatManager />} />
        <Route path="/character-module" element={<CharacterManager />} />
        <Route path="/boolean-module" element={<BooleanManager />} />
        <Route path="/graph-module" element={<GraphManager />} />
        <Route path="/sorting-module" element={<SortingManager />} />
        <Route path="/searching-module" element={<SearchingManager />} />
        <Route path="/pattern-module" element={<PatternManager />} />
        <Route path="/search-pattern-module" element={<SearchPatternManager />} />
        <Route path="/recursion-module" element={<RecursionManager />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;