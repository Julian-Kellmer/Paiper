'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangleIcon, ShoppingCartIcon } from 'lucide-react';

export function AlertSection() {
	// Mock data for alerts
	const lowStockItems = [
		{ id: 2, name: 'Ron', type: 'botella', stock: 2, unit: 'unidades' },
		{ id: 5, name: 'Jugo de Naranja', type: 'insumo', stock: 500, unit: 'ml' },
		{ id: 7, name: 'Menta', type: 'insumo', stock: 10, unit: 'hojas' },
	];

	const outOfStockItems = [{ id: 3, name: 'Tequila', type: 'botella', stock: 0, unit: 'unidades' }];

	// Mock data for affected elaborated products
	const affectedProducts = [{ id: 2, name: 'Margarita', affectedBy: ['Tequila'] }];

	return (
		<div className='space-y-6'>
			<Card>
				<CardHeader className='bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800'>
					<CardTitle className='text-amber-700 dark:text-amber-400 flex items-center'>
						<AlertTriangleIcon className='h-5 w-5 mr-2' />
						Productos en Bajo Stock
					</CardTitle>
				</CardHeader>
				<CardContent className='pt-4'>
					{lowStockItems.length > 0 ? (
						<ul className='space-y-3'>
							{lowStockItems.map((item, index) => (
								<li
									key={item.id}
									className='flex justify-between items-center'
									id={`xoudfv_${index}`}>
									<div id={`vkl98x_${index}`}>
										<p
											className='font-medium text-gray-800 dark:text-gray-200'
											id={`ohjdp1_${index}`}>
											{item.name}
										</p>
										<p
											className='text-sm text-gray-600 dark:text-gray-400'
											id={`e44udz_${index}`}>
											{item.stock} {item.unit} restantes
										</p>
									</div>
									<Badge
										variant='outline'
										className='bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-700'
										id={`l093pk_${index}`}>
										Bajo
									</Badge>
								</li>
							))}
						</ul>
					) : (
						<p className='text-gray-600 dark:text-gray-400'>No hay productos en bajo stock.</p>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader className='bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800'>
					<CardTitle className='text-red-700 dark:text-red-400 flex items-center'>
						<AlertTriangleIcon className='h-5 w-5 mr-2' />
						Productos Agotados
					</CardTitle>
				</CardHeader>
				<CardContent className='pt-4'>
					{outOfStockItems.length > 0 ? (
						<ul className='space-y-3'>
							{outOfStockItems.map((item, index) => (
								<li
									key={item.id}
									className='flex justify-between items-center'
									id={`ly8jvi_${index}`}>
									<div id={`d6w1io_${index}`}>
										<p
											className='font-medium text-gray-800 dark:text-gray-200'
											id={`rfs7o9_${index}`}>
											{item.name}
										</p>
										<p
											className='text-sm text-gray-600 dark:text-gray-400'
											id={`bgogdx_${index}`}>
											{item.stock} {item.unit} restantes
										</p>
									</div>
									<Badge
										variant='outline'
										className='bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-700'
										id={`b42gkb_${index}`}>
										Agotado
									</Badge>
								</li>
							))}
						</ul>
					) : (
						<p className='text-gray-600 dark:text-gray-400'>No hay productos agotados.</p>
					)}
				</CardContent>
			</Card>

			{affectedProducts.length > 0 && (
				<Card>
					<CardHeader className='bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800'>
						<CardTitle className='text-purple-700 dark:text-purple-400 flex items-center'>
							<AlertTriangleIcon className='h-5 w-5 mr-2' />
							Productos Elaborados Afectados
						</CardTitle>
					</CardHeader>
					<CardContent className='pt-4'>
						<ul className='space-y-3'>
							{affectedProducts.map((item, index) => (
								<li
									key={item.id}
									className='flex justify-between items-center'
									id={`87le46_${index}`}>
									<div id={`24kqhd_${index}`}>
										<p
											className='font-medium text-gray-800 dark:text-gray-200'
											id={`grhq6z_${index}`}>
											{item.name}
										</p>
										<p
											className='text-sm text-gray-600 dark:text-gray-400'
											id={`zdia0w_${index}`}>
											Falta: {item.affectedBy.join(', ')}
										</p>
									</div>
									<Badge
										variant='outline'
										className='bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-700'
										id={`csacs6_${index}`}>
										Bloqueado
									</Badge>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}

			<Button
				className='w-full'
				variant='outline'>
				<ShoppingCartIcon className='h-4 w-4 mr-2' />
				Reponer Ahora
			</Button>
		</div>
	);
}
