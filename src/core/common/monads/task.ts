import {Either} from "./either";

export class Task<T, E = Error> {
    private constructor(
        private readonly compute: (resolve: (result: T) => void, reject: (error: E) => void) => void
    ) {}

    run(resolve: (result: T) => void, reject: (error: E) => void): void {
        this.compute(resolve, reject);
    }

    map<U>(fn: (value: T) => U): Task<U, E> {
        return new Task<U, E>((resolve, reject) => {
            this.run(
                (result) => {
                    try {
                        resolve(fn(result));
                    } catch (error) {
                        reject(error as E);
                    }
                },
                reject
            );
        });
    }

    flatMap<U>(fn: (value: T) => Task<U, E>): Task<U, E> {
        return new Task<U, E>((resolve, reject) => {
            this.run(
                (result) => {
                    try {
                        fn(result).run(resolve, reject);
                    } catch (error) {
                        reject(error as E);
                    }
                },
                reject
            );
        });
    }

    static of<T>(value: T): Task<T, never> {
        return new Task<T, never>((resolve) => resolve(value));
    }

    static fromPromise<T, E>(promise: Promise<T>): Task<T, E> {
        return new Task<T, E>((resolve, reject) => promise.then(resolve).catch(reject));
    }

    static fromEither<L, R>(either: Either<L, R>): Task<R, L> {
        return new Task<R, L>((resolve, reject) => {
            either.fold(reject, resolve);
        });
    }
}
