export function Maybe(value?: undefined): boolean;
export function Maybe<T>(value: T, probability?: number): T | undefined;
export function Maybe(value: any, probability = 0.5): any {
  if (value === undefined) {
    return Math.random() < 0.5;
  }
  return Math.random() < probability ? undefined : value;
}

export function MaybeOr<T1, T2>(
  value1: T1,
  value2: T2,
  probability = 0.5,
): T1 | T2 {
  return Math.random() < probability ? value1 : value2;
}
