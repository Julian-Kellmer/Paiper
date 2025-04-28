'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeftIcon, BellIcon, MinusIcon, PlusIcon, PrinterIcon, QrCodeIcon, SearchIcon, UserIcon, UserXIcon, XIcon, ArrowRightIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { Product, User } from '@/types/types';
import { orderItems } from '@/types/types';
import { useProducts } from '@/hooks/fecthProducts';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';
import { UserSelection } from './components/user-selection';
import { Menu } from './components/menu';
import Checkout from './components/checkout';

interface NewOrderProps {
	setCurrentPage: (page: string) => void;
}

interface CartItem extends Product {
	quantity: number;
}

export default function NewOrder({ setCurrentPage }: NewOrderProps) {
	// const router = useRouter();
	const [step, setStep] = useState(1);
	const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
	const [activeCategory, setActiveCategory] = useState('Bebidas');
	const [searchQuery, setSearchQuery] = useState('');
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const { products, loading, error } = useProducts();
	const [isLoading, setIsLoading] = useState(false);
	const [users, setUsers] = useState<User[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [page, setPage] = useState(1);
	const usersPerPage = 5;
	const [canContinue, setCanContinue] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isFromTable, setIsFromTable] = useState<boolean>(false);
	const [tableNumber, setTableNumber] = useState<string>('');

	// Product categories
	const categories = ['Bebidas', 'Comidas', 'Postres', 'Extras'];

	// Filter products by active category and search query
	const filteredProducts = products.filter((product: Product) => product.category === activeCategory && (searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase())));
	useEffect(() => {
		if (searchQuery.trim() === '') {
			setFilteredUsers(users);
		} else {
			const filtered = users.filter(
				(user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase()) || user.phone.includes(searchQuery)
			);
			setFilteredUsers(filtered);
		}
		setPage(1); // Reset to first page when search changes
	}, [searchQuery, users]);

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

	const handleUserSelect = (user: User) => {
		setSelectedUser(user);
		setSelectedMethod('user');
		setCanContinue(true);
	};

	const handleUserDeselect = () => {
		setSelectedUser(null);
		setSelectedMethod(null);
		setCanContinue(false);
	};

	const handleAnonymousSelect = () => {
		setSelectedUser(null);
		setSelectedMethod('anonymous');
		setCanContinue(true);
	};

	const handleContinue = () => {
		if (step === 1 && selectedMethod && (selectedUser || selectedMethod === 'anonymous')) {
			setStep(2);
		} else if (step === 2 && cartItems.length > 0) {
			setStep(3);
		} else {
			setStep(step + 1);
		}
	};

	// Calculate pagination for users
	const indexOfLastUser = page * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;
	const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
	const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

	// Calculate subtotal
	const subtotal = cartItems.reduce((sum, item) => sum + item.sale_price * item.quantity, 0);
	const tax = subtotal * 0.1; // Assuming 10% tax
	const total = subtotal + tax;

	const handleAddToCart = (product: Product) => {
		setCartItems((prevItems) => {
			const existingItem = prevItems.find((item) => item.id === product.id);

			if (existingItem) {
				return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
			}

			// Create a new cart item with all Product properties plus quantity
			const newItem: CartItem = {
				...product,
				quantity: 1,
			};

			return [...prevItems, newItem];
		});
	};

	const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
		if (newQuantity < 1) {
			handleRemoveItem(itemId);
		} else {
			setCartItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)));
		}
	};

	const handleRemoveItem = (itemId: number) => {
		setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
	};

	return (
		<div className='flex h-screen'>
			{/* Main Content Area */}
			<div className='flex-1 flex flex-col'>
				<div className='p-4 border-b flex items-center justify-between'>
					<Button
						variant='ghost'
						onClick={handleGoBack}
						className='flex items-center'>
						<ArrowLeftIcon className='h-4 w-4 mr-2' />
						Volver
					</Button>
					<div className='flex items-center space-x-4'>
						<Button
							variant='ghost'
							size='icon'>
							<BellIcon className='h-5 w-5' />
						</Button>
					</div>
				</div>

				<div className='flex-1 overflow-hidden '>
					{step === 1 && (
						<div className='p-4'>
							<UserSelection
								isFromTable={isFromTable}
								setIsFromTable={setIsFromTable}
								tableNumber={tableNumber}
								setTableNumber={setTableNumber}
								onUserSelect={handleUserSelect}
								onAnonymousSelect={handleAnonymousSelect}
								onUserDeselect={handleUserDeselect}
							/>

							{/* Add Continue/Cancel buttons for step 1 */}
							<div className='flex justify-between mt-8 max-w-3xl mx-auto '>
								<Button
									variant='outline'
									onClick={handleGoBack}>
									Cancelar
								</Button>
								<Button
									onClick={handleContinue}
									disabled={!canContinue}>
									Continuar
								</Button>
							</div>
						</div>
					)}
					{step === 2 && <Menu onAddToCart={handleAddToCart} />}
					{step === 3 && (
						<div className='	'>
							<Checkout
								isFromTable={isFromTable}
								tableNumber={tableNumber}
								cartItems={cartItems}
								selectedUser={selectedUser}
								onOrderComplete={() => {
									// Clear the cart after successful order creation
									setCartItems([]);
									// Go back to dashboard
									setCurrentPage('dashboard');
								}}
							/>
						</div>
					)}
				</div>
			</div>

			{/* Cart Sidebar - Only show in step 2 */}
			{step === 2 && (
				<div className='w-80 border-l bg-background p-4 flex flex-col'>
					<h2 className='text-xl font-bold mb-4'>Tu Pedido</h2>

					<div className='flex-1 overflow-auto'>
						{cartItems.length === 0 ? (
							<div className='text-center text-muted-foreground py-8'>Tu carrito está vacío</div>
						) : (
							<div className='space-y-4'>
								{cartItems.map((item) => (
									<Card
										key={item.id}
										className='p-4'>
										<div className='flex items-center gap-4'>
											{item.image_url && (
												<img
													src={item.image_url}
													alt={item.name}
													className='w-16 h-16 object-cover rounded'
												/>
											)}
											<div className='flex-1'>
												<h3 className='font-medium'>{item.name}</h3>
												<p className='text-sm text-muted-foreground'>
													${item.sale_price} × {item.quantity}
												</p>
											</div>
											<div className='flex items-center gap-2'>
												<Button
													variant='outline'
													size='icon'
													onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
													<MinusIcon className='h-4 w-4' />
												</Button>
												<span className='w-8 text-center'>{item.quantity}</span>
												<Button
													variant='outline'
													size='icon'
													onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
													<PlusIcon className='h-4 w-4' />
												</Button>
											</div>
										</div>
									</Card>
								))}
							</div>
						)}
					</div>

					<div className='border-t pt-4 mt-4'>
						<div className='space-y-2 mb-4'>
							<div className='flex justify-between'>
								<span className='text-muted-foreground'>Subtotal</span>
								<span>${subtotal.toFixed(2)}</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-muted-foreground'>IVA (16%)</span>
								<span>${tax.toFixed(2)}</span>
							</div>
							<div className='flex justify-between font-bold'>
								<span>Total</span>
								<span>${total.toFixed(2)}</span>
							</div>
						</div>

						<Button
							className='w-full'
							onClick={handleContinue}
							disabled={cartItems.length === 0 || isLoading}>
							{isLoading ? 'Procesando...' : 'Check Out'}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
