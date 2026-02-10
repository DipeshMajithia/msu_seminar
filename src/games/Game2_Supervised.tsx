import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useRoast } from '../context/RoastContext';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp, Split, Brain,
    Check, X, Eye, Layers,
    RefreshCcw, ArrowRight,
    AlertTriangle, LineChart,
    Mail, ShieldAlert, Inbox,
    Database, Calculator
} from 'lucide-react';

// --- ASSETS ---
const GIFS = {
    data_entry: "https://media.giphy.com/media/A8NkSPltT13H2/giphy.gif", // Typing fast
    training: "https://media.giphy.com/media/2IudUHdI075HL02Pkk/giphy.gif", // Math calculations
    prediction: "https://media.giphy.com/media/3owzW5c1tPq63DmWPK/giphy.gif", // Magic/Prediction
    spam_block: "https://media.giphy.com/media/Cq2GEME0yhrYeMsZOp/giphy.gif",
    spam_fail: "https://media.giphy.com/media/RI4LTRjrVJhTskGtrb/giphy.gif",
    ml_fail: "https://media.giphy.com/media/11YdnfyG6qvuWk/giphy.gif",
    dl_win: "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif"
};

// --- DATA ---
const TRAINING_DIAMONDS = [
    { size: 1, price: 1000 },
    { size: 3, price: 3000 },
    { size: 5, price: 5000 },
];

const EMAILS = [
    { id: 1, subject: "Meeting Update: 3PM", isSpam: false, keyword: "Meeting" },
    { id: 2, subject: "CONGRATS! YOU WON $1M!!!", isSpam: true, keyword: "WON" },
    { id: 3, subject: "Mom: Lunch tomorrow?", isSpam: false, keyword: "Mom" },
    { id: 4, subject: "Wire Transfer Request", isSpam: true, keyword: "Transfer" }
];

const IMAGES = [
    {
        id: 'pizza',
        src: "https://media.giphy.com/media/3o7TKVUn7iM8FMEU24/giphy.gif",
        isPizza: true,
        desc: "A hot, cheesy pepperoni pizza."
    },
    {
        id: 'frisbee',
        src: "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
        isPizza: false,
        desc: "A red plastic frisbee. NOT FOOD."
    }
];

