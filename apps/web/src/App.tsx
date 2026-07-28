import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { SessionProvider, useSession } from "./session/SessionContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";

function Header() {
  const { user, logout } = useSession();
  return (
    <header className="bg-brand text-white shadow-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🍔</span>
          <span className="text-xl font-bold tracking-tight">Pedidos For-It</span>
        </Link>
        {user !== null && (
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline">Hola, {user.name}</span>
            <button
              onClick={logout}
              className="rounded-md bg-white/20 px-3 py-1 font-medium transition hover:bg-white/30"
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <div className="flex min-h-full flex-col">
          <Header />
          <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </SessionProvider>
  );
}
