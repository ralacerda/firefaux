import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export type FirestoreInstance = ReturnType<typeof getFirestore>;
export type AuthInstance = ReturnType<typeof getAuth>;

export type DocumentContext = {
  uid: string;
};

export type MaybeHasId<T> = {
  _id?: string;
} & T;

export type HasUid<T> = {
  uid: string;
} & T;

export type UserAuth = {
  email: string;
  password: string;
  displayName?: string;
};
