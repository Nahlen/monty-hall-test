import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as style from "./index.module.scss";
import { Doors } from "../../components/Doors";
import { ActionButton } from "../../components/ActionButton";

import { getGameRound, postAction } from "../../services";
import { useStaticContext } from "../../context";

export const Game = () => {
    const [ gameRound, setGameRound ] = useState<any>(null);
    const { languages } = useStaticContext();
    const navigate = useNavigate();

    const makeAction = async (action: string, payload: any = null) => {
        const gameRound = await postAction(action, payload);
        setGameRound(gameRound);
    };

    const selectDoor = async (doorNumber: number) => {
        const { actions } = gameRound;
        if (!actions.includes("SELECT_DOOR")) {
            return;
        }
        makeAction("SELECT_DOOR", doorNumber);
    };

    const returnHome = async () => {
        const { actions } = gameRound;

        //Only cancel if you have started playing (i.e. selected door) and goes back
        if (actions.includes("CANCEL") && !actions.includes("SELECT_DOOR")) {
            await makeAction("CANCEL");
        }
        navigate("/");
    };

    const initGame = async () => {
        const gameRound = await getGameRound();
        const { state } = gameRound;

        if (state === "INACTIVE" || state === "COMPLETED") {
            await makeAction("START");
        } else {
            setGameRound(gameRound);
        }
    };

    useEffect(() => {
        try {
            initGame();
        } catch (error) {
            console.error(`ERROR: ${error}`);
        }
    }, []);

    const { actions = [], doors = {}, result = null } = gameRound || {};
    const selectable = actions.includes("SELECT_DOOR");
    let explainText = "";

    if (selectable) {
        explainText = languages.SELECT_DOOR;
    } else if (actions.includes("STAY")) {
        explainText = languages.FINAL_CHOICE;
    } else if (result === "WIN") {
        explainText = languages.WIN;
    } else if (result === "LOSS") {
        explainText = languages.LOSS;
    }

    return <div className={`${style.gameWrapper}`}>
        <button onClick={returnHome}>{languages.RETURN}</button>

        <div className={style.gameArea}>
            {gameRound && <>
                <Doors doors={doors} onClick={selectDoor} selectable={selectable} />
                <h1>{explainText}</h1>
            </>}

            <div className={style.buttonWrapper}>
                {actions.map(action => (
                    <ActionButton key={action} action={action} makeAction={() => makeAction(action)} />
                ))}
            </div>
        </div>
    </div>;
};