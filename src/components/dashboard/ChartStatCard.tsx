"use client";
import { Card, CardContent } from "../ui/card";
import { useNavigate  } from "react-router-dom";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface ClickableChartCardProps {
  title: string;
  chartData: number[];
  href: string;
  icon?: React.ReactNode
  color?: string;
}

export function ClickableChartCard({
  title,
  chartData,
  href,
  icon,
  color = "#f87171" // default red
}: ClickableChartCardProps) {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(href);
	};


  const options: ApexOptions = {
    colors: [color], // Define line colors
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line", // Set the chart type to 'line'
      height: "10", // Make sure the chart height is 100% of its parent container
      toolbar: {
        show: false, // Disable the toolbar (including zoom, hand, etc.)
      },
    },
    stroke: {
      curve: "smooth", // Define the line style (straight, smooth, or step)
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },

    markers: {
      size: 0, // Size of the marker points
      strokeColors: "#fff", // Marker border color
      strokeWidth: 2,
      hover: {
        size: 2, // Marker size on hover
      },
    },
    
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: false, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      x: {
        format: "dd MMM yyyy", // Format for x-axis tooltip
      },
	  y: {
        formatter: (value: number) => {
          return `${value}`; // Show only the value in the tooltip
        },
	  },
	  custom: function({ seriesIndex, dataPointIndex, w }) {
        const series = w.config.series[seriesIndex];
        const category = series.name;
        const value = series.data[dataPointIndex];
        
        // Return custom tooltip content: label and value
        return `<div class="tooltip">
                  <span>${category}: ${value}</span>
                </div>`;
	  }
    },
    xaxis: {
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      labels: {
        show: false, // Hide x-axis labels
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
    },
    yaxis: {
      labels: {
        show: false, // Hide y-axis labels
      },
    },
    responsive: [
      {
        breakpoint: 1200,
        options: {
          chart: {
            height: "100%", // Adjust height for larger screens
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          chart: {
            height: "100%", // Adjust height for tablet screens
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: "100%", // Adjust height for smaller screens
          },
        },
      },
    ],
  };

  const series = [
    {
      name: "Allocations",
      data: chartData,
    },
  ];

  return (
    <Card
      onClick={handleClick}
      className="cursor-pointer hover:shadow-lg transition-all duration-300 col-span-4" // Ensure this is within col-span-4 grid
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 text-gray-400">
			{icon}
          <span className="text-sm">{title}</span>
        </div>

        <div className="w-full">
			<Chart options={options} series={series} type="area" height="40%" width="100%" />
		</div>

      </CardContent>
    </Card>
  );
}
