import { faker } from "@faker-js/faker";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as ff from "../src";

initializeApp({ projectId: "demo-firefaux" });

ff.connectToFirebase(getFirestore(), getAuth());

const userDocument = ff.defineDocument(() => {
  const name = faker.person.fullName();

  return {
    name,
    admin: false,
  };
});

const admin = ff.extendDocument(userDocument, () => {
  return {
    admin: true,
  };
});

ff.createDoc("users", userDocument);

ff.createDoc("users", admin);

ff.createDoc("users", admin, {
  name: "Renato",
});

const user = ff.defineUser(() => {
  return {
    displayName: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
});

// eslint-disable-next-line unicorn/prefer-top-level-await
(async function () {
  const users = await ff.createMultipleUsers(user, 3);

  for (const user of users) {
    ff.createDoc("users", userDocument, {
      _id: user.uid,
    });
  }

  console.log(users);
})();
