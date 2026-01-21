const Loader = () => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
            <div className="relative">
                {/* Base Text (Outline/Gray) */}
                <h1 className="text-6xl md:text-8xl font-black text-gray-200 tracking-tighter select-none">
                    FINSIGHT
                </h1>

                {/* Flooding Text (Teal) */}
                <h1 className="absolute inset-0 text-6xl md:text-8xl font-black text-teal-600 tracking-tighter select-none overflow-hidden animate-flood">
                    FINSIGHT
                </h1>
            </div>

            <style>{`
                @keyframes flood {
                    0% { clip-path: inset(100% 0 0 0); }
                    100% { clip-path: inset(0 0 0 0); }
                }
                .animate-flood {
                    animation: flood 2s ease-in-out infinite alternate;
                }
            `}</style>
        </div>
    );
};

export default Loader;
