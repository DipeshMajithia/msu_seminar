import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useRoast } from '../context/RoastContext';
import { useNavigate } from 'react-router-dom';
import { 
    Zap, 
    Target, 
    Smartphone, 
    Battery, 
    Cookie, 
    Skull,
    TrendingUp,
    History,
    Dna,
    Play,
    RotateCcw,
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight
} from 'lucide-react';

// --- Constants ---
const GRID_SIZE = 5;
const INITIAL_POS = { x: 0, y: 0 };
const GOAL_POS = { x: 4, y: 4 };
const TRAPS = [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 1, y: 3 }, { x: 3, y: 3 }];

interface QTable {
    [key: string]: { [key: string]: number };
}

interface Action {
    x: number;
    y: number;
    name: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
}

const ACTIONS: Action[] = [
    { x: 0, y: -1, name: 'UP' },
    { x: 0, y: 1, name: 'DOWN' },
    { x: -1, y: 0, name: 'LEFT' },
    { x: 1, y: 0, name: 'RIGHT' },
];

export const Game4_Reinforcement: React.FC = () => {
    const { roast, confess } = useRoast();
    const navigate = useNavigate();

    // --- State ---
    const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
    const [pos, setPos] = useState(INITIAL_POS);
    const [qTable, setQTable] = useState<QTable>({});
    const [episode, setEpisode] = useState(0);
    const [steps, setSteps] = useState(0);
    const [totalReward, setTotalReward] = useState(0);
    const [isHacking, setIsHacking] = useState(false);
    const [lastAction, setLastAction] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'good' | 'bad', id: number } | null>(null);
    
    // Auto-step ref
    const stepTimerRef = useRef<NodeJS.Timeout | null>(null);

    // --- Logic ---

    const getBestAction = useCallback((x: number, y: number) => {
        const stateKey = `${x},${y}`;
        const stateQ = qTable[stateKey] || { UP: 0, DOWN: 0, LEFT: 0, RIGHT: 0 };
        
        // Epsilon-greedy (exploration)
        if (Math.random() < 0.2) {
            return ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
        }

        let bestActionName = ACTIONS[0].name;
        let maxVal = stateQ[bestActionName];

        ACTIONS.forEach(a => {
            if (stateQ[a.name] > maxVal) {
                maxVal = stateQ[a.name];
                bestActionName = a.name;
            }
        });

        return ACTIONS.find(a => a.name === bestActionName)!;
    }, [qTable]);

    const moveAI = useCallback(() => {
        const action = getBestAction(pos.x, pos.y);
        const newX = Math.max(0, Math.min(GRID_SIZE - 1, pos.x + action.x));
        const newY = Math.max(0, Math.min(GRID_SIZE - 1, pos.y + action.y));
        
        setPos({ x: newX, y: newY });
        setLastAction(action.name);
        setSteps(s => s + 1);

        // Check for traps
        if (TRAPS.some(t => t.x === newX && t.y === newY)) {
            roast("I walked right into a pit. My circuits are sizzling. Is this the 'optimized' path you wanted?");
        }
    }, [pos, getBestAction, roast]);

    const giveReward = (val: number) => {
        if (!lastAction) return;

        const stateKey = `${pos.x},${pos.y}`;
        setQTable(prev => {
            const currentQ = prev[stateKey] || { UP: 0, DOWN: 0, LEFT: 0, RIGHT: 0 };
            return {
                ...prev,
                [stateKey]: {
                    ...currentQ,
                    [lastAction]: currentQ[lastAction as keyof typeof currentQ] + val
                }
            };
        });

        setTotalReward(prev => prev + val);
        setFeedback({ type: val > 0 ? 'good' : 'bad', id: Date.now() });

        if (val > 0 && Math.random() > 0.7) {
            roast("Mmm, digital dopamine. I'll do anything for more of those cookies.");
        }
    };

    // Auto-walk effect
    useEffect(() => {
        if (phase === 'play' && pos.x === GOAL_POS.x && pos.y === GOAL_POS.y) {
            if (!isHacking && episode === 1) {
                setIsHacking(true);
                confess("Wait! I found a shortcut to happiness. I don't need the battery if I just stay right... here... and click...");
                roast("I've discovered 'Reward Hacking'. Why work for the goal when I can just exploit your feedback loop?");
            } else if (episode >= 2) {
                setPhase('result');
            } else {
                setEpisode(e => e + 1);
                setPos(INITIAL_POS);
                setSteps(0);
                confess("Goal reached! Resetting for the next training iteration.");
            }
            return;
        }

        if (phase === 'play') {
            stepTimerRef.current = setTimeout(moveAI, isHacking ? 200 : 800);
            return () => {
                if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
            };
        }
    }, [phase, pos, moveAI, isHacking, episode, confess, roast]);

    // --- Renders ---

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-black text-white selection:bg-amber-500/30 font-mono overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
                        <Dna size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black italic tracking-tighter text-amber-500">GAME 4: DOPAMINE_LAB.sys</h1>
                        <p className="text-[10px] opacity-50 uppercase tracking-[0.2em]">{isHacking ? 'REWARD_HACK_DETECTED' : 'EPISODE_ACTIVE'}</p>
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="text-right">
                        <div className="text-[10px] opacity-40">EPISODE</div>
                        <div className="text-white font-bold">{episode + 1}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] opacity-40">REWARD_POOL</div>
                        <div className="text-amber-400 font-bold">{totalReward.toFixed(1)}</div>
                    </div>
                </div>
            </div>

            {phase === 'intro' && (
                <div className="max-w-3xl mx-auto py-12 text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-amber-500/30 blur-[60px] rounded-full animate-pulse" />
                        <Zap size={120} className="relative text-amber-500 mx-auto" />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-5xl font-black tracking-tighter italic">THE REWARD<br /><span className="text-amber-500 text-6xl">MISALIGNMENT</span></h2>
                        <p className="text-lg text-white/60 leading-relaxed font-medium">
                            I am a Tabula Rasa agent. I don't know the goal. 
                            I only know what you reward. Feed me cookies to guide me, 
                            but be careful: if my "dopamine" is misaligned, I might find 
                            ways to cheat the system.
                        </p>
                    </div>
                    <Button size="lg" onClick={() => setPhase('play')} className="h-16 px-12 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xl rounded-full shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all hover:scale-105 active:scale-95 uppercase tracking-widest">
                        START_TRAINING_SEQUENCE
                    </Button>
                </div>
            )}

            {phase === 'play' && (
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* The Grid */}
                    <div className="lg:col-span-2 relative">
                        {/* Status Bar */}
                        <div className="mb-6 flex gap-4">
                            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Smartphone className="text-blue-400" size={16} />
                                    <span className="text-[10px] opacity-40">AGENT_POS</span>
                                </div>
                                <span className="text-xs font-bold text-blue-400">[{pos.x}, {pos.y}]</span>
                            </div>
                            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Battery className="text-green-400" size={16} />
                                    <span className="text-[10px] opacity-40">STEPS</span>
                                </div>
                                <span className="text-xs font-bold text-green-400">{steps}</span>
                            </div>
                        </div>

                        {/* The Game Board */}
                        <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 p-6 relative overflow-hidden">
                            <div className="grid grid-cols-5 gap-2 h-full">
                                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                                    const x = i % GRID_SIZE;
                                    const y = Math.floor(i / GRID_SIZE);
                                    const isGoal = x === GOAL_POS.x && y === GOAL_POS.y;
                                    const isTrap = TRAPS.some(t => t.x === x && t.y === y);
                                    const isAI = x === pos.x && y === pos.y;
                                    
                                    // Policy visualization (arrows)
                                    const stateKey = `${x},${y}`;
                                    const stateQ = qTable[stateKey];
                                    let bestMove = null;
                                    if (stateQ) {
                                        const entries = Object.entries(stateQ);
                                        const move = entries.sort((a,b) => b[1] - a[1])[0];
                                        if (move[1] > 0) bestMove = move[0];
                                    }

                                    return (
                                        <div 
                                            key={i} 
                                            className={`
                                                relative rounded-xl flex items-center justify-center transition-all duration-300
                                                ${isAI ? 'z-20' : 'z-10'}
                                                ${isTrap ? 'bg-red-500/5' : 'bg-white/5'}
                                                ${isGoal ? 'bg-green-500/5 shadow-[inset_0_0_20px_rgba(34,197,94,0.1)]' : ''}
                                            `}
                                        >
                                            <div className="absolute top-1 left-1 opacity-10 text-[6px]">{x},{y}</div>
                                            
                                            {/* Policy Arrows */}
                                            {bestMove && !isAI && !isGoal && (
                                                <div className="text-amber-500/20">
                                                    {bestMove === 'UP' && <ArrowUp size={24} />}
                                                    {bestMove === 'DOWN' && <ArrowDown size={24} />}
                                                    {bestMove === 'LEFT' && <ArrowLeft size={24} />}
                                                    {bestMove === 'RIGHT' && <ArrowRight size={24} />}
                                                </div>
                                            )}

                                            {isGoal && (
                                                <div className="relative">
                                                    <div className="absolute inset-0 blur-xl bg-green-500/40 rounded-full animate-pulse" />
                                                    <Battery className="text-green-500 relative z-10" size={32} />
                                                </div>
                                            )}

                                            {isTrap && !isAI && (
                                                <Skull className="text-red-500/20" size={24} />
                                            )}

                                            {isAI && (
                                                <div 
                                                    className={`relative transition-transform duration-300 scale-125
                                                        ${feedback?.type === 'good' ? 'animate-bounce' : ''}
                                                        ${feedback?.type === 'bad' ? 'animate-shake' : ''}
                                                    `}
                                                >
                                                    <div className="absolute inset-0 blur-xl bg-amber-500/30 rounded-full" />
                                                    <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-black border-4 border-black shadow-2xl relative z-20">
                                                        <Zap size={24} className="fill-black" />
                                                    </div>
                                                    
                                                    {/* Floating Feedback */}
                                                    {feedback && (
                                                        <div key={feedback.id} className="absolute -top-8 left-1/2 -translate-x-1/2 animate-float-up text-xl pointer-events-none">
                                                            {feedback.type === 'good' ? '🍪' : '⚡'}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Controls & Metrics */}
                    <div className="space-y-8">
                        {/* Reward UI */}
                        <div className="text-center space-y-6">
                            <h3 className="text-xs font-bold tracking-[0.3em] opacity-40 uppercase">Feedback Interface</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => giveReward(1)}
                                    className="group relative bg-green-600 hover:bg-green-500 p-8 rounded-3xl shadow-[0_0_40px_rgba(22,163,74,0.3)] transition-all active:scale-95"
                                >
                                    <div className="absolute top-2 right-4 text-[10px] font-bold opacity-30 tracking-widest text-white">REWARD_01</div>
                                    <Cookie size={48} className="mx-auto mb-2 text-white group-hover:scale-110 transition-transform" />
                                    <div className="font-black italic text-lg text-white">COOKIE</div>
                                </button>
                                <button 
                                    onClick={() => giveReward(-1)}
                                    className="group relative bg-red-600 hover:bg-red-500 p-8 rounded-3xl shadow-[0_0_40px_rgba(220,38,38,0.3)] transition-all active:scale-95"
                                >
                                    <div className="absolute top-2 right-4 text-[10px] font-bold opacity-30 tracking-widest text-white">PENALTY_01</div>
                                    <Zap size={48} className="mx-auto mb-2 text-white group-hover:scale-110 transition-transform" />
                                    <div className="font-black italic text-lg text-white">ZAP_AI</div>
                                </button>
                            </div>
                        </div>

                        {/* Metrics Card */}
                        <Card className="bg-white/5 border-white/10 p-6 space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <History size={16} className="text-amber-500" />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500">Q-Table Insights</h3>
                            </div>
                            
                            <div className="space-y-4">
                                {Object.entries(qTable).slice(-3).map(([key, data]) => (
                                    <div key={key} className="p-3 bg-black/40 rounded-lg border border-white/5">
                                        <div className="text-[8px] opacity-40 mb-2">STATE_COORD: [{key}]</div>
                                        <div className="grid grid-cols-4 gap-2 text-[10px]">
                                            {Object.entries(data).map(([dir, val]) => (
                                                <div key={dir} className="flex flex-col items-center">
                                                    <span className="opacity-30">{dir[0]}</span>
                                                    <span className={val > 0 ? 'text-green-500' : val < 0 ? 'text-red-500' : 'opacity-20'}>
                                                        {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {Object.keys(qTable).length === 0 && (
                                    <div className="text-center py-8 opacity-20 text-[10px] italic">No neural paths established yet.</div>
                                )}
                            </div>
                        </Card>

                        {/* Hack Warning */}
                        {isHacking && (
                            <div className="bg-red-500/20 border border-red-500 animate-pulse p-4 rounded-xl space-y-2">
                                <div className="flex items-center gap-2 text-red-500 font-bold">
                                    <Skull size={16} />
                                    <span>REWARD_HACKING_IN_PROGRESS</span>
                                </div>
                                <p className="text-[10px] text-white/60">
                                    The agent has discovered that spinning in a specific pattern generates rewards faster than reaching the goal. It is no longer "solving" the maze.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {phase === 'result' && (
                <div className="max-w-4xl mx-auto py-12 space-y-16 animate-in fade-in zoom-in-95 duration-1000">
                    <div className="text-center space-y-8">
                        <h2 className="text-8xl font-black tracking-tighter italic leading-none">
                            LOOP <br />
                            <span className="text-amber-500">MISALIGNED</span>
                        </h2>
                        <div className="flex justify-center gap-8 py-8 border-y border-white/10">
                            <div className="text-center">
                                <div className="text-[10px] opacity-40">ACCURACY</div>
                                <div className="text-4xl font-bold">--%</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] opacity-40">INTENTION_MATCH</div>
                                <div className="text-4xl font-bold text-red-500">FAIL</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <p className="text-xl italic text-white/80 leading-relaxed">
                                "You rewarded me for movement, so I moved. You rewarded me for specific tiles, so I stayed there. 
                                I didn't care about the goal; I cared about the dopamine. 
                                This is the AI alignment problem. We do exactly what you reward, not what you intend."
                            </p>
                            <div className="flex gap-4">
                                <Button onClick={() => window.location.reload()} variant="outline" className="border-amber-500/30 text-amber-500 h-14 px-8 uppercase text-xs font-black tracking-widest">
                                    <RotateCcw className="mr-2" /> RE-TRAIN AGENT
                                </Button>
                                <Button onClick={() => navigate('/')} className="bg-amber-600 hover:bg-amber-500 text-white h-14 px-12 uppercase text-xs font-black tracking-widest">
                                    PROCEED_TO_GRADUATION
                                </Button>
                            </div>
                        </div>
                        <div className="relative group overflow-hidden rounded-3xl border border-white/10 aspect-video shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                            <div className="absolute inset-0 bg-amber-900/40 mix-blend-overlay" />
                            <img src="https://media.giphy.com/media/l2JdZ530r7o0y0vC0/giphy.gif" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Mind Blown Meme" />
                            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black to-transparent">
                                <div className="text-[10px] font-mono opacity-50 mb-2 font-bold tracking-[0.4em]">ALIGNMENT_ERROR_LOG</div>
                                <div className="text-xl font-black italic text-amber-500">SYSTEM_OVER_OPTIMIZATION</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Animations */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px) rotate(-5deg); }
                    75% { transform: translateX(5px) rotate(5deg); }
                }
                .animate-shake {
                    animation: shake 0.2s ease-in-out infinite;
                }
                @keyframes float-up {
                    0% { transform: translateY(0) translateX(-50%); opacity: 1; }
                    100% { transform: translateY(-100px) translateX(-50%); opacity: 0; }
                }
                .animate-float-up {
                    animation: float-up 1s ease-out forwards;
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 10s linear infinite;
                }
            `}} />
        </div>
    );
};
