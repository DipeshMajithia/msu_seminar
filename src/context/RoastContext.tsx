import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { KokoroTTS } from 'kokoro-js';
import { env } from '@huggingface/transformers';

// Suppress ONNX warnings
env.backends.onnx.logLevel = 'error'; 

interface RoastContextType {
    roast: (text: string) => void;
    confess: (text: string) => void;
    stop: () => void;
    isSpeaking: boolean;
    initializeVoice: () => Promise<void>;
    enableAudio: () => void;
    voiceStatus: 'idle' | 'loading' | 'ready' | 'error';
    voiceError?: string;
}

const RoastContext = createContext<RoastContextType | undefined>(undefined);

export const RoastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceStatus, setVoiceStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
    const [tts, setTts] = useState<any>(null);
    const [voiceError, setVoiceError] = useState<string>();
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    
    // Use strict Ref for initialization tracking
    const initializationRef = useRef(false);
    
    // Queue for messages triggered before voice was ready
    const [pendingQueue, setPendingQueue] = useState<string[]>([]);

    const enableAudio = () => {
        setIsAudioEnabled(true);
        // Resume AudioContext if it exists and is suspended (common browser requirement)
        if (window.AudioContext || (window as any).webkitAudioContext) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContext();
            ctx.resume();
        }
    };

    // 2. Helper to convert raw floating point audio to WAV blob
    const floatToWav = (channels: number, sampleRate: number, samples: Float32Array) => {
        const buffer = new ArrayBuffer(44 + samples.length * 2);
        const view = new DataView(buffer);

        const writeString = (view: DataView, offset: number, string: string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        // RIFF chunk descriptor
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + samples.length * 2, true);
        writeString(view, 8, 'WAVE');

        // fmt sub-chunk
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // PCM format
        view.setUint16(22, channels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * channels * 2, true);
        view.setUint16(32, channels * 2, true);
        view.setUint16(34, 16, true); // 16-bit

        // data sub-chunk
        writeString(view, 36, 'data');
        view.setUint32(40, samples.length * 2, true);

        // Write samples
        let p = 44;
        for (let i = 0; i < samples.length; i++) {
            let s = Math.max(-1, Math.min(1, samples[i]));
            view.setInt16(p, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
            p += 2;
        }

        return new Blob([view], { type: 'audio/wav' });
    };

    // 1. Helper to normalize audio levels prevents static noise
    const normalizeAudio = (samples: Float32Array): Float32Array => {
        let maxVal = 0;
        let sum = 0;
        let hasInvalid = false;
        
        for (let i = 0; i < samples.length; i++) {
            if (!Number.isFinite(samples[i])) {
                hasInvalid = true;
                continue;
            }
            const val = Math.abs(samples[i]);
            if (val > maxVal) maxVal = val;
            sum += val;
        }
        
        if (hasInvalid) console.warn("Detected NaN or Infinity in audio samples!");
        
        const avg = sum / samples.length;
        console.log("Audio Stats - Peak:", maxVal, "Avg:", avg);
        console.log("First 10 samples:", Array.from(samples.slice(0, 10)));
        
        if (maxVal === 0) return samples;

        let targetScale = 1.0;
        
        // Massive values (like 3e14) shouldn't happen. If they do, something is wrong.
        // We'll try to scale them down to 1.0 peak, but the result might be garbage if it's just noise.
        if (maxVal > 0.95) {
             console.log("Normalizing loud audio by factor:", 0.95 / maxVal);
             targetScale = 0.95 / maxVal;
        }

        const normalized = new Float32Array(samples.length);
        for (let i = 0; i < samples.length; i++) {
            let s = samples[i];
            if (!Number.isFinite(s)) s = 0;
            s = s * targetScale;
            if (s > 1.0) s = 1.0;
            if (s < -1.0) s = -1.0;
            normalized[i] = s;
        }
        return normalized;
    };

    // Helper for fallback speech synthesis
    const speakFallback = (text: string) => {
        if (!window.speechSynthesis) return;
        console.log("Using Web Speech API Fallback for:", text);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    // 3. Speak Internal Logic
    const speakInternal = async (ttsInstance: any, text: string) => {
        if (!ttsInstance) {
            console.warn("TTS Instance null during speakInternal");
            return;
        }
        try {
            console.log("Generating audio for:", text);
            setIsSpeaking(true);
            const audioData = await ttsInstance.generate(text, {
                voice: "af_heart", 
            });
            console.log("Kokoro generation complete. AudioData keys:", Object.keys(audioData));

            let audioUrl: string | null = null;
            let pcmData: Float32Array | null = null;
            let sampleRate = 24000;

            if (audioData.audio && audioData.sampling_rate) {
                 pcmData = audioData.audio;
                 sampleRate = audioData.sampling_rate;
            }

            if (pcmData) {
                console.log("Processing RAW PCM data (size:", pcmData.length, ")...");
                pcmData = normalizeAudio(pcmData);
                
                const wavBlob = floatToWav(1, sampleRate, pcmData);
                console.log("WAV Blob created, size:", wavBlob.size);
                audioUrl = URL.createObjectURL(wavBlob);
            } else {
                console.warn("No RAW audio data found in response.");
            }

            if (audioUrl) {
                const audio = new Audio(audioUrl);
                audio.onended = () => {
                    console.log("Audio playback ended.");
                    setIsSpeaking(false);
                    if (audioUrl) URL.revokeObjectURL(audioUrl);
                };
                audio.onerror = (e) => {
                    console.error("Audio internal error event:", e);
                    setIsSpeaking(false);
                    speakFallback(text);
                };
                console.log("Starting playback...");
                await audio.play().catch(e => {
                    console.error("Audio.play() rejected:", e);
                    setIsSpeaking(false);
                    speakFallback(text);
                });
            } else {
                 console.warn("Could not create Audio URL.");
                 speakFallback(text);
            }
        } catch (e) {
            console.error("Kokoro speakInternal exception:", e);
            setIsSpeaking(false);
            speakFallback(text);
        }
    };

    const initializeVoice = async () => {
        try {
            setVoiceStatus('loading');
            console.log("Downloading Kokoro model (FP32)...");
            
            const model_id = "onnx-community/Kokoro-82M-v1.0-ONNX";
            const ttsInstance = await KokoroTTS.from_pretrained(model_id, {
                dtype: "fp32", // Switching from q8 to fp32 for stability
                device: "webgpu" 
            }).catch(async (e: any) => {
                console.warn("WebGPU/FP32 failed, trying wasm fp32", e);
                return await KokoroTTS.from_pretrained(model_id, {
                    dtype: "fp32",
                    device: "wasm"
                });
            });

            setTts(ttsInstance);
            setVoiceStatus('ready');
            console.log("Kokoro Voice Ready");
        } catch (e: any) {
            console.error("Failed to initialize Kokoro:", e);
            setVoiceStatus('error');
            setVoiceError(e.message || "Unknown error");
        }
    };

    // Process queue when voice becomes ready
    useEffect(() => {
        if (voiceStatus === 'ready' && tts && pendingQueue.length > 0 && isAudioEnabled) {
            const processQueue = async () => {
                console.log("Voice ready & Audio enabled. Processing pending queue:", pendingQueue);
                for (const text of pendingQueue) {
                    await speakInternal(tts, text).catch(e => console.error("Queue playback error", e));
                }
                setPendingQueue([]);
            };
            processQueue();
        }
    }, [voiceStatus, tts, pendingQueue, isAudioEnabled]);

    // Auto-initialize voice on mount (only once)
    useEffect(() => {
        if (!initializationRef.current) {
            initializationRef.current = true;
            initializeVoice();
        }
    }, []);

    const roast = (text: string) => {
        console.log("🔥 ROAST:", text);
        if (voiceStatus === 'ready' && tts) {
            speakInternal(tts, text).catch(() => speakFallback(text));
        } else {
            console.log("Voice not ready, queuing roast:", text);
            setPendingQueue(prev => prev.includes(text) ? prev : [...prev, text]);
        }
    };

    const confess = (text: string) => {
        console.log("🤖 CONFESSION:", text);
        if (voiceStatus === 'ready' && tts) {
            speakInternal(tts, text).catch(() => speakFallback(text));
        } else {
             console.log("Voice not ready, queuing confession:", text);
             setPendingQueue(prev => prev.includes(text) ? prev : [...prev, text]);
        }
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    // Cleanup
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    return (
        <RoastContext.Provider value={{ roast, confess, stop, isSpeaking, initializeVoice, enableAudio, voiceStatus, voiceError }}>
            {children}
        </RoastContext.Provider>
    );
};

export const useRoast = () => {
    const context = useContext(RoastContext);
    if (context === undefined) {
        throw new Error('useRoast must be used within a RoastProvider');
    }
    return context;
};
