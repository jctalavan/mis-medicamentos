-- CreateTable
CREATE TABLE "medicamentos" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "principio_activo" TEXT,
    "categoria" TEXT,
    "fecha_caducidad" DATE,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "unidad" TEXT NOT NULL DEFAULT 'comprimidos',
    "dosis" TEXT,
    "indicaciones" TEXT,
    "notas" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "medicamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "administraciones" (
    "id" UUID NOT NULL,
    "medicamento_id" UUID NOT NULL,
    "fecha" TIMESTAMPTZ NOT NULL,
    "notas" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "administraciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "medicamentos_nombre_idx" ON "medicamentos"("nombre");

-- CreateIndex
CREATE INDEX "medicamentos_activo_idx" ON "medicamentos"("activo");

-- CreateIndex
CREATE INDEX "medicamentos_fecha_caducidad_idx" ON "medicamentos"("fecha_caducidad");

-- CreateIndex
CREATE INDEX "administraciones_medicamento_id_idx" ON "administraciones"("medicamento_id");

-- CreateIndex
CREATE INDEX "administraciones_fecha_idx" ON "administraciones"("fecha" DESC);

-- AddForeignKey
ALTER TABLE "administraciones" ADD CONSTRAINT "administraciones_medicamento_id_fkey" FOREIGN KEY ("medicamento_id") REFERENCES "medicamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
