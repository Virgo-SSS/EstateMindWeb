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
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    const handlePredict = () => {
        alert("The prediction feature will be available soon. Stay tuned!");
    };

    return (
        <ThemeProvider>
            <div className="min-h-screen bg-[#f7f7f7] dark:bg-gray-900">
                <header className="bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="mr-2">
                                <img src="/images/logo/abp-logo.png" alt="Logo" className="w-10 h-10"/>
                            </div>
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                                EstateMind
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            {
                                pageProps.auth.user ? (
                                    <Link href={route('dashboard')} className="text-gray-800 dark:text-white hover:text-blue-500 transition duration-200">
                                        <Button size="sm" variant="primary" className="flex items-center">
                                            Back to Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href={route('login')} className="text-gray-800 dark:text-white hover:text-blue-500 transition duration-200">
                                        <Button size="sm" variant="primary" className="flex items-center">
                                            Login
                                        </Button>
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-brand-600 mb-4 dark:text-white">House Sales Predictor</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto animate__animated animate__fadeIn animate__delay-1s">
                            Predict future house sales prices based on current market trends and historical data.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mb-4">
                        <div className="px-6 py-5">
                            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Select Parameters</h3>
                        </div>
                        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor={"project"}>
                                            Select Housing Project
                                        </Label>
                                        <Select
                                            id={"project"}
                                            name={"project"}
                                            value={selectedProject}
                                            onChange={(e) => setSelectedProject(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                                        <Label>
                                            Prediction Period: <span className="text-brand-500 font-bold">{period}</span> months
                                        </Label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="12"
                                            value={period}
                                            onChange={(e) => setPeriod(Number(e.target.value))}
                                            className="w-full h-3 bg-brand-500 rounded-lg appearance-none cursor-pointer accent-blue-100 transition-all duration-200 ease-in-out relative z-10"
                                        /> 
                                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                                            {
                                                [...Array(12)].map((_, index) => (
                                                    <span
                                                        onClick={() => setPeriod(index + 1)}
                                                        key={index} 
                                                        className={`w-1/12 text-center cursor-pointer ${index + 1 === period ? 'text-brand-600 font-semibold' : ''}`}
                                                    >
                                                        {index + 1}
                                                    </span>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>           
                            </div>
                            <div className="mt-12 text-center">
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

                    {results && (
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate__animated animate__fadeIn">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Prediction Results</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                    <h3 className="text-sm font-medium text-green-800">Predicted Price</h3>
                                    <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(results.predictedPrice)}</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                    <h3 className="text-sm font-medium text-purple-800">Potential Gain</h3>
                                    <p className="text-2xl font-bold text-purple-600 mt-1">{formatCurrency(results.potentialGain)}</p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                    <h3 className="text-sm font-medium text-yellow-800">Annual Growth</h3>
                                    <p className="text-2xl font-bold text-yellow-600 mt-1">{results.annualGrowth}%</p>
                                </div>
                            </div>

                            <div className="h-80">
                                <canvas ref={chartRef}></canvas>
                            </div>

                            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Our Recommendation</h3>
                                <p className="text-gray-600">{getRecommendation(Math.random(10))}</p>
                            </div>

                            <div className="text-center mt-8">
                                <button onClick={() => setResults(null)} className="px-6 py-2 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition">
                                    Start New Prediction
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
            <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
                <ThemeTogglerTwo />
            </div>
        </ThemeProvider>
    );
};