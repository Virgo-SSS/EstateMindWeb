import { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Link, usePage } from '@inertiajs/react';
import Button from "../../components/ui/button/Button";
import Label from "../../components/ui/label/Label";
import { ThemeProvider } from '../../context/ThemeContext';
import ThemeTogglerTwo from '../../components/common/ThemeTogglerTwo';
import Select from '../../components/ui/input/Select';


const getRecommendation = (growthRate) => {
    const rate = parseFloat(growthRate);
    if (rate > 7) return "This property shows exceptional growth potential. Strongly recommended for investment with high expected returns.";
    if (rate > 5) return "This property has above-average growth potential. Recommended for investment with good expected returns.";
    if (rate > 3) return "This property shows steady growth potential. Consider for investment with moderate expected returns.";
    return "This property has below-average growth potential. May be suitable for long-term holding or personal use.";
};

export default function Prediction({ projects }) {
    const pageProps = usePage().props;
    const [selectedProject, setSelectedProject] = useState("");
    const [period, setPeriod] = useState(12);
    const [results, setResults] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const chartRef = useRef(null);

    const handlePredict = () => {
        alert("The prediction feature will be available soon. Stay tuned!");
    };

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 30);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const canvas = document.getElementById("starCanvas");
        const ctx = canvas.getContext("2d");
    
        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);
    
        let particles = [];
        const numStars = 150;
    
        for (let i = 0; i < numStars; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                radius: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.5,
            });
        }
    
        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = "#ffffff";
    
            particles.forEach((p) => {
                ctx.beginPath();
                ctx.globalAlpha = p.opacity;
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
                ctx.fill();
            });
    
            update();
            requestAnimationFrame(draw);
        };
    
        const update = () => {
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
    
                // wrap around
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;
    
                // twinkle effect
                p.opacity += (Math.random() - 0.5) * 0.05;
                p.opacity = Math.max(0.3, Math.min(p.opacity, 1));
            });
        };
    
        draw();
    
        // Resize handler
        const onResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
    
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Gradient & Stars */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,#071654_0%,#090a0f_100%)]">
                <canvas id="starCanvas" className="absolute inset-0 -z-10"></canvas>
            </div>

            {/* Header */}
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 
                ${scrolled ? "bg-white/7 dark:bg-black/30 backdrop-blur-md border-b border-white/10" : "bg-transparent border-none"}`}>
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="mr-2">
                            <img src="/images/logo/abp-logo.png" alt="Logo" className="w-10 h-10" />
                        </div>
                        <h1 className="text-xl font-bold text-white">
                            EstateMind
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        {
                            pageProps.auth.user ? (
                                <Link href={route('dashboard')}>
                                    <Button size="sm" variant="primary" className="flex items-center">
                                        Back to Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={route('login')}>
                                    <Button size="sm" variant="primary" className="flex items-center">
                                        Login
                                    </Button>
                                </Link>
                            )
                        }
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-24 text-white">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">House Sales Predictor</h1>
                    <p className="text-lg max-w-2xl mx-auto animate__animated animate__fadeIn animate__delay-1s">
                        Predict future house sales prices based on current market trends and historical data.
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm mb-4">
                    <div className="px-6 py-5">
                        <h3 className="text-base font-medium">Select Parameters</h3>
                    </div>
                    <div className="p-4 border-t border-white/10 sm:p-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label
                                        className={"text-white"}
                                        htmlFor={"project"}>
                                            Select Housing Project
                                    </Label>
                                    <Select
                                        id={"project"}
                                        name={"project"}
                                        value={selectedProject}
                                        onChange={(e) => setSelectedProject(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-500 text-white/90"
                                        options={[
                                            { value: "", label: "Select Project", disabled: true },
                                            ...projects.map((project) => ({
                                                value: project.id,
                                                label: project.name,
                                            })),
                                        ]}
                                    />
                                </div>

                                <div>
                                    <Label
                                        className={"text-white"}
                                        htmlFor={"period"}
                                    >
                                        Prediction Period: <span className="font-bold text-brand-400">{period}</span> months
                                    </Label>
                                    <input
                                        id="period"
                                        name="period"
                                        type="range"
                                        min="1"
                                        max="12"
                                        value={period}
                                        onChange={(e) => setPeriod(Number(e.target.value))}
                                        className="w-full h-3 bg-white/40 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-sm text-white/70 mt-2">
                                        {[...Array(12)].map((_, index) => (
                                            <span
                                                onClick={() => setPeriod(index + 1)}
                                                key={index}
                                                className={`w-1/12 text-center cursor-pointer ${index + 1 === period ? 'text-white font-semibold' : ''}`}
                                            >
                                                {index + 1}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-14 text-center">
                            <Button
                                size='md'
                                onClick={handlePredict}
                                className="animate-bounce"
                            >
                                Predict Future Prices
                            </Button>
                        </div>
                    </div>
                </div>

                {/* {results && ( */}
                    <div className="bg-white/10 rounded-xl shadow-lg p-6 mb-8 backdrop-blur">
                        <h2 className="text-2xl font-bold mb-6">Prediction Results</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-green-500/10 p-4 rounded-lg border border-green-300/30">
                                <h3 className="text-sm font-medium">Predicted Price</h3>
                                <p className="text-2xl font-bold mt-1">0</p>
                            </div>
                            <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-300/30">
                                <h3 className="text-sm font-medium">Potential Gain</h3>
                                <p className="text-2xl font-bold mt-1">0</p>
                            </div>
                            <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-300/30">
                                <h3 className="text-sm font-medium">Annual Growth</h3>
                                <p className="text-2xl font-bold mt-1">{0}%</p>
                            </div>
                        </div>

                        <div className="h-80">
                            <canvas ref={chartRef}></canvas>
                        </div>

                        <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/20">
                            <h3 className="text-lg font-medium mb-2">Our Recommendation</h3>
                            <p>{getRecommendation(Math.random() * 10)}</p>
                        </div>

                        <div className="text-center mt-8">
                            <button onClick={() => setResults(null)} className="px-6 py-2 text-white font-medium rounded-lg hover:bg-white/10 transition">
                                Start New Prediction
                            </button>
                        </div>
                    </div>
                {/* )} */}
            </main>
        </div>
    );
}