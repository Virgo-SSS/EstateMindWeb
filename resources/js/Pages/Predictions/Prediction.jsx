import { useEffect, useState, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import Button from "../../components/ui/button/Button";
import Label from "../../components/ui/label/Label";
import Select from "../../components/ui/input/Select";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Prediction({ projects }) {
  const pageProps = usePage().props;
  const [selectedProject, setSelectedProject] = useState("");
  const [period, setPeriod] = useState(12);
  const [results, setResults] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "My First Dataset",
        data: [65, 59, 80, 81, 56, 55, 40, 60, 70, 90, 100, 120],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Simulate fetching results

  const handlePredict = () => {
    if (!selectedProject) {
      alert("Please select a housing project.");
      return;
    }

    // Simulate an API call to fetch prediction results
    const simulatedResults = {
      predictedHouse: Array.from({ length: period }, (_, i) => ({
        month: labels[i % 12],
        total: `$${(Math.random() * 100000 + 200000).toFixed(2)}`,
      })),
    };

    setResults(simulatedResults);
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950">
      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 
                ${
                  scrolled
                    ? "bg-white/7 dark:bg-black/30 backdrop-blur-md border-b border-white/10"
                    : "bg-transparent border-none"
                }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-2">
              <img
                src="/images/logo/abp-logo.png"
                alt="Logo"
                className="w-10 h-10"
              />
            </div>
            <h1 className="text-xl font-bold text-white">EstateMind</h1>
          </div>
          <div className="flex items-center space-x-4">
            {pageProps.auth.user ? (
              <Link href={route("dashboard")}>
                <Button
                  size="sm"
                  variant="primary"
                  className="flex items-center"
                >
                  Back to Dashboard
                </Button>
              </Link>
            ) : (
              <Link href={route("login")}>
                <Button
                  size="sm"
                  variant="primary"
                  className="flex items-center"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-24 text-white max-w-[1073px]">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            House Sales Predictor
          </h1>
          <p className="text-lg max-w-2xl mx-auto animate__animated animate__fadeIn animate__delay-1s">
            Predict future house sales prices based on current market trends and
            historical data.
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
                  <Label className={"text-white"} htmlFor={"project"}>
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
                  <Label className={"text-white"} htmlFor={"period"}>
                    Prediction Period:{" "}
                    <span className="font-bold text-brand-400">{period}</span>{" "}
                    months
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
                        className={`w-1/12 text-center cursor-pointer ${
                          index + 1 === period ? "text-white font-semibold" : ""
                        }`}
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
                size="md"
                onClick={handlePredict}
                className="animate-bounce"
              >
                Predict Future Prices
              </Button>
            </div>
          </div>
        </div>

        {results && (
          <div className="bg-white/10 rounded-xl shadow-lg p-6 mb-8 backdrop-blur">
            <h2 className="text-2xl font-bold mb-6">Prediction Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 mb-8">
              <div className="bg-green-500/10 p-4 rounded-lg border border-green-300/30">
                <h3 className="text-sm font-medium mb-3">Predicted House</h3>
                {/* Month, Predicted House */}
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 border-b border-white/20">
                        Month
                      </th>
                      <th className="px-2 py-1 border-b border-white/20">
                        Predicted House
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results?.predictedHouse.map((item, index) => (
                      <tr key={index} className="hover:bg-white/5">
                        <td className="px-2 py-1">{item.month}</td>
                        <td className="px-2 py-1">{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-300/30">
                <h3 className="text-sm font-medium">Potential Gain</h3>
                <div className="h-80">
                  <Line data={data} options={{}} className="w-full" />
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => setResults(null)}
                className="px-6 py-2 text-white font-medium rounded-lg hover:bg-white/10 transition"
              >
                Start New Prediction
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
