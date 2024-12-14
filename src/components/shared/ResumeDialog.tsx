import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useUserContext } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

const ResumeDialog = ({isDialogOpen, setIsDialogOpen}: {isDialogOpen: boolean, setIsDialogOpen: (open: boolean) => void}) => {
    const {user} = useUserContext();
    
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resume</DialogTitle>
            <DialogDescription>Manage your resume</DialogDescription>
          </DialogHeader>
          <div>
                      <h3 className="font-medium">File name:</h3>
                      <p className="text-muted-foreground">{user?.cv_file_name}</p>
                    </div>
          
          <Accordion type="single" collapsible>
            <AccordionItem value="suggestions">
              <AccordionTrigger>CV Suggestions</AccordionTrigger>
              <AccordionContent>
                {/* Add your CV suggestions content here */}
                 <div>
                      
                      <p className="whitespace-pre-wrap text-muted-foreground">{user?.cv_suggestions}</p>
                    </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="content">
              <AccordionTrigger>Resume Content</AccordionTrigger>
              <AccordionContent>
                {user?.cv_file_name ? (
                  
                    
                    <div>
                      
                      <p className="whitespace-pre-wrap text-muted-foreground">{user.cv_full_text}</p>
                    </div>
                  
                ) : (
                  <p>No resume found</p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogContent>
      </Dialog>
    );
}

export default ResumeDialog;