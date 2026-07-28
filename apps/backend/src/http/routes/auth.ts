import { Router } from "express";
import type { Container } from "../../container";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/requireAuth";

export function authRoutes(container: Container): Router {
  const router = Router();
  const { useCases, tokens } = container;

  router.post(
    "/register",
    asyncHandler(async (req, res) => {
      const user = await useCases.registerUser.execute(req.body);
      res.status(201).json({ id: user.id, name: user.name, email: user.email.value, role: user.role });
    }),
  );

  router.post(
    "/login",
    asyncHandler(async (req, res) => {
      const { token, user } = await useCases.loginUser.execute(req.body);
      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email.value, role: user.role },
      });
    }),
  );

  router.get("/me", requireAuth(tokens), (req, res) => {
    res.json({ auth: req.auth });
  });

  return router;
}
