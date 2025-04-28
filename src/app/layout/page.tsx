'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '(components)/sidebar';
import { SunIcon, MoonIcon, BellIcon, XIcon, PlusCircleIcon, PlusIcon, QrCodeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose, SheetFooter } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BalanceForm } from '(components)/balance-form';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import BalanceRechargeForm from '(components)/balance-recharge-form';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/app/(components)/ProtectedRoute';

interface LayoutProps {
	children: React.ReactNode;
	currentPage: string;
	setCurrentPage: (page: string) => void;
	onNewOrderClick?: () => void;
}

export default function Layout({ children, currentPage, setCurrentPage, onNewOrderClick }: LayoutProps) {
	const [isDarkMode, setIsDarkMode] = useState(true);
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [isBalanceFormOpen, setIsBalanceFormOpen] = useState(false);

	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode);
		document.documentElement.classList.toggle('dark');
	};

	const getPageTitle = () => {
		switch (currentPage) {
			case 'dashboard':
				return 'Home';
			case 'orders':
				return 'Gestión de Pedidos';
			case 'finances':
				return 'Panel de Finanzas';
			case 'roles':
				return 'Administración de Roles';
			case 'menu':
				return 'Gestión de Carta';
			case 'new-order':
				return 'Nueva Orden';
			case 'qr-tracking':
				return 'Tracking de QRs';
			default:
				return 'Home';
		}
	};

	// Handle New Order button click
	const handleNewOrderClick = () => {
		if (onNewOrderClick) {
			onNewOrderClick();
		} else {
			setCurrentPage('new-order');
		}
	};

	// Mock notifications data
	const notifications = [
		{
			id: 1,
			title: 'Nuevo pedido recibido',
			description: 'Mesa 12 ha realizado un nuevo pedido',
			time: 'Hace 5 minutos',
			read: false,
			type: 'order',
		},
		{
			id: 2,
			title: 'Pedido listo para servir',
			description: 'El pedido #45891 está listo para ser servido',
			time: 'Hace 10 minutos',
			read: true,
			type: 'ready',
		},
		{
			id: 3,
			title: 'Stock bajo',
			description: "El producto 'Pizza Margherita' está por agotarse",
			time: 'Hace 1 hora',
			read: false,
			type: 'stock',
		},
		{
			id: 4,
			title: 'Nueva reseña recibida',
			description: 'Un cliente ha dejado una reseña de 5 estrellas',
			time: 'Hace 2 horas',
			read: true,
			type: 'review',
		},
		{
			id: 5,
			title: 'Actualización del sistema',
			description: 'El sistema se actualizará esta noche a las 2:00 AM',
			time: 'Hace 3 horas',
			read: true,
			type: 'system',
		},
	];

	// Set light mode by default
	React.useEffect(() => {
		document.documentElement.classList.add('light');
	}, []);

	// Don't show the standard layout for the new order page
	if (currentPage === 'new-order') {
		return (
			<>
				{children}
				<Dialog
					open={isBalanceFormOpen}
					onOpenChange={setIsBalanceFormOpen}>
					<DialogContent className='sm:max-w-md dark:bg-gray-900 dark:border-gray-800'>
						<BalanceForm onClose={() => setIsBalanceFormOpen(false)} />
					</DialogContent>
				</Dialog>
				{/* <Button
					className='fixed bottom-6 left-6 bg-green-600 hover:bg-green-700 rounded-full shadow-lg'
					size='lg'
					onClick={() => setIsBalanceFormOpen(true)}>
					<PlusCircleIcon className='h-6 w-6 mr-2' />
					Cargar Saldo
				</Button> */}
			</>
		);
	}

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'order':
				return (
					<div className='p-2 rounded-full bg-blue-100 dark:bg-blue-900/20'>
						<BellIcon className='h-4 w-4 text-blue-500' />
					</div>
				);

			case 'ready':
				return (
					<div className='p-2 rounded-full bg-green-100 dark:bg-green-900/20'>
						<BellIcon className='h-4 w-4 text-green-500' />
					</div>
				);

			case 'stock':
				return (
					<div className='p-2 rounded-full bg-orange-100 dark:bg-orange-900/20'>
						<BellIcon className='h-4 w-4 text-orange-500' />
					</div>
				);

			case 'review':
				return (
					<div className='p-2 rounded-full bg-purple-100 dark:bg-purple-900/20'>
						<BellIcon className='h-4 w-4 text-purple-500' />
					</div>
				);

			default:
				return (
					<div className='p-2 rounded-full bg-gray-100 dark:bg-gray-800'>
						<BellIcon className='h-4 w-4 text-gray-500 dark:text-gray-400' />
					</div>
				);
		}
	};
	const { user, signOut } = useAuth();
	return (
		<ProtectedRoute allowedRoles={['admin']}>
			<div className='flex h-screen bg-background dark:bg-gray-950'>
				<Sidebar
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
				/>

				<div className='flex flex-col flex-1 overflow-hidden'>
					<header className='flex items-center justify-between px-6 py-4 border-b dark:border-gray-800'>
						<div className='flex items-center'>
							<h1 className='text-xl font-semibold dark:text-white'>{getPageTitle()}</h1>
							<div className='ml-4 flex items-center'>
								<span className='h-2 w-2 rounded-full bg-green-500 mr-2'></span>
								<span className='text-sm text-muted-foreground dark:text-gray-400'>En línea</span>
							</div>
						</div>

						<div className='flex items-center space-x-4'>
							<Button
								className='bg-green-600 hover:bg-green-700 flex items-center'
								onClick={handleNewOrderClick}>
								<PlusIcon className='mr-2 h-4 w-4' />
								New Order
							</Button>
							<Button
								variant='ghost'
								size='icon'
								onClick={toggleTheme}
								className='dark:text-gray-300 dark:hover:bg-gray-800'>
								<span className='sr-only'>Toggle theme</span>
								{isDarkMode ? <SunIcon className='h-5 w-5' /> : <MoonIcon className='h-5 w-5' />}
							</Button>
							<Button
								variant='ghost'
								size='icon'
								className='dark:text-gray-300 dark:hover:bg-gray-800 relative'
								onClick={() => setIsNotificationsOpen(true)}>
								<BellIcon className='h-5 w-5' />
								<span className='sr-only'>Notifications</span>
								<Badge className='absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center'>3</Badge>
							</Button>
							<span className='text-sm font-medium dark:text-gray-300'>ES</span>
						</div>
					</header>

					<main className='flex-1 overflow-y-auto p-6 dark:bg-gray-950'>{children}</main>
				</div>

				{/* Notifications Sidebar Modal */}
				<Sheet
					open={isNotificationsOpen}
					onOpenChange={setIsNotificationsOpen}>
					<SheetContent
						className='sm:max-w-md overflow-y-auto'
						side='right'>
						<SheetHeader className='pb-4'>
							<SheetTitle className='flex justify-between items-center'>
								<span>Notificaciones</span>
								<Badge
									variant='outline'
									className='rounded-full'>
									{notifications.filter((n) => !n.read).length} nuevas
								</Badge>
							</SheetTitle>
							<SheetDescription>Recibe actualizaciones sobre pedidos, inventario y sistema</SheetDescription>
						</SheetHeader>

						<div className='py-6 space-y-6'>
							{/* Today's notifications */}
							<div className='space-y-4'>
								<h3 className='text-sm font-medium text-muted-foreground'>Hoy</h3>
								<div className='space-y-4'>
									{notifications.slice(0, 3).map((notification, index) => (
										<div
											key={notification.id}
											className={`flex gap-4 p-3 rounded-lg ${notification.read ? 'opacity-70' : 'bg-muted/40 dark:bg-gray-800/40'}`}
											id={`lx2qv6_${index}`}>
											{getNotificationIcon(notification.type)}
											<div
												className='flex-1'
												id={`jxcy5e_${index}`}>
												<div
													className='flex justify-between items-start'
													id={`h0jg1x_${index}`}>
													<h4
														className='text-sm font-medium'
														id={`5vbva1_${index}`}>
														{notification.title}
													</h4>
													<span
														className='text-xs text-muted-foreground'
														id={`uvwht3_${index}`}>
														{notification.time}
													</span>
												</div>
												<p
													className='text-sm text-muted-foreground mt-1'
													id={`nvd3tt_${index}`}>
													{notification.description}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>

							<Separator />

							{/* Earlier notifications */}
							<div className='space-y-4'>
								<h3 className='text-sm font-medium text-muted-foreground'>Anteriores</h3>
								<div className='space-y-4'>
									{notifications.slice(3).map((notification, index) => (
										<div
											key={notification.id}
											className={`flex gap-4 p-3 rounded-lg ${notification.read ? 'opacity-70' : 'bg-muted/40 dark:bg-gray-800/40'}`}
											id={`ae754j_${index}`}>
											{getNotificationIcon(notification.type)}
											<div
												className='flex-1'
												id={`pees62_${index}`}>
												<div
													className='flex justify-between items-start'
													id={`duhhz4_${index}`}>
													<h4
														className='text-sm font-medium'
														id={`zou2lb_${index}`}>
														{notification.title}
													</h4>
													<span
														className='text-xs text-muted-foreground'
														id={`7se52g_${index}`}>
														{notification.time}
													</span>
												</div>
												<p
													className='text-sm text-muted-foreground mt-1'
													id={`zip0y3_${index}`}>
													{notification.description}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						<div className='flex justify-between items-center pt-4 border-t dark:border-gray-700'>
							<Button
								variant='outline'
								size='sm'>
								Marcar todas como leídas
							</Button>
							<SheetClose asChild>
								<Button
									variant='outline'
									size='sm'>
									<XIcon className='h-4 w-4 mr-2' />
									Cerrar
								</Button>
							</SheetClose>
						</div>
					</SheetContent>
				</Sheet>

				{/* Balance Form Dialog */}
				<Dialog
					open={isBalanceFormOpen}
					onOpenChange={setIsBalanceFormOpen}>
					<DialogContent className='sm:max-w-md dark:bg-gray-900 dark:border-gray-800'>
						<BalanceRechargeForm />
					</DialogContent>
				</Dialog>

				{/* Fixed Button for Balance Form */}
				<div>
					<Button
						className='fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 rounded-full shadow-lg'
						size='lg'
						onClick={() => setIsBalanceFormOpen(true)}>
						<PlusCircleIcon className='h-6 w-6 mr-2' />
						Cargar Saldo
					</Button>
				</div>
			</div>
		</ProtectedRoute>
	);
}
