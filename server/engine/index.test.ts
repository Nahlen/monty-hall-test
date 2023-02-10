import { describe, expect, test } from '@jest/globals';
import { MontyHallGameEngine, Result, State, DoorContent, Method } from './index';

describe('Monty Hall Game Engine', () => {
    describe("Inactive game", () => {
        const engine = new MontyHallGameEngine();

        test('State to be INACTIVE', () => {
            expect(engine.getCurrentGame().state).toBe(State.INACTIVE);
        });

        test('Result should be NOT_ACCESSIBLE', () => {
            expect(engine.getCurrentGame().result).toEqual(Result.NOT_ACCESSIBLE);
        });

        test('Method should be NOT_ACCESSIBLE', () => {
            expect(engine.getCurrentGame().method).toEqual(Method.NOT_ACCESSIBLE);
        });

        test('Actions include only START', () => {
            expect(engine.getCurrentGame().actions).toEqual(["START"]);
        });

        test('Contain three doors', () => {
            expect(Object.keys(engine.getCurrentGame().doors).length).toEqual(3);
        });

        test.each(Object.values(engine.getCurrentGame().doors))(
            `Door $number to be closed and unselected`,
            (door) => {
                expect(door.open).toEqual(false);
                expect(door.selected).toEqual(false);
                expect(typeof door.number).toEqual("number");
            }
        );

        test('Contain only one door with Win', () => {
            const { doors } = engine.getCurrentGame();
            expect(Object.values(doors).filter(door => door.result === DoorContent.Win).length).toEqual(1);
        });

        test('Contain two doors with Bust', () => {
            const { doors } = engine.getCurrentGame();
            expect(Object.values(doors).filter(door => door.result === DoorContent.Bust).length).toEqual(2);
        });

        test.each(["SELECT_OTHER_DOOR", "CANCEL", "TEST_ACTION", "STAY", "SELECT_DOOR"])(
            `Should NOT be able to do action %s`,
            (action) => {
                const expectError = () => {
                    engine.makeAction(action);
                };
                expect(engine.getCurrentGame().state).toBe("INACTIVE");
                expect(expectError).toThrowError();
            }
        );
    });

    describe('Started game', () => {
        const engine = new MontyHallGameEngine();
        engine.makeAction("START");

        test('State to be ACTIVE', () => {
            expect(engine.getCurrentGame().state).toBe(State.ACTIVE);
        });

        test('Result should be NOT_ACCESSIBLE', () => {
            expect(engine.getCurrentGame().result).toEqual(Result.NOT_ACCESSIBLE);
        });

        test('Method should be NOT_ACCESSIBLE', () => {
            expect(engine.getCurrentGame().method).toEqual(Method.NOT_ACCESSIBLE);
        });

        test('Actions should include only SELECT_DOOR and CANCEL', () => {
            expect(engine.getCurrentGame().actions.includes("SELECT_DOOR")).toEqual(true);
            expect(engine.getCurrentGame().actions.includes("CANCEL")).toEqual(true);
            expect(engine.getCurrentGame().actions.length).toEqual(2);
        });

        test.each(Object.values(engine.getCurrentGame().doors))(
            `Door $number to be closed and unselected`,
            (door) => {
                expect(door.open).toEqual(false);
                expect(door.selected).toEqual(false);
            }
        );

        test('Contain only one door with Win', () => {
            const { doors } = engine.getCurrentGame();
            expect(Object.values(doors).filter(door => door.result === DoorContent.Win).length).toEqual(1);
        });

        test('Contain two doors with Bust', () => {
            const { doors } = engine.getCurrentGame();
            expect(Object.values(doors).filter(door => door.result === DoorContent.Bust).length).toEqual(2);
        });

        test.each(["START", "TEST_ACTION", "STAY", "SELECT_OTHER_DOOR"])(
            `Should NOT be able to do action %s`,
            (action) => {
                const expectError = () => {
                    engine.makeAction(action);
                };
                expect(engine.getCurrentGame().state).toBe("ACTIVE");
                expect(expectError).toThrowError();
            }
        );
    });

    describe('Active game with door selected', () => {
        const engine = new MontyHallGameEngine();
        engine.makeAction("START");
        engine.makeAction("SELECT_DOOR", 3);

        test('State to be ACTIVE', () => {
            expect(engine.getCurrentGame().state).toBe(State.ACTIVE);
        });

        test('Result should be NOT_ACCESSIBLE', () => {
            expect(engine.getCurrentGame().result).toEqual(Result.NOT_ACCESSIBLE);
        });

        test('Method should be NOT_ACCESSIBLE', () => {
            expect(engine.getCurrentGame().method).toEqual(Method.NOT_ACCESSIBLE);
        });

        test('Actions should include only CANCEL, SELECT_OTHER_DOOR and STAY', () => {
            expect(engine.getCurrentGame().actions.includes("CANCEL")).toBe(true);
            expect(engine.getCurrentGame().actions.includes("SELECT_OTHER_DOOR")).toBe(true);
            expect(engine.getCurrentGame().actions.includes("STAY")).toBe(true);
            expect(engine.getCurrentGame().actions.length).toEqual(3);
        });

        test('One door should be selected', () => {
            const { doors } = engine.getCurrentGame();
            expect(Object.values(doors).filter(door => door.selected).length).toEqual(1);
        });

        test('One door should be open', () => {
            const { doors } = engine.getCurrentGame();
            expect(Object.values(doors).filter(door => door.open).length).toEqual(1);
        });

        test('Contain only one door with Win', () => {
            const { doors } = engine.getCurrentGame();
            expect(Object.values(doors).filter(door => door.result === DoorContent.Win).length).toEqual(1);
        });

        test('Contain two doors with Bust', () => {
            const { doors } = engine.getCurrentGame();
            expect(Object.values(doors).filter(door => door.result === DoorContent.Bust).length).toEqual(2);
        });

        test.each(["START", "TEST_ACTION", "SELECT_DOOR"])(
            `Should NOT be able to do action %s`,
            (action) => {
                const expectError = () => {
                    engine.makeAction(action);
                };
                expect(engine.getCurrentGame().state).toBe("ACTIVE");
                expect(expectError).toThrowError();
            }
        );
    });

    describe('Completed game with method STAY', () => {
        const engine = new MontyHallGameEngine();

        engine.makeAction("START");
        engine.makeAction("SELECT_DOOR", 2);
        engine.makeAction("STAY");

        test('State to be COMPLETED', () => {
            expect(engine.getCurrentGame().state).toBe(State.COMPLETED);
        });

        test('Method should be STAY', () => {
            expect(engine.getCurrentGame().method).toEqual(Method.STAY);
        });

        test('Result should be set', () => {
            expect(engine.getCurrentGame().result === Result.NOT_ACCESSIBLE).toEqual(false);
        });

        test('Actions should only include START', () => {
            expect(engine.getCurrentGame().actions).toEqual(["START"]);
        });

        test('One door should be selected', () => {
            const { doors } = engine.getCurrentGame();
            expect(Object.values(doors).filter(door => door.selected).length).toEqual(1);
        });

        test("All doors should be open", () => {
            const { doors } = engine.getCurrentGame();
            expect(Object.values(doors).filter(door => door.open === false).length).toEqual(0);
        });

        test('Contain only one door with Win', () => {
            const { doors } = engine.getCurrentGame();
            expect(Object.values(doors).filter(door => door.result === DoorContent.Win).length).toEqual(1);
        });

        test('Contain two doors with Bust', () => {
            const { doors } = engine.getCurrentGame();
            expect(Object.values(doors).filter(door => door.result === DoorContent.Bust).length).toEqual(2);
        });

        test.each(["TEST_ACTION", "CANCEL"])(
            `Should NOT be able to do action %s`,
            (action) => {
                const expectError = () => {
                    engine.makeAction(action);
                };
                expect(engine.getCurrentGame().state).toBe("COMPLETED");
                expect(expectError).toThrowError();
            }
        );
    });

    describe('Completed game with method SELECT_OTHER_DOOR', () => {
        const engine = new MontyHallGameEngine();

        engine.makeAction("START");
        engine.makeAction("SELECT_DOOR", 2);
        engine.makeAction("SELECT_OTHER_DOOR");

        test('State to be COMPLETED', () => {
            expect(engine.getCurrentGame().state).toBe(State.COMPLETED);
        });

        test('Method should be SELECT_OTHER_DOOR', () => {
            expect(engine.getCurrentGame().method).toEqual(Method.SELECT_OTHER_DOOR);
        });

        test('Result should be set', () => {
            expect(engine.getCurrentGame().result === Result.NOT_ACCESSIBLE).toEqual(false);
        });

        test('Actions should only include START', () => {
            expect(engine.getCurrentGame().actions).toEqual(["START"]);
        });

        test('One door should be selected', () => {
            const { doors } = engine.getCurrentGame();
            expect(Object.values(doors).filter(door => door.selected).length).toEqual(1);
        });

        test("All doors should be open", () => {
            const { doors } = engine.getCurrentGame();
            expect(Object.values(doors).filter(door => door.open === false).length).toEqual(0);
        });

        test('Contain only one door with Win', () => {
            const { doors } = engine.getCurrentGame();
            expect(Object.values(doors).filter(door => door.result === DoorContent.Win).length).toEqual(1);
        });

        test('Contain two doors with Bust', () => {
            const { doors } = engine.getCurrentGame();
            expect(Object.values(doors).filter(door => door.result === DoorContent.Bust).length).toEqual(2);
        });

        test.each(["TEST_ACTION", "CANCEL"])(
            `Should NOT be able to do action %s`,
            (action) => {
                const expectError = () => {
                    engine.makeAction(action);
                };
                expect(engine.getCurrentGame().state).toBe("COMPLETED");
                expect(expectError).toThrowError();
            }
        );
    });

    describe('Winning situation', () => {
        test('Selecting door with win with method STAY should result in WIN', () => {
            const engine = new MontyHallGameEngine();
            engine.makeAction("START");
            const winningDoor = Object.values(engine.getCurrentGame().doors).find(door => door.result === DoorContent.Win);
            engine.makeAction("SELECT_DOOR", winningDoor?.number);
            engine.makeAction("STAY");

            expect(engine.getCurrentGame().result).toBe(Result.WIN);
        });

        test('Selecting door without win with method SELECT_OTHER_DOOR should result in WIN', () => {
            const engine = new MontyHallGameEngine();
            engine.makeAction("START");
            const winningDoor = Object.values(engine.getCurrentGame().doors).find(door => door.result === DoorContent.Bust);
            engine.makeAction("SELECT_DOOR", winningDoor?.number);
            engine.makeAction("SELECT_OTHER_DOOR");

            expect(engine.getCurrentGame().result).toBe(Result.WIN);
        });
    });

    describe('Losing situation', () => {
        test('Selecting door without win with method STAY should result in LOSS', () => {
            const engine = new MontyHallGameEngine();
            engine.makeAction("START");
            const winningDoor = Object.values(engine.getCurrentGame().doors).find(door => door.result === DoorContent.Bust);
            engine.makeAction("SELECT_DOOR", winningDoor?.number);
            engine.makeAction("STAY");

            expect(engine.getCurrentGame().result).toBe(Result.LOSS);
        });

        test('Selecting door with win with method SELECT_OTHER_DOOR should result in LOSS', () => {
            const engine = new MontyHallGameEngine();
            engine.makeAction("START");
            const winningDoor = Object.values(engine.getCurrentGame().doors).find(door => door.result === DoorContent.Win);
            engine.makeAction("SELECT_DOOR", winningDoor?.number);
            engine.makeAction("SELECT_OTHER_DOOR");

            expect(engine.getCurrentGame().result).toBe(Result.LOSS);
        });
    });
});