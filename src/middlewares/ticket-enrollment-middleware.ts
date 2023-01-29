import { NextFunction, Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import enrollmentRepository from "@/repositories/enrollment-repository";

export const validateEnrollment = async (req: AuthenticatedRequest, res:Response, next:NextFunction) => {
    const { userId } = req;
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

    if (!enrollment) {
        return res.sendStatus(httpStatus.NOT_FOUND);
    }

    next();
};