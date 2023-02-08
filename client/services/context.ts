import React, { useContext } from "react";

const defaultContext = {
    languages: {
        CANCEL: "Return",
        START: "Play again",
        SELECT_OTHER_DOOR: "Select other door",
        SELECT_DOOR: "Please select a door",
        STAY: "Stay",
        WIN: "🎉🎉🎉 Congratulations! You won! 🎉🎉🎉",
        LOSS: "Better luck next time 😔",
        FINAL_CHOICE: "Stay or choose other door?",
        PLAY_THE_GAME: "Play the game",
        SIMULATE: "Simulate game rounds",
        BOTH: "Both methods",
        GAME_HISTORY: "Game history"
    }
}

export const StaticContext = React.createContext(defaultContext);

export const useStaticContext = () => useContext(StaticContext)