require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

// Conexión a la base de datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());

// Clave secreta JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Registrarse
app.post('/api/register', async (req, res) => {
  try {
    const { username, rut, email, region, comuna, password } = req.body;

    // Valida si el usuario ya existe
    const userCheck = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Se proteje la contraseña con Hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Se inserta el nuevo usuario en la base de datos
    const result = await pool.query(
      'INSERT INTO usuarios (username, rut, email, region, comuna, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [username, rut, email, region, comuna, hashedPassword]
    );

    const token = jwt.sign({ id: result.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error de servidor' });
  }
});

// Iniciar sesión
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Valida si el usuario existe
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Credenciales invalidas' });
    }

    const user = result.rows[0];

    // Valida la contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciales invalidas' });
    }

    // Crea y asigna el token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error de servidor' });
  }
});

// Ruta protegida
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Esta es una ruta protegida', user: req.user });
});

// Función auxiliar para validar y analizar enteros
const parseIntSafe = (value) => {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error('Entero invalido');
  }
  return parsed;
};

// Obtener canciones recomendadas
app.get('/api/recommended-songs', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.title, c."coverUrl", c."audioUrl", c.type, a.name as artist
      FROM canciones c
      JOIN artistas a ON c.artist_id = a.id
      ORDER BY RANDOM()
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener artistas recomendados
app.get('/api/recommended-artists', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.name, a.description, a."imageUrl"
      FROM artistas a
      ORDER BY RANDOM()
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener detalles de la canción
app.get('/api/songs/:id', async (req, res) => {
  try {
    const id = parseIntSafe(req.params.id);
    const result = await pool.query(`
      SELECT c.id, c.title, c."coverUrl", c."audioUrl", al.title as album, c.year, c.genre, c.duration, a.name as artist
      FROM canciones c
      JOIN artistas a ON c.artist_id = a.id
      LEFT JOIN albumes al ON c.album_id = al.id
      WHERE c.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Canción no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Identificador invalido de la canción' });
  }
});

// Obtener detalles del artista
app.get('/api/artists/:id', async (req, res) => {
  try {
    const id = parseIntSafe(req.params.id);
    const result = await pool.query(`
      SELECT id, name, description, "imageUrl"
      FROM artistas
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artista no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Identificador invalido del artista' });
  }
});

// Obtener canciones del artista
app.get('/api/artists/:id/songs', async (req, res) => {
  try {
    const id = parseIntSafe(req.params.id);
    const result = await pool.query(`
      SELECT c.id, c.title, c."coverUrl", c."audioUrl", c.type
      FROM canciones c
      WHERE c.artist_id = $1
    `, [id]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Identificador invalido del artista' });
  }
});

// Realizar la búsqueda
app.get('/api/search', async (req, res) => {
  try {
    const { q, category } = req.query;
    let query = '';
    let params = [`%${q}%`];

    if (category === 'all' || !category) {
      query = `
        SELECT c.id, c.title, 'song' as type, c."coverUrl", c."audioUrl", a.name as artist
        FROM canciones c
        JOIN artistas a ON c.artist_id = a.id
        WHERE c.title ILIKE $1 OR a.name ILIKE $1
        UNION ALL
        SELECT id, name as title, 'artist' as type, "imageUrl" as "coverUrl", NULL as "audioUrl", NULL as artist
        FROM artistas
        WHERE name ILIKE $1
        UNION ALL
        SELECT al.id, al.title, 'album' as type, al."coverUrl", NULL as "audioUrl", a.name as artist
        FROM albumes al
        JOIN artistas a ON al.artist_id = a.id
        WHERE al.title ILIKE $1 OR a.name ILIKE $1
        LIMIT 50
      `;
    } else {
      switch (category) {
        case 'song':
          query = `
            SELECT c.id, c.title, 'song' as type, c."coverUrl", c."audioUrl", a.name as artist
            FROM canciones c
            JOIN artistas a ON c.artist_id = a.id
            WHERE c.title ILIKE $1 OR a.name ILIKE $1
            LIMIT 50
          `;
          break;
        case 'artist':
          query = `
            SELECT id, name as title, 'artist' as type, "imageUrl" as "coverUrl", NULL as "audioUrl", NULL as artist
            FROM artistas
            WHERE name ILIKE $1
            LIMIT 50
          `;
          break;
        case 'album':
          query = `
            SELECT al.id, al.title, 'album' as type, al."coverUrl", NULL as "audioUrl", a.name as artist
            FROM albumes al
            JOIN artistas a ON al.artist_id = a.id
            WHERE al.title ILIKE $1 OR a.name ILIKE $1
            LIMIT 50
          `;
          break;
        default:
          return res.status(400).json({ error: 'Categoría invalida' });
      }
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener detalles del album
app.get('/api/albums/:id', async (req, res) => {
  try {
    const id = parseIntSafe(req.params.id);
    const result = await pool.query(`
      SELECT al.id, al.title, al."coverUrl", al.release, a.name as artist
      FROM albumes al
      JOIN artistas a ON al.artist_id = a.id
      WHERE al.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Album no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Identificador invalido del album' });
  }
});

// Obtener canciones del album
app.get('/api/albums/:id/songs', async (req, res) => {
  try {
    const id = parseIntSafe(req.params.id);
    const result = await pool.query(`
      SELECT c.id, c.title, c."coverUrl", c."audioUrl", c.type, a.name as artist
      FROM canciones c
      JOIN artistas a ON c.artist_id = a.id
      WHERE c.album_id = $1
    `, [id]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Identificador invalido del Album' });
  }
});

// Agregar canción favorita
app.post('/api/favorites/songs', authenticateToken, async (req, res) => {
  try {
    const { user_id, song_id } = req.body;
    const result = await pool.query(
      'INSERT INTO favoritos_canciones (user_id, song_id) VALUES ($1, $2) RETURNING *',
      [user_id, song_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar canción favorita
app.delete('/api/favorites/songs', authenticateToken, async (req, res) => {
  try {
    const { user_id, song_id } = req.body;
    await pool.query(
      'DELETE FROM favoritos_canciones WHERE user_id = $1 AND song_id = $2',
      [user_id, song_id]
    );
    res.json({ message: 'Canción favorita eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Agregar artista favorito
app.post('/api/favorites/artists', authenticateToken, async (req, res) => {
  try {
    const { user_id, artist_id } = req.body;
    const result = await pool.query(
      'INSERT INTO favoritos_artistas (user_id, artist_id) VALUES ($1, $2) RETURNING *',
      [user_id, artist_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar artista favorito
app.delete('/api/favorites/artists', authenticateToken, async (req, res) => {
  try {
    const { user_id, artist_id } = req.body;
    await pool.query(
      'DELETE FROM favoritos_artistas WHERE user_id = $1 AND artist_id = $2',
      [user_id, artist_id]
    );
    res.json({ message: 'Artista favorito eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Agregar álbum favorito
app.post('/api/favorites/albums', authenticateToken, async (req, res) => {
  try {
    const { user_id, album_id } = req.body;
    const result = await pool.query(
      'INSERT INTO favoritos_albumes (user_id, album_id) VALUES ($1, $2) RETURNING *',
      [user_id, album_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar álbum favorito
app.delete('/api/favorites/albums', authenticateToken, async (req, res) => {
  try {
    const { user_id, album_id } = req.body;
    await pool.query(
      'DELETE FROM favoritos_albumes WHERE user_id = $1 AND album_id = $2',
      [user_id, album_id]
    );
    res.json({ message: 'Álbum favorito eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todos los favoritos del usuario
app.get('/api/favorites/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Obtener canciones favoritas
    const favoriteSongs = await pool.query(
      `SELECT f.song_id as id, c.title, c."coverUrl", c."audioUrl", 'song' as type, a.name as artist
       FROM favoritos_canciones f
       JOIN canciones c ON f.song_id = c.id
       JOIN artistas a ON c.artist_id = a.id
       WHERE f.user_id = $1`,
      [userId]
    );

    // Obtener artistas favoritos
    const favoriteArtists = await pool.query(
      `SELECT f.artist_id as id, a.name as title, a."imageUrl" as coverUrl, 'artist' as type
       FROM favoritos_artistas f
       JOIN artistas a ON f.artist_id = a.id
       WHERE f.user_id = $1`,
      [userId]
    );

    // Obtener álbumes favoritos
    const favoriteAlbums = await pool.query(
      `SELECT f.album_id as id, al.title, al."coverUrl", 'album' as type, a.name as artist
       FROM favoritos_albumes f
       JOIN albumes al ON f.album_id = al.id
       JOIN artistas a ON al.artist_id = a.id
       WHERE f.user_id = $1`,
      [userId]
    );

    res.json({
      songs: favoriteSongs.rows,
      artists: favoriteArtists.rows,
      albums: favoriteAlbums.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear una nueva playlist
app.post('/api/playlists', authenticateToken, async (req, res) => {
  try {
    const { name, description, privacy, userId, songs } = req.body;
    const result = await pool.query(`
      INSERT INTO playlists (name, description, privacy, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, [name, description, privacy, userId]);

    const playlistId = result.rows[0].id;

    // Agregar canciones a la playlist
    for (let songId of songs) {
      await pool.query(`
        INSERT INTO playlist_songs (playlist_id, song_id)
        VALUES ($1, $2)
      `, [playlistId, songId]);
    }

    res.status(201).json({ id: playlistId, message: 'Playlist creada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener playlists del usuario
app.get('/api/users/:userId/playlists', authenticateToken, async (req, res) => {
  try {
    const userId = parseIntSafe(req.params.userId);
    const result = await pool.query(`
      SELECT id, name, description, privacy
      FROM playlists
      WHERE user_id = $1
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Identificador inválido del usuario' });
  }
});

// Obtener detalles de la playlist
app.get('/api/playlists/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseIntSafe(req.params.id);
    const result = await pool.query(`
      SELECT p.id, p.name, p.description, p.privacy, p.user_id,
             json_agg(json_build_object('id', c.id, 'title', c.title, 'artist', a.name, 'coverUrl', c."coverUrl", 'audioUrl', c."audioUrl")) as songs
      FROM playlists p
      LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
      LEFT JOIN canciones c ON ps.song_id = c.id
      LEFT JOIN artistas a ON c.artist_id = a.id
      WHERE p.id = $1
      GROUP BY p.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Playlist no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Identificador inválido de la playlist' });
  }
});

// Agregar canción a la playlist
app.post('/api/playlists/:id/songs', authenticateToken, async (req, res) => {
  try {
    const playlistId = parseIntSafe(req.params.id);
    const { songId } = req.body;
    await pool.query(`
      INSERT INTO playlist_songs (playlist_id, song_id)
      VALUES ($1, $2)
    `, [playlistId, songId]);
    res.status(201).json({ message: 'Canción agregada a la playlist correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar canción de la playlist
app.delete('/api/playlists/:id/songs/:songId', authenticateToken, async (req, res) => {
  try {
    const playlistId = parseIntSafe(req.params.id);
    const songId = parseIntSafe(req.params.songId);
    await pool.query(`
      DELETE FROM playlist_songs
      WHERE playlist_id = $1 AND song_id = $2
    `, [playlistId, songId]);
    res.json({ message: 'Canción eliminada de la playlist correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener playlists del usuario
app.get('/api/users/:userId/playlists', authenticateToken, async (req, res) => {
  try {
    const userId = parseIntSafe(req.params.userId);
    const result = await pool.query(`
      SELECT id, name, description, privacy
      FROM playlists
      WHERE user_id = $1
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Identificador inválido del usuario' });
  }
});

// Eliminar playlist
app.delete('/api/playlists/:id', authenticateToken, async (req, res) => {
  try {
    const playlistId = parseIntSafe(req.params.id);
    const userId = req.user.id;

    // Se borran todas las canciones de la playlist
    await pool.query('DELETE FROM playlist_songs WHERE playlist_id = $1', [playlistId]);

    // Se borra la playlist
    const result = await pool.query('DELETE FROM playlists WHERE id = $1 AND user_id = $2 RETURNING *', [playlistId, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Playlist no encontrada o no tienes permiso para eliminarla' });
    }

    res.json({ message: 'Playlist eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor arrancando en el puerto: ${port}`);
});