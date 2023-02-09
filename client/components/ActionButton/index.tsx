import React from "react";
import * as style from "./index.module.scss";
import { useStaticContext } from "../../context";

export const ActionButton = ({ action, makeAction }) => {
    const onClick = () => makeAction(action);
    const { languages } = useStaticContext();

    if (action === "SELECT_DOOR" || action === "CANCEL") {
        return null;
    }

    return <button
        onClick={onClick}
        className={style.actionButton}>
            {languages[action]}
    </button>;
};