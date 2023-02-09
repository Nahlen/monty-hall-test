import React from "react";
import * as style from "./index.module.scss";
import { useStaticContext } from "../../services/context";

export const ActionButton = ({ action, makeAction }) => {
    const onClick = () => makeAction(action);
    const { languages } = useStaticContext();

    return <button
        key={action}
        onClick={onClick}
        className={style.actionButton}>
            {languages[action]}
    </button>;
};