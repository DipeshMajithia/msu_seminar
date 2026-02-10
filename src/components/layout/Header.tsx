import React from 'react';
import { Brain, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRoast } from '../../context/RoastContext';

export const Header: React.FC = () => {
    const { isSpeaking, stop, initializeVoice, voiceStatus } = useRoast();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity">
                    <Brain className="h-6 w-6 text-primary" />
                    <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                        CONFESSIONS OF AN AI
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground hidden md:block">
                        Status: <span className="text-foreground font-medium">{isSpeaking ? 'Roasting...' : 'Waiting'}</span>
                    </div>

                    {voiceStatus === 'idle' && (
                        <button 
                            onClick={initializeVoice}
                            className="bg-primary/20 hover:bg-primary/30 text-primary text-xs px-3 py-1 rounded-full flex items-center gap-2 transition-colors"
                        >
                             Download Voice (80MB)
                        </button>
                    )}
                    {voiceStatus === 'loading' && (
                         <span className="text-xs text-muted-foreground animate-pulse">Loading Voice...</span>
                    )}
                     {voiceStatus === 'error' && (
                         <span className="text-xs text-destructive" title="Failed to load">Voice Error (Using Fallback)</span>
                    )}

                    <button
                        onClick={stop}
                        className={`p-2 rounded-full transition-colors ${isSpeaking ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : 'hover:bg-accent text-muted-foreground'}`}
                        title={isSpeaking ? "Shut up" : "AI Silent"}
                    >
                        {isSpeaking ? <Volume2 className="h-5 w-5 animate-pulse" /> : <VolumeX className="h-5 w-5" />}
                    </button>
                </div>
            </div>
        </header>
    );
};
