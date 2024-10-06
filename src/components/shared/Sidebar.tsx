'use client';


import { useUserContext } from '@/context/AuthContext';
import { useUpdateCV } from '@/lib/queryFunctions';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useEffect } from 'react';
import { ThemeToggle } from '../theme/ThemeToggle';
import { Button } from '../ui/button';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const {user} = useUserContext();
  const {mutate: updateCV} = useUpdateCV();

  useEffect(() => {
    console.log('USER IN SIDEBAR:', user);
  }, [user]);

  if (!user) return null;

 
 
  return (
    <aside className={`bg-gray-800 text-white w-64 min-h-screen ${isOpen ? '' : 'hidden'} md:block`}>
      <div className='flex justify-between items-center px-4 mt-4'>
        <h1 className='text-2xl font-bold'>AppTitle</h1>
        <ThemeToggle />
      </div>
      <div className="p-4">
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          Toggle Sidebar
        </button>
        <div className='flex flex-col items-center justify-center'>
          <div className="flex items-center justify-between mb-4">
            {user.image && (
              <Image
                src={user.image}
                alt="Profile picture"
                width={60}
                height={60}
                className="rounded-full"
              />
            )}
          </div>
          <p className="mb-4 font-bold">@{user.name || "No username set"}</p>
        <Button variant="outline" className='mt-10' onClick={() => updateCV({cv: "test", email: user.email})}>Write test CV</Button>
        <Button className='mt-10' onClick={() => signOut()}>Logout</Button>
      </div>
      </div>
    </aside>
  );
}