import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStaticContext } from "../../services/context";
import * as style from "./index.module.scss";
import { simulateRounds } from "../../services";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';


export const Simulate = () => {
    const [method, setMethod] = useState("");
    const [noOfSimulations, setNoOfSimulations] = useState("");
    const [history, setHistory] = useState<any[]>([...Array(10).map(x => ({
        rounds: 0,
        STAY: 0,
        SELECT_OTHER_DOOR: 0,
    }))]);
    const { languages } = useStaticContext();

    const simulateBoth = async () => {
        const [stayResult, selectOtherDoorResult] = await Promise.all([
            simulateRounds("STAY", noOfSimulations),
            simulateRounds("SELECT_OTHER_DOOR", noOfSimulations)
        ]);
        const chartData: any[] = [];
        let stayNoOfWins = 0;
        let selectOtherNoOfWins = 0;
        stayResult.forEach((entry, index) => {
            const { data } = entry;
            if (data.result === "WIN") {
                stayNoOfWins += 1;
            }
            chartData.push({
                rounds: index + 1,
                STAY: stayNoOfWins,
                SELECT_OTHER_DOOR: 0,
            })
        });
        selectOtherDoorResult.forEach((entry, index) => {
            const { data } = entry;
            if (data.result === "WIN") {
                selectOtherNoOfWins += 1;
            }
            chartData[index].SELECT_OTHER_DOOR = selectOtherNoOfWins;
        });
        setHistory(chartData);
    }

    const simulate = async () => {
        const history = await simulateRounds(method, noOfSimulations);
        const chartData: any[] = [];
        let noOfWins = 0;
        history.forEach((entry, index) => {
            const { data } = entry;
            const chartEntry = {};
            if (data.result === "WIN") {
                noOfWins += 1;
            }
            chartEntry["rounds"] = index + 1;
            chartEntry[method] = noOfWins;
            chartData.push(chartEntry)
        });
        setHistory(chartData);
    }

    const onClick = () => {
        if (method === "" || noOfSimulations === "") {
            return;
        }
        if (method === "BOTH") {
            simulateBoth();
        } else {
            simulate();
        }
    }

    return <div className={style.wrapper}>
        <div className={style.controls}>
            <Link to={"/"}><button>{languages.CANCEL}</button></Link>

            <h3>Method</h3>
            <label>
                <input
                    type="radio"
                    name="method"
                    checked={method === "STAY"}
                    onClick={() => setMethod("STAY")} />
                {languages.STAY}
            </label>
            <label>
                <input
                    type="radio"
                    name="method"
                    checked={method === "SELECT_OTHER_DOOR"}
                    onClick={() => setMethod("SELECT_OTHER_DOOR")} />
                {languages.SELECT_OTHER_DOOR}
            </label>
            <label>
                <input
                    type="radio"
                    name="method"
                    checked={method === "BOTH"}
                    onClick={() => setMethod("BOTH")} />
                {languages.BOTH}
            </label>

            <h3>Number of simulations</h3>
            <input value={noOfSimulations} onChange={e => setNoOfSimulations(e.target.value)} type="number" />

            <button onClick={onClick}>SIMULATE</button>
        </div>
        <div className={style.chart}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={history}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis label="Rounds" dataKey="rounds" />
                    <YAxis label="Wins" />
                    <Tooltip labelFormatter={(roundNr) => 'Round: '+roundNr} />
                    <Legend />
                    <Line type="monotone" dataKey="STAY" stroke="#8884d8" />
                    <Line type="monotone" dataKey="SELECT_OTHER_DOOR" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>;
}