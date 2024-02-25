import { faker } from "@faker-js/faker";
import * as ff from "../src";

const user = ff.defineDocument(() => {
  const name = faker.person.fullName();

  return {
    name,
    admin: false,
  };
});

const admin = ff.extendDocument(user, () => {
  return {
    admin: true,
  };
});

// ff.createCollection("users", user);

ff.createDoc("users", user);

ff.createDoc("users", admin);

ff.createDoc("users", admin, {
  name: "Renato",
});

ff.createMultipleDocs("users", user, 3);

const users = ff.createUser;
