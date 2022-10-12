// Librerias y dependencias
const http = require('http')
const express = require('express')
const app = express()
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// Recursos
app.use(express.static(__dirname + '/'))

// Configuracion del servidor
app.set('view engine', 'ejs') // Establece el motor de plantilla, con archivos ejs
app.set('views', path.join(__dirname, '')) // Permite gestionar las rutas de los diferentes recursos de la app
app.use(express.urlencoded({ extended: false })) // Permiten recuperar valores publicados en un request
app.listen(5000)
console.log('Servidor corriendo exitosamente en el puerto 5000')

// Base de Datos
const db_name = path.join(__dirname, 'libros.db')
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message)
  } else {
    console.log('Conexión exitosa con la base de Datos')
  }
})
// Crear la tabla
const sql_create = 'CREATE TABLE IF NOT EXISTS libros(libro_ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, libro VARCHAR(100) NOT NULL, autor REAL NOT NULL, Descripcion TEXT);'

db.run(sql_create, err => {
  if (err) {
    return console.error(err.message)
  } else {
    console.log('Tabla Libros anexada correctamente')
  }
})

// Enrutamiento

app.get('/', (req, res) => {
  res.render('index.ejs')
})

// Mostrar tabla de libros
app.get('/libros', (req, res) => {
  const sql = 'SELECT * FROM libros ORDER BY libro'
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message)
    } else {
      res.render('libros.ejs', { modelo: rows })
    }
  })
})

// Crear un nuevo Registro
app.get('/crear', (req, res) => {
  res.render('crear.ejs', { modelo: {} })
})

// POST /crear
app.post('/crear', (req, res) => {
  const sql = 'INSERT INTO libros(libro, autor, Descripcion) VALUES(?,?,?)'
  const nuevo_libro = [req.body.libro, req.body.autor, req.body.Descripcion]

  db.run(sql, nuevo_libro, err => {
    if (err) {
      return console.error(err.message)
    } else {
      res.redirect('/libros')
    }
  })
})

// GET /edit/id
app.get('/editar/:id', (req, res) => {
  const id = req.params.id
  const sql = 'SELECT * FROM libros WHERE libro_ID=?'
  db.get(sql, id, (err, rows) => {
    res.render('editar.ejs', { modelo: rows })
  })
})

// POST /edit/id
app.post('/editar/:id', (req, res) => {
  const id = req.params.id
  const info_libro = [req.body.libro, req.body.autor, req.body.Descripcion, id]
  const sql = 'UPDATE libros SET libro=?, autor=?, Descripcion=? WHERE (libro_ID=?)'

  db.run(sql, info_libro, err => {
    if (err) {
      return console.error(err.message)
    } else {
      res.redirect('/libros')
    }
  })
})

// Eliminar Registros

// GET /eliminar/id
app.get('/eliminar/:id', (req, res) => {
  const id = req.params.id
  const sql = 'SELECT * FROM libros WHERE libro_ID=?'
  db.get(sql, id, (err, rows) => {
    res.render('eliminar.ejs', { modelo: rows })
  })
})

// POST /eliminar/id
app.post('/eliminar/:id', (req, res) => {
  const id = req.params.id
  const sql = 'DELETE FROM libros WHERE libro_ID=?'

  db.run(sql, id, err => {
    if (err) {
      return console.error(err.message)
    } else {
      res.redirect('/libros')
    }
  })
})

// Este metodo siempre debe ir al final
app.get('/*', (req, res) => {
  res.render('notfound.ejs')
})
