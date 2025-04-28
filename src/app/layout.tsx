'use client';

import './globals.css';

import React, { useState, useEffect } from 'react';
import Layout from 'pages/layout';
import Dashboard from 'pages/dashboard';
import OrdersManagement from 'pages/orders-management';
import FinancePanel from 'pages/finance-panel';
import RoleManagement from 'pages/role-management';
import NewOrder from 'pages/new-order';
import MenuManagement from 'pages/menu-management';
import QrTracking from 'pages/qr-tracking';
import Head from 'next/head';
import { AuthProvider } from '@/context/AuthContext';
// import { AppProps } from 'next/app';

export default function App() {
	const [currentPage, setCurrentPage] = useState('dashboard');

	// Set light mode by default
	useEffect(() => {
		document.documentElement.classList.add('light');
	}, []);

	// Handle New Order button click from anywhere in the app
	const handleNewOrderClick = () => {
		setCurrentPage('new-order');
	};

	return (
		<html lang='es'>
			<body>
				
					<Head>
						<title>Paiper </title>
						<link
							rel='icon'
							href='/favicon.ico'
						/>
					</Head>
					<Layout
						// pageProps={...pageProps}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						onNewOrderClick={handleNewOrderClick}>
						{currentPage === 'dashboard' && <Dashboard setCurrentPage={setCurrentPage} />}
						{currentPage === 'orders' && <OrdersManagement />}
						{currentPage === 'finances' && <FinancePanel />}
						{currentPage === 'roles' && <RoleManagement />}
						{currentPage === 'menu' && <MenuManagement />}
						{currentPage === 'new-order' && <NewOrder setCurrentPage={setCurrentPage} />}
						{currentPage === 'qr-tracking' && <QrTracking />}

						{/* Other pages would be conditionally rendered here */}
					</Layout>
				
			</body>
		</html>
	);
}
