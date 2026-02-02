import { useState, useRef } from 'react';
import { CONFIG } from '@core/config';
import { Pasajero } from '@domain/models/Passenger';

export const useSimulation = () => {
    // Estado de la simulación
    const [isRunning, setIsRunning] = useState(false);
    const [stats, setStats] = useState({
        personasLlegaron: 0,
        personasSeFueron: 0,
        sinDinero: 0,
        ticketsVendidos: 0,
        personasMontadas: 0
    });

    const [busStatus, setBusStatus] = useState({
        location: 'Plaza A',
        ocupacion: 0,
        enTransito: false
    });

    const [plazas, setPlazas] = useState({
        plazaA: { enEspera: 0 },
        plazaB: { enEspera: 0 }
    });

    const [logs, setLogs] = useState([]);

    // Referencias para mantener estado entre renders
    const pasajerosEnBus = useRef([]);
    const colasEspera = useRef({ plazaA: [], plazaB: [] });
    const contadorPasajeros = useRef(0);
    const intervalosRef = useRef({ ciclo: null, generacion: null });

    const addLog = (message, type = 'info') => {
        setLogs(prev => [...prev.slice(-20), {
            message,
            type,
            time: new Date().toLocaleTimeString()
        }]);
    };

    // Generar pasajeros
    const generarPasajeros = (punto) => {
        const cantidad = Math.floor(Math.random() * 11) + 5;

        for (let i = 0; i < cantidad; i++) {
            contadorPasajeros.current++;
            const pasajero = new Pasajero(contadorPasajeros.current, punto);
            colasEspera.current[punto].push(pasajero);

            setStats(prev => ({
                ...prev,
                personasLlegaron: prev.personasLlegaron + 1
            }));
        }

        setPlazas({
            plazaA: { enEspera: colasEspera.current.plazaA.length },
            plazaB: { enEspera: colasEspera.current.plazaB.length }
        });
    };

    // Abordar pasajeros
    const abordarPasajeros = (punto) => {
        const espaciosDisponibles = CONFIG.CAPACIDAD_BUS - pasajerosEnBus.current.length;
        let abordados = 0;
        let rechazados = 0;

        const cola = colasEspera.current[punto];
        const nuevaCola = [];

        for (const pasajero of cola) {
            if (abordados >= espaciosDisponibles) {
                nuevaCola.push(pasajero);
                continue;
            }

            if (pasajero.puedePagar()) {
                pasajerosEnBus.current.push(pasajero);
                abordados++;
                setStats(prev => ({
                    ...prev,
                    ticketsVendidos: prev.ticketsVendidos + 1
                }));
            } else {
                rechazados++;
                setStats(prev => ({
                    ...prev,
                    sinDinero: prev.sinDinero + 1,
                    personasSeFueron: prev.personasSeFueron + 1
                }));
            }
        }

        colasEspera.current[punto] = nuevaCola;

        setPlazas({
            plazaA: { enEspera: colasEspera.current.plazaA.length },
            plazaB: { enEspera: colasEspera.current.plazaB.length }
        });

        setBusStatus(prev => ({
            ...prev,
            ocupacion: pasajerosEnBus.current.length
        }));

        if (abordados > 0) {
            // Mapping internal keys to display names
            const nombrePunto = punto === 'plazaA' ? 'Plaza A' : 'Plaza B';
            addLog(`✅ ${abordados} pasajeros abordaron en ${nombrePunto}`, 'success');
        }
        if (rechazados > 0) {
            addLog(`❌ ${rechazados} rechazados por falta de dinero`, 'error');
        }

        return abordados;
    };

    // Desembarcar pasajeros
    const desembarcarPasajeros = () => {
        const pasajerosQueQuedan = [];
        let desembarcados = 0;

        for (const pasajero of pasajerosEnBus.current) {
            if (Math.random() < CONFIG.PROBABILIDAD_DESCENSO) {
                desembarcados++;
                setStats(prev => ({
                    ...prev,
                    personasSeFueron: prev.personasSeFueron + 1
                }));
            } else {
                pasajerosQueQuedan.push(pasajero);
            }
        }

        pasajerosEnBus.current = pasajerosQueQuedan;

        setStats(prev => ({
            ...prev,
            personasMontadas: pasajerosEnBus.current.length
        }));

        setBusStatus(prev => ({
            ...prev,
            ocupacion: pasajerosEnBus.current.length
        }));

        if (desembarcados > 0) {
            addLog(`⬇️ ${desembarcados} pasajeros se bajaron`, 'info');
        }

        return desembarcados;
    };

    // Ciclo del bus
    const cicloBus = async () => {
        let puntoActual = 'plazaA';
        let puntoDestino = 'plazaB';
        let nombreActual = 'Plaza A';
        let nombreDestino = 'Plaza B';

        while (intervalosRef.current.ciclo) {
            // Generar pasajeros en ambas plazas
            generarPasajeros('plazaA');
            generarPasajeros('plazaB');

            // Bus llega a la parada
            setBusStatus(prev => ({ ...prev, location: nombreActual, enTransito: false }));
            addLog(`🚌 Bus llegó a ${nombreActual}`, 'bus');

            await new Promise(resolve => setTimeout(resolve, 500));

            // Desembarcar
            desembarcarPasajeros();

            await new Promise(resolve => setTimeout(resolve, CONFIG.TIEMPO_ABORDAJE));

            // Abordar
            abordarPasajeros(puntoActual);

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Viajar
            setBusStatus(prev => ({ ...prev, enTransito: true }));
            addLog(`🚌 Viajando a ${nombreDestino}...`, 'bus');

            await new Promise(resolve => setTimeout(resolve, CONFIG.TIEMPO_VIAJE));

            // Intercambiar puntos
            [puntoActual, puntoDestino] = [puntoDestino, puntoActual];
            [nombreActual, nombreDestino] = [nombreDestino, nombreActual];
        }
    };

    // Control de la simulación
    const iniciarSimulacion = () => {
        // Evitar iniciar si ya está corriendo
        if (isRunning) return;

        setIsRunning(true);
        addLog('🎬 Simulación iniciada', 'success');
        intervalosRef.current.ciclo = true;
        cicloBus();
    };

    const detenerSimulacion = () => {
        setIsRunning(false);
        intervalosRef.current.ciclo = null;
        addLog('⏸️ Simulación pausada', 'warning');
    };

    const reiniciarSimulacion = () => {
        detenerSimulacion();
        pasajerosEnBus.current = [];
        colasEspera.current = { plazaA: [], plazaB: [] };
        contadorPasajeros.current = 0;

        setStats({
            personasLlegaron: 0,
            personasSeFueron: 0,
            sinDinero: 0,
            ticketsVendidos: 0,
            personasMontadas: 0
        });

        setBusStatus({
            location: 'Plaza A',
            ocupacion: 0,
            enTransito: false
        });

        setPlazas({
            plazaA: { enEspera: 0 },
            plazaB: { enEspera: 0 }
        });

        setLogs([]);
        addLog('🔄 Simulación reiniciada', 'info');
    };

    return {
        state: {
            isRunning,
            stats,
            busStatus,
            plazas,
            logs,
            config: CONFIG
        },
        actions: {
            iniciarSimulacion,
            detenerSimulacion,
            reiniciarSimulacion
        }
    };
};
