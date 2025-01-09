import React from 'react';

interface DebugConsoleProps {
  logs: string[];
}

export const DebugConsole: React.FC<DebugConsoleProps> = ({ logs }) => {
  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-4 font-mono text-sm">
      <h2 className="text-lg font-semibold mb-4 text-dashboard-text">Debug Console</h2>
      <div className="space-y-1 max-h-[300px] overflow-y-auto">
        {logs.map((log, index) => (
          <div key={index} className="text-dashboard-muted flex items-start">
            <span className="text-dashboard-accent1 mr-2">&gt;</span>
            <span className="whitespace-pre-wrap">{log}</span>
          </div>
        ))}
      </div>
    </div>
  );
};