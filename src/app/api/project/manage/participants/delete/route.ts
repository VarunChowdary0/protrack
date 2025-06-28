import { db } from '@/db/drizzle';
import { participants } from '@/db/Schema/ParticipantSchema';
import { projects } from '@/db/Schema/ProjectSchema';
import { getUser } from '@/lib/GetUser';
import send_Notification from '@/lib/SendNotification';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('USER_ID ')) {
            return NextResponse.json(
                { error: 'Missing Authorization header' },
                { status: 401 }     
            );
        }
        const userId = authHeader.split(' ')[1];
        const reqFromUser = await getUser(userId);

        if (!reqFromUser.user.id) {
            return NextResponse.json(
                { error: 'User not found', action: 'LOGOUT' },
                { status: 404 }
            );
        }
        if (!reqFromUser.user.access?.createProjects && !reqFromUser.user.access?.deleteProjects) {
            return NextResponse.json(
                { error: 'Access denied',message: 'You do not have permission to delete participants' },
                { status: 403 }
            );
        }
        
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID is required' },
                { status: 400 }
            );
        }

        const [participant] = await db.select({
            userid: participants.userId,
            prjCreator: projects.creator_id,
            prjName: projects.name,
        }).from(participants)
        .leftJoin(projects, eq(participants.projectId, projects.id))
        .where(eq(participants.id, id));
        // Check if the participant is a project creator

        if (!participant) {
            return NextResponse.json(
                { error: 'Participant not found' },
                { status: 404 }
            );
        }

        if (participant.prjCreator === participant.userid) {
            return NextResponse.json(
                { error: 'Cannot delete project creator' },
                { status: 403 }
            );
        }

        await db.delete(participants).where(eq(participants.id, id));

        const nofiPayload = {
            userIds: [participant.userid],
            title: participant.prjName   || "Project Invitation",
            body: `You have been removed from the project.`,
            icon: "/favicon.ico",
            image: reqFromUser.user.profilePicture,
            renotify: true,
        }
        console.log("Notification Payload:", nofiPayload);
        send_Notification(nofiPayload);

        return NextResponse.json(
            { message: 'Participant deleted successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error deleting participant:', error);
        return NextResponse.json(
            { error: 'Failed to delete participant' },
            { status: 500 }
        );
    }
}