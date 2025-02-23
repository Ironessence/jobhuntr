import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AuthForm } from "./AuthForm";

export function LoginDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-[425px]">
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
}
