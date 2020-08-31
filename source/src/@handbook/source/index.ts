export interface SourceModule<T> {
  module: T;
  source: string;
  filename: string;
}

export function source<T>(module: T | SourceModule<T>): SourceModule<T> {
  if ('module' in module && 'source' in module && 'filename' in module) {
    return module as SourceModule<T>;
  }
  throw new Error(
    `Can't find the module. You have to install @handbook/babel-plugin`,
  );
}
