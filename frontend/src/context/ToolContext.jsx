import React, { createContext, useContext, useState } from "react";

const ToolContext = createContext();

export function ToolProvider({ children }) {
  const [activeTool, setActiveTool] = useState(null);      // e.g. "pen", "eraser"
  const [activeSubTool, setActiveSubTool] = useState(null); // e.g. "thin", "clear"

  const selectTool = (tool) => {
    setActiveTool(tool);
    setActiveSubTool(null); // reset subtool whenever main tool changes
  };

  const selectSubTool = (subTool) => {
    setActiveSubTool(subTool);
  };

  return (
    <ToolContext.Provider
      value={{ activeTool, activeSubTool, selectTool, selectSubTool }}
    >
      {children}
    </ToolContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToolContext = () => useContext(ToolContext);
