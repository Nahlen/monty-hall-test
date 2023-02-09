import React from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import * as style from "./index.module.scss";

export const Chart = ({ data }) => {
    return <div className={style.chart}>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                width={500}
                height={300}
                data={data}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis label="Rounds" dataKey="rounds" />
                <YAxis label="Wins" type="number" domain={['dataMin', data.length]} />
                <Tooltip labelFormatter={(roundNr) => 'Round: ' + roundNr} />
                <Legend />
                <Line type="monotone" dataKey="STAY" stroke="#8884d8" />
                <Line type="monotone" dataKey="SELECT_OTHER_DOOR" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    </div>;
};