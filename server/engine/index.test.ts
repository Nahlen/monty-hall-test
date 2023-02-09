import { describe, expect, test } from '@jest/globals';
import { MontyHallGameEngine, Result, State, DoorContent, Method } from './index';

describe('Monty Hall Game Engine', () => {
    describe("Initial Game Round", () => {
        const engine = new MontyHallGameEngine();

        test('State to be INACTIVE', () => {
            expect(engine.getCurrentGame().state).toBe(State.INACTIVE);
        });

        test('Actions include only START', () => {
            expect(engine.getCurrentGame().actions).toEqual(["START"]);
        });

        test('Result should be NOT_ACCESSIBLE', () => {
            expect(engine.getCurrentGame().result).toEqual(Result.NOT_ACCESSIBLE);
        });

        test('Method should be NOT_ACCESSIBLE', () => {
            expect(engine.getCurrentGame().method).toEqual(Method.NOT_ACCESSIBLE);
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
    });


    describe('Method STAY', () => {
        const engine = new MontyHallGameEngine();

        test('Should be able to start', () => {
            engine.makeAction("START");
            expect(engine.getCurrentGame().state).toBe("ACTIVE");
        });

        test('Should be able to select a door', () => {
            engine.makeAction("SELECT_DOOR", 1);
            expect(engine.getCurrentGame().state).toBe("ACTIVE");
            expect(engine.getCurrentGame().doors[1].selected).toBe(true);
        });

        test('Actions should contain STAY', () => {
            const { actions } = engine.getCurrentGame();
            expect(actions.includes("STAY")).toBe(true);
        });

        test('Should be able to STAY', () => {
            engine.makeAction("STAY");
            expect(engine.getCurrentGame().state).toBe("COMPLETED");
            expect(engine.getCurrentGame().method).toBe(Method.STAY);
        });

       
    });


    describe('Method SELECT_OTHER_DOOR', () => {
        const engine = new MontyHallGameEngine();

        test('Should be able to start', () => {
            engine.makeAction("START");
            expect(engine.getCurrentGame().state).toBe("ACTIVE");
        });

        test('Should be able to select a door', () => {
            engine.makeAction("SELECT_DOOR", 2);
            expect(engine.getCurrentGame().state).toBe("ACTIVE");
            expect(engine.getCurrentGame().doors[2].selected).toBe(true);
        });

        test('Actions should contain SELECT_OTHER_DOOR', () => {
            const { actions } = engine.getCurrentGame();
            expect(actions.includes("SELECT_OTHER_DOOR")).toBe(true);
        });

        test('Should be able to SELECT_OTHER_DOOR', () => {
            engine.makeAction("SELECT_OTHER_DOOR");
            expect(engine.getCurrentGame().state).toBe("COMPLETED");
            expect(engine.getCurrentGame().method).toBe(Method.SELECT_OTHER_DOOR);
        });
    });

    describe('Winning game', () => {
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

    describe('Loosing game', () => {
        test('Selecting door without win with method STAY should result in LOSS', () => {
            const engine = new MontyHallGameEngine();
            engine.makeAction("START");
            const winningDoor = Object.values(engine.getCurrentGame().doors).find(door => door.result === DoorContent.Bust);
            engine.makeAction("SELECT_DOOR", winningDoor?.number);
            engine.makeAction("STAY");

            expect(engine.getCurrentGame().result).toBe(Result.LOSS);
        });

        test('Selecting door win with method SELECT_OTHER_DOOR should result in LOSS', () => {
            const engine = new MontyHallGameEngine();
            engine.makeAction("START");
            const winningDoor = Object.values(engine.getCurrentGame().doors).find(door => door.result === DoorContent.Win);
            engine.makeAction("SELECT_DOOR", winningDoor?.number);
            engine.makeAction("SELECT_OTHER_DOOR");

            expect(engine.getCurrentGame().result).toBe(Result.LOSS);
        });
    });

    describe('INACTIVE game', () => {
        const engine = new MontyHallGameEngine();

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

    describe('ACTIVE game with no door selected', () => {
        const engine = new MontyHallGameEngine();
        engine.makeAction("START");

        test.each(["START", "TEST_ACTION"])(
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

    describe('ACTIVE game with door selected', () => {
        const engine = new MontyHallGameEngine();
        engine.makeAction("START");
        engine.makeAction("SELECT_DOOR", 3);

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

    describe('COMPLETED game', () => {
        const engine = new MontyHallGameEngine();

        engine.makeAction("START");
        engine.makeAction("SELECT_DOOR", 2);
        engine.makeAction("STAY");
        console.log("engine.getCurrentGame()", engine.getCurrentGame());
    
        const INVALID_ACTIONS = ["TEST_ACTION", "CANCEL"];

        test.each(INVALID_ACTIONS)(
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

    /* const expectError = () => {
        engine.makeAction("TEST");
    }
    expect(expectError).toThrowError(); */
});