const tools = [
  [
    "Seleccionar y mostrar columnas",
    "select / SELECT",
    "clientes.select(\"cliente_id\", \"nombre\", \"ciudad\").orderBy(\"cliente_id\").show(1000, truncate=False)",
    "SELECT cliente_id, nombre, ciudad\nFROM clientes ORDER BY cliente_id",
    "Ejecuta ambas versiones y compara las columnas y el orden. show(1000, truncate=False) permite ver todas las filas de estos datos sin recortar el texto."
  ],
  [
    "Filtrar con varias condiciones",
    "filter / WHERE",
    "pedidos.filter(\n    (F.col(\"categoria\") == \"Libros\") &\n    (F.col(\"cantidad\") >= 2)\n).orderBy(\"pedido_id\").show(1000, truncate=False)",
    "SELECT * FROM pedidos\nWHERE categoria = 'Libros' AND cantidad >= 2\nORDER BY pedido_id",
    "Cada condición va entre paréntesis en PySpark. & combina condiciones con AND; | corresponde a OR. Para fechas DATE puedes comparar con fechas ISO, por ejemplo fecha >= '2026-02-01'."
  ],
  [
    "Calcular importes y redondear",
    "withColumn, round / expresión AS, ROUND",
    "pedidos.withColumn(\n    \"importe\", F.round(F.col(\"cantidad\") * F.col(\"precio_unitario\"), 2)\n).select(\"pedido_id\", \"importe\").orderBy(\"pedido_id\").show(1000, truncate=False)",
    "SELECT pedido_id,\n       ROUND(cantidad * precio_unitario, 2) AS importe\nFROM pedidos ORDER BY pedido_id",
    "withColumn crea una columna y alias le asigna un nombre a una expresión. En SQL usa AS. Puedes filtrar el importe después de crearlo; en WHERE también puedes repetir la expresión."
  ],
  [
    "Agrupar y calcular indicadores",
    "groupBy, agg / GROUP BY",
    "pedidos.groupBy(\"categoria\").agg(\n    F.count(\"*\").alias(\"numero_pedidos\"),\n    F.sum(\"cantidad\").alias(\"unidades\"),\n    F.round(F.avg(\"precio_unitario\"), 2).alias(\"precio_medio\")\n).orderBy(\"categoria\").show(1000, truncate=False)",
    "SELECT categoria, COUNT(*) AS numero_pedidos,\n       SUM(cantidad) AS unidades,\n       ROUND(AVG(precio_unitario), 2) AS precio_medio\nFROM pedidos GROUP BY categoria ORDER BY categoria",
    "COUNT(*) cuenta filas, COUNT(columna) cuenta valores no nulos, SUM suma y AVG calcula un promedio. Para agrupar por varias columnas, enuméralas tanto en groupBy como en GROUP BY. Para ingresos, suma cantidad * precio_unitario y redondea al final."
  ],
  [
    "Filtrar grupos y obtener un top",
    "filter, orderBy, limit / HAVING, ORDER BY, LIMIT",
    "pedidos.groupBy(\"categoria\").agg(\n    F.sum(\"cantidad\").alias(\"unidades\")\n).filter(F.col(\"unidades\") > 100).orderBy(\n    F.col(\"unidades\").desc(), F.col(\"categoria\").asc()\n).limit(2).show(1000, truncate=False)",
    "SELECT categoria, SUM(cantidad) AS unidades\nFROM pedidos GROUP BY categoria\nHAVING SUM(cantidad) > 100\nORDER BY unidades DESC, categoria ASC LIMIT 2",
    "WHERE filtra filas antes de agrupar; HAVING filtra grupos después. En PySpark usa filter sobre el DataFrame agregado. ASC aplica orden ascendente y DESC aplica orden descendente."
  ],
  [
    "Combinar clientes y pedidos",
    "join / INNER JOIN",
    "clientes.join(pedidos, \"cliente_id\", \"inner\").select(\n    \"cliente_id\", \"nombre\", \"pedido_id\", \"categoria\"\n).orderBy(\"pedido_id\").show(1000, truncate=False)",
    "SELECT cliente_id, nombre, pedido_id, categoria\nFROM clientes INNER JOIN pedidos USING (cliente_id)\nORDER BY pedido_id",
    "INNER JOIN conserva las filas con coincidencia. Después puedes filtrar, calcular importes y agrupar por ciudad o carrera usando las operaciones anteriores."
  ],
  [
    "Encontrar clientes sin pedidos",
    "left, isNull / LEFT JOIN, IS NULL",
    "clientes.join(pedidos, \"cliente_id\", \"left\").filter(\n    F.col(\"pedido_id\").isNull()\n).select(\"cliente_id\", \"nombre\").orderBy(\"cliente_id\").show(1000, truncate=False)",
    "SELECT cliente_id, nombre\nFROM clientes LEFT JOIN pedidos USING (cliente_id)\nWHERE pedido_id IS NULL ORDER BY cliente_id",
    "LEFT JOIN conserva todos los clientes. Si no hay pedido, sus columnas quedan nulas. Comprueba nulos con isNull() o IS NULL, nunca con = NULL."
  ],
  [
    "Contar compras y representar ceros",
    "count, coalesce / COUNT, COALESCE",
    "clientes.join(pedidos, \"cliente_id\", \"left\").groupBy(\n    \"cliente_id\", \"nombre\"\n).agg(\n    F.count(\"pedido_id\").alias(\"compras\"),\n    F.coalesce(F.sum(\"cantidad\"), F.lit(0)).alias(\"unidades\")\n).orderBy(\"cliente_id\").show(1000, truncate=False)",
    "SELECT cliente_id, nombre, COUNT(pedido_id) AS compras,\n       COALESCE(SUM(cantidad), 0) AS unidades\nFROM clientes LEFT JOIN pedidos USING (cliente_id)\nGROUP BY cliente_id, nombre ORDER BY cliente_id",
    "COUNT(pedido_id) cuenta solo valores no nulos; COUNT(*) cuenta también la fila conservada por LEFT JOIN. COALESCE sustituye un resultado nulo por cero; F.lit(0) expresa el valor constante en PySpark."
  ]
];
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
document.querySelector('#equivalence-list').innerHTML=tools.map((t,i)=>`<details class="equivalence" ${i===0?'open':''}><summary><span class="eq-number">${String(i+1).padStart(2,'0')}</span><b>${t[0]}</b><span class="eq-method">${t[1]}</span><span class="plus" aria-hidden="true"></span></summary><p class="example-instruction">${escape(t[4])}</p><div class="code-pair">${[2,3].map((n)=>`<div class="code-block"><div class="code-top ${n===3?'sql':''}">${n===2?'PYSPARK':'SQL'}<button class="copy">Copiar</button></div><pre><code>${escape((n===3 ? '%sql\n' : '')+t[n])}</code></pre></div>`).join('')}</div></details>`).join('');
const challenges=[
  {
    "title": "Compras de alto importe en un periodo",
    "level": "CONSULTA 1",
    "tags": "Fechas, filtros, cálculo, top",
    "body": "Obtén los 10 pedidos de mayor importe realizados desde el 1 de marzo de 2026, incluido, hasta el 1 de mayo de 2026, excluido. Considera solo Libros o Tecnología, con cantidad mayor o igual a 2 e importe mayor o igual a 500 Bs. Calcula importe como cantidad * precio_unitario y muéstralo con 2 decimales. Ordena por importe descendente y pedido_id ascendente.",
    "output": "pedido_id, fecha, categoria, cantidad, importe",
    "hint": "Combina el intervalo de fechas con las demás condiciones. Agrupa entre paréntesis las dos categorías conectadas por OR. Aplica el límite después de ordenar."
  },
  {
    "title": "Categorías con actividad sostenida",
    "level": "CONSULTA 2",
    "tags": "Agrupación, promedio, HAVING",
    "body": "Usa únicamente los pedidos del primer trimestre: fecha mayor o igual a 2026-01-01 y menor que 2026-04-01. Por categoría, calcula numero_pedidos, unidades_vendidas, ingresos y ticket_promedio (promedio del importe de cada pedido). Conserva las categorías con al menos 120 pedidos y más de 400 unidades vendidas. Redondea ingresos y ticket_promedio a 2 decimales al final. Ordena por ingresos descendente y categoria ascendente.",
    "output": "categoria, numero_pedidos, unidades_vendidas, ingresos, ticket_promedio",
    "hint": "El promedio solicitado corresponde a cantidad * precio_unitario, no al precio unitario. Filtra las fechas antes de agrupar y los indicadores después."
  },
  {
    "title": "Ventas por ciudad y carrera",
    "level": "CONSULTA 3",
    "tags": "INNER JOIN, varias claves, agregación",
    "body": "Combina clientes y pedidos. Considera las compras de Tecnología del primer semestre de 2026 (desde 2026-01-01 incluido hasta 2026-07-01 excluido). Por ciudad y carrera, calcula numero_pedidos, unidades_vendidas e ingresos. Conserva los grupos con al menos 8 pedidos y presenta los 6 con mayores ingresos. Redondea ingresos a 2 decimales al final. Ordena por ingresos descendente, ciudad ascendente y carrera ascendente.",
    "output": "ciudad, carrera, numero_pedidos, unidades_vendidas, ingresos",
    "hint": "La ciudad y carrera pertenecen a clientes; las cantidades y precios, a pedidos. Une primero las tablas y agrupa por las dos columnas solicitadas."
  },
  {
    "title": "Ciudades con clientes sin compras",
    "level": "CONSULTA 4",
    "tags": "LEFT JOIN, nulos, agrupación",
    "body": "Identifica los clientes que no tienen ningún pedido en todo el dataset. Agrúpalos por ciudad y calcula clientes_sin_pedidos. Muestra únicamente las ciudades que tengan al menos 2 de estos clientes. Ordena por clientes_sin_pedidos descendente y ciudad ascendente.",
    "output": "ciudad, clientes_sin_pedidos",
    "hint": "Conserva todos los clientes con una unión izquierda, identifica la ausencia de pedido y después agrupa. El filtro sobre el número de clientes se aplica a los grupos."
  },
  {
    "title": "Resumen de compras de todos los clientes",
    "level": "CONSULTA 5",
    "tags": "LEFT JOIN, agregación, nulos, promedio",
    "body": "Genera un resumen para los 100 clientes, incluidos quienes no tienen pedidos. Muestra numero_pedidos, unidades_vendidas, gasto_total y ticket_promedio (promedio del importe de sus pedidos), junto con sus datos de cliente. Los cuatro indicadores deben ser cero cuando no existan compras. Redondea gasto_total y ticket_promedio a 2 decimales al final. Ordena por gasto_total descendente y cliente_id ascendente, sin limitar las filas.",
    "output": "cliente_id, nombre, carrera, ciudad, numero_pedidos, unidades_vendidas, gasto_total, ticket_promedio",
    "hint": "Cuenta pedido_id para evitar una compra inexistente. Mantén los nulos hasta calcular los agregados y luego sustituye por cero los resultados que lo necesiten. Agrupa por todos los datos de cliente solicitados."
  }
];
let completed=[];try{completed=JSON.parse(localStorage.getItem('tilcayo-progress-v2')||'[]');if(!Array.isArray(completed))completed=[];completed=completed.filter(n=>Number.isInteger(n)&&n>=0&&n<5);}catch{}
document.querySelector('#challenge-list').innerHTML=challenges.map((c,i)=>`<article class="challenge"><div class="challenge-number">0${i+1}<span>/${String(5).padStart(2,'0')}</span></div><div class="challenge-content"><div class="challenge-meta"><span class="pill">${c.level}</span><span>${c.tags}</span></div><h3>${c.title}</h3><p>${c.body}</p><div class="output"><b>Columnas de salida</b><span>${c.output}</span></div><details class="hint"><summary>Ver orientación de Tilcayo</summary><div class="hint-content"><img src="assets/tilcayo.png" alt="Tilcayo ofrece una orientación"><p>${c.hint}</p></div></details></div><label class="complete"><input type="checkbox" data-challenge="${i}" ${completed.includes(i)?'checked':''}><span>Lo resolví en<br>ambos lenguajes</span></label></article>`).join('');
function update(){const n=document.querySelectorAll('[data-challenge]:checked').length;document.querySelector('#progress').value=n;document.querySelector('#progress-text').textContent=`${n} de 5 completados`;document.querySelectorAll('.challenge').forEach(c=>c.classList.toggle('done',c.querySelector('input').checked));}
function save(){try{localStorage.setItem('tilcayo-progress-v2',JSON.stringify([...document.querySelectorAll('[data-challenge]:checked')].map(x=>Number(x.dataset.challenge))));}catch{}}
document.querySelectorAll('[data-challenge]').forEach(el=>el.addEventListener('change',()=>{save();update();}));
document.querySelector('#reset').addEventListener('click',()=>{document.querySelectorAll('[data-challenge]').forEach(x=>x.checked=false);save();update();});update();
document.addEventListener('click',async e=>{const button=e.target.closest('.copy');if(!button)return;const code=button.closest('.code-block').querySelector('code').textContent;try{await navigator.clipboard.writeText(code);button.textContent='Copiado';setTimeout(()=>button.textContent='Copiar',1600);}catch{const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(button.closest('.code-block').querySelector('code'));selection.removeAllRanges();selection.addRange(range);document.querySelector('#toast').textContent='Código seleccionado. Usa Ctrl+C o Comando+C para copiar.';setTimeout(()=>document.querySelector('#toast').textContent='',4000);}});
