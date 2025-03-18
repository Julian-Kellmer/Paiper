'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { SearchIcon, FilterIcon, RefreshCwIcon, CalendarIcon, DownloadIcon, MapPinIcon, QrCodeIcon, ArrowUpDownIcon, BarChartIcon, UsersIcon, DollarSignIcon, ClockIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { QrPerformanceChart } from '(components)/qr-performance-chart';
import { QrUsersList } from '(components)/qr-users-list';
import { QrComparisonChart } from '(components)/qr-comparison-chart';

interface QrCode {
	id: string;
	name: string;
	location: string;
	orders: number;
	revenue: string;
	uniqueUsers: number;
	lastUsed: string;
	createdAt: string;
}

interface User {
	name: string;
	email: string;
	avatar: string;
}

interface QrPerformanceChartProps {
	qrId: string;
}

interface QrUsersListProps {
	qrId: string;
	onUserClick: (user: User) => void;
}

interface QrComparisonChartProps {
	qrId: string;
}

export default function QrTracking() {
	const [dateRange, setDateRange] = useState('month');
	const [sortField, setSortField] = useState('orders');
	const [sortDirection, setSortDirection] = useState('desc');
	const [selectedQr, setSelectedQr] = useState<QrCode | null>(null);
	const [isQrDetailsOpen, setIsQrDetailsOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [activeTab, setActiveTab] = useState('evolution');

	// Mock data for QR codes
	const qrCodes = [
		{
			id: 'QR001',
			name: 'Mesa 5',
			location: 'Salón Principal',
			orders: 145,
			revenue: '$2,850.75',
			uniqueUsers: 78,
			lastUsed: '2024-03-15 18:45',
			createdAt: '2023-10-15',
		},
		{
			id: 'QR002',
			name: 'Mesa 12',
			location: 'Terraza',
			orders: 98,
			revenue: '$1,750.25',
			uniqueUsers: 52,
			lastUsed: '2024-03-15 19:30',
			createdAt: '2023-10-15',
		},
		{
			id: 'QR003',
			name: 'Entrada Principal',
			location: 'Recepción',
			orders: 210,
			revenue: '$4,120.50',
			uniqueUsers: 185,
			lastUsed: '2024-03-15 20:15',
			createdAt: '2023-11-05',
		},
		{
			id: 'QR004',
			name: 'Cartel Publicitario',
			location: 'Avenida Principal',
			orders: 87,
			revenue: '$1,560.30',
			uniqueUsers: 80,
			lastUsed: '2024-03-14 15:20',
			createdAt: '2023-12-10',
		},
		{
			id: 'QR005',
			name: 'Mesa 8',
			location: 'Salón VIP',
			orders: 175,
			revenue: '$3,950.80',
			uniqueUsers: 65,
			lastUsed: '2024-03-15 21:10',
			createdAt: '2023-10-15',
		},
		{
			id: 'QR006',
			name: 'Folleto Promocional',
			location: 'Distribución Local',
			orders: 42,
			revenue: '$780.25',
			uniqueUsers: 38,
			lastUsed: '2024-03-13 12:45',
			createdAt: '2024-01-20',
		},
		{
			id: 'QR007',
			name: 'Mesa 3',
			location: 'Salón Principal',
			orders: 112,
			revenue: '$2,150.60',
			uniqueUsers: 60,
			lastUsed: '2024-03-15 17:30',
			createdAt: '2023-10-15',
		},
	];

	// Mock data for orders from a specific QR
	const qrOrders = [
		{
			id: 'ORD-2045',
			user: {
				name: 'Carlos Méndez',
				email: 'carlos@example.com',
				avatar: 'https://github.com/yusufhilmi.png',
			},
			items: ['Hamburguesa Clásica (2)', 'Papas Fritas Grande', 'Coca-Cola (2)'],

			total: '$45.50',
			date: '2024-03-15 18:45',
		},
		{
			id: 'ORD-2040',
			user: {
				name: 'Ana Rodríguez',
				email: 'ana@example.com',
				avatar: 'https://github.com/furkanksl.png',
			},
			items: ['Pizza Margherita', 'Ensalada César', 'Agua Mineral'],
			total: '$32.75',
			date: '2024-03-15 17:30',
		},
		{
			id: 'ORD-2035',
			user: {
				name: 'Miguel Sánchez',
				email: 'miguel@example.com',
				avatar: 'https://github.com/polymet-ai.png',
			},
			items: ['Pasta Alfredo', 'Pan de Ajo', 'Vino Tinto (Copa)'],
			total: '$28.90',
			date: '2024-03-15 16:15',
		},
		{
			id: 'ORD-2030',
			user: {
				name: 'Laura Martínez',
				email: 'laura@example.com',
				avatar: 'https://github.com/furkanksl.png',
			},
			items: ['Sushi Variado (12 piezas)', 'Edamame', 'Sake'],
			total: '$52.30',
			date: '2024-03-15 15:00',
		},
		{
			id: 'ORD-2025',
			user: {
				name: 'Pedro Gómez',
				email: 'pedro@example.com',
				avatar: 'https://github.com/yusufhilmi.png',
			},
			items: ['Tacos de Pollo (3)', 'Guacamole', 'Cerveza'],
			total: '$24.50',
			date: '2024-03-15 14:20',
		},
	];

	// Mock data for user details
	const userDetails = {
		name: 'Carlos Méndez',
		email: 'carlos@example.com',
		avatar: 'https://github.com/yusufhilmi.png',
		totalSpent: '$345.75',
		ordersCount: 12,
		lastOrder: '2024-03-15 18:45',
		frequentItems: ['Hamburguesa Clásica', 'Papas Fritas', 'Coca-Cola'],
		qrsUsed: ['Mesa 5', 'Mesa 8', 'Entrada Principal'],
		orderHistory: [
			{
				id: 'ORD-2045',
				date: '2024-03-15 18:45',
				total: '$45.50',
				items: ['Hamburguesa Clásica (2)', 'Papas Fritas Grande', 'Coca-Cola (2)'],
			},
			{
				id: 'ORD-2020',
				date: '2024-03-10 19:30',
				total: '$38.25',
				items: ['Pizza Pepperoni', 'Ensalada Mixta', 'Cerveza'],
			},
			{
				id: 'ORD-1995',
				date: '2024-03-05 20:15',
				total: '$42.00',
				items: ['Pasta Carbonara', 'Pan de Ajo', 'Vino Blanco (Copa)'],
			},
		],
	};

	// Function to handle sorting
	const handleSort = (field: string) => {
		if (sortField === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDirection('asc');
		}
	};

	// Function to get sorted QR codes
	const getSortedQrCodes = () => {
		let filteredCodes = qrCodes;

		if (searchQuery) {
			filteredCodes = qrCodes.filter((qr) => qr.name.toLowerCase().includes(searchQuery.toLowerCase()) || qr.location.toLowerCase().includes(searchQuery.toLowerCase()));
		}

		return filteredCodes.sort((a, b) => {
			let valueA, valueB;

			switch (sortField) {
				case 'name':
					valueA = a.name.toLowerCase();
					valueB = b.name.toLowerCase();
					break;
				case 'orders':
					valueA = a.orders;
					valueB = b.orders;
					break;
				case 'revenue':
					try {
						valueA = parseFloat(a.revenue.replace('$', '').replace(',', ''));
						valueB = parseFloat(b.revenue.replace('$', '').replace(',', ''));
						if (isNaN(valueA) || isNaN(valueB)) throw new Error('Invalid revenue format');
					} catch (e) {
						console.error('Error parsing revenue:', e);
						return 0;
					}
					break;
				case 'uniqueUsers':
					valueA = a.uniqueUsers;
					valueB = b.uniqueUsers;
					break;
				case 'lastUsed':
					valueA = new Date(a.lastUsed);
					valueB = new Date(b.lastUsed);
					break;
				default:
					valueA = a[sortField as keyof typeof a];
					valueB = b[sortField as keyof typeof b];
			}

			if (valueA < valueB) {
				return sortDirection === 'asc' ? -1 : 1;
			}
			if (valueA > valueB) {
				return sortDirection === 'asc' ? 1 : -1;
			}
			return 0;
		});
	};

	// Memoize sorted QR codes to prevent unnecessary re-sorting
	const sortedQrCodes = useMemo(() => getSortedQrCodes(), [qrCodes, sortField, sortDirection, searchQuery]);

	const handleQrClick = (qr: QrCode) => {
		setSelectedQr(qr);
		setIsQrDetailsOpen(true);
	};

	const handleUserClick = (user: User) => {
		setSelectedUser(user);
		setIsUserDetailsOpen(true);
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-2xl font-bold dark:text-white'>Tracking de QRs</h1>
					<p className='text-muted-foreground dark:text-gray-400'>Análisis de rendimiento de códigos QR y su impacto en ventas</p>
				</div>
			</div>

			{/* Filter and Actions Section */}
			<div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
				<div className='relative w-full md:w-96'>
					<SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />

					<Input
						placeholder='Buscar QR por nombre o ubicación...'
						className='pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<div className='flex flex-wrap gap-2'>
					<Select
						value={dateRange}
						onValueChange={setDateRange}>
						<SelectTrigger className='w-[180px] dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
							<CalendarIcon className='h-4 w-4 mr-2 text-muted-foreground' />

							<SelectValue placeholder='Rango de fechas' />
						</SelectTrigger>
						<SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
							<SelectItem value='week'>Última semana</SelectItem>
							<SelectItem value='month'>Último mes</SelectItem>
							<SelectItem value='quarter'>Último trimestre</SelectItem>
							<SelectItem value='year'>Último año</SelectItem>
							<SelectItem value='custom'>Personalizado</SelectItem>
						</SelectContent>
					</Select>

					<Button
						variant='outline'
						className='dark:border-gray-700 dark:text-gray-300'>
						<FilterIcon className='h-4 w-4 mr-2' />
						Filtrar
					</Button>

					<Button
						variant='outline'
						className='dark:border-gray-700 dark:text-gray-300'>
						<RefreshCwIcon className='h-4 w-4 mr-2' />
						Actualizar
					</Button>

					<Button
						variant='outline'
						className='dark:border-gray-700 dark:text-gray-300'>
						<DownloadIcon className='h-4 w-4 mr-2' />
						Exportar
					</Button>
				</div>
			</div>

			{/* QR Codes Summary Cards */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<Card className='dark:bg-gray-900 dark:border-gray-800'>
					<CardContent className='p-6 flex items-center justify-between'>
						<div className='space-y-1'>
							<p className='text-sm text-muted-foreground dark:text-gray-400'>Total de Pedidos vía QR</p>
							<p className='text-2xl font-bold dark:text-white'>869</p>
							<p className='text-xs text-green-500'>+12.5% vs mes anterior</p>
						</div>
						<div className='p-3 rounded-full bg-blue-100 dark:bg-blue-900/20'>
							<QrCodeIcon className='h-6 w-6 text-blue-500' />
						</div>
					</CardContent>
				</Card>

				<Card className='dark:bg-gray-900 dark:border-gray-800'>
					<CardContent className='p-6 flex items-center justify-between'>
						<div className='space-y-1'>
							<p className='text-sm text-muted-foreground dark:text-gray-400'>Ingresos Totales vía QR</p>
							<p className='text-2xl font-bold dark:text-white'>$17,162.45</p>
							<p className='text-xs text-green-500'>+8.3% vs mes anterior</p>
						</div>
						<div className='p-3 rounded-full bg-green-100 dark:bg-green-900/20'>
							<DollarSignIcon className='h-6 w-6 text-green-500' />
						</div>
					</CardContent>
				</Card>

				<Card className='dark:bg-gray-900 dark:border-gray-800'>
					<CardContent className='p-6 flex items-center justify-between'>
						<div className='space-y-1'>
							<p className='text-sm text-muted-foreground dark:text-gray-400'>Usuarios Únicos vía QR</p>
							<p className='text-2xl font-bold dark:text-white'>558</p>
							<p className='text-xs text-green-500'>+15.2% vs mes anterior</p>
						</div>
						<div className='p-3 rounded-full bg-purple-100 dark:bg-purple-900/20'>
							<UsersIcon className='h-6 w-6 text-purple-500' />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* QR Codes Table */}
			<Card className='dark:bg-gray-900 dark:border-gray-800'>
				<CardContent className='p-0'>
					<Table>
						<TableHeader className='bg-muted/50 dark:bg-gray-800'>
							<TableRow>
								<TableHead
									className='font-medium cursor-pointer'
									onClick={() => handleSort('name')}>
									<div className='flex items-center'>
										Nombre/Ubicación
										{sortField === 'name' && <ArrowUpDownIcon className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />}
									</div>
								</TableHead>
								<TableHead
									className='font-medium cursor-pointer text-right'
									onClick={() => handleSort('orders')}>
									<div className='flex items-center justify-end'>
										Pedidos
										{sortField === 'orders' && <ArrowUpDownIcon className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />}
									</div>
								</TableHead>
								<TableHead
									className='font-medium cursor-pointer text-right'
									onClick={() => handleSort('revenue')}>
									<div className='flex items-center justify-end'>
										Ingresos
										{sortField === 'revenue' && <ArrowUpDownIcon className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />}
									</div>
								</TableHead>
								<TableHead
									className='font-medium cursor-pointer text-right'
									onClick={() => handleSort('uniqueUsers')}>
									<div className='flex items-center justify-end'>
										Usuarios Únicos
										{sortField === 'uniqueUsers' && <ArrowUpDownIcon className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />}
									</div>
								</TableHead>
								<TableHead
									className='font-medium cursor-pointer'
									onClick={() => handleSort('lastUsed')}>
									<div className='flex items-center'>
										Último Uso
										{sortField === 'lastUsed' && <ArrowUpDownIcon className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />}
									</div>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortedQrCodes.map((qr) => (
								<TableRow
									key={qr.id}
									className='cursor-pointer hover:bg-muted/50 dark:hover:bg-gray-800/50'
									onClick={() => handleQrClick(qr)}
									id={`qr-row-${qr.id}`}>
									<TableCell id={`qr-name-${qr.id}`}>
										<div
											className='flex items-center space-x-3'
											id={`qr-name-content-${qr.id}`}>
											<div
												className='p-2 rounded-md bg-blue-100 dark:bg-blue-900/20'
												id={`qr-icon-bg-${qr.id}`}>
												<QrCodeIcon
													className='h-5 w-5 text-blue-500'
													id={`qr-icon-${qr.id}`}
												/>
											</div>
											<div id={`qr-details-${qr.id}`}>
												<p
													className='font-medium dark:text-white'
													id={`qr-name-text-${qr.id}`}>
													{qr.name}
												</p>
												<p
													className='text-xs text-muted-foreground dark:text-gray-400'
													id={`qr-location-${qr.id}`}>
													<MapPinIcon
														className='h-3 w-3 inline mr-1'
														id={`qr-location-icon-${qr.id}`}
													/>

													{qr.location}
												</p>
											</div>
										</div>
									</TableCell>
									<TableCell
										className='text-right font-medium dark:text-white'
										id={`qr-orders-${qr.id}`}>
										{qr.orders}
									</TableCell>
									<TableCell
										className='text-right font-medium dark:text-white'
										id={`qr-revenue-${qr.id}`}>
										{qr.revenue}
									</TableCell>
									<TableCell
										className='text-right font-medium dark:text-white'
										id={`qr-users-${qr.id}`}>
										{qr.uniqueUsers}
									</TableCell>
									<TableCell id={`qr-last-used-${qr.id}`}>
										<div
											className='flex items-center'
											id={`qr-last-used-content-${qr.id}`}>
											<ClockIcon
												className='h-4 w-4 mr-2 text-muted-foreground'
												id={`qr-last-used-icon-${qr.id}`}
											/>

											<span
												className='dark:text-white'
												id={`qr-last-used-text-${qr.id}`}>
												{new Date(qr.lastUsed).toLocaleString('es-ES', {
													day: '2-digit',
													month: '2-digit',
													year: 'numeric',
													hour: '2-digit',
													minute: '2-digit',
												})}
											</span>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* QR Details Dialog */}
			<Dialog
				open={isQrDetailsOpen}
				onOpenChange={setIsQrDetailsOpen}>
				<DialogContent className='sm:max-w-[900px] max-h-[90vh] overflow-y-auto dark:bg-gray-900 dark:border-gray-800'>
					{isLoading ? (
						<div className='flex items-center justify-center p-8'>
							<span className='loading-spinner'>Loading...</span>
						</div>
					) : selectedQr ? (
						<>
							<DialogHeader>
								<DialogTitle className='text-xl flex items-center dark:text-white'>
									<QrCodeIcon className='h-5 w-5 mr-2 text-blue-500' />

									{selectedQr.name || ''}
								</DialogTitle>
								<DialogDescription>
									<div className='flex items-center text-muted-foreground dark:text-gray-400'>
										<MapPinIcon className='h-4 w-4 mr-1' />

										{selectedQr.location || ''}
									</div>
								</DialogDescription>
							</DialogHeader>

							<div className='space-y-6 my-4'>
								{/* QR Summary */}
								<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
									<div className='space-y-1'>
										<p className='text-sm text-muted-foreground dark:text-gray-400'>Fecha de Creación</p>
										<p className='font-medium dark:text-white'>{new Date(selectedQr.createdAt).toLocaleDateString('es-ES')}</p>
									</div>
									<div className='space-y-1'>
										<p className='text-sm text-muted-foreground dark:text-gray-400'>Total de Pedidos</p>
										<p className='font-medium dark:text-white'>{selectedQr.orders}</p>
									</div>
									<div className='space-y-1'>
										<p className='text-sm text-muted-foreground dark:text-gray-400'>Ingresos Totales</p>
										<p className='font-medium dark:text-white'>{selectedQr.revenue}</p>
									</div>
									<div className='space-y-1'>
										<p className='text-sm text-muted-foreground dark:text-gray-400'>Usuarios Únicos</p>
										<p className='font-medium dark:text-white'>{selectedQr.uniqueUsers}</p>
									</div>
								</div>

								<Separator className='dark:bg-gray-800' />

								{/* QR Performance Charts */}
								<div>
									<Tabs
										defaultValue='evolution'
										className='w-full'
										onValueChange={setActiveTab}
										value={activeTab}>
										<TabsList className='mb-4 dark:bg-gray-800'>
											<TabsTrigger
												value='evolution'
												className='dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300'>
												Evolución de Pedidos
											</TabsTrigger>
											<TabsTrigger
												value='users'
												className='dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300'>
												Top Usuarios
											</TabsTrigger>
											<TabsTrigger
												value='comparison'
												className='dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300'>
												Comparación
											</TabsTrigger>
										</TabsList>

										<div className='h-[300px]'>
											{activeTab === 'evolution' && <QrPerformanceChart qrId={selectedQr.id} />}

											{activeTab === 'users' && (
												<QrUsersList
													qrId={selectedQr.id}
													onUserClick={handleUserClick}
												/>
											)}

											{activeTab === 'comparison' && <QrComparisonChart qrId={selectedQr.id} />}
										</div>
									</Tabs>
								</div>

								<Separator className='dark:bg-gray-800' />

								{/* QR Orders List */}
								<div>
									<h3 className='text-lg font-medium mb-4 dark:text-white'>Pedidos Realizados</h3>
									<div className='space-y-4'>
										{qrOrders.map((order) => (
											<div
												key={order.id}
												className='flex items-start p-4 rounded-lg border dark:border-gray-800 hover:bg-muted/50 dark:hover:bg-gray-800/50 cursor-pointer'
												onClick={() => handleUserClick(order.user)}
												id={`qr-order-${order.id}`}>
												<Avatar
													className='h-10 w-10 mr-4'
													id={`qr-order-avatar-${order.id}`}>
													<AvatarImage
														src={order.user.avatar}
														alt={order.user.name}
														id={`qr-order-avatar-img-${order.id}`}
													/>

													<AvatarFallback id={`qr-order-avatar-fallback-${order.id}`}>{order.user.name.charAt(0)}</AvatarFallback>
												</Avatar>
												<div
													className='flex-1'
													id={`qr-order-details-${order.id}`}>
													<div
														className='flex justify-between items-start'
														id={`qr-order-header-${order.id}`}>
														<div id={`qr-order-user-${order.id}`}>
															<p
																className='font-medium dark:text-white'
																id={`qr-order-user-name-${order.id}`}>
																{order.user.name}
															</p>
															<p
																className='text-xs text-muted-foreground dark:text-gray-400'
																id={`qr-order-user-email-${order.id}`}>
																{order.user.email}
															</p>
														</div>
														<div
															className='text-right'
															id={`qr-order-info-${order.id}`}>
															<p
																className='font-medium dark:text-white'
																id={`qr-order-id-${order.id}`}>
																{order.id}
															</p>
															<p
																className='text-xs text-muted-foreground dark:text-gray-400'
																id={`qr-order-date-${order.id}`}>
																{new Date(order.date).toLocaleString('es-ES', {
																	day: '2-digit',
																	month: '2-digit',
																	year: 'numeric',
																	hour: '2-digit',
																	minute: '2-digit',
																})}
															</p>
														</div>
													</div>
													<div
														className='mt-2'
														id={`qr-order-items-${order.id}`}>
														<p
															className='text-sm dark:text-gray-300'
															id={`qr-order-items-list-${order.id}`}>
															{order.items.join(', ')}
														</p>
													</div>
													<div
														className='mt-2 flex justify-between items-center'
														id={`qr-order-footer-${order.id}`}>
														<Badge
															className='bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
															id={`qr-order-status-${order.id}`}>
															Completado
														</Badge>
														<p
															className='font-bold dark:text-white'
															id={`qr-order-total-${order.id}`}>
															{order.total}
														</p>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>

							<DialogFooter>
								<Button
									variant='outline'
									className='dark:border-gray-700 dark:text-gray-300'
									onClick={() => setIsQrDetailsOpen(false)}>
									Cerrar
								</Button>
								<Button className='bg-blue-600 hover:bg-blue-700'>
									<QrCodeIcon className='h-4 w-4 mr-2' />
									Generar Nuevo QR
								</Button>
							</DialogFooter>
						</>
					) : null}
				</DialogContent>
			</Dialog>

			{/* User Details Dialog */}
			<Dialog
				open={isUserDetailsOpen}
				onOpenChange={setIsUserDetailsOpen}>
				<DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto dark:bg-gray-900 dark:border-gray-800'>
					{selectedUser && (
						<>
							<DialogHeader>
								<DialogTitle className='text-xl flex items-center dark:text-white'>Detalles del Usuario</DialogTitle>
							</DialogHeader>

							<div className='space-y-6 my-4'>
								{/* User Info */}
								<div className='flex items-center space-x-4'>
									<Avatar className='h-16 w-16'>
										<AvatarImage
											src={userDetails.avatar}
											alt={userDetails.name}
										/>

										<AvatarFallback>{userDetails.name.charAt(0)}</AvatarFallback>
									</Avatar>
									<div>
										<h3 className='text-lg font-medium dark:text-white'>{userDetails.name}</h3>
										<p className='text-sm text-muted-foreground dark:text-gray-400'>{userDetails.email}</p>
										<div className='flex items-center mt-1'>
											<Badge
												variant='outline'
												className='mr-2 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'>
												{userDetails.ordersCount} Pedidos
											</Badge>
											<Badge
												variant='outline'
												className='bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'>
												{userDetails.totalSpent} Gastados
											</Badge>
										</div>
									</div>
								</div>

								<Separator className='dark:bg-gray-800' />

								{/* User QRs Used */}
								<div>
									<h3 className='text-md font-medium mb-2 dark:text-white'>QRs Utilizados</h3>
									<div className='flex flex-wrap gap-2'>
										{userDetails.qrsUsed.map((qr, index) => (
											<Badge
												key={index}
												variant='outline'
												className='bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
												id={`user-qr-${index}`}>
												<QrCodeIcon
													className='h-3 w-3 mr-1'
													id={`user-qr-icon-${index}`}
												/>

												{qr}
											</Badge>
										))}
									</div>
								</div>

								{/* User Frequent Items */}
								<div>
									<h3 className='text-md font-medium mb-2 dark:text-white'>Productos Frecuentes</h3>
									<div className='flex flex-wrap gap-2'>
										{userDetails.frequentItems.map((item, index) => (
											<Badge
												key={index}
												variant='outline'
												className='bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
												id={`user-item-${index}`}>
												{item}
											</Badge>
										))}
									</div>
								</div>

								<Separator className='dark:bg-gray-800' />

								{/* User Order History */}
								<div>
									<h3 className='text-md font-medium mb-3 dark:text-white'>Historial de Pedidos</h3>
									<div className='space-y-3'>
										{userDetails.orderHistory.map((order, index) => (
											<div
												key={index}
												className='p-3 border rounded-lg dark:border-gray-800'
												id={`user-order-${index}`}>
												<div
													className='flex justify-between items-center mb-2'
													id={`user-order-header-${index}`}>
													<p
														className='font-medium dark:text-white'
														id={`user-order-id-${index}`}>
														{order.id}
													</p>
													<p
														className='text-sm text-muted-foreground dark:text-gray-400'
														id={`user-order-date-${index}`}>
														{new Date(order.date).toLocaleString('es-ES', {
															day: '2-digit',
															month: '2-digit',
															year: 'numeric',
															hour: '2-digit',
															minute: '2-digit',
														})}
													</p>
												</div>
												<p
													className='text-sm dark:text-gray-300 mb-2'
													id={`user-order-items-${index}`}>
													{order.items.join(', ')}
												</p>
												<div
													className='flex justify-end'
													id={`user-order-total-${index}`}>
													<p
														className='font-bold dark:text-white'
														id={`user-order-total-value-${index}`}>
														{order.total}
													</p>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>

							<DialogFooter>
								<Button
									variant='outline'
									className='dark:border-gray-700 dark:text-gray-300 mr-2'
									onClick={() => setIsUserDetailsOpen(false)}>
									Cerrar
								</Button>
								<Button className='bg-purple-600 hover:bg-purple-700'>Enviar Promoción</Button>
							</DialogFooter>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
