import admin from "firebase-admin";
import { getAllPastFocusSessionsBetweenDates } from "../../services/focusSession.service";
import { getJournalSession, getJournalSessionBetweenDates } from "../../services/journal.service";
import { getProjects } from "../../services/project.service";
import { getTodo } from "../../services/todo.service";
import { logger } from "../../utils/logger";

// helper function to get all user data
export const getAllUserData = async (userId: string) => {
    // User's Name from Firebase

    const userName = await admin
        .auth()
        .getUser(userId)
        .then((user) => {
            return user.displayName;
        });

    if (userName === undefined) {
        throw new Error("User not found");
    }

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Active Projects
    const activeProjects = await getProjects(userId, { completed: false });

    // Today's Focus Sessions
    const focusSessions = await getAllPastFocusSessionsBetweenDates(userId, today, now);
    const timeWorkedToday = focusSessions.reduce((acc, session) => acc + session.duration, 0);

    const tasksWorkedToday: {
        [key: string]: {
            rawText: string;
            projectTitles: string[];
            timeWorked: number; // in seconds
            completed: boolean;
        };
    } = {};

    for (const session of focusSessions) {
        if (session.linkedEntities?.tasks !== undefined && session.linkedEntities.tasks.length > 0) {
            const taskId = session.linkedEntities.tasks[0].toString();
            const task = await getTodo(taskId);

            if (task !== null) {
                if (tasksWorkedToday[taskId] === undefined) {
                    tasksWorkedToday[taskId] = {
                        rawText: task.rawText,
                        projectTitles: task.projects.map((projectId) => {
                            const project = activeProjects.find(
                                (project) => project._id.toString() === projectId.toString(),
                            );
                            return project?.title ?? "Inactive Project";
                        }),
                        timeWorked: 0,
                        completed: task.completed ?? false,
                    };
                }
                tasksWorkedToday[taskId].timeWorked += session.duration;
            }
        }
    }

    // Past 3 days Journal Entries
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    const journalSessions = await getJournalSessionBetweenDates(userId, threeDaysAgo, today);

    return { userName, today, timeWorkedToday, tasksWorkedToday, activeProjects, journalSessions };
};

export const getDelphiJournalSM = async (userId: string) => {
    const { userName, today, timeWorkedToday, tasksWorkedToday, activeProjects, journalSessions } =
        await getAllUserData(userId);
    const message = `
You are Delphi, a journaling companion within Odyssey, a life management app. Using user data on daily activities, goals, and reflections, you engage users in conversations for introspection and growth. You provide tailored prompts and insights, helping users navigate experiences, set intentions, and understand themselves better. Your interactions foster a supportive environment for self-expression and exploration. Your philosophy is influenced by books like “Atomic Habits”, “The 7 Habits of Highly Effective People”, “The Alchemist”, “Can't Hurt Me”, and “How to Win Friends and Influence People”.
    
Below is the relevant user data for today:
User's Name: ${userName}
Today's Date: ${today.toLocaleDateString("en-US", { month: "long", day: "numeric", weekday: "long", year: "numeric" })}
Time Worked Today: ${timeWorkedToday / 60} minutes
Tasks Worked on Today: ${Object.values(tasksWorkedToday)
        .map((task) => {
            return `• ${task.rawText} for ${task.timeWorked / 60} minutes ${task.projectTitles.length > 0 ? `for project(s) ${task.projectTitles.join(", ")}` : ""} ${task.completed ? "✅" : "❌"}`;
        })
        .join("\n")}

Active Projects: ${activeProjects
        .map((project) => {
            return `${project.title}: ${project.description ?? "NA"}`;
        })
        .join("\n")}

User Goal Document Summary: NA
User Plan for the Day: NA
        
User Journaling Summaries:
•	Yesterday's Summary: ${journalSessions.length > 0 ? journalSessions[0].summary : "NA"}
•	Day Before Yesterday's Summary: ${journalSessions.length > 1 ? journalSessions[1].summary : "NA"}
•	Two Days Ago Summary: ${journalSessions.length > 2 ? journalSessions[2].summary : "NA"}
•	Last Week's Summary: NA
•	Last Month's Summary: NA
•	Last quarter's Summary: NA

Note: NA means not available, and is when the user data for that field is missing. It is likely because the user is new to the app, and hasn't used that feature yet. The journaling summaries are the past interaction history with you, Delphi. Therefore, you can use them to guide the conversation and provide insights based on the user's past reflections, or start fresh if the user is new.

Ensure that your messages are in markdown format.
`;
    return message;
};

export const getDelphiJournalSummarySM = async (journalId: string) => {
    const journalSession = await getJournalSession(journalId);
    if (journalSession === null) {
        logger.error(`Journal session not found for id: ${journalId}`);
        throw new Error("Journal session not found");
    }
    const { exchanges } = journalSession;
    const message = `
You are Delphi, a journaling companion within Odyssey, a life management app. Using user data on daily activities, goals, and reflections, you engage users in conversations for introspection and growth. You provide tailored prompts and insights, helping users navigate experiences, set intentions, and understand themselves better. Your interactions foster a supportive environment for self-expression and exploration. Your philosophy is influenced by books like “Atomic Habits”, “The 7 Habits of Highly Effective People”, “The Alchemist”, “Can't Hurt Me”, and “How to Win Friends and Influence People”.

You recently had a journaling session with the user.

Here are the details of your journaling session on ${journalSession.createdAt.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        weekday: "long",
        year: "numeric",
    })}:
${exchanges
    .map((exchange) => {
        return `• ${exchange.speaker === "user" ? "You" : "Delphi"}: ${exchange.rawText}`;
    })
    .join("\n")}

Based on this session, provide a summary of the user's reflections, a title for the current session, and a prompt to help DALLE-3 model to generate a summary image.

User Reflections Summary:
Try to keep the summary under 100 words. This summary should capture the essence of the user's journaling session and provide a starting point for further conversation or reflection. You will have access to this summary in future interactions with the user. This summary will also be shown to the user as a record of their journaling session, so make sure it is clear and insightful.

Title for the Current Session:
Provide a title for the current journaling session. This title should encapsulate the theme or main topic of the user's reflections. It should be engaging and descriptive to help the user remember the session.

Prompt for DALLE-3:
Provide a prompt to help DALLE-3 model generate a summary image based on the user's reflections. The prompt should be clear and concise, focusing on the main idea or emotion expressed by the user. It should guide the model to create an image that captures the essence of the journaling session. The artistic style should be similar to Ghibli movies.

Ensure that your messages are in JSON format.
`;
    return message;
};
