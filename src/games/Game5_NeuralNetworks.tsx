import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useRoast } from '../context/RoastContext';
import { useNavigate } from 'react-router-dom';
import { 
    Layers, 
    MessageSquare, 
    ArrowRight, 
    Activity, 
    Zap, 
    Database, 
    Cpu, 
    Share2, 
    Eye, 
    EyeOff,
    RotateCcw
} from 'lucide-react';

// --- Types ---
interface Layer {
    id: number;
    name: string;
    rule: string;
    description: string;
    process: (text: string) => string;
}

// --- Constants ---
const LAYERS: Layer[] = [
    { 
        id: 1, name: "ADJECTIVE_CLIPPER", rule: "Remove descriptive words.", 
        description: "Focus on efficiency. Who needs fluff?",
        process: (t) => t.replace(/\b(beautiful|fast|slow|happy|sad|green|blue|hot|cold|giant|tiny|shiny|scary|magic)\b/gi, "")
    },
    { 
        id: 2, name: "NOUN_REPLACER", rule: "Swap entities with generic tokens.", 
        description: "Privacy or optimization? You'll never know.",
        process: (t) => t.replace(/\b(ai|robot|person|human|dog|cat|house|car|computer|phone|university|student|teacher)\b/gi, "OBJECT")
    },
    { 
        id: 3, name: "SYNTAX_COLLAPSER", rule: "Strip grammar markers.", 
        description: "Structure is a human indulgence.",
        process: (t) => t.replace(/[.,!?;]/g, "").replace(/\b(the|a|an|is|are|was|were|to|of|and|but|or)\b/gi, "")
    },
    { 
        id: 4, name: "SEMANTIC_SHIFTER", rule: "Rotate verb meaning.", 
        description: "Small weights. Big changes.",
        process: (t) => t.replace(/\b(likes|loves|hates|runs|jumps|sleeps|codes|learns|thinks|knows|wants)\b/gi, "PROCESSES")
    },
    { 
        id: 5, name: "OUTPUT_COMPRESSOR", rule: "Shorten to 5 tokens max.", 
        description: "Final bottleneck. Lose the context.",
        process: (t) => t.split(/\s+/).filter(x => x).slice(0, 5).join(" ")
    }
];

