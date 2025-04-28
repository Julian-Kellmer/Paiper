import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export type UserRole = 'client' | 'admin' | 'master' | 'barman';

interface UserWithRole {
	id: string;
	email: string;
	role: UserRole;
}

interface AuthContextType {
	user: UserWithRole | null;
	loading: boolean;
	signIn: (
		email: string,
		password: string
	) => Promise<{
		error: any | null;
		success: boolean;
	}>
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signIn: async() => ({error: 'AuthContext not initialized', success: false}),
    signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserWithRole | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
  
    const getUserRole = async (userId: string) => {
      const { data, error } = await supabase
        .from('user_roles')  // Ajusta esto al nombre de tu tabla que almacena roles
        .select('role')
        .eq('user_id', userId)
        .single()
  
      if (error) {
        console.error('Error al obtener el rol del usuario:', error)
        return null
      }
  
      return data?.role as UserRole
    }

    const redirectBasedOnRole = (role: UserRole) => {
        // router debe estar definido en el ámbito de AuthProvider
        if (role === 'client') {
          router.push('/menu')
        } else if (['admin', 'master', 'barman'].includes(role)) {
          router.push('/dashboard')
        }
    }
    
    const signIn = async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
    
          if (error) throw error
    
          if (data.user) {
            const role = await getUserRole(data.user.id)
            
            if (role) {
              const userWithRole: UserWithRole = {
                id: data.user.id,
                email: data.user.email || '',
                role: role,
              }
              
              setUser(userWithRole)
              redirectBasedOnRole(role)  // Usa la función que tiene acceso a router
              return { error: null, success: true }
            }
          }
          
          return { error: 'No se pudo determinar el rol del usuario', success: false }
        } catch (error) {
          console.error('Error al iniciar sesión:', error)
          return { error, success: false }
        }
    }
    
    // Cerrar sesión
    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        router.push('/login')
    }
    
    useEffect(() => {
        const checkUser = async () => {
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.user) {
            const role = await getUserRole(session.user.id)
            
            if (role) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                role: role,
              })
            }
          }
          
          setLoading(false)
        }
    
        // Configurar listener para cambios de autenticación
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const role = await getUserRole(session.user.id)
            
            if (role) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                role: role,
              })
              redirectBasedOnRole(role)  // Usa la función que tiene acceso a router
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null)
          }
        })
    
        checkUser()
    
        return () => {
          authListener.subscription.unsubscribe()
        }
    }, [router])  // Incluye router en las dependencias del useEffect
    
    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
          {children}
        </AuthContext.Provider>
    )
}