'use client';

import { useState, useEffect } from 'react';
import { Box, DollarSign, FileSpreadsheet, Filter, Package, Percent, Plus, RefreshCw, Search, Trash2, Upload, X, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types/types';

export default function StockManagement() {
	const [searchTerm, setSearchTerm] = useState('');
	const [filter, setFilter] = useState('all');
	const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
	const [showAddProductModal, setShowAddProductModal] = useState(false);
	const [showExcelUpload, setShowExcelUpload] = useState(false);
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [newProduct, setNewProduct] = useState<Partial<Product>>({
		name: '',
		description: '',
		category: '',
		stock: '0',
		image_url: '',
		purchase_price: 0,
		sale_price: 0,
	});

	// Fetch products from Supabase
	const fetchProducts = async () => {
		try {
			setIsLoading(true);
			setError(null);

			const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });

			if (error) throw error;

			// Transform the data to match our Product interface
			const transformedProducts: Product[] = data.map((product: Product) => ({
				id: product.id,
				name: product.name,
				description: product.description,
				category: product.category,
				stock: product.stock,
				image_url: product.image_url,
				purchase_price: product.purchase_price,
				sale_price: product.sale_price,
				created_at: product.created_at,
				updated_at: product.updated_at,
			}));

			setProducts(transformedProducts);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error fetching products');
		} finally {
			setIsLoading(false);
		}
	};

	// Add this useEffect to log products when they change
	// useEffect(() => {
	// 	if (products.length > 0) {
	// 		console.log('Products:', products);
	// 	}
	// }, [products]);

	// Calculate product status based on stock
	const calculateStatus = (stock: string): 'sufficient' | 'low' | 'out' => {
		const stockValue = parseInt(stock);
		if (stockValue === 0) return 'out';
		if (stockValue < 5) return 'low';
		return 'sufficient';
	};

	// Fetch products on component mount
	useEffect(() => {
		fetchProducts();
	}, []);

	const filteredProducts = products.filter((product) => {
		const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
		if (filter === 'all') return matchesSearch;
		if (filter === 'normal') return matchesSearch && product.category !== 'elaborated';
		if (filter === 'elaborated') return matchesSearch && product.category === 'elaborated';
		return matchesSearch;
	});

	// Calculate summary data
	const totalProducts = products.length;
	const lowStockProducts = products.filter((p) => calculateStatus(p.stock) === 'low').length;
	const outOfStockProducts = products.filter((p) => calculateStatus(p.stock) === 'out').length;
	const totalLowStock = lowStockProducts + outOfStockProducts;
	const stockValue = products.reduce((sum, product) => sum + product.purchase_price * Number.parseInt(product.stock), 0);
	const averageMargin =
		products.reduce((sum, product) => {
			const margin = ((product.sale_price - product.purchase_price) / product.purchase_price) * 100;
			return sum + margin;
		}, 0) / products.length;

	const toggleSelectAll = () => {
		if (selectedProducts.length === filteredProducts.length) {
			setSelectedProducts([]);
		} else {
			setSelectedProducts(filteredProducts.map((p) => p.id));
		}
	};

	const toggleSelectProduct = (id: number) => {
		if (selectedProducts.includes(id)) {
			setSelectedProducts(selectedProducts.filter((productId) => productId !== id));
		} else {
			setSelectedProducts([...selectedProducts, id]);
		}
	};
	const deleteProductFromList = async (id: number) => {
		try {
			const { error } = await supabase.from('products').delete().eq('id', id);

			if (error) throw error;

			// Refresh the products list after successful deletion
			fetchProducts();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error deleting product');
		}
	};

	const handleAddProduct = async () => {
		try {
			const { error } = await supabase.from('products').insert([
				{
					...newProduct,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				},
			]);

			if (error) throw error;

			setShowAddProductModal(false);
			setNewProduct({
				name: '',
				description: '',
				category: '',
				stock: '0',
				image_url: '',
				purchase_price: 0,
				sale_price: 0,
			});
			fetchProducts();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error adding product');
		}
	};

	const handleUpdateProduct = async () => {
		if (!editingProduct) return;

		try {
			const { error } = await supabase
				.from('products')
				.update({
					...editingProduct,
					updated_at: new Date().toISOString(),
				})
				.eq('id', editingProduct.id);

			if (error) throw error;

			setEditingProduct(null);
			fetchProducts();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error updating product');
		}
	};

	const handleEditClick = (product: Product) => {
		setEditingProduct(product);
	};

	return (
		<div className='space-y-4'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold'>Administración de Stock</h1>
				<div className='flex gap-2'>
					{/* <Button
						className='gap-2'
						onClick={() => setShowAddProductModal(true)}>
						<Plus size={16} />
						Añadir nuevo producto
					</Button>
					<Button
						variant='outline'
						onClick={() => setShowExcelUpload(true)}>
						<FileSpreadsheet
							size={16}
							className='mr-2'
						/>
						Importar Excel
					</Button> */}
				</div>
			</div>

			{/* Summary Cards */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<div className='border rounded-lg p-4 flex items-center gap-4'>
					<div className='bg-blue-100 p-2 rounded-lg'>
						<Package className='text-blue-500' />
					</div>
					<div>
						<div className='text-sm text-muted-foreground'>Total de Productos</div>
						<div className='text-2xl font-bold text-blue-500'>{totalProducts}</div>
					</div>
				</div>

				<div className='border rounded-lg p-4 flex items-center gap-4'>
					<div className='bg-amber-100 p-2 rounded-lg'>
						<Box className='text-amber-500' />
					</div>
					<div>
						<div className='text-sm text-muted-foreground'>Stock Bajo</div>
						<div className='text-2xl font-bold text-amber-500'>{totalLowStock}</div>
					</div>
				</div>

				<div className='border rounded-lg p-4 flex items-center gap-4'>
					<div className='bg-green-100 p-2 rounded-lg'>
						<DollarSign className='text-green-500' />
					</div>
					<div>
						<div className='text-sm text-muted-foreground'>Valor del Stock</div>
						<div className='text-2xl font-bold text-green-500'>${stockValue.toLocaleString()}</div>
					</div>
				</div>

				<div className='border rounded-lg p-4 flex items-center gap-4'>
					<div className='bg-purple-100 p-2 rounded-lg'>
						<Percent className='text-purple-500' />
					</div>
					<div>
						<div className='text-sm text-muted-foreground'>Margen Promedio</div>
						<div className='text-2xl font-bold text-purple-500'>{averageMargin.toFixed(2)}%</div>
					</div>
				</div>
			</div>

			{/* Excel Upload Area (conditionally shown) */}
			{/* {showExcelUpload && (
				<div className='border border-dashed rounded-lg p-8 flex flex-col items-center justify-center space-y-4 relative'>
					<Button
						variant='ghost'
						size='icon'
						className='absolute top-2 right-2'
						onClick={() => setShowExcelUpload(false)}>
						<X size={18} />
					</Button>
					<Upload className='h-12 w-12 text-muted-foreground' />
					<div className='text-center'>
						<h3 className='font-medium'>Arrastra y suelta tu archivo Excel aquí</h3>
						<p className='text-sm text-muted-foreground'>o haz clic para seleccionar un archivo</p>
					</div>
					<Button variant='outline'>Seleccionar Archivo</Button>
				</div>
			)} */}

			{/* Loading State */}
			{isLoading && (
				<div className='flex items-center justify-center h-64'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
				</div>
			)}

			{/* Error State */}
			{error && (
				<div
					className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative'
					role='alert'>
					<strong className='font-bold'>Error: </strong>
					<span className='block sm:inline'>{error}</span>
				</div>
			)}

			{/* Search and Filters */}
			<div className='flex flex-col sm:flex-row justify-between gap-4'>
				<div className='relative w-full sm:w-64'>
					<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						placeholder='Buscar producto...'
						className='pl-8'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						size='sm'>
						<Filter
							size={16}
							className='mr-2'
						/>
						Filtrar
					</Button>
					<Button
						variant='outline'
						size='sm'>
						<RefreshCw
							size={16}
							className='mr-2'
						/>
						Actualizar
					</Button>
					<Button
						className='gap-2'
						onClick={() => setShowAddProductModal(true)}>
						<Plus size={16} />
						Añadir nuevo producto
					</Button>
				</div>
			</div>

			{/* Products Table */}
			{!isLoading && !error && (
				<div className='border rounded-lg overflow-hidden'>
					<div className='overflow-x-auto'>
						<table className='w-full'>
							<thead>
								<tr className='bg-muted/50'>
									<th className='p-3'>
										<Checkbox
											checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
											onCheckedChange={toggleSelectAll}
										/>
									</th>
									<th className='text-left p-3 font-medium'>Producto</th>
									<th className='text-left p-3 font-medium'>Tipo</th>
									<th className='text-left p-3 font-medium'>Precio Compra</th>
									<th className='text-left p-3 font-medium'>Precio Venta</th>
									<th className='text-left p-3 font-medium'>Margen</th>
									<th className='text-left p-3 font-medium'>Stock Disponible</th>
									<th className='text-left p-3 font-medium'>Estado</th>
									<th className='text-left p-3 font-medium'>Acciones</th>
								</tr>
							</thead>
							<tbody>
								{filteredProducts.map((product) => (
									<tr
										key={product.id}
										className='border-t hover:bg-muted/50'>
										<td className='p-3'>
											<Checkbox
												checked={selectedProducts.includes(product.id)}
												onCheckedChange={() => toggleSelectProduct(product.id)}
											/>
										</td>
										<td className='p-3'>
											<div className='flex items-center gap-2'>
												<div className='bg-slate-100 p-1 rounded'>
													<Box className='h-4 w-4 text-slate-500' />
												</div>
												<div>
													<div>{product.name}</div>
													<div className='text-xs text-muted-foreground'>{product.category}</div>
												</div>
												{product.category === 'elaborated' && (
													<Badge
														variant='outline'
														className='ml-2 bg-purple-50 text-purple-700 border-purple-200'>
														Elaborado
													</Badge>
												)}
											</div>
										</td>
										<td className='p-3'>{product.category}</td>
										<td className='p-3'>${product.purchase_price}</td>
										<td className='p-3'>${product.sale_price}</td>
										<td className='p-3'>{(((product.sale_price - product.purchase_price) / product.purchase_price) * 100).toFixed(2)}%</td>
										<td className='p-3'>{product.stock}</td>
										<td className='p-3'>
											<Badge
												className={cn(
													'font-normal',
													calculateStatus(product.stock) === 'sufficient' && 'bg-green-50 text-green-700 border-green-200',
													calculateStatus(product.stock) === 'low' && 'bg-amber-50 text-amber-700 border-amber-200',
													calculateStatus(product.stock) === 'out' && 'bg-red-50 text-red-700 border-red-200'
												)}>
												{calculateStatus(product.stock) === 'sufficient' && '✓ Suficiente'}
												{calculateStatus(product.stock) === 'low' && '⚠ Bajo'}
												{calculateStatus(product.stock) === 'out' && '✕ Agotado'}
											</Badge>
										</td>
										<td className='p-3'>
											<div className='flex gap-2'>
												<Button
													onClick={() => handleEditClick(product)}
													variant='ghost'
													size='icon'>
													<Pencil className='h-4 w-4' />
												</Button>
												<Button
													onClick={() => deleteProductFromList(product.id)}
													variant='ghost'
													size='icon'>
													<Trash2 className='h-4 w-4 text-red-500' />
												</Button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Add Product Modal */}
			<Dialog
				open={showAddProductModal}
				onOpenChange={setShowAddProductModal}>
				<DialogContent className='sm:max-w-[500px]'>
					<DialogHeader>
						<DialogTitle>Agregar Nuevo Producto</DialogTitle>
						<DialogDescription>Complete los detalles del producto para agregarlo al inventario.</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='name'>Nombre</Label>
								<Input
									id='name'
									value={newProduct.name}
									onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='category'>Categoría</Label>
								<Select
									value={newProduct.category}
									onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
									<SelectTrigger>
										<SelectValue placeholder='Seleccionar categoría' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='bebida'>Bebida</SelectItem>
										<SelectItem value='comida'>Comida</SelectItem>
										<SelectItem value='insumo'>Insumo</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='description'>Descripción</Label>
							<Textarea
								id='description'
								value={newProduct.description}
								onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
							/>
						</div>
						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='purchase_price'>Precio de Compra</Label>
								<Input
									id='purchase_price'
									type='number'
									value={newProduct.purchase_price}
									onChange={(e) => setNewProduct({ ...newProduct, purchase_price: Number(e.target.value) })}
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='sale_price'>Precio de Venta</Label>
								<Input
									id='sale_price'
									type='number'
									value={newProduct.sale_price}
									onChange={(e) => setNewProduct({ ...newProduct, sale_price: Number(e.target.value) })}
								/>
							</div>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='stock'>Stock</Label>
							<Input
								id='stock'
								type='number'
								value={newProduct.stock}
								onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setShowAddProductModal(false)}>
							Cancelar
						</Button>
						<Button onClick={handleAddProduct}>Agregar Producto</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Product Modal */}
			<Dialog
				open={!!editingProduct}
				onOpenChange={() => setEditingProduct(null)}>
				<DialogContent className='sm:max-w-[500px]'>
					<DialogHeader>
						<DialogTitle>Editar Producto</DialogTitle>
						<DialogDescription>Modifique los detalles del producto.</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='edit-name'>Nombre</Label>
								<Input
									id='edit-name'
									value={editingProduct?.name}
									onChange={(e) => setEditingProduct({ ...editingProduct!, name: e.target.value })}
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='edit-category'>Categoría</Label>
								<Select
									value={editingProduct?.category}
									onValueChange={(value) => setEditingProduct({ ...editingProduct!, category: value })}>
									<SelectTrigger>
										<SelectValue placeholder='Seleccionar categoría' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='bebida'>Bebida</SelectItem>
										<SelectItem value='comida'>Comida</SelectItem>
										<SelectItem value='insumo'>Insumo</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='edit-description'>Descripción</Label>
							<Textarea
								id='edit-description'
								value={editingProduct?.description}
								onChange={(e) => setEditingProduct({ ...editingProduct!, description: e.target.value })}
							/>
						</div>
						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='edit-purchase_price'>Precio de Compra</Label>
								<Input
									id='edit-purchase_price'
									type='number'
									value={editingProduct?.purchase_price}
									onChange={(e) => setEditingProduct({ ...editingProduct!, purchase_price: Number(e.target.value) })}
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='edit-sale_price'>Precio de Venta</Label>
								<Input
									id='edit-sale_price'
									type='number'
									value={editingProduct?.sale_price}
									onChange={(e) => setEditingProduct({ ...editingProduct!, sale_price: Number(e.target.value) })}
								/>
							</div>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='edit-stock'>Stock</Label>
							<Input
								id='edit-stock'
								type='number'
								value={editingProduct?.stock}
								onChange={(e) => setEditingProduct({ ...editingProduct!, stock: e.target.value })}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setEditingProduct(null)}>
							Cancelar
						</Button>
						<Button onClick={handleUpdateProduct}>Guardar Cambios</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
