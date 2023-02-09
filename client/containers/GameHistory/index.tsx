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

    console.log(history);

    const Door = ({ hasCar }) => {
        return <div className={style.door}>{hasCar && "🚗"}</div>;
    };

    return <div className={style.wrapper}>
        <Link to={"/"}><button>{languages.CANCEL}</button></Link>
        <h1>{languages.GAME_HISTORY}</h1>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>State</th>
                    <th>Doors</th>
                    <th>Choice</th>
                    <th>Result</th>
                </tr>
            </thead>
            <tbody>
                {history.reverse().map((entry:any) => (<tr key={entry.date}>
                        <td>{entry.date}</td>
                        <td>{entry.data.state}</td>
                        <td className={style.doors}>
                            <Door hasCar={entry.data.doors[1].result === "Win"} />
                            <Door hasCar={entry.data.doors[2].result === "Win"} />
                            <Door hasCar={entry.data.doors[3].result === "Win"} />
                        </td>
                        <td>{entry.data.method}</td>
                        <td>{entry.data.result}</td>
                    </tr>
                ))}
            </tbody> 
        </table>
        
    </div>;
};