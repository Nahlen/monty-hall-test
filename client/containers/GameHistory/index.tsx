import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as style from "./index.module.scss";
import { useStaticContext } from "../../context";
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

    const Doors = ({ doors }) => {
        return <>
            {Object.values(doors).map((door:any) => {
                return <div key={door.number} className={style.door}>{door.result === "Win" && "🚗"}</div>;
            })
        }</>;
    };

    return <div className={style.wrapper}>
        <Link to={"/"}><button>{languages.RETURN}</button></Link>

        <h1>{languages.GAME_HISTORY}</h1>
        <table>
            <thead>
                <tr>
                    <th>{languages.DATE}</th>
                    <th>{languages.STATE}</th>
                    <th>{languages.DOORS}</th>
                    <th>{languages.METHOD}</th>
                    <th>{languages.RESULT}</th>
                </tr>
            </thead>
            <tbody>
                {history.reverse().map((entry:any) => {
                    const date = new Date(entry.date);
                    const formattedDate = `${date.toLocaleDateString("sv-SE")} ${date.toLocaleTimeString("sv-SE")}`;

                    return <tr key={entry.date}>
                        <td>
                            {formattedDate}
                        </td>
                        <td>
                            {languages[entry.data.state]}
                        </td>
                        <td className={style.doors}>
                            <Doors doors={entry.data.doors} />
                        </td>
                        <td>
                            {entry.data.method !== "NOT_ACCESSIBLE" && languages[entry.data.method]}
                        </td>
                        <td className={entry.data.result === "WIN" ? style.win : style.loss}>
                            {entry.data.result !== "NOT_ACCESSIBLE" && entry.data.result}
                        </td>
                    </tr>;
                })}
            </tbody> 
        </table>
        
    </div>;
};