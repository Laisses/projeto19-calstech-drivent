import { Router } from "express";
import { authenticateToken, validateBody, validateEnrollment } from "@/middlewares";
import { getTicketsByTypes, getTicketByCustomer, createNewTicket } from "@/controllers";
import { ticketSchema } from "@/schemas";

const ticketsRouter = Router();

ticketsRouter.all("/*", authenticateToken);
ticketsRouter.get("/types", getTicketsByTypes);
ticketsRouter.get("/", validateEnrollment, getTicketByCustomer);
ticketsRouter.post("/", validateBody(ticketSchema), validateEnrollment, createNewTicket);

export { ticketsRouter };
