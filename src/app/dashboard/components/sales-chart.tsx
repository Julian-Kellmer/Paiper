'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { supabase } from '@/lib/supabaseClient';

// Define payment method type
type PaymentMethod = 'mercadopago' | 'cash' | 'cashless';

export function SalesChart() {
	const [activeChart, setActiveChart] = useState('payment');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// State for payment methods data
	const [paymentMethodData, setPaymentMethodData] = useState([
		{ name: 'Mercado Pago', value: 0 },
		{ name: 'Cash', value: 0 },
		{ name: 'Cashless', value: 0 },
	]);

	// State for peak hours data
	const [peakHoursData, setPeakHoursData] = useState([
		{ hour: '8AM', orders: 0 },
		{ hour: '10AM', orders: 0 },
		{ hour: '12PM', orders: 0 },
		{ hour: '2PM', orders: 0 },
		{ hour: '4PM', orders: 0 },
		{ hour: '6PM', orders: 0 },
		{ hour: '8PM', orders: 0 },
		{ hour: '10PM', orders: 0 },
	]);

	// Fetch payment methods data
	useEffect(() => {
		const fetchPaymentData = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Get today's date range
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				const tomorrow = new Date(today);
				tomorrow.setDate(tomorrow.getDate() + 1);

				// Fetch today's orders with payment method
				const { data: orders, error: ordersError } = await supabase
					.from('orders')
					.select('payment_method, total_amount, status')
					.gte('created_at', today.toISOString())
					.lt('created_at', tomorrow.toISOString())
					.eq('status', 'delivered'); // Only count delivered orders

				if (ordersError) throw ordersError;

				// Calculate total by payment method
				const paymentTotals = {
					mercadopago: 0,
					cash: 0,
					cashless: 0,
				};

				orders.forEach((order) => {
					if (order.payment_method && order.total_amount) {
						const method = order.payment_method as PaymentMethod;
						if (method in paymentTotals) {
							paymentTotals[method] += order.total_amount;
						}
					}
				});

				// Update payment method data
				setPaymentMethodData([
					{ name: 'Mercado Pago', value: paymentTotals.mercadopago },
					{ name: 'Cash', value: paymentTotals.cash },
					{ name: 'Cashless', value: paymentTotals.cashless },
				]);

				// Fetch orders for peak hours analysis
				const { data: allOrders, error: allOrdersError } = await supabase
					.from('orders')
					.select('created_at, status')
					.gte('created_at', today.toISOString())
					.lt('created_at', tomorrow.toISOString())
					.eq('status', 'delivered'); // Only count delivered orders

				if (allOrdersError) throw allOrdersError;

				// Initialize hour counts
				const hourCounts = {
					'8AM': 0,
					'10AM': 0,
					'12PM': 0,
					'2PM': 0,
					'4PM': 0,
					'6PM': 0,
					'8PM': 0,
					'10PM': 0,
				};

				// Count orders by hour
				allOrders.forEach((order) => {
					const orderDate = new Date(order.created_at);
					const hour = orderDate.getHours();

					// Map hours to our display format
					if (hour >= 8 && hour < 10) hourCounts['8AM']++;
					else if (hour >= 10 && hour < 12) hourCounts['10AM']++;
					else if (hour >= 12 && hour < 14) hourCounts['12PM']++;
					else if (hour >= 14 && hour < 16) hourCounts['2PM']++;
					else if (hour >= 16 && hour < 18) hourCounts['4PM']++;
					else if (hour >= 18 && hour < 20) hourCounts['6PM']++;
					else if (hour >= 20 && hour < 22) hourCounts['8PM']++;
					else if (hour >= 22 || hour < 8) hourCounts['10PM']++;
				});

				// Update peak hours data
				setPeakHoursData([
					{ hour: '8AM', orders: hourCounts['8AM'] },
					{ hour: '10AM', orders: hourCounts['10AM'] },
					{ hour: '12PM', orders: hourCounts['12PM'] },
					{ hour: '2PM', orders: hourCounts['2PM'] },
					{ hour: '4PM', orders: hourCounts['4PM'] },
					{ hour: '6PM', orders: hourCounts['6PM'] },
					{ hour: '8PM', orders: hourCounts['8PM'] },
					{ hour: '10PM', orders: hourCounts['10PM'] },
				]);
			} catch (err) {
				console.error('Error fetching sales data:', err);
				setError('Error loading sales data');
			} finally {
				setIsLoading(false);
			}
		};

		fetchPaymentData();
	}, []);

	return (
		<div className='space-y-6'>
			<Tabs
				defaultValue='payment'
				onValueChange={setActiveChart}>
				<TabsList className='dark:bg-gray-800'>
					<TabsTrigger
						value='payment'
						className='dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300'>
						Sales by Payment Method
					</TabsTrigger>
					<TabsTrigger
						value='peak'
						className='dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white dark:text-gray-300'>
						Peak Order Hours
					</TabsTrigger>
				</TabsList>
			</Tabs>

			{error && <div className='p-4 bg-red-50 border border-red-200 rounded-md text-red-600'>{error}</div>}

			<div className='h-[300px]'>
				{isLoading ? (
					<div className='h-full flex items-center justify-center'>
						<div className='animate-pulse text-gray-400'>Loading chart data...</div>
					</div>
				) : activeChart === 'payment' ? (
					<ChartContainer
						config={{}}
						className='aspect-[none] h-full'>
						<BarChart data={paymentMethodData}>
							<ChartTooltip content={<ChartTooltipContent />} />

							<CartesianGrid
								vertical={false}
								strokeDasharray='3 3'
								stroke='rgba(255,255,255,0.1)'
							/>

							<XAxis
								dataKey='name'
								axisLine={false}
								tickLine={false}
								tick={{ fill: '#9ca3af' }}
							/>

							<Bar
								dataKey='value'
								fill='hsl(var(--chart-1))'
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ChartContainer>
				) : (
					<ChartContainer
						config={{}}
						className='aspect-[none] h-full'>
						<LineChart data={peakHoursData}>
							<ChartTooltip content={<ChartTooltipContent />} />

							<CartesianGrid
								vertical={false}
								strokeDasharray='3 3'
								stroke='rgba(255,255,255,0.1)'
							/>

							<XAxis
								dataKey='hour'
								axisLine={false}
								tickLine={false}
								tick={{ fill: '#9ca3af' }}
							/>

							<Line
								type='monotone'
								dataKey='orders'
								stroke='hsl(var(--chart-2))'
								strokeWidth={2}
								dot={{ r: 4 }}
								activeDot={{ r: 6 }}
							/>
						</LineChart>
					</ChartContainer>
				)}
			</div>
		</div>
	);
}
