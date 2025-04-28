'use client';

import React from 'react';
import { HomeIcon, ShoppingCartIcon, DollarSignIcon, UsersIcon, FileTextIcon, PlusIcon, BarChartIcon, QrCodeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface SidebarProps {
	currentPage: string;
	setCurrentPage: (page: string) => void;
}

export function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
	const menuItems = [
		{ id: 'dashboard', label: 'Inicio', icon: HomeIcon },
		{ id: 'orders', label: 'Gestión de Pedidos', icon: ShoppingCartIcon },
		{ id: 'finances', label: 'Panel de Finanzas', icon: DollarSignIcon },
		{ id: 'roles', label: 'Administración de Roles', icon: UsersIcon },
		{ id: 'menu', label: 'Gestión de Carta', icon: FileTextIcon },
		{ id: 'qr-tracking', label: 'Tracking de QRs', icon: QrCodeIcon },
	];

	// Handle New Order button click
	const handleNewOrderClick = () => {
		setCurrentPage('new-order');
	};

	return (
		<div className='w-64 bg-card border-r dark:bg-gray-900 dark:border-gray-800 flex flex-col h-full'>
			<div className='p-4 border-b dark:border-gray-800'>
				<div className='flex items-center'>
					<Image
						src='/assets/Logo.png'
						alt='Piper Logo'
						width={120}
						height={50}
						className='dark:filter dark:brightness-150'
					/>
				</div>
			</div>

			<nav className='flex-1 p-2 space-y-1'>
				{menuItems.map((item, index) => (
					<Button
						key={item.id}
						variant={currentPage === item.id ? 'secondary' : 'ghost'}
						className={`w-full justify-start text-left ${currentPage === item.id ? 'bg-secondary dark:bg-gray-800' : 'dark:text-gray-300 dark:hover:bg-gray-800'}`}
						onClick={() => setCurrentPage(item.id)}
						id={`uk0tiq_${index}`}>
						<item.icon
							className='mr-2 h-5 w-5'
							id={`zl1t97_${index}`}
						/>
						{item.label}
					</Button>
				))}
			</nav>
		</div>
	);
}
