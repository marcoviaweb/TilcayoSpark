# TilcayoSpark

Página educativa estática en español. Incluye conceptos, dos CSV sintéticos, preparación en Databricks y ocho equivalencias ejecutables sobre clientes y pedidos. Los cinco retos sin soluciones combinan fechas, cálculos, agregaciones, filtros de grupos y uniones. Tilcayo es una ilustración original en assets/tilcayo.png.

## Ejecutar localmente

Desde esta carpeta: `python -m http.server 8081 --bind 127.0.0.1`

Abrir http://127.0.0.1:8081. No requiere instalación ni compilación. Las fuentes de Google son opcionales: hay fuentes de respaldo del sistema. El progreso se guarda solo en el navegador y puede reiniciarse.

## Repositorio independiente y GitHub Pages

Repositorio: https://github.com/marcoviaweb/TilcayoSpark

Sitio: https://marcoviaweb.github.io/TilcayoSpark/

GitHub Pages sirve la carpeta raíz de la rama main. Todos los recursos locales usan rutas relativas, compatibles con páginas de proyecto. El sitio no requiere compilación.

## Datos

100 clientes, 1000 pedidos; semilla 42. Ocho clientes sin compras, claves únicas, sin claves huérfanas ni nulos. Moneda: bolivianos. Periodo: primer semestre de 2026. Cada fila de pedidos representa una compra de una categoría. Para regenerar y verificar: `python generate.py`. No hay datos personales reales.

## Validación

Se comprobaron los enlaces internos, los recursos y ambas descargas mediante HTTP: los CSV descargados coinciden con los originales. Se verificaron cantidades de registros, claves únicas, relaciones, fechas, campos completos e importes con dos decimales.

Los ocho ejemplos SQL y las cinco consignas se ejecutaron sobre los CSV con SQLite para comprobar su viabilidad. Los retos producen respectivamente 10, 3, 6, 3 y 100 filas. El último conserva los ocho clientes sin compras con indicadores cero. Se revisó la sintaxis de los ejemplos Python y del JavaScript. Esta comprobación no sustituye la ejecución en Spark: PySpark no está instalado localmente y no se dispone de una sesión conectada de Databricks. No se han validado en ese entorno los tipos resultantes ni los planes de ejecución.

La página no ejecuta Spark: los estudiantes trabajan en Databricks. Las casillas registran autoevaluación y no corrigen consultas. La preparación requiere catálogo, esquema y cómputo con permisos. Las soluciones de los retos no se incluyen en el sitio.

Referencias: https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/dataframe.html y https://docs.databricks.com/aws/en/ingestion/create-or-modify-table
