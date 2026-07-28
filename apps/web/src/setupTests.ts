import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Limpia el DOM después de cada test (necesario con globals:false).
afterEach(() => {
  cleanup();
});
