import { expect, it, describe, beforeEach } from "vitest";
import { getAuth } from "firebase-admin/auth";
import { faker } from "@faker-js/faker";
import * as ff from "../src";
import { getUser, getAllUsers, clearUsers } from "./utils";

const auth = getAuth();
ff.connectToFirebase({ auth });

describe("createUser", () => {
  beforeEach(async () => {
    await clearUsers();
  });

  it("creates a user", async () => {
    const fakeEmail = faker.internet.email();
    const user = ff.defineUser(() => {
      return {
        displayName: "Renato Lacerda",
        email: fakeEmail,
        password: "Teste123!",
      };
    });

    const newUser = await ff.createUser(user);
    const userFromFirebase = await getUser(newUser.uid);
    expect(userFromFirebase.email).toBe(fakeEmail.toLocaleLowerCase());
    expect(userFromFirebase.displayName).toBe("Renato Lacerda");
  });

  it("creates multiple users", async () => {
    const user = ff.defineUser(() => {
      const fakeEmail = faker.internet.email();

      return {
        displayName: "Renato Lacerda",
        email: fakeEmail,
        password: "Teste123!",
      };
    });

    await ff.createMultipleUsers(user, 3);
    const usersFromFirebase = await getAllUsers();
    expect(usersFromFirebase).toHaveLength(3);
    expect(usersFromFirebase[0].displayName).toBe("Renato Lacerda");
  });
});