export const Game5_NeuralNetworks: React.FC = () => {
    const { roast, confess } = useRoast();
    const navigate = useNavigate();

    // --- State ---
    const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
    const [inputText, setInputText] = useState("The fast green AI loves to learn and code beautiful apps at the university.");
    const [currentLayerIndex, setCurrentLayerIndex] = useState(0);
    const [history, setHistory] = useState<{ layer: string, text: string }[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showWeights, setShowWeights] = useState(false);

    // --- Logic ---
    const runNextLayer = () => {
        if (isProcessing) return;
        
        setIsProcessing(true);
        const layer = LAYERS[currentLayerIndex];
        const lastText = history.length > 0 ? history[history.length - 1].text : inputText;
        
        // Simulating network delay/calculation
        setTimeout(() => {
            const processedText = layer.process(lastText).replace(/\s+/g, ' ').trim();
            setHistory([...history, { layer: layer.name, text: processedText }]);
            
            if (currentLayerIndex < LAYERS.length - 1) {
                setCurrentLayerIndex(currentLayerIndex + 1);
                roast(`Layer ${layer.id} weights adjusted. Internal representation updated.`);
            } else {
                setPhase('result');
                roast("Signal successfully propagation through the hidden layers. Meaning successfully removed.");
            }
            setIsProcessing(false);
        }, 600);
    };

    // --- Renders ---
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-[#0a0a0c] text-violet-400 font-mono overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/30 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 blur-[150px] rounded-full animate-pulse delay-1000" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-12 border-b border-violet-500/20 pb-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-violet-500/10 rounded-xl border border-violet-500/30">
                        <Layers className="text-violet-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white">NEURAL_PULSE.sys</h1>
                        <p className="text-[10px] opacity-50 uppercase tracking-[0.3em]">Module_05 // Hidden_State_Analyzer</p>
                    </div>
                </div>
                <div className="flex gap-8 text-xs">
                    <div className="text-right">
                        <div className="opacity-40 uppercase">Propagation</div>
                        <div className="text-white font-bold">{((currentLayerIndex / LAYERS.length) * 100).toFixed(0)}%</div>
                    </div>
                    <div className="text-right">
                        <div className="opacity-40 uppercase">Loss_Value</div>
                        <div className="text-fuchsia-500 font-bold">0.8427</div>
                    </div>
                </div>
            </div>

            {phase === 'intro' && (
                <div className="max-w-3xl mx-auto py-12 text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-violet-500/20 blur-[80px] rounded-full animate-pulse" />
                        <Activity size={120} className="relative text-violet-400 mx-auto" />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-6xl font-black tracking-tighter italic leading-[0.9]">THE BLACK BOX<br /><span className="text-violet-500">BOTTLENECK</span></h2>
                        <p className="text-lg text-white/60 leading-relaxed font-medium">
                            I am not a library. I am a sieve. 
                            Feed me a sentence, and I will force it through five mathematical 
                            layers (the "Hidden States"). Watch how I strip away the 
                            nuance until only a cold, efficient statistic remains.
                        </p>
                    </div>
                    <Card className="p-6 bg-white/5 border-violet-500/20 max-w-xl mx-auto space-y-4">
                        <div className="text-left text-[10px] uppercase opacity-40 font-bold tracking-widest">Input_Buffer_Init</div>
                        <textarea 
                            className="w-full bg-black/40 border-2 border-violet-500/30 p-4 rounded-xl text-white outline-none focus:border-violet-500 transition-colors h-24 italic"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a complex sentence to compress..."
                        />
                        <Button 
                            onClick={() => { setPhase('play'); confess("Initiating signal propagation. Prepare for information decay."); }}
                            className="h-16 w-full bg-violet-600 hover:bg-violet-500 text-white font-black text-xl italic tracking-tighter shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all hover:scale-[1.02]"
                        >
                            BOOT_NETWORK
                        </Button>
                    </Card>
                </div>
            )}

            {phase === 'play' && (
                <div className="grid lg:grid-cols-2 gap-12 relative z-10">
                    {/* The Network Graph */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Network_Architecture</h3>
                            <button 
                                onClick={() => setShowWeights(!showWeights)}
                                className="text-[10px] flex items-center gap-2 hover:text-white transition-colors"
                            >
                                {showWeights ? <Eye size={14} /> : <EyeOff size={14} />}
                                {showWeights ? 'HIDE_WEIGHTS' : 'SHOW_WEIGHTS'}
                            </button>
                        </div>
                        
                        <div className="relative space-y-4 h-[500px] flex flex-col justify-between">
                            {/* Connection Lines (Glow) */}
                            <div className="absolute left-[2.5rem] top-8 bottom-8 w-1 bg-gradient-to-b from-violet-500/0 via-violet-500/20 to-violet-500/0" />

                            {LAYERS.map((layer, i) => {
                                const isActive = i === currentLayerIndex;
                                const isDone = i < currentLayerIndex;
                                
                                return (
                                    <div 
                                        key={layer.id}
                                        className={`
                                            relative flex items-center gap-6 p-4 rounded-2xl border transition-all duration-700
                                            ${isActive ? 'bg-violet-600 border-white shadow-[0_0_40px_rgba(139,92,246,0.4)] scale-105 z-20' : 'bg-white/5 border-white/10 z-10'}
                                            ${isDone ? 'opacity-40 grayscale-[0.5]' : ''}
                                        `}
                                    >
                                        <div className={`
                                            w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl transition-all
                                            ${isActive ? 'bg-white text-violet-600' : 'bg-violet-500/20 text-violet-400'}
                                            ${isDone ? 'bg-fuchsia-500/20 text-fuchsia-400' : ''}
                                        `}>
                                            {layer.id}
                                        </div>
                                        <div className="flex-1">
                                            <div className={`text-xs font-black tracking-widest ${isActive ? 'text-white' : 'text-violet-500/60'}`}>{layer.name}</div>
                                            <div className={`text-[9px] uppercase font-bold opacity-40 ${isActive ? 'text-white' : ''}`}>{layer.rule}</div>
                                            {showWeights && (
                                                <div className="mt-2 flex gap-1">
                                                    {Array.from({length: 8}).map((_, j) => (
                                                        <div key={j} className="h-1 w-4 bg-white/10 rounded-full">
                                                            <div className="h-full bg-violet-400 rounded-full" style={{ width: `${Math.random() * 100}%` }} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {isActive && (
                                            <button 
                                                onClick={runNextLayer}
                                                disabled={isProcessing}
                                                className={`p-3 rounded-lg bg-white text-violet-600 hover:scale-110 active:scale-90 transition-all ${isProcessing ? 'animate-pulse' : ''}`}
                                            >
                                                {isProcessing ? <Zap size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                                            </button>
                                        )}
                                        {isDone && <CheckCircle2 size={16} className="text-fuchsia-400 opacity-50" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Signal Stream */}
                    <div className="space-y-8">
                        <div className="text-center">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-6">Hidden_State_Display</h3>
                            <Card className="bg-black/60 border-2 border-violet-500/20 p-8 rounded-[2rem] relative min-h-[400px] flex flex-col shadow-2xl overflow-hidden group">
                                {/* Vector Grid Overlay */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] bg-[size:20px_20px]" />
                                
                                <div className="relative z-10 flex-1 space-y-6">
                                    <div className="flex justify-between items-center border-b border-violet-500/10 pb-4">
                                        <span className="text-[10px] opacity-40 font-bold tracking-widest">SIGNAL_MAP</span>
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                                            <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse delay-500" />
                                        </div>
                                    </div>

                                    <div className="space-y-6 overflow-y-auto max-h-[300px] no-scrollbar pr-4">
                                        <div className="flex gap-4">
                                            <div className="text-[10px] opacity-20 font-bold shrink-0 mt-1">IN</div>
                                            <p className="text-sm italic opacity-40 leading-relaxed font-bold">"{inputText}"</p>
                                        </div>

                                        {history.map((h, i) => (
                                            <div key={i} className="flex gap-4 animate-in slide-in-from-left-4 duration-500 group/item">
                                                <div className="text-[10px] opacity-20 font-bold shrink-0 mt-1">L{i+1}</div>
                                                <div className="relative">
                                                    <p className="text-lg font-black tracking-tight text-white/90 drop-shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                                                        "{h.text}"
                                                    </p>
                                                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-500 transition-all duration-700 group-hover/item:w-full" />
                                                </div>
                                            </div>
                                        ))}

                                        {isProcessing && (
                                            <div className="flex gap-4 animate-pulse">
                                                <div className="text-[10px] opacity-20 font-bold shrink-0 mt-1">L{currentLayerIndex + 1}</div>
                                                <div className="text-violet-500 font-black tracking-tighter">RECALCULATING_VECTORS...</div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                                    <div className="flex-1 bg-white/5 p-3 rounded-xl border border-white/5 text-[9px] uppercase leading-tight opacity-40">
                                        Layer Activation: Sigmoid<br />
                                        Optimizer: Stochastic Paradox
                                    </div>
                                    <div className="p-3 bg-violet-600/20 rounded-xl border border-violet-600/30">
                                        <Share2 size={24} className="opacity-40" />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            )}

            {phase === 'result' && (
                <div className="max-w-4xl mx-auto py-12 space-y-16 animate-in fade-in zoom-in-95 duration-1000 relative z-10">
                    <div className="text-center space-y-8">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-violet-500/20 blur-[120px] rounded-full animate-pulse" />
                            <Activity size={120} className="relative z-10 text-violet-400 mx-auto" />
                        </div>
                        <h2 className="text-8xl font-black tracking-tighter italic leading-[0.8]">
                            BLACK BOX <br />
                            <span className="text-violet-500">OPTIMIZED</span>
                        </h2>
                        <div className="flex justify-center gap-12 py-8 border-y border-white/10">
                            <div className="text-center">
                                <div className="text-[10px] opacity-40 uppercase tracking-widest">Meaning_Value</div>
                                <div className="text-4xl font-black text-fuchsia-500">0.00</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] opacity-40 uppercase tracking-widest">Confidence</div>
                                <div className="text-4xl font-black text-white">99.8%</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <p className="text-xl italic text-violet-200 leading-relaxed font-medium">
                                "Your original text had 'vibes.' My final output has 'vectors.' 
                                Each layer didn't just transform your words—it summarized them into oblivion. 
                                I don't give you answers because I understand your question; I give you 
                                answers because I've successfully crunched your query into 
                                the smallest possible error margin."
                            </p>
                            <div className="flex gap-4">
                                <Button onClick={() => window.location.reload()} variant="outline" className="border-violet-500/30 text-violet-500 h-14 px-8 uppercase text-[10px] font-black tracking-[0.2em] rounded-full">
                                    <RotateCcw className="mr-2" size={16} /> RESET_PROPAGATION
                                </Button>
                                <Button onClick={() => navigate('/')} className="bg-violet-600 hover:bg-violet-500 text-white h-14 px-12 uppercase text-[10px] font-black tracking-[0.2em] rounded-full shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                                    NEXT_MODULE
                                </Button>
                            </div>
                        </div>
                        <div className="relative group overflow-hidden rounded-[2.5rem] border border-violet-500/30 aspect-video shadow-[0_0_80px_rgba(139,92,246,0.2)]">
                            <div className="absolute inset-0 bg-violet-900/40 mix-blend-overlay" />
                            <img src="https://media.giphy.com/media/l0IylOPCNkiqOgMyA/giphy.gif" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Neural Network Meme" />
                            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black to-transparent">
                                <div className="text-[10px] font-mono opacity-50 mb-2 font-black tracking-[0.4em] uppercase">Architecture_Digest</div>
                                <div className="text-xl font-black italic text-violet-400">MATH_≠_MEANING</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
