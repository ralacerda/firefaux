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
        credits: 100,
      };
    });

    const doc = await getDoc(collection, id);
    expect(doc).toMatchInlineSnapshot(`
      {
        "credits": 100,
        "name": "Renato Lacerda",
      }
    `);
  });

  it("creates an document with a custom id", async () => {
    const collection = createCollection();

    ff.createDoc(collection, () => {
      return {
        name: "Renato Lacerda",
        credits: 100,
        _id: "custom-id",
      };
    });

    const doc = await getDoc(collection, "custom-id");
    expect(doc).toMatchInlineSnapshot(`
      {
        "credits": 100,
        "name": "Renato Lacerda",
      }
    `);
  });

  it("creates an document defined with defineDocument", async () => {
    const collection = createCollection();

    const userDocument = ff.defineDocument(() => {
      return {
        name: "Renato Lacerda",
        credits: 100,
      };
    });

    const id = ff.createDoc(collection, userDocument);

    const doc = await getDoc(collection, id);
    expect(doc).toMatchInlineSnapshot(`
      {
        "credits": 100,
        "name": "Renato Lacerda",
      }
    `);
  });

  it("creates an document defined with extendDocument", async () => {
    const collection = createCollection();

    const userDocument = ff.defineDocument(() => {
      return {
        name: "Renato Lacerda",
        credits: 100,
        admin: false,
      };
    });

    const adminDocument = ff.extendDocument(userDocument, () => {
      return {
        admin: true,
      };
    });

    const id = ff.createDoc(collection, adminDocument);

    const doc = await getDoc(collection, id);
    expect(doc).toMatchInlineSnapshot(`
      {
        "admin": true,
        "credits": 100,
        "name": "Renato Lacerda",
      }
    `);
  });

  it("creates an document with an overwrite", async () => {
    const collection = createCollection();

    const userDocument = ff.defineDocument(() => {
      return {
        name: "Renato Lacerda",
        credits: 100,
      };
    });

    const id = ff.createDoc(collection, userDocument, {
      credits: 200,
    });

    const doc = await getDoc(collection, id);
    expect(doc).toMatchInlineSnapshot(`
      {
        "credits": 200,
        "name": "Renato Lacerda",
      }
    `);
  });

  it("creates multiple documents", async () => {
    const collection = createCollection();

    const userDocument = ff.defineDocument(() => {
      return {
        name: "Renato Lacerda",
        credits: 100,
      };
    });

    const ids = ff.createMultipleDocs(collection, userDocument, 3);

    const docs = await Promise.all(ids.map((id) => getDoc(collection, id)));
    expect(docs).toMatchInlineSnapshot(`
      [
        {
          "credits": 100,
          "name": "Renato Lacerda",
        },
        {
          "credits": 100,
          "name": "Renato Lacerda",
        },
        {
          "credits": 100,
          "name": "Renato Lacerda",
        },
      ]
    `);
  });
});
