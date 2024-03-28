import {Task} from "../../../../../core/common/monads/task";
import {Either} from "../../../../../core/common/monads/either";

describe('Task', () => {
    test('Task.of should resolve with the provided value', done => {
        const task = Task.of(5);
        task.run(
            result => {
                expect(result).toBe(5);
                done();
            },
            () => {
                done.fail('Task.of should not reject.');
            }
        );
    });

    test('map should transform the value correctly', done => {
        const task = Task.of(3).map(x => x * 2);
        task.run(
            result => {
                expect(result).toBe(6);
                done();
            },
            () => {
                done.fail('map should not cause the task to reject.');
            }
        );
    });

    test('flatMap should chain tasks correctly', done => {
        const task = Task.of(2).flatMap(x => Task.of(x + 3));
        task.run(
            result => {
                expect(result).toBe(5);
                done();
            },
            () => {
                done.fail('flatMap should not cause the task to reject.');
            }
        );
    });

    test('fromPromise should convert a resolved promise correctly', done => {
        const task = Task.fromPromise(Promise.resolve(10));
        task.run(
            result => {
                expect(result).toBe(10);
                done();
            },
            error => {
                done.fail(`fromPromise should not convert a resolved promise into a rejection. Error: ${error}`);
            }
        );
    });

    test('fromEither should convert a Right Either correctly', done => {
        const rightEither = Either.right(7);
        const task = Task.fromEither(rightEither);
        task.run(
            result => {
                expect(result).toBe(7);
                done();
            },
            () => {
                done.fail('fromEither should not reject when converting a Right Either.');
            }
        );
    });

    test('fromEither should convert a Left Either correctly', done => {
        const leftEither = Either.left("Error");
        const task = Task.fromEither(leftEither);
        task.run(
            () => {
                done.fail('fromEither should not resolve when converting a Left Either.');
            },
            error => {
                expect(error).toBe("Error");
                done();
            }
        );
    });

    describe('Task - Functor and Monad Laws', () => {
        const identity = (x) => x;
        const f = (x) => x + 1;
        const g = (x) => x * 2;

        test('Functor Law - Identity', done => {
            const task = Task.of(5);
            task.map(identity).run(result => {
                task.run(identityResult => {
                    expect(result).toBe(identityResult);
                    done();
                }, done.fail);
            }, done.fail);
        });

        test('Functor Law - Composition', done => {
            const task = Task.of(5);
            task.map(x => f(g(x))).run(result => {
                task.map(g).map(f).run(composedResult => {
                    expect(result).toBe(composedResult);
                    done();
                }, done.fail);
            }, done.fail);
        });

        test('Monad Law - Left Identity', done => {
            const value = 5;
            Task.of(value).flatMap(x => Task.of(f(x))).run(result => {
                Task.of(f(value)).run(expectedResult => {
                    expect(result).toBe(expectedResult);
                    done();
                }, done.fail);
            }, done.fail);
        });

        test('Monad Law - Right Identity', done => {
            const task = Task.of(5);
            task.flatMap(Task.of).run(result => {
                task.run(expectedResult => {
                    expect(result).toBe(expectedResult);
                    done();
                }, done.fail);
            }, done.fail);
        });

        test('Monad Law - Associativity', done => {
            const task = Task.of(5);
            const fTask = (x) => Task.of(f(x));
            const gTask = (x) => Task.of(g(x));

            task.flatMap(fTask).flatMap(gTask).run(result => {
                task.flatMap(x => fTask(x).flatMap(gTask)).run(expectedResult => {
                    expect(result).toBe(expectedResult);
                    done();
                }, done.fail);
            }, done.fail);
        });
    });
});
