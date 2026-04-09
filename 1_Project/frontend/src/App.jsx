import Home from "./pages/Home";
import { Routes, Route, Router } from "react-router";
import TodoForm from "./pages/TodoForm";
import TodoDetails from "./pages/TodoDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainLayout from "./sharedLayouts/MainLayout";
import ProtectedRoute from "./protectedRoutes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<TodoForm />} />
        <Route path="/edit/:id" element={<TodoForm />} />
        <Route path="/todo/:id" element={<TodoDetails />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
