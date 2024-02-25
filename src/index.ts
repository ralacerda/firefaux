import { defu } from "defu";
import type { MaybeHasId, UserAuth, HasUid } from "./types";

export function defineDocument<T>(fn: () => MaybeHasId<T>) {
  return fn;
}

export function extendDocument<T>(
  doc: () => MaybeHasId<T>,
  fn: () => MaybeHasId<Partial<T>>,
) {
  // `as const` is used to preserve the tuple type
  return [doc, fn] as const;
}

export function createUser(user: UserAuth | (() => UserAuth)) {
  const uid = Math.random().toString(36).slice(7);
  if (typeof user === "function") {
    user = user();
  }
  return {
    uid,
    ...user,
  };
}

export function createMultipleUsers(
  user: UserAuth | (() => UserAuth),
  count: number,
) {
  const users: HasUid<UserAuth>[] = [];
  for (let i = 0; i < count; i++) {
    const newUser = createUser(user);
    users.push(newUser);
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
  for (let i = 0; i < count; i++) {
    createDoc(name, documentFactory);
  }
}

export function createDoc<T>(
  name: string,
  documentFactory:
    | ReturnType<typeof defineDocument<T>>
    | ReturnType<typeof extendDocument<T>>,
  overwriteDocument?: Partial<MaybeHasId<T>>,
) {
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

  id = id || Math.random().toString(36).slice(7);
  const finalDocument = defu(overwriteDocument, factoryGeneratedDocument);

  console.log(`Created document with id ${id} in ${name}`);
  console.dir(finalDocument);
}

export { Maybe, MaybeOr } from "./utils/probalities";
