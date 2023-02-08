import React from "react";
import * as style from "./index.module.scss";

interface IDoorProps {
    hasCar: boolean,
    open: boolean,
    index: number,
    selectedDoor: number | boolean,
    selectDoor: Function
}

export const Door = ({ hasCar, open, index, selectedDoor, selectDoor }: IDoorProps) => {
    return <div
        className={`
            ${style.doorFrame}
            ${selectedDoor === false ? style.selectable : ""}
            ${selectedDoor === index ? style.selected : ""}
        `}
        key={index}
        onClick={() => selectDoor(index)}>
        {hasCar && open && <span className={style.price}>
            🚗
        </span>}

        <div className={`${style.door} ${open ? style.open : ""}`}>
            <div className={style.questionMark}>
                ?
            </div>
        </div>
    </div>
}