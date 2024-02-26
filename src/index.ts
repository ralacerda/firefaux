import { defu } from "defu";
import type {
  MaybeHasId,
  HasUid,
  FirestoreInstance,
  AuthInstance,
} from "./types";
import { setEmulators } from "./firebase";

let _firestore: FirestoreInstance | undefined;
let _auth: AuthInstance | undefined;

setEmulators();

export function connectToFirebase(instances: {
  firestore?: FirestoreInstance;
  auth?: AuthInstance;
}) {
  const { firestore, auth } = instances;
  _firestore = firestore ?? undefined;
  _auth = auth ?? undefined;
}

export function defineDocument<T>(fn: () => MaybeHasId<T>) {
  return fn;
}

export type UserAuth = Parameters<AuthInstance["createUser"]>[0];

export function extendDocument<T>(
  doc: () => MaybeHasId<T>,
  fn: () => MaybeHasId<Partial<T>>,
) {
  // `as const` is used to preserve the tuple type
  return [doc, fn] as const;
}

export function defineUser(fn: () => UserAuth) {
  return fn;
}

export async function createUser(
  fn: () => UserAuth,
  overwriteDocument?: UserAuth,
) {
  if (!_auth) {
    throw new Error("You need to connect to firebase first");
  }
  const user = defu(overwriteDocument, fn());
  const { uid } = await _auth.createUser({
    email: user.email,
    password: user.password,
    displayName: user.displayName,
  });

  return {
    uid,
    ...user,
  };
}

export async function createMultipleUsers(user: () => UserAuth, count: number) {
  const users: HasUid<UserAuth>[] = [];
  for (let i = 0; i < count; i++) {
    const newUser = createUser(user);
    users.push(await newUser);
  }
  return users;
}

export function createMultipleDocs<T>(
  name: string,
  documentFactory:
    | ReturnType<typeof defineDocument<T>>
    | ReturnType<typeof extendDocument<T>>,
  count: number,
) {
  const docsIds = [];
  for (let i = 0; i < count; i++) {
    const id = createDoc(name, documentFactory);
    docsIds.push(id);
  }
  return docsIds;
}

export function createDoc<T>(
  name: string,
  documentFactory:
    | ReturnType<typeof defineDocument<T>>
    | ReturnType<typeof extendDocument<T>>,
  overwriteDocument?: Partial<MaybeHasId<T>>,
) {
  if (!_firestore) {
    throw new Error("You need to connect to firebase first");
  }

  let factoryGeneratedDocument;
  let id;

  if (Array.isArray(documentFactory)) {
    const [base, ext] = documentFactory;
    const defaultDoc = base();
    const newDoc = ext();
    const { _id = undefined, ...finalDoc } = defu(newDoc, defaultDoc);
    id = _id;
    factoryGeneratedDocument = finalDoc;
  } else {
    // Typescript thinks that documentFactory is not a function
    // But we know that it is a function if it's not an array
    // @ts-expect-error
    const { _id = undefined, ...finalDoc } = documentFactory();
    id = _id;
    factoryGeneratedDocument = finalDoc;
  }

  const { _id = undefined, ...finalDocument } = defu(
    overwriteDocument,
    factoryGeneratedDocument,
  );

  id = _id || id;

  if (id) {
    _firestore.collection(name).doc(id).set(finalDocument);
    return id;
  }
  const document = _firestore.collection(name).doc();
  document.set(finalDocument);
  return document.id;
}

export { Maybe, MaybeOr } from "./utils/probalities";
export { clearFirestore, clearAuth } from "./utils/clear";
