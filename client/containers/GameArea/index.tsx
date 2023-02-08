import React, { useState, useEffect } from "react";
import * as style from "./index.module.scss";
import { Door } from "../../components/Door";

import { getGameRound } from "../../services";

/* interface IDoor {
    open: boolean;
    hasPrice: boolean
} */

export const GameArea = () => {
    const [gameRound, setGameRound] = useState([false, false, false]);
    const [doorsOpen, setDoorsOpen] = useState([false, false, false]);
    const [loading, setLoading] = useState(false);
    const [selectedDoor, setSelectedDoor] = useState(false);

    const fetchData = async () => {
        if (loading) {
            return;
        }
        const gameRound = await getGameRound();
        setGameRound(gameRound);
        setLoading(false);
    };

    useEffect(() => {
        try {
            setLoading(true);
            fetchData();
        } catch (error) {
            console.error(`ERROR: ${error}`)
        }
      }, []);

    const openAllDoors = () => {
        setDoorsOpen([true, true, true]);
    };

    const selectOtherDoor = () => {
        const remainingDoor = [0, 1, 2]
            .filter(i => i !== doorsOpen.indexOf(true) && i !== selectedDoor)[0];

        setSelectedDoor(remainingDoor);  
        openAllDoors();
    };
    
    const playAgain = () => {
        setSelectedDoor(false);
        setDoorsOpen([false, false, false]);
        fetchData();
    }

    const selectDoor = (index: number) => {
        if (selectedDoor) {
            return;
        }
        const otherDoors = [0, 1, 2].filter(i => i !== index);
        let newDoor = otherDoors[Math.floor(Math.random() * 2)];

        if (gameRound[newDoor] === true) { // Has the price!! 
            newDoor = otherDoors.filter(i => i !== newDoor)[0];
        }
        const openDoors = [false, false, false];
        openDoors[newDoor] = true;
        setSelectedDoor(index);
        setDoorsOpen(openDoors);
    }

    return <div className={style.gameWrapper}>
        <div className={style.gameControls}>
            <button onClick={playAgain}>Play Again</button>
        </div>

        {loading && <div>Loading</div>}
        {!loading && <>
            <div className={style.gameArea}>
                <div className={style.doorsWrapper}>
                    {gameRound.map((hasCar, index) => <Door
                        selectedDoor={selectedDoor}
                        selectDoor={selectDoor}
                        index={index}
                        hasCar={hasCar}
                        open={doorsOpen[index]}
                    />)}
                </div>
                {selectedDoor === false && <h1>Please select a door</h1>}
                {selectedDoor !== false && <>
                    <button onClick={openAllDoors}>Stay</button>
                    <button onClick={selectOtherDoor}>Choose other door</button>
                </>}
            </div>
        </>}
    </div>
};