export const formatChartData = (historyData: any[]) => {
    // Formats data to match what rechart wants
    // Turns [{ method: "MET1", result: [...] }, { method: "MET2", result: [...] }]
    // To this: [{ MET1: 0, MET2: 0 }, { MET1: 0, MET2: 1 }, { MET1: 1, MET2: 2 }, ...]

    const formatted: any[] = [];

    historyData.forEach((simulation) => {
        const { method, result } = simulation;
        let noOfWins = 0;

        result.forEach((res, index) => {
            const chartEntry = {};

            if (res === "WIN") {
                noOfWins += 1;
            }
            chartEntry[method] = noOfWins;
            if (formatted[index]) {
                formatted[index][method] = noOfWins;
            } else {
                formatted.push(chartEntry);
            }
        });            
    });

    return formatted;
};