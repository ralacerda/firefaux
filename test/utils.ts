import type { CollectionReference } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";

initializeApp({ projectId: "demo-firefaux" });
const firestore = getFirestore();
const auth = getAuth();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let collectionId = 0;
const collectionsToClean = new Set<CollectionReference<any>>();
export function createCollection() {
  const collectionName = `collection-${collectionId}`;
  const col = firestore.collection(collectionName);
  collectionId++;
  collectionsToClean.add(col);
  return collectionName;
}

export async function getDoc(collection: string, id: string) {
  await sleep(200);
  const doc = await firestore.doc(`${collection}/${id}`).get();
  return doc.data();
}

export async function getUser(uid: string) {
  const user = await auth.getUser(uid);
  return user;
}

export async function clearCollections() {
  for (const col of collectionsToClean) {
    const query = await col.listDocuments();
    for (const doc of query) {
      await doc.delete();
    }
  }
}

const usersToClean = new Set<string>();
export function addUsersToClean(uid: string) {
  usersToClean.add(uid);
}

export async function clearUsers() {
  for (const uid of usersToClean) {
    await auth.deleteUser(uid);
  }
}
