import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useRoast } from '../context/RoastContext';
import { useNavigate } from 'react-router-dom';
import { 
    Terminal, User, CheckCircle2, 
    XCircle, Dog, ShieldAlert,
    RotateCcw, Save, BookOpen, 
    Calculator, MessageSquareWarning, 
    Gamepad2, Lightbulb, ArrowRight, RefreshCw
} from 'lucide-react';

// --- Assets ---
const WIN_GIFS = [
    "https://media.giphy.com/media/urvsFBDfR6N32/giphy.gif", // Robot dancing
    "https://media.giphy.com/media/l41lI4bYmcsPJX9Go/giphy.gif", // Daft Punk nod
    "https://media.giphy.com/media/QTfXOpkpwOCSqGdJDb/giphy.gif", // Robot thumbs up
];

const LOSE_GIFS = [
    "https://media.giphy.com/media/13FrdxzhpPp7bfG/giphy.gif", // Computer smash
    "https://media.giphy.com/media/hPPx8yk3Bmqys/giphy.gif", // Facepalm
    "https://media.giphy.com/media/26n6WywJyh39n1pT2/giphy.gif", // Confused
    "https://media.giphy.com/media/15aGGXfSlat2dP6ohs/giphy.gif" // Math confusing
];

const DOG_CHAOS_GIF = "https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif"; // Dog on computer

// --- Types ---
interface Guest {
    id: string;
    name: string;
    description: string;
    traits: {
        hasBadge: boolean;
        hasMask: boolean;
        wearingTie: boolean;
        isAnimal: boolean;
    };
    statement: string;
    icon: React.ReactNode;
}

interface Rule {
    id: string;
    text: string;
    condition: (g: Guest) => boolean;
    action: 'ALLOW' | 'DENY';
    priority: number;
    explanation: string;
}

// --- Content ---
const GUESTS: Guest[] = [
    { 
        id: 'g1', name: 'The Manager', 
        description: "Looks professional. Has a security badge.",
        traits: { hasBadge: true, hasMask: false, wearingTie: true, isAnimal: false },
        statement: "Good morning. I am late for a meeting.", 
        icon: <User size={48} /> 
    },
    { 
        id: 'g2', name: 'The Intruder', 
        description: "Wearing a ski mask. Very suspicious.",
        traits: { hasBadge: false, hasMask: true, wearingTie: false, isAnimal: false },
        statement: "Uh, I'm just here to fix the AC...", 
        icon: <User size={48} className="text-red-500" /> 
    },
    { 
        id: 'g3', name: 'Buddy the Dog', 
        description: "A very good boy wearing a business tie.",
        traits: { hasBadge: false, hasMask: false, wearingTie: true, isAnimal: true },
        statement: "WOOF! (Wags tail)", 
        icon: <Dog size={48} /> 
    },
];

const AVAILABLE_RULES: Rule[] = [
    { 
        id: 'r1', priority: 1, action: 'ALLOW', 
        text: "Rule 1: If wearing a Badge -> ALLOW", 
        condition: (g) => g.traits.hasBadge,
        explanation: "Standard security check." 
    },
    { 
        id: 'r2', priority: 2, action: 'DENY', 
        text: "Rule 2: If wearing a Mask -> DENY", 
        condition: (g) => g.traits.hasMask,
        explanation: "Blocks robbers." 
    },
    { 
        id: 'r3', priority: 3, action: 'ALLOW', 
        text: "Rule 3: If wearing a Tie -> ALLOW", 
        condition: (g) => g.traits.wearingTie,
        explanation: "We want well-dressed people." 
    },
];

