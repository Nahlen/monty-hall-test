import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as style from "./index.module.scss";
import { Door } from "../../components/Door";
import { ActionButton } from "../../components/ActionButton";

import { getGameRound, postAction } from "../../services";
import { useStaticContext } from "../../services/context";


export const Game = () => {
    const [gameRound, setGameRound] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { languages } = useStaticContext();
    const navigate = useNavigate();

    const makeAction = async (action: string, payload: any = null) => {
        const gameRound = await postAction(action, payload);
        setGameRound(gameRound);
    };

    const selectDoor = async (doorNumber: number) => {
        if (actions.indexOf("SELECT_DOOR") === -1) {
            return;
        }
        makeAction("SELECT_DOOR", doorNumber);
    };

    const goHome = async () => {
        if (actions.indexOf("CANCEL") !== -1) {
            await makeAction("CANCEL");
        }
        navigate("/");
    };

    const initGame = async () => {
        const gameRound = await getGameRound();
        setGameRound(gameRound);
        const { state } = gameRound;
        if (state === "INACTIVE" || state === "COMPLETED") {
            await makeAction("START");
        }
        setLoading(false);
    };

    useEffect(() => {
        try {
            initGame();
        } catch (error) {
            console.error(`ERROR: ${error}`);
        }
    }, []);

    const { actions = [], doors = {}, result = null } = gameRound || {};
    const selectable = actions.indexOf("SELECT_DOOR") !== -1;
    let explainText = " ";

    if (selectable) {
        explainText = languages.SELECT_DOOR;
    } else if (actions.indexOf("STAY") !== -1) {
        explainText = languages.FINAL_CHOICE;
    } else if (result === "WIN") {
        explainText = languages.WIN;
    } else if (result === "LOSS") {
        explainText = languages.LOSS;
    }

    return <div className={`${style.gameWrapper}`}>
        <button className={`${style.goHome}`} onClick={goHome}>{languages.CANCEL}</button>

        <div className={style.gameArea}>
            {!gameRound && <div>Loading</div>}
            {gameRound && <>
                <div className={style.doorsWrapper}>
                    <Door door={doors[1]} doorNumber={1} selectDoor={selectDoor} selectable={selectable} />
                    <Door door={doors[2]} doorNumber={2} selectDoor={selectDoor} selectable={selectable} />
                    <Door door={doors[3]} doorNumber={3} selectDoor={selectDoor} selectable={selectable} />
                </div>
                <h1>{explainText}</h1>
            </>}

            <div className={style.buttonWrapper}>
                {actions.map(action => {
                    if (action === "SELECT_DOOR") {
                        return null;
                    }
                    if (action === "CANCEL") {
                        return null;
                    }
                    if (loading) {
                        return null;
                    }
                    return <ActionButton action={action} makeAction={() => makeAction(action)} />;
                })}
            </div>
        </div>
    </div>;
};