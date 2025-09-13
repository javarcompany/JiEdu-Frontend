import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { User, BookOpen } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";

const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const UnitCard = ({id, image, title, details, progress }: {id: string; image: string; title: string; details: {trainer: string; lessons: number}; progress: number}) => {
    const navigate = useNavigate();
    // Generate two random colors only once per component render
    const randomColors = useMemo(() => [getRandomColor(), getRandomColor()], []);
  
    // Chart options for the donut chart
    const options: ApexOptions = {
        colors: randomColors,
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "radialBar",
            sparkline: {
                enabled: true,
            },
        },
        plotOptions: {
            radialBar: {
                startAngle: -180,
                endAngle: 180,
                hollow: {
                    size: "60%",
                },
                track: {
                    background: "#E4E7EC",
                    strokeWidth: "100%",
                    margin: 3, // margin is in pixels
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        fontSize: "100%",
                        fontWeight: "600",
                        offsetY: 0,
                        color: "#1D2939",
                        formatter: function (val) {
                            return val + "%";
                        },
                    },
                },
            },
        },
        fill: {
            type: "gradient",
            colors: randomColors,
        },
        stroke: {
            lineCap: "round",
        },
        labels: ["Progress"],
    };

    return (
        <div className="mt-15 relative dark:border-2 dark:border-blue-700 dark:shadow-lg rounded-2xl shadow-md w-full max-w-sm p-4 flex flex-col gap-3">
            {/* Image */} 
            <div className="w-full flex justify-center absolute -top-15 left-1/2 -translate-x-1/2">
                <img
                    src={image}
                    alt={title}
                    className="w-[90%] h-50 object-cover rounded-2xl shadow-md"
                />
            </div>

            <div className="mt-30 flex flex-col gap-3 p-4">
                {/* Title */}
                <h3 className="text-lg font-semibold">{title}</h3>

                {/* Details + Donut */}
                <div className="flex items-center">
                    {/* Left Details */}
                    <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-2 text-gray-600">
                            <User size={18} />
                            <span className="text-sm">{details.trainer}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <BookOpen size={18} />
                            <span className="text-sm">{details.lessons} Lessons</span>
                        </div>
                    </div>

                    {/* Donut Chart */}
                    <div className="ml-auto">
                        <Chart
                            options={options}
                            series={[progress]}
                            type="radialBar"
                            height={100}
                            width={100}
                        />
                    </div>
                </div>

                {/* Button */}
                <button
                    onClick={() => navigate(`/learn/${id}`)}
                    className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                    Learn
                </button>
            </div>
        </div>
    );
};

export default UnitCard;
