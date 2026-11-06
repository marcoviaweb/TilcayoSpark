import csv, random, datetime, json
from pathlib import Path
p=Path(__file__).parent
r=random.Random(42)
names=['Valeria','Mateo','Camila','Santiago','Luciana','Daniel','Sofía','Gabriel','Isabella','Diego']
surnames=['Mamani','Flores','Quispe','Vargas','Rojas','Condori','Torres','Aguilar','López','Rivera']
clients=[dict(cliente_id=i,nombre=f'{names[(i-1)%10]} {surnames[(i-1)//10]}',carrera=['Informática','Administración','Diseño','Ingeniería','Comunicación'][(i-1)%5],ciudad=['La Paz','El Alto','Cochabamba','Santa Cruz'][r.randrange(4)]) for i in range(1,101)]
orders=[dict(pedido_id=i,cliente_id=r.randint(1,92),fecha=str(datetime.date(2026,1,1)+datetime.timedelta(days=r.randrange(180))),categoria=r.choice(['Tecnología','Papelería','Libros','Accesorios']),cantidad=r.randint(1,6),precio_unitario=f'{r.randint(10,350)}.{r.choice([0,25,50,75]):02d}') for i in range(1,1001)]
for name,rows in [('clientes',clients),('pedidos',orders)]:
 with (p/'data'/f'{name}.csv').open('w',encoding='utf-8',newline='') as f:
  w=csv.DictWriter(f,fieldnames=rows[0].keys());w.writeheader();w.writerows(rows)
assert len(clients)==100 and len(orders)==1000
assert all(1<=x['cliente_id']<=100 for x in orders)
assert len({x['pedido_id'] for x in orders})==1000
assert len({x['cliente_id'] for x in orders})==92
print('Verificados: 100 clientes, 1000 pedidos, integridad referencial y 8 clientes sin pedidos.')
