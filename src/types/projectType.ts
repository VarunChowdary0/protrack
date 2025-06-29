import { Activity } from "./activityType";
import { Participant } from "./participantType";
import { Resource } from "./resourceType";
import { Timeline } from "./timelineType";

export enum Visibility{
    PUBLIC = "public", // anyone can view form organiation
    PRIVATE = "private", // only team members
    RESTRICTED = "restricted" // only managers
}

export enum ProjectStatus {
    COMPLETED = "completed",
    IN_PROGRESS = "in_progress",
    NOT_STARTED = "not_started",
    ON_HOLD = "on_hold",
    CANCELLED = "cancelled"
}
export interface Project {
    id: string;
    organization_id: string; // ID of the organization that owns the project
    creator_id: string; // ID of the user who created the project
    code: string; // Unique code for the project

    status: ProjectStatus; // Current status of the project

    name: string; // Name of the project
    domain: string; // Domain of the project (e.g., healthcare, education)
    problemStatement: string; // Description of the problem the project addresses
    max_team_size: number; // Maximum team size for the project
    site_link: string; // Link to the project site
    repositoryLink: string; // Link to the project repository

    visibility: Visibility;
    deadline: string; // ISO date string for the project deadline
    durationInDays: number;
    techStack: string; // split by comma


    location: string; // Location of the project, can be a city or region

    stepCompleted: number; // Current step completed in the project setup
    isDraft: number; // Indicates if the project is a draft (true) or published

    createdAt: string; // ISO date string for when the project was created
    updatedAt: string; // ISO date string for when the project was last updated
    participants?: Partial<Participant>[]; // Optional array of participants in the project
    activities?: Partial<Activity>[];
    timelines?: Partial<Timeline>[];
    resources?: Partial<Resource>[];
}