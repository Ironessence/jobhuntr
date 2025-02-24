import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AuthForm } from "./AuthForm";

export function LoginDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent
        className="sm:max-w-[425px] max-w-[90%] max-h-screen sm:h-auto overflow-hidden flex flex-col p-0 rounded-md"
        aria-describedby={undefined}
      >
        <div className="flex-none p-6">
          <DialogTitle className="text-xl font-semibold text-center">
            Welcome to ApplyNinja
          </DialogTitle>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <AuthForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
