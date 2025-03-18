"use client"

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, CartesianGrid } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DollarSignIcon, TrendingUpIcon, EyeIcon } from "lucide-react";

interface ProfitabilitySummaryProps {
  onViewDetails: () => void;
}

export function ProfitabilitySummary({
  onViewDetails,
}: ProfitabilitySummaryProps) {
  const [timeFilter, setTimeFilter] = useState("today");

  // Mock data for profitability
  const profitabilityData = {
    today: {
      totalRevenue: 1250.75,
      totalCosts: 625.38,
      totalProfit: 625.37,
      profitMargin: 50,
      chartData: [
        { name: "9:00", profit: 150 },
        { name: "12:00", profit: 200 },
        { name: "15:00", profit: 175 },
        { name: "18:00", profit: 100 },
      ],
    },
    week: {
      totalRevenue: 8750.5,
      totalCosts: 4375.25,
      totalProfit: 4375.25,
      profitMargin: 50,
      chartData: [
        { name: "Lun", profit: 800 },
        { name: "Mar", profit: 750 },
        { name: "Mié", profit: 900 },
        { name: "Jue", profit: 825 },
        { name: "Vie", profit: 1100 },
      ],
    },
    month: {
      totalRevenue: 32450.25,
      totalCosts: 16225.13,
      totalProfit: 16225.12,
      profitMargin: 50,
      chartData: [
        { name: "Sem 1", profit: 3500 },
        { name: "Sem 2", profit: 4200 },
        { name: "Sem 3", profit: 4500 },
        { name: "Sem 4", profit: 4025 },
      ],
    },
  };

  const currentData =
    profitabilityData[timeFilter as keyof typeof profitabilityData];

  return (
    <Card className="mb-6">
      <CardHeader
        className="flex flex-row items-center justify-between pb-2 space-y-0"
      >
        <CardTitle className="text-xl font-bold flex items-center">
          <TrendingUpIcon
            className="h-5 w-5 mr-2 text-green-600 dark:text-green-400"
          />
          Resumen de Rentabilidad
        </CardTitle>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">
              Hoy
            </SelectItem>
            <SelectItem value="week">
              Esta semana
            </SelectItem>
            <SelectItem value="month">
              Este mes
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div
            className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Recaudado
            </p>
            <p
              className="text-2xl font-bold text-green-600 dark:text-green-400"
            >
              ${currentData.totalRevenue.toFixed(2)}
            </p>
          </div>
          <div
            className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Costos
            </p>
            <p
              className="text-2xl font-bold text-blue-600 dark:text-blue-400"
            >
              ${currentData.totalCosts.toFixed(2)}
            </p>
          </div>
          <div
            className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Margen de Ganancia
            </p>
            <p
              className="text-2xl font-bold text-purple-600 dark:text-purple-400"
            >
              ${currentData.totalProfit.toFixed(2)}{" "}
              <span className="text-sm font-normal">
                ({currentData.profitMargin}%)
              </span>
            </p>
          </div>
        </div>

        <div className="h-[200px] mt-4">
          <ChartContainer
            config={{}}
            className="aspect-[none] h-full"
          >
            <LineChart data={currentData.chartData}>
              <ChartTooltip
                content={<ChartTooltipContent />}
              />

              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
              />

              <Line
                type="monotone"
                dataKey="profit"
                name="Ganancia"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={true}
                radius={4}
              />
            </LineChart>
          </ChartContainer>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            onClick={onViewDetails}
            variant="outline"
            className="flex items-center"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            Ver Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
