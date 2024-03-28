export class Maybe<T> {
    private constructor(private readonly _type: 'Just' | 'Nothing', private readonly value?: T) {
    }

    static just<T>(value: T): Maybe<T> {
        return new Maybe('Just', value);
    }

    static nothing<T>(): Maybe<T> {
        return new Maybe('Nothing');
    }

    static of<T>(value: T | null | undefined): Maybe<T> {
        return value ? Maybe.just(value) : Maybe.nothing();
    }

    map<U>(fn: (value: T) => U): Maybe<U> {
        return this.isJust() ? Maybe.just(fn(this.value as T)) : Maybe.nothing<U>();
    }

    flatMap<U>(fn: (value: T) => Maybe<U>): Maybe<U> {
        return this.isJust() ? fn(this.value as T) : Maybe.nothing<U>();
    }

    fold<U>(onNothing: () => U, onJust: (value) => U) {
        return this.isJust() ? onJust(this.value as T) : onNothing();
    }

    tap(effect: (value: T) => void) {
        if (this.isJust()) {
            effect(this.value as T);
        }
        return this;
    }

    private isJust<T>() {
        return this._type === "Just";
    }
}
