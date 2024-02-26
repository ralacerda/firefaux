import { expect, it, describe, afterEach } from "vitest";
import { getAuth } from "firebase-admin/auth";
import * as ff from "../src";
import { getUser, addUsersToClean, clearUsers } from "./utils";

const auth = getAuth();

ff.connectToFirebase({ auth });

describe("createUser", () => {
  afterEach(async () => {
    await clearUsers();
  });
  it("creates a user", async () => {
    const user = ff.defineUser(() => {
      return {
        displayName: "Renato Lacerda",
        email: "renatolacerda@test.com",
        password: "Teste123!",
      };
    });

    const newUser = await ff.createUser(user);
    addUsersToClean(newUser.uid);
    const userFromFirebase = await getUser(newUser.uid);
    expect(userFromFirebase.providerData).toMatchInlineSnapshot(`
      [
        {
          "displayName": "Renato Lacerda",
          "email": "renatolacerda@test.com",
          "phoneNumber": undefined,
          "photoURL": undefined,
          "providerId": "password",
          "uid": "renatolacerda@test.com",
        },
      ]
    `);
  });
});
