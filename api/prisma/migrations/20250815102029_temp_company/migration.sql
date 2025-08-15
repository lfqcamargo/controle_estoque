-- CreateTable
CREATE TABLE "public"."temp_company" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "temp_company_pkey" PRIMARY KEY ("id")
);
