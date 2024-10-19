'use client';


import { useUserContext } from '@/context/AuthContext';
import { useUpdateCV } from '@/lib/queryFunctions';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { ThemeToggle } from '../theme/ThemeToggle';
import { Button } from '../ui/button';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const {user} = useUserContext();
  const {mutate: updateCV, isPending} = useUpdateCV();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('USER IN SIDEBAR:', user);
  }, [user]);

  if (!user) return null;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = function(e) {
        const base64String = e.target?.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64Data = base64String.split(',')[1];

        updateCV({
          fileName: file.name,
          fileType: file.type,
          fileData: base64Data
        }, {
          onSuccess: (data) => {
            toast.success('CV uploaded and processed successfully');
            console.log('CV Text:', data.summary);
          },
          onError: () => {
            toast.error('Failed to upload and process CV');
          }
        });
      };

      reader.readAsDataURL(file);
    }
  };

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
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf,.docx"
          style={{ display: 'none' }}
        />
        <Button 
          variant="outline" 
          className='mt-10' 
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
        >
          {isPending ? 'Uploading...' : 'Upload CV'}
        </Button>
        <Button className='mt-10' onClick={() => signOut()}>Logout</Button>
      </div>
      </div>
    </aside>
  );
}
