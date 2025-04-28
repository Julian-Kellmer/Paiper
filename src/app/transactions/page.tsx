'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, FilterIcon, RefreshCwIcon, CalendarIcon, ArrowUpDownIcon, CreditCardIcon, DollarSignIcon, WalletIcon } from 'lucide-react';
import { UserTransaction } from '@/types/types';

interface Transaction {
	id: number;
	usuario: string;
	userId: string;
	orden: string;
	metodo: string;
	fecha: string;
	monto: string;
	estado: string;
}

export default function Transactions() {
	const [searchQuery, setSearchQuery] = useState('');
	const [sortField, setSortField] = useState('fecha');
	const [sortDirection, setSortDirection] = useState('desc');

	// Mock data for transactions
	const transactions: Transaction[] = [
		{
			id: 1,
			usuario: 'Carlos Méndez',
			userId: 'USR-001',
			orden: 'ORD-2025',
			metodo: 'Tarjeta',
			fecha: '2024-03-15 14:30',
			monto: '$150.75',
			estado: 'Completada',
		},
		{
			id: 2,
			usuario: 'USER-XYZ123',
			userId: 'USR-002',
			orden: 'ORD-2026',
			metodo: 'Efectivo',
			fecha: '2024-03-15 15:45',
			monto: '$85.50',
			estado: 'Pendiente',
		},
		{
			id: 3,
			usuario: 'María González',
			userId: 'USR-003',
			orden: 'ORD-2027',
			metodo: 'Saldo en Cuenta',
			fecha: '2024-03-15 16:20',
			monto: '$234.25',
			estado: 'Completada',
		},
		{
			id: 4,
			usuario: 'Juan Pérez',
			userId: 'USR-004',
			orden: 'ORD-2028',
			metodo: 'Tarjeta',
			fecha: '2024-03-15 17:05',
			monto: '$78.90',
			estado: 'Completada',
		},
		{
			id: 5,
			usuario: 'Ana Rodríguez',
			userId: 'USR-005',
			orden: 'ORD-2029',
			metodo: 'Efectivo',
			fecha: '2024-03-15 18:30',
			monto: '$125.00',
			estado: 'Pendiente',
		},
		{
			id: 6,
			usuario: 'Roberto Sánchez',
			userId: 'USR-006',
			orden: 'ORD-2030',
			metodo: 'Saldo en Cuenta',
			fecha: '2024-03-16 09:15',
			monto: '$92.75',
			estado: 'Completada',
		},
		{
			id: 7,
			usuario: 'Laura Martínez',
			userId: 'USR-007',
			orden: 'ORD-2031',
			metodo: 'Tarjeta',
			fecha: '2024-03-16 10:45',
			monto: '$187.30',
			estado: 'Completada',
		},
	];

	// Function to handle sorting
	const handleSort = (field: string) => {
		if (sortField === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDirection('asc');
		}
	};

	// Function to get sorted and filtered transactions
	const getSortedTransactions = () => {
		let filteredTransactions = transactions;

		// Apply search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filteredTransactions = filteredTransactions.filter(
				(transaction) =>
					transaction.usuario.toLowerCase().includes(query) ||
					transaction.orden.toLowerCase().includes(query) ||
					transaction.metodo.toLowerCase().includes(query) ||
					transaction.monto.toLowerCase().includes(query)
			);
		}

		// Apply sorting
		return filteredTransactions.sort((a: Transaction, b: Transaction) => {
			let valueA, valueB;

			switch (sortField) {
				case 'usuario':
					valueA = a.usuario.toLowerCase();
					valueB = b.usuario.toLowerCase();
					break;
				case 'orden':
					valueA = a.orden;
					valueB = b.orden;
					break;
				case 'metodo':
					valueA = a.metodo;
					valueB = b.metodo;
					break;
				case 'fecha':
					valueA = new Date(a.fecha);
					valueB = new Date(b.fecha);
					break;
				case 'monto':
					valueA = parseFloat(a.monto.replace('$', ''));
					valueB = parseFloat(b.monto.replace('$', ''));
					break;
				default:
					valueA = a[sortField as keyof Transaction];
					valueB = b[sortField as keyof Transaction];
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

	const getMethodIcon = (method: string) => {
		switch (method) {
			case 'Tarjeta':
				return <CreditCardIcon className='h-4 w-4 mr-2' />;
			case 'Efectivo':
				return <DollarSignIcon className='h-4 w-4 mr-2' />;
			case 'Saldo en Cuenta':
				return <WalletIcon className='h-4 w-4 mr-2' />;
			default:
				return null;
		}
	};

	const sortedTransactions = getSortedTransactions();

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-2xl font-bold dark:text-white'>Listado de Transacciones</h1>
					<p className='text-muted-foreground dark:text-gray-400'>Historial de todas las transacciones realizadas</p>
				</div>
			</div>

			{/* Filter and Search Section */}
			<div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
				<div className='relative w-full md:w-96'>
					<SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />

					<Input
						placeholder='Buscar transacciones...'
						className='pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<div className='flex flex-wrap gap-2'>
					<div className='flex items-center space-x-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md p-2'>
						<CalendarIcon className='h-4 w-4 text-muted-foreground' />

						<span className='text-sm text-muted-foreground dark:text-gray-400'>Desde:</span>
						<Input
							type='date'
							className='border-0 p-0 h-auto w-auto dark:bg-transparent dark:text-white'
						/>
					</div>

					<div className='flex items-center space-x-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md p-2'>
						<CalendarIcon className='h-4 w-4 text-muted-foreground' />

						<span className='text-sm text-muted-foreground dark:text-gray-400'>Hasta:</span>
						<Input
							type='date'
							className='border-0 p-0 h-auto w-auto dark:bg-transparent dark:text-white'
						/>
					</div>

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
				</div>
			</div>

			{/* Transactions Table */}
			<div className='bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 overflow-hidden'>
				<div className='overflow-x-auto'>
					<table className='w-full'>
						<thead className='bg-muted/50 dark:bg-gray-800 text-left'>
							<tr>
								<th
									className='p-4 font-medium text-muted-foreground dark:text-gray-400 cursor-pointer'
									onClick={() => handleSort('usuario')}>
									<div className='flex items-center'>
										USUARIO
										{sortField === 'usuario' && <ArrowUpDownIcon className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />}
									</div>
								</th>
								<th
									className='p-4 font-medium text-muted-foreground dark:text-gray-400 cursor-pointer'
									onClick={() => handleSort('orden')}>
									<div className='flex items-center'>
										ORDEN
										{sortField === 'orden' && <ArrowUpDownIcon className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />}
									</div>
								</th>
								<th
									className='p-4 font-medium text-muted-foreground dark:text-gray-400 cursor-pointer'
									onClick={() => handleSort('metodo')}>
									<div className='flex items-center'>
										MÉTODO
										{sortField === 'metodo' && <ArrowUpDownIcon className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />}
									</div>
								</th>
								<th
									className='p-4 font-medium text-muted-foreground dark:text-gray-400 cursor-pointer'
									onClick={() => handleSort('fecha')}>
									<div className='flex items-center'>
										FECHA
										{sortField === 'fecha' && <ArrowUpDownIcon className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />}
									</div>
								</th>
								<th
									className='p-4 font-medium text-muted-foreground dark:text-gray-400 cursor-pointer'
									onClick={() => handleSort('monto')}>
									<div className='flex items-center'>
										MONTO
										{sortField === 'monto' && <ArrowUpDownIcon className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />}
									</div>
								</th>
								<th className='p-4 font-medium text-muted-foreground dark:text-gray-400'>ESTADO</th>
							</tr>
						</thead>
						<tbody>
							{sortedTransactions.map((transaction, index) => (
								<tr
									key={transaction.id}
									className='border-t dark:border-gray-800 hover:bg-muted/50 dark:hover:bg-gray-800/50'
									id={`transaction-row-${transaction.id}`}>
									<td
										className='p-4 dark:text-white'
										id={`usuario-cell-${transaction.id}`}>
										{transaction.usuario}
									</td>
									<td
										className='p-4 dark:text-white'
										id={`orden-cell-${transaction.id}`}>
										{transaction.orden}
									</td>
									<td
										className='p-4 dark:text-white'
										id={`metodo-cell-${transaction.id}`}>
										<div
											className='flex items-center'
											id={`9y5mee_${index}`}>
											{getMethodIcon(transaction.metodo)}
											{transaction.metodo}
										</div>
									</td>
									<td
										className='p-4 dark:text-white'
										id={`fecha-cell-${transaction.id}`}>
										{transaction.fecha}
									</td>
									<td
										className='p-4 font-medium dark:text-white'
										id={`monto-cell-${transaction.id}`}>
										{transaction.monto}
									</td>
									<td
										className='p-4'
										id={`estado-cell-${transaction.id}`}>
										<Badge
											className={
												transaction.estado === 'Completada'
													? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
													: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
											}
											id={`estado-badge-${transaction.id}`}>
											{transaction.estado}
										</Badge>
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
