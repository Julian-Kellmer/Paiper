'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, GiftIcon, BellIcon, PrinterIcon } from 'lucide-react';
import { MetricsCard } from '(components)/metrics-card';
import { LiveOrders } from '(components)/live-orders';
import { SalesChart } from '(components)/sales-chart';
import { DailySummary } from '(components)/daily-summary';
import { GiftButton } from '(components)/gift-button';
import { GiftHistory } from '(components)/gift-history';
import { GiftNotification } from '(components)/gift-notification';
import { GiftService } from '(components)/gift-service';
import { ProfitabilitySummary } from '../(components)/profitability-summary';
import { AlertSection } from '../(components)/alert-section';

export default function Dashboard({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
	const [isGiftHistoryOpen, setIsGiftHistoryOpen] = useState(false);
	const [showGiftNotification, setShowGiftNotification] = useState(false);
	const [isGiftServiceOpen, setIsGiftServiceOpen] = useState(false);

	// Mock data for metrics
	const metricsData = [
		{
			id: 'total-sales',
			title: 'Total Sales',
			value: '$145,280',
			change: '+5%',
			icon: 'dollar',
			iconColor: 'text-green-500',
			iconBg: 'bg-green-100 dark:bg-green-900/20',
		},
		{
			id: 'pending-orders',
			title: 'Pending Orders',
			value: '24',
			subtext: '8 urgent',
			icon: 'clock',
			iconColor: 'text-orange-500',
			iconBg: 'bg-orange-100 dark:bg-orange-900/20',
		},
		{
			id: 'active-users',
			title: 'Active Users',
			value: '156',
			change: '+5 today',
			icon: 'users',
			iconColor: 'text-blue-500',
			iconBg: 'bg-blue-100 dark:bg-blue-900/20',
		},
		{
			id: 'completed-orders',
			title: 'Completed Orders',
			value: '892',
			change: '+2%',
			icon: 'check',
			iconColor: 'text-purple-500',
			iconBg: 'bg-purple-100 dark:bg-purple-900/20',
		},
	];

	// Mock data for daily summary
	const dailySummaryData = [
		{
			id: 'daily-orders',
			title: 'Order Management',
			value: '145',
			change: '+12%',
			icon: 'clipboard',
		},
		{
			id: 'daily-sales',
			title: 'Total Sales',
			value: '$8,450',
			change: '+8%',
			icon: 'dollar',
		},
		{
			id: 'daily-users',
			title: 'Active Users',
			value: '89',
			change: '+45%',
			icon: 'users',
		},
	];

	// Function to handle new order button click
	const handleNewOrderClick = () => {
		setCurrentPage('new-order');
	};

	return (
		<div className='space-y-8'>
			<div className='flex justify-between items-center mb-2'>
				<div>
					<h1 className='text-2xl font-bold dark:text-white'>Bienvenido, Chef Carlos!</h1>
					<p className='text-muted-foreground dark:text-gray-400'>Ventas de dia: $8,450.00</p>
				</div>
				<div className='flex space-x-2'>
					<Button
						variant='outline'
						className='flex items-center dark:border-gray-700 dark:text-gray-300'
						onClick={() => setIsGiftHistoryOpen(true)}>
						<GiftIcon className='mr-2 h-4 w-4 text-purple-500' />
						Regalos
					</Button>
					<Button
						variant='outline'
						className='flex items-center dark:border-gray-700 dark:text-gray-300'
						onClick={() => setShowGiftNotification(true)}>
						<BellIcon className='mr-2 h-4 w-4 text-blue-500' />
						Notificaciones
					</Button>
					<Button
						variant='outline'
						className='flex items-center dark:border-gray-700 dark:text-gray-300'
						onClick={() => setIsGiftServiceOpen(true)}>
						<GiftIcon className='mr-2 h-4 w-4 text-purple-500' />
						Enviar Regalo
					</Button>
				</div>
			</div>

			{/* Metrics Cards */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{metricsData.map((metric, index) => (
					<MetricsCard
						key={metric.id}
						data={metric}
					/>
				))}
			</div>

			{/* Sales Analysis and Live Orders */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8'>
				<div className='bg-card rounded-lg border dark:bg-gray-900 dark:border-gray-800 p-6'>
					<h2 className='text-xl font-semibold mb-6 dark:text-white'>Sales Analysis</h2>
					<SalesChart />
				</div>
				<LiveOrders />
			</div>

			{/* Profitability Summary and Alert Section */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8'>
				<ProfitabilitySummary onViewDetails={() => {}} />
				<AlertSection />
			</div>

			{/* Gift Button */}
			<GiftButton />

			{/* Gift History Dialog */}
			<GiftHistory
				isOpen={isGiftHistoryOpen}
				onClose={() => setIsGiftHistoryOpen(false)}
			/>

			{/* Gift Notification Sheet */}
			{showGiftNotification && <GiftNotification onClose={() => setShowGiftNotification(false)} />}

			{/* Gift Service Dialog */}
			<GiftService
				isOpen={isGiftServiceOpen}
				onClose={() => setIsGiftServiceOpen(false)}
			/>
		</div>
	);
}
