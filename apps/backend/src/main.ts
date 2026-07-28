import { buildContainer } from "./container";
import { createApp } from "./http/app";

const PORT = Number(process.env.PORT ?? 3000);
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";

const container = buildContainer({ jwtSecret: JWT_SECRET });
const app = createApp(container);

app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
