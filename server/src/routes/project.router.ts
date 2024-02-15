// import { RequestHandler, Router } from "express";
// import { ProjectType } from "../models/project";

// const router = Router();

// const getProjects: RequestHandler = async (req, res) => {
//   const projects: ProjectType[] = [
//     {
//       id: 1,
//       title: "Project 1",
//       description: "This is a description",
//     },
//     {
//       id: 2,
//       title: "Project 2",
//       description: "This is a description",
//     },
//   ];
//   res.json(projects);
// };

// router.get("/", getProjects);

// export default router;

// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Project from "../models/project";

import data from "@emoji-mart/data";
import { init, SearchIndex } from "emoji-mart";
import { logger } from "../utils/logger";

init({ data });

export const projectRouter = express.Router();

projectRouter.get("", async (_req: Request, res: Response) => {
    logger.debug("GET /projects", "Retrieving all projects");
    try {
        const projects = (await collections.projects
            ?.find(
                {},
                {
                    timeout: true,
                    maxTimeMS: 1000,
                },
            )
            .toArray()) as Project[];

        res.status(200).send(projects);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send(error.message);
        } else {
            res.status(500).send("An unknown error occurred");
        }
    }
});

projectRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const project = await collections.projects?.findOne(query);
        res.status(200).send(project);
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

// POST
projectRouter.post("/", async (req: Request, res: Response) => {
    const project: Project = req.body;

    if (!project.title) {
        res.status(422).send("Project title is required");
        return;
    }

    if (project.completed === undefined) {
        project.completed = false;
    }

    project.date_created = new Date();
    project.date_updated = new Date();

    if (project.description === undefined) {
        project.description = "";
    }

    if (project.emoji === undefined) {
        // Search for the title first, if no matches, then split each word by space and without punctuations (order by length) and search for each word, if no matches, then use the default emoji
        const title = project.title.toLowerCase();
        const emojis = await SearchIndex.search(title);
        project.emoji = emojis?.length > 0 ? emojis[0] : undefined;

        if (!project.emoji) {
            const words = title.split(/\s+/).sort((a, b) => b.length - a.length);
            for (let i = 0; i < words.length; i++) {
                const emojis = await SearchIndex.search(words[i]);
                project.emoji = emojis?.length > 0 ? emojis[0] : undefined;
                if (project.emoji) {
                    break;
                }
            }
        }

        if (!project.emoji) {
            // star emoji
            const emojis = await SearchIndex.search("star");
            project.emoji = emojis?.length > 0 ? emojis[0] : undefined;
        }
    }

    try {
        const result = await collections.projects?.insertOne(project);

        result
            ? res.status(201).send("Project created successfully")
            : res.status(500).send("Failed to create project");
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send("An unknown error occurred");
        }
    }
});

// PUT
projectRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;
    const project = req.body as Project;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections.projects?.updateOne(query, { $set: project });

        result
            ? res.status(200).send("Project updated successfully")
            : res.status(500).send("Failed to update project");
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send("An unknown error occurred");
        }
    }
});

// DELETE
projectRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections.projects?.deleteOne(query);

        result
            ? res.status(200).send("Project deleted successfully")
            : res.status(500).send("Failed to delete project");
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send("An unknown error occurred");
        }
    }
});
