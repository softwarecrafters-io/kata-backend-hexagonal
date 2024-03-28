import {Either} from "../../../../../core/common/monads/either";

describe('Either', () => {
    describe('left and right', () => {
        test('should create a Left and Right Either correctly', () => {
            const left = Either.left('error');
            const right = Either.right(5);

            expect(left.isRight()).toBe(false);
            expect(right.isRight()).toBe(true);
        });
    });

    describe('of', () => {
        test('should create a Right if value is present, otherwise Left', () => {
            const right = Either.of(5, 'error');
            const left = Either.of(null, 'error');

            expect(right.isRight()).toBe(true);
            expect(left.isRight()).toBe(false);
        });
    });

    describe('fromTry', () => {
        test('should create a Right for successful function execution, otherwise Left', () => {
            const right = Either.fromTry(() => 5);
            const left = Either.fromTry(() => { throw new Error('error'); });

            expect(right.isRight()).toBe(true);
            expect(left.isRight()).toBe(false);
        });
    });

    describe('map', () => {
        test('should apply a function to the value inside Right, Left remains unchanged', () => {
            const right = Either.right<string, number>(5).map(x => x * 2);
            const left = Either.left<string, number>('error').map(x => x * 2);

            expect(right.fold(() => 0, x => x)).toBe(10);
            expect(left.fold(x => x, () => 'success')).toBe('error');
        });
    });

    describe('flatMap', () => {
        test('should apply a function that returns an Either, flattening the result', () => {
            const right = Either.right<string, number>(5).flatMap(x => Either.right(x * 2));
            const left = Either.left<string, number>('error').flatMap(x => Either.right(x * 2));

            expect(right.isRight()).toBe(true);
            expect(left.isRight()).toBe(false);
        });
    });

    describe('fold', () => {
        test('should apply the appropriate function based on the Either type', () => {
            const right = Either.right(5);
            const left = Either.left('error');

            const rightResult = right.fold(() => 'left', x => `right: ${x}`);
            const leftResult = left.fold(x => `left: ${x}`, () => 'right');

            expect(rightResult).toBe('right: 5');
            expect(leftResult).toBe('left: error');
        });
    });

    describe('tap', () => {
        test('should execute a side-effecting function if the Either is Right', () => {
            let effectExecuted = false;
            const right = Either.right(5).tap(() => {
                effectExecuted = true;
            });
            const left = Either.left('error').tap(() => {
                effectExecuted = true;
            });

            expect(effectExecuted).toBe(true);
            effectExecuted = false; // Resetting for Left
            left.tap(() => {
                effectExecuted = true;
            });
            expect(effectExecuted).toBe(false);
        });
    });

    describe('toTask', () => {
        test('should convert an Either to a Task', done => {
            const right = Either.right(5).toTask();
            const left = Either.left('error').toTask();

            right.run(
                result => {
                    expect(result).toBe(5);
                    left.run(
                        () => done.fail('Left should not resolve'),
                        error => {
                            expect(error).toBe('error');
                            done();
                        }
                    );
                },
                () => done.fail('Right should not reject'),
            );
        });
    });

    describe('Either - Functor and Monad Laws', () => {
        const identity = (x) => x;
        const f = (x) => x + 1;
        const g = (x) => x * 2;
        const fEither = (x) => Either.right(f(x));
        const gEither = (x) => Either.right(g(x));

        test('Functor Law - Identity', () => {
            const either = Either.right(5);
            expect(either.map(identity).fold(identity, identity)).toEqual(either.fold(identity, identity));
        });

        test('Functor Law - Composition', () => {
            const either = Either.right(5);
            expect(either.map(x => f(g(x))).fold(identity, identity))
                .toEqual(either.map(g).map(f).fold(identity, identity));
        });

        test('Monad Law - Left Identity', () => {
            const value = 5;
            const either = Either.right(value);
            expect(either.flatMap(fEither).fold(identity, identity))
                .toEqual(fEither(value).fold(identity, identity));
        });

        test('Monad Law - Right Identity', () => {
            const either = Either.right(5);
            expect(either.flatMap(Either.right).fold(identity, identity))
                .toEqual(either.fold(identity, identity));
        });

        test('Monad Law - Associativity', () => {
            const either = Either.right(5);
            expect(either.flatMap(fEither).flatMap(gEither).fold(identity, identity))
                .toEqual(either.flatMap(x => fEither(x).flatMap(gEither)).fold(identity, identity));
        });
    });
});
