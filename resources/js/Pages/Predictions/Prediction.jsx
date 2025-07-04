import { useEffect, useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
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

const recommendationLists = {
  High: [
    "Consider focusing marketing efforts during this month to maximize sales.",
    "This is a prime time to sell! Maximize your home's visibility with professional photography and a virtual tour.",
    "The market is on your side. Price your home competitively to potentially attract multiple offers.",
    "Leverage the expected sales boom by hosting an open house to create a sense of urgency among buyers.",
  ],
  Moderate: [
    "Sales are steady. Stand out from the crowd with a unique marketing approach, such as a twilight photoshoot.",
    "With moderate sales expected, accurate pricing is key to attracting serious buyers.",
  ],
  Low: [
    "While sales are predicted to be slower, serious buyers are still out there. Focus on high-quality online marketing.",
    "In a buyer's market, a competitive price is your strongest tool. Consider pricing slightly below comparable homes.",
  ],
};

export default function Prediction({ projects, results }) {
  const pageProps = usePage().props;
  const [scrolled, setScrolled] = useState(false);
  const form = useForm({
    project: "",
    period: 12, // Default to 12 months
  });

  const data =
    results.predictedHouse && results.predictedHouse.length > 0
      ? {
          labels: results.predictedHouse.map((item) => item.month),
          datasets: [
            {
              label: "Predicted House Sales",
              data: results.predictedHouse.map((item) => item.total),
              fill: false,
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.4)",
              tension: 0.1,
            },
          ],
        }
      : {};

  const handlePredict = () => {
    form.post(route("prediction.predict"), {
      onSuccess: form.reset(),
      onError: (error) => {
        // Todo: handle error gracefully
        console.error("Prediction error:", error);
        alert("Failed to fetch prediction results. Please try again.");
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    form.setData(name, Number(value));
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // useEffect hook runs the logic once after the component mounts
  const generatePeakSalesRecommendation = (salesData) => {
    if (!salesData || salesData.length === 0) {
      return "No sales data available.";
    }

    // Step 1: Find the peak month data.
    const peakMonthData = salesData.reduce(
      (max, current) => (current.total > max.total ? current : max),
      salesData[0]
    );

    const peakMonth = peakMonthData.month;
    const peakSales = peakMonthData.total;

    // Step 2: Since this is the peak, we use the "High" category recommendations.
    const highTierRecommendations = recommendationLists.High;

    // Randomly select one recommendation.
    const randomIndex = Math.floor(
      Math.random() * highTierRecommendations.length
    );
    const chosenRecommendation = highTierRecommendations[randomIndex];

    // Step 3: Format the final output string.
    const finalString = `Based on the predicted sales, the highest sales are expected in ${peakMonth} with a total of ${peakSales}. ${chosenRecommendation}`;

    return finalString;
  };

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
      <main className="container mx-auto px-4 pt-24 text-white max-w-[1073px]">
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
                    value={form.data.project}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-500 text-white/90"
                    options={[
                      { value: "s", label: "Select Project", disabled: true },
                      { value: "", label: "All Projects" },
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
                    <span className="font-bold text-brand-400">
                      {form.data.period}
                    </span>{" "}
                    months
                  </Label>
                  <input
                    id="period"
                    name="period"
                    type="range"
                    min="1"
                    max="12"
                    value={form.data.period}
                    onChange={handleChange}
                    className="w-full h-3 bg-white/40 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-white/70 mt-2">
                    {[...Array(12)].map((_, index) => (
                      <span
                        onClick={() => form.setData("period", index + 1)}
                        key={index}
                        className={`w-1/12 text-center cursor-pointer ${
                          index + 1 === form.data.period
                            ? "text-white font-semibold"
                            : ""
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
                Start Predict
              </Button>
            </div>
            {/* Notes for user to tell them if predicition is not 100% accurate */}
            <div>
              <p className="text-sm text-white/70 mt-6 font-bold">
                Note: The predictions are based on historical data. They are not
                guaranteed to be accurate and should be used as a guide only.
              </p>
            </div>
          </div>
        </div>
      </main>
      <main className="container mx-auto px-4  text-white">
        {results.predictedHouse.length > 0 && (
          <div className="bg-white/10 rounded-xl shadow-lg p-6 mb-8 backdrop-blur">
            <h2 className="text-2xl font-bold mb-6">Prediction Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 mb-8">
              <div className="bg-green-500/10 p-4 rounded-lg border border-green-300/30">
                <h3 className="text-sm font-medium mb-3">Predicted House</h3>
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
                    {results.predictedHouse.map((item, index) => (
                      <tr key={index} className="hover:bg-white/5">
                        <td className="px-2 py-1">{item.month}</td>
                        <td className="px-2 py-1">{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Recommendation */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium">Recommendation: </h4>
                  <p className="text-xs text-white/70">
                    {generatePeakSalesRecommendation(results.predictedHouse)}
                  </p>
                </div>
              </div>
              <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-300/30">
                <h3 className="text-sm font-medium">Potential Sales</h3>
                <Line data={data} options={{}} className="w-full" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
