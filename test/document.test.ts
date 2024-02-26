import { expect, it, describe, afterAll } from "vitest";
import { getFirestore } from "firebase-admin/firestore";
import * as ff from "../src";
import { createCollection, getDoc, clearCollections } from "./utils";

const firestore = getFirestore();

ff.connectToFirebase({ firestore });

describe("createDocument", () => {
  afterAll(async () => {
    await clearCollections();
  });

  it("creates an document", async () => {
    const collection = createCollection();

    const id = ff.createDoc(collection, () => {
      return {
        name: "Renato Lacerda",
        admin: true,
      };
    });

    const doc = await getDoc(collection, id);
    expect(doc).toEqual({
      name: "Renato Lacerda",
      admin: true,
    });
  });

  it("creates an document with a custom id", async () => {
    const collection = createCollection();

    ff.createDoc(collection, () => {
      return {
        name: "Renato Lacerda",
        admin: true,
        _id: "custom-id",
      };
    });

    const doc = await getDoc(collection, "custom-id");
    expect(doc).toEqual({
      name: "Renato Lacerda",
      admin: true,
    });
  });
});
