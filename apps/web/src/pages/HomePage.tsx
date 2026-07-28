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
      <div className="rounded-2xl bg-brand-light p-6 text-brand-dark">
        <p className="font-medium">
          {isAdmin
            ? "Próximamente: gestioná tu restaurante y su menú."
            : "Próximamente: explorá restaurantes y armá tu pedido."}
        </p>
      </div>
    </div>
  );
}
