"use client"

import React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis } from "recharts";

interface SalesAnalysisChartProps {
  timeFilter: string;
}

export function SalesAnalysisChart({ timeFilter }: SalesAnalysisChartProps) {
  // Generate mock data based on the time filter
  const generateChartData = () => {
    let data = [];

    if (timeFilter === "day") {
      // Hourly data for a day
      for (let i = 0; i < 24; i++) {
        data.push({
          time: `${i}:00`,
          sales: Math.floor(Math.random() * 1000) + 800,
        });
      }
    } else if (timeFilter === "week") {
      // Daily data for a week
      const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
      for (let i = 0; i < 7; i++) {
        data.push({
          time: days[i],
          sales: Math.floor(Math.random() * 2000) + 1500,
        });
      }
    } else {
      // Monthly data for a year
      const months = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];

      for (let i = 0; i < 12; i++) {
        data.push({
          time: months[i],
          sales: Math.floor(Math.random() * 3000) + 2000,
        });
      }
    }

    return data;
  };

  const chartData = generateChartData();

  return (
    <div className="h-[300px]">
      <ChartContainer
        config={{}}
        className="aspect-[none] h-full"
      >
        <LineChart data={chartData}>
          <ChartTooltip
            content={<ChartTooltipContent />}
          />

          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
          />

          <XAxis dataKey="time" axisLine={false} tickLine={false} />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
