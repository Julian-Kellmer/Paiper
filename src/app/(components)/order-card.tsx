'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PencilIcon, ClockIcon, CheckIcon, XIcon, SaveIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { OrderManagement } from '@/types/types';

export function OrderCard({ order }: { order: OrderManagement }) {
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editedOrder, setEditedOrder] = useState<OrderManagement>({ ...order });
	const [editedItems, setEditedItems] = useState<OrderManagement['items']>([...order.items]);
	const [editedNotes, setEditedNotes] = useState<OrderManagement['notes']>([...order.notes]);

	const handleAddItem = () => {
		setEditedItems([...editedItems, { name: '', quantity: 1, price: 0 }]);
	};

	const handleRemoveItem = (index: number) => {
		const newItems = [...editedItems];
		newItems.splice(index, 1);
		setEditedItems(newItems);
	};

	const handleItemChange = (index: number, field: keyof OrderManagement['items'], value: string | number) => {
		const newItems = [...editedItems];
		newItems[index] = { ...newItems[index], [field]: value };
		setEditedItems(newItems);
	};

	const handleAddNote = () => {
		setEditedNotes([...editedNotes, { type: 'preference', text: '' }]);
	};

	const handleRemoveNote = (index: number) => {
		const newNotes = [...editedNotes];
		newNotes.splice(index, 1);
		setEditedNotes(newNotes);
	};

	const handleNoteChange = (index: number, field: keyof OrderManagement['notes'], value: string) => {
		const newNotes = [...editedNotes];
		newNotes[index] = { ...newNotes[index], [field]: value };
		setEditedNotes(newNotes);
	};

	const calculateTotal = () => {
		return editedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
	};

	const handleSaveChanges = () => {
		// In a real app, this would save changes to the backend
		setIsEditOpen(false);
	};

	const getStatusBadge = () => {
		switch (order.status) {
			case 'new':
				return <span className='px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'>Nuevo</span>;

			case 'preparation':
				return <span className='px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'>En Preparación</span>;

			case 'ready':
				return <span className='px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'>Listo</span>;

			case 'completed':
				return <span className='px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'>Completado</span>;

			default:
				return null;
		}
	};

	const getPaymentStatusBadge = () => {
		return (
			<span
				className={`px-2 py-1 text-xs font-medium rounded-full ${
					order.paymentStatus === 'Pagado' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
				}`}>
				{order.paymentStatus}
			</span>
		);
	};

	const getActionButton = () => {
		switch (order.status) {
			case 'new':
				return <Button className='w-full bg-blue-600 hover:bg-blue-700 text-white'>Comenzar Preparación</Button>;

			case 'preparation':
				return <Button className='w-full bg-green-600 hover:bg-green-700 text-white'>Marcar como Listo</Button>;

			case 'ready':
				return <Button className='w-full bg-orange-600 hover:bg-orange-700 text-white'>Marcar como Listo</Button>;

			case 'completed':
				return (
					<Button
						className='w-full bg-gray-600 hover:bg-gray-700 text-white'
						disabled>
						Completado
					</Button>
				);

			default:
				return null;
		}
	};

	return (
		<Card className='overflow-hidden'>
			<CardContent className='p-0'>
				{/* Header */}
				<div className='flex justify-between items-center p-4 border-b'>
					<div className='flex items-center space-x-3'>
						<div className='font-bold'>{order.id}</div>
						<div className='text-sm text-muted-foreground'>Mesa {order.table}</div>
					</div>
					<div className='flex items-center space-x-2'>
						{getPaymentStatusBadge()}
						<Button
							variant='ghost'
							size='icon'
							onClick={() => setIsEditOpen(true)}>
							<PencilIcon className='h-4 w-4' />
						</Button>
					</div>
				</div>

				{/* Customer Info */}
				<div className='p-4 border-b flex justify-between items-center'>
					<div className='flex items-center space-x-3'>
						<Avatar>
							<AvatarImage
								src={order.customer.avatar}
								alt={order.customer.name}
							/>

							<AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
						</Avatar>
						<div>
							<div className='font-medium'>{order.customer.name}</div>
							<div className='text-sm text-muted-foreground'>Código: {order.customer.code}</div>
						</div>
					</div>
					<div className='flex flex-col items-end'>
						<div className='flex items-center text-sm'>
							<ClockIcon className='h-4 w-4 mr-1 text-muted-foreground' />

							<span>Ordenado: {order.orderTime}</span>
						</div>
						<div className='flex items-center text-sm'>
							<ClockIcon className='h-4 w-4 mr-1 text-muted-foreground' />

							<span>Entrega est.: {order.deliveryTime}</span>
						</div>
					</div>
				</div>

				{/* Order Items */}
				<div className='p-4 border-b'>
					<h3 className='font-medium mb-2'>Productos</h3>
					<div className='space-y-2'>
						{order.items.map((item, index) => (
							<div
								key={index}
								className='flex justify-between'
								id={`orv175_${index}`}>
								<div id={`8x6wqo_${index}`}>
									<span
										className='font-medium'
										id={`eqp0pn_${index}`}>
										{item.quantity}x
									</span>{' '}
									{item.name}
								</div>
								<div
									className='font-medium'
									id={`q6gqta_${index}`}>
									${item.price.toFixed(2)}
								</div>
							</div>
						))}
					</div>
					<div className='mt-4 pt-2 border-t flex justify-between font-bold'>
						<div>Total</div>
						<div>${order.total.toFixed(2)}</div>
					</div>
				</div>

				{/* Notes */}
				{order.notes.length > 0 && (
					<div className='p-4 border-b'>
						<h3 className='font-medium mb-2'>Notas</h3>
						<div className='space-y-2'>
							{order.notes.map((note, index) => (
								<div
									key={index}
									className={`flex items-center px-3 py-1 rounded-full text-sm ${
										note.type === 'allergy' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
									}`}
									id={`7xfcaf_${index}`}>
									{note.type === 'allergy' ? 'Alergia: ' : 'Preferencia: '}
									{note.text}
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>

			<CardFooter className='p-4'>{getActionButton()}</CardFooter>

			{/* Order Edit Sidebar Modal */}
			<Sheet
				open={isEditOpen}
				onOpenChange={setIsEditOpen}>
				<SheetContent
					className='sm:max-w-md overflow-y-auto'
					side='right'>
					<SheetHeader>
						<SheetTitle>Editar Orden {order.id}</SheetTitle>
						<SheetDescription>
							Mesa {order.table} - {order.customer.name}
						</SheetDescription>
					</SheetHeader>

					<div className='py-6 space-y-6'>
						{/* Order Status */}
						<div className='space-y-2'>
							<Label htmlFor='status'>Estado de la Orden</Label>
							<Select
								defaultValue={order.status}
								onValueChange={(value) => setEditedOrder({ ...editedOrder, status: value })}>
								<SelectTrigger>
									<SelectValue placeholder='Seleccionar estado' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='new'>Nuevo</SelectItem>
									<SelectItem value='preparation'>En Preparación</SelectItem>
									<SelectItem value='ready'>Listo</SelectItem>
									<SelectItem value='completed'>Completado</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Payment Status */}
						<div className='space-y-2'>
							<Label htmlFor='payment-status'>Estado de Pago</Label>
							<Select
								defaultValue={order.paymentStatus}
								onValueChange={(value) => setEditedOrder({ ...editedOrder, paymentStatus: value })}>
								<SelectTrigger>
									<SelectValue placeholder='Seleccionar estado de pago' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='Pagado'>Pagado</SelectItem>
									<SelectItem value='Pendiente'>Pendiente</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Table Number */}
						<div className='space-y-2'>
							<Label htmlFor='table'>Número de Mesa</Label>
							<Input
								defaultValue={order.table}
								onChange={(e) => setEditedOrder({ ...editedOrder, table: e.target.value })}
							/>
						</div>

						<Separator />

						{/* Order Items */}
						<div className='space-y-4'>
							<div className='flex justify-between items-center'>
								<Label>Productos</Label>
								<Button
									variant='outline'
									size='sm'
									onClick={handleAddItem}
									className='flex items-center'>
									<PlusIcon className='h-4 w-4 mr-1' /> Agregar
								</Button>
							</div>

							{editedItems.map((item, index) => (
								<div
									key={index}
									className='space-y-2 p-3 border rounded-md'
									id={`329ufv_${index}`}>
									<div
										className='flex justify-between'
										id={`to80vr_${index}`}>
										<Label id={`o8bw6y_${index}`}>Producto {index + 1}</Label>
										<Button
											variant='ghost'
											size='sm'
											onClick={() => handleRemoveItem(index)}
											className='h-6 w-6 p-0'
											id={`ixarvb_${index}`}>
											<TrashIcon
												className='h-4 w-4 text-red-500'
												id={`3cig05_${index}`}
											/>
										</Button>
									</div>

									<div
										className='grid grid-cols-12 gap-2'
										id={`s6n8lt_${index}`}>
										<div
											className='col-span-7'
											id={`1icr0m_${index}`}>
											<Input
												placeholder='Nombre del producto'
												value={item.name}
												onChange={(e) => handleItemChange(index, 'name', e.target.value)}
												id={`4d30zj_${index}`}
											/>
										</div>
										<div
											className='col-span-2'
											id={`8872e8_${index}`}>
											<Input
												type='number'
												placeholder='Cant.'
												value={item.quantity}
												onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
												id={`9de8v0_${index}`}
											/>
										</div>
										<div
											className='col-span-3'
											id={`mw6lpb_${index}`}>
											<Input
												type='number'
												placeholder='Precio'
												value={item.price}
												onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
												id={`b02iol_${index}`}
											/>
										</div>
									</div>
								</div>
							))}

							<div className='flex justify-between font-bold pt-2'>
								<span>Total:</span>
								<span>${calculateTotal().toFixed(2)}</span>
							</div>
						</div>

						<Separator />

						{/* Notes */}
						<div className='space-y-4'>
							<div className='flex justify-between items-center'>
								<Label>Notas</Label>
								<Button
									variant='outline'
									size='sm'
									onClick={handleAddNote}
									className='flex items-center'>
									<PlusIcon className='h-4 w-4 mr-1' /> Agregar
								</Button>
							</div>

							{editedNotes.map((note, index) => (
								<div
									key={index}
									className='space-y-2 p-3 border rounded-md'
									id={`ej08za_${index}`}>
									<div
										className='flex justify-between'
										id={`1zhj8p_${index}`}>
										<Label id={`ucv9fb_${index}`}>Nota {index + 1}</Label>
										<Button
											variant='ghost'
											size='sm'
											onClick={() => handleRemoveNote(index)}
											className='h-6 w-6 p-0'
											id={`at0bqp_${index}`}>
											<TrashIcon
												className='h-4 w-4 text-red-500'
												id={`qixc2n_${index}`}
											/>
										</Button>
									</div>

									<div
										className='space-y-2'
										id={`whk6lj_${index}`}>
										<Select
											value={note.type}
											onValueChange={(value) => handleNoteChange(index, 'type', value)}
											id={`732qj8_${index}`}>
											<SelectTrigger id={`1nbaoa_${index}`}>
												<SelectValue
													placeholder='Tipo de nota'
													id={`kvuw5b_${index}`}
												/>
											</SelectTrigger>
											<SelectContent id={`m6aca4_${index}`}>
												<SelectItem
													value='allergy'
													id={`itnx2k_${index}`}>
													Alergia
												</SelectItem>
												<SelectItem
													value='preference'
													id={`tb2is5_${index}`}>
													Preferencia
												</SelectItem>
											</SelectContent>
										</Select>

										<Input
											placeholder='Descripción'
											value={note.text}
											onChange={(e) => handleNoteChange(index, 'text', e.target.value)}
											id={`hr1rcl_${index}`}
										/>
									</div>
								</div>
							))}
						</div>
					</div>

					<SheetFooter className='pt-4 border-t'>
						<SheetClose asChild>
							<Button
								variant='outline'
								className='mr-2'>
								<XIcon className='h-4 w-4 mr-2' />
								Cancelar
							</Button>
						</SheetClose>
						<Button onClick={handleSaveChanges}>
							<SaveIcon className='h-4 w-4 mr-2' />
							Guardar Cambios
						</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</Card>
	);
}
