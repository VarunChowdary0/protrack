"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TaskStatus } from "@/types/taskTypes"

interface ChangeTaskStatusDialogProps {
    open: boolean;
    onClose: () => void;
    onStatusChange: (newStatus: TaskStatus) => void;
    currentStatus: string;
    allowAll: boolean;
}

const ChangeTaskStatusDialog: React.FC<ChangeTaskStatusDialogProps> = ({
    open,
    onClose,
    onStatusChange,
    currentStatus,
    allowAll
}) => {
    const [status, setStatus] = React.useState<TaskStatus>(currentStatus as TaskStatus);

    const handleStatusChange = (value: TaskStatus) => {
        setStatus(value);
    };

    const handleSubmit = () => {
        onStatusChange(status);
        onClose();
    };


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className=" max-sm:bg-secondary">
                <DialogHeader>
                    <DialogTitle>Change Task Status</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                allowAll ?
                                Object.values(TaskStatus).map((statusOption) => (
                                    <SelectItem key={statusOption} value={statusOption}>
                                        {statusOption.replaceAll("_",' ')}
                                    </SelectItem>
                                ))
                                :
                                Object.values(TaskStatus).filter((sts)=> 
                                    sts !== TaskStatus.CANCELLED && sts !== TaskStatus.ON_HOLD 
                                ).map((statusOption) => (
                                    <SelectItem key={statusOption} value={statusOption}>
                                        {statusOption.replaceAll("_",' ')}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeTaskStatusDialog;