import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Checking your account...
      </div>
    );
  }

  if (!user || !token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
