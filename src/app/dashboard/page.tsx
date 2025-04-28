'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, GiftIcon, BellIcon, PrinterIcon } from 'lucide-react';
import { MetricsCard } from '(components)/metrics-card';
import { LiveOrders } from '(components)/live-orders';
import { SalesChart } from '@/app/dashboard/components/sales-chart';
import { DailySummary } from '(components)/daily-summary';
import { GiftButton } from '(components)/gift-button';
import { GiftHistory } from '(components)/gift-history';
import { GiftNotification } from '(components)/gift-notification';
import { GiftService } from '(components)/gift-service';
import { ProfitabilitySummary } from '../(components)/profitability-summary';
import { AlertSection } from '../(components)/alert-section';
import { supabase } from '@/lib/supabaseClient';

export default function Dashboard({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
	const [isGiftHistoryOpen, setIsGiftHistoryOpen] = useState(false);
	const [showGiftNotification, setShowGiftNotification] = useState(false);
	const [isGiftServiceOpen, setIsGiftServiceOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// State for metrics data
	const [metricsData, setMetricsData] = useState([
		{
			id: 'total-sales',
			title: 'Total Sales Today',
			value: '$0',
			change: '0%',
			icon: 'dollar',
			iconColor: 'text-green-500',
			iconBg: 'bg-green-100 dark:bg-green-900/20',
		},
		{
			id: 'pending-orders',
			title: 'Pending Orders',
			value: '0',
			subtext: '0 urgent',
			icon: 'clock',
			iconColor: 'text-orange-500',
			iconBg: 'bg-orange-100 dark:bg-orange-900/20',
		},
		{
			id: 'active-users',
			title: 'Active Users',
			value: '0',
			change: '+0 today',
			icon: 'users',
			iconColor: 'text-blue-500',
			iconBg: 'bg-blue-100 dark:bg-blue-900/20',
		},
		{
			id: 'completed-orders',
			title: 'Completed Orders Today',
			value: '0',
			change: '0%',
			icon: 'check',
			iconColor: 'text-purple-500',
			iconBg: 'bg-purple-100 dark:bg-purple-900/20',
		},
	]);

	// State for daily summary data
	const [dailySummaryData, setDailySummaryData] = useState([
		{
			id: 'daily-orders',
			title: 'Order Management',
			value: '0',
			change: '0%',
			icon: 'clipboard',
		},
		{
			id: 'daily-sales',
			title: 'Total Sales',
			value: '$0',
			change: '0%',
			icon: 'dollar',
		},
		{
			id: 'daily-users',
			title: 'Active Users',
			value: '0',
			change: '0%',
			icon: 'users',
		},
	]);

	// Fetch metrics data from Supabase
	useEffect(() => {
		const fetchMetricsData = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Get today's date range
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				const tomorrow = new Date(today);
				tomorrow.setDate(tomorrow.getDate() + 1);

				// Get yesterday's date range
				const yesterday = new Date(today);
				yesterday.setDate(yesterday.getDate() - 1);
				const yesterdayEnd = new Date(yesterday);
				yesterdayEnd.setDate(yesterdayEnd.getDate() + 1);

				// Fetch today's orders
				const { data: todayOrders, error: todayOrdersError } = await supabase.from('orders').select('*').gte('created_at', today.toISOString()).lt('created_at', tomorrow.toISOString());

				if (todayOrdersError) throw todayOrdersError;

				// Fetch yesterday's orders
				const { data: yesterdayOrders, error: yesterdayOrdersError } = await supabase
					.from('orders')
					.select('*')
					.gte('created_at', yesterday.toISOString())
					.lt('created_at', yesterdayEnd.toISOString());

				if (yesterdayOrdersError) throw yesterdayOrdersError;

				// Fetch pending orders
				const { data: pendingOrders, error: pendingOrdersError } = await supabase.from('orders').select('*').eq('status', 'pending');

				if (pendingOrdersError) throw pendingOrdersError;

				// Fetch urgent pending orders (you can define your own criteria for urgent)
				const urgentOrders = pendingOrders.filter((order) => {
					// Example: Orders older than 30 minutes are urgent
					const orderTime = new Date(order.created_at);
					const now = new Date();
					const diffMinutes = (now.getTime() - orderTime.getTime()) / (1000 * 60);
					return diffMinutes > 30;
				});

				// Fetch active users (users who have placed orders in the last 24 hours)
				const last24Hours = new Date();
				last24Hours.setHours(last24Hours.getHours() - 24);

				const { data: activeUsers, error: activeUsersError } = await supabase.from('orders').select('user_id').gte('created_at', last24Hours.toISOString()).not('user_id', 'is', null);

				if (activeUsersError) throw activeUsersError;

				// Count unique users
				const uniqueUsers = new Set(activeUsers.map((order) => order.user_id));

				// Calculate today's total sales
				const todayTotalSales = todayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

				// Calculate yesterday's total sales
				const yesterdayTotalSales = yesterdayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

				// Calculate sales change percentage
				const salesChangePercent = yesterdayTotalSales > 0 ? (((todayTotalSales - yesterdayTotalSales) / yesterdayTotalSales) * 100).toFixed(1) : '0';

				// Calculate completed orders change percentage
				const completedOrdersChangePercent = yesterdayOrders.length > 0 ? (((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100).toFixed(1) : '0';

				// Update metrics data
				setMetricsData([
					{
						id: 'total-sales',
						title: 'Total Sales Today',
						value: `$${todayTotalSales.toFixed(2)}`,
						change: `${salesChangePercent}%`,
						icon: 'dollar',
						iconColor: 'text-green-500',
						iconBg: 'bg-green-100 dark:bg-green-900/20',
					},
					{
						id: 'pending-orders',
						title: 'Pending Orders',
						value: pendingOrders.length.toString(),
						subtext: `${urgentOrders.length} urgent`,
						icon: 'clock',
						iconColor: 'text-orange-500',
						iconBg: 'bg-orange-100 dark:bg-orange-900/20',
					},
					{
						id: 'active-users',
						title: 'Active Users',
						value: uniqueUsers.size.toString(),
						change: `+${uniqueUsers.size} today`,
						icon: 'users',
						iconColor: 'text-blue-500',
						iconBg: 'bg-blue-100 dark:bg-blue-900/20',
					},
					{
						id: 'completed-orders',
						title: 'Completed Orders Today',
						value: todayOrders.length.toString(),
						change: `${completedOrdersChangePercent}%`,
						icon: 'check',
						iconColor: 'text-purple-500',
						iconBg: 'bg-purple-100 dark:bg-purple-900/20',
					},
				]);

				// Update daily summary data
				setDailySummaryData([
					{
						id: 'daily-orders',
						title: 'Order Management',
						value: todayOrders.length.toString(),
						change: `${completedOrdersChangePercent}%`,
						icon: 'clipboard',
					},
					{
						id: 'daily-sales',
						title: 'Total Sales',
						value: `$${todayTotalSales.toFixed(2)}`,
						change: `${salesChangePercent}%`,
						icon: 'dollar',
					},
					{
						id: 'daily-users',
						title: 'Active Users',
						value: uniqueUsers.size.toString(),
						change: `${uniqueUsers.size}%`,
						icon: 'users',
					},
				]);
			} catch (err) {
				console.error('Error fetching metrics data:', err);
				setError('Error loading dashboard data');
			} finally {
				setIsLoading(false);
			}
		};

		fetchMetricsData();
	}, []);

	// Function to handle new order button click
	const handleNewOrderClick = () => {
		setCurrentPage('new-order');
	};

	return (
		<div className='space-y-8'>
			<div className='flex justify-between items-center mb-2'>
				<div>
					<h1 className='text-2xl font-bold dark:text-white'>Bienvenido</h1>
					{/* <p className='text-muted-foreground dark:text-gray-400'>Ventas de dia: $8,450.00</p> */}
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

			{error && <div className='p-4 bg-red-50 border border-red-200 rounded-md text-red-600'>{error}</div>}

			{/* Metrics Cards */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{isLoading
					? // Loading skeletons
					  Array(4)
							.fill(0)
							.map((_, index) => (
								<div
									key={index}
									className='bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-32 animate-pulse'></div>
							))
					: metricsData.map((metric, index) => (
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
