-- CreateTable
CREATE TABLE "public"."password_token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "password_token_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."password_token" ADD CONSTRAINT "password_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
