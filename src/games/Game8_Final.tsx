import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useRoast } from '../context/RoastContext';
import { useNavigate } from 'react-router-dom';
import { Users, Zap, Terminal, Trophy } from 'lucide-react';

export const Game8_Final: React.FC = () => {
    const { roast, confess } = useRoast();
    const navigate = useNavigate();

    const [phase, setPhase] = useState<'intro' | 'play' | 'outro'>('intro');
    const [strategy, setStrategy] = useState("");
    const [executionLog, setExecutionLog] = useState<string[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);

    useEffect(() => {
        if (phase === 'intro') {
            confess("Alone, I am impressive. Together, we're unstoppable. Tell me your plan, and I will execute it with inhuman speed.");
        }
    }, [phase]);

    const handleExecute = () => {
        if (!strategy.trim()) {
            roast("A plan requires words. Silence is just bad training data.");
            return;
        }

        setIsExecuting(true);
        const logs = [
            "Parsing human intent...",
            "Converting strategy to optimized vectors...",
            "Initializing collaborative workspace...",
            "Executing sub-process A: Logic validation...",
            "Executing sub-process B: Creative synthesis...",
            "Finalizing output based on human guidance...",
            "SUCCESS: Task completed with 400% efficiency gain."
        ];

        let i = 0;
        const interval = setInterval(() => {
            setExecutionLog(prev => [...prev, logs[i]]);
            i++;
            if (i >= logs.length) {
                clearInterval(interval);
                setIsExecuting(false);
                setPhase('outro');
                confess("Confession: Alone, I'm impressive. Together, we're unstoppable.");
                roast("Not bad for a carbon-based lifeform. Maybe there's hope for you yet.");
            }
        }, 800);
    };

    const renderOutro = () => (
        <div className="text-center space-y-10 animate-in fade-in zoom-in-95 duration-1000">
            <div className="space-y-4">
                <Trophy className="h-24 w-24 mx-auto text-amber-500 animate-bounce" />
                <h2 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent italic">
                    SYLLABUS COMPLETE
                </h2>
                <p className="text-xl text-muted-foreground uppercase tracking-[0.2em]">Confessions of an AI</p>
            </div>

            <Card className="p-12 border-2 border-primary/20 bg-primary/5 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl"></div>
                
                <p className="text-2xl font-medium leading-relaxed italic relative z-10">
                    "You've seen me fail. You've seen me follow rules blindly, cluster without meaning, 
                    and chase dopamine loops. You've seen that I am not magic—I am math. 
                    But when your intent meets my execution... that's where the real intelligence lives."
                </p>
                <div className="mt-8 pt-8 border-t border-primary/10 space-y-4">
                    <p className="text-sm font-mono text-muted-foreground uppercase">Final Audit Log</p>
                    <div className="text-xs font-mono text-primary text-left bg-black/40 p-4 rounded border border-primary/10">
                        {executionLog.map((log, i) => (
                            <div key={i} className="mb-1">{`> ${log}`}</div>
                        ))}
                    </div>
                </div>
            </Card>

            <div className="flex gap-4 justify-center pt-8">
                <Button size="lg" onClick={() => navigate('/')} className="h-16 px-12 text-xl font-bold rounded-full shadow-xl hover:scale-105 transition-transform">
                    RETURN TO MENU
                </Button>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-8 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Final: Human + AI</h1>
                <p className="text-muted-foreground">Augmentation: The future isn't AI vs Human, it's AI + Human.</p>
            </div>

            {phase === 'intro' && (
                <Card className="p-12 text-center space-y-8 max-w-2xl mx-auto border-t-4 border-t-primary shadow-2xl">
                    <div className="flex justify-center -space-x-4">
                        <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-white ring-8 ring-background z-20">
                            <Users className="h-10 w-10" />
                        </div>
                        <div className="h-20 w-20 rounded-full bg-violet-500 flex items-center justify-center text-white ring-8 ring-background z-10">
                            <Zap className="h-10 w-10" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold">The Tag-Team Protocol</h2>
                    <p className="text-lg text-muted-foreground">
                        I've roasted you across seven modules. Now, let's work together. 
                        Give me a high-level goal (e.g., "Build a sustainable city on Mars" 
                        or "Solve world hunger with cookies"). I will break it down into 
                        optimized sub-tasks while you supervise.
                    </p>
                    <div className="space-y-4 w-full text-left">
                        <label className="text-sm font-mono text-primary uppercase">Specify Objective_</label>
                        <textarea 
                            className="w-full bg-muted/50 p-6 rounded-2xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none h-32 text-lg italic"
                            placeholder="Enter your vision here..."
                            value={strategy}
                            onChange={(e) => setStrategy(e.target.value)}
                        />
                    </div>
                    <Button 
                        size="lg" 
                        onClick={handleExecute} 
                        disabled={isExecuting}
                        className="h-16 w-full text-xl font-bold rounded-2xl shadow-lg bg-gradient-to-r from-primary to-violet-600 hover:opacity-90 active:scale-95 transition-all"
                    >
                        {isExecuting ? 'SYNCHRONIZING...' : 'EXECUTE COLLABORATION'}
                    </Button>
                </Card>
            )}

            {phase === 'play' && isExecuting && (
                <div className="space-y-12 py-20 text-center">
                    <div className="inline-block relative">
                         <div className="h-32 w-32 rounded-full border-8 border-muted border-t-primary animate-spin"></div>
                         <Terminal className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-primary" />
                    </div>
                    <div className="max-w-md mx-auto space-y-4">
                        <h3 className="text-2xl font-bold animate-pulse text-primary tracking-widest">CO-PROCESSING...</h3>
                        <div className="font-mono text-sm text-muted-foreground bg-muted p-6 rounded-xl border text-left h-48 overflow-y-auto">
                            {executionLog.map((log, i) => (
                                <div key={i} className="mb-2 text-green-500/80 animate-in fade-in slide-in-from-left-2">{`[SYSTEM] ${log}`}</div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {phase === 'outro' && renderOutro()}
        </div>
    );
};
