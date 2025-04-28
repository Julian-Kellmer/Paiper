'use client';

import { useState } from 'react';
import { Clock, RefreshCw, Search, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type Product = {
	id: number;
	name: string;
	type: string;
	purchasePrice: number;
	salePrice: number;
	margin: number;
	elaborated?: boolean;
	calculated?: boolean;
};

export default function PriceManagement() {
	const [searchTerm, setSearchTerm] = useState('');
	const [filter, setFilter] = useState('all');

	const products: Product[] = [
		{ id: 1, name: 'Vodka', type: 'botella', purchasePrice: 15000, salePrice: 25000, margin: 66.67 },
		{ id: 2, name: 'Ron', type: 'botella', purchasePrice: 12000, salePrice: 22000, margin: 83.33 },
		{ id: 3, name: 'Tequila', type: 'botella', purchasePrice: 18000, salePrice: 30000, margin: 66.67 },
		{ id: 4, name: 'Limón', type: 'fruta', purchasePrice: 100, salePrice: 200, margin: 100.0 },
		{ id: 5, name: 'Jugo de Naranja', type: 'insumo', purchasePrice: 5000, salePrice: 8000, margin: 60.0 },
		{ id: 6, name: 'Triple Sec', type: 'botella', purchasePrice: 10500, salePrice: 18000, margin: 71.43 },
		{
			id: 7,
			name: 'Mojito',
			type: 'trago',
			purchasePrice: 1500,
			salePrice: 2700,
			margin: 80.0,
			elaborated: true,
			calculated: true,
		},
		{
			id: 8,
			name: 'Margarita',
			type: 'trago',
			purchasePrice: 1450,
			salePrice: 2610,
			margin: 80.0,
			elaborated: true,
			calculated: true,
		},
		{
			id: 9,
			name: 'Piña Colada',
			type: 'trago',
			purchasePrice: 1200,
			salePrice: 2160,
			margin: 80.0,
			elaborated: true,
			calculated: true,
		},
	];

	const filteredProducts = products.filter((product) => {
		const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
		if (filter === 'all') return matchesSearch;
		if (filter === 'normal') return matchesSearch && !product.elaborated;
		if (filter === 'elaborated') return matchesSearch && product.elaborated;
		return matchesSearch;
	});

	return (
		<div className='space-y-4'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold'>Gestión de Precios</h1>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						className='gap-2'>
						<RefreshCw size={16} />
						Recalcular Costos
					</Button>
					<Button className='gap-2'>
						<Save size={16} />
						Actualizar Precios
					</Button>
				</div>
			</div>

			{/* Search and Filters */}
			<div className='flex flex-col sm:flex-row justify-between gap-4'>
				<div className='relative w-full sm:w-64'>
					<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						placeholder='Buscar por nombre'
						className='pl-8'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<div className='flex gap-2'>
					<Button
						variant={filter === 'all' ? 'default' : 'outline'}
						size='sm'
						onClick={() => setFilter('all')}>
						Todos los Productos
					</Button>
					<Button
						variant={filter === 'normal' ? 'default' : 'outline'}
						size='sm'
						onClick={() => setFilter('normal')}>
						Productos Normales
					</Button>
					<Button
						variant={filter === 'elaborated' ? 'default' : 'outline'}
						size='sm'
						onClick={() => setFilter('elaborated')}>
						Productos Elaborados
					</Button>
				</div>
			</div>

			{/* Products Table */}
			<div className='border rounded-lg overflow-hidden'>
				<div className='overflow-x-auto'>
					<table className='w-full'>
						<thead>
							<tr className='bg-muted/50'>
								<th className='text-left p-3 font-medium'>Producto</th>
								<th className='text-left p-3 font-medium'>Tipo</th>
								<th className='text-left p-3 font-medium'>Precio de Compra ($)</th>
								<th className='text-left p-3 font-medium'>Precio de Venta ($)</th>
								<th className='text-left p-3 font-medium'>Margen (%)</th>
								<th className='text-left p-3 font-medium'>Historial</th>
							</tr>
						</thead>
						<tbody>
							{filteredProducts.map((product) => (
								<tr
									key={product.id}
									className='border-t hover:bg-muted/50'>
									<td className='p-3'>
										{product.name}
										{product.elaborated && (
											<Badge
												variant='outline'
												className='ml-2 bg-purple-50 text-purple-700 border-purple-200'>
												Elaborado
											</Badge>
										)}
									</td>
									<td className='p-3'>{product.type}</td>
									<td className='p-3'>
										<div className='flex items-center gap-2'>
											<Input
												type='number'
												defaultValue={product.purchasePrice}
												className='w-32'
												disabled={product.calculated}
											/>
											{product.calculated && (
												<Badge
													variant='outline'
													className='bg-blue-50 text-blue-700 border-blue-200'>
													Calculado
												</Badge>
											)}
										</div>
									</td>
									<td className='p-3'>
										<Input
											type='number'
											defaultValue={product.salePrice}
											className='w-32'
										/>
									</td>
									<td className='p-3'>
										<Input
											type='number'
											defaultValue={product.margin.toFixed(2)}
											className='w-32'
										/>
									</td>
									<td className='p-3'>
										<Button
											variant='ghost'
											size='icon'>
											<Clock className='h-4 w-4' />
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
