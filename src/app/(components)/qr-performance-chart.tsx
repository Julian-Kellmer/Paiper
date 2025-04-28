'use client';

import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, CartesianGrid, XAxis } from 'recharts';

interface QrPerformanceChartProps {
	qrId: string;
	id?: string;
}

export function QrPerformanceChart({ qrId, id }: QrPerformanceChartProps) {
	// Mock data for QR performance over time
	const generateChartData = () => {
		// Generate data for the last 30 days
		const data = [];
		const endDate = new Date();
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - 30);

		for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
			// Generate random data based on the QR ID to ensure consistency
			const seed = qrId.charCodeAt(qrId.length - 1) + date.getDate();
			const orders = Math.floor((Math.sin(seed) + 1) * 5) + 3; // Between 3 and 13
			const revenue = orders * (Math.floor((Math.cos(seed) + 1) * 10) + 15); // Between $15 and $35 per order

			data.push({
				date: date.toISOString().split('T')[0],
				orders: orders,
				revenue: revenue,
			});
		}

		return data;
	};

	const chartData = generateChartData();

	return (
		<div
			className='h-full'
			id={id || 'qr-performance-chart-container'}>
			<ChartContainer
				config={{}}
				className='aspect-[none] h-full'>
				<LineChart
					data={chartData}
					margin={{
						top: 20,
						right: 30,
						left: 20,
						bottom: 5,
					}}>
					<ChartTooltip content={<ChartTooltipContent />} />

					<CartesianGrid
						strokeDasharray='3 3'
						vertical={false}
					/>

					<XAxis
						dataKey='date'
						tickFormatter={(value) => {
							const date = new Date(value);
							return date.toLocaleDateString('es-ES', {
								day: '2-digit',
								month: '2-digit',
							});
						}}
						axisLine={false}
						tickLine={false}
					/>

					<Line
						type='monotone'
						dataKey='orders'
						name='Pedidos'
						stroke='hsl(var(--chart-1))'
						strokeWidth={2}
						dot={false}
						activeDot={{ r: 6 }}
					/>

					<Line
						type='monotone'
						dataKey='revenue'
						name='Ingresos ($)'
						stroke='hsl(var(--chart-2))'
						strokeWidth={2}
						dot={false}
						activeDot={{ r: 6 }}
					/>
				</LineChart>
			</ChartContainer>
		</div>
	);
}
