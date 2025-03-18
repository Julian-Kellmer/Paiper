'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
	PencilIcon,
	TrashIcon,
	PlusIcon,
	ChevronUpIcon,
	ChevronDownIcon,
	SaveIcon,
	XIcon,
	CreditCardIcon,
	DollarSignIcon,
	CalendarIcon,
	UserIcon,
	MailIcon,
	PhoneIcon,
	HomeIcon,
	GiftIcon,
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { GiftService } from '(components)/gift-service';

interface Transaction {
	id: string;
	// other properties...
}

export default function RoleManagement() {
	const [activeTab, setActiveTab] = useState('clientes');
	const [sortDirection, setSortDirection] = useState('asc');
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [activeProfileTab, setActiveProfileTab] = useState('profile');
	const [isGiftServiceOpen, setIsGiftServiceOpen] = useState(false);

	// Mock data for users
	const users = [
		{
			id: 1,
			name: 'Alex Johnson',
			email: 'alex@example.com',
			avatar: 'https://github.com/yusufhilmi.png',
			type: 'Cliente',
			status: 'active',
			balance: 'S/ 1,500.00',
			spent: 'S/ 500.00',
			phone: '+51 987 654 321',
			address: 'Av. Principal 123, Lima',
			joinDate: '15/03/2022',
			transactions: [
				{
					id: 'TRX-001',
					date: '2023-12-15',
					amount: 'S/ 120.00',
					type: 'Compra',
					status: 'Completada',
					method: 'Tarjeta',
				},
				{
					id: 'TRX-002',
					date: '2023-12-10',
					amount: 'S/ 85.50',
					type: 'Compra',
					status: 'Completada',
					method: 'Efectivo',
				},
				{
					id: 'TRX-003',
					date: '2023-11-28',
					amount: 'S/ 200.00',
					type: 'Recarga',
					status: 'Completada',
					method: 'Transferencia',
				},
				{
					id: 'TRX-004',
					date: '2023-11-15',
					amount: 'S/ 95.00',
					type: 'Compra',
					status: 'Completada',
					method: 'Saldo',
				},
			],
		},
		{
			id: 2,
			name: 'María García',
			email: 'maria@example.com',
			avatar: 'https://github.com/furkanksl.png',
			type: 'Equipo',
			status: 'active',
			balance: '',
			spent: '',
			phone: '+51 912 345 678',
			address: 'Calle Secundaria 456, Lima',
			joinDate: '20/05/2022',
			transactions: [],
		},
		{
			id: 3,
			name: 'Carlos Rodríguez',
			email: 'carlos@example.com',
			avatar: 'https://github.com/polymet-ai.png',
			type: 'Cliente VIP',
			status: 'active',
			balance: 'S/ 3,200.00',
			spent: 'S/ 1,800.00',
			phone: '+51 945 678 123',
			address: 'Jr. Los Pinos 789, Lima',
			joinDate: '10/01/2022',
			transactions: [
				{
					id: 'TRX-005',
					date: '2023-12-18',
					amount: 'S/ 350.00',
					type: 'Compra',
					status: 'Completada',
					method: 'Tarjeta',
				},
				{
					id: 'TRX-006',
					date: '2023-12-05',
					amount: 'S/ 500.00',
					type: 'Recarga',
					status: 'Completada',
					method: 'Transferencia',
				},
			],
		},
		{
			id: 4,
			name: 'Laura Martínez',
			email: 'laura@example.com',
			avatar: 'https://github.com/furkanksl.png',
			type: 'Equipo Publicas',
			status: 'inactive',
			balance: '',
			spent: '',
			phone: '+51 923 456 789',
			address: 'Av. Los Álamos 234, Lima',
			joinDate: '05/08/2022',
			transactions: [],
		},
		{
			id: 5,
			name: 'Pedro Sánchez',
			email: 'pedro@example.com',
			avatar: 'https://github.com/yusufhilmi.png',
			type: 'Cliente',
			status: 'active',
			balance: 'S/ 750.00',
			spent: 'S/ 320.00',
			phone: '+51 934 567 890',
			address: 'Calle Las Flores 567, Lima',
			joinDate: '25/09/2022',
			transactions: [
				{
					id: 'TRX-007',
					date: '2023-12-12',
					amount: 'S/ 75.00',
					type: 'Compra',
					status: 'Completada',
					method: 'Saldo',
				},
				{
					id: 'TRX-008',
					date: '2023-11-30',
					amount: 'S/ 150.00',
					type: 'Recarga',
					status: 'Completada',
					method: 'Efectivo',
				},
				{
					id: 'TRX-009',
					date: '2023-11-20',
					amount: 'S/ 95.00',
					type: 'Compra',
					status: 'Completada',
					method: 'Tarjeta',
				},
			],
		},
	];

	// Filter users based on active tab
	const filteredUsers = users.filter((user) => {
		switch (activeTab) {
			case 'clientes':
				return user.type === 'Cliente';
			case 'equipoPublicas':
				return user.type === 'Equipo Publicas';
			case 'clientesVIP':
				return user.type === 'Cliente VIP';
			case 'equipo':
				return user.type === 'Equipo';
			default:
				return true;
		}
	});

	const handleSort = () => {
		setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
	};

	const handleEditUser = (user: any) => {
		setSelectedUser(user);
		setIsEditDialogOpen(true);
	};

	const handleSendGift = (user: any) => {
		setSelectedUser(user);
		setIsGiftServiceOpen(true);
	};

	const getMethodIcon = (method: any) => {
		switch (method) {
			case 'Tarjeta':
				return <CreditCardIcon className='h-4 w-4 mr-2' />;
			case 'Efectivo':
				return <DollarSignIcon className='h-4 w-4 mr-2' />;
			case 'Transferencia':
			case 'Saldo':
				return <DollarSignIcon className='h-4 w-4 mr-2' />;
			default:
				return <DollarSignIcon className='h-4 w-4 mr-2' />;
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-2xl font-bold'>Administración de Roles</h1>
					<p className='text-muted-foreground'>Gestiona los usuarios y sus roles en el sistema</p>
				</div>
			</div>

			<div className='flex justify-between items-center'>
				<div className='relative w-full max-w-md'>
					<Input
						placeholder='Buscar usuarios...'
						className='pl-10'
					/>

					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
						/>
					</svg>
				</div>
				<div className='flex space-x-2'>
					<Button
						className='bg-purple-600 hover:bg-purple-700'
						onClick={() => setIsGiftServiceOpen(true)}>
						<GiftIcon className='mr-2 h-4 w-4' /> Enviar Regalo
					</Button>
					<Button className='bg-green-600 hover:bg-green-700'>
						<PlusIcon className='mr-2 h-4 w-4' /> Agregar Usuario
					</Button>
				</div>
			</div>

			<div className='bg-card rounded-lg border'>
				<div className='border-b'>
					<div className='flex overflow-x-auto'>
						<button
							className={`px-6 py-3 text-sm font-medium ${activeTab === 'clientes' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
							onClick={() => setActiveTab('clientes')}>
							Clientes
						</button>
						<button
							className={`px-6 py-3 text-sm font-medium ${activeTab === 'equipoPublicas' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
							onClick={() => setActiveTab('equipoPublicas')}>
							Equipo Publicas
						</button>
						<button
							className={`px-6 py-3 text-sm font-medium ${activeTab === 'clientesVIP' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
							onClick={() => setActiveTab('clientesVIP')}>
							Clientes VIP
						</button>
						<button
							className={`px-6 py-3 text-sm font-medium ${activeTab === 'equipo' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
							onClick={() => setActiveTab('equipo')}>
							Equipo
						</button>
					</div>
				</div>

				<div className='p-4'>
					<table className='w-full'>
						<thead>
							<tr className='text-left text-muted-foreground text-sm'>
								<th className='p-3 font-medium'>Usuario</th>
								<th className='p-3 font-medium'>Tipo</th>
								<th className='p-3 font-medium'>Estado</th>
								<th className='p-3 font-medium'>
									<div
										className='flex items-center cursor-pointer'
										onClick={handleSort}>
										Saldo Actual
										{sortDirection === 'asc' ? <ChevronUpIcon className='ml-1 h-4 w-4' /> : <ChevronDownIcon className='ml-1 h-4 w-4' />}
									</div>
								</th>
								<th className='p-3 font-medium'>Total Gastado</th>
								<th className='p-3 font-medium text-right'>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{filteredUsers.map((user) => (
								<tr
									key={user.id}
									className='border-t'
									id={`user-row-${user.id}`}>
									<td
										className='p-3'
										id={`user-cell-${user.id}`}>
										<div
											className='flex items-center'
											id={`user-info-${user.id}`}>
											<Avatar
												className='mr-3 h-10 w-10'
												id={`user-avatar-${user.id}`}>
												<AvatarImage
													src={user.avatar}
													alt={user.name}
													id={`avatar-img-${user.id}`}
												/>

												<AvatarFallback id={`avatar-fallback-${user.id}`}>{user.name.charAt(0)}</AvatarFallback>
											</Avatar>
											<div id={`user-details-${user.id}`}>
												<div
													className='font-medium'
													id={`user-name-${user.id}`}>
													{user.name}
												</div>
												<div
													className='text-sm text-muted-foreground'
													id={`user-email-${user.id}`}>
													{user.email}
												</div>
											</div>
										</div>
									</td>
									<td
										className='p-3'
										id={`type-cell-${user.id}`}>
										<Badge
											variant='outline'
											className='bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
											id={`type-badge-${user.id}`}>
											{user.type}
										</Badge>
									</td>
									<td
										className='p-3'
										id={`status-cell-${user.id}`}>
										<div
											className='flex items-center'
											id={`status-container-${user.id}`}>
											<div
												className={`h-2 w-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'} mr-2`}
												id={`status-indicator-${user.id}`}></div>
											<span
												className='text-sm'
												id={`status-text-${user.id}`}>
												{user.status === 'active' ? 'active' : 'inactive'}
											</span>
										</div>
									</td>
									<td
										className='p-3'
										id={`balance-cell-${user.id}`}>
										{user.balance}
									</td>
									<td
										className='p-3'
										id={`spent-cell-${user.id}`}>
										{user.spent}
									</td>
									<td
										className='p-3 text-right'
										id={`actions-cell-${user.id}`}>
										<div
											className='flex justify-end space-x-2'
											id={`actions-container-${user.id}`}>
											<Button
												variant='ghost'
												size='icon'
												id={`gift-button-${user.id}`}
												onClick={() => handleSendGift(user)}
												className='text-purple-500 hover:text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/20'>
												<GiftIcon
													className='h-4 w-4'
													id={`gift-icon-${user.id}`}
												/>
											</Button>
											<Button
												variant='ghost'
												size='icon'
												id={`edit-button-${user.id}`}
												onClick={() => handleEditUser(user)}>
												<PencilIcon
													className='h-4 w-4'
													id={`edit-icon-${user.id}`}
												/>
											</Button>
											<Button
												variant='ghost'
												size='icon'
												id={`delete-button-${user.id}`}>
												<TrashIcon
													className='h-4 w-4'
													id={`delete-icon-${user.id}`}
												/>
											</Button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* User Edit Dialog with Profile and Transaction History */}
			<Dialog
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}>
				<DialogContent className='sm:max-w-[700px] max-h-[90vh] overflow-y-auto dark:bg-gray-900 dark:border-gray-800'>
					{selectedUser && (
						<>
							<DialogHeader>
								<DialogTitle className='text-xl'>Editar Usuario: {selectedUser}</DialogTitle>
								<DialogDescription>Actualiza la información del usuario y visualiza su historial de transacciones</DialogDescription>
							</DialogHeader>

							<Tabs
								defaultValue='profile'
								value={activeProfileTab}
								onValueChange={setActiveProfileTab}
								className='mt-4'>
								<TabsList className='grid w-full grid-cols-2 dark:bg-gray-800'>
									<TabsTrigger
										value='profile'
										className='dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300'>
										Perfil
									</TabsTrigger>
									<TabsTrigger
										value='transactions'
										className='dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300'>
										Historial de Transacciones
									</TabsTrigger>
								</TabsList>

								<TabsContent
									value='profile'
									className='space-y-4 mt-4'>
									<div className='flex items-center space-x-4'>
										<Avatar className='h-20 w-20'>
											<AvatarImage
											src={selectedUser.avatar}
											alt={selectedUser.name}
											/>

											<AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
										</Avatar>
										<div>
											<h3 className='text-lg font-medium dark:text-white'>{/* {selectedUser.name} */}</h3>
											<p className='text-sm text-muted-foreground dark:text-gray-400'>
												{selectedUser.type} • Miembro desde{" "}
												{selectedUser.joinDate}
											</p>
										</div>
									</div>

									<Separator className='my-4' />

									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div className='space-y-2'>
											<Label
												htmlFor='name'
												className='dark:text-gray-300'>
												<UserIcon className='h-4 w-4 inline mr-2' />
												Nombre Completo
											</Label>
											<Input
												// defaultValue={selectedUser.name}
												className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
											/>
										</div>
										<div className='space-y-2'>
											<Label
												htmlFor='email'
												className='dark:text-gray-300'>
												<MailIcon className='h-4 w-4 inline mr-2' />
												Correo Electrónico
											</Label>
											<Input
												// defaultValue={selectedUser.email}
												className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
											/>
										</div>
										<div className='space-y-2'>
											<Label
												htmlFor='phone'
												className='dark:text-gray-300'>
												<PhoneIcon className='h-4 w-4 inline mr-2' />
												Teléfono
											</Label>
											<Input
												// defaultValue={selectedUser.phone}
												className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
											/>
										</div>
										<div className='space-y-2'>
											<Label
												htmlFor='address'
												className='dark:text-gray-300'>
												<HomeIcon className='h-4 w-4 inline mr-2' />
												Dirección
											</Label>
											<Input
												// defaultValue={selectedUser.address}
												className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
											/>
										</div>
										<div className='space-y-2'>
											<Label
												htmlFor='type'
												className='dark:text-gray-300'>
												Tipo de Usuario
											</Label>
											<Select defaultValue={selectedUser.type}>
												<SelectTrigger className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'>
													<SelectValue placeholder='Seleccionar tipo' />
												</SelectTrigger>
												<SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
													<SelectItem value='Cliente'>Cliente</SelectItem>
													<SelectItem value='Cliente VIP'>Cliente VIP</SelectItem>
													<SelectItem value='Equipo'>Equipo</SelectItem>
													<SelectItem value='Equipo Publicas'>Equipo Publicas</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className='space-y-2'>
											<Label
												htmlFor='status'
												className='dark:text-gray-300'>
												Estado
											</Label>
											<div className='flex items-center space-x-2 pt-2'>
												{/* <Switch checked={selectedUser.status === 'active'} /> */}

												<Label
													htmlFor='status'
													className='dark:text-gray-300'>
													{/* {selectedUser.status === 'active' ? 'Activo' : 'Inactivo'} */}
												</Label>
											</div>
										</div>
									</div>

									{/* {selectedUser.type.includes('Cliente') && ( */}
										<>
											<Separator className='my-4' />
											<div className='space-y-4'>
												<h3 className='text-lg font-medium dark:text-white'>Información Financiera</h3>
												<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
													<div className='space-y-2'>
														<Label
															htmlFor='balance'
															className='dark:text-gray-300'>
															<DollarSignIcon className='h-4 w-4 inline mr-2' />
															Saldo Actual
														</Label>
														<Input
															// defaultValue={selectedUser.balance.replace('S/ ', '')}
															className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
														/>
													</div>
													<div className='space-y-2'>
														<Label
															htmlFor='spent'
															className='dark:text-gray-300'>
															<CreditCardIcon className='h-4 w-4 inline mr-2' />
															Total Gastado
														</Label>
														<Input
															// defaultValue={selectedUser.spent.replace('S/ ', '')}
															disabled
															className='dark:bg-gray-800 dark:border-gray-700 dark:text-white'
														/>
													</div>
												</div>
											</div>
										</>
									{/* )} */}
								</TabsContent>

								<TabsContent
									value='transactions'
									className='mt-4'>
									{/* {selectedUser.transactions && selectedUser.transactions.length > 0 ? ( */}
										<div className='space-y-4'>
											<div className='flex items-center justify-between'>
												<h3 className='text-lg font-medium dark:text-white'>Historial de Transacciones</h3>
												<div className='flex items-center space-x-2'>
													<CalendarIcon className='h-4 w-4 text-muted-foreground' />

													<span className='text-sm text-muted-foreground dark:text-gray-400'>Últimos 3 meses</span>
												</div>
											</div>

											<div className='border rounded-lg overflow-hidden dark:border-gray-700'>
												<table className='w-full'>
													<thead className='bg-muted/50 dark:bg-gray-800 text-left'>
														<tr>
															<th className='p-3 font-medium text-muted-foreground dark:text-gray-400'>ID</th>
															<th className='p-3 font-medium text-muted-foreground dark:text-gray-400'>Fecha</th>
															<th className='p-3 font-medium text-muted-foreground dark:text-gray-400'>Tipo</th>
															<th className='p-3 font-medium text-muted-foreground dark:text-gray-400'>Método</th>
															<th className='p-3 font-medium text-muted-foreground dark:text-gray-400'>Monto</th>
															<th className='p-3 font-medium text-muted-foreground dark:text-gray-400'>Estado</th>
														</tr>
													</thead>
													<tbody>
														{selectedUser?.transactions?.map((transaction: Transaction, index: number) => (
															<tr
																key={transaction.id}
																className='border-t dark:border-gray-700 hover:bg-muted/50 dark:hover:bg-gray-800/50'
																id={`9nikes_${index}`}>
																<td
																	className='p-3 dark:text-white'
																	id={`ecipm8_${index}`}>
																	{transaction.id}
																</td>
																<td
																	className='p-3 dark:text-white'
																	id={`eixv92_${index}`}>
																	{new Date(transaction.date).toLocaleDateString('es-ES')}
																</td>
																<td
																	className='p-3 dark:text-white'
																	id={`b1hxao_${index}`}>
																	<Badge
																		className={
																			transaction.type === 'Compra'
																				? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
																				: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
																		}
																		id={`igek41_${index}`}>
																		{transaction.type}
																	</Badge>
																</td>
																<td
																	className='p-3 dark:text-white'
																	id={`j75e4l_${index}`}>
																	<div
																		className='flex items-center'
																		id={`s2wq8f_${index}`}>
																		{getMethodIcon(transaction.method)}
																		{transaction.method}
																	</div>
																</td>
																<td
																	className='p-3 font-medium dark:text-white'
																	id={`47e8yp_${index}`}>
																	{transaction.amount}
																</td>
																<td
																	className='p-3'
																	id={`ki5886_${index}`}>
																	<Badge
																		className={
																			transaction.status === 'Completada'
																				? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
																				: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
																		}
																		id={`siydzg_${index}`}>
																		{transaction.status}
																	</Badge>
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										</div>
									) : (
										<div className='text-center py-8'>
											<p className='text-muted-foreground dark:text-gray-400'>No hay transacciones disponibles para este usuario.</p>
										</div>
									)} 
								</TabsContent>
							</Tabs>

							<DialogFooter className='mt-6 flex flex-col sm:flex-row gap-2'>
								<Button
									variant='outline'
									onClick={() => setIsEditDialogOpen(false)}
									className='dark:border-gray-700 dark:text-gray-300'>
									<XIcon className='h-4 w-4 mr-2' />
									Cancelar
								</Button>
								<Button className='bg-green-600 hover:bg-green-700'>
									<SaveIcon className='h-4 w-4 mr-2' />
									Guardar Cambios
								</Button>
							</DialogFooter>
						</>
					)}
				</DialogContent>
			</Dialog>

			{/* Gift Service Dialog */}
			<GiftService
				isOpen={isGiftServiceOpen}
				onClose={() => setIsGiftServiceOpen(false)}
			/>
		</div>
	);
}
