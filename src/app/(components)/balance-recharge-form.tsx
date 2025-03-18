"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QrCode, RotateCw, Search } from "lucide-react";

export default function BalanceRechargeForm() {
  const [clientCode, setClientCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [amount, setAmount] = useState("0.00");
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [selectedClient, setSelectedClient] = useState<{
    name: string;
    amount: string;
  } | null>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters and format as currency
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value);
  };

  const handlePresetAmount = (value: string) => {
    setAmount(value);
  };

  const handleGenerateRandomCode = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setClientCode(randomCode);
    // Simulate finding a client with this code
    setSelectedClient({
      name: "John Doe",
      amount: amount,
    });
  };

  const handleSearchUser = () => {
    if (searchQuery.trim() !== "") {
      // Simulate finding a client with this search query
      setSelectedClient({
        name: "John Doe",
        amount: amount,
      });
    }
  };

  const handleClientCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientCode(e.target.value);
    if (e.target.value.length >= 6) {
      // Simulate finding a client with this code
      setSelectedClient({
        name: "John Doe",
        amount: amount,
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div
          className="mx-auto bg-gray-100 dark:bg-gray-800 p-6 rounded-md mb-2 w-32 h-32 flex items-center justify-center"
        >
          <QrCode
            className="w-16 h-16 text-gray-500 dark:text-gray-400"
          />
        </div>
        <CardTitle className="text-center text-base font-medium">
          Escanear Código QR
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientCode">
            Código de Cliente
          </Label>
          <Input
            placeholder="Ingrese código de cliente"
            value={clientCode}
            onChange={handleClientCodeChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="searchUser">
            Buscar Usuario
          </Label>
          <div className="flex space-x-2">
            <Input
              placeholder="Nombre o email del usuario"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Button
              size="icon"
              variant="outline"
              onClick={handleSearchUser}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">
            Monto
          </Label>
          <Input
            placeholder="$0.00"
            value={`$${amount}`}
            onChange={handleAmountChange}
          />

          <div className="grid grid-cols-3 gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => handlePresetAmount("100")}
            >
              $100
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePresetAmount("500")}
            >
              $500
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePresetAmount("1000")}
            >
              $1000
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">
            Método de Pago
          </Label>
          <Select
            value={paymentMethod}
            onValueChange={setPaymentMethod}
          >
            <SelectTrigger>
              <SelectValue
                placeholder="Seleccione método de pago"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Efectivo">
                Efectivo
              </SelectItem>
              <SelectItem value="Tarjeta de Crédito">
                Tarjeta de Crédito
              </SelectItem>
              <SelectItem value="Transferencia">
                Transferencia
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedClient && (
          <div
            className="border rounded-lg p-3 space-y-2 bg-gray-50 dark:bg-gray-800"
          >
            <div className="flex justify-between">
              <span
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                Cliente:
              </span>
              <span className="font-medium">
                {selectedClient.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                Monto:
              </span>
              <span className="font-medium">
                ${amount}
              </span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          className="w-full"
          disabled={!selectedClient || amount === "0.00"}
        >
          Confirmar Carga de Balance
        </Button>
        <Button variant="outline" className="w-full">
          Cancelar
        </Button>
      </CardFooter>
    </Card>
  );
}
