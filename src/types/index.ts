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
};
