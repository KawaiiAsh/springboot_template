import React from 'react';

interface MiniChartProps {
    data: number[];
    color: string;
}

const MiniChart: React.FC<MiniChartProps> = ({ data, color }) => (
    <div className="flex items-end space-x-1 h-16 w-32">
        {data.map((val, idx) => (
            <div
                key={idx}
                className={`w-2 bg-gradient-to-t ${color} rounded-t-sm transition-all duration-700 hover:scale-110`}
                style={{
                    height: `${Math.max((val / 100) * 100, 8)}%`,
                    animationDelay: `${idx * 100}ms`
                }}
            />
        ))}
    </div>
);

export default MiniChart;
