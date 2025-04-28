'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OrderCard } from '(components)/order-card';
import { OrderMetrics } from '(components)/order-metrics';
import { RefreshCwIcon, FilterIcon, SearchIcon, XIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderManagement, OrderManagementItem, MetricData, OrderManagementNote } from '@/types/types';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { throws } from 'assert';

export default function OrdersManagement() {
	const [activeFilter, setActiveFilter] = useState<OrderManagement['status'] | 'all'>('all');
	const [selectedOrder, setSelectedOrder] = useState<OrderManagement | null>(null);
	const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	// const [orders, setOrders] = useState<ExtendedOrder[]>([]);

	// Mock data for metrics
	const metricsData: MetricData[] = [
		{
			id: 'new-orders',
			title: 'New Orders',
			value: '12',
			icon: 'shopping-cart',
			color: 'blue',
		},
		{
			id: 'in-preparation',
			title: 'In Preparation',
			value: '8',
			icon: 'clock',
			color: 'orange',
		},
		{
			id: 'ready',
			title: 'Ready',
			value: '5',
			icon: 'check',
			color: 'green',
		},
		{
			id: 'completed',
			title: 'Completed',
			value: '24',
			icon: 'archive',
			color: 'purple',
		},
	];

	// Mock data for orders
	const orders: OrderManagement[] = [
		{
			id: '#ORD-2025',
			table: '12',
			customer: {
				name: 'Carlos Ruiz',
				code: '#A123',
				avatar: 'https://github.com/yusufhilmi.png',
			},
			status: 'ready',
			paymentStatus: 'Pagado',
			orderTime: '14:30',
			deliveryTime: '15:00',
			items: [
				{ name: 'Hamburguesa Clásica', quantity: 2, price: 12.0 },
				{ name: 'Papas Fritas Grande', quantity: 1, price: 6.5 },
			],
			total: 30.5,
			notes: [{ type: 'allergy', text: 'Maní' }],
		},
		{
			id: '#ORD-2026',
			table: '8',
			customer: {
				name: 'Ana Martinez',
				code: '#B450',
				avatar: 'https://github.com/furkanksl.png',
			},
			status: 'new',
			paymentStatus: 'Pendiente',
			orderTime: '14:45',
			deliveryTime: '15:15',
			items: [
				{ name: 'Pizza Margherita', quantity: 1, price: 18.0 },
				{ name: 'Coca-Cola', quantity: 2, price: 3.0 },
			],
			total: 24.0,
			notes: [{ type: 'preference', text: 'Sin cebolla' }],
		},
		{
			id: '#ORD-2027',
			table: '5',
			customer: {
				name: 'Miguel Sánchez',
				code: '#C789',
				avatar: 'https://github.com/polymet-ai.png',
			},
			status: 'preparation',
			paymentStatus: 'Pagado',
			orderTime: '14:50',
			deliveryTime: '15:20',
			items: [
				{ name: 'Ensalada César', quantity: 1, price: 10.0 },
				{ name: 'Pollo a la Parrilla', quantity: 1, price: 15.0 },
				{ name: 'Agua Mineral', quantity: 1, price: 2.5 },
			],
			total: 27.5,
			notes: [],
		},
	];

	// Filter orders based on active filter
	const filteredOrders = activeFilter === 'all' ? orders : orders.filter((order) => order.status === activeFilter);

	const handleOrderClick = (order: OrderManagement) => {
		setSelectedOrder(order);
		setIsOrderDetailsOpen(true);
	};

	const getStatusBadge = (status: OrderManagement['status']) => {
		switch (status) {
			case 'new':
				return <Badge className='bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'>Nuevo</Badge>;

			case 'preparation':
				return <Badge className='bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'>En Preparación</Badge>;

			case 'ready':
				return <Badge className='bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'>Listo</Badge>;

			case 'delayed':
				return <Badge className='bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'>Demorado</Badge>;

			default:
				return <Badge className='bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'>{status}</Badge>;
		}
	};
	
	// useEffect(() => {
	// 	const fetchOrders = async () => {
	// 		try {
	// 			setIsLoading(true);
	// 			setError(null);

	// 			// Fetch orders with their items
	// 			const { data: ordersData, error: ordersError } = await supabase
	// 				.from('orders')
	// 				.select(
	// 					`
	// 					*,
	// 					order_items (
	// 						id,
	// 						product_id,
	// 						quantity,
	// 						unit_price,
	// 						products (
	// 							name,
	// 							image_url
	// 						)
	// 					)
	// 				`
	// 				)
	// 				.order('created_at', { ascending: false })
	// 				.limit(10);

	// 			if (ordersError) throw ordersError;

				// Transform the data to match our component's expected format
				// const transformedOrders: ExtendedOrder[] = ordersData.map((order) => {
					// Get customer info if available
					// const customer: Customer = order.user_id
	// 					? {
	// 							name: order.user_name || 'Unknown User',
	// 							code: `#${order.user_id.substring(0, 4)}`,
	// 							avatar: order.user_avatar || 'https://github.com/shadcn.png',
	// 					  }
	// 					: {
	// 							name: 'Anonymous Customer',
	// 							code: '#ANON',
	// 							avatar: 'https://github.com/shadcn.png',
	// 					  };

	// 				// Transform order items
	// 				const orderItems: ExtendedOrderItem[] = order.order_items.map(
	// 					(item: {
	// 						id: number;
	// 						product_id: number;
	// 						quantity: number;
	// 						unit_price: number;
	// 						products?: {
	// 							name: string;
	// 							image_url?: string;
	// 						};
	// 					}) => ({
	// 						id: item.id,
	// 						product_id: item.product_id,
	// 						quantity: item.quantity,
	// 						unit_price: item.unit_price,
	// 						name: item.products?.name || 'Unknown Product',
	// 						price: item.unit_price,
	// 					})
	// 				);

	// 				// Calculate total
	// 				const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

	// 				// Format times
	// 				const orderTime = new Date(order.created_at);
	// 				const deliveryTime = new Date(order.created_at);
	// 				deliveryTime.setMinutes(deliveryTime.getMinutes() + 30); // Assume 30 min delivery time

	// 				// Determine if order is delayed
	// 				const now = new Date();
	// 				const isDelayed = order.status === 'pending' && now > deliveryTime;

	// 				// Create notes array
	// 				const notes: Note[] = [];
	// 				if (order.notes) {
	// 					notes.push({ type: 'preference', text: order.notes });
	// 				}

	// 				return {
	// 					id: order.id,
	// 					name: order.user_name,
	// 					table: order.table_number || 'N/A',
	// 					status: isDelayed ? 'delayed' : order.status,
	// 					items: orderItems.length,
	// 					time: orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
	// 					timeExtra: isDelayed ? '+15min' : undefined,
	// 					customer,
	// 					paymentStatus: order.payment_status || 'Pendiente',
	// 					paymentMethod: order.payment_method || 'MercadoLibre',
	// 					orderTime: orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
	// 					deliveryTime: deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
	// 					orderItems,
	// 					total,
	// 					notes,
	// 				};
	// 			});

	// 			setOrders(transformedOrders);
	// 		} catch (err) {
	// 			console.error('Error fetching orders:', err);
	// 			setError('Error loading orders');
	// 		} finally {
	// 			setIsLoading(false);
	// 		}
	// 	};

	// 	fetchOrders();
	// }, []);

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Gestión de Pedidos</h1>
				<div className='flex items-center space-x-2'>
					<div className='flex items-center'>
						<span className='h-2 w-2 rounded-full bg-green-500 mr-2'></span>
						<span className='text-sm text-muted-foreground'>En línea</span>
					</div>
				</div>
			</div>

			{/* Metrics Cards */}
			<OrderMetrics data={metricsData} />

			{/* Search and Filter */}
			<div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
				<div className='relative w-full sm:w-64'>
					<SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />

					<Input
						placeholder='Buscar pedido...'
						className='pl-10'
					/>
				</div>
				<div className='flex gap-2 w-full sm:w-auto justify-end'>
					<Button
						variant='outline'
						size='sm'>
						<FilterIcon className='h-4 w-4 mr-2' />
						Filtrar
					</Button>
					<Button
						variant='outline'
						size='sm'>
						<RefreshCwIcon className='h-4 w-4 mr-2' />
						Actualizar
					</Button>
				</div>
			</div>

			{/* Filter Tabs */}
			<div className='flex space-x-2 overflow-x-auto pb-2'>
				<Button
					variant={activeFilter === 'all' ? 'default' : 'outline'}
					size='sm'
					onClick={() => setActiveFilter('all')}
					className='rounded-full'>
					Todos
				</Button>
				<Button
					variant={activeFilter === 'new' ? 'default' : 'outline'}
					size='sm'
					onClick={() => setActiveFilter('new')}
					className={`rounded-full ${
						activeFilter === 'new'
							? 'bg-blue-600 hover:bg-blue-700'
							: 'bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30'
					}`}>
					Nuevos
				</Button>
				<Button
					variant={activeFilter === 'preparation' ? 'default' : 'outline'}
					size='sm'
					onClick={() => setActiveFilter('preparation')}
					className={`rounded-full ${
						activeFilter === 'preparation'
							? 'bg-orange-600 hover:bg-orange-700'
							: 'bg-orange-100 text-orange-800 hover:bg-orange-200 hover:text-orange-900 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30'
					}`}>
					En Preparación
				</Button>
				<Button
					variant={activeFilter === 'ready' ? 'default' : 'outline'}
					size='sm'
					onClick={() => setActiveFilter('ready')}
					className={`rounded-full ${
						activeFilter === 'ready'
							? 'bg-green-600 hover:bg-green-700'
							: 'bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
					}`}>
					Listos
				</Button>
				<Button
					variant={activeFilter === 'completed' ? 'default' : 'outline'}
					size='sm'
					onClick={() => setActiveFilter('completed')}
					className={`rounded-full ${
						activeFilter === 'completed'
							? 'bg-purple-600 hover:bg-purple-700'
							: 'bg-purple-100 text-purple-800 hover:bg-purple-200 hover:text-purple-900 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30'
					}`}>
					Completados
				</Button>
			</div>

			{/* Orders Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{filteredOrders.map((order, index) => (
					<div
						key={order.id}
						className='cursor-pointer'
						onClick={() => handleOrderClick(order)}
						id={`hno87w_${index}`}>
						<OrderCard
							order={order}
							key={`e4506w_${index}`}
						/>
					</div>
				))}
			</div>

			{/* Order Details Modal */}
			<Dialog
				open={isOrderDetailsOpen}
				onOpenChange={setIsOrderDetailsOpen}>
				<DialogContent className='sm:max-w-[600px] dark:bg-gray-900 dark:border-gray-800'>
					{selectedOrder && (
						<>
							<DialogHeader>
								<DialogTitle className='flex items-center justify-between'>
									<span>Detalles del Pedido {selectedOrder.id}</span>
									{getStatusBadge(selectedOrder.status)}
								</DialogTitle>
							</DialogHeader>

							<div className='space-y-6 my-4'>
								{/* Customer Info */}
								<div className='flex items-center justify-between'>
									<div className='flex items-center space-x-3'>
										<Avatar>
											<AvatarImage
												src={selectedOrder.customer.avatar}
												alt={selectedOrder.customer.name}
											/>

											<AvatarFallback>{selectedOrder.customer.name.charAt(0)}</AvatarFallback>
										</Avatar>
										<div>
											<h3 className='font-medium dark:text-white'>{selectedOrder.customer.name}</h3>
											<p className='text-sm text-muted-foreground dark:text-gray-400'>Código: {selectedOrder.customer.code}</p>
										</div>
									</div>
									<Badge
										className={
											selectedOrder.paymentStatus === 'Pagado'
												? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
												: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
										}>
										{selectedOrder.paymentStatus}
									</Badge>
								</div>

								<Separator />

								{/* Order Info */}
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<p className='text-sm text-muted-foreground dark:text-gray-400'>Mesa</p>
										<p className='font-medium dark:text-white'>{selectedOrder.table}</p>
									</div>
									<div>
										<p className='text-sm text-muted-foreground dark:text-gray-400'>Hora del pedido</p>
										<p className='font-medium dark:text-white'>{selectedOrder.orderTime}</p>
									</div>
									<div>
										<p className='text-sm text-muted-foreground dark:text-gray-400'>Entrega estimada</p>
										<p className='font-medium dark:text-white'>{selectedOrder.deliveryTime}</p>
									</div>
									<div>
										<p className='text-sm text-muted-foreground dark:text-gray-400'>Total</p>
										<p className='font-medium dark:text-white'>${selectedOrder.total.toFixed(2)}</p>
									</div>
								</div>

								<Separator />

								{/* Order Items */}
								<div>
									<h3 className='font-medium mb-3 dark:text-white'>Productos</h3>
									<div className='space-y-2'>
										{selectedOrder.items.map((item: OrderManagementItem, idx: number) => (
											<div
												key={idx}
												className='flex justify-between'
												id={`oba2d9_${idx}`}>
												<div id={`e0tdll_${idx}`}>
													<span
														className='font-medium dark:text-white'
														id={`0qm5ga_${idx}`}>
														{item.quantity}x{' '}
													</span>
													<span
														className='dark:text-white'
														id={`n1ncgw_${idx}`}>
														{item.name}
													</span>
												</div>
												<div
													className='font-medium dark:text-white'
													id={`btx5yx_${idx}`}>
													${(item.price * item.quantity).toFixed(2)}
												</div>
											</div>
										))}
									</div>
									<div className='mt-4 pt-2 border-t flex justify-between font-bold dark:text-white'>
										<div>Total</div>
										<div>${selectedOrder.total.toFixed(2)}</div>
									</div>
								</div>

								{/* Notes */}
								{selectedOrder.notes && selectedOrder.notes.length > 0 && (
									<>
										<Separator />
										<div>
											<h3 className='font-medium mb-3 dark:text-white'>Notas</h3>
											<div className='space-y-2'>
												{selectedOrder.notes.map((note: OrderManagementNote, idx: number) => (
													<div
														key={idx}
														className={`px-3 py-2 rounded-md text-sm ${
															note.type === 'allergy'
																? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
																: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
														}`}
														id={`zkoq4g_${idx}`}>
														{note.type === 'allergy' ? 'Alergia: ' : 'Preferencia: '}
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
									<Button
										variant='outline'
										className='mr-2'>
										<XIcon className='h-4 w-4 mr-2' />
										Cerrar
									</Button>
								</DialogClose>
								<Button
									className={
										selectedOrder.status === 'new'
											? 'bg-blue-600 hover:bg-blue-700'
											: selectedOrder.status === 'preparation'
											? 'bg-orange-600 hover:bg-orange-700'
											: 'bg-green-600 hover:bg-green-700'
									}>
									{selectedOrder.status === 'new' ? 'Comenzar Preparación' : selectedOrder.status === 'preparation' ? 'Marcar como Listo' : 'Completar Pedido'}
								</Button>
							</DialogFooter>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
