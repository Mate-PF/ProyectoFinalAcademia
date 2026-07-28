import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterForm, type Role } from "../components/RegisterForm";
import { useSession } from "../session/SessionContext";

export function RegisterPage() {
  const { register } = useSession();
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function handle(input: { name: string; email: string; password: string; role: Role }) {
    setError(undefined);
    setLoading(true);
    try {
      await register(input);
      navigate("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <RegisterForm onSubmit={handle} error={error} loading={loading} />
      <p className="mt-4 text-center text-sm text-neutral-600">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="font-semibold text-brand hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </div>
  );
}
