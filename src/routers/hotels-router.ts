import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketsByTypes, getTicketByCustomer, createNewTicket } from "@/controllers";
import { ticketSchema } from "@/schemas";

const hotelsRouter = Router();

//hotelsRouter.all("/*", authenticateToken);
hotelsRouter.get("/");
hotelsRouter.get("/:hotelId");

export { hotelsRouter };