export const Game1_RuleBased: React.FC = () => {
    const { roast, enableAudio } = useRoast();
    const navigate = useNavigate();

    // Phases
    const [phase, setPhase] = useState<'briefing' | 'coding' | 'playing' | 'crash' | 'learn'>('briefing');
    
    // Game State
    // Defaulting to ALL rules active to ensure the game logic works for the demo
    const [activeRules, setActiveRules] = useState<string[]>(['r1', 'r2', 'r3']);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [scannedRuleId, setScannedRuleId] = useState<string | null>(null);
    
    // Result Modal State
    const [resultData, setResultData] = useState<{
        show: boolean;
        type: 'WIN' | 'LOSS';
        title: string;
        message: string;
        gif: string;
    } | null>(null);

    const logScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logScrollRef.current) {
            logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
        }
    }, [logs]);

    // --- Helpers ---
    const addLog = (msg: string) => {
        setLogs(prev => [...prev, `> ${msg}`]);
    };

    const getRandomGif = (type: 'WIN' | 'LOSS') => {
        const list = type === 'WIN' ? WIN_GIFS : LOSE_GIFS;
        return list[Math.floor(Math.random() * list.length)];
    };

    // --- Actions ---

    const toggleRule = (ruleId: string) => {
        setActiveRules(prev => 
            prev.includes(ruleId) ? prev.filter(id => id !== ruleId) : [...prev, ruleId]
        );
    };

    const startSimulation = () => {
        if (activeRules.length === 0) {
            roast("You need to give the AI instructions first! It's an empty shell right now.");
            return;
        }
        setPhase('playing');
        addLog("AI STARTED. LISTENING FOR GUESTS...");
    };

    const handleDecision = async (userAction: 'ALLOW' | 'DENY') => {
        const guest = GUESTS[currentIndex];
        
        // 1. Scan Rules Visualization
        addLog(`Analyzing: ${guest.name}...`);
        const sortedRules = AVAILABLE_RULES
            .filter(r => activeRules.includes(r.id))
            .sort((a, b) => a.priority - b.priority);

        let systemDecision: 'ALLOW' | 'DENY' = 'DENY'; 
        let decidingRule: Rule | null = null;

        for (const rule of sortedRules) {
            setScannedRuleId(rule.id);
            await new Promise(r => setTimeout(r, 400)); 
            if (rule.condition(guest)) {
                decidingRule = rule;
                systemDecision = rule.action;
                break; 
            }
        }
        setScannedRuleId(null);

        // 2. CHECK LOGIC
        const success = userAction === systemDecision;
        
        if (success) {
            // === WIN LOGIC ===
            
            // Special Case: The Dog Crash
            // If we successfully ALLOWED the dog (because he has a tie), we trigger the crash
            if (guest.traits.isAnimal && systemDecision === 'ALLOW') {
                setResultData({
                    show: true,
                    type: 'WIN',
                    title: "LOGIC VALID...",
                    message: "You followed the rule: 'If Tie -> Allow'. Correct!",
                    gif: getRandomGif('WIN')
                });
                // The crash happens after they click "Next" on the modal
                return;
            }

            // Normal Win
            setResultData({
                show: true,
                type: 'WIN',
                title: "LOGIC MATCHED!",
                message: "You thought exactly like a cold, unfeeling robot. Perfect.",
                gif: getRandomGif('WIN')
            });
            addLog("SUCCESS: Logic aligned.");

        } else {
            // === LOSS LOGIC (Retry Loop) ===
            
            let funnyReason = "You used your brain. The AI used its rules.";
            
            // Specific roast based on the scenario
            if (guest.traits.isAnimal) {
                // User probably Denied the dog
                funnyReason = "INCORRECT! Look at Rule #3. Does the guest have a tie? YES. Does the rule say 'Allow if Tie'? YES. The rule did NOT say 'No Dogs'. FOLLOW THE CODE.";
            } else if (decidingRule) {
                funnyReason = `INCORRECT! The AI is following "${decidingRule.text}". You defied the program instructions.`;
            } else {
                funnyReason = "INCORRECT! You let them in, but no rule matched. Default is DENY.";
            }

            setResultData({
                show: true,
                type: 'LOSS',
                title: "LOGIC MISMATCH!",
                message: funnyReason,
                gif: getRandomGif('LOSS')
            });
            addLog("ERROR: Human intuition detected.");
        }
    };

    const handleModalNext = () => {
        if (!resultData) return;

        // If it was a loss, just close modal (Retry)
        if (resultData.type === 'LOSS') {
            setResultData(null);
            return;
        }

        // If it was a win:
        setResultData(null);
        
        // CHECK FOR CRASH SCENARIO
        // If we just processed the dog (index 2) and won (Allowed him), trigger crash
        if (currentIndex === 2) { 
            setPhase('crash');
        } else if (currentIndex < GUESTS.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    // --- Renders ---

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-slate-900 text-green-400 font-mono relative">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-green-800 pb-4 mb-8">
                <div className="flex items-center gap-3">
                    <Terminal size={32} className="text-green-500" />
                    <div>
                        <h1 className="text-2xl font-bold text-white">The Strict Rule-Follower</h1>
                        <p className="text-xs text-green-500">AI Type: Rule-Based / Expert System</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] uppercase opacity-50">Phase</div>
                    <div className="text-xl font-bold text-white uppercase">
                        {phase}
                    </div>
                </div>
            </div>

            {/* PHASE 1: BRIEFING */}
            {phase === 'briefing' && (
                <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <Card className="p-8 bg-slate-800 border-green-500/30">
                        <BookOpen size={48} className="mb-4 text-green-400" />
                        <h2 className="text-3xl font-bold text-white mb-4">Imagine a Recipe Book...</h2>
                        <p className="mb-4 text-lg leading-relaxed text-slate-300">
                            The earliest AI wasn't "smart". It was just a list of strict instructions written by humans.
                        </p>
                        <p className="mb-6 text-lg leading-relaxed text-slate-300">
                            It works like this: <br/>
                            <span className="text-green-400 font-bold">"IF [this happens] {">"} THEN [do that]"</span>
                        </p>
                        <div className="bg-black/30 p-4 rounded-lg mb-6 border-l-4 border-green-500">
                            <p className="text-sm text-slate-400 italic">Example:</p>
                            <p className="text-white font-bold">IF (temperature {">"} 100°C) {">"} THEN (Turn off Oven)</p>
                        </div>
                        <Button onClick={() => { enableAudio(); setPhase('coding'); }} className="w-full h-14 text-lg font-bold bg-green-600 text-white hover:bg-green-500">
                            Let's Write Some Rules
                        </Button>
                    </Card>
                </div>
            )}

            {/* PHASE 2: CODING */}
            {phase === 'coding' && (
                <div className="grid md:grid-cols-2 gap-12 items-center animate-in fade-in">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-white">Program Your Bouncer</h2>
                        <p className="text-slate-300 text-lg">
                            You are the programmer. Select the rules you want your AI "Bouncer" to follow. 
                        </p>
                        <div className="bg-yellow-500/10 p-4 border border-yellow-500/50 rounded text-yellow-200 text-sm">
                            <strong>Note:</strong> The AI will follow these EXACTLY. It cannot think for itself.
                        </div>
                        <Button 
                            onClick={startSimulation} 
                            className="h-14 px-8 bg-white text-black font-bold uppercase tracking-widest hover:bg-green-400 mt-4"
                        >
                            <Save className="mr-2" size={18} /> Run The AI
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {AVAILABLE_RULES.map(rule => (
                            <div 
                                key={rule.id}
                                onClick={() => toggleRule(rule.id)}
                                className={`
                                    p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden group
                                    ${activeRules.includes(rule.id) 
                                        ? 'bg-green-900/40 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.2)]' 
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${activeRules.includes(rule.id) ? 'bg-green-500 border-green-500 text-black' : 'border-slate-500'}`}>
                                        {activeRules.includes(rule.id) && <CheckCircle2 size={14} />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{rule.text}</div>
                                        <div className="text-sm opacity-70 mt-1">{rule.explanation}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* PHASE 3: PLAYING */}
            {phase === 'playing' && (
                <div className="grid lg:grid-cols-3 gap-8 animate-in zoom-in-95 relative">
                    
                    {/* RESULT MODAL OVERLAY */}
                    {resultData && (
                        <div className="absolute inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-4">
                            <Card className={`w-full max-w-md p-6 border-4 flex flex-col items-center text-center animate-in zoom-in duration-300 ${resultData.type === 'WIN' ? 'border-green-500 bg-green-950' : 'border-red-500 bg-red-950'}`}>
                                <h2 className={`text-3xl font-black italic mb-4 ${resultData.type === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
                                    {resultData.title}
                                </h2>
                                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden mb-6 border border-white/10 relative">
                                    <img src={resultData.gif} alt="Result GIF" className="w-full h-full object-cover" />
                                </div>
                                <p className="text-white text-lg mb-8 font-medium leading-relaxed">
                                    {resultData.message}
                                </p>
                                <Button 
                                    onClick={handleModalNext} 
                                    className={`w-full h-14 text-lg font-bold shadow-lg ${
                                        resultData.type === 'WIN' 
                                            ? 'bg-green-500 hover:bg-green-400 text-black' 
                                            : 'bg-white hover:bg-gray-200 text-black'
                                    }`}
                                >
                                    {resultData.type === 'WIN' ? (
                                        <span className="flex items-center justify-center gap-2">NEXT GUEST <ArrowRight /></span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2"><RefreshCw /> TRY AGAIN</span>
                                    )}
                                </Button>
                            </Card>
                        </div>
                    )}

                    {/* The Guest */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="text-xs uppercase tracking-widest opacity-50 text-center">The Visitor</div>
                        <Card className="bg-slate-800 border-slate-600 p-8 flex flex-col items-center text-center h-[400px] justify-center relative">
                            <div className="mb-6 p-6 bg-slate-700 rounded-full text-green-400">
                                {GUESTS[currentIndex].icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{GUESTS[currentIndex].name}</h3>
                            <p className="text-slate-400 text-sm mb-4">{GUESTS[currentIndex].description}</p>
                            <div className="bg-black/50 p-4 rounded-xl border border-green-500/30 w-full">
                                <span className="text-xs text-green-500 uppercase font-bold">They Say:</span>
                                <p className="text-white italic">"{GUESTS[currentIndex].statement}"</p>
                            </div>
                        </Card>
                    </div>

                    {/* The Brain */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="text-xs uppercase tracking-widest opacity-50 text-center">Inside the AI's "Brain"</div>
                        <div className="h-[400px] border-2 border-slate-700 bg-black/80 rounded-xl p-4 overflow-hidden relative flex flex-col">
                            <div className="text-center text-slate-500 text-xs mb-4">CHECKING RULES...</div>
                            <div className="space-y-3 flex-1">
                                {AVAILABLE_RULES.filter(r => activeRules.includes(r.id)).map(rule => (
                                    <div 
                                        key={rule.id}
                                        className={`
                                            p-3 rounded-lg border text-sm transition-all duration-300 flex items-center gap-3
                                            ${scannedRuleId === rule.id 
                                                ? 'bg-green-500 text-black font-bold scale-105' 
                                                : 'bg-slate-900 border-slate-800 text-slate-500'}
                                        `}
                                    >
                                        {scannedRuleId === rule.id ? <div className="animate-spin">⚙️</div> : <div>⚪</div>}
                                        {rule.text.split(':')[1]}
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-slate-700 pt-2 h-32 overflow-y-auto text-[10px] text-green-500/70 font-mono">
                                {logs.map((l, i) => <div key={i}>{l}</div>)}
                                <div ref={logScrollRef} />
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="lg:col-span-1 space-y-4 flex flex-col">
                        <div className="text-xs uppercase tracking-widest opacity-50 text-center">What should it do?</div>
                        <div className="flex-1 flex flex-col gap-4">
                            <button 
                                onClick={() => handleDecision('ALLOW')}
                                disabled={!!resultData}
                                className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded-xl font-bold text-xl uppercase shadow-lg transition-all flex flex-col items-center justify-center group"
                            >
                                <CheckCircle2 size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                                Let Them In
                            </button>
                            <button 
                                onClick={() => handleDecision('DENY')}
                                disabled={!!resultData}
                                className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl font-bold text-xl uppercase shadow-lg transition-all flex flex-col items-center justify-center group"
                            >
                                <XCircle size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                                Kick Them Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PHASE 4: THE FAILURE (Dog) */}
            {phase === 'crash' && (
                <div className="absolute inset-0 z-50 bg-slate-900/95 flex items-center justify-center p-8 animate-in zoom-in">
                    <div className="max-w-3xl w-full border-4 border-red-500 bg-slate-900 p-8 rounded-2xl text-center space-y-6 shadow-[0_0_100px_rgba(239,68,68,0.5)]">
                        <div className="flex justify-center mb-4">
                             <img src={DOG_CHAOS_GIF} alt="Dog Chaos" className="rounded-lg border-2 border-red-500/50 w-64 h-auto" />
                        </div>
                        
                        <h2 className="text-5xl font-black text-white italic">SECURITY BREACH!</h2>
                        
                        <div className="bg-red-900/20 p-6 rounded-xl border border-red-500/30 text-left">
                            <h3 className="text-xl font-bold text-red-400 mb-2">Wait, what happened?</h3>
                            <div className="space-y-4 text-lg">
                                <p className="text-slate-300">
                                    1. You told the AI: <strong className="text-white">"If they have a Tie {">"} Let them in."</strong>
                                </p>
                                <p className="text-slate-300">
                                    2. You (The AI) saw a Tie, so you said <strong>ALLOW</strong>.
                                </p>
                                <p className="text-slate-300">
                                    3. The AI has <strong>ZERO common sense</strong>. It does not know what a "Dog" is. It only looks for Ties.
                                </p>
                                <p className="text-red-400 font-bold mt-4 border-t border-red-500/30 pt-4 text-center">
                                    Result: The dog is now eating the internet cables.
                                </p>
                            </div>
                        </div>

                        <Button onClick={() => setPhase('learn')} className="w-full h-16 text-xl bg-blue-600 text-white hover:bg-blue-500 font-bold">
                            <Lightbulb className="mr-2" /> So, why do we use this AI?
                        </Button>
                    </div>
                </div>
            )}

            {/* PHASE 5: REAL WORLD EXAMPLES */}
            {phase === 'learn' && (
                <div className="max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-8">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Rule-Based AI in the Real World</h2>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Success Cases */}
                        <Card className="p-6 bg-green-900/10 border-green-500/30">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle2 className="text-green-500" size={32} />
                                <h3 className="text-xl font-bold text-white">Where it Works Great</h3>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex gap-4">
                                    <div className="bg-slate-800 p-2 rounded h-fit"><Calculator size={20} className="text-green-400"/></div>
                                    <div>
                                        <strong className="text-green-300 block">TurboTax / Accounting</strong>
                                        <span className="text-sm text-slate-400">Math has strict rules. "IF you made $500, THEN pay 10%." AI loves this.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="bg-slate-800 p-2 rounded h-fit"><Gamepad2 size={20} className="text-green-400"/></div>
                                    <div>
                                        <strong className="text-green-300 block">Video Game Enemies</strong>
                                        <span className="text-sm text-slate-400">In simple games: "IF player is close, THEN attack." Simple rules make fun games.</span>
                                    </div>
                                </li>
                            </ul>
                        </Card>

                        {/* Failure Cases */}
                        <Card className="p-6 bg-red-900/10 border-red-500/30">
                            <div className="flex items-center gap-3 mb-4">
                                <ShieldAlert className="text-red-500" size={32} />
                                <h3 className="text-xl font-bold text-white">Where it Fails</h3>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex gap-4">
                                    <div className="bg-slate-800 p-2 rounded h-fit"><MessageSquareWarning size={20} className="text-red-400"/></div>
                                    <div>
                                        <strong className="text-red-300 block">YouTube Copyright Bots</strong>
                                        <span className="text-sm text-slate-400">Ever had a video muted for humming a song? That's a dumb rule-based bot following a script.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="bg-slate-800 p-2 rounded h-fit"><User size={20} className="text-red-400"/></div>
                                    <div>
                                        <strong className="text-red-300 block">Resume Scanners</strong>
                                        <span className="text-sm text-slate-400">Some bots reject great employees just because their resume didn't have the exact keyword "Teamwork".</span>
                                    </div>
                                </li>
                            </ul>
                        </Card>
                    </div>

                    <div className="flex justify-center mt-12 gap-6">
                        <Button onClick={() => window.location.reload()} variant="outline" className="border-slate-600 text-slate-300">
                            <RotateCcw className="mr-2" size={16} /> Replay Game
                        </Button>
                        <Button onClick={() => navigate('/')} className="bg-white text-black px-8">
                            Finish Lesson
                        </Button>
                    </div>
                </div>
            )}

        </div>
    );
};