import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { useSession } from "../session/SessionContext";

export function LoginPage() {
  const { login } = useSession();
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function handle(credentials: { email: string; password: string }) {
    setError(undefined);
    setLoading(true);
    try {
      await login(credentials.email, credentials.password);
      navigate("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <LoginForm onSubmit={handle} error={error} loading={loading} />
      <p className="mt-4 text-center text-sm text-neutral-600">
        ¿No tenés cuenta?{" "}
        <Link to="/register" className="font-semibold text-brand hover:underline">
          Registrate
        </Link>
      </p>
    </div>
  );
}
