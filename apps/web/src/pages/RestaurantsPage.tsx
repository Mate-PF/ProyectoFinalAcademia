import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type RestaurantDTO } from "../api/client";

export function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;
    api
      .listRestaurants()
      .then((r) => {
        if (active) setRestaurants(r);
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : "Error al cargar");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <p className="py-8 text-center text-neutral-500">Cargando restaurantes…</p>;
  if (error !== undefined) return <p className="py-8 text-center text-red-600">{error}</p>;
  if (restaurants.length === 0)
    return <p className="py-8 text-center text-neutral-500">No hay restaurantes todavía</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-neutral-900">Restaurantes</h2>
      <ul className="space-y-3">
        {restaurants.map((r) => (
          <li key={r.id}>
            <Link
              to={`/restaurants/${r.id}`}
              className="block rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <p className="font-medium text-neutral-900">{r.name}</p>
              <p className="text-sm text-neutral-500">
                {r.address.street} {r.address.number}, {r.address.city}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
