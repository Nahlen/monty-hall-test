import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as style from "./index.module.scss";
import { useStaticContext } from "../../services/context";
import { getGameHistory } from "../../services";

export const GameHistory = () => {
    const { languages } = useStaticContext();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const initData = async () => {
            const history = await getGameHistory();
            setHistory(history);
        };
        initData();
    }, []);

    return <div className={style.wrapper}>
        <Link to={"/"}><button>{languages.CANCEL}</button></Link>
        <h1>{languages.GAME_HISTORY}</h1>
        {JSON.stringify(history, null, 2)}
    </div>;
}