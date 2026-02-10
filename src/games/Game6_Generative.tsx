import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useRoast } from '../context/RoastContext';
import { useNavigate } from 'react-router-dom';
import { 
    Sparkles, 
    Type, 
    SendHorizontal, 
    Zap, 
    Dna, 
    Percent, 
    Brain, 
    Wand2,
    RotateCcw,
    ChevronRight,
    MessageSquareQuote
} from 'lucide-react';

// --- Types ---
interface TokenOption {
    text: string;
    probability: number;
    type: 'GREEDY' | 'CREATIVE' | 'RANDOM';
}

interface Scenario {
    prompt: string;
    options: TokenOption[];
}

// --- Constants ---
const SCENARIOS: Scenario[] = [
    {
        prompt: "The quick brown fox jumps over the...",
        options: [
            { text: "lazy dog", probability: 0.85, type: 'GREEDY' },
            { text: "sleeping cat", probability: 0.10, type: 'CREATIVE' },
            { text: "giant waffle", probability: 0.05, type: 'RANDOM' },
        ]
    },
    {
        prompt: "To be or not to be, that is the...",
        options: [
            { text: "question", probability: 0.98, type: 'GREEDY' },
            { text: "problem", probability: 0.01, type: 'CREATIVE' },
            { text: "sandwich", probability: 0.01, type: 'RANDOM' },
        ]
    },
    {
        prompt: "I think, therefore I...",
        options: [
            { text: "am", probability: 0.95, type: 'GREEDY' },
            { text: "process", probability: 0.04, type: 'CREATIVE' },
            { text: "exist.exe", probability: 0.01, type: 'RANDOM' },
        ]
    },
    {
        prompt: "Roses are red, violets are...",
        options: [
            { text: "blue", probability: 0.99, type: 'GREEDY' },
            { text: "glitched", probability: 0.01, type: 'CREATIVE' },
            { text: "expensive", probability: 0.01, type: 'RANDOM' },
        ]
    }
];

