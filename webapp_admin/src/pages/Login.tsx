import React, { useState, useEffect } from 'react';

const Login: React.FC = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [isVeriCodeLogin, setIsVeriCodeLogin] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [veriCodeText, setVeriCodeText] = useState('发送验证码');
    const [showModal, setShowModal] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: '',
        message: '',
        type: 'info'
    });

    // Form states
    const [loginForm, setLoginForm] = useState({
        account: '',
        password: '',
        verificationCode: ''
    });
    const [signupForm, setSignupForm] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
                setVeriCodeText(`${countdown - 1}秒后重新发送`);
            }, 1000);
        } else if (countdown === 0 && veriCodeText !== '发送验证码') {
            setVeriCodeText('发送验证码');
        }

        return () => clearTimeout(timer);
    }, [countdown, veriCodeText]);

    const handleVeriCodeClick = () => {
        if (countdown === 0) {
            // Show development modal for verification code
            setModalContent({
                title: '功能开发中',
                message: '邮箱验证码功能正在开发中，敬请期待！',
                type: 'info'
            });
            setShowModal(true);

            // Start countdown anyway for demo
            setCountdown(60);
            setVeriCodeText('60秒后重新发送');
        }
    };

    const toggleLoginMode = () => {
        setIsVeriCodeLogin(!isVeriCodeLogin);
    };

    const switchToSignup = () => {
        setIsSignup(true);
    };

    const switchToLogin = () => {
        setIsSignup(false);
    };

    const handleSocialLogin = () => {
        setModalContent({
            title: '功能开发中',
            message: 'QQ 和微信登录功能正在开发中，敬请期待！',
            type: 'info'
        });
        setShowModal(true);
    };

    const handleLogin = () => {
        // Validation - 账号或密码为空的提示
        if (!loginForm.account.trim()) {
            setModalContent({
                title: '登录失败',
                message: '请输入账号',
                type: 'error'
            });
            setShowModal(true);
            return;
        }

        if (!isVeriCodeLogin && !loginForm.password.trim()) {
            setModalContent({
                title: '登录失败',
                message: '请输入密码',
                type: 'error'
            });
            setShowModal(true);
            return;
        }

        if (isVeriCodeLogin && !loginForm.verificationCode.trim()) {
            setModalContent({
                title: '登录失败',
                message: '请输入验证码',
                type: 'error'
            });
            setShowModal(true);
            return;
        }

        // 纯前端登录成功逻辑
        console.log('Login attempt:', loginForm);

        // 显示欢迎页面
        setShowWelcome(true);

        // 3秒后跳转到home页面
        setTimeout(() => {
            console.log('跳转到home页面');
            // 使用路由跳转到home页面
            window.location.href = '/home';
        }, 3000);
    };

    const handleSignup = () => {
        // Validation
        if (!signupForm.email.trim()) {
            setModalContent({
                title: '申请失败',
                message: '请输入账号',
                type: 'error'
            });
            setShowModal(true);
            return;
        }

        if (!signupForm.password.trim()) {
            setModalContent({
                title: '申请失败',
                message: '请输入密码',
                type: 'error'
            });
            setShowModal(true);
            return;
        }

        // Signup logic would go here
        setModalContent({
            title: '申请提交成功',
            message: '您的账户申请已提交给管理员，请等待审核通过后再登录。',
            type: 'success'
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const updateLoginForm = (field: string, value: string) => {
        setLoginForm(prev => ({ ...prev, [field]: value }));
    };

    const updateSignupForm = (field: string, value: string) => {
        setSignupForm(prev => ({ ...prev, [field]: value }));
    };

    // 欢迎页面组件 - 暗夜星海版本
    const WelcomeScreen = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 深邃星空背景 */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-slate-900 to-black">
                {/* 星云效果 */}
                <div className="absolute inset-0 bg-gradient-radial from-indigo-900/30 via-transparent to-transparent"></div>
                <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-radial from-purple-800/20 via-purple-900/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-radial from-blue-800/20 via-blue-900/10 to-transparent rounded-full blur-3xl"></div>

                {/* 大星星层 */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(50)].map((_, i) => {
                        const size = Math.random() * 3 + 1;
                        const colors = ['bg-white', 'bg-blue-200', 'bg-indigo-200', 'bg-purple-200'];
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
                                    animationDelay: `${Math.random() * 3}s`,
                                    animationDuration: `${2 + Math.random() * 3}s`,
                                    opacity: 0.6 + Math.random() * 0.4
                                }}
                            />
                        );
                    })}
                </div>

                {/* 小星星层 */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(100)].map((_, i) => (
                        <div
                            key={`tiny-star-${i}`}
                            className="absolute bg-white rounded-full animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                width: '1px',
                                height: '1px',
                                animationDelay: `${Math.random() * 4}s`,
                                animationDuration: `${3 + Math.random() * 2}s`,
                                opacity: 0.3 + Math.random() * 0.4
                            }}
                        />
                    ))}
                </div>

                {/* 流星效果 */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={`meteor-${i}`}
                            className="absolute animate-meteor"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 50}%`,
                                animationDelay: `${i * 2 + Math.random() * 3}s`,
                                animationDuration: '3s'
                            }}
                        >
                            <div className="w-1 h-1 bg-white rounded-full relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-200 to-transparent w-12 h-0.5 -rotate-45 blur-sm"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 银河效果 */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-900/10 to-purple-900/20 transform rotate-12"></div>
            </div>

            {/* 欢迎内容 */}
            <div className="relative z-10 text-center px-4 sm:px-8">
                {/* 欢迎图标 - 神秘光环 */}
                <div className="mb-6 sm:mb-8 relative">
                    {/* 外层光环 */}
                    <div className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 mx-auto">
                        <div className="w-full h-full border border-cyan-400/30 rounded-full animate-spin-slow"></div>
                        <div className="absolute inset-2 border border-blue-400/20 rounded-full animate-spin-reverse"></div>
                    </div>

                    {/* 中央图标 */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto bg-gradient-to-r from-cyan-400/20 via-blue-500/30 to-indigo-500/20 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/10">
                        <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>

                        {/* 内部光点 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-20 animate-pulse"></div>
                    </div>

                    {/* 光芒效果 */}
                    <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-0.5 bg-gradient-to-t from-transparent via-cyan-400/40 to-transparent animate-pulse"
                                style={{
                                    height: '60px',
                                    left: '50%',
                                    top: '50%',
                                    transformOrigin: 'bottom',
                                    transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                                    animationDelay: `${i * 0.2}s`
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* 欢迎文字 */}
                <div className="space-y-3 sm:space-y-6">
                    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent mb-2 sm:mb-4 animate-fade-in font-serif">
                        欢迎回家
                    </h1>
                    <div className="text-lg sm:text-xl lg:text-2xl text-cyan-200 font-light animate-fade-in-delayed">
                        {loginForm.account || '用户'}
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg text-slate-300 opacity-80 max-w-xs sm:max-w-md mx-auto animate-fade-in-delayed-2">
                        登录成功！祝您今天工作愉快。
                    </p>
                </div>

                {/* 加载进度条 - 星光效果 */}
                <div className="mt-8 sm:mt-12 max-w-xs mx-auto">
                    <div className="bg-slate-700/50 rounded-full h-1.5 sm:h-2 overflow-hidden border border-cyan-500/20">
                        <div className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 h-full rounded-full animate-progress relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2 sm:mt-3">穿越星海，即将抵达...</p>
                </div>
            </div>

            {/* 自定义动画样式 */}
            <style>
                {`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes progress {
                    from {
                        width: 0%;
                    }
                    to {
                        width: 100%;
                    }
                }

                @keyframes twinkle {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.2);
                    }
                }

                @keyframes meteor {
                    0% {
                        transform: translateX(-100px) translateY(-100px);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(200px) translateY(200px);
                        opacity: 0;
                    }
                }

                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes spin-reverse {
                    from {
                        transform: rotate(360deg);
                    }
                    to {
                        transform: rotate(0deg);
                    }
                }

                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }

                .animate-fade-in-delayed {
                    animation: fade-in 1s ease-out 0.3s both;
                }

                .animate-fade-in-delayed-2 {
                    animation: fade-in 1s ease-out 0.6s both;
                }

                .animate-progress {
                    animation: progress 3s ease-in-out;
                }

                .animate-twinkle {
                    animation: twinkle infinite;
                }

                .animate-meteor {
                    animation: meteor infinite;
                }

                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }

                .animate-spin-reverse {
                    animation: spin-reverse 15s linear infinite;
                }

                .animate-shimmer {
                    animation: shimmer 2s ease-in-out infinite;
                }

                .bg-gradient-radial {
                    background: radial-gradient(circle, var(--tw-gradient-stops));
                }
                `}
            </style>
        </div>
    );

    // 如果显示欢迎页面，就渲染欢迎页面
    if (showWelcome) {
        return <WelcomeScreen />;
    }

    return (
        <div className="w-screen h-screen relative overflow-hidden">
            {/* 深邃星空背景 */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-gray-900 to-black">
                {/* 星云效果 */}
                <div className="absolute inset-0 bg-gradient-radial from-indigo-900/20 via-transparent to-transparent"></div>
                <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-radial from-purple-800/15 via-purple-900/5 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-radial from-blue-800/15 via-blue-900/5 to-transparent rounded-full blur-3xl"></div>

                {/* 星星层 */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(80)].map((_, i) => {
                        const size = Math.random() * 2 + 0.5;
                        const colors = ['bg-white', 'bg-blue-200', 'bg-indigo-200', 'bg-cyan-200'];
                        const color = colors[Math.floor(Math.random() * colors.length)];
                        return (
                            <div
                                key={`login-star-${i}`}
                                className={`absolute ${color} rounded-full animate-twinkle`}
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    animationDelay: `${Math.random() * 4}s`,
                                    animationDuration: `${3 + Math.random() * 2}s`,
                                    opacity: 0.4 + Math.random() * 0.4
                                }}
                            />
                        );
                    })}
                </div>

                {/* 微星点 */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(150)].map((_, i) => (
                        <div
                            key={`login-tiny-star-${i}`}
                            className="absolute bg-white rounded-full animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                width: '0.5px',
                                height: '0.5px',
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${4 + Math.random() * 2}s`,
                                opacity: 0.2 + Math.random() * 0.3
                            }}
                        />
                    ))}
                </div>

                {/* 流星效果 */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(2)].map((_, i) => (
                        <div
                            key={`login-meteor-${i}`}
                            className="absolute animate-meteor"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 50}%`,
                                animationDelay: `${i * 4 + Math.random() * 6}s`,
                                animationDuration: '4s'
                            }}
                        >
                            <div className="w-0.5 h-0.5 bg-cyan-300 rounded-full relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-200 to-transparent w-8 h-0.5 -rotate-45 blur-sm"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 银河效果 */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-800/5 to-indigo-900/10 transform rotate-12"></div>
            </div>

            <style>
                {`
                    /* 防止Chrome自动填充改变背景颜色 */
                    input:-webkit-autofill,
                    input:-webkit-autofill:hover,
                    input:-webkit-autofill:focus,
                    input:-webkit-autofill:active {
                        -webkit-box-shadow: 0 0 0 1000px rgba(30, 41, 59, 0.5) inset !important;
                        -webkit-text-fill-color: white !important;
                        background-color: transparent !important;
                        background-image: none !important;
                        transition: background-color 50000s ease-in-out 0s, color 50000s ease-in-out 0s !important;
                    }
                    
                    /* 针对不同浏览器的自动填充样式 */
                    input:-moz-autofill,
                    input:-moz-autofill:hover,
                    input:-moz-autofill:focus {
                        background-color: rgba(30, 41, 59, 0.5) !important;
                        color: white !important;
                        border: 1px solid rgba(71, 85, 105, 0.5) !important;
                    }
                    
                    /* Edge/IE */
                    input:-ms-input-placeholder {
                        color: rgb(148, 163, 184) !important;
                    }
                    
                    /* 确保自动填充状态下的边框和阴影效果 */
                    input:-webkit-autofill:focus {
                        -webkit-box-shadow: 0 0 0 1000px rgba(30, 41, 59, 0.7) inset, 0 0 15px rgba(6, 182, 212, 0.3) !important;
                        border-color: rgba(6, 182, 212, 0.7) !important;
                    }
                    
                    /* 移除所有可能的自动填充样式 */
                    input {
                        background-clip: padding-box !important;
                    }

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

                    @keyframes meteor {
                        0% {
                            transform: translateX(-50px) translateY(-50px);
                            opacity: 0;
                        }
                        10% {
                            opacity: 1;
                        }
                        90% {
                            opacity: 1;
                        }
                        100% {
                            transform: translateX(150px) translateY(150px);
                            opacity: 0;
                        }
                    }

                    .animate-twinkle {
                        animation: twinkle infinite;
                    }

                    .animate-meteor {
                        animation: meteor infinite;
                    }
                `}
            </style>

            {/* 主容器 - 响应式适配 */}
            <div
                className="
                    /* 桌面版：保持原样 */
                    lg:w-[70%] lg:h-[80%] lg:rounded-[20px] lg:p-20
                    /* 平板版：稍微调整 */
                    md:w-[85%] md:h-[85%] md:rounded-[16px] md:p-12
                    /* 手机版：几乎全屏 */
                    w-[95%] h-[95%] rounded-[12px] p-6
                    /* 通用样式 */
                    absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2
                    bg-slate-900/40 backdrop-blur-sm border border-slate-700/50
                    flex items-center box-border shadow-2xl
                "
            >
                <div className="w-full lg:h-[50vh] md:h-[60vh] h-[70vh] relative lg:-top-2 md:-top-1 -top-0">
                    {/* Login Form */}
                    <div
                        className={`absolute transition-all duration-500 w-full ${
                            isSignup
                                ? 'opacity-0 z-0 transform translate-y-0'
                                : 'opacity-100 z-10 transform translate-y-0'
                        }`}
                    >
                        <div className="text-white mb-4 sm:mb-6 lg:mb-8">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl my-3 sm:my-4 lg:my-5 font-serif tracking-wide">
                                登录后台管理系统.
                            </h1>
                            <div className="text-sm sm:text-base">
                                <span className="text-slate-300 font-sans">没有账户? </span>
                                <span
                                    className="text-cyan-400 cursor-pointer font-sans hover:text-cyan-300 transition-colors"
                                    onClick={switchToSignup}
                                >
                                    向管理员申请账户
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                            {/* Account Input */}
                            <div className="relative">
                                <span className="absolute top-1.5 sm:top-2 left-4 sm:left-7 text-slate-400 text-xs sm:text-sm font-sans">账号</span>
                                <input
                                    type="text"
                                    value={loginForm.account}
                                    onChange={(e) => updateLoginForm('account', e.target.value)}
                                    className="w-full h-[50px] sm:h-[60px] lg:h-[70px] rounded-[12px] sm:rounded-[15px] lg:rounded-[18px] border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm text-white
                                               pt-4 sm:pt-5 px-4 sm:px-7 pb-0 outline-none text-sm sm:text-base font-semibold font-sans
                                               focus:border-cyan-500/70 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] focus:bg-slate-800/70 transition-all duration-300"
                                />
                                <div
                                    className="absolute top-[15px] sm:top-[20px] lg:top-[25px] right-2 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 z-10 bg-no-repeat bg-center bg-[length:50%]"
                                    style={{ backgroundImage: "url('./asset/email.png')" }}
                                />
                            </div>

                            {/* Password Input */}
                            <div
                                className={`relative transition-all duration-500 ${
                                    isVeriCodeLogin ? 'opacity-0' : 'opacity-100'
                                }`}
                            >
                                <span className="absolute top-1.5 sm:top-2 left-4 sm:left-7 text-slate-400 text-xs sm:text-sm font-sans">密码</span>
                                <input
                                    type="password"
                                    value={loginForm.password}
                                    onChange={(e) => updateLoginForm('password', e.target.value)}
                                    className="w-full h-[50px] sm:h-[60px] lg:h-[70px] rounded-[12px] sm:rounded-[15px] lg:rounded-[18px] border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm text-white
                                               pt-4 sm:pt-5 px-4 sm:px-7 pb-0 outline-none text-sm sm:text-base font-semibold font-sans tracking-wide
                                               focus:border-cyan-500/70 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] focus:bg-slate-800/70 transition-all duration-300"
                                />
                                <div
                                    className="absolute top-[15px] sm:top-[20px] lg:top-[25px] right-2 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 z-10 bg-no-repeat bg-center bg-[length:50%]"
                                    style={{ backgroundImage: "url('./asset/password.png')" }}
                                />
                            </div>

                            {/* Verification Code Input */}
                            <div
                                className={`relative transition-all duration-500 ${
                                    isVeriCodeLogin
                                        ? 'opacity-100 z-10'
                                        : 'opacity-0 -z-10'
                                }`}
                                style={{
                                    transform: isVeriCodeLogin
                                        ? window.innerWidth < 640 ? 'translateY(-60px)' : window.innerWidth < 1024 ? 'translateY(-75px)' : 'translateY(-90px)'
                                        : 'translateY(0px)'
                                }}
                            >
                                <span className="absolute top-1.5 sm:top-2 left-4 sm:left-7 text-slate-400 text-xs sm:text-sm font-sans">验证码</span>
                                <input
                                    type="text"
                                    value={loginForm.verificationCode}
                                    onChange={(e) => updateLoginForm('verificationCode', e.target.value)}
                                    className="w-full h-[50px] sm:h-[60px] lg:h-[70px] rounded-[12px] sm:rounded-[15px] lg:rounded-[18px] border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm text-white
                                               pt-4 sm:pt-5 pl-4 sm:pl-7 pr-24 sm:pr-32 lg:pr-52 pb-0 outline-none text-sm sm:text-base font-semibold font-sans
                                               focus:border-cyan-500/70 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] focus:bg-slate-800/70 transition-all duration-300"
                                />
                                <span
                                    className={`absolute right-2 sm:right-5 top-[15px] sm:top-[20px] lg:top-[25px] cursor-pointer text-xs sm:text-sm ${
                                        countdown > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-cyan-400 hover:text-cyan-300'
                                    } transition-colors duration-300`}
                                    onClick={handleVeriCodeClick}
                                >
                                    {veriCodeText}
                                </span>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row transform translate-y-0 sm:-translate-y-[60px] lg:-translate-y-[90px] gap-2 sm:gap-2">
                                <button
                                    className="w-full sm:flex-1 h-[45px] sm:h-[50px] lg:h-[60px] bg-slate-700/60 backdrop-blur-sm border border-slate-600/50 text-white rounded-full text-base sm:text-lg lg:text-xl font-semibold
                                               cursor-pointer font-sans transition-all duration-300 hover:bg-slate-600/70 hover:border-slate-500/70 hover:shadow-[0_0_15px_rgba(148,163,184,0.3)]"
                                    onClick={toggleLoginMode}
                                >
                                    {isVeriCodeLogin ? '密码登录' : '邮箱验证码登录'}
                                </button>
                                <button
                                    className="w-full sm:flex-1 h-[45px] sm:h-[50px] lg:h-[60px] bg-gradient-to-r from-cyan-600/80 to-blue-600/80 backdrop-blur-sm border border-cyan-500/50 text-white rounded-full text-base sm:text-lg lg:text-xl font-semibold
                                               cursor-pointer font-sans transition-all duration-300 hover:from-cyan-500/90 hover:to-blue-500/90 hover:border-cyan-400/70 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                    onClick={handleLogin}
                                >
                                    登录
                                </button>
                            </div>

                            {/* Other Login Options */}
                            <div className="transform translate-y-0 sm:translate-y-[-60%] lg:translate-y-[-60%]">
                                <div className="w-full my-3 sm:my-5 text-center flex items-center justify-between">
                                    <span className="inline-block max-w-[45%] w-[45%] flex-1 h-px bg-slate-500"></span>
                                    <span className="align-middle mx-3 sm:mx-5 leading-none inline-block w-8 sm:w-12 text-slate-400 text-sm sm:text-base">or</span>
                                    <span className="inline-block max-w-[45%] w-[45%] flex-1 h-px bg-slate-500"></span>
                                </div>
                                <div className="w-full flex justify-center items-center">
                                    <div
                                        className="border border-slate-500/50 bg-slate-800/30 backdrop-blur-sm p-1.5 sm:p-2 text-center rounded-lg cursor-pointer font-semibold
                                                    text-indigo-900 mx-1 sm:mx-2 hover:bg-slate-700/50 hover:border-slate-400/70 transition-all duration-300 hover:shadow-[0_0_10px_rgba(148,163,184,0.3)]"
                                        onClick={handleSocialLogin}
                                    >
                                        <img src="./asset/QQ.png" alt="QQ" className="w-6 h-6 sm:w-8 sm:h-8 align-middle" />
                                    </div>
                                    <div
                                        className="border border-slate-500/50 bg-slate-800/30 backdrop-blur-sm p-1.5 sm:p-2 text-center rounded-lg cursor-pointer font-semibold
                                                    text-indigo-900 mx-1 sm:mx-2 hover:bg-slate-700/50 hover:border-slate-400/70 transition-all duration-300 hover:shadow-[0_0_10px_rgba(148,163,184,0.3)]"
                                        onClick={handleSocialLogin}
                                    >
                                        <img src="./asset/WeChat.png" alt="WeChat" className="w-6 h-6 sm:w-8 sm:h-8 align-middle" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Signup Form */}
                    <div
                        className={`absolute transition-all duration-500 w-full ${
                            isSignup
                                ? 'opacity-100 z-10 transform translate-y-[20px] sm:translate-y-[30px] lg:translate-y-[50px]'
                                : 'opacity-0 z-0 transform translate-y-0'
                        }`}
                    >
                        <div className="text-white mb-4 sm:mb-6 lg:mb-8">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl my-3 sm:my-4 lg:my-5 font-serif tracking-wide">
                                申请新的账户.
                            </h1>
                            <div className="text-sm sm:text-base">
                                <span className="text-slate-300 font-sans">已经有账户了？ </span>
                                <span
                                    className="text-cyan-400 cursor-pointer font-sans hover:text-cyan-300 transition-colors"
                                    onClick={switchToLogin}
                                >
                                    登录
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                            {/* Account Input */}
                            <div className="relative">
                                <span className="absolute top-1.5 sm:top-2 left-4 sm:left-7 text-slate-400 text-xs sm:text-sm font-sans">账号</span>
                                <input
                                    type="text"
                                    value={signupForm.email}
                                    onChange={(e) => updateSignupForm('email', e.target.value)}
                                    className="w-full h-[50px] sm:h-[60px] lg:h-[70px] rounded-[12px] sm:rounded-[15px] lg:rounded-[18px] border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm text-white
                                               pt-4 sm:pt-5 px-4 sm:px-7 pb-0 outline-none text-sm sm:text-base font-semibold font-sans
                                               focus:border-cyan-500/70 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] focus:bg-slate-800/70 transition-all duration-300"
                                />
                                <div
                                    className="absolute top-[15px] sm:top-[20px] lg:top-[25px] right-2 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 z-10 bg-no-repeat bg-center bg-[length:50%]"
                                    style={{ backgroundImage: "url('./asset/email.png')" }}
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <span className="absolute top-1.5 sm:top-2 left-4 sm:left-7 text-slate-400 text-xs sm:text-sm font-sans">密码</span>
                                <input
                                    type="password"
                                    value={signupForm.password}
                                    onChange={(e) => updateSignupForm('password', e.target.value)}
                                    className="w-full h-[50px] sm:h-[60px] lg:h-[70px] rounded-[12px] sm:rounded-[15px] lg:rounded-[18px] border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm text-white
                                               pt-4 sm:pt-5 px-4 sm:px-7 pb-0 outline-none text-sm sm:text-base font-semibold font-sans tracking-wide
                                               focus:border-cyan-500/70 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] focus:bg-slate-800/70 transition-all duration-300"
                                />
                                <div
                                    className="absolute top-[15px] sm:top-[20px] lg:top-[25px] right-2 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 z-10 bg-no-repeat bg-center bg-[length:50%]"
                                    style={{ backgroundImage: "url('./asset/password.png')" }}
                                />
                            </div>

                            {/* Create Account Button */}
                            <button
                                className="w-full h-[45px] sm:h-[50px] lg:h-[60px] bg-gradient-to-r from-cyan-600/80 to-blue-600/80 backdrop-blur-sm border border-cyan-500/50 text-white rounded-full text-base sm:text-lg lg:text-xl font-semibold
                                           my-2 sm:my-4 cursor-pointer font-sans transition-all duration-300 hover:from-cyan-500/90 hover:to-blue-500/90 hover:border-cyan-400/70 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                onClick={handleSignup}
                            >
                                向管理员申请账户
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal with Glass Morphism Effect - 星空主题 */}
            {showModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    onClick={closeModal}
                >
                    {/* Backdrop with blur */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

                    {/* Modal Content */}
                    <div
                        className="relative bg-slate-800/40 backdrop-blur-md border border-slate-600/50
                                   rounded-xl sm:rounded-2xl p-6 sm:p-8 mx-2 sm:mx-4 max-w-sm sm:max-w-md w-full shadow-2xl
                                   transform transition-all duration-300 ease-out"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="text-center mb-4 sm:mb-6">
                            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 ${
                                modalContent.type === 'error' ? 'bg-red-500/20 border border-red-400/30' :
                                    modalContent.type === 'success' ? 'bg-green-500/20 border border-green-400/30' : 'bg-orange-500/20 border border-orange-400/30'
                            }`}>
                                {modalContent.type === 'error' ? (
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : modalContent.type === 'success' ? (
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                )}
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{modalContent.title}</h2>
                            <p className="text-slate-300 text-sm">
                                {modalContent.message}
                            </p>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-center">
                            <button
                                onClick={closeModal}
                                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 backdrop-blur-sm border border-cyan-500/50 text-white rounded-full
                                           font-semibold transition-all duration-300 text-sm sm:text-base
                                           hover:from-cyan-500/90 hover:to-blue-500/90 hover:border-cyan-400/70 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                            >
                                我知道了
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;