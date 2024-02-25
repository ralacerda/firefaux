import { faker } from "@faker-js/faker";
import * as ff from "../src";

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

// ff.createCollection("users", userDocument);

ff.createDoc("users", userDocument);

ff.createDoc("users", admin);

ff.createDoc("users", admin, {
  name: "Renato",
});

const user = {
  name: "Renato",
};

const users = ff.createMultipleUsers(user, 3);
console.log(users);
