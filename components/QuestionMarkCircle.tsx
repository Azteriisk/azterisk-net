"use client";

import React, { useState, useEffect } from 'react';

const QuestionMarkCircle = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showTooltip) {
      timer = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showTooltip]);

  return (
    <div className="relative">
      <div 
        className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-gray-400 hover:scale-110 active:bg-gray-500 active:scale-95"
        onClick={() => setShowTooltip(true)}
      >
        <span className="text-gray-700 font-bold text-lg">?</span>
      </div>
      <div 
        className={`
          absolute right-0 mt-2 p-2 bg-white border border-gray-300 rounded shadow-lg w-64 text-sm
          transition-opacity duration-1000 ease-in-out
          ${showTooltip ? 'opacity-100 duration-200' : 'opacity-0 pointer-events-none'}
        `}
      >
        Created by Alec Brandt for internal use only. Not maintained by Lineage or Quadient.
      </div>
    </div>
  );
};

export default QuestionMarkCircle;