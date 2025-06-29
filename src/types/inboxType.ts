import { CalendarType } from "./calendarType";
import { Invitation } from "./invitationType";
import { Task } from "./taskTypes";
import { FileType } from "./documentType";
import { User } from "./userTypes";

export interface InboxAttachment{
    id: string;
    name: string;
    inboxId: string;
    type: FileType;
    size: number; // Size in bytes
}
export enum InboxItemType{
    INVITE ='invite',
    MESSAGE ='message', // normal message
    NOTIFICATION ='notification', // for notifyiing users about events calendar
    TASK ='task',
}

export interface Inbox {
    id: string;
    fromId: string; // ID of the sender
    participantId: string; // ID of the participant
    userId: string; // ID of the user
    projectId: string; // ID of the project
    title: string; // Title of the inbox item
    description: string; // Description of the inbox item

    type: InboxItemType;
    // type  == invite
    inviteId: string;
    invitation? : Invitation;
    // type == task
    taskId?: string; // Optional task
    task?: Task;
    // type == notification
    calendarId?: string; // Optional calendar
    calendarEvent?: CalendarType;

    seenAt: string; // Timestamp when the item was seen
    isArchived: boolean; // Whether the inbox item is archived
    isDeleted: boolean; // Whether the inbox item is deleted
    isStarred: boolean; // Whether the inbox item is starred
    timestamp: string; // Timestamp when the item was created
    updatedAt: string; // Timestamp when the item was last updated
    fromUser?: Partial<User>; 
    attachments?: InboxAttachment[]; // Optional attachments for the inbox item
}