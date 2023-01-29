import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getTicketsByTypes, getTicketByCustomer, createNewTicket } from "@/controllers";
import { ticketSchema } from "@/schemas";

const ticketsRouter = Router();

ticketsRouter.all("/*", authenticateToken);
ticketsRouter.get("/types", getTicketsByTypes);
ticketsRouter.get("/", getTicketByCustomer);
ticketsRouter.post("/", validateBody(ticketSchema), createNewTicket);

export { ticketsRouter };
