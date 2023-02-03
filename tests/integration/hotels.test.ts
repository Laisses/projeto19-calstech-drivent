import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
    createEnrollmentWithAddress,
    createUser,
    createRemoteTicketType,
    createInPersonTicketType,
    createTicket,
    createHotel
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/hotels");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {
        it("should respond with status 404 when user doesn't have an enrollment yet", async () => {
            const token = await generateValidToken();

            const response = await server.get("/tickets").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it("should respond with status 404 when user doesn't have a ticket yet", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user);

            const response = await server.get("/tickets").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it("should respond with status 403 if ticket doesn't include hotel", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const userEnrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createRemoteTicketType();

            await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it("should respond with status 402 if ticket wasn't payed", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const userEnrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createInPersonTicketType();

            await createTicket(userEnrollment.id, ticketType.id, TicketStatus.RESERVED);

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it("should responde with status 200 and hotels list", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const userEnrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createInPersonTicketType();

            await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);
            await createHotel();
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                image: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            })]));
        });
    });
});

describe("GET /hotels/:hotelId", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/hotels");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {
        it("should respond with status 404 when user doesn't have an enrollment yet", async () => {
            const token = await generateValidToken();

            const response = await server.get("/tickets").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it("should respond with status 404 when user doesn't have a ticket yet", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user);

            const response = await server.get("/tickets").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it("should respond with status 403 if ticket doesn't include hotel", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const userEnrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createRemoteTicketType();

            await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it("should respond with status 402 if ticket wasn't payed", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const userEnrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createInPersonTicketType();

            await createTicket(userEnrollment.id, ticketType.id, TicketStatus.RESERVED);

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it("should respond with status 404 if given hotel couldn't found", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const userEnrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createInPersonTicketType();

            await createTicket(userEnrollment.id, ticketType.id, TicketStatus.PAID);
            const response = await server.get("/hotels/0").set("Authorization", `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
    });
});
