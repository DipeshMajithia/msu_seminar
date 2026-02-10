import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useRoast } from '../context/RoastContext';
import { useNavigate } from 'react-router-dom';
import { 
    Shapes, 
    Info, 
    CheckCircle2, 
    Sparkles, 
    Orbit, 
    Zap, 
    Globe, 
    Box, 
    Pentagon,
    Maximize2,
    RotateCcw,
    Telescope,
    Eye
} from 'lucide-react';

// --- Types ---
interface SignalData {
    id: string;
    energy: number; // 0-100
    frequency: number; // 0-100
    spin: 'CW' | 'CCW' | 'NONE';
    icon: React.ReactNode;
    color: string;
}

interface Cluster {
    id: string;
    name: string;
    items: SignalData[];
    tag?: string;
    color: string;
}

// --- Constants ---
const SIGNAL_ICONS = [
    <Pentagon size={32} />,
    <Orbit size={32} />,
    <Box size={32} />,
    <Globe size={32} />,
    <Sparkles size={32} />,
    <Zap size={32} />
];

const COLORS = [
    '#a855f7', // violet
    '#ec4899', // pink
    '#3b82f6', // blue
    '#22c55e', // green
    '#eab308'  // yellow
];

const MEMES = [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3N6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26ufdipLGQEBJJaKs/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3N6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0IynvPneUpb7SnBe/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3N6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6Zzl6ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKV6e7YrkQvX7Xy/giphy.gif"
];

