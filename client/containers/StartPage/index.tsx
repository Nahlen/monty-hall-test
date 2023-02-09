import React from "react";
import { Link } from "react-router-dom";
import * as style from "./index.module.scss";
import { useStaticContext } from "../../context";

export const StartPage = () => {
    const { languages } = useStaticContext();

    return <div className={style.wrapper}>
        <Link to={"/simulate"}><button>{languages.SIMULATE}</button></Link>
        <Link to={"/game"}><button>{languages.PLAY_THE_GAME}</button></Link>
        <Link to={"/history"}><button>{languages.GAME_HISTORY}</button></Link>
    </div>;
};