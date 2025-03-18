"use client"

import { useState } from "react"
import { Book, CoffeeIcon as Cocktail, Edit, Leaf, Plus, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type Recipe = {
  id: number
  name: string
  available: number | null
  ingredients: {
    name: string
    quantity: string
    unit: string
  }[]
}

export default function RecipeConfiguration() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false)
  const [newIngredients, setNewIngredients] = useState<{ name: string; quantity: string; unit: string }[]>([])

  const recipes: Recipe[] = [
    {
      id: 1,
      name: "Mojito",
      available: 2,
      ingredients: [
        { name: "Ron", quantity: "50", unit: "ml" },
        { name: "Limón", quantity: "30", unit: "ml" },
        { name: "Azúcar", quantity: "10", unit: "g" },
        { name: "Menta", quantity: "5", unit: "hojas" },
      ],
    },
    {
      id: 2,
      name: "Margarita",
      available: null,
      ingredients: [
        { name: "Tequila", quantity: "60", unit: "ml" },
        { name: "Triple Sec", quantity: "30", unit: "ml" },
        { name: "Limón", quantity: "30", unit: "ml" },
      ],
    },
    {
      id: 3,
      name: "Piña Colada",
      available: 3,
      ingredients: [
        { name: "Ron", quantity: "50", unit: "ml" },
        { name: "Crema de Coco", quantity: "30", unit: "ml" },
        { name: "Jugo de Piña", quantity: "50", unit: "ml" },
      ],
    },
    {
      id: 4,
      name: "Daiquiri",
      available: 2,
      ingredients: [
        { name: "Ron", quantity: "60", unit: "ml" },
        { name: "Limón", quantity: "20", unit: "ml" },
        { name: "Azúcar", quantity: "15", unit: "g" },
      ],
    },
    {
      id: 5,
      name: "Tequila Sunrise",
      available: null,
      ingredients: [
        { name: "Tequila", quantity: "45", unit: "ml" },
        { name: "Jugo de Naranja", quantity: "90", unit: "ml" },
      ],
    },
  ]

  const filteredRecipes = recipes.filter((recipe) => recipe.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Calculate most used products
  const mostUsedProducts = [
    { name: "Mojito", count: 1 },
    { name: "Margarita", count: 1 },
    { name: "Piña Colada", count: 1 },
  ]

  // Calculate most used ingredients
  const ingredientCounts: Record<string, number> = {}
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (ingredientCounts[ingredient.name]) {
        ingredientCounts[ingredient.name]++
      } else {
        ingredientCounts[ingredient.name] = 1
      }
    })
  })

  const mostUsedIngredients = Object.entries(ingredientCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }))

  const addNewIngredient = () => {
    setNewIngredients([...newIngredients, { name: "", quantity: "", unit: "ml" }])
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Configuración de Recetas</h1>
        <Button className="gap-2" onClick={() => setShowAddRecipeModal(true)}>
          <Cocktail size={16} />
          Añadir nueva receta
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Book className="text-blue-500" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total de Recetas</div>
              <div className="text-2xl font-bold text-blue-500">{recipes.length}</div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Cocktail className="text-purple-500" />
            </div>
            <div className="text-sm text-muted-foreground">Productos Más Usados</div>
          </div>
          <div className="space-y-2">
            {mostUsedProducts.map((product) => (
              <div key={product.name} className="flex justify-between items-center">
                <div>{product.name}</div>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {product.count} recetas
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Leaf className="text-green-500" />
            </div>
            <div className="text-sm text-muted-foreground">Ingredientes Más Utilizados</div>
          </div>
          <div className="space-y-2">
            {mostUsedIngredients.map((ingredient) => (
              <div key={ingredient.name} className="flex justify-between items-center">
                <div>{ingredient.name}</div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {ingredient.count} veces
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar receta..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Recipe Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">{recipe.name}</h3>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            {recipe.available !== null ? (
              <Badge
                className={cn(
                  "mb-3",
                  recipe.available > 0
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200",
                )}
              >
                {recipe.available} disponibles
              </Badge>
            ) : (
              <Badge className="mb-3 bg-red-50 text-red-700 border-red-200">No disponible</Badge>
            )}

            <div className="text-sm font-medium mb-2">Ingredientes:</div>
            <div className="space-y-1">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{ingredient.name}</span>
                  <span className="text-muted-foreground">
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                </div>
              ))}
            </div>

            {recipe.available === null && (
              <div className="mt-3 p-2 bg-red-50 text-red-700 text-sm rounded border border-red-200">
                Falta stock de ingredientes
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Recipe Modal */}
      <Dialog open={showAddRecipeModal} onOpenChange={setShowAddRecipeModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cocktail className="h-5 w-5" />
              Crear Nueva Receta
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipeName">Nombre del Producto Elaborado</Label>
              <Input id="recipeName" placeholder="Ej: Mojito, Margarita, etc." />
            </div>

            <div className="space-y-2">
              <Label>Ingredientes</Label>
              {newIngredients.length === 0 ? (
                <div className="bg-muted/50 p-6 text-center rounded-md">No hay ingredientes agregados</div>
              ) : (
                <div className="space-y-2">
                  {newIngredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="flex-grow">{ingredient.name || "Ingrediente sin nombre"}</div>
                      <div>
                        {ingredient.quantity} {ingredient.unit}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setNewIngredients(newIngredients.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <Label className="mb-2 block">Agregar Ingrediente</Label>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-5">
                  <Label htmlFor="ingredientName" className="sr-only">
                    Ingrediente
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar ingrediente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ron">Ron</SelectItem>
                      <SelectItem value="tequila">Tequila</SelectItem>
                      <SelectItem value="limon">Limón</SelectItem>
                      <SelectItem value="azucar">Azúcar</SelectItem>
                      <SelectItem value="menta">Menta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3">
                  <Label htmlFor="quantity" className="sr-only">
                    Cantidad
                  </Label>
                  <Input type="number" placeholder="Cantidad" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="unit" className="sr-only">
                    Unidad
                  </Label>
                  <Select defaultValue="ml">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="unidad">unidad</SelectItem>
                      <SelectItem value="hojas">hojas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Button variant="secondary" className="w-full" onClick={addNewIngredient}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRecipeModal(false)}>
              Cancelar
            </Button>
            <Button>Crear Receta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

