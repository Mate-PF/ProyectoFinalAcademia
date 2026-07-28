import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useSession } from "../session/SessionContext";

/** Redirige a /login si no hay sesión, o a / si el rol no coincide. */
export function ProtectedRoute({ children, role }: { children: ReactNode; role?: string }) {
  const { token, user } = useSession();
  if (token === null) {
    return <Navigate to="/login" replace />;
  }
  if (role !== undefined && user?.role !== role) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
