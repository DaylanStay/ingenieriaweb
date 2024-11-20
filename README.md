# A tener en cuenta
- La reproducción de música está completamente funcional.

- Se ha medianamente tenido en cuenta la versión de escritorio y la versión móvil está bien implementada para la comodidad del usuario.

# Caso de Estudio
Nuestro proyecto se centra principalmente en una aplicación móvil para reproducir música, lograr visualizar canciones recomendadas, armar playlists personales y poder buscar entre una serie de colecciones de música entre distintas categorias. 

Las interfaces (UI) que he implementado de acuerdo al diseño de las __UI Figma__ presentadas son: 

1. __Buscar contenido__ (Funcionalidad implementada)
2. __Visualización de destacados y recomendaciones__ (Funcionalidad implementada
3. __Explorar la biblioteca__ (Funcionalidad implementada)
4. __Controles de reproducción__ (Funcionalidad implementada)
5. __Visualización de detalles de las canciones__ (Funcionalidad implementada)
6. __Crear Playlist__ (Funcionalidad implementada)
7. __Agregar o eliminar canción de favoritos__ (Funcionalidad implementada)

Adicional 
8. Inicio de sesión completamente implementado
9. Registro completamente implementado

# Propuesta 
Nuestra propuesta es una aplicación web/móvil responsiva. 

La base de datos que he seleccionado es relacional, el motor de la base de datos usada es PostgreSQL 

# Justificación

Se decidió por usar PostgreSQL porque ofrece una gran capacidad de flexibilidad y rendimiento siendo capaz de manejar una gran variedad de relaciones complejas, como lo es la relación de usuarios con playlists, donde cada usuario puede disponer de varias playlists, que a su vez cada playlists cuenta con una cierta diversidad de canciones, además es importante mencionar que estas relaciones las maneja a través de las claves foráneas, permitiendo así diseñar una base de datos relacional bien estructurada. 

Como añadidura cabe mencionar que tiene soporte para JSON lo cual es útil para almacenar información con datos menos estrictos, como las preferencias personalizadas del usuario o información de sesión, sin perder la integridad relacional.

Otro punto importante es que PostgreSQL es muy eficiente para manejar grandes volúmenes de datos y tiene un buen rendimiento en consultas complejas ofreciendo escalabilidad y rendimiento.
