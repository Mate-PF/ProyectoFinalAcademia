import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useSession } from "../session/SessionContext";

/** Redirige a /login si no hay sesión. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useSession();
  if (token === null) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
