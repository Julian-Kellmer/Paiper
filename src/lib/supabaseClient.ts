import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if user is admin
export const isUserAdmin = async () => {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return false;

	const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

	return profile?.role === 'admin';
};

// Helper function to get current user's role
export const getUserRole = async () => {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;

	const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

	return profile?.role;
};

// export const getUser = async () => {
// 	const {
// 		data: { user },
// 	} = await supabase.auth.getUser();
// 	return user;
// };

// export const signOut = async () => {
// 	const { error } = await supabase.auth.signOut();
// 	if (error) {
// 		console.error('Error signing out:', error.message);
// 	}
// };

// export const getCurrentSession = async () => {
// 	const {
// 		data: { session },
// 	} = await supabase.auth.getSession();
// 	return session;
// };
