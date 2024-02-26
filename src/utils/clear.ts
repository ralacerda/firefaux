import { AuthInstance, FirestoreInstance } from "../types";

export async function clearFirestore(firestore: FirestoreInstance) {
  const collections = await firestore.listCollections();
  for (const collection of collections) {
    const documents = await collection.listDocuments();
    for (const doc of documents) {
      await doc.delete();
    }
  }
}

export async function clearAuth(auth: AuthInstance) {
  const users = await auth.listUsers();
  for (const user of users.users) {
    await auth.deleteUser(user.uid);
  }
}
