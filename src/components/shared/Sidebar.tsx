'use client';

import replace from '@/assets/icons/icon-replace.png';
import { constants } from '@/constants';
import { useUserContext } from '@/context/AuthContext';
import { useGetQuery, useMutateApi } from '@/lib';
import { CvProcessResponse } from '@/types/Cv.types';
import QueryKeys from '@/utils/queryKeys';
import { LucideLoader2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ThemeToggle } from '../theme/ThemeToggle';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const {user} = useUserContext();
  const {mutate: updateCV, isPending} = useMutateApi<CvProcessResponse, Error, {fileName: string, fileType: string, fileData: string, email: string, isReplacing: boolean}>('/api/update-cv', {
    queryKey: QueryKeys.UPDATE_CV,
    invalidate: QueryKeys.GET_CV,
  });
  const {data: cvData, refetch: refetchCv, isLoading: isCvLoading} = useGetQuery<CvProcessResponse>(`/api/getCv?email=${encodeURIComponent(user?.email || '')}`, {
    queryKey: QueryKeys.GET_CV,
    enabled: !!user?.email,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: analyzeCv, isPending: isAnalyzing } = useMutateApi<
    { tips: string[] },
    Error,
    { cvText: string }
  >('/api/analyzeCv', {
    queryKey: QueryKeys.ANALYZE_CV,
  });
  const [isCvTipsDialogOpen, setIsCvTipsDialogOpen] = useState(false);
  const [cvTips, setCvTips] = useState<string[]>([]);

  if (!user) return null;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, isReplacing = false) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = function(e) {
        const base64String = e.target?.result as string;
        const base64Data = base64String.split(',')[1];

        updateCV({
          fileName: file.name,
          fileType: file.type,
          fileData: base64Data,
          email: user?.email,
          isReplacing: isReplacing
        }, {
          onSuccess: (data) => {
            toast.success(isReplacing ? 'CV replaced successfully' : 'CV uploaded and processed successfully');
            console.log('CV Text:', data.fullText);
            console.log('CV file name:', data.fileName);
            refetchCv(); // Refetch CV data to update the UI
          },
          onError: () => {
            toast.error(isReplacing ? 'Failed to replace CV' : 'Failed to upload and process CV');
          }
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleReplaceCv = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAnalyzeCv = () => {
    if (!cvData?.fullText) {
      toast.error('No CV text available for analysis');
      return;
    }

    analyzeCv(
      { cvText: cvData.fullText },
      {
        onSuccess: (data) => {
          toast.success('CV analysis completed');
          setCvTips(data.tips);
        },
        onError: () => {
          toast.error('Failed to analyze CV');
        }
      }
    );
  };

  return (
    <aside className={`bg-gray-800 text-white w-64 min-h-screen ${isOpen ? '' : 'hidden'} md:block`}>
      <div className='flex justify-between items-center px-4 mt-4'>
        <h1 className='text-2xl font-bold'>{constants.APP_TITLE}</h1>
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
          </div>
          <p className="mb-4 font-bold text-center">@{user.name || "No username set"}</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileUpload(e, !!cvData)} // Pass true if CV exists
          accept=".pdf,.docx"
          style={{ display: 'none' }}
        />
        {!cvData ? (
          <Button 
            variant="outline" 
            className='mt-10' 
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
          >
            {isPending ? 'Uploading...' : 'Upload CV'}
          </Button>
        ) : (
          <div className='flex flex-col items-center justify-center'>
            <div className='flex gap-2 items-center justify-center'>
              <p className='text-center'>CV Uploaded:</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild className='cursor-pointer'>
                    <Image 
                      src={replace} 
                      alt='replace' 
                      width={20} 
                      height={20} 
                      onClick={handleReplaceCv}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Replace CV</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {isCvLoading && <LucideLoader2 className='animate-spin' />}
            <div className='relative'>
              <p className='text-center font-bold'>{cvData.fileName}</p>
              {cvTips && cvTips.length > 0 && <div className='absolute top-[-5px] right-0 bg-red-500 w-5 h-5 rounded-full cursor-pointer flex items-center justify-center'><p className='text-white text-xs text-center font-bold' onClick={() => setIsCvTipsDialogOpen(true)}>!</p></div>}
            </div>
              <Button onClick={handleAnalyzeCv}  disabled={isAnalyzing} className='mt-2'>{isAnalyzing ? 'Analyzing...' : 'Analyze CV'}</Button>
           
          </div>
        )}
        <Button className='mt-10' onClick={() => signOut()}>Logout</Button>
      </div>
      <Dialog open={isCvTipsDialogOpen} onOpenChange={setIsCvTipsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CV Tips</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {cvTips.map((tip, index) => (
              <p key={index}>~{tip}</p>
            ))}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
