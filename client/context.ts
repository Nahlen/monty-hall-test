import React, { useContext } from "react";

const defaultContext = {
    languages: {
        RETURN: "Return home",
        CANCEL: "Cancel game",
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
        GAME_HISTORY: "Player game history",
        METHOD: "Method",
        NO_OF_SIMULATIONS: "Number of simulations",
        START_SIMULATION: "Start simulation",
        DATE: "Date",
        STATE: "State",
        DOORS: "Doors",
        RESULT: "Result",
        CANCELLED: "❌ Cancelled",
        COMPLETED: "Completed",
    }
};

export const StaticContext = React.createContext(defaultContext);

// Creating a context like this makes it easy to mock when tests are
// implemented on the react components.
export const useStaticContext = () => useContext(StaticContext);