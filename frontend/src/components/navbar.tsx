import React from 'react'
import Image from 'next/image'
import Logout from './logout';

type UserInfoProps = {
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      role?: string | null;
    };
  }

const Navbar = ({ user }: UserInfoProps) => {
  return (
    <nav className='flex flex-row justify-between items-center w-screen bg-white shadow-lg px-10 py-4'>
        <div className='flex flex-row items-center gap-2'>
            <Image src='/favicon.png' alt='logo' width={60} height={60} />
            <h1 className='text-2xl font-semibold'>{"Painel de Lojas Grupo Koch"}</h1>
        </div>
        <div className='flex flex-row items-center gap-4'>
            <div className='flex flex-col text-right'>
                <p className='font-semibold'>{user.name}</p>
                <p className='text-sm mt-[-5px]'>{user.email}</p>
            </div>
            <Logout />
        </div>   
    </nav>
  )
}

export default Navbar