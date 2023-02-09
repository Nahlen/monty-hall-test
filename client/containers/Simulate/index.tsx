import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStaticContext } from "../../services/context";
import * as style from "./index.module.scss";
import { simulateRounds } from "../../services";
import { Chart } from "../../components/Chart";

export const Simulate = () => {
    const [method, setMethod] = useState("");
    const [noOfSimulations, setNoOfSimulations] = useState("");
    const [history, setHistory] = useState<any[]>([...Array(10)]);
    const { languages } = useStaticContext();

    const simulate = async () => {
        const simulationResult = await simulateRounds(method, noOfSimulations);
        const chartData: any[] = [];

        simulationResult.forEach((simulation) => {
            const { method, result } = simulation;
            let noOfWins = 0;

            result.forEach((res, index) => {
                const chartEntry = {};

                if (res === "WIN") {
                    noOfWins += 1;
                }
                chartEntry[method] = noOfWins;
                if (chartData[index]) {
                    chartData[index][method] = noOfWins;
                } else {
                    chartData.push(chartEntry);
                }
            });            
        });

        setHistory(chartData);
    };

    const onClick = () => {
        if (method === "" || noOfSimulations === "") {
            return;
        }
        simulate();
    };

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
                    checked={method === "STAY,SELECT_OTHER_DOOR"}
                    onClick={() => setMethod("STAY,SELECT_OTHER_DOOR")} />
                {languages.BOTH}
            </label>

            <h3>Number of simulations</h3>
            <input value={noOfSimulations} onChange={e => setNoOfSimulations(e.target.value)} type="number" />

            <button onClick={onClick}>SIMULATE</button>
        </div>

        <Chart data={history} />
    </div>;
};