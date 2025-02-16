import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateApplication } from "@/Ruduxtoolkit/applicationSlice"; // Import update action
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface Application {
  $id: string;
  status: string;
}

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  
}
export default function JobApplicationStatus({
  isOpen,
  onClose,
  application,
  
}: StatusModalProps) {
  const [status, setStatus] = useState<string>(application.status);
  const dispatch = useDispatch();

  const handleUpdateStatus = async () => {
    try {
      await dispatch<any>(updateApplication({ id: application.$id, data: { status } }));
      toast.success("Application status updated successfully");
      
      onClose();
    } catch (error) {
      toast.error("Failed to update application status");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Application Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <select
            className="w-full p-2 border rounded-md"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Accepted</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>Update</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
