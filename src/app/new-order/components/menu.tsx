'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart, Search, Filter, Minus, Plus } from 'lucide-react';
import { Product } from '@/types/types';
import { supabase } from '@/lib/supabaseClient';

interface MenuProps {
	onAddToCart: (item: Product) => void;
}

export function Menu({ onAddToCart }: MenuProps) {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [activeCategory, setActiveCategory] = useState('all');

	// Fetch products from Supabase
	const fetchProducts = async () => {
		try {
			setIsLoading(true);
			setError(null);

			const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });

			if (error) throw error;

			setProducts(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error fetching products');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	// Filter products based on search query and active category
	const filteredProducts = products.filter((product) => {
		const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
		if (activeCategory === 'all') return matchesSearch;
		return matchesSearch && product.category === activeCategory;
	});

	// Get unique categories from products
	const categories = ['all', ...Array.from(new Set(products.map((product) => product.category)))];

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-full'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center h-full text-red-500'>
				<p>{error}</p>
			</div>
		);
	}

	return (
		<div className='flex flex-col h-full'>
			<div className='flex items-center space-x-2 p-4'>
				<div className='relative flex-1'>
					<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						placeholder='Search products...'
						className='pl-8'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<Button
					variant='outline'
					size='icon'>
					<Filter className='h-4 w-4' />
				</Button>
			</div>

			<Tabs
				defaultValue='all'
				className='w-full'
				onValueChange={setActiveCategory}>
				<TabsList className='w-full justify-start'>
					{categories.map((category) => (
						<TabsTrigger
							key={category}
							value={category}
							className='capitalize'>
							{category}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>

			<ScrollArea className='flex-1 p-4'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{filteredProducts.map((product) => (
						<Card
							key={product.id}
							className='overflow-hidden'>
							<CardContent className='p-4'>
								<div className='aspect-square relative mb-4'>
									{product.image_url ? (
										<img
											src={product.image_url}
											alt={product.name}
											className='object-cover rounded-lg'
										/>
									) : (
										<div className='w-full h-full bg-gray-200 rounded-lg flex items-center justify-center'>
											<span className='text-gray-400'>No image</span>
										</div>
									)}
								</div>
								<h3 className='font-semibold'>{product.name}</h3>
								{product.description && <p className='text-sm text-gray-500'>{product.description}</p>}
								<div className='flex items-center justify-between mt-2'>
									<span className='font-bold'>${product.sale_price}</span>
									<Button
										variant='outline'
										size='sm'
										onClick={() => onAddToCart(product)}>
										Add to Cart
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
