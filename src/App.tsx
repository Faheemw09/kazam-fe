import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Dashboard from "./pages/dashboard";
import { useTaskContext } from "./context/TaskContext";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  const { tasks } = useTaskContext();
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
