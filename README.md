
# Polyfen Challenge



Resumen de mi solución:

En los prospectos hay dos campos claves "más complejos" según mi crierio:

-Industria y el Título.

Así que separé esos dos campos en documents con su respectivo score
(qué en teoría debería tener su propio criterio de calificación o CRUD para que sea ajustable, pero de momento es random)

(También lo evalué para el country pero opté por dejarlo así)

Los otros datos claves son, los años de experiencia y el tamaño de la empresa

Obviamente cada prospecto va a tener mayor score cuántos más años de experiencia tenga y mayor score mientras más pequeña sea la empresa (según mi criterio, aunque esto podría ser ajustable)

Luego, el resultado de ese score también es propocional al score del título y el score de la industría, dando como resultado criterios de calficación más dinámicos (pudiendose modificar los scores por título o por industria)

Ejemplo: si la industria es "Information Technology" y esta tiene un score mayor a 3 y el prospecto tiene un score de 2, se le adicionara 1 punto, si es de 2 le addcionara 0.5, y si es 1 no le sumara nada.

Mismo princpio para para el jobTitle. 


Cabe mencionar que normalizo la cantidad de años de experiencia (a 20) y
agrego ponderación de factores de tal manera que:

La experiencia tiene un peso de 3.
El tamaño de la empresa un peso de 2.
Y el tamaño de la empresa 2.

## Documentación

Las tecnologías que usé:

-NestJS - MongoDB (en Docker)
-React + Typescript + Vite + TailWindCSS


Para levantar el Back End en local:

En la razí del proyecto ejecutar: 

``` docker compose up``` Opcional para levantar con docker

``` npm i && npm run start:dev```

(Verificar .env para cambiar parametros)

Para levantar el front: 

Dentro de la carpeta raíz abrir el directorio Front y ahí ejecutar:

``` npm i && npm run dev```

(Verificar .env para cambiar parametros)



En flujo es simple, tengo el backend organizado utilizando el flujo de NestJS:

src/modules/prospects/
src/modules/schemas/
src/modles/prospects/dtos/
src/modules/prospects/prospec.controler.ts
src/modules/prospects/prospects.service.ts

En el prospects.controller.ts están las rutas utilizadas, la que cabe recalcar es la @Post(/) donde utilizo un interceptor para validar el archivo .csv
Una vez validado, lo guardo en upload y le paso el path al prospects.service.ts

En el prospect.service.ts recibo el path del archivo subido, lo abro con la librería fast-csv y ahí inserto los jobTypes (únicos) e industryTypes (únicos)
Posterior a eso inserto los Prospects, haciendo el cálculo del score y listo, calentitos los panchos. 









## Autor
- [@Crist0829](https://www.github.com/Crist0829)

