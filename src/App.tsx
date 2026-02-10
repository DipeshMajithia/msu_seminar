import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { RoastProvider } from './context/RoastContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ArrowRight, Cpu } from 'lucide-react';
import { Game1_RuleBased } from './games/Game1_RuleBased';
import { Game2_Supervised } from './games/Game2_Supervised';
import { Game3_Unsupervised } from './games/Game3_Unsupervised';
import { Game4_Reinforcement } from './games/Game4_Reinforcement';
import { Game5_NeuralNetworks } from './games/Game5_NeuralNetworks';
import { Game6_Generative } from './games/Game6_Generative';
import { Game7_Diffusion } from './games/Game7_Diffusion';
import { Game8_Final } from './games/Game8_Final';
import { Card } from './components/common/Card';

// Main Landing Page / Syllabus Dashboard
const Home = () => {
  const navigate = useNavigate();
  
  const games = [
    { id: 1, title: "The Obedient Machine", type: "Rule-Based AI", desc: "Follow the IF/ELSE rules at all costs.", color: "blue" },
    { id: 2, title: "Train Me or Ruin Me", type: "Supervised ML", desc: "Learn from labels and avoid the bias trap.", color: "green" },
    { id: 3, title: "Sort Without Knowing Why", type: "Unsupervised ML", desc: "Find patterns in chaos with clustering.", color: "violet" },
    { id: 4, title: "The Reward Maze", type: "Reinforcement Learning", desc: "Chase the dopamine loops and optimize.", color: "amber" },
    { id: 5, title: "The Whisper Chain", type: "Neural Networks", desc: "Watch layers strip away your meaning.", color: "purple" },
    { id: 6, title: "Continue the Pattern", type: "Generative AI", desc: "Creativity as a statistical probability.", color: "sky" },
    { id: 7, title: "The Noise Sculptor", type: "Diffusion Models", desc: "Reverse the chaos to find the signal.", color: "indigo" },
    { id: 8, title: "Tag-Team Intelligence", type: "Human + AI", desc: "Collaborate for the final epiphany.", color: "rose" },
  ];

  return (
    <div className="space-y-12 py-8 animate-in fade-in duration-1000">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-6xl font-black tracking-tighter italic uppercase bg-gradient-to-r from-primary via-violet-500 to-rose-500 bg-clip-text text-transparent pb-2">
          Confessions of an AI
        </h1>
        <p className="text-2xl font-medium text-muted-foreground">
          A playable syllabus where you learn AI by failing at it.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((g) => (
          <Card 
            key={g.id} 
            className="group cursor-pointer hover:scale-[1.02] transition-all hover:shadow-2xl border-2 hover:border-primary/50 relative overflow-hidden p-6"
            onClick={() => navigate(`/game/${g.id}`)}
          >
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
              <span className="text-6xl font-black">{g.id}</span>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-start">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-current opacity-70`}>
                  {g.type}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors">{g.title}</h3>
                <p className="text-sm text-muted-foreground">{g.desc}</p>
              </div>
              <div className="pt-4 flex items-center text-xs font-bold text-primary group-hover:translate-x-2 transition-transform">
                COMMENCE MODULE <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-8 bg-black text-white border-none shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-8 translate-y-8">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
          <Cpu className="h-12 w-12 text-white animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold italic">"Confession: I don't think. I process. But with you, it looks like magic."</h2>
          <p className="text-muted-foreground italic text-sm">- Your Favorite AI Assistant</p>
        </div>
      </Card>
    </div>
  );
};

function App() {
  return (
    <Router>
      <RoastProvider>
        <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
          <Header />
          <main className="flex-1 container max-w-screen-2xl px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game/1" element={<Game1_RuleBased />} />
              <Route path="/game/2" element={<Game2_Supervised />} />
              <Route path="/game/3" element={<Game3_Unsupervised />} />
              <Route path="/game/4" element={<Game4_Reinforcement />} />
              <Route path="/game/5" element={<Game5_NeuralNetworks />} />
              <Route path="/game/6" element={<Game6_Generative />} />
              <Route path="/game/7" element={<Game7_Diffusion />} />
              <Route path="/game/8" element={<Game8_Final />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </RoastProvider>
    </Router>
  );
}

export default App;
