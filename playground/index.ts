import { faker } from "@faker-js/faker";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as ff from "../src";

type UserDocument = {
  name: string;
  admin: boolean;
};

type Product = {
  name: string;
  price: string;
  stock: number;
  provider: string;
};

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
  initializeApp({ projectId: "demo-firefaux" });
  const firestore = getFirestore();
  const auth = getAuth();

  ff.connectToFirebase({ firestore, auth });

  await ff.clearFirestore(firestore);
  await ff.clearAuth(auth);

  const userDocument = ff.defineDocument<UserDocument>(() => {
    const name = faker.person.fullName();

    return {
      name,
      admin: false,
    };
  });

  const user = ff.defineUser(() => {
    return {
      displayName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  });

  const users = await ff.createMultipleUsers(user, 3);

  for (const user of users) {
    ff.createDoc("users", userDocument, {
      _id: user.uid,
      name: user.displayName,
    });
  }

  const adminUser = await ff.createUser(user, {
    displayName: "Renato Lacerda",
    email: "renato@test.com",
  });

  ff.createDoc("users", userDocument, {
    _id: adminUser.uid,
    name: adminUser.displayName,
  });

  const product = ff.defineDocument<Product>(() => {
    return {
      name: faker.commerce.productName(),
      price: faker.commerce.price({ min: 100, max: 800 }),
      stock: faker.number.int(100),
      provider: faker.company.name(),
    };
  });

  const expansiveProduct = ff.extendDocument<Product>(product, () => {
    return {
      price: faker.commerce.price({ min: 1000, max: 8000 }),
      stock: faker.number.int(10),
    };
  });

  ff.createMultipleDocs("products", product, 20);
  ff.createMultipleDocs("products", expansiveProduct, 5);
})();
