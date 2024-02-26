import { env } from "node:process";

export function setEmulators() {
  env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
  env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
}
