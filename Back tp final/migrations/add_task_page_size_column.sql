-- Migración para agregar task_page_size a la tabla usersettings
-- Ejecutar este script en tu base de datos SQL Server

-- Verificar si la columna ya existe
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'usersettings' AND COLUMN_NAME = 'task_page_size'
)
BEGIN
    -- Agregar la columna task_page_size con valor por defecto de 10
    ALTER TABLE usersettings
    ADD task_page_size int NOT NULL DEFAULT 10;
    
    PRINT 'Columna task_page_size agregada exitosamente';
END
ELSE
BEGIN
    PRINT 'La columna task_page_size ya existe';
END

-- Verificar la estructura de la tabla después de la migración
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'usersettings'
ORDER BY ORDINAL_POSITION;
