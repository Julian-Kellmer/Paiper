'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchIcon, GiftIcon, UserIcon, TableIcon, ChevronRightIcon, CheckIcon, XIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { guest, table, drinks } from '@/types/types';

interface GiftServiceProps {
	isOpen: boolean;
	onClose: () => void;
}

export function GiftService({ isOpen, onClose }: GiftServiceProps) {
	const [step, setStep] = useState(1);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedGuest, setSelectedGuest] = useState<guest>();
	const [selectedTable, setSelectedTable] = useState<table>();
	const [selectedDrink, setSelectedDrink] = useState<drinks>();
	const [message, setMessage] = useState('');
	const [activeTab, setActiveTab] = useState('guests');

	// Mock data for guests
	const guests = [
		{
			id: 1,
			name: 'Carlos Ruiz',
			table: 'VIP 15',
			avatar: 'https://github.com/yusufhilmi.png',
			status: 'active' as const,
		},
		{
			id: 2,
			name: 'Ana Martinez',
			table: 'VIP 12',
			avatar: 'https://github.com/furkanksl.png',
			status: 'active' as const,
		},
		{
			id: 3,
			name: 'Miguel Sánchez',
			table: 'VIP 8',
			avatar: 'https://github.com/polymet-ai.png',
			status: 'active' as const,
		},
		{
			id: 4,
			name: 'Laura Gomez',
			table: 'VIP 5',
			avatar: 'https://github.com/furkanksl.png',
			status: 'active' as const,
		},
		{
			id: 5,
			name: 'Javier Rodriguez',
			table: 'VIP 3',
			avatar: 'https://github.com/yusufhilmi.png',
			status: 'active' as const,
		},
	];

	// Mock data for tables
	const tables = [
		{ id: 3, name: 'VIP 3', capacity: 6, status: 'occupied' as const },
		{ id: 5, name: 'VIP 5', capacity: 8, status: 'occupied' as const },
		{ id: 8, name: 'VIP 8', capacity: 10, status: 'occupied' as const },
		{ id: 12, name: 'VIP 12', capacity: 6, status: 'occupied' as const },
		{ id: 15, name: 'VIP 15', capacity: 8, status: 'occupied' as const },
	];

	// Mock data for drinks
	const drinks = [
		{
			id: 1,
			name: 'Champagne Dom Perignon',
			category: 'Champagne',
			price: '$350.00',
			image: 'https://images.unsplash.com/photo-1592483648228-b35146a4330c?q=80&w=100&auto=format&fit=crop',
			available: true,
		},
		{
			id: 2,
			name: 'Whisky Johnnie Walker Blue Label',
			category: 'Whisky',
			price: '$280.00',
			image: 'https://images.unsplash.com/photo-1527281400683-1aefee6bca6e?q=80&w=100&auto=format&fit=crop',
			available: true,
		},
		{
			id: 3,
			name: 'Vodka Grey Goose',
			category: 'Vodka',
			price: '$180.00',
			image: 'https://images.unsplash.com/photo-1608885898957-a07e10e20336?q=80&w=100&auto=format&fit=crop',
			available: true,
		},
		{
			id: 4,
			name: "Gin Hendrick's",
			category: 'Gin',
			price: '$150.00',
			image: 'https://images.unsplash.com/photo-1605989993024-a66f8da8d4e7?q=80&w=100&auto=format&fit=crop',
			available: true,
		},
		{
			id: 5,
			name: 'Tequila Don Julio 1942',
			category: 'Tequila',
			price: '$220.00',
			image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=100&auto=format&fit=crop',
			available: true,
		},
		{
			id: 6,
			name: 'Martini',
			category: 'Cocktail',
			price: '$18.00',
			image: 'https://images.unsplash.com/photo-1575023782549-62ca0d244b39?q=80&w=100&auto=format&fit=crop',
			available: true,
		},
		{
			id: 7,
			name: 'Mojito',
			category: 'Cocktail',
			price: '$15.00',
			image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=100&auto=format&fit=crop',
			available: true,
		},
		{
			id: 8,
			name: 'Margarita',
			category: 'Cocktail',
			price: '$16.00',
			image: 'https://images.unsplash.com/photo-1556855810-ac404aa91e85?q=80&w=100&auto=format&fit=crop',
			available: true,
		},
	];

	// Filter guests based on search query
	const filteredGuests = guests.filter((guest) => guest.name.toLowerCase().includes(searchQuery.toLowerCase()));

	// Filter tables based on search query
	const filteredTables = tables.filter((table) => table.name.toLowerCase().includes(searchQuery.toLowerCase()));

	// Filter drinks based on search query
	const filteredDrinks = drinks.filter((drink) => drink.name.toLowerCase().includes(searchQuery.toLowerCase()));

	const handleSelectGuest = (guest: guest) => {
		setSelectedGuest(guest);
		// Find the table object that matches the guest's table name
		const guestTable = tables.find((t) => t.name === guest.table);
		setSelectedTable(guestTable);
		setStep(2);
	};

	const handleSelectTable = (table: table) => {
		setSelectedTable(table);
		setSelectedGuest(undefined);
		setStep(2);
	};

	const handleSelectDrink = (drink: drinks) => {
		setSelectedDrink(drink);
		setStep(3);
	};

	const handleSendGift = () => {
		// In a real app, this would send the gift to the backend
		console.log('Sending gift:', {
			recipient: selectedGuest || { table: selectedTable },
			drink: selectedDrink,
			message,
		});
		setStep(4);
	};

	const handleReset = () => {
		setStep(1);
		setSearchQuery('');
		setSelectedGuest(undefined);
		setSelectedTable(undefined);
		setSelectedDrink(undefined);
		setMessage('');
		setActiveTab('guests');
	};

	const renderStepOne = () => (
		<div className='space-y-6'>
			<Tabs
				defaultValue='guests'
				value={activeTab}
				onValueChange={setActiveTab}
				className='w-full'>
				<TabsList className='grid w-full grid-cols-2 dark:bg-gray-800'>
					<TabsTrigger
						value='guests'
						className='dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300'>
						Invitados
					</TabsTrigger>
					<TabsTrigger
						value='tables'
						className='dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300'>
						Mesas
					</TabsTrigger>
				</TabsList>

				<div className='relative mt-4 mb-6'>
					<SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />

					<Input
						placeholder={activeTab === 'guests' ? 'Buscar invitado por nombre...' : 'Buscar mesa...'}
						className='pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<TabsContent
					value='guests'
					className='space-y-4 mt-2'>
					{filteredGuests.length > 0 ? (
						<div className='space-y-2'>
							{filteredGuests.map((guest) => (
								<div
									key={guest.id}
									className='flex items-center justify-between p-3 rounded-lg border dark:border-gray-700 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors'
									onClick={() => handleSelectGuest(guest)}
									id={`guest-item-${guest.id}`}>
									<div
										className='flex items-center space-x-3'
										id={`guest-info-${guest.id}`}>
										<Avatar id={`guest-avatar-${guest.id}`}>
											<AvatarImage
												src={guest.avatar}
												alt={guest.name}
												id={`avatar-img-${guest.id}`}
											/>

											<AvatarFallback id={`avatar-fallback-${guest.id}`}>{guest.name.charAt(0)}</AvatarFallback>
										</Avatar>
										<div id={`guest-details-${guest.id}`}>
											<p
												className='font-medium dark:text-white'
												id={`guest-name-${guest.id}`}>
												{guest.name}
											</p>
											<p
												className='text-sm text-muted-foreground dark:text-gray-400'
												id={`guest-table-${guest.id}`}>
												Mesa: {guest.table}
											</p>
										</div>
									</div>
									<ChevronRightIcon
										className='h-5 w-5 text-muted-foreground'
										id={`chevron-${guest.id}`}
									/>
								</div>
							))}
						</div>
					) : (
						<div className='text-center py-8'>
							<UserIcon className='h-12 w-12 mx-auto text-muted-foreground dark:text-gray-500 mb-2' />

							<p className='text-muted-foreground dark:text-gray-400'>No se encontraron invitados con ese nombre</p>
						</div>
					)}
				</TabsContent>

				<TabsContent
					value='tables'
					className='space-y-4 mt-2'>
					{filteredTables.length > 0 ? (
						<div className='space-y-2'>
							{filteredTables.map((table) => (
								<div
									key={table.id}
									className='flex items-center justify-between p-3 rounded-lg border dark:border-gray-700 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors'
									onClick={() => handleSelectTable(table)}
									id={`table-item-${table.id}`}>
									<div
										className='flex items-center space-x-3'
										id={`table-info-${table.id}`}>
										<div
											className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'
											id={`table-icon-${table.id}`}>
											<TableIcon
												className='h-5 w-5 text-primary'
												id={`table-icon-svg-${table.id}`}
											/>
										</div>
										<div id={`table-details-${table.id}`}>
											<p
												className='font-medium dark:text-white'
												id={`table-name-${table.id}`}>
												Mesa {table.name}
											</p>
											<p
												className='text-sm text-muted-foreground dark:text-gray-400'
												id={`table-capacity-${table.id}`}>
												Capacidad: {table.capacity} personas
											</p>
										</div>
									</div>
									<ChevronRightIcon
										className='h-5 w-5 text-muted-foreground'
										id={`table-chevron-${table.id}`}
									/>
								</div>
							))}
						</div>
					) : (
						<div className='text-center py-8'>
							<TableIcon className='h-12 w-12 mx-auto text-muted-foreground dark:text-gray-500 mb-2' />

							<p className='text-muted-foreground dark:text-gray-400'>No se encontraron mesas con ese nombre</p>
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);

	const renderStepTwo = () => (
		<div className='space-y-6'>
			<div className='bg-muted/30 p-4 rounded-lg dark:bg-gray-800/30'>
				<h3 className='font-medium mb-2 dark:text-white'>Destinatario seleccionado</h3>
				{selectedGuest ? (
					<div className='flex items-center space-x-3'>
						<Avatar>
							<AvatarImage
								src={selectedGuest.avatar}
								alt={selectedGuest.name}
							/>

							<AvatarFallback>{selectedGuest.name.charAt(0)}</AvatarFallback>
						</Avatar>
						<div>
							<p className='font-medium dark:text-white'>{selectedGuest.name}</p>
							<p className='text-sm text-muted-foreground dark:text-gray-400'>Mesa: {selectedGuest.table}</p>
						</div>
					</div>
				) : (
					<div className='flex items-center space-x-3'>
						<div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
							<TableIcon className='h-5 w-5 text-primary' />
						</div>
						<div>
							<p className='font-medium dark:text-white'>Mesa {selectedTable?.name || ''}</p>
						</div>
					</div>
				)}
			</div>

			<div className='space-y-4'>
				<div className='flex justify-between items-center'>
					<h3 className='font-medium dark:text-white'>Seleccionar bebida</h3>
					<div className='relative w-full max-w-xs'>
						<SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />

						<Input
							placeholder='Buscar bebida...'
							className='pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
					{filteredDrinks.map((drink) => (
						<div
							key={drink.id}
							className='flex items-center p-3 rounded-lg border dark:border-gray-700 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors'
							onClick={() => handleSelectDrink(drink)}
							id={`drink-item-${drink.id}`}>
							<div
								className='h-16 w-16 rounded-md overflow-hidden mr-3'
								id={`drink-image-container-${drink.id}`}>
								<img
									src={drink.image}
									alt={drink.name}
									className='h-full w-full object-cover'
									id={`drink-image-${drink.id}`}
								/>
							</div>
							<div
								className='flex-1'
								id={`drink-info-${drink.id}`}>
								<div
									className='flex justify-between items-start'
									id={`drink-header-${drink.id}`}>
									<p
										className='font-medium dark:text-white'
										id={`drink-name-${drink.id}`}>
										{drink.name}
									</p>
									<p
										className='font-bold text-primary'
										id={`drink-price-${drink.id}`}>
										{drink.price}
									</p>
								</div>
								<div
									className='flex items-center justify-between mt-1'
									id={`drink-footer-${drink.id}`}>
									<Badge
										variant='outline'
										className='bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
										id={`drink-category-${drink.id}`}>
										{drink.category}
									</Badge>
									{drink.available ? (
										<Badge
											className='bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
											id={`drink-status-${drink.id}`}>
											Disponible
										</Badge>
									) : (
										<Badge
											className='bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
											id={`drink-status-${drink.id}`}>
											Agotado
										</Badge>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);

	const renderStepThree = () => (
		<div className='space-y-6'>
			<div className='bg-muted/30 p-4 rounded-lg dark:bg-gray-800/30'>
				<h3 className='font-medium mb-4 dark:text-white'>Resumen del regalo</h3>

				<div className='space-y-4'>
					<div className='flex justify-between items-start'>
						<div className='space-y-1'>
							<p className='text-sm text-muted-foreground dark:text-gray-400'>Destinatario</p>
							{selectedGuest ? (
								<div className='flex items-center'>
									<Avatar className='h-6 w-6 mr-2'>
										<AvatarImage
											src={selectedGuest.avatar}
											alt={selectedGuest.name}
										/>

										<AvatarFallback>{selectedGuest.name.charAt(0)}</AvatarFallback>
									</Avatar>
									<p className='font-medium dark:text-white'>{selectedGuest.name}</p>
								</div>
							) : (
								<div className='flex items-center'>
									<TableIcon className='h-5 w-5 mr-2 text-primary' />

									<p className='font-medium dark:text-white'>Mesa {selectedTable?.name || ''}</p>
								</div>
							)}
						</div>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => setStep(1)}
							className='text-primary'>
							Cambiar
						</Button>
					</div>

					<Separator />

					<div className='flex justify-between items-start'>
						<div className='space-y-1'>
							<p className='text-sm text-muted-foreground dark:text-gray-400'>Bebida</p>
							<div className='flex items-center'>
								<div className='h-10 w-10 rounded-md overflow-hidden mr-2'>
									<img
										src={selectedDrink?.image}
										alt={selectedDrink?.name}
										className='h-full w-full object-cover'
									/>
								</div>
								<div>
									<p className='font-medium dark:text-white'>{selectedDrink?.name}</p>
									<p className='text-sm text-primary font-bold'>{selectedDrink?.price}</p>
								</div>
							</div>
						</div>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => setStep(2)}
							className='text-primary'>
							Cambiar
						</Button>
					</div>
				</div>
			</div>

			<div className='space-y-2'>
				<Label
					htmlFor='message'
					className='dark:text-gray-300'>
					Mensaje personalizado (opcional)
				</Label>
				<textarea
					placeholder='Escribe un mensaje para acompañar tu regalo...'
					className='w-full p-3 rounded-md border dark:border-gray-700 dark:bg-gray-800 dark:text-white min-h-[100px] resize-none'
					value={message}
					onChange={(e) => setMessage(e.target.value)}></textarea>
			</div>
		</div>
	);

	const renderStepFour = () => (
		<div className='text-center space-y-6 py-4'>
			<div className='h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto'>
				<CheckIcon className='h-10 w-10 text-green-600 dark:text-green-400' />
			</div>

			<div className='space-y-2'>
				<h3 className='text-xl font-bold dark:text-white'>¡Regalo enviado con éxito!</h3>
				<p className='text-muted-foreground dark:text-gray-400 max-w-md mx-auto'>
					{selectedGuest
						? `${selectedGuest.name} ha recibido una notificación con los detalles del regalo.`
						: `La Mesa ${selectedTable?.name || ''} ha recibido una notificación con los detalles del regalo.`}
				</p>
			</div>

			<div className='bg-muted/30 p-4 rounded-lg dark:bg-gray-800/30 max-w-md mx-auto text-left'>
				<div className='flex items-start space-x-3'>
					<GiftIcon className='h-5 w-5 text-primary mt-1' />

					<div className='space-y-2'>
						<p className='font-medium dark:text-white'>{selectedDrink?.name}</p>
						<p className='text-sm text-muted-foreground dark:text-gray-400'>Para: {selectedGuest ? selectedGuest.name : `Mesa ${selectedTable?.name || ''}`}</p>
						{message && <div className='bg-background dark:bg-gray-900 p-3 rounded-md text-sm italic'>"{message}"</div>}
					</div>
				</div>
			</div>

			<p className='text-sm text-muted-foreground dark:text-gray-400'>El personal del bar ha sido notificado y preparará la bebida para su entrega.</p>
		</div>
	);

	const renderStepContent = () => {
		switch (step) {
			case 1:
				return renderStepOne();
			case 2:
				return renderStepTwo();
			case 3:
				return renderStepThree();
			case 4:
				return renderStepFour();
			default:
				return null;
		}
	};

	const renderDialogTitle = () => {
		switch (step) {
			case 1:
				return 'Enviar regalo a invitado';
			case 2:
				return 'Seleccionar bebida';
			case 3:
				return 'Confirmar regalo';
			case 4:
				return 'Regalo enviado';
			default:
				return 'Enviar regalo';
		}
	};

	const renderDialogDescription = () => {
		switch (step) {
			case 1:
				return 'Selecciona un invitado o mesa para enviar un regalo';
			case 2:
				return 'Elige una bebida para enviar como regalo';
			case 3:
				return 'Revisa y confirma los detalles del regalo';
			case 4:
				return 'El regalo ha sido enviado exitosamente';
			default:
				return '';
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto dark:bg-gray-900 dark:border-gray-800'>
				<DialogHeader>
					<DialogTitle className='text-xl dark:text-white flex items-center'>
						<GiftIcon className='h-5 w-5 mr-2 text-primary' />

						{renderDialogTitle()}
					</DialogTitle>
					<DialogDescription className='dark:text-gray-400'>{renderDialogDescription()}</DialogDescription>
				</DialogHeader>

				{renderStepContent()}

				<DialogFooter className='flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 gap-2'>
					{step < 4 ? (
						<>
							<Button
								variant='outline'
								onClick={step === 1 ? onClose : () => setStep(step - 1)}
								className='dark:border-gray-700 dark:text-gray-300'>
								{step === 1 ? 'Cancelar' : 'Atrás'}
							</Button>
							<Button
								onClick={step === 3 ? handleSendGift : () => setStep(step + 1)}
								disabled={(step === 1 && !selectedGuest && !selectedTable) || (step === 2 && !selectedDrink)}
								className='bg-primary hover:bg-primary/90'>
								{step === 3 ? 'Enviar regalo' : 'Continuar'}
							</Button>
						</>
					) : (
						<>
							<Button
								variant='outline'
								onClick={handleReset}
								className='dark:border-gray-700 dark:text-gray-300'>
								Enviar otro regalo
							</Button>
							<Button
								onClick={onClose}
								className='bg-primary hover:bg-primary/90'>
								Finalizar
							</Button>
						</>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
