// Librerias y dependencias
const http = require('http')
const express = require('express')
const app = express()
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// Recursos
app.use(express.static(__dirname + '/'))

alert( '¡Hola, mundo!' );
