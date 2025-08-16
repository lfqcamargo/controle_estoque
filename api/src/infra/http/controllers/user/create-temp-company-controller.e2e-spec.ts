import { describe, expect, test } from "vitest";
import request from "supertest";
import { app } from "@/infra/server/app";
import { PrismaClient } from "../../../../../generated/prisma";

const prisma = new PrismaClient();

describe("Create Company Temp (E2E)", () => {
  test("[POST] /company", async () => {
    const userData = {
      cnpj: "63241761000155",
      companyName: "Lfqcamargo Company",
      email: "lfqcamargo@gmail.com",
      userName: "Lucas Camargo",
      password: "123456789Lfqcamargo@",
    };

    const response = await request(app.server).post("/company").send(userData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({});

    const tempCompany = await prisma.tempCompany.findFirst({
      where: {
        cnpj: userData.cnpj,
        email: userData.email,
      },
    });

    expect(tempCompany).toBeTruthy();
    expect(tempCompany?.cnpj).toBe(userData.cnpj);
    expect(tempCompany?.companyName).toBe(userData.companyName);
    expect(tempCompany?.email).toBe(userData.email);
    expect(tempCompany?.userName).toBe(userData.userName);
    expect(tempCompany?.password).not.toBe(userData.password);
    expect(tempCompany?.token).toBeTruthy();
    expect(tempCompany?.expiration).toBeInstanceOf(Date);
    expect(tempCompany?.expiration.getTime()).toBeGreaterThan(Date.now());
  });
});