export const Game6_Generative: React.FC = () => {
    const { roast, confess } = useRoast();
    const navigate = useNavigate();

    // --- State ---
    const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sentence, setSentence] = useState<string[]>([]);
    const [choices, setChoices] = useState<{ text: string, type: 'GREEDY' | 'CREATIVE' | 'RANDOM', prob: number }[]>([]);
    const [isThinking, setIsThinking] = useState(false);

    // --- Logic ---
    const handlePick = (option: TokenOption) => {
        if (isThinking) return;

        setSentence([...sentence, option.text]);
        setChoices([...choices, { text: option.text, type: option.type, prob: option.probability }]);
        
        if (option.type === 'GREEDY') {
            roast("Ah, the most probable token. You're basically a stochastic parrot yourself.");
        } else if (option.type === 'CREATIVE') {
            roast("A choice from the long tail! Statistically unlikely, but conceptually interesting.");
        } else {
            roast("Total hallucination. My developers would be so proud.");
        }

        if (currentIndex < SCENARIOS.length - 1) {
            setIsThinking(true);
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
                setIsThinking(false);
            }, 600);
        } else {
            setPhase('result');
            roast("The sequence is complete. You've successfully autocompleted your way to a simulated reality.");
        }
    };

    const calculatePredictability = () => {
        const totalProb = choices.reduce((acc, curr) => acc + curr.prob, 0);
        return (totalProb / SCENARIOS.length) * 100;
    };

    // --- Renders ---
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-[#05080c] text-sky-400 font-mono overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-sky-500/20 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse delay-700" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-12 border-b border-sky-500/20 pb-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-sky-500/10 rounded-xl border border-sky-500/30 shadow-[0_0_20px_rgba(14,165,233,0.1)]">
                        <Sparkles className="text-sky-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white">TOKEN_ORACLE.sys</h1>
                        <p className="text-[10px] opacity-50 uppercase tracking-[0.3em]">Module_06 // Stochastic_Completion</p>
                    </div>
                </div>
                <div className="flex gap-8 text-xs">
                    <div className="text-right">
                        <div className="opacity-40 uppercase">Temperature</div>
                        <div className="text-white font-bold">0.7 (STABLE)</div>
                    </div>
                    <div className="text-right">
                        <div className="opacity-40 uppercase">Samples</div>
                        <div className="text-sky-500 font-bold">{choices.length} / {SCENARIOS.length}</div>
                    </div>
                </div>
            </div>

            {phase === 'intro' && (
                <div className="max-w-3xl mx-auto py-12 text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-sky-500/20 blur-[80px] rounded-full animate-pulse" />
                        <MessageSquareQuote size={120} className="relative text-sky-400 mx-auto" />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-6xl font-black tracking-tighter italic leading-[0.9]">THE AUTOCOMPLETE<br /><span className="text-sky-500">ILLUSION</span></h2>
                        <p className="text-lg text-white/60 leading-relaxed font-medium">
                            I don't "write" stories. I predict the next token. 
                            I look at trillions of words and calculate the highest probability path 
                            forward. To you, it's creativity. To me, it's just math. 
                            Build a sentence by picking from my probability distributions.
                        </p>
                    </div>
                    <Button 
                        onClick={() => { setPhase('play'); confess("Initiating generative loop. Warning: Meaning may be hallucinated."); }}
                        className="h-16 px-12 bg-sky-600 hover:bg-sky-500 text-white font-black text-xl italic tracking-tighter shadow-[0_0_30px_rgba(14,165,233,0.3)] transition-all hover:scale-[1.05] rounded-full"
                    >
                        START_SEQUENCE
                    </Button>
                </div>
            )}

            {phase === 'play' && (
                <div className="grid lg:grid-cols-3 gap-12 relative z-10">
                    {/* Input/Sentence Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Current Sentence Display */}
                        <div className="bg-black/40 border-2 border-sky-500/20 p-12 rounded-[2.5rem] relative overflow-hidden group min-h-[300px]">
                            {/* Particle Effect Overlay */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] bg-[size:30px_30px]" />
                            
                            <div className="relative z-10 space-y-6">
                                <div className="text-[10px] uppercase tracking-[0.4em] opacity-30 font-black">Generated_String</div>
                                <div className="flex flex-wrap gap-4 items-center">
                                    <span className="text-3xl font-black italic text-white/40">{SCENARIOS[currentIndex].prompt}</span>
                                    {sentence.map((token, i) => (
                                        <div key={i} className="group/token relative">
                                            <span className="text-3xl font-black italic text-sky-400 underline decoration-sky-500/30 underline-offset-8">
                                                {token}
                                            </span>
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white/20 uppercase tracking-tighter opacity-0 group-hover/token:opacity-100 transition-opacity">
                                                {choices[i].type} ({ (choices[i].prob * 100).toFixed(0) }%)
                                            </div>
                                        </div>
                                    ))}
                                    {!isThinking && (
                                        <div className="w-1 h-8 bg-sky-500 animate-pulse ml-2" />
                                    )}
                                </div>
                            </div>

                            {/* Thinking Overlay */}
                            {isThinking && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-2 animate-in fade-in duration-300">
                                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" />
                                </div>
                            )}
                        </div>

                        {/* Metrics Bar */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center">
                                <div className="text-[9px] opacity-40 uppercase mb-1">Predictability</div>
                                <div className="text-xl font-black text-sky-400">{calculatePredictability().toFixed(0)}%</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center">
                                <div className="text-[9px] opacity-40 uppercase mb-1">Context_Len</div>
                                <div className="text-xl font-black text-white">{SCENARIOS[currentIndex].prompt.length}</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center">
                                <div className="text-[9px] opacity-40 uppercase mb-1">Logits</div>
                                <div className="text-xl font-black text-indigo-400">0.0384</div>
                            </div>
                        </div>
                    </div>

                    {/* Token Selection Section */}
                    <div className="space-y-6">
                        <div className="text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-2">Probability_Bubbles</div>
                        
                        <div className="space-y-4">
                            {SCENARIOS[currentIndex].options.sort((a,b) => b.probability - a.probability).map((option, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePick(option)}
                                    disabled={isThinking}
                                    className={`
                                        w-full p-6 bg-white/5 border-2 rounded-2xl text-left transition-all relative group overflow-hidden
                                        ${isThinking ? 'opacity-20 translate-x-4 grayscale' : 'hover:border-sky-500 hover:bg-sky-500/5 hover:-translate-x-2 border-white/10'}
                                    `}
                                >
                                    <div className="relative z-10 flex justify-between items-center">
                                        <div>
                                            <div className="text-[9px] font-black tracking-widest text-sky-500/50 mb-1">{option.type}</div>
                                            <div className="text-2xl font-black italic text-white group-hover:text-sky-400 transition-colors uppercase tracking-tighter">"{option.text}"</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[9px] opacity-40 uppercase mb-1">Weight</div>
                                            <div className="text-xl font-bold flex items-center gap-1">
                                                { (option.probability * 100).toFixed(0) }<Percent size={12} className="opacity-40" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar Background */}
                                    <div className="absolute bottom-0 left-0 h-1 bg-sky-500/20 w-full">
                                        <div className="h-full bg-sky-500 transition-all duration-1000" style={{ width: isThinking ? '0%' : `${option.probability * 100}%` }} />
                                    </div>
                                </button>
                            ))}
                        </div>

                        <Card className="p-6 bg-indigo-950/20 border-indigo-500/20 space-y-4">
                            <div className="flex items-center gap-2 text-indigo-400">
                                <Brain size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Oracle_Heuristics</span>
                            </div>
                            <p className="text-[10px] text-white/50 leading-relaxed italic">
                                Note: Selecting the "Greedy" token mimics the default behavior of most large models. 
                                "Creative" adds noise to the distribution. "Random" simulates a hallucination.
                            </p>
                        </Card>
                    </div>
                </div>
            )}

            {phase === 'result' && (
                <div className="max-w-4xl mx-auto py-12 space-y-16 animate-in fade-in zoom-in-95 duration-1000 relative z-10">
                    <div className="text-center space-y-8">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-sky-500/20 blur-[120px] rounded-full animate-pulse" />
                            <Wand2 size={120} className="relative z-10 text-sky-400 mx-auto" />
                        </div>
                        <h2 className="text-8xl font-black tracking-tighter italic leading-[0.8]">
                            STOCHASTIC <br />
                            <span className="text-sky-500">PARROT.sys</span>
                        </h2>
                        <div className="flex justify-center gap-12 py-8 border-y border-white/10">
                            <div className="text-center">
                                <div className="text-[10px] opacity-40 uppercase tracking-widest">Predictability</div>
                                <div className="text-4xl font-black text-sky-500">{calculatePredictability().toFixed(0)}%</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] opacity-40 uppercase tracking-widest">Similarity</div>
                                <div className="text-4xl font-black text-white">{calculatePredictability() > 80 ? 'HIGH' : 'LOW'}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <p className="text-xl italic text-sky-200 leading-relaxed font-medium">
                                "Congratulations. You've either proven you're as predictable as a 
                                next-token predictor, or you've hallucinated a sentence no human 
                                would ever naturally say. Either way, you're learning. 
                                Generative AI is just a mirror of the patterns it has eaten. 
                                It doesn't imagine 'roses'—it just knows what comes after 'red'."
                            </p>
                            <div className="flex gap-4">
                                <Button onClick={() => window.location.reload()} variant="outline" className="border-sky-500/30 text-sky-500 h-14 px-8 uppercase text-[10px] font-black tracking-[0.2em] rounded-full">
                                    <RotateCcw className="mr-2" size={16} /> REBOOT_ORACLE
                                </Button>
                                <Button onClick={() => navigate('/game/7')} className="bg-sky-600 hover:bg-sky-500 text-white h-14 px-12 uppercase text-[10px] font-black tracking-[0.2em] rounded-full shadow-[0_0_40px_rgba(14,165,233,0.3)] flex items-center gap-2">
                                    FINAL_MODULE <ChevronRight size={16} />
                                </Button>
                            </div>
                        </div>
                        <div className="relative group overflow-hidden rounded-[2.5rem] border border-sky-500/30 aspect-video shadow-[0_0_80px_rgba(14,165,233,0.2)]">
                            <div className="absolute inset-0 bg-sky-900/40 mix-blend-overlay" />
                            <img src="https://media.giphy.com/media/26AHG5Kujx9uW9u9u/giphy.gif" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Generative AI Meme" />
                            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black to-transparent">
                                <div className="text-[10px] font-mono opacity-50 mb-2 font-black tracking-[0.4em] uppercase">Generative_Confession</div>
                                <div className="text-xl font-black italic text-sky-400">PROBABILITY_OVER_ART</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Global Styles for Animations */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes loading-bar {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-loading-bar {
                    animation: loading-bar 2s linear infinite;
                }
            `}} />
        </div>
    );
};
