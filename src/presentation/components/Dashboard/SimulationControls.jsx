import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const SimulationControls = ({ isRunning, onStart, onStop, onReset }) => {
    return (
        <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-in">
            <div className="flex gap-4 items-center flex-wrap">
                <button
                    onClick={isRunning ? onStop : onStart}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all transform hover:scale-105 ${isRunning
                            ? 'bg-red-500 hover:bg-red-600 text-white border-none'
                            : 'bg-[#10b981] hover:bg-[#059669] text-white border-none'
                        }`}
                >
                    {isRunning ? (
                        <>
                            <Pause size={18} fill="currentColor" />
                            Pausar
                        </>
                    ) : (
                        <>
                            <Play size={18} fill="currentColor" />
                            Iniciar
                        </>
                    )}
                </button>

                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-all transform hover:scale-105 border-none"
                >
                    <RotateCcw size={18} />
                    Reiniciar
                </button>

                <div className="ml-auto flex items-center gap-3 bg-slate-800/50 px-4 py-3 rounded-xl">
                    <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse-slow' : 'bg-red-500'}`} />
                    <span className="font-mono text-sm">
                        {isRunning ? 'ACTIVO' : 'DETENIDO'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SimulationControls;
