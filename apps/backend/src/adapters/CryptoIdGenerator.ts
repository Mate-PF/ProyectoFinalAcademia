import { randomUUID } from "node:crypto";
import type { IdGenerator } from "@proyecto/domain";

/** Adaptador real del puerto IdGenerator usando crypto.randomUUID (sin dependencias). */
export class CryptoIdGenerator implements IdGenerator {
  next(): string {
    return randomUUID();
  }
}
