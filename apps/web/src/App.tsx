import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { SessionProvider, useSession } from "./session/SessionContext";
import { CartProvider, useCart } from "./cart/CartContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { AdminPage } from "./pages/AdminPage";
import { RestaurantsPage } from "./pages/RestaurantsPage";
import { RestaurantMenuPage } from "./pages/RestaurantMenuPage";
import { CartPage } from "./pages/CartPage";
import { OrderPage } from "./pages/OrderPage";
import { MyOrdersPage } from "./pages/MyOrdersPage";
import { DeliveriesPage } from "./pages/DeliveriesPage";

function Header() {
  const { user, logout } = useSession();
  const { itemCount } = useCart();
  return (
    <header className="bg-brand text-white shadow-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🍔</span>
          <span className="text-xl font-bold tracking-tight">Pedidos For-It</span>
        </Link>
        {user !== null && (
          <nav className="flex items-center gap-4 text-sm">
            {user.role === "ADMIN" && (
              <Link to="/admin" className="font-medium hover:underline">
                Administrar
              </Link>
            )}
            {user.role === "CLIENTE" && (
              <>
                <Link to="/restaurants" className="font-medium hover:underline">
                  Restaurantes
                </Link>
                <Link to="/orders" className="font-medium hover:underline">
                  Mis pedidos
                </Link>
                <Link to="/cart" className="relative font-medium hover:underline">
                  🛒
                  {itemCount > 0 && (
                    <span className="absolute -right-3 -top-2 rounded-full bg-white px-1.5 text-xs font-bold text-brand">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            {user.role === "REPARTIDOR" && (
              <Link to="/deliveries" className="font-medium hover:underline">
                Mis entregas
              </Link>
            )}
            <span className="hidden sm:inline">Hola, {user.name}</span>
            <button
              onClick={logout}
              className="rounded-md bg-white/20 px-3 py-1 font-medium transition hover:bg-white/30"
            >
              Salir
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

export function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <CartProvider>
          <div className="flex min-h-full flex-col">
            <Header />
            <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminPage /></ProtectedRoute>} />
                <Route path="/restaurants" element={<ProtectedRoute><RestaurantsPage /></ProtectedRoute>} />
                <Route path="/restaurants/:id" element={<ProtectedRoute><RestaurantMenuPage /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
                <Route path="/orders/:id" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
                <Route path="/deliveries" element={<ProtectedRoute role="REPARTIDOR"><DeliveriesPage /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </BrowserRouter>
    </SessionProvider>
  );
}
