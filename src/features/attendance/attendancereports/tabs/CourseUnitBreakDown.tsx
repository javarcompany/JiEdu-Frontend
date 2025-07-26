// File: UnitAttendanceBreakdownChart.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Card, CardContent } from "../../../../components/ui/card";

interface Props {
  courseId: string;
}

interface ClassAttendance {
  class_name: string;
  Present: number;
  Late: number;
  Absent: number;
}

interface UnitAttendance {
  unit_abbr: string;
  classes: ClassAttendance[];
}

export default function UnitAttendanceBreakdownChart({ courseId }: Props) {
  const [data, setData] = useState<UnitAttendance[]>([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    axios
      .get(`/api/course-unit-attendance-breakdown/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { course_id: courseId },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [courseId]);

  // Flatten class data for x-axis categories
  const categories: string[] = [];
  const presentSeries: number[] = [];
  const lateSeries: number[] = [];
  const absentSeries: number[] = [];

  data.forEach((unit) => {
    unit.classes.forEach((cls) => {
      const label = `${cls.class_name} (${unit.unit_abbr})`;
      categories.push(label);
      presentSeries.push(cls.Present);
      lateSeries.push(cls.Late);
      absentSeries.push(cls.Absent);
    });
  });

  const series = [
    { name: "Present", data: presentSeries },
    { name: "Late", data: lateSeries },
    { name: "Absent", data: absentSeries },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    xaxis: {
      categories,
      labels: { style: { fontSize: "11px" }, rotate: -45 },
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val}%`,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 3,
      },
    },
    colors: ["#22c55e", "#eab308", "#ef4444"],
    legend: { position: "bottom" },
    dataLabels: { enabled: false },
    fill: { opacity: 1 },
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Unit Attendance Breakdown</h2>
        <Chart options={options} series={series} type="bar" height={400} />
      </CardContent>
    </Card>
  );
}
