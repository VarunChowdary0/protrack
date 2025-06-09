export interface Organization {
    id: string;
    name: string;
    description: string;
    logo?: string; // Optional, in case the organization does not have a logo
    slug: string; // Unique identifier for the organization, often used in URLs
    createdAt: string;
    updatedAt: string;
    ownerId?: string; // ID of the user who owns the organization
    membersCount?: number; // Number of members in the organization
    isActive?: boolean; 
}