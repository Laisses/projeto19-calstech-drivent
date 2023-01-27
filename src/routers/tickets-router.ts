import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketsByTypes } from "@/controllers";

const ticketsRouter = Router();

//ticketsRouter.all("/*", authenticateToken);
ticketsRouter.get("/types", getTicketsByTypes);

//ticketsRouter.get("/");
//ticketsRouter.post("/");

export { ticketsRouter };
