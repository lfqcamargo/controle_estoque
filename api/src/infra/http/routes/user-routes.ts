import { FastifyInstance } from "fastify/types/instance";
import { container } from "tsyringe";
import { CreateTempCompanyController } from "../controllers/user/create-temp-company-controller";

export async function userRoutes(app: FastifyInstance) {
  const createTempCompanyController = container.resolve(
    CreateTempCompanyController
  );

  app.post(
    "/company",
    createTempCompanyController.handle.bind(createTempCompanyController)
  );
}
