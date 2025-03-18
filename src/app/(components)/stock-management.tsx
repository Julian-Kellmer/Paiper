"use client"

import { useState } from "react"
import {
  Box,
  DollarSign,
  FileSpreadsheet,
  Filter,
  Package,
  Percent,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type Product = {
  id: number
  name: string
  type: string
  purchasePrice: number
  salePrice: number
  margin: number
  stock: string
  status: "sufficient" | "low" | "out"
  elaborated?: boolean
  code?: string
}

export default function StockManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [showExcelUpload, setShowExcelUpload] = useState(false)

  const products: Product[] = [
    {
      id: 1,
      name: "Vodka",
      type: "botella",
      purchasePrice: 15000,
      salePrice: 25000,
      margin: 66.67,
      stock: "5 unidades",
      status: "sufficient",
      code: "#PRD001",
    },
    {
      id: 2,
      name: "Ron",
      type: "botella",
      purchasePrice: 12000,
      salePrice: 22000,
      margin: 83.33,
      stock: "2 unidades",
      status: "low",
      code: "#PRD002",
    },
    {
      id: 3,
      name: "Tequila",
      type: "botella",
      purchasePrice: 18000,
      salePrice: 30000,
      margin: 66.67,
      stock: "0 unidades",
      status: "out",
      code: "#PRD003",
    },
    {
      id: 4,
      name: "Limón",
      type: "fruta",
      purchasePrice: 100,
      salePrice: 200,
      margin: 100.0,
      stock: "15 unidades",
      status: "sufficient",
      code: "#PRD004",
    },
    {
      id: 5,
      name: "Jugo de Naranja",
      type: "insumo",
      purchasePrice: 5000,
      salePrice: 8000,
      margin: 60.0,
      stock: "500 ml",
      status: "low",
      code: "#PRD005",
    },
    {
      id: 6,
      name: "Azúcar",
      type: "insumo",
      purchasePrice: 2000,
      salePrice: 3000,
      margin: 50.0,
      stock: "200 g",
      status: "sufficient",
      code: "#PRD006",
    },
    {
      id: 7,
      name: "Menta",
      type: "insumo",
      purchasePrice: 1500,
      salePrice: 2500,
      margin: 66.67,
      stock: "10 hojas",
      status: "low",
      code: "#PRD007",
    },
    {
      id: 8,
      name: "Mojito",
      type: "trago",
      purchasePrice: 1500,
      salePrice: 2700,
      margin: 80.0,
      stock: "2 unidades",
      status: "low",
      elaborated: true,
      code: "#PRD008",
    },
    {
      id: 9,
      name: "Margarita",
      type: "trago",
      purchasePrice: 1450,
      salePrice: 2610,
      margin: 80.0,
      stock: "0 unidades",
      status: "out",
      elaborated: true,
      code: "#PRD009",
    },
    {
      id: 10,
      name: "Piña Colada",
      type: "trago",
      purchasePrice: 1200,
      salePrice: 2160,
      margin: 80.0,
      stock: "3 unidades",
      status: "sufficient",
      elaborated: true,
      code: "#PRD010",
    },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    if (filter === "all") return matchesSearch
    if (filter === "normal") return matchesSearch && !product.elaborated
    if (filter === "elaborated") return matchesSearch && product.elaborated
    return matchesSearch
  })

  // Calculate summary data
  const totalProducts = products.length
  const lowStockProducts = products.filter((p) => p.status === "low").length
  const outOfStockProducts = products.filter((p) => p.status === "out").length
  const totalLowStock = lowStockProducts + outOfStockProducts
  const stockValue = products.reduce((sum, product) => sum + product.purchasePrice * Number.parseInt(product.stock), 0)
  const averageMargin = products.reduce((sum, product) => sum + product.margin, 0) / products.length

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id))
    }
  }

  const toggleSelectProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((productId) => productId !== id))
    } else {
      setSelectedProducts([...selectedProducts, id])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Administración de Stock</h1>
        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => setShowAddProductModal(true)}>
            <Plus size={16} />
            Añadir nuevo producto
          </Button>
          <Button variant="outline" onClick={() => setShowExcelUpload(true)}>
            <FileSpreadsheet size={16} className="mr-2" />
            Importar Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 flex items-center gap-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Package className="text-blue-500" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total de Productos</div>
            <div className="text-2xl font-bold text-blue-500">{totalProducts}</div>
          </div>
        </div>

        <div className="border rounded-lg p-4 flex items-center gap-4">
          <div className="bg-amber-100 p-2 rounded-lg">
            <Box className="text-amber-500" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Stock Bajo</div>
            <div className="text-2xl font-bold text-amber-500">{totalLowStock}</div>
          </div>
        </div>

        <div className="border rounded-lg p-4 flex items-center gap-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <DollarSign className="text-green-500" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Valor del Stock</div>
            <div className="text-2xl font-bold text-green-500">${stockValue.toLocaleString()}</div>
          </div>
        </div>

        <div className="border rounded-lg p-4 flex items-center gap-4">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Percent className="text-purple-500" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Margen Promedio</div>
            <div className="text-2xl font-bold text-purple-500">{averageMargin.toFixed(2)}%</div>
          </div>
        </div>
      </div>

      {/* Excel Upload Area (conditionally shown) */}
      {showExcelUpload && (
        <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center space-y-4 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => setShowExcelUpload(false)}
          >
            <X size={18} />
          </Button>
          <Upload className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <h3 className="font-medium">Arrastra y suelta tu archivo Excel aquí</h3>
            <p className="text-sm text-muted-foreground">o haz clic para seleccionar un archivo</p>
          </div>
          <Button variant="outline">Seleccionar Archivo</Button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar producto..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            Todos los Productos
          </Button>
          <Button variant={filter === "normal" ? "default" : "outline"} size="sm" onClick={() => setFilter("normal")}>
            Stock Normal
          </Button>
          <Button
            variant={filter === "elaborated" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("elaborated")}
          >
            Stock Elaborado
          </Button>
          <Button variant="outline" size="sm">
            <Filter size={16} className="mr-2" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw size={16} className="mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="p-3">
                  <Checkbox
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="text-left p-3 font-medium">Producto</th>
                <th className="text-left p-3 font-medium">Tipo</th>
                <th className="text-left p-3 font-medium">Precio Compra</th>
                <th className="text-left p-3 font-medium">Precio Venta</th>
                <th className="text-left p-3 font-medium">Margen</th>
                <th className="text-left p-3 font-medium">Stock Disponible</th>
                <th className="text-left p-3 font-medium">Estado</th>
                <th className="text-left p-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t hover:bg-muted/50">
                  <td className="p-3">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => toggleSelectProduct(product.id)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-slate-100 p-1 rounded">
                        <Box className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <div>{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.code}</div>
                      </div>
                      {product.elaborated && (
                        <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-700 border-purple-200">
                          Elaborado
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-3">{product.type}</td>
                  <td className="p-3">${product.purchasePrice.toLocaleString()}</td>
                  <td className="p-3">${product.salePrice.toLocaleString()}</td>
                  <td className="p-3">{product.margin.toFixed(2)}%</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">
                    <Badge
                      className={cn(
                        "font-normal",
                        product.status === "sufficient" && "bg-green-50 text-green-700 border-green-200",
                        product.status === "low" && "bg-amber-50 text-amber-700 border-amber-200",
                        product.status === "out" && "bg-red-50 text-red-700 border-red-200",
                      )}
                    >
                      {product.status === "sufficient" && "✓ Suficiente"}
                      {product.status === "low" && "⚠ Bajo"}
                      {product.status === "out" && "✕ Agotado"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <Dialog open={showAddProductModal} onOpenChange={setShowAddProductModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Producto</DialogTitle>
            <DialogDescription>Complete los detalles del producto para agregarlo al menú.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Nombre del Producto</Label>
                <Input id="productName" placeholder="Ej: Pizza Margherita" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="botella">Botella</SelectItem>
                    <SelectItem value="fruta">Fruta</SelectItem>
                    <SelectItem value="insumo">Insumo</SelectItem>
                    <SelectItem value="trago">Trago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" placeholder="Descripción del producto..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio (USD)</Label>
                <Input id="price" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="initialStock">Stock Inicial</Label>
                <Input id="initialStock" type="number" placeholder="0" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="active" />
              <Label htmlFor="active">Producto activo</Label>
            </div>

            <div className="space-y-2">
              <Label>Imagen del Producto</Label>
              <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center space-y-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-center text-muted-foreground">
                  Arrastra y suelta una imagen aquí o haz clic para seleccionar
                </p>
                <Button variant="outline" size="sm">
                  Seleccionar Imagen
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddProductModal(false)}>
              Cancelar
            </Button>
            <Button>Guardar Producto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

