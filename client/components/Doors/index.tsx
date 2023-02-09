import React from "react";
import * as style from "./index.module.scss";

const Door = ({ door, onClick, selectable }: any) => {
    if (!door) {
        return null;
    }

    const clickDoor = () => onClick(door.number);

    return <div
        className={`
            ${style.doorFrame}
            ${selectable ? style.selectable : ""}
            ${door.selected ? style.selected : ""}
        `}
        onClick={clickDoor}
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

export const Doors = ({ doors, selectable, onClick }) => {
    return <div className={style.wrapper}>
        {Object.values(doors).map((door: any) => (
            <Door key={door.number} door={door} onClick={onClick} selectable={selectable} />
        ))}
    </div>;
};