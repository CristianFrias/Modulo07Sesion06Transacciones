// CREACIÓN DE APIRES
const { createServer } = require("http"); // DEPENDENCIA NATIVA NODE PARA CREAR SERVIDORES: HTTP
const url = require("url");
const { Pool } = require("pg"); // ELEMENTO DE PG QUE ME PERMITIRÁ CONECTARME A LA BASE DE DATOS Y LA GESTION DE LAS CONEXIONES SEA AUTOGESTIONADA
const { log, table } = require("console")

const conexionPool =  new Pool ({
    host: 'localhost',
    port: 5432,
    database:'dvdrental',
    user: 'postgres',
    password: 'postgres'
})

createServer((req, res) => { // EL CALLBACK RECIBIRÁ TODAS LAS PETICIONES QUE VAN A ENVIAR AL SERVIDOR
    // TOMAREMOS LA URL PARA PARSEAR LO QUE LLEGA DE ELLA
    // OBTENER EN UN OBJETO LA INFORMACIÓN RELEVANTE A NIVEL DE DESARROLLO DE LO QUE VIENE DE LA URL COMO PATHNAME O QUERYPARAMS
    const urlParsed = url.parse(req.url, true); // ESTO PERMITE PODER SABER DE CUAL RUTA ME ESTÁN LLAMANDO Y POR CUAL METODO (GET, POST, ETC)
    // console.log(urlParsed);
    res.setHeader("Content-Type", "application/json")

    if (req.method == "POST" && urlParsed.pathname == "/actor/assign") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        return req.on("end", async () => { // SIN RETURN NOS DA ERROR 404 SIENDOO QUE LO ESTÁ ASIGNANDO
            body = JSON.parse(body);
            const { rows, rowCount } = await conexionPool.query("SELECT * FROM actor LIMIT 5") // QUERY FUNCION EN PG QUE AYUDA A EJECUTAR UNA CONSULTA
            log({ rowCount, rows })
            res.end(JSON.stringify({message: "Asignando..."}))
        });
    }

    res.writeHead(404)
    res.end(JSON.stringify({message: "Ruta NO encontrada"}))
}).listen(3000, () => console.log("Servicio Ejecutándose por el Puerto 3.000"))