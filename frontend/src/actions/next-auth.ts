"use server";
import { redirect } from 'next/navigation';
import { auth, signIn, signOut } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function login(prevStat: any, formData: FormData) {
    let error;
    try{
        const username = formData.get('username');
        const password = formData.get('password');
        
        await signIn("credentials", { 
            username: username, 
            password: password,
            redirect: false
        });

        return { message: 'Login efetuado'}
    } catch(e){
        console.log(e)
        error = true;
        return { message: 'Usuário ou senha incorreto'}
    } finally{
        if (!error){
            redirect('/');
        }
    }
}

export async function logout(prevStat?: any){
    let error;
    try{
        await signOut({
            redirect: false
        });

        revalidatePath('/')
    } catch(e){
        console.log(e);
        error = true;
    } finally{
        if (!error){
            redirect('/?logout=true');
        }
    }
}