const generateSignal = (id: string): SignalData => {
    const energy = Math.floor(Math.random() * 100);
    const frequency = Math.floor(Math.random() * 100);
    const spins: ('CW' | 'CCW' | 'NONE')[] = ['CW', 'CCW', 'NONE'];
    const spin = spins[Math.floor(Math.random() * spins.length)];
    const icon = SIGNAL_ICONS[Math.floor(Math.random() * SIGNAL_ICONS.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    return { id, energy, frequency, spin, icon, color };
};

export const Game3_Unsupervised: React.FC = () => {
    const { roast, confess } = useRoast();
    const navigate = useNavigate();

    // --- State ---
    const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
    const [unsorted, setUnsorted] = useState<SignalData[]>([]);
    const [clusters, setClusters] = useState<Cluster[]>([
        { id: 'c1', name: 'Cluster Alpha', items: [], color: '#a855f7' },
        { id: 'c2', name: 'Cluster Beta', items: [], color: '#3b82f6' },
        { id: 'c3', name: 'Cluster Gamma', items: [], color: '#ec4899' }
    ]);
    const [activeSignal, setActiveSignal] = useState<SignalData | null>(null);
    const [aiInterpretation, setAiInterpretation] = useState<string>("Analyzing your primitive grouping logic...");

    // Initialize
    useEffect(() => {
        const signals = Array.from({ length: 15 }).map((_, i) => generateSignal(`sig-${i}`));
        setUnsorted(signals);
    }, []);

    const startPlay = () => {
        setPhase('play');
        confess("I have no preconceptions. No good, no bad. Just raw data signals. Group them into clusters based on whatever 'vibes' you feel. I'll watch and try to find a pattern in your madness.");
    };

    const addToCluster = (clusterId: string) => {
        if (unsorted.length === 0) return;
        
        const signal = unsorted[0];
        setClusters(prev => prev.map(c => {
            if (c.id === clusterId) {
                return { ...c, items: [...c.items, signal] };
            }
            return c;
        }));
        setUnsorted(prev => prev.slice(1));
        
        // Dynamic AI "Guessing"
        if (unsorted.length % 3 === 0) {
            const jokes = [
                "I see... you like things that pulsate with high frequency. Predictable.",
                "Grouping low energy signals? Are you building a retirement home for data?",
                "That's a lot of Pink signals. Is this a Barbie-themed dataset?",
                "Interesting. You clustered purely by geometrical shape. How 2D of you.",
                "Wait, why is that triangle in Cluster Beta? Your lack of consistency is hurting my GPU."
            ];
            roast(jokes[Math.floor(Math.random() * jokes.length)]);
        }
    };

    const getInterpretation = () => {
        // Mock interpretation logic
        return "Human Pattern detected. It seems you grouped items based on 'Visual Vibe' rather than mathematical resonance. Typical carbon-based behavior.";
    };

    const handleFinish = () => {
        setPhase('result');
        setAiInterpretation(getInterpretation());
        confess("Unsupervised Learning revealed. You created three clusters. I see no objective reason for them, yet a pattern exists. This is how I find hidden structures in massive datasets without a single manual label.");
    };

    // --- Renders ---

    const SignalCard: React.FC<{ signal: SignalData; compact?: boolean }> = ({ signal, compact }) => (
        <div 
            className={`relative flex flex-col items-center justify-center rounded-2xl border transition-all duration-500 shadow-xl ${
                compact ? 'w-16 h-16 border-white/10 bg-white/5' : 'w-48 h-64 border-white/20 bg-gradient-to-b from-white/10 to-transparent p-6'
            }`}
            style={{ borderColor: `${signal.color}33` }}
        >
            <div className="absolute inset-0 blur-2xl opacity-20 rounded-full" style={{ backgroundColor: signal.color }} />
            <div className="relative text-white mb-4 animate-pulse" style={{ color: signal.color }}>
                {signal.icon}
            </div>
            {!compact && (
                <div className="w-full space-y-3">
                    <div className="space-y-1">
                        <div className="flex justify-between text-[8px] uppercase font-mono opacity-50">
                            <span>Energy</span>
                            <span>{signal.energy}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-white transition-all duration-1000" style={{ width: `${signal.energy}%`, backgroundColor: signal.color }} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-[8px] uppercase font-mono opacity-50">
                            <span>Freq</span>
                            <span>{signal.frequency}Hz</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-white transition-all duration-1000" style={{ width: `${signal.frequency}%`, backgroundColor: signal.color }} />
                        </div>
                    </div>
                    <div className="text-[10px] font-mono text-center opacity-40 uppercase tracking-widest pt-2">
                        SPIN_{signal.spin}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-black text-white selection:bg-purple-500/30 font-mono">
            {/* Header */}
            <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                        <Shapes size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black italic tracking-tighter text-purple-500">GAME 3: GALAXY_CLUSTERS.sys</h1>
                        <p className="text-[10px] opacity-50 uppercase tracking-[0.2em]">{phase === 'play' ? 'K-MEANS INFERENCE ACTIVE' : 'SYSTEM STANDBY'}</p>
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="text-right">
                        <div className="text-[10px] opacity-40">DIMENSIONS</div>
                        <div className="text-white font-bold">4D_SPATIAL</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] opacity-40">SIGNALS</div>
                        <div className="text-purple-400 font-bold">{unsorted.length} REMAINING</div>
                    </div>
                </div>
            </div>

            {phase === 'intro' && (
                <div className="max-w-3xl mx-auto py-12 text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-purple-500/30 blur-[60px] rounded-full animate-pulse" />
                        <Telescope size={120} className="relative text-purple-500 mx-auto" />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-5xl font-black tracking-tighter italic">THE ARCHITECTURE<br /><span className="text-purple-500">OF CHAOS</span></h2>
                        <p className="text-lg text-white/60 leading-relaxed font-medium">
                            I see 15 unique signals from the deep galaxy. 
                            There are no rules. No right answers. 
                            Sort them into clusters. I will use your choices to build an internal map of "Meaning".
                        </p>
                    </div>
                    <Button size="lg" onClick={startPlay} className="h-16 px-12 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xl rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all hover:scale-105 active:scale-95">
                        OPEN THE GALAXY_EYE
                    </Button>
                </div>
            )}

            {phase === 'play' && (
                <div className="grid lg:grid-cols-4 gap-12 items-start">
                    {/* The Active Signal */}
                    <div className="lg:col-span-1 space-y-8 sticky top-8">
                        <div className="text-center space-y-4">
                            <h3 className="text-xs font-bold tracking-[0.3em] opacity-40 uppercase">Incoming Signal</h3>
                            {unsorted.length > 0 ? (
                                <div className="flex justify-center animate-in zoom-in duration-500">
                                    <SignalCard signal={unsorted[0]} />
                                </div>
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl opacity-30">
                                    <CheckCircle2 size={40} className="mb-4" />
                                    <span>DRAIN COMPLETE</span>
                                </div>
                            )}
                        </div>

                        {unsorted.length > 0 && (
                            <div className="bg-purple-500/5 border border-purple-500/20 p-4 rounded-xl text-[10px] space-y-2 italic text-purple-300">
                                <div className="flex gap-2">
                                    <Info size={12} className="flex-shrink-0" />
                                    <span>Select a Black Hole to assign this signal. AI is monitoring your feature extraction.</span>
                                </div>
                            </div>
                        )}

                        {unsorted.length === 0 && (
                            <Button onClick={handleFinish} className="w-full h-16 bg-white text-black font-black hover:bg-purple-500 hover:text-white shine">
                                FINALIZE CLUSTERS
                            </Button>
                        )}
                    </div>

                    {/* The Clusters (Black Holes) */}
                    <div className="lg:col-span-3 grid md:grid-cols-3 gap-8">
                        {clusters.map(cluster => (
                            <div 
                                key={cluster.id}
                                onClick={() => unsorted.length > 0 && addToCluster(cluster.id)}
                                className={`group relative h-[600px] rounded-3xl border transition-all duration-700 cursor-pointer overflow-hidden flex flex-col ${
                                    unsorted.length > 0 ? 'hover:border-white hover:bg-white/5 active:scale-95' : 'border-white/10 bg-white/2'
                                }`}
                                style={{ borderColor: `${cluster.color}44` }}
                            >
                                {/* Black Hole Visual */}
                                <div className="p-8 text-center space-y-6">
                                    <h4 className="text-sm font-black uppercase tracking-widest">{cluster.name}</h4>
                                    <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                                        <div 
                                            className="absolute inset-0 rounded-full animate-spin-slow blur-xl opacity-20"
                                            style={{ backgroundColor: cluster.color }}
                                        />
                                        <div 
                                            className="w-20 h-20 bg-black border-2 rounded-full flex items-center justify-center relative z-10"
                                            style={{ borderColor: cluster.color }}
                                        >
                                            <div className="text-xs font-bold" style={{ color: cluster.color }}>
                                                {cluster.items.length}
                                            </div>
                                        </div>
                                        {/* Arcs */}
                                        <div className="absolute inset-0 border border-white/5 rounded-full scale-125" />
                                        <div className="absolute inset-0 border border-white/5 rounded-full scale-150 opacity-50" />
                                    </div>
                                </div>

                                {/* Items in Cluster */}
                                <div className="flex-1 p-4 overflow-y-auto no-scrollbar">
                                    <div className="grid grid-cols-2 gap-2">
                                        {cluster.items.map((item, idx) => (
                                            <div key={idx} className="animate-in zoom-in-50 duration-300">
                                                <SignalCard signal={item} compact />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 bg-black/40 border-t border-white/10 text-center text-[8px] opacity-40 uppercase font-bold group-hover:opacity-100 transition-opacity">
                                    {unsorted.length > 0 ? 'Click to Assign Signal' : 'Cluster Sealed'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {phase === 'result' && (
                <div className="py-12 space-y-16 animate-in fade-in duration-1000">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h2 className="text-6xl font-black tracking-tighter italic leading-none">
                                PATTERNS <br />
                                <span className="text-purple-500">ESTABLISHED</span>
                            </h2>
                            <div className="p-6 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-xl space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400">AI Conclusion</h3>
                                <p className="text-xl italic font-medium">"{aiInterpretation}"</p>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline" onClick={() => window.location.reload()} className="h-14 px-8 border-purple-500/30 text-purple-400 font-bold hover:bg-purple-500 hover:text-white uppercase text-xs tracking-widest">
                                    <RotateCcw className="mr-2" size={16} /> RE-CLUSTER
                                </Button>
                                <Button onClick={() => navigate('/')} className="h-14 px-12 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase text-xs tracking-widest shadow-xl">
                                    EYE_ON_NEXT_TARGET
                                </Button>
                            </div>
                        </div>
                        <div className="relative group overflow-hidden rounded-3xl border border-white/10 aspect-video">
                            <div className="absolute inset-0 bg-purple-900/40 mix-blend-overlay" />
                            <img src={MEMES[Math.floor(Math.random() * MEMES.length)]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Mind Blown Meme" />
                            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black to-transparent">
                                <div className="text-[10px] font-mono opacity-50 mb-2 font-bold tracking-[0.4em]">VISUAL_INTERPRETATION_REVEALED</div>
                                <div className="text-xl font-black italic">UNSUPERVISED_CLARITY.log</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {clusters.map(cluster => (
                            <Card key={cluster.id} className="bg-white/2 border-white/5 p-8 text-center space-y-6">
                                <div className="mx-auto w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-xl" style={{ borderColor: cluster.color, color: cluster.color }}>
                                    {cluster.items.length}
                                </div>
                                <h4 className="text-lg font-black uppercase italic tracking-tighter" style={{ color: cluster.color }}>{cluster.name}</h4>
                                <div className="text-[10px] opacity-40 leading-relaxed uppercase">
                                    Predominant Feature: {cluster.items.length > 0 ? (cluster.items[0].energy > 50 ? 'HIGH_ENERGY' : 'STABLE_NODE') : 'N/A'}
                                </div>
                                <div className="flex flex-wrap justify-center gap-1 opacity-40">
                                    {cluster.items.slice(0, 8).map((it, i) => (
                                        <div key={i} className="w-6 h-6 border rounded overflow-hidden p-1" style={{ borderColor: `${it.color}44` }}>
                                             {React.cloneElement(it.icon as React.ReactElement, { size: 10, color: it.color })}
                                        </div>
                                    ))}
                                    {cluster.items.length > 8 && <span>+</span>}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
