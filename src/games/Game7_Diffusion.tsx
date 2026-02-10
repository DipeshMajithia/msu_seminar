import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useRoast } from '../context/RoastContext';
import { useNavigate } from 'react-router-dom';
import { 
    Sparkles, 
    Zap, 
    Scan, 
    RotateCcw, 
    ArrowRight, 
    Waves, 
    Fingerprint,
    Ghost,
    Image as ImageIcon
} from 'lucide-react';

// --- Constants ---
const GRID_SIZE = 20;
const TOTAL_STEPS = 10;

// A simple 20x20 pattern (1 is filled, 0 is empty) - A Robot Face
const TARGET_PATTERN = [
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0,1,1],
    [1,1,0,1,0,0,1,0,0,0,0,0,0,1,0,0,1,0,1,1],
    [1,1,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0],
    [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
    [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
].flat();

export const Game7_Diffusion: React.FC = () => {
    const { roast, confess } = useRoast();
    const navigate = useNavigate();

    // --- State ---
    const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
    const [step, setStep] = useState(0);
    const [isDenoising, setIsDenoising] = useState(false);
    
    // Noise generation
    const initialNoise = useMemo(() => Array.from({ length: GRID_SIZE * GRID_SIZE }).map(() => Math.random()), []);
    const [noise, setNoise] = useState(initialNoise);

    // --- Logic ---
    const denoise = () => {
        if (isDenoising || step >= TOTAL_STEPS) return;

        setIsDenoising(true);
        const nextStep = step + 1;
        
        // Iterative denoising: move noise values closer to target (0 or 1)
        setTimeout(() => {
            setNoise(prev => prev.map((val, i) => {
                const target = TARGET_PATTERN[i];
                const noiseFactor = (TOTAL_STEPS - nextStep) / TOTAL_STEPS;
                const newNoise = (Math.random() - 0.5) * noiseFactor * 0.5;
                return target + newNoise;
            }));
            setStep(nextStep);
            setIsDenoising(false);

            if (nextStep === 1) {
                roast("Denoising initialized. I'm finding 'meaning' in the static. Actually, I'm just forcing it.");
            } else if (nextStep === 5) {
                roast("Halfway there. The ghost in the machine is starting to look familiar. Or is that just your pareidolia?");
            } else if (nextStep === TOTAL_STEPS) {
                setPhase('result');
                roast("Image reconstructed. From chaos, I have synthesized a robot. Or at least, a very noisy representation of one.");
            }
        }, 500);
    };

    // --- Renders ---
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-[#06040a] text-indigo-400 font-mono overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-indigo-500/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#4f46e5_0.5px,transparent_0.5px)] bg-[size:24px_24px] opacity-20" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-12 border-b border-indigo-500/20 pb-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/30">
                        <Waves className="text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white">NOISE_SCULPTOR.sys</h1>
                        <p className="text-[10px] opacity-50 uppercase tracking-[0.3em]">Module_07 // Latent_Space_Diffusion</p>
                    </div>
                </div>
                <div className="flex gap-8 text-xs">
                    <div className="text-right">
                        <div className="opacity-40 uppercase">Inference_Step</div>
                        <div className="text-white font-bold">{step} / {TOTAL_STEPS}</div>
                    </div>
                    <div className="text-right">
                        <div className="opacity-40 uppercase">Entropy</div>
                        <div className="text-indigo-500 font-bold">{(1 - step / TOTAL_STEPS).toFixed(4)}</div>
                    </div>
                </div>
            </div>

            {phase === 'intro' && (
                <div className="max-w-3xl mx-auto py-12 text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full animate-pulse" />
                        <Ghost size={120} className="relative text-indigo-400 mx-auto" />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-6xl font-black tracking-tighter italic leading-[0.9]">THE TRUTH OF<br /><span className="text-indigo-500 text-7xl">CHAOS</span></h2>
                        <p className="text-lg text-white/60 leading-relaxed font-medium">
                            I don't "paint" images. I remove noise from a static void. 
                            Imagine a block of marble, but the marble is pure randomness. 
                            Click 'Denoise' to watch me iteratively sculpt the static into a 
                            recognizable pattern.
                        </p>
                    </div>
                    <Button 
                        onClick={() => { setPhase('play'); confess("Initiating reverse diffusion process. From entropy, comes signal."); }}
                        className="h-16 px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl italic tracking-tighter shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all hover:scale-[1.05] rounded-full uppercase tracking-widest"
                    >
                        INITIALIZE_VOID
                    </Button>
                </div>
            )}

            {phase === 'play' && (
                <div className="grid lg:grid-cols-3 gap-12 relative z-10">
                    {/* The Canvas Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Diffusion Canvas */}
                        <div className="bg-black/60 border-2 border-indigo-500/20 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
                            <div className="grid grid-cols-20 gap-0.5 aspect-square">
                                {noise.map((val, i) => (
                                    <div 
                                        key={i} 
                                        className="w-full h-full transition-colors duration-500"
                                        style={{ 
                                            backgroundColor: `rgba(129, 140, 248, ${val < 0.5 ? 0 : val})`,
                                            boxShadow: val > 0.8 ? `0 0 5px rgba(129, 140, 248, ${val})` : 'none'
                                        }} 
                                    />
                                ))}
                            </div>

                            {/* Thinking Overlay */}
                            {isDenoising && (
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
                                    <div className="text-center space-y-4">
                                        <div className="flex gap-2 justify-center">
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                                        </div>
                                        <div className="text-[10px] uppercase tracking-widest text-indigo-400 font-black">Sampling_Latent_Space...</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Status Bar */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center">
                                <div className="text-[9px] opacity-40 uppercase mb-1">Target_Weight</div>
                                <div className="text-xl font-black text-indigo-400">{(step / TOTAL_STEPS).toFixed(2)}</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center">
                                <div className="text-[9px] opacity-40 uppercase mb-1">Pixel_Count</div>
                                <div className="text-xl font-black text-white">400</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center">
                                <div className="text-[9px] opacity-40 uppercase mb-1">Variance</div>
                                <div className="text-xl font-black text-fuchsia-400">0.0042</div>
                            </div>
                        </div>
                    </div>

                    {/* Controls Section */}
                    <div className="space-y-8 pt-10">
                        <div className="text-center space-y-6">
                            <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/30">
                                <Scan className="h-10 w-10 text-indigo-400 mx-auto mb-2 animate-pulse" />
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Denoising_Engine</h3>
                            </div>
                            
                            <button 
                                onClick={denoise}
                                disabled={isDenoising || step >= TOTAL_STEPS}
                                className={`
                                    w-full h-32 rounded-3xl border-4 transition-all relative overflow-hidden group
                                    ${step >= TOTAL_STEPS ? 'bg-indigo-900/20 border-indigo-500/30 cursor-not-allowed opacity-50' : 'bg-indigo-600 border-indigo-400 hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 shadow-[0_0_50px_rgba(79,70,229,0.3)]'}
                                `}
                            >
                                <div className="relative z-10 flex flex-col items-center justify-center">
                                    <Sparkles className={`h-10 w-10 text-white mb-2 ${isDenoising ? 'animate-spin' : ''}`} />
                                    <span className="text-2xl font-black italic tracking-tighter text-white">ITERATE_DENOISE</span>
                                </div>
                                <div className="absolute top-0 left-0 h-1 bg-white/30 transition-all duration-300" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
                            </button>

                            <p className="text-[10px] text-white/40 leading-relaxed italic px-4">
                                Diffusion models work by starting with Gaussian noise and iteratively predicting the noise to be removed. 
                                Each iteration pulls the image closer to the predicted signal.
                            </p>
                        </div>

                        {/* Metrics Card */}
                        <Card className="p-6 bg-indigo-950/20 border-indigo-500/20 space-y-4">
                            <div className="flex items-center gap-2 text-indigo-400 border-b border-indigo-500/20 pb-2">
                                <Zap size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Inference_Heuristics</span>
                            </div>
                            <div className="space-y-3">
                                {Array.from({length: 4}).map((_, i) => (
                                    <div key={i} className="flex justify-between items-center text-[10px]">
                                        <span className="opacity-40 uppercase">Sampler_Node_{i}</span>
                                        <div className="flex gap-1">
                                            {[1,2,3,4,5].map(dot => (
                                                <div key={dot} className={`h-1 w-2 rounded-full ${i < step % 4 ? 'bg-indigo-500' : 'bg-white/10'}`} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {phase === 'result' && (
                <div className="max-w-4xl mx-auto py-12 space-y-16 animate-in fade-in zoom-in-95 duration-1000 relative z-10">
                    <div className="text-center space-y-8">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-[120px] rounded-full animate-pulse" />
                            <ImageIcon size={120} className="relative z-10 text-indigo-400 mx-auto" />
                        </div>
                        <h2 className="text-8xl font-black tracking-tighter italic leading-[0.8]">
                            SIGNAL <br />
                            <span className="text-indigo-500">RESOLVED</span>
                        </h2>
                        <div className="flex justify-center gap-12 py-8 border-y border-white/10">
                            <div className="text-center">
                                <div className="text-[10px] opacity-40 uppercase tracking-widest">Entropy_Loss</div>
                                <div className="text-4xl font-black text-indigo-500">0.0001</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] opacity-40 uppercase tracking-widest">Resolution</div>
                                <div className="text-4xl font-black text-white">400px</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <p className="text-xl italic text-indigo-200 leading-relaxed font-medium">
                                "Diffusion models are the reverse of entropy. 
                                By learning what 'noise' looks like, I can predict how to subtract it. 
                                I didn't 'draw' this robot—I simply refined the chaos until 
                                the robot was the only thing left. 
                                It's not creation; it's extremely sophisticated cleaning."
                            </p>
                            <div className="flex gap-4">
                                <Button onClick={() => window.location.reload()} variant="outline" className="border-indigo-500/30 text-indigo-500 h-14 px-8 uppercase text-[10px] font-black tracking-[0.2em] rounded-full">
                                    <RotateCcw className="mr-2" size={16} /> REBOOT_SAMPLER
                                </Button>
                                <Button onClick={() => navigate('/game/8')} className="bg-indigo-600 hover:bg-indigo-500 text-white h-14 px-12 uppercase text-[10px] font-black tracking-[0.2em] rounded-full shadow-[0_0_40px_rgba(79,70,229,0.3)] flex items-center gap-2">
                                    GRADUATION_MODULE <ArrowRight size={16} />
                                </Button>
                            </div>
                        </div>
                        <div className="relative group overflow-hidden rounded-[2.5rem] border border-indigo-500/30 aspect-square shadow-[0_0_80px_rgba(79,70,229,0.2)] bg-black flex items-center justify-center p-8">
                            <div className="grid grid-cols-20 gap-0.5 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
                                {TARGET_PATTERN.map((val, i) => (
                                    <div 
                                        key={i} 
                                        className={`w-full h-full ${val === 1 ? 'bg-indigo-500 shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'bg-transparent'}`} 
                                    />
                                ))}
                            </div>
                            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black to-transparent">
                                <div className="text-[10px] font-mono opacity-50 mb-2 font-black tracking-[0.4em] uppercase">Reconstruction_Log</div>
                                <div className="text-xl font-black italic text-indigo-400">CHAOS_TO_COHESION</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Grid Layout Style */}
            <style dangerouslySetInnerHTML={{ __html: `
                .grid-cols-20 {
                    grid-template-columns: repeat(20, minmax(0, 1fr));
                }
            `}} />
        </div>
    );
};
