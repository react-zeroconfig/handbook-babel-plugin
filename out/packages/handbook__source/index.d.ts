export interface SourceModule<T> {
    module: T;
    source: string;
    filename: string;
}
export declare function source<T>(module: T | SourceModule<T>): SourceModule<T>;
