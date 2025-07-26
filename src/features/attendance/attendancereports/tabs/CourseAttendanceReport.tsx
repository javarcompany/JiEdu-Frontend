// File: ClassWeekdayAverageChart.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Card, CardContent } from "../../../../components/ui/card";

interface Props {
  courseId: string;
}

interface DataPoint {
  day: string;
  class_name: string;
  Present: number;
  Late: number;
  Absent: number;
}

export default function ClassWeekdayAverageChart({ courseId }: Props) {
  const [data, setData] = useState<DataPoint[]>([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    axios
      .get(`/api/course-class-average-weekday-attendance/`,{
        headers: { Authorization: `Bearer ${token}` },
				params: { course_id: courseId }
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [courseId]);

  const days = Array.from(new Set(data.map((d) => d.day)));
  const classes = Array.from(new Set(data.map((d) => d.class_name)));

  const generateSeries = (type: "Present" | "Late" | "Absent") => {
    return classes.map((className) => {
      return {
        name: `${className} - ${type}`,
        data: days.map((day) => {
          const match = data.find((d) => d.day === day && d.class_name === className);
          return match ? match[type] : 0;
        }),
      };
    });
  };

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    xaxis: {
      categories: days,
      labels: { style: { fontSize: "12px" } },
    },
    yaxis: {
      show: true,
      labels: {
        formatter: (val) => `${val}`,
      },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 2,
      },
    },
    fill: { opacity: 1 },
    colors: ["#22c55e", "#eab308", "#ef4444"],
    legend: { position: "bottom" },
  };

  const series = [
    ...generateSeries("Present"),
    ...generateSeries("Late"),
    ...generateSeries("Absent"),
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">
          Daily Class Attendance Breakdown
        </h2>
        <Chart options={options} series={series} type="bar" height={400} />
      </CardContent>
    </Card>
  );
}
