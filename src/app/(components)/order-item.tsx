"use client"

import React, { useState } from "react";
import { ClockIcon, PencilIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { XIcon, SaveIcon, PlusIcon, TrashIcon } from "lucide-react";

interface OrderItemProps {
  order: {
    id: string;
    table: string;
    status: string;
    items: number;
    time: string;
    timeExtra?: string;
  };
}

export function OrderItem({ order }: OrderItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedOrder, setEditedOrder] = useState({ ...order });
  const [editedItems, setEditedItems] = useState([
    { name: "Item 1", quantity: 1, price: 10.0 },
    { name: "Item 2", quantity: 2, price: 8.5 },
  ]);

  const handleAddItem = () => {
    setEditedItems([...editedItems, { name: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...editedItems];
    newItems.splice(index, 1);
    setEditedItems(newItems);
  };

  const handleItemChange = (
    index: number,
    field: keyof (typeof editedItems)[0],
    value: string | number,
  ) => {
    const newItems = [...editedItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditedItems(newItems);
  };

  const calculateTotal = () => {
    return editedItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );
  };

  const handleSaveChanges = () => {
    // In a real app, this would save changes to the backend
    setIsEditOpen(false);
  };

  const getStatusBadge = () => {
    switch (order.status) {
      case "delayed":
        return (
          <div
            className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          >
            Demorado
          </div>
        );

      case "preparation":
        return (
          <div
            className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
          >
            En preparación
          </div>
        );

      case "ready":
        return (
          <div
            className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
          >
            Listo
          </div>
        );

      default:
        return (
          <div
            className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
          >
            Nuevo
          </div>
        );
    }
  };

  const getStatusIcon = () => {
    switch (order.status) {
      case "delayed":
        return <ClockIcon className="h-5 w-5 text-red-500" />;
      case "preparation":
        return <ClockIcon className="h-5 w-5 text-orange-500" />;
      case "ready":
        return <CheckIcon className="h-5 w-5 text-green-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (order.status) {
      case "delayed":
        return "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/20";
      case "preparation":
        return "bg-orange-50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-800/20";
      case "ready":
        return "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800/20";
      default:
        return "bg-gray-50 border-gray-200 dark:bg-gray-800/10 dark:border-gray-700/20";
    }
  };

  return (
    <>
      <div className={`p-4 rounded-lg border ${getBgColor()}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-medium dark:text-white">
                Table {order.table} - Order {order.id}
              </h3>
              <p
                className="text-sm text-muted-foreground dark:text-gray-400"
              >
                {order.items} items • {order.time}
                {order.timeExtra && (
                  <span className="text-red-500 ml-1">
                    {order.timeExtra}
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge()}
            <Button
              variant="ghost"
              size="icon"
              className="dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setIsEditOpen(true)}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Order Edit Sidebar Modal */}
      <Sheet
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      >
        <SheetContent
          className="sm:max-w-md overflow-y-auto"
          side="right"
        >
          <SheetHeader>
            <SheetTitle>
              Editar Orden {order.id}
            </SheetTitle>
            <SheetDescription>
              Mesa {order.table}
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-6">
            {/* Order Status */}
            <div className="space-y-2">
              <Label htmlFor="status">
                Estado de la Orden
              </Label>
              <Select
                defaultValue={order.status}
                onValueChange={(value) =>
                  setEditedOrder({ ...editedOrder, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder="Seleccionar estado"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">
                    Nuevo
                  </SelectItem>
                  <SelectItem value="preparation">
                    En Preparación
                  </SelectItem>
                  <SelectItem value="ready">
                    Listo
                  </SelectItem>
                  <SelectItem value="delayed">
                    Demorado
                  </SelectItem>
                  <SelectItem value="completed">
                    Completado
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table Number */}
            <div className="space-y-2">
              <Label htmlFor="table">
                Número de Mesa
              </Label>
              <Input
                defaultValue={order.table}
                onChange={(e) =>
                  setEditedOrder({ ...editedOrder, table: e.target.value })
                }
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label htmlFor="time">
                Hora
              </Label>
              <Input
                defaultValue={order.time}
                onChange={(e) =>
                  setEditedOrder({ ...editedOrder, time: e.target.value })
                }
              />
            </div>

            <Separator />

            {/* Order Items */}
            <div className="space-y-4">
              <div
                className="flex justify-between items-center"
              >
                <Label>Productos</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                  className="flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" /> Agregar
                </Button>
              </div>

              {editedItems.map((item, index) => (
                <div
                  key={index}
                  className="space-y-2 p-3 border rounded-md"
                  id={`item-${index}`}
                >
                  <div
                    className="flex justify-between"
                    id={`item-header-${index}`}
                  >
                    <Label id={`item-label-${index}`}>
                      Producto {index + 1}
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                      className="h-6 w-6 p-0"
                      id={`remove-item-${index}`}
                    >
                      <TrashIcon
                        className="h-4 w-4 text-red-500"
                        id={`trash-icon-${index}`}
                      />
                    </Button>
                  </div>

                  <div
                    className="grid grid-cols-12 gap-2"
                    id={`item-fields-${index}`}
                  >
                    <div className="col-span-7" id={`name-field-${index}`}>
                      <Input
                        placeholder="Nombre del producto"
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(index, "name", e.target.value)
                        }
                        id={`name-input-${index}`}
                      />
                    </div>
                    <div className="col-span-2" id={`quantity-field-${index}`}>
                      <Input
                        type="number"
                        placeholder="Cant."
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantity",
                            parseInt(e.target.value),
                          )
                        }
                        id={`quantity-input-${index}`}
                      />
                    </div>
                    <div className="col-span-3" id={`price-field-${index}`}>
                      <Input
                        type="number"
                        placeholder="Precio"
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "price",
                            parseFloat(e.target.value),
                          )
                        }
                        id={`price-input-${index}`}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div
                className="flex justify-between font-bold pt-2"
              >
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <SheetFooter className="pt-4 border-t">
            <SheetClose asChild>
              <Button variant="outline" className="mr-2">
                <XIcon className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </SheetClose>
            <Button onClick={handleSaveChanges}>
              <SaveIcon className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
