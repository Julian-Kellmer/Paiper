"use client"

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, CartesianGrid, LineChart, Line } from "recharts";

export function SalesChart() {
  const [activeChart, setActiveChart] = useState("payment");

  // Mock data for payment methods chart
  const paymentMethodData = [
    { name: "Efectivo", value: 4000 },
    { name: "Tarjeta", value: 3000 },
    { name: "Saldo", value: 2000 },
  ];

  // Mock data for peak hours chart
  const peakHoursData = [
    { hour: "8AM", orders: 5 },
    { hour: "10AM", orders: 12 },
    { hour: "12PM", orders: 25 },
    { hour: "2PM", orders: 30 },
    { hour: "4PM", orders: 18 },
    { hour: "6PM", orders: 28 },
    { hour: "8PM", orders: 35 },
    { hour: "10PM", orders: 20 },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="payment" onValueChange={setActiveChart}>
        <TabsList className="dark:bg-gray-800">
          <TabsTrigger
            value="payment"
            className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300"
          >
            Sales by Payment Method
          </TabsTrigger>
          <TabsTrigger
            value="peak"
            className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300"
          >
            Peak Order Hours
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="h-[300px]">
        {activeChart === "payment" ? (
          <ChartContainer
            config={{}}
            className="aspect-[none] h-full"
          >
            <BarChart data={paymentMethodData}>
              <ChartTooltip
                content={<ChartTooltipContent />}
              />

              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af" }}
              />

              <Bar
                dataKey="value"
                fill="hsl(var(--chart-1))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <ChartContainer
            config={{}}
            className="aspect-[none] h-full"
          >
            <LineChart data={peakHoursData}>
              <ChartTooltip
                content={<ChartTooltipContent />}
              />

              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />

              <XAxis
                dataKey="hour"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af" }}
              />

              <Line
                type="monotone"
                dataKey="orders"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
