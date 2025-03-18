'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeftIcon, CheckIcon, CreditCardIcon, DollarSignIcon, EditIcon, WalletIcon } from 'lucide-react';

export default function OrderCheckout() {
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

	// Mock order data
	const orderItems = [
		{
			id: 1,
			name: 'Classic Burger',
			quantity: 2,
			price: 12.5,
			icon: '🍔',
		},
		{
			id: 2,
			name: 'French Fries Large',
			quantity: 3,
			price: 8.5,
			icon: '🍟',
		},
	];

	// Calculate totals
	const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const tax = subtotal * 0.1; // 10% tax
	const total = subtotal + tax;

	// Available payment methods
	const paymentMethods = [
		{
			id: 'balance',
			name: 'Saldo del Cliente',
			description: 'Disponible: $245.30',
			icon: WalletIcon,
		},
		{
			id: 'cash',
			name: 'Pago en Efectivo',
			description: 'Pagar en caja',
			icon: DollarSignIcon,
		},
	];

	const handlePaymentMethodSelect = (methodId: string) => {
		setSelectedPaymentMethod(methodId);
	};

	const handleGoBack = () => {
		// Navigate back to the previous step
		window.history.back();
	};

	const handleConfirmOrder = () => {
		// Process the order
		console.log('Order confirmed with payment method:', selectedPaymentMethod);
		// In a real app, this would submit the order to the backend
		alert('¡Orden confirmada con éxito!');
	};

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-950'>
			{/* Header */}
			<div className='flex items-center justify-between p-4 border-b bg-white dark:bg-gray-900 dark:border-gray-800'>
				<div className='flex items-center space-x-4'>
					<Button
						variant='ghost'
						size='icon'
						onClick={handleGoBack}
						className='dark:text-gray-300 dark:hover:bg-gray-800'>
						<ArrowLeftIcon className='h-5 w-5' />
					</Button>
					<h1 className='text-xl font-bold dark:text-white'>Finalizar Orden</h1>
					<span className='px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900/20 dark:text-green-400'>Paso 3 de 3</span>
				</div>
				<div className='text-lg font-bold dark:text-white'>
					Total: <span className='text-xl'>${total.toFixed(2)}</span>
				</div>
			</div>

			{/* Main Content */}
			<div className='max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
				{/* Order Details */}
				<Card className='dark:bg-gray-900 dark:border-gray-800'>
					<CardContent className='p-6'>
						<div className='flex justify-between items-center mb-6'>
							<h2 className='text-lg font-bold dark:text-white'>Detalles de la Orden</h2>
							<Button
								variant='ghost'
								size='sm'
								className='dark:text-gray-300'>
								<EditIcon className='h-4 w-4 mr-2' />
								Editar
							</Button>
						</div>

						<div className='space-y-6'>
							{orderItems.map((item, index) => (
								<div
									key={item.id}
									className='flex items-start'
									id={`8duqjr_${index}`}>
									<div
										className='text-2xl mr-4'
										id={`an7brj_${index}`}>
										{item.icon}
									</div>
									<div
										className='flex-1'
										id={`14s9id_${index}`}>
										<h3
											className='font-medium dark:text-white'
											id={`rrtmdh_${index}`}>
											{item.name}
										</h3>
										<p
											className='text-sm text-muted-foreground dark:text-gray-400'
											id={`1k7tq9_${index}`}>
											x{item.quantity} · ${item.price.toFixed(2)} each
										</p>
									</div>
									<div
										className='font-medium dark:text-white'
										id={`u352h9_${index}`}>
										${(item.price * item.quantity).toFixed(2)}
									</div>
								</div>
							))}

							<div className='border-t pt-4 space-y-2 dark:border-gray-800'>
								<div className='flex justify-between text-sm'>
									<span className='text-muted-foreground dark:text-gray-400'>Subtotal</span>
									<span className='dark:text-white'>${subtotal.toFixed(2)}</span>
								</div>
								<div className='flex justify-between text-sm'>
									<span className='text-muted-foreground dark:text-gray-400'>Tax (10%)</span>
									<span className='dark:text-white'>${tax.toFixed(2)}</span>
								</div>
								<div className='flex justify-between font-bold pt-2'>
									<span className='dark:text-white'>Total</span>
									<span className='dark:text-white'>${total.toFixed(2)}</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Payment Method */}
				<Card className='dark:bg-gray-900 dark:border-gray-800'>
					<CardContent className='p-6'>
						<h2 className='text-lg font-bold mb-4 dark:text-white'>Método de Pago</h2>
						<p className='text-sm text-muted-foreground mb-6 dark:text-gray-400'>Seleccione cómo desea pagar</p>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
							{paymentMethods.map((method, index) => (
								<div
									key={method.id}
									className={`border rounded-lg p-4 cursor-pointer transition-colors ${
										selectedPaymentMethod === method.id
											? 'border-primary bg-primary/5 dark:border-primary dark:bg-primary/10'
											: 'dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
									}`}
									onClick={() => handlePaymentMethodSelect(method.id)}
									id={`avw9kg_${index}`}>
									<div
										className='flex items-center justify-between'
										id={`otpjcf_${index}`}>
										<div
											className='flex items-center space-x-3'
											id={`6ix6r9_${index}`}>
											<method.icon
												className={`h-5 w-5 ${method.id === 'balance' ? 'text-blue-500' : 'text-green-500'}`}
												id={`e3ubx9_${index}`}
											/>

											<div id={`7bitwb_${index}`}>
												<p
													className='font-medium dark:text-white'
													id={`tauw7s_${index}`}>
													{method.name}
												</p>
												<p
													className='text-xs text-muted-foreground dark:text-gray-400'
													id={`op3t39_${index}`}>
													{method.description}
												</p>
											</div>
										</div>
										{selectedPaymentMethod === method.id && (
											<CheckIcon
												className='h-5 w-5 text-primary'
												id={`s2s91b_${index}`}
											/>
										)}
									</div>
								</div>
							))}
						</div>

						<div className='flex justify-between mt-6'>
							<Button
								variant='outline'
								onClick={handleGoBack}
								className='dark:border-gray-700 dark:text-gray-300'>
								<ArrowLeftIcon className='h-4 w-4 mr-2' /> Atrás
							</Button>
							<Button
								onClick={handleConfirmOrder}
								disabled={!selectedPaymentMethod}
								className='bg-green-600 hover:bg-green-700'>
								Confirmar Orden <CheckIcon className='h-4 w-4 ml-2' />
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
