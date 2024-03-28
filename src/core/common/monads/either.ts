import {Task} from "./task";

export class Either<L, R> {
    private constructor(private readonly _type: 'Left' | 'Right', private readonly value: L | R) {
    }

    static left<L, R>(value: L): Either<L, R> {
        return new Either<L, R>('Left', value);
    }

    static right<L, R>(value: R): Either<L, R> {
        return new Either<L, R>('Right', value);
    }

    static of<L, R>(value: R | null | undefined, leftValue: L): Either<L, R> {
        return value != null ? Either.right(value) : Either.left(leftValue);
    }

    static fromTry<L, R>(fn: () => R): Either<L, R> {
        try {
            return Either.right(fn());
        } catch (e) {
            return Either.left<L, R>(e as L);
        }
    }

    map<U>(fn: (value: R) => U): Either<L, U> {
        return this.isRight() ? Either.right(fn(this.value as R)) : Either.left<L, U>(this.value as L);
    }

    flatMap<U>(fn: (value: R) => Either<L, U>): Either<L, U> {
        return this.isRight() ? fn(this.value as R) : Either.left<L, U>(this.value as L);
    }

    fold<U>(onLeft: (value: L) => U, onRight: (value: R) => U): U {
        return this.isRight() ? onRight(this.value as R) : onLeft(this.value as L);
    }

    tap(effect: (value: R) => void): Either<L, R> {
        if (this.isRight()) {
            effect(this.value as R);
        }
        return this;
    }

    isRight(): boolean {
        return this._type === "Right";
    }

    toTask(): Task<R, L> {
        return Task.fromEither(this);
    }
}
