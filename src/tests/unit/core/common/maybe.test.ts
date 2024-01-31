import {Maybe} from "../../../../core/common/maybe";

describe('The Maybe Monad', () => {
    it('creates a Nothing for a given null input', () => {
        expect(Maybe.of(null)).toEqual(Maybe.nothing());
    });

    it('creates a Nothing for a given undefined input', () => {
        expect(Maybe.of(undefined)).toEqual(Maybe.nothing());
    });

    it('creates a Just for a given valid input', () => {
        expect(Maybe.of(5)).toEqual(Maybe.just(5));
    });

    it('does not apply mapping function to Nothing', () => {
        const nothing = Maybe.nothing<number>();
        expect(nothing.map((x: number) => x + 1)).toEqual(Maybe.nothing());
    });

    it('applies a mapping function to the value inside a Just', () => {
        const maybeNumber = Maybe.just(5);
        const addOne = (n: number) => n + 1;
        expect(maybeNumber.map(addOne)).toEqual(Maybe.just(6));
    });

    describe('Functor Laws', () => {
        it('satisfies the identity law', () => {
            const maybeNumber = Maybe.just(5);
            expect(maybeNumber.map(x => x)).toEqual(maybeNumber);
        });

        it('satisfies the functor composition law', () => {
            const justValue = Maybe.just(5);
            const addOne = x => x + 1;
            const double = x => x * 2;
            const result1 = justValue.map(addOne).map(double);
            const result2 = justValue.map(x => double(addOne(x)));
            expect(result1).toEqual(result2);
        });
    });

    it('does not apply flat-mapping function to Nothing', () => {
        const nothing = Maybe.nothing<number>();
        expect(nothing.flatMap((x: number) => Maybe.just(x + 1))).toEqual(Maybe.nothing());
    });

    it('applies a flat-mapping function to the value inside a Just', () => {
        const maybeNumber = Maybe.just(5);
        const addOne = (n: number) => Maybe.just(n + 1);
        expect(maybeNumber.flatMap(addOne)).toEqual(Maybe.just(6));
    });

    it('applies a nothing flat-mapping function to the value inside a Just', () => {
        const justValue = Maybe.just(5);
        const returnNothing = x => Maybe.nothing<number>();
        expect(justValue.flatMap(returnNothing)).toEqual(Maybe.nothing());
    });

    describe('Monad Laws', () => {
        it('satisfies the left identity law', () => {
            const value = 5;
            const addOne = (x: number) => Maybe.just(x + 1);
            expect(Maybe.just(value).flatMap(addOne)).toEqual(addOne(value));
        });

        it('satisfies the right identity law', () => {
            const maybeValue = Maybe.just(5);
            expect(maybeValue.flatMap(Maybe.just)).toEqual(maybeValue);
        });

        it('satisfies the associativity law of monads', () => {
            const maybeValue = Maybe.just(5);
            const addOne = (x: number) => Maybe.just(x + 1);
            const multiplyByTwo = (x: number) => Maybe.just(x * 2);
            const firstOperation = maybeValue.flatMap(x => addOne(x).flatMap(multiplyByTwo));
            const secondOperation = maybeValue.flatMap(addOne).flatMap(multiplyByTwo);
            expect(firstOperation).toEqual(secondOperation);
        });
    });

    it('applies the onNothing function for a given Nothing', () => {
        const result = Maybe.nothing<number>().fold(
            () => 'Nothing here',
            value => `Found ${value}`
        );
        expect(result).toEqual('Nothing here');
    });

    it('applies the onJust function for a given Just', () => {
        const result = Maybe.just(5).fold(
            () => 'Nothing here',
            value => `Found ${value}`
        );
        expect(result).toEqual('Found 5');
    });

    it('does not execute the side effect function for a given Nothing', () => {
        const sideEffect = jest.fn();
        const maybeValue = Maybe.nothing<number>();
        maybeValue.tap(sideEffect);
        expect(sideEffect).not.toHaveBeenCalled();
    });

    it('executes the side effect function for a given Just', () => {
        const sideEffect = jest.fn();
        const maybeValue = Maybe.just(5);
        maybeValue.tap(sideEffect);
        expect(sideEffect).toHaveBeenCalledWith(5);
    });
});
