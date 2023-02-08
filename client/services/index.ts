const SERVER = "http://localhost:8080";

export const getGameRound = async () => {
    const result = await fetch(`${SERVER}/round`);
    const data = await result.json();
    return data;
}