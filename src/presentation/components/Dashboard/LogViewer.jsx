import React, { useEffect, useRef, useState } from 'react';

const LogViewer = ({ logs }) => {
    const logsEndRef = useRef(null);
    const containerRef = useRef(null);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

    const handleScroll = () => {
        if (!containerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        // Check if user is near the bottom (within 50px)
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
        setShouldAutoScroll(isNearBottom);
    };

    useEffect(() => {
        if (shouldAutoScroll) {
            logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, shouldAutoScroll]);

    return (
        <div className="glass-card rounded-2xl p-6 animate-slide-in">
            <h2 className="text-2xl font-bold mb-4">Registro de Eventos</h2>
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="bg-slate-950/50 rounded-xl p-4 h-64 overflow-y-auto font-mono text-sm"
            >
                {logs.length === 0 ? (
                    <div className="text-slate-500 text-center py-8">
                        Esperando eventos...
                    </div>
                ) : (
                    logs.map((log, index) => (
                        <div key={index} className={`log-entry log-${log.type}`}>
                            <span className="text-slate-500">[{log.time}]</span>{' '}
                            <span>{log.message}</span>
                        </div>
                    ))
                )}
                <div ref={logsEndRef} />
            </div>
        </div>
    );
};

export default LogViewer;
