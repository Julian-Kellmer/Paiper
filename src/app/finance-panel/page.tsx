"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinanceMetrics } from "(components)/finance-metrics";
import { SalesAnalysisChart } from "(components)/sales-analysis-chart";
import { TopProducts } from "(components)/top-products";
import { FilterIcon, RefreshCwIcon, SearchIcon } from "lucide-react";
import Transactions from "pages/transactions";

export default function FinancePanel() {
  const [timeFilter, setTimeFilter] = useState("week");
  const [activeTab, setActiveTab] = useState("general");

  // Mock data for finance metrics
  const metricsData = [
    {
      id: "total-sales",
      title: "Ventas Totales",
      value: "$12,280.51",
      change: "+12.5% vs mes anterior",
      icon: "chart-line",
      color: "orange",
    },
    {
      id: "completed-orders",
      title: "Pedidos Completados",
      value: "1,584",
      change: "+8.2% vs mes anterior",
      icon: "check",
      color: "green",
    },
    {
      id: "urgent-orders",
      title: "Pedidos Urgentes",
      value: "246",
      change: "+15.3% vs mes anterior",
      icon: "alert",
      color: "yellow",
    },
    {
      id: "average-balance",
      title: "Saldo Promedio",
      value: "$875.20",
      change: "+5.7% vs mes anterior",
      icon: "wallet",
      color: "purple",
    },
  ];

  // Mock data for top products
  const topProductsData = [
    {
      id: "prod-a",
      name: "Producto A",
      sales: 2345,
      revenue: "$4562",
    },
    {
      id: "prod-b",
      name: "Producto B",
      sales: 1832,
      revenue: "$3891",
    },
    {
      id: "prod-c",
      name: "Producto C",
      sales: 1567,
      revenue: "$2745",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Panel de Finanzas
          </h1>
          <p className="text-muted-foreground">
            Resumen financiero del negocio
          </p>
        </div>
      </div>

      {/* Finance Metrics */}
      <FinanceMetrics data={metricsData} />

      {/* Tabs for View Selection */}
      <div className="flex justify-between items-center">
        <Tabs
          defaultValue="general"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="general">
              Vista General
            </TabsTrigger>
            <TabsTrigger value="transactions">
              Transacciones
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === "general" ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Análisis de Ventas
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant={timeFilter === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter("day")}
                className="rounded-full"
              >
                Por día
              </Button>
              <Button
                variant={timeFilter === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter("week")}
                className="rounded-full bg-primary text-primary-foreground"
              >
                Por semana
              </Button>
              <Button
                variant={timeFilter === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter("month")}
                className="rounded-full"
              >
                Por mes
              </Button>
              <Button variant="outline" size="sm">
                <FilterIcon className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <SearchIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />

            <Input
              placeholder="Buscar transacciones..."
              className="pl-10"
            />
          </div>

          {/* Sales Chart and Top Products */}
          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div
              className="lg:col-span-2 bg-card rounded-lg border p-6"
            >
              <SalesAnalysisChart timeFilter={timeFilter} />
            </div>
            <div
              className="bg-card rounded-lg border p-6"
            >
              <TopProducts products={topProductsData} />
            </div>
          </div>
        </div>
      ) : (
        <Transactions />
      )}
    </div>
  );
}
