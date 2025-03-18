'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeftIcon, BellIcon, MinusIcon, PlusIcon, PrinterIcon, QrCodeIcon, SearchIcon, UserIcon, UserXIcon, XIcon, ArrowRightIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

// Add interfaces for props and items
interface CartItem {
	id: number;
	name: string;
	price: number;
	quantity: number;
	image: string;
	description?: string;
	category?: string;
}

interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	category: string;
	image: string;
}

interface NewOrderProps {
	setCurrentPage: (page: string) => void;
}

export default function NewOrder({ setCurrentPage }: NewOrderProps) {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
	const [activeCategory, setActiveCategory] = useState('Bebidas');
	const [searchQuery, setSearchQuery] = useState('');
	const [cartItems, setCartItems] = useState<CartItem[]>([
		{
			id: 1,
			name: 'Café Latte',
			price: 4.5,
			quantity: 1,
			image: '/assets/cafe-latte.jpg',
		},
	]);

	// Product categories
	const categories = ['Bebidas', 'Comidas', 'Postres', 'Extras'];

	// Mock products data
	const products = [
		{
			id: 1,
			name: 'Café Latte',
			description: 'Espresso con leche cremosa',
			price: 4.5,
			category: 'Bebidas',
			image: '/assets/cafe-latte.jpg',
		},
		{
			id: 2,
			name: 'Cappuccino',
			description: 'Espresso con leche espumosa y chocolate',
			price: 4.75,
			category: 'Bebidas',
			image: '/assets/capuccino.jpg',
		},
		{
			id: 8,
			name: 'Jugo de naranja',
			description: 'Jugo de naranja exprimido',
			price: 4.75,
			category: 'Bebidas',
			image: '/assets/jugo-de-naranja.jpg',
		},
		{
			id: 3,
			name: 'Americano',
			description: 'Espresso con agua caliente',
			price: 3.5,
			category: 'Bebidas',
			image: '/assets/americano.jpg',
		},
		{
			id: 4,
			name: 'Hamburguesa',
			description: 'Carne, queso, lechuga y tomate',
			price: 8.5,
			category: 'Comidas',
			image: '/assets/hamburgesa.jpg',
		},
		{
			id: 5,
			name: 'Pizza Margherita',
			description: 'Tomate, mozzarella y albahaca',
			price: 12.0,
			category: 'Comidas',
			image: '/assets/pizza.jpg',
		},
		{
			id: 6,
			name: 'Classic Burger',
			description: 'Hamburguesa clásica con queso',
			price: 12.5,
			category: 'Comidas',
			image: '/assets/hamburgesa.jpg',
		},
		{
			id: 7,
			name: 'French Fries Large',
			description: 'Papas fritas grandes',
			price: 8.5,
			category: 'Comidas',
			image: '/assets/papasfritas.jpg',
		},
	];

	// Filter products by active category and search query
	const filteredProducts = products.filter((product) => product.category === activeCategory && (searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase())));

	const handleGoBack = () => {
		if (step > 1) {
			setStep(step - 1);
		} else {
			setCurrentPage('dashboard');
		}
	};

	const handleMethodSelect = (method: string) => {
		setSelectedMethod(method);
	};

	const handleContinue = () => {
		if (step === 2 && cartItems.length > 0) {
			setCurrentPage('order-checkout');
		} else {
			setStep(step + 1);
		}
	};

	const handleAddToCart = (product: Product) => {
		const existingItem = cartItems.find((item) => item.id === product.id);

		if (existingItem) {
			setCartItems(cartItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
		} else {
			setCartItems([...cartItems, { ...product, quantity: 1 }]);
		}
	};

	const handleUpdateQuantity = (id: number, newQuantity: number) => {
		if (newQuantity <= 0) {
			setCartItems(cartItems.filter((item) => item.id !== id));
		} else {
			setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
		}
	};

	const handleRemoveItem = (id: number) => {
		setCartItems(cartItems.filter((item) => item.id !== id));
	};

	// Calculate subtotal
	const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const tax = subtotal * 0.1; // Assuming 10% tax
	const total = subtotal + tax;

	// Render product selection page (Step 2)
	if (step === 2) {
		return (
			<div className='bg-gray-50 dark:bg-gray-950 min-h-screen flex flex-col'>
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
						<h1 className='text-xl font-bold dark:text-white'>Seleccionar Productos</h1>
						<span className='px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900/20 dark:text-green-400'>Paso 2 de 3</span>
					</div>
					<div className='flex items-center space-x-3'>
						<Button
							variant='ghost'
							size='icon'
							className='dark:text-gray-300 dark:hover:bg-gray-800'>
							<PrinterIcon className='h-5 w-5' />
						</Button>
						<Button
							variant='ghost'
							size='icon'
							className='dark:text-gray-300 dark:hover:bg-gray-800'>
							<BellIcon className='h-5 w-5' />
						</Button>
					</div>
				</div>

				{/* Main Content */}
				<div className='flex flex-1 overflow-hidden'>
					{/* Left Panel - Products */}
					<div className='w-2/3 flex flex-col overflow-hidden'>
						{/* Search Bar */}
						<div className='p-4 border-b dark:border-gray-800'>
							<div className='relative'>
								<SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />

								<Input
									placeholder='Buscar productos...'
									className='pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</div>

						{/* Categories */}
						<div className='flex overflow-x-auto border-b dark:border-gray-800 p-2'>
							{categories.map((category) => (
								<Button
									key={category}
									variant={activeCategory === category ? 'default' : 'outline'}
									className={`mx-1 rounded-full ${activeCategory === category ? 'bg-black text-white dark:bg-gray-800' : 'dark:text-gray-300 dark:border-gray-700'}`}
									onClick={() => setActiveCategory(category)}
									id={`category-${category}`}>
									{category}
								</Button>
							))}
						</div>

						{/* Products Grid */}
						<div className='flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
							{filteredProducts.map((product) => (
								<Card
									key={product.id}
									className='overflow-hidden dark:bg-gray-900 dark:border-gray-800'
									id={`product-card-${product.id}`}>
									<div
										className='relative h-40 w-full'
										id={`product-image-container-${product.id}`}>
										<Image
											src={product.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=200&auto=format&fit=crop'}
											alt={product.name}
											layout='fill'
											objectFit='cover'
											className='object-cover'
											id={`product-image-${product.id}`}
										/>
									</div>
									<CardContent
										className='p-4'
										id={`product-content-${product.id}`}>
										<h3
											className='font-medium dark:text-white'
											id={`product-name-${product.id}`}>
											{product.name}
										</h3>
										<p
											className='text-sm text-muted-foreground dark:text-gray-400 mb-2'
											id={`product-description-${product.id}`}>
											{product.description}
										</p>
										<div
											className='flex justify-between items-center'
											id={`product-footer-${product.id}`}>
											<span
												className='font-bold dark:text-white'
												id={`product-price-${product.id}`}>
												${product.price.toFixed(2)}
											</span>
											<Button
												variant='ghost'
												size='icon'
												className='h-8 w-8 rounded-full bg-black text-white dark:bg-gray-800'
												onClick={() => handleAddToCart(product)}
												id={`add-product-${product.id}`}>
												<PlusIcon
													className='h-5 w-5'
													id={`add-icon-${product.id}`}
												/>
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>

					{/* Right Panel - Cart */}
					<div className='w-1/3 border-l dark:border-gray-800 flex flex-col bg-white dark:bg-gray-900'>
						{/* Cart Items */}
						<div className='flex-1 overflow-y-auto p-4'>
							{cartItems.length > 0 ? (
								<div className='space-y-4'>
									{cartItems.map((item) => (
										<div
											key={item.id}
											className='flex items-center'
											id={`cart-item-${item.id}`}>
											<div
												className='h-16 w-16 relative mr-3'
												id={`cart-item-image-container-${item.id}`}>
												<Image
													src={item.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=200&auto=format&fit=crop'}
													alt={item.name}
													layout='fill'
													objectFit='cover'
													className='rounded-md'
													id={`cart-item-image-${item.id}`}
												/>
											</div>
											<div
												className='flex-1'
												id={`cart-item-details-${item.id}`}>
												<div
													className='flex justify-between items-start'
													id={`cart-item-header-${item.id}`}>
													<div id={`cart-item-info-${item.id}`}>
														<h4
															className='font-medium dark:text-white'
															id={`cart-item-name-${item.id}`}>
															{item.name}
														</h4>
														<p
															className='text-sm text-muted-foreground dark:text-gray-400'
															id={`cart-item-price-${item.id}`}>
															${item.price.toFixed(2)} × {item.quantity}
														</p>
													</div>
													<span
														className='font-bold dark:text-white'
														id={`cart-item-total-${item.id}`}>
														${(item.price * item.quantity).toFixed(2)}
													</span>
												</div>
												<div
													className='flex items-center justify-between mt-2'
													id={`cart-item-actions-${item.id}`}>
													<div
														className='flex items-center border rounded-md dark:border-gray-700'
														id={`cart-item-quantity-${item.id}`}>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8 p-0'
															onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
															id={`decrease-quantity-${item.id}`}>
															<MinusIcon
																className='h-4 w-4'
																id={`minus-icon-${item.id}`}
															/>
														</Button>
														<span
															className='w-8 text-center dark:text-white'
															id={`quantity-value-${item.id}`}>
															{item.quantity}
														</span>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8 p-0'
															onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
															id={`increase-quantity-${item.id}`}>
															<PlusIcon
																className='h-4 w-4'
																id={`plus-icon-${item.id}`}
															/>
														</Button>
													</div>
													<Button
														variant='ghost'
														size='icon'
														className='h-8 w-8 p-0 text-red-500'
														onClick={() => handleRemoveItem(item.id)}
														id={`remove-item-${item.id}`}>
														<XIcon
															className='h-4 w-4'
															id={`remove-icon-${item.id}`}
														/>
													</Button>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className='h-full flex flex-col items-center justify-center text-center p-4'>
									<div className='w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4'>
										<ShoppingCartIcon className='h-8 w-8 text-gray-400' />
									</div>
									<h3 className='font-medium dark:text-white mb-2'>Carrito Vacío</h3>
									<p className='text-sm text-muted-foreground dark:text-gray-400'>Agrega productos para comenzar tu orden</p>
								</div>
							)}
						</div>

						{/* Cart Summary */}
						<div className='border-t dark:border-gray-800 p-4'>
							<div className='space-y-2 mb-4'>
								<div className='flex justify-between items-center'>
									<span className='text-muted-foreground dark:text-gray-400'>Subtotal</span>
									<span className='dark:text-white'>${subtotal.toFixed(2)}</span>
								</div>
								<div className='flex justify-between items-center'>
									<span className='text-muted-foreground dark:text-gray-400'>Tax</span>
									<span className='dark:text-white'>${tax.toFixed(2)}</span>
								</div>
								<Separator className='my-2 dark:bg-gray-800' />

								<div className='flex justify-between items-center font-bold'>
									<span className='dark:text-white'>Total</span>
									<span className='dark:text-white'>${total.toFixed(2)}</span>
								</div>
							</div>

							<div className='flex space-x-2'>
								<Button
									variant='outline'
									className='flex-1 dark:border-gray-700 dark:text-gray-300'
									onClick={handleGoBack}>
									<ArrowLeftIcon className='h-4 w-4 mr-2' /> Atrás
								</Button>
								<Button
									className='flex-1 bg-black text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700'
									onClick={handleContinue}
									disabled={cartItems.length === 0}>
									Continuar <ChevronRightIcon className='h-4 w-4 ml-2' />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Render client selection page (Step 1)
	return (
		<div className='bg-gray-50 dark:bg-gray-950 min-h-screen'>
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
					<div className='flex items-center space-x-3'>
						<Image
							src='/assets/Logo.png'
							alt='Piper Logo'
							width={80}
							height={30}
							className='dark:filter dark:brightness-150'
						/>

						<h1 className='text-xl font-bold dark:text-white'>Nueva Orden</h1>
					</div>
					<span className='px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900/20 dark:text-green-400'>Paso 1 de 3</span>
				</div>
				<Button
					variant='outline'
					className='dark:text-gray-300 dark:border-gray-700 bg-black text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700'>
					<PrinterIcon className='h-4 w-4 mr-2' />
					Imprimir Ticket
				</Button>
			</div>

			{/* Main Content */}
			<div className='max-w-4xl mx-auto px-4 py-8'>
				<Card className='border dark:border-gray-800 dark:bg-gray-900 bg-white'>
					<CardContent className='p-6 space-y-6'>
						<div>
							<h2 className='text-xl font-bold mb-2 dark:text-white'>Selección del Cliente</h2>
							<p className='text-muted-foreground dark:text-gray-400'>Seleccione el método de identificación del cliente</p>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							<Card
								className={`border cursor-pointer hover:border-primary dark:border-gray-700 dark:bg-gray-800 ${selectedMethod === 'qr' ? 'border-primary dark:border-primary' : ''}`}
								onClick={() => handleMethodSelect('qr')}>
								<CardContent className='p-6 flex flex-col items-center text-center'>
									<div className='w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4'>
										<QrCodeIcon className='h-6 w-6 text-blue-500' />
									</div>
									<h3 className='font-medium mb-2 dark:text-white'>Escanear QR</h3>
									<p className='text-sm text-muted-foreground dark:text-gray-400'>Para clientes registrados con código QR</p>
								</CardContent>
							</Card>

							<Card
								className={`border cursor-pointer hover:border-primary dark:border-gray-700 dark:bg-gray-800 ${selectedMethod === 'search' ? 'border-primary dark:border-primary' : ''}`}
								onClick={() => handleMethodSelect('search')}>
								<CardContent className='p-6 flex flex-col items-center text-center'>
									<div className='w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-4'>
										<UserIcon className='h-6 w-6 text-purple-500' />
									</div>
									<h3 className='font-medium mb-2 dark:text-white'>Buscar Cliente</h3>
									<p className='text-sm text-muted-foreground dark:text-gray-400'>Ingrese código o nombre del cliente</p>
								</CardContent>
							</Card>

							<Card
								className={`border cursor-pointer hover:border-primary dark:border-gray-700 dark:bg-gray-800 ${selectedMethod === 'anonymous' ? 'border-primary dark:border-primary' : ''}`}
								onClick={() => handleMethodSelect('anonymous')}>
								<CardContent className='p-6 flex flex-col items-center text-center'>
									<div className='w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4'>
										<UserXIcon className='h-6 w-6 text-gray-500' />
									</div>
									<h3 className='font-medium mb-2 dark:text-white'>Orden Anónima</h3>
									<p className='text-sm text-muted-foreground dark:text-gray-400'>Continuar sin identificar al cliente</p>
								</CardContent>
							</Card>
						</div>

						<div className='pt-6 border-t dark:border-gray-700'>
							<div className='flex justify-between items-center mb-4'>
								<h3 className='text-lg font-medium dark:text-white'>Datos del Cliente</h3>
								<div className='flex items-center text-sm'>
									<span className='text-muted-foreground dark:text-gray-400 mr-2'>Saldo disponible:</span>
									<span className='font-medium dark:text-white'>$1,580.00</span>
								</div>
							</div>

							<div className='flex'>
								<div className='relative flex-1'>
									<SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />

									<Input
										placeholder='Nombre del cliente o código'
										className='pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
									/>
								</div>
								<Button className='ml-2 bg-black text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700'>
									<SearchIcon className='h-4 w-4 mr-2' />
									Buscar
								</Button>
							</div>
						</div>

						<div className='flex justify-end pt-4'>
							<Button
								className='bg-black text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700'
								onClick={handleContinue}
								disabled={!selectedMethod}>
								Continuar <ChevronRightIcon className='h-4 w-4 ml-2' />
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

// ShoppingCartIcon component for the empty cart state
function ShoppingCartIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<circle
				cx='8'
				cy='21'
				r='1'
			/>
			<circle
				cx='19'
				cy='21'
				r='1'
			/>
			<path d='M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12' />
		</svg>
	);
}
