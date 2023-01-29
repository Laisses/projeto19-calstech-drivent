import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketsByTypes, getAllTickets } from "@/controllers";

const ticketsRouter = Router();

//ticketsRouter.all("/*", authenticateToken);
ticketsRouter.get("/types", getTicketsByTypes);
ticketsRouter.get("/", getAllTickets);
ticketsRouter.post("/");

export { ticketsRouter };
