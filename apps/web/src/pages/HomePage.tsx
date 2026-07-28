import { Link } from "react-router-dom";
import { useSession } from "../session/SessionContext";

export function HomePage() {
  const { user } = useSession();
  if (user === null) {
    return null;
  }
  const isAdmin = user.role === "ADMIN";
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-surface p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-fg">¡Hola, {user.name}!</h2>
        <p className="mt-1 text-muted">Ingresaste como {user.role}.</p>
      </div>
      <Link
        to={isAdmin ? "/admin" : "/restaurants"}
        className="block rounded-2xl bg-accent p-6 font-semibold text-accent-fg shadow-sm transition hover:bg-accent-hover"
      >
        {isAdmin ? "Administrar mi restaurante →" : "Ver restaurantes y pedir →"}
      </Link>
    </div>
  );
}
