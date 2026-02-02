import React from 'react';
import { TrendingUp, Users, DollarSign, Ticket, Bus } from 'lucide-react';

const icons = {
    Users,
    DollarSign,
    Ticket,
    Bus,
    TrendingUp
};

const StatsCard = ({ title, value, iconName, colorClass, subtext }) => {
    const Icon = icons[iconName] || Users;

    return (
        <div className="glass-card rounded-xl p-5 flex flex-col justify-between h-full hover:bg-white/5 transition-colors">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white/5 ${colorClass}`}>
                        <Icon size={20} />
                    </div>
                    <span className="text-slate-300 text-sm font-medium">{title}</span>
                </div>
            </div>
            <div>
                <div className="text-4xl font-bold tracking-tight">{value}</div>
                {subtext && <div className="text-xs text-slate-500 mt-2 font-mono">{subtext}</div>}
            </div>
        </div>
    );
};

export default StatsCard;
