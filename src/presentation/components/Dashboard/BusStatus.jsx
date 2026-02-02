import React from 'react';
import { Bus } from 'lucide-react';

const BusStatus = ({ location, ocupacion, capacity, enTransito, plazas }) => {
    return (
        <div className="glass-card rounded-2xl p-6 animate-slide-in">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Bus className="text-purple-400" />
                Estado del Bus
            </h2>

            <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-2">Ubicación</div>
                    <div className="text-2xl font-bold flex items-center gap-2">
                        {enTransito && <span className="animate-bus">🚌</span>}
                        {location}
                    </div>
                    {enTransito && (
                        <div className="text-sm text-purple-400 mt-1">En tránsito...</div>
                    )}
                </div>

                <div className="bg-slate-900/30 rounded-xl p-6 border border-white/5">
                    <div className="text-slate-400 text-sm mb-2">Pasajeros a Bordo</div>
                    <div className="text-4xl font-bold mb-3">{ocupacion}</div>

                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
                        <div
                            className="bg-purple-500 h-full transition-all duration-500"
                            style={{ width: `${(ocupacion / capacity) * 100}%` }}
                        />
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                        Capacidad: {capacity}
                    </div>
                </div>

                <div className="bg-slate-900/30 rounded-xl p-6 border border-white/5">
                    <div className="text-slate-400 text-sm mb-4">Personas en Plaza</div>
                    <div className="flex justify-between items-center">
                        <div className="text-center">
                            <div className="text-sm font-bold text-slate-300 mb-1">Plaza A</div>
                            <div className="text-3xl font-bold text-blue-400">{plazas.plazaA?.enEspera || 0}</div>
                        </div>
                        <div className="w-full mx-4 h-px bg-slate-700/50 relative">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-600 text-xs">
                                ↔
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-bold text-slate-300 mb-1">Plaza B</div>
                            <div className="text-3xl font-bold text-purple-400">{plazas.plazaB?.enEspera || 0}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusStatus;
