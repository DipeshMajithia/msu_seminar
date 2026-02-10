import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full border-t border-border/40 bg-background py-6 mt-auto">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row px-4">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built for the <span className="font-semibold text-foreground">AI Seminar</span>.
                    Learn by failing.
                </p>
                <p className="text-center text-sm text-muted-foreground">
                    Powered by <span className="font-mono text-xs">Kokoro-82M</span>
                </p>
            </div>
        </footer>
    );
};
