import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AuthForm } from "./AuthForm";

export function LoginDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogDescription>Authentication</DialogDescription>
        <DialogTitle className="text-xl font-semibold text-center">
          Welcome to ApplyNinja
        </DialogTitle>
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
}
