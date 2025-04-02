import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  console.log("ProtectedRoute user", user);
  const token = localStorage.getItem("token");
  console.log("ProtectedRoute token", token);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
