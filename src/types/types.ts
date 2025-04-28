export interface Note {
	type: string;
	text: string;
}
export interface orderItems {
	id: number;
	name: string;
	sale_price: number;
	quantity: number;
	image_url?: string;
	description?: string;
	category?: string;
}
export interface Customer {
	name: string;
	code: string;
	avatar: string;
}
export interface Order {
	id: number;
	table: string;
	status: string;
	items: number;
	time: string;
	timeExtra?: string;
	customer: Customer;
	paymentStatus: string;
	orderTime: string;
	deliveryTime: string;
	orderItems: orderItems[];
	total: number;
	notes: Note[];
	paymentMethod:string;
}

export interface User {
	id: number;
	name: string;
	email: string;
	avatar: string;
	type: 'client' | 'master' | 'admin' | 'barman';
	status: 'active' | 'inactive';
	balance: string;
	spent: string;
	phone: string;
	address: string;
	joinDate: string;
	transactions: UserTransaction[];
}

export interface sender {
	name: string;
	avatar: string;
}
export interface drink {
	name: string;
	image: string;
	category: string;
}
export interface gifts {
	id: string;
	sender?: sender;
	recipient?: {
		name: string;
		avatar?: string;
		table?: string;
	};
	drink: drink;
	message?: string;
	timestamp: string;
	status: 'pending' | 'redeemed' | 'expired';
}

export interface guest {
	id: number;
	name: string;
	table: string;
	avatar: string;
	status: 'active' | 'decline' | 'rest';
}

export interface table {
	id: number;
	name: string;
	capacity: number;
	status: 'free' | 'occupied';
}
export interface drinks {
	id: number;
	name: string;
	category: string;
	price: string;
	image: string;
	available: boolean;
}

export interface MetricData {
	id: string;
	title: string;
	value: string;
	icon: string;
	color: string;
}

export interface OrderItem {
	name: string;
	quantity: number;
	price: number;
}

export interface OrderNote {
	type: 'allergy' | 'preference';
	text: string;
}

export interface OrderCustomer {
	name: string;
	code: string;
	avatar: string;
}

export interface Order {
	id: number;
	table: string;
	customer: OrderCustomer;
	status: string;
	paymentStatus: string;
	orderTime: string;
	deliveryTime: string;
	items: number;
	total: number;
	notes: Note[];
}

// Rename to avoid conflict with existing interfaces
export interface OrderManagementItem {
	name: string;
	quantity: number;
	price: number;
}

export interface OrderManagementNote {
	type: 'allergy' | 'preference';
	text: string;
}

export interface OrderManagementCustomer {
	name: string;
	code: string;
	avatar: string;
}

export interface OrderManagement {
	id: string;
	table: string;
	customer: OrderManagementCustomer;
	status: 'new' | 'preparation' | 'ready' | 'completed' | 'delayed';
	paymentStatus: 'Pagado' | 'Pendiente';
	orderTime: string;
	deliveryTime: string;
	items: OrderManagementItem[];
	total: number;
	notes: OrderManagementNote[];
}

export interface UserTransaction {
	id: string;
	date: string;
	amount: string;
	type: 'Compra' | 'Recarga';
	status: 'Completada' | 'Pendiente';
	method: 'Tarjeta' | 'Efectivo' | 'Transferencia' | 'Saldo';
}

export interface Product {
	id: number;
	name: string;
	description?: string;
	category: string;
	stock: string;
	image_url: string;
	purchase_price: number;
	sale_price: number;
	created_at: string;
	updated_at: string;
}

export interface CartItem extends Product {
	quantity: number;
}
