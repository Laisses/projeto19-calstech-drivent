import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getPaymentInfo, processPayment } from "@/controllers";
import { paymentSchema } from "@/schemas";

const paymentsRouter = Router();

paymentsRouter.all("/*", authenticateToken);
paymentsRouter.get("/", getPaymentInfo);
paymentsRouter.post("/process", validateBody(paymentSchema), processPayment);

export { paymentsRouter };
