import React from 'react';

const StarBackground: React.FC = () => (
    <>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-gray-900 to-black">
                    {/* 星云 */}
                    <div className="absolute inset-0 bg-gradient-radial from-indigo-900/20 via-transparent to-transparent" />
                    <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-radial from-purple-800/15 via-purple-900/5 to-transparent rounded-full blur-3xl" />
                    <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-radial from-blue-800/15 via-blue-900/5 to-transparent rounded-full blur-3xl" />

                    {/* 星星层 */}
                    <div className="absolute inset-0 overflow-hidden">
                            {[...Array(80)].map((_, i) => {
                                    const size = Math.random() * 2 + 0.5;
                                    const colors = ['bg-white', 'bg-blue-200', 'bg-indigo-200', 'bg-cyan-200'];
                                    const color = colors[Math.floor(Math.random() * colors.length)];
                                    return (
                                        <div
                                            key={`star-${i}`}
                                            className={`absolute ${color} rounded-full animate-twinkle`}
                                            style={{
                                                    left: `${Math.random() * 100}%`,
                                                    top: `${Math.random() * 100}%`,
                                                    width: `${size}px`,
                                                    height: `${size}px`,
                                                    animationDelay: `${Math.random() * 4}s`,
                                                    animationDuration: `${3 + Math.random() * 2}s`,
                                                    opacity: 0.4 + Math.random() * 0.4,
                                            }}
                                        />
                                    );
                            })}
                    </div>

                    {/* 微星点 */}
                    <div className="absolute inset-0 overflow-hidden">
                            {[...Array(150)].map((_, i) => (
                                <div
                                    key={`tiny-star-${i}`}
                                    className="absolute bg-white rounded-full animate-pulse"
                                    style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                            width: '0.5px',
                                            height: '0.5px',
                                            animationDelay: `${Math.random() * 5}s`,
                                            animationDuration: `${4 + Math.random() * 2}s`,
                                            opacity: 0.2 + Math.random() * 0.3,
                                    }}
                                />
                            ))}
                    </div>

                    {/* 流星 */}
                    <div className="absolute inset-0 overflow-hidden">
                            {[...Array(2)].map((_, i) => (
                                <div
                                    key={`meteor-${i}`}
                                    className="absolute animate-meteor"
                                    style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 50}%`,
                                            animationDelay: `${i * 4 + Math.random() * 6}s`,
                                            animationDuration: '4s',
                                    }}
                                >
                                        <div className="w-0.5 h-0.5 bg-cyan-300 rounded-full relative">
                                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-200 to-transparent w-8 h-0.5 -rotate-45 blur-sm"></div>
                                        </div>
                                </div>
                            ))}
                    </div>

                    {/* 银河层 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-800/5 to-indigo-900/10 transform rotate-12" />
            </div>

            {/* 动画定义 */}
            <style>
                    {`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        .animate-twinkle {
          animation: twinkle 3s infinite ease-in-out;
        }

        @keyframes meteor {
          0% {
            transform: translateX(-50px) translateY(-50px);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% {
            transform: translateX(150px) translateY(150px);
            opacity: 0;
          }
        }

        .animate-meteor {
          animation: meteor 4s linear infinite;
        }
      `}
            </style>
    </>
);

export default StarBackground;
