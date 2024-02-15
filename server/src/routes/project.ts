import { RequestHandler, Router } from "express";
import { ProjectType } from "../models/project";

const router = Router();

const getProjects: RequestHandler = async (req, res) => {
  const projects: ProjectType[] = [
    {
      id: 1,
      title: "Project 1",
      description: "This is a description",
    },
    {
      id: 2,
      title: "Project 2",
      description: "This is a description",
    },
  ];
  res.json(projects);
};

router.get("/", getProjects);

export default router;
