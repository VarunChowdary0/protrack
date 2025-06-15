import { Activity } from "./activityType";
import { Participant } from "./participantType";
import { Resourse } from "./resourseType";
import { Timeline } from "./timelineType";

export enum Visibility{
    PUBLIC = "public", // anyone can view form organiation
    PRIVATE = "private", // only team members
    RESTRICTED = "restricted" // only managers
}
export interface Project {
    id: string;
    code: string; // Unique code for the project
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
    createdAt: string; // ISO date string for when the project was created
    updatedAt: string; // ISO date string for when the project was last updated
    participants?: Participant[]; // Optional array of participants in the project
    activities?: Activity[];
    timelines?: Timeline[];
    resourses?: Resourse[];
}