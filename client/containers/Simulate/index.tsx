import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStaticContext } from "../../context";
import * as style from "./index.module.scss";
import { simulateRounds } from "../../services";
import { Chart } from "../../components/Chart";
import { formatChartData } from "./helpers";

export const Simulate = () => {
    // Initialising chartData with an array with length > 0 made chart render better on first simulation
    const [chartData, setChartData] = useState<any[]>([...Array(10)]);
    const [selectedMethod, setSelectedMethod] = useState("");
    const [noOfSimulations, setNoOfSimulations] = useState("");

    const { languages } = useStaticContext();
    const methods = ["STAY", "SELECT_OTHER_DOOR", "BOTH"];

    const simulate = async () => {
        const method = selectedMethod === "BOTH" ? "STAY,SELECT_OTHER_DOOR" : selectedMethod;
        const simulationResult = await simulateRounds(method, noOfSimulations);
        setChartData(formatChartData(simulationResult));
    };

    const onClick = () => {
        if (selectedMethod === "" || noOfSimulations === "") {
            return;
        }
        simulate();
    };

    return <div className={style.wrapper}>
        <div className={style.controls}>
            <Link to={"/"}><button>{languages.RETURN}</button></Link>

            <h3>{languages.METHOD}</h3>
            {methods.map((met: string) => (<label key={met}>
                <input
                    type="radio"
                    name="method"
                    checked={met === selectedMethod}
                    onChange={() => setSelectedMethod(met)} />
                {languages[met]}
            </label>))}

            <h3>{languages.NO_OF_SIMULATIONS}</h3>
            <input value={noOfSimulations} onChange={e => setNoOfSimulations(e.target.value)} type="number" />
            <button onClick={onClick}>{languages.START_SIMULATION}</button>
        </div>

        <Chart data={chartData} />
    </div>;
};