import React from 'react';
import { useSimulation } from '@presentation/hooks/useSimulation';
import StatsCard from '@presentation/components/Dashboard/StatsCard';
import SimulationControls from '@presentation/components/Dashboard/SimulationControls';
import BusStatus from '@presentation/components/Dashboard/BusStatus';
import LogViewer from '@presentation/components/Dashboard/LogViewer';
import { TrendingUp } from 'lucide-react';

const SimulationPage = () => {
    const { state, actions } = useSimulation();
    const { isRunning, stats, busStatus, plazas, logs, config } = state;
    const { iniciarSimulacion, detenerSimulacion, reiniciarSimulacion } = actions;

    const tasaRechazo = stats.personasLlegaron > 0
        ? ((stats.sinDinero / stats.personasLlegaron) * 100).toFixed(1)
        : 0;

    const tasaConversion = stats.personasLlegaron > 0
        ? ((stats.ticketsVendidos / stats.personasLlegaron) * 100).toFixed(1)
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#130429] via-[#1e0b36] to-[#2d1b4e] text-white p-4 md:p-8 font-sans overflow-x-hidden">
            <div className="w-full mx-auto">
                {/* Header */}
                <div className="mb-8 animate-slide-in">
                    <h1 className="text-5xl font-bold mb-2 gradient-text">
                        Sistema de Transporte
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Simulación Plaza A Plaza B
                    </p>
                </div>

                <SimulationControls
                    isRunning={isRunning}
                    onStart={iniciarSimulacion}
                    onStop={detenerSimulacion}
                    onReset={reiniciarSimulacion}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Estadísticas principales */}
                    <div className="lg:col-span-2 glass-card rounded-2xl p-6 animate-slide-in">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <TrendingUp className="text-purple-400" />
                            Estadísticas 
                        </h2>

                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                            <StatsCard title="Llegaron" value={stats.personasLlegaron} iconName="Users" colorClass="text-blue-400" />
                            <StatsCard title="Se Fueron" value={stats.personasSeFueron} iconName="Users" colorClass="text-green-400" />
                            <StatsCard title="Sin Dinero" value={stats.sinDinero} iconName="DollarSign" colorClass="text-red-400" />
                            <StatsCard title="Tickets" value={stats.ticketsVendidos} iconName="Ticket" colorClass="text-yellow-400" />
                            <StatsCard title="En el Bus" value={stats.personasMontadas} iconName="Bus" colorClass="text-purple-400" />
                            <StatsCard title="Conversión" value={`${tasaConversion}%`} iconName="TrendingUp" colorClass="text-emerald-400" />
                        </div>

                        {/* Métricas adicionales */}
                        <div className="mt-6 pt-6 border-t border-slate-700">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-slate-400 text-sm">Tasa de Rechazo</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-red-500 to-orange-500 h-full transition-all duration-500"
                                                style={{ width: `${tasaRechazo}%` }}
                                            />
                                        </div>
                                        <span className="font-mono text-sm font-bold">{tasaRechazo}%</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-slate-400 text-sm">Ocupación del Bus</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-500"
                                                style={{ width: `${(busStatus.ocupacion / config.CAPACIDAD_BUS) * 100}%` }}
                                            />
                                        </div>
                                        <span className="font-mono text-sm font-bold">
                                            {busStatus.ocupacion}/{config.CAPACIDAD_BUS}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <BusStatus
                        location={busStatus.location}
                        ocupacion={busStatus.ocupacion}
                        capacity={config.CAPACIDAD_BUS}
                        enTransito={busStatus.enTransito}
                        plazas={plazas}
                    />
                </div>

                <LogViewer logs={logs} />
            </div>
        </div>
    );
};

export default SimulationPage;
