'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { OrderItem } from '(components)/order-item';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { XIcon } from 'lucide-react';
import { Note, orderItems, Customer, Order } from '@/types/types';
import { supabase } from '@/lib/supabaseClient';

// Define extended order item type to include price
interface ExtendedOrderItem extends orderItems {
	price: number;
	product_id: number;
}

// Define extended order type
interface ExtendedOrder extends Order {
	orderItems: ExtendedOrderItem[];
}

export function LiveOrders() {
	const [filter, setFilter] = useState('all');
	const [selectedOrder, setSelectedOrder] = useState<ExtendedOrder | null>(null);
	const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
	const [orders, setOrders] = useState<ExtendedOrder[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch orders from Supabase
	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Fetch orders with their items
				const { data: ordersData, error: ordersError } = await supabase
					.from('orders')
					.select(
						`
						*,
						order_items (
							id,
							product_id,
							quantity,
							unit_price,
							products (
								name,
								image_url
							)
						)
					`
					)
					.order('created_at', { ascending: false })
					.limit(10);

				if (ordersError) throw ordersError;

				// Transform the data to match our component's expected format
				const transformedOrders: ExtendedOrder[] = ordersData.map((order) => {
					// Get customer info if available
					const customer: Customer = order.user_id
						? {
								name: order.user_name || 'Unknown User',
								code: `#${order.user_id.substring(0, 4)}`,
								avatar: order.user_avatar || 'https://github.com/shadcn.png',
						  }
						: {
								name: 'Anonymous Customer',
								code: '#ANON',
								avatar: 'https://github.com/shadcn.png',
						  };

					// Transform order items
					const orderItems: ExtendedOrderItem[] = order.order_items.map(
						(item: {
							id: number;
							product_id: number;
							quantity: number;
							unit_price: number;
							products?: {
								name: string;
								image_url?: string;
							};
						}) => ({
							id: item.id,
							product_id: item.product_id,
							quantity: item.quantity,
							unit_price: item.unit_price,
							name: item.products?.name || 'Unknown Product',
							price: item.unit_price,
						})
					);

					// Calculate total
					const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

					// Format times
					const orderTime = new Date(order.created_at);
					const deliveryTime = new Date(order.created_at);
					deliveryTime.setMinutes(deliveryTime.getMinutes() + 30); // Assume 30 min delivery time

					// Determine if order is delayed
					const now = new Date();
					const isDelayed = order.status === 'pending' && now > deliveryTime;

					// Create notes array
					const notes: Note[] = [];
					if (order.notes) {
						notes.push({ type: 'preference', text: order.notes });
					}

					return {
						id: order.id,
						name: order.user_name,
						table: order.table_number || 'N/A',
						status: isDelayed ? 'delayed' : order.status,
						items: orderItems.length,
						time: orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
						timeExtra: isDelayed ? '+15min' : undefined,
						customer,
						paymentStatus: order.payment_status || 'Pendiente',
						paymentMethod: order.payment_method || 'MercadoLibre',
						orderTime: orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
						deliveryTime: deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
						orderItems,
						total,
						notes,
					};
				});

				setOrders(transformedOrders);
			} catch (err) {
				console.error('Error fetching orders:', err);
				setError('Error loading orders');
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrders();
	}, []);

	const filteredOrders = filter === 'all' ? orders : orders.filter((order) => order.status === filter);

	const handleOrderClick = (order: ExtendedOrder) => {
		setSelectedOrder(order);
		setIsOrderDetailsOpen(true);
	};

	// Function to handle order status change
	const handleOrderStatusChange = async (order: ExtendedOrder) => {
		try {
			setIsLoading(true);
			setError(null);

			// Prevent updating orders that are already delivered
			if (order.status === 'delivered') {
				setError('Cannot update an order that is already delivered');
				setIsLoading(false);
				return;
			}

			// Determine the new status based on current status
			let newStatus = 'pending';
			if (order.status === 'new') {
				newStatus = 'preparation';
			} else if (order.status === 'preparation' || order.status === 'delayed' || order.status === 'pending') {
				newStatus = 'ready';
			} else if (order.status === 'ready') {
				newStatus = 'delivered';
			}

			// Update order status in Supabase
			const { error: orderError } = await supabase
				.from('orders')
				.update({
					status: newStatus,
					updated_at: new Date().toISOString(),
				})
				.eq('id', order.id);

			if (orderError) throw orderError;

			// If order is being marked as delivered, update product stock
			if (newStatus === 'delivered') {
				// Get all products from the order
				const productIds = order.orderItems.map((item) => item.product_id);

				// Fetch current product stock
				const { data: products, error: productsError } = await supabase.from('products').select('id, stock').in('id', productIds);

				if (productsError) throw productsError;

				// Update stock for each product
				for (const product of products) {
					const orderItem = order.orderItems.find((item) => item.product_id === product.id);
					if (orderItem) {
						const currentStock = parseInt(product.stock);
						const newStock = Math.max(0, currentStock - orderItem.quantity);

						const { error: updateError } = await supabase
							.from('products')
							.update({
								stock: newStock.toString(),
								updated_at: new Date().toISOString(),
							})
							.eq('id', product.id);

						if (updateError) throw updateError;
					}
				}
			}

			// Refresh orders list
			const fetchOrders = async () => {
				try {
					setIsLoading(true);
					setError(null);

					// Fetch orders with their items
					const { data: ordersData, error: ordersError } = await supabase
						.from('orders')
						.select(
							`
							*,
							order_items (
								id,
								product_id,
								quantity,
								unit_price,
								products (
									name,
									image_url
								)
							)
						`
						)
						.order('created_at', { ascending: false })
						.limit(10);

					if (ordersError) throw ordersError;

					// Transform the data to match our component's expected format
					const transformedOrders: ExtendedOrder[] = ordersData.map((order) => {
						// Get customer info if available
						const customer: Customer = order.user_id
							? {
									name: order.user_name || 'Unknown User',
									code: `#${order.user_id.substring(0, 4)}`,
									avatar: order.user_avatar || 'https://github.com/shadcn.png',
							  }
							: {
									name: 'Anonymous Customer',
									code: '#ANON',
									avatar: 'https://github.com/shadcn.png',
							  };

						// Transform order items
						const orderItems: ExtendedOrderItem[] = order.order_items.map(
							(item: {
								id: number;
								product_id: number;
								quantity: number;
								unit_price: number;
								products?: {
									name: string;
									image_url?: string;
								};
							}) => ({
								id: item.id,
								product_id: item.product_id,
								quantity: item.quantity,
								unit_price: item.unit_price,
								name: item.products?.name || 'Unknown Product',
								price: item.unit_price,
							})
						);

						// Calculate total
						const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

						// Format times
						const orderTime = new Date(order.created_at);
						const deliveryTime = new Date(order.created_at);
						deliveryTime.setMinutes(deliveryTime.getMinutes() + 30); // Assume 30 min delivery time

						// Determine if order is delayed
						const now = new Date();
						const isDelayed = order.status === 'pending' && now > deliveryTime;

						// Create notes array
						const notes: Note[] = [];
						if (order.notes) {
							notes.push({ type: 'preference', text: order.notes });
						}

						return {
							id: order.id,
							table: order.table_number || 'N/A',
							status: isDelayed ? 'delayed' : order.status,
							items: orderItems.length,
							time: orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
							timeExtra: isDelayed ? '+15min' : undefined,
							customer,
							paymentStatus: order.payment_status || 'Pendiente',
							paymentMethod: order.payment_method || 'Pendiente',
							orderTime: orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
							deliveryTime: deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
							orderItems,
							total,
							notes,
						};
					});

					setOrders(transformedOrders);
				} catch (err) {
					console.error('Error fetching orders:', err);
					setError('Error loading orders');
				} finally {
					setIsLoading(false);
				}
			};

			fetchOrders();

			// Close the modal
			setIsOrderDetailsOpen(false);
		} catch (err) {
			console.error('Error updating order status:', err);
			setError('Error updating order status');
		} finally {
			setIsLoading(false);
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'delayed':
				return <Badge className='bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'>Demorado</Badge>;

			case 'preparation':
				return <Badge className='bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'>En Preparación</Badge>;

			case 'ready':
				return <Badge className='bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'>Listo</Badge>;

			case 'new':
				return <Badge className='bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'>Nuevo</Badge>;
			case 'delivered':
				return <Badge className='bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'>Entregado</Badge>;

			default:
				return <Badge className='bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'>{status}</Badge>;
		}
	};

	return (
		<div className='bg-card rounded-lg border dark:bg-gray-900 dark:border-gray-800 p-6'>
			<h2 className='text-xl font-semibold mb-6 dark:text-white'>Live Orders</h2>

			{error && <div className='p-4 bg-red-50 border border-red-200 rounded-md text-red-600 mb-4'>{error}</div>}

			<div className='flex space-x-2 mb-6 overflow-x-auto'>
				<Button
					variant={filter === 'all' ? 'default' : 'outline'}
					size='sm'
					onClick={() => setFilter('all')}
					className={filter === 'all' ? '' : 'dark:text-gray-300 dark:border-gray-700'}>
					todos
				</Button>

				<Button
					variant={filter === 'preparation' ? 'default' : 'outline'}
					size='sm'
					onClick={() => setFilter('preparation')}
					className={
						filter === 'preparation'
							? 'bg-orange-100 text-orange-800 hover:bg-orange-200 hover:text-orange-900 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30'
							: 'bg-orange-100 text-orange-800 hover:bg-orange-200 hover:text-orange-900 dark:bg-transparent dark:text-gray-300 dark:border-gray-700'
					}>
					En preparacion
				</Button>
				<Button
					variant={filter === 'delayed' ? 'default' : 'outline'}
					size='sm'
					onClick={() => setFilter('delayed')}
					className={
						filter === 'delayed'
							? 'bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
							: 'bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900 dark:bg-transparent dark:text-gray-300 dark:border-gray-700'
					}>
					Retrasados
				</Button>
				<Button
					variant={filter === 'ready' ? 'default' : 'outline'}
					size='sm'
					onClick={() => setFilter('ready')}
					className={
						filter === 'ready'
							? 'bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
							: 'bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 dark:bg-transparent dark:text-gray-300 dark:border-gray-700'
					}>
					Listos
				</Button>
			</div>

			{isLoading ? (
				<div className='space-y-4'>
					{Array(3)
						.fill(0)
						.map((_, index) => (
							<div
								key={index}
								className='bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-24 animate-pulse'></div>
						))}
				</div>
			) : filteredOrders.length > 0 ? (
				<div className='space-y-4'>
					{filteredOrders.map((order, index) => (
						<div
							key={order.id}
							className='cursor-pointer'
							onClick={() => handleOrderClick(order)}
							id={`order-item-wrapper-${index}`}>
							<OrderItem
								key={order.id}
								order={order}
							/>
						</div>
					))}
				</div>
			) : (
				<div className='text-center py-8 text-gray-500 dark:text-gray-400'>No orders found</div>
			)}

			{/* Order Details Modal azul */}
			<Dialog
				open={isOrderDetailsOpen}
				onOpenChange={setIsOrderDetailsOpen}>
				<DialogContent className='sm:max-w-[600px] dark:bg-gray-900 dark:border-gray-800'>
					{selectedOrder && (
						<>
							<DialogHeader>
								<DialogTitle className='flex items-center justify-between'>
									<span>Detalles del Pedido {selectedOrder.id}</span>
								</DialogTitle>
								{selectedOrder.status === 'delivered' && <div className='text-sm text-gray-500 mt-1'>Este pedido ya ha sido entregado y no puede ser actualizado.</div>}
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
									<DialogTitle className='flex items-center justify-between'>
										{getStatusBadge(selectedOrder.status)}
									</DialogTitle>
								</div>
								<Separator />
								Order Info
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
										<p className='text-sm text-muted-foreground dark:text-gray-400'>Total</p>
										<p className='font-medium dark:text-white'>${selectedOrder.total.toFixed(2)}</p>
									</div>
									<div>
										<p className='text-sm text-muted-foreground dark:text-gray-400'>Metodo de pago</p>
										<p className='font-medium dark:text-white'>{selectedOrder.paymentMethod || 'mercado pago'}</p>
									</div>
								</div>
								<Separator />
								{/* Order Items */}
								<div>
									<h3 className='font-medium mb-3 dark:text-white'>Products</h3>
									<div className='space-y-2'>
										{selectedOrder.orderItems.map((item, idx) => (
											<div
												key={idx}
												className='flex justify-between'
												id={`order-item-${idx}`}>
												<div id={`order-item-name-${idx}`}>
													<span
														className='font-medium dark:text-white'
														id={`order-item-quantity-${idx}`}>
														{item.quantity}x{' '}
													</span>
													<span
														className='dark:text-white'
														id={`order-item-text-${idx}`}>
														{item.name}
													</span>
												</div>
												<div
													className='font-medium dark:text-white'
													id={`order-item-price-${idx}`}>
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
												{selectedOrder.notes.map((note, idx) => (
													<div
														key={idx}
														className={`px-3 py-2 rounded-md text-sm ${
															note.type === 'allergy'
																? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
																: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
														}`}
														id={`note-${idx}`}>
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
									onClick={() => handleOrderStatusChange(selectedOrder)}
									disabled={isLoading || selectedOrder.status === 'delivered'}
									className={
										selectedOrder.status === 'new'
											? 'bg-blue-600 hover:bg-blue-700'
											: selectedOrder.status === 'preparation'
											? 'bg-orange-600 hover:bg-orange-700'
											: selectedOrder.status === 'delayed'
											? 'bg-red-600 hover:bg-red-700'
											: 'bg-green-600 hover:bg-green-700'
									}>
									{isLoading ? (
										<div className='flex items-center'>
											<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
											Procesando...
										</div>
									) : selectedOrder.status === 'new' ? (
										'Comenzar Preparación'
									) : selectedOrder.status === 'preparation' || selectedOrder.status === 'delayed' || selectedOrder.status === 'pending' ? (
										'Marcar como Listo'
									) : selectedOrder.status === 'ready' ? (
										'Completar Pedido'
									) : (
										'Pedido Completado'
									)}
								</Button>
							</DialogFooter>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
