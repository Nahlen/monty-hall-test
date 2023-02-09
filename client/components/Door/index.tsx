import React from "react";
import * as style from "./index.module.scss";

export const Door = ({ door, doorNumber, selectDoor, selectable }: any) => {
    if (!door) {
        return null;
    }

    return <div
        className={`
            ${style.doorFrame}
            ${selectable ? style.selectable : ""}
            ${door.selected ? style.selected : ""}
        `}
            onClick={() => selectDoor(doorNumber)}
        >
        {door.result === "Win" && door.open && <span className={style.price}>
            🚗
        </span>}

        <div className={`${style.door} ${door.open ? style.open : ""}`}>
            <div className={style.questionMark}>
                ?
            </div>
        </div>
    </div>;
};