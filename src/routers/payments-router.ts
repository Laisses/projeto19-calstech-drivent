import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getPaymentInfo } from "@/controllers";

//import { ticketSchema } from "@/schemas";

const paymentsRouter = Router();

paymentsRouter.all("/*", authenticateToken);
paymentsRouter.get("/", getPaymentInfo);
paymentsRouter.post("/process");

export { paymentsRouter };