export const Game2_Supervised: React.FC = () => {
    const { roast, enableAudio } = useRoast();
    const navigate = useNavigate();

    // --- State ---
    const [phase, setPhase] = useState<'intro' | 'reg_data' | 'reg_train' | 'reg_test' | 'classification_intro' | 'classification' | 'ml_fail_intro' | 'ml_fail_play' | 'dl_intro' | 'dl_play' | 'summary'>('intro');
    // Regression State
    const [dataStep, setDataStep] = useState(0); // 0, 1, 2 for the 3 diamonds
    const [dataset, setDataset] = useState<{ size: number, price: number }[]>([]);
    const [testCarat, setTestCarat] = useState<number>(0);
    const [predictedPrice, setPredictedPrice] = useState<number | null>(null);

    // Classification State
    const [emailIdx, setEmailIdx] = useState(0);

    // ML vs DL State
    const [imageIdx, setImageIdx] = useState(0);
    const [mlChecklist, setMlChecklist] = useState({ round: false, red: false, flat: false });
    const [scanProgress, setScanProgress] = useState(0);

    // Feedback
    const [feedback, setFeedback] = useState<{ show: boolean, type: 'WIN' | 'LOSS', msg: string, gif: string } | null>(null);

    // --- Actions ---

    // 1. REGRESSION: ADD DATA
    const addDataPoint = () => {
        const point = TRAINING_DIAMONDS[dataStep];
        setDataset(prev => [...prev, point]);

        if (dataStep < TRAINING_DIAMONDS.length - 1) {
            setDataStep(p => p + 1);
        } else {
            // Data collection done, move to training
            setTimeout(() => setPhase('reg_train'), 1000);
        }
    };

    // 2. REGRESSION: PREDICT
    const handlePredict = () => {
        if (testCarat <= 0) {
            roast("Enter a valid number. We can't price a ghost diamond.");
            return;
        }
        // The Model: y = 1000x
        const prediction = testCarat * 1000;
        setPredictedPrice(prediction);
        roast(`Calculated: ${testCarat} * 1000 = $${prediction}. Simple math for me.`);
    };

    // 3. CLASSIFICATION
    const handleClassification = (choice: 'SPAM' | 'HAM') => {
        const email = EMAILS[emailIdx];
        const correct = (choice === 'SPAM' && email.isSpam) || (choice === 'HAM' && !email.isSpam);

        if (correct) {
            showFeedback('WIN', "SORTED CORRECTLY", `You identified the pattern: "${email.keyword}".`, GIFS.spam_block);
        } else {
            showFeedback('LOSS', "INCORRECT SORT", "Look at the keywords. Simple rules separate Spam from Real.", GIFS.spam_fail);
        }
    };

    // 4. ML CHECKLIST
    const handleMLChecklist = () => {
        if (mlChecklist.round && mlChecklist.red && mlChecklist.flat) {
            if (imageIdx === 0) { // Pizza
                showFeedback('WIN', "MATCH FOUND", "Checklist matched. It is a pizza.", GIFS.math_win);
            } else { // Frisbee
                showFeedback('LOSS', "CRITICAL FAILURE", "The ML checked 'Round', 'Red', 'Flat'... so it ate the plastic Frisbee. It has no vision!", GIFS.ml_fail);
            }
        } else {
            roast("You must verify all features before the ML makes a decision.");
        }
    };

    // 5. DL SCAN
    const runDeepScan = () => {
        let p = 0;
        const interval = setInterval(() => {
            p += 2;
            setScanProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setTimeout(() => setPhase('summary'), 2000);
            }
        }, 50);
    };

    // --- Helpers ---
    const showFeedback = (type: 'WIN' | 'LOSS', title: string, msg: string, gif: string) => {
        setFeedback({ show: true, type, title, msg, gif });
    };

    const handleNext = () => {
        if (!feedback) return;
        if (feedback.type === 'LOSS') {
            setFeedback(null);
            // Special progression for the educational failure
            if (phase === 'ml_fail_play' && imageIdx === 1) setPhase('dl_intro');
            return;
        }
        setFeedback(null);

        if (phase === 'classification') {
            if (emailIdx < EMAILS.length - 1) setEmailIdx(p => p + 1);
            else setPhase('ml_fail_intro');
        } else if (phase === 'ml_fail_play') {
            if (imageIdx === 0) {
                setImageIdx(1);
                setMlChecklist({ round: false, red: false, flat: false });
            }
        }
    };

    // --- Components ---

    const LiveGraph = () => (
        <div className="relative w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-4 mb-4">

            <div className="absolute top-2 left-2 text-xs text-slate-500 font-bold flex items-center gap-2">
                <LineChart size={14} /> MODEL MEMORY
            </div>
            <svg className="w-full h-full" viewBox="0 0 300 200">
                {/* Axes */}
                <line x1="30" y1="170" x2="280" y2="170" stroke="#475569" strokeWidth="2" />
                <line x1="30" y1="20" x2="30" y2="170" stroke="#475569" strokeWidth="2" />

                {/* Labels */}
                <text x="150" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle">SIZE (Carats)</text>
                <text x="10" y="100" fill="#94a3b8" fontSize="10" textAnchor="middle" transform="rotate(-90 10,100)">PRICE</text>

                {/* The "Trained" Line (only visible in train/test phase) */}
                {(phase === 'reg_train' || phase === 'reg_test') && (
                    <line
                        x1="30" y1="170"
                        x2="280" y2="20"
                        stroke="#22c55e"
                        strokeWidth="3"
                        className="animate-in fade-in duration-1000"
                    />
                )}

                {/* Data Points */}
                {dataset.map((point, i) => (
                    <g key={i}>
                        <circle cx={30 + (point.size / 6) * 250} cy={170 - (point.price / 6000) * 150} r="5" fill="#3b82f6" className="animate-bounce" />
                        <text x={30 + (point.size / 6) * 250} y={170 - (point.price / 6000) * 150 - 10} fill="#3b82f6" fontSize="10" textAnchor="middle">${point.price}</text>
                    </g>
                ))}

                {/* Prediction Point */}
                {phase === 'reg_test' && predictedPrice !== null && (
                    <g>
                        <circle cx={30 + (testCarat / 6) * 250} cy={170 - (predictedPrice / 6000) * 150} r="6" fill="#facc15" className="animate-ping" />
                    </g>
                )}
            </svg>
        </div>
    );

    // --- Renders ---

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen bg-slate-900 text-blue-400 font-mono relative">

            <div className="flex justify-between items-center border-b border-blue-800 pb-4 mb-8">
                <div className="flex items-center gap-3">
                    <Brain size={32} className="text-blue-500" />
                    <div>
                        <h1 className="text-2xl font-bold text-white">The AI Apprentice</h1>
                        <p className="text-xs text-blue-500">Supervised Learning & Deep Learning</p>
                    </div>
                </div>
                <div className="text-right uppercase font-bold text-white text-sm tracking-widest">
                    {phase.replace(/_/g, ' ')}
                </div>
            </div>

            {/* FEEDBACK MODAL */}
            {feedback && (
                <div className="absolute inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in">
                    <Card className={`max-w-md w-full p-6 border-4 text-center space-y-6 ${feedback.type === 'WIN' ? 'border-green-500 bg-green-950/40' : 'border-red-500 bg-red-950/40'}`}>
                        <h2 className={`text-4xl font-black italic ${feedback.type === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>{feedback.title}</h2>
                        <img src={feedback.gif} alt="Feedback" className="w-full h-48 object-cover rounded border border-white/20" />
                        <p className="text-white text-lg">{feedback.msg}</p>
                        <Button onClick={handleNext} className="w-full h-14 font-bold bg-white text-black hover:bg-gray-200">
                            {feedback.type === 'WIN' ? 'CONTINUE' : 'TRY AGAIN'}
                        </Button>
                    </Card>
                </div>
            )}

            {/* PHASE 1: INTRO */}
            {phase === 'intro' && (
                <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in">
                    <Card className="p-8 bg-slate-800 border-blue-500/30">
                        <h2 className="text-3xl font-bold text-white mb-4">How Machines Learn</h2>
                        <p className="text-lg text-slate-300 mb-6">
                            You are the Teacher. The AI knows nothing.
                            <br />
                            We will go through 3 levels:
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-4 bg-black/20 p-4 rounded-xl">
                                <TrendingUp className="text-green-400" />
                                <div><strong className="text-white">1. Regression</strong><br /><span className="text-sm text-slate-400">Teaching Math & Patterns.</span></div>
                            </li>
                            <li className="flex items-center gap-4 bg-black/20 p-4 rounded-xl">
                                <Split className="text-blue-400" />
                                <div><strong className="text-white">2. Classification</strong><br /><span className="text-sm text-slate-400">Teaching Rules (Spam vs Ham).</span></div>
                            </li>
                            <li className="flex items-center gap-4 bg-black/20 p-4 rounded-xl">
                                <Layers className="text-purple-400" />
                                <div><strong className="text-white">3. Deep Learning</strong><br /><span className="text-sm text-slate-400">Teaching Vision.</span></div>
                            </li>
                        </ul>
                        <Button onClick={() => setPhase('reg_data')} className="w-full h-16 text-xl bg-blue-600 text-white font-bold hover:bg-blue-500">
                            START LEVEL 1
                        </Button>
                    </Card>
                </div>
            )}
            {phase === 'classification_intro' && (
                <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in">
                    <Card className="p-8 bg-slate-800 border-blue-500/30">
                        <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <Split className="text-blue-400" size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white">Level 2: Classification</h2>
                                <p className="text-slate-400">The Art of Drawing Lines</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4 text-lg text-slate-300">
                                <p>
                                    In Regression, we predicted a <strong>number</strong> (Price).
                                </p>
                                <p>
                                    In <strong>Classification</strong>, we predict a <strong>Category</strong>.
                                </p>
                                <p>
                                    The AI looks at the data (emails) and tries to draw a "Line" (Decision Boundary) to separate them into groups.
                                </p>
                                <div className="bg-black/30 p-4 rounded-lg border border-blue-500/20 mt-4">
                                    <strong className="text-white block mb-2">The Rule:</strong>
                                    If it contains words like <span className="text-red-400">"FREE", "WIN", "MONEY"</span> {"->"} <span className="text-red-400 font-bold">SPAM</span>.
                                    <br />
                                    Everything else {"->"} <span className="text-green-400 font-bold">INBOX</span>.
                                </div>
                            </div>

                            {/* Visual Representation of a Decision Boundary */}
                            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 relative h-64 overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-1 h-full bg-blue-500/50 border-r-2 border-dashed border-blue-400"></div>
                                </div>
                                {/* Dots representing data */}
                                <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-red-500 animate-bounce" />
                                <div className="absolute top-20 left-4 w-4 h-4 rounded-full bg-red-500 animate-bounce delay-100" />
                                <div className="absolute bottom-10 left-14 w-4 h-4 rounded-full bg-red-500 animate-bounce delay-75" />
                                <div className="absolute top-10 right-10 w-4 h-4 rounded-full bg-green-500 animate-bounce delay-150" />
                                <div className="absolute bottom-20 right-14 w-4 h-4 rounded-full bg-green-500 animate-bounce delay-200" />

                                <div className="absolute bottom-2 left-2 text-xs text-red-500 font-bold">SPAM ZONE</div>
                                <div className="absolute bottom-2 right-2 text-xs text-green-500 font-bold">INBOX ZONE</div>
                            </div>
                        </div>

                        <Button onClick={() => setPhase('classification')} className="w-full h-14 text-lg bg-blue-600 text-white hover:bg-blue-500 mt-8">
                            START SORTING
                        </Button>
                    </Card>
                </div>
            )}
            {/* PHASE 2: REGRESSION - DATA COLLECTION */}
            {phase === 'reg_data' && (
                <div className="grid md:grid-cols-2 gap-12 animate-in fade-in">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Step 1: Feed the Brain</h2>
                        <p className="text-slate-400">The AI needs examples. Add these diamonds to its memory.</p>
                        <Card className="p-6 bg-slate-800 border-blue-500/30 text-center">
                            <div className="text-sm text-slate-500 mb-2 uppercase">Example #{dataStep + 1}</div>
                            <div className="text-4xl font-black text-white mb-2">{TRAINING_DIAMONDS[dataStep].size} Carat</div>
                            <div className="text-2xl text-green-400 font-mono mb-6">Market Price: ${TRAINING_DIAMONDS[dataStep].price}</div>
                            <Button onClick={addDataPoint} className="w-full h-14 bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-blue-50">
                                <Database size={18} /> ADD TO DATASET
                            </Button>
                        </Card>
                    </div>
                    <div className="space-y-4">
                        <LiveGraph />
                        <div className="bg-black/30 p-4 rounded border border-white/10 text-xs font-mono">
                            DATASET_SIZE: {dataset.length} samples
                        </div>
                    </div>
                </div>
            )}

            {/* PHASE 3: REGRESSION - TRAINING */}
            {phase === 'reg_train' && (
                <div className="max-w-2xl mx-auto text-center space-y-8 animate-in zoom-in">
                    <h2 className="text-3xl font-bold text-white">Step 2: Training</h2>
                    <p className="text-slate-300">Now we tell the AI to find the "Line of Best Fit" through your data.</p>
                    <LiveGraph />
                    <Button onClick={() => setPhase('reg_test')} className="w-full h-16 text-xl bg-green-600 text-white font-bold hover:bg-green-500 animate-pulse">
                        <TrendingUp className="mr-2" /> TRAIN MODEL
                    </Button>
                </div>
            )}

            {/* PHASE 4: REGRESSION - TESTING */}
            {phase === 'reg_test' && (
                <div className="grid md:grid-cols-2 gap-12 animate-in fade-in">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Step 3: Prediction</h2>
                        <p className="text-slate-400">The model is trained! Enter ANY size, and it will calculate the price.</p>
                        <Card className="p-8 bg-slate-800 border-green-500/30 space-y-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 block mb-2">ENTER DIAMOND SIZE (CARATS)</label>
                                <input
                                    type="number"
                                    className="w-full bg-black border border-slate-600 text-white text-3xl p-4 rounded font-mono focus:border-green-500 outline-none"
                                    placeholder="e.g. 2.5"
                                    onChange={(e) => setTestCarat(Number(e.target.value))}
                                />
                            </div>
                            <Button onClick={handlePredict} className="w-full h-14 bg-blue-600 text-white font-bold hover:bg-blue-500">
                                <Calculator className="mr-2" /> PREDICT PRICE
                            </Button>
                            {predictedPrice !== null && (
                                <div className="bg-green-900/30 p-4 rounded border border-green-500 text-center animate-in zoom-in">
                                    <div className="text-xs text-green-400 mb-1">AI ESTIMATED PRICE</div>
                                    <div className="text-4xl font-black text-white">${predictedPrice}</div>
                                </div>
                            )}
                        </Card>
                        <Button onClick={() => setPhase('classification')} variant="outline" className="w-full border-slate-600 text-slate-300">
                            NEXT LEVEL: CLASSIFICATION <ArrowRight className="ml-2" />
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <LiveGraph />
                        <div className="bg-black/30 p-4 rounded border border-white/10 text-xs font-mono text-green-400">
                            MODEL_STATUS: ONLINE <br />
                            FORMULA_FOUND: y = 1000x
                        </div>
                    </div>
                </div>
            )}

            {/* PHASE 5: CLASSIFICATION */}
            {phase === 'classification' && (
                <div className="max-w-xl mx-auto animate-in fade-in">

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Level 2: Classification</h2>
                        <p className="text-slate-400">Sort data into categories.</p>
                    </div>
                    <Card className="p-8 bg-slate-800 border-blue-500/30 text-center space-y-8 relative">
                        <div className="bg-white text-black p-8 rounded-xl shadow-2xl -rotate-1 relative">
                            <h3 className="text-xs font-bold opacity-50 mb-2 text-left">SUBJECT LINE:</h3>
                            <p className="text-2xl font-mono font-bold text-left">"{EMAILS[emailIdx].subject}"</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <button onClick={() => handleClassification('SPAM')} className="h-32 bg-red-900/20 border-2 border-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex flex-col items-center justify-center font-bold">
                                <ShieldAlert size={32} /> SPAM
                            </button>
                            <button onClick={() => handleClassification('HAM')} className="h-32 bg-green-900/20 border-2 border-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all flex flex-col items-center justify-center font-bold">
                                <Inbox size={32} /> INBOX
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {/* PHASE 6: ML FAIL INTRO */}
            {phase === 'ml_fail_intro' && (
                <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in">
                    <Card className="p-12 bg-slate-800 border-red-500/30 text-center">
                        <AlertTriangle size={64} className="mx-auto text-red-500 mb-4" />
                        <h2 className="text-4xl font-black text-white mb-6">The Limit of Basic ML</h2>
                        <p className="text-xl text-slate-300 mb-8">
                            Basic ML is great at Math and Sorting text.
                            <br />
                            But can it <strong>SEE</strong>?
                        </p>
                        <Button onClick={() => setPhase('ml_fail_play')} className="w-full h-16 text-xl bg-red-600 text-white font-bold hover:bg-red-500">
                            TEST VISION SYSTEM
                        </Button>
                    </Card>
                </div>
            )}

            {/* PHASE 7: ML FAIL PLAY */}
            {phase === 'ml_fail_play' && (
                <div className="grid md:grid-cols-2 gap-12 items-center animate-in fade-in">
                    <div className="space-y-6 text-center">
                        {imageIdx === 0 ? (
                            <div className="w-64 h-64 mx-auto rounded-full bg-yellow-200 border-8 border-yellow-600 relative shadow-2xl">
                                <div className="absolute inset-4 rounded-full bg-red-500 opacity-80" />
                                <div className="absolute top-10 left-16 w-12 h-12 rounded-full bg-red-800" />
                                <div className="absolute top-32 right-12 w-12 h-12 rounded-full bg-red-800" />
                            </div>
                        ) : (
                            <div className="w-64 h-64 mx-auto rounded-full bg-red-600 border-8 border-red-800 relative shadow-2xl flex items-center justify-center">
                                <span className="text-white/30 font-black text-4xl rotate-12">PLASTIC</span>
                            </div>
                        )}
                        <p className="text-white font-bold text-xl">{IMAGES[imageIdx].desc}</p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Manual Feature Checklist</h2>
                        <div className="space-y-4">
                            {['round', 'red', 'flat'].map((feat) => (
                                <button
                                    key={feat}
                                    onClick={() => setMlChecklist(p => ({ ...p, [feat]: !p[feat as keyof typeof mlChecklist] }))}
                                    className={`w-full p-6 rounded-xl border-2 flex items-center justify-between ${mlChecklist[feat as keyof typeof mlChecklist] ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                                >
                                    <span className="font-bold uppercase">IS IT {feat}?</span>
                                    {mlChecklist[feat as keyof typeof mlChecklist] && <Check size={24} />}
                                </button>
                            ))}
                        </div>
                        <Button onClick={handleMLChecklist} className="w-full h-16 bg-white text-black font-black text-xl hover:bg-gray-200">
                            RUN CLASSIFIER
                        </Button>
                    </div>
                </div>
            )}

            {/* PHASE 8: DL INTRO */}
            {phase === 'dl_intro' && (
                <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in">
                    <Card className="p-8 bg-slate-800 border-purple-500/30 text-center">
                        <Layers size={64} className="mx-auto text-purple-500 mb-4" />
                        <h2 className="text-3xl font-bold text-white mb-4">Enter Deep Learning</h2>


                        [Image of artificial neural network structure]

                        <p className="text-lg text-slate-300 mb-6">
                            Standard ML failed because it couldn't "see" the plastic texture.
                            <br /><br />
                            <strong>Deep Learning</strong> uses Neural Networks to inspect pixels, textures, and details like a human eye.
                        </p>
                        <Button onClick={() => setPhase('dl_play')} className="w-full h-14 text-lg bg-purple-600 text-white hover:bg-purple-500">
                            ACTIVATE NEURAL NETWORK
                        </Button>
                    </Card>
                </div>
            )}

            {/* PHASE 9: DL PLAY */}
            {/* NEW: DEEP LEARNING PLAY (VISUALIZATION) */}
            {phase === 'dl_play' && (
                <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in">
                    {/* LEFT: THE OBJECT BEING SCANNED */}
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="relative">
                            <div className="w-64 h-64 rounded-full bg-red-600 border-8 border-red-800 relative shadow-2xl overflow-hidden group">
                                {/* The "Plastic" text is subtle, showing DL sees details humans/ML checklists miss */}
                                <div className="absolute inset-0 flex items-center justify-center text-white/10 font-black text-6xl rotate-12 group-hover:text-white/30 transition-colors">PLASTIC</div>
                                <div className="absolute top-10 left-14 w-16 h-8 bg-white/10 rounded-full blur-xl transform -rotate-12" /> {/* Specular highlight */}

                                {/* The Scan Beam */}
                                <div
                                    className="absolute top-0 left-0 w-full h-2 bg-purple-400 shadow-[0_0_50px_20px_rgba(168,85,247,0.6)]"
                                    style={{ top: `${scanProgress}%`, transition: 'top 0.1s linear' }}
                                />
                            </div>
                            <div className="text-center font-bold text-white mt-8 text-xl tracking-widest animate-pulse">
                                SCANNING PIXELS: {scanProgress}%
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: THE NEURAL NETWORK VISUALIZATION */}
                    <div className="space-y-6">
                        <Card className="p-6 bg-slate-900 border-purple-500/50 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-purple-500/30" />
                            <h3 className="text-purple-400 font-bold mb-6 flex items-center gap-2">
                                <Brain className="animate-pulse" /> NEURAL NETWORK PROCESSING
                            </h3>

                            {/* LAYER 1: INPUT (RAW DATA) */}
                            <div className={`mb-6 transition-all duration-500 ${scanProgress > 5 ? 'opacity-100' : 'opacity-20 blur-sm'}`}>
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`w-3 h-3 rounded-full ${scanProgress > 10 ? 'bg-green-400 animate-pulse' : 'bg-slate-700'}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Layer 1: Input</span>
                                </div>
                                <div className="bg-black/40 p-3 rounded border border-purple-500/20 text-xs font-mono text-green-400">
                                    Reading 40,000 pixels... <br />
                                    RGB Values: [255, 40, 40]...
                                </div>
                            </div>

                            {/* LAYER 2: HIDDEN (FEATURES) */}
                            <div className={`mb-6 transition-all duration-500 ${scanProgress > 40 ? 'opacity-100' : 'opacity-20 blur-sm'}`}>
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className={`w-4 h-4 rounded-full ${scanProgress > 50 ? 'bg-blue-400 animate-pulse' : 'bg-slate-700'}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Layer 2: Hidden (Feature Learning)</span>
                                </div>
                                <div className="bg-black/40 p-3 rounded border border-blue-500/20 text-xs font-mono text-blue-300">
                                    <span className="block mb-1">• Edge Detection: CIRCLE confirmed.</span>
                                    <span className="block mb-1">• Surface Analysis: <span className="text-yellow-400 font-bold">HIGHLY REFLECTIVE (Plastic)</span></span>
                                    <span className="block">• Sauce Check: <span className="text-red-400 font-bold">NEGATIVE (No Organic Texture)</span></span>
                                </div>
                            </div>

                            {/* LAYER 3: OUTPUT (DECISION) */}
                            <div className={`transition-all duration-500 ${scanProgress > 80 ? 'opacity-100' : 'opacity-20 blur-sm'}`}>
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={`w-6 h-6 rounded-full border-4 ${scanProgress > 90 ? 'bg-red-500 border-red-300' : 'bg-slate-700 border-slate-600'}`} />
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Layer 3: Output</span>
                                </div>
                                <div className="bg-red-900/20 p-4 rounded border border-red-500/50 text-center">
                                    <div className="text-xs text-red-400 mb-1">FINAL CLASSIFICATION</div>
                                    <div className="text-3xl font-black text-white">NOT A PIZZA</div>
                                    <div className="text-xs text-slate-400 mt-2">Confidence: 99.8%</div>
                                </div>
                            </div>
                        </Card>

                        {/* CONTROLS */}
                        {scanProgress === 0 && (
                            <Button onClick={runDeepScan} className="w-full h-16 bg-purple-600 text-white font-bold text-xl hover:bg-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                                <Eye className="mr-2" /> INITIATE NEURAL SCAN
                            </Button>
                        )}

                        {scanProgress === 100 && (
                            <div className="space-y-4 animate-in slide-in-from-bottom-4">
                                <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg flex items-start gap-3">
                                    <Check className="text-green-400 shrink-0" />
                                    <div>
                                        <strong className="text-white block">Why DL Worked:</strong>
                                        <p className="text-sm text-slate-300">
                                            It didn't rely on your checklist ("Is it red?"). It analyzed the <strong>texture</strong> of the plastic and realized it wasn't food.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* PHASE 10: SUMMARY */}
            {phase === 'summary' && (
                <div className="max-w-4xl mx-auto py-12 animate-in fade-in">
                    <h2 className="text-4xl font-black text-white text-center mb-12">Lesson Complete</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="p-6 bg-slate-800 border-green-500/30">
                            <TrendingUp className="text-green-500 mb-4" size={40} />
                            <h3 className="font-bold text-white text-xl mb-2">Regression</h3>
                            <p className="text-sm text-slate-400">Finding the math pattern in numbers.</p>
                        </Card>
                        <Card className="p-6 bg-slate-800 border-blue-500/30">
                            <Split className="text-blue-500 mb-4" size={40} />
                            <h3 className="font-bold text-white text-xl mb-2">Classification</h3>
                            <p className="text-sm text-slate-400">Sorting data into categories.</p>
                        </Card>
                        <Card className="p-6 bg-slate-800 border-purple-500/30">
                            <Layers className="text-purple-500 mb-4" size={40} />
                            <h3 className="font-bold text-white text-xl mb-2">Deep Learning</h3>
                            <p className="text-sm text-slate-400">Seeing complex patterns (Vision).</p>
                        </Card>
                    </div>
                    <div className="flex justify-center mt-12 gap-6">
                        <Button onClick={() => window.location.reload()} variant="outline" className="h-14 px-8 border-slate-600 text-slate-300">
                            <RefreshCcw className="mr-2" /> REPLAY
                        </Button>
                        <Button onClick={() => navigate('/')} className="h-14 px-12 bg-white text-black font-bold text-lg hover:bg-gray-200">
                            FINISH
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};