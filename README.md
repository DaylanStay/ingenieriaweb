# A tener en cuenta
- El reproductor de música solo funciona por el momento con las 4 canciones a modo ejemplo de recomendados (Luego se implementarán para todas las demás colecciones pero se añadió la funcionalidad ahora para que se logre visualizar y probar que funciona correctamente).

- Nos centraremos en la vista móvil

# Entregables
- EP 2.1 :  Implementación de 7 mockups UI en el framework Ionic. Adicional los dos formularios de inicio de sesión y registro.
  
- EP 2.2: Hacer lectura de datos desde un archivo JSON (puede ser local, o alguna fuente externa de datos), y mostrarlos en alguna de las pantallas.
  
- EP2.3 Definir ell modelo de la base de datos. Algunos motores de bases de datos que se pueden utilizar son: MySQL, PostgreSQL, SQLite, MongoDB, Firebase, entre otros. Se deben incluir al menos 3 tablas o documentos. __Justificar la selección del tipo de base de datos__.
  
- EP2.4 Hacer uso de al menos dos (2) __patrones de diseño__, ya sea web o móvil, en la implementación de las pantallas, teniendo como foco principal el uso desde un dispositivo móvil.

# Caso de Estudio
Nuestro proyecto se centra principalmente en una aplicación móvil para reproducir música, lograr visualizar canciones recomendadas, armar playlists personales y poder buscar entre una serie de colecciones de música entre distintas categorias. 

Las interfaces (UI) que he implementado de acuerdo al diseño de las __UI Figma__ presentadas son: 

1. __Buscar contenido__ (Funcionalidad no implementada aún)
2. __Visualización de destacados y recomendaciones__ (Parcialmente implementado, pero no es lo definitivo y es a modo de prueba y muestra)
3. __Explorar la biblioteca__ (Parcialmente implementado, faltan mejoras y también no es definitivo, simplemente a modo de prueba y muestra)
4. __Controles de reproducción__ (Parcialmente implementado, falta aplicarlo en todas las colecciones, pero se hizo a modo de prueba y muestra con solamente recomendados)
5. __Visualización de detalles de las canciones__ (Parcialmente implementado, falta también aplicarlo a todas las colecciones y se hizo a modo de prueba y muestra solo con recomendados en la página de inicio)
6. __Crear Playlist__ (Funcionalidad no implementada aún)
7. __Agregar o eliminar canción de favoritos__ (Parcialmente implementada, faltan posibles mejoras)

Adicional 
8. Inicio de sesión (Parcialmente implementado, falta la verificación correcta pero aún no se tiene implementada la base de datos para ello)
9. Registro (Parcialmente implementado, falta el guardado de datos en base de datos)

# Propuesta 
Nuestra propuesta es una aplicación web/móvil responsiva. 

La base de datos que he seleccionado es relacional, el motor de la base de datos a usar es PostgreSQL 

[Modelo de la BD](EP2/DB.png)

# Justificación

Se decidió por usar PostgreSQL porque ofrece una gran capacidad de flexibilidad y rendimiento siendo capaz de manejar una gran variedad de relaciones complejas, como lo es la relación de usuarios con playlists, donde cada usuario puede disponer de varias playlists, que a su vez cada playlists cuenta con una cierta diversidad de canciones, además es importante mencionar que estas relaciones las maneja a través de las claves foráneas, permitiendo así diseñar una base de datos relacional bien estructurada. 

Como añadidura cabe mencionar que tiene soporte para JSON lo cual es útil para almacenar información con datos menos estrictos, como las preferencias personalizadas del usuario o información de sesión, sin perder la integridad relacional.

Otro punto importante es que PostgreSQL es muy eficiente para manejar grandes volúmenes de datos y tiene un buen rendimiento en consultas complejas ofreciendo escalabilidad y rendimiento.