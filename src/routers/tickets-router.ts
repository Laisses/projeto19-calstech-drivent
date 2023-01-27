import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter.get("/");
ticketsRouter.get("/types");
ticketsRouter.post("/");

export { ticketsRouter };
