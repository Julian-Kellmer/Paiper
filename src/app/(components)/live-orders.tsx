"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { OrderItem } from "(components)/order-item";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { XIcon } from "lucide-react";

export function LiveOrders() {
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  // Mock data for orders
  const orders = [
    {
      id: "#45893",
      table: "15",
      status: "delayed",
      items: 3,
      time: "15:45",
      timeExtra: "+15min",
      customer: {
        name: "Carlos Ruiz",
        code: "#A123",
        avatar: "https://github.com/yusufhilmi.png",
      },
      paymentStatus: "Pagado",
      orderTime: "15:45",
      deliveryTime: "16:15",
      orderItems: [
        { name: "Hamburguesa Clásica", quantity: 2, price: 12.0 },
        { name: "Papas Fritas Grande", quantity: 1, price: 6.5 },
      ],

      total: 30.5,
      notes: [{ type: "allergy", text: "Maní" }],
    },
    {
      id: "#45892",
      table: "12",
      status: "preparation",
      items: 2,
      time: "15:30",
      customer: {
        name: "Ana Martinez",
        code: "#B450",
        avatar: "https://github.com/furkanksl.png",
      },
      paymentStatus: "Pendiente",
      orderTime: "15:30",
      deliveryTime: "16:00",
      orderItems: [
        { name: "Pizza Margherita", quantity: 1, price: 18.0 },
        { name: "Coca-Cola", quantity: 2, price: 3.0 },
      ],

      total: 24.0,
      notes: [{ type: "preference", text: "Sin cebolla" }],
    },
    {
      id: "#45891",
      table: "8",
      status: "ready",
      items: 4,
      time: "15:25",
      customer: {
        name: "Miguel Sánchez",
        code: "#C789",
        avatar: "https://github.com/polymet-ai.png",
      },
      paymentStatus: "Pagado",
      orderTime: "15:25",
      deliveryTime: "15:55",
      orderItems: [
        { name: "Ensalada César", quantity: 1, price: 10.0 },
        { name: "Pollo a la Parrilla", quantity: 1, price: 15.0 },
        { name: "Agua Mineral", quantity: 1, price: 2.5 },
        { name: "Tiramisú", quantity: 1, price: 6.0 },
      ],

      total: 33.5,
      notes: [],
    },
  ];

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "delayed":
        return (
          <Badge
            className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          >
            Demorado
          </Badge>
        );

      case "preparation":
        return (
          <Badge
            className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
          >
            En Preparación
          </Badge>
        );

      case "ready":
        return (
          <Badge
            className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
          >
            Listo
          </Badge>
        );

      case "new":
        return (
          <Badge
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
          >
            Nuevo
          </Badge>
        );

      default:
        return (
          <Badge
            className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
          >
            {status}
          </Badge>
        );
    }
  };

  return (
    <div
      className="bg-card rounded-lg border dark:bg-gray-900 dark:border-gray-800 p-6"
    >
      <h2 className="text-xl font-semibold mb-6 dark:text-white">
        Live Orders
      </h2>

      <div className="flex space-x-2 mb-6 overflow-x-auto">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className={
            filter === "all" ? "" : "dark:text-gray-300 dark:border-gray-700"
          }
        >
          All
        </Button>
        <Button
          variant={filter === "new" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("new")}
          className={
            filter === "new"
              ? "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900 dark:bg-transparent dark:text-gray-300 dark:border-gray-700"
          }
        >
          New
        </Button>
        <Button
          variant={filter === "preparation" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("preparation")}
          className={
            filter === "preparation"
              ? "bg-orange-100 text-orange-800 hover:bg-orange-200 hover:text-orange-900 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30"
              : "bg-orange-100 text-orange-800 hover:bg-orange-200 hover:text-orange-900 dark:bg-transparent dark:text-gray-300 dark:border-gray-700"
          }
        >
          In Preparation
        </Button>
        <Button
          variant={filter === "delayed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("delayed")}
          className={
            filter === "delayed"
              ? "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
              : "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900 dark:bg-transparent dark:text-gray-300 dark:border-gray-700"
          }
        >
          Delayed
        </Button>
        <Button
          variant={filter === "ready" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("ready")}
          className={
            filter === "ready"
              ? "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
              : "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 dark:bg-transparent dark:text-gray-300 dark:border-gray-700"
          }
        >
          Ready
        </Button>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order, index) => (
          <div
            key={order.id}
            className="cursor-pointer"
            onClick={() => handleOrderClick(order)}
            id={`order-item-wrapper-${index}`}
          >
            <OrderItem key={order.id} order={order} id={`dz2ljj_${index}`} />
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      <Dialog
        open={isOrderDetailsOpen}
        onOpenChange={setIsOrderDetailsOpen}
      >
        <DialogContent
          className="sm:max-w-[600px] dark:bg-gray-900 dark:border-gray-800"
        >
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle
                  className="flex items-center justify-between"
                >
                  <span>
                    Detalles del Pedido {selectedOrder.id}
                  </span>
                  {getStatusBadge(selectedOrder.status)}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 my-4">
                {/* Customer Info */}
                <div
                  className="flex items-center justify-between"
                >
                  <div
                    className="flex items-center space-x-3"
                  >
                    <Avatar>
                      <AvatarImage
                        src={selectedOrder.customer.avatar}
                        alt={selectedOrder.customer.name}
                      />

                      <AvatarFallback>
                        {selectedOrder.customer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3
                        className="font-medium dark:text-white"
                      >
                        {selectedOrder.customer.name}
                      </h3>
                      <p
                        className="text-sm text-muted-foreground dark:text-gray-400"
                      >
                        Código: {selectedOrder.customer.code}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      selectedOrder.paymentStatus === "Pagado"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                    }
                  >
                    {selectedOrder.paymentStatus}
                  </Badge>
                </div>

                <Separator />

                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p
                      className="text-sm text-muted-foreground dark:text-gray-400"
                    >
                      Mesa
                    </p>
                    <p className="font-medium dark:text-white">
                      {selectedOrder.table}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-sm text-muted-foreground dark:text-gray-400"
                    >
                      Hora del pedido
                    </p>
                    <p
                      className="font-medium dark:text-white"
                    >
                      {selectedOrder.orderTime}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-sm text-muted-foreground dark:text-gray-400"
                    >
                      Entrega estimada
                    </p>
                    <p
                      className="font-medium dark:text-white"
                    >
                      {selectedOrder.deliveryTime}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-sm text-muted-foreground dark:text-gray-400"
                    >
                      Total
                    </p>
                    <p className="font-medium dark:text-white">
                      ${selectedOrder.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <h3
                    className="font-medium mb-3 dark:text-white"
                  >
                    Productos
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.orderItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between"
                        id={`order-item-${idx}`}
                      >
                        <div id={`order-item-name-${idx}`}>
                          <span
                            className="font-medium dark:text-white"
                            id={`order-item-quantity-${idx}`}
                          >
                            {item.quantity}x{" "}
                          </span>
                          <span
                            className="dark:text-white"
                            id={`order-item-text-${idx}`}
                          >
                            {item.name}
                          </span>
                        </div>
                        <div
                          className="font-medium dark:text-white"
                          id={`order-item-price-${idx}`}
                        >
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    className="mt-4 pt-2 border-t flex justify-between font-bold dark:text-white"
                  >
                    <div>Total</div>
                    <div>
                      ${selectedOrder.total.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && selectedOrder.notes.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3
                        className="font-medium mb-3 dark:text-white"
                      >
                        Notas
                      </h3>
                      <div className="space-y-2">
                        {selectedOrder.notes.map((note, idx) => (
                          <div
                            key={idx}
                            className={`px-3 py-2 rounded-md text-sm ${
                              note.type === "allergy"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                            }`}
                            id={`note-${idx}`}
                          >
                            {note.type === "allergy"
                              ? "Alergia: "
                              : "Preferencia: "}
                            {note.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="mr-2">
                    <XIcon className="h-4 w-4 mr-2" />
                    Cerrar
                  </Button>
                </DialogClose>
                <Button
                  className={
                    selectedOrder.status === "new"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : selectedOrder.status === "preparation"
                        ? "bg-orange-600 hover:bg-orange-700"
                        : selectedOrder.status === "delayed"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                  }
                >
                  {selectedOrder.status === "new"
                    ? "Comenzar Preparación"
                    : selectedOrder.status === "preparation"
                      ? "Marcar como Listo"
                      : selectedOrder.status === "delayed"
                        ? "Marcar como Listo"
                        : "Completar Pedido"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
