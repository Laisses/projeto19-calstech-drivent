import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter.get("/?ticketId=1");
paymentsRouter.post("/process");

export { paymentsRouter };