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
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-neutral-900">¡Hola, {user.name}!</h2>
        <p className="mt-1 text-neutral-500">Ingresaste como {user.role}.</p>
      </div>
      <Link
        to={isAdmin ? "/admin" : "/restaurants"}
        className="block rounded-2xl bg-brand p-6 font-semibold text-white shadow-sm transition hover:bg-brand-dark"
      >
        {isAdmin ? "Administrar mi restaurante →" : "Ver restaurantes y pedir →"}
      </Link>
    </div>
  );
}
