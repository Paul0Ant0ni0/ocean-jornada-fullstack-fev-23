require('dotenv').config()
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

// localhost ou 127.0.0.1
//const DB_URL = "mongodb://127.0.0.1:27017";
const DB_URL = process.env.DB_URL; // Conectando com db na nuvem 
const DB_NAME = process.env.DB_NAME;

async function main() {
console.log(DB_URL, DB_NAME)
// Conexão com o banco de dados
console.log("Conectando com o banco de dados...");
const client = await MongoClient.connect(DB_URL); // Convertendo um promise em um tipo especifico com o await
const db = client.db(DB_NAME);
const collection = db.collection("itens");
console.log("Banco de dados conectado com sucesso!");


const app = express();


// O que vier no body da requisição, está em Json
app.use(express.json())

//Endpoint / -> Hello world
app.get("/", function (req, res) {
  res.send("Hello World");
});

//Endpoint /oi -> Olá mundo
app.get("/oi", function (req, res) {
  res.send("Olá,  mundo!");
});

// Lista de informações
//                0        1      2
const itens = 
[
  "Banana",
  "Uva",
  "Pera"

];



// CRUD -> Crud de informações

// Enpoint Read All ->  [GET] / item

app.get("/item", async function (req, res) {
  const documentos = await collection.find().toArray(); // Convertendo o documento para array
  res.send(documentos);
});


// Enpoint Read Single bt ID ->  [GET] / item/:id

app.get("/item/:id", async function (req, res) {
  const id = req.params?.id;
  const filtro = await collection.findOne({_id: new ObjectId(id)}); // Sempre tem que isntasiar para o tipo do mongo db
  const item = (filtro != null)? filtro : `Item não existe no banco de dados`
  res.send(item);
});


app.get("/item/nome/:nome", async function (req, res) {
  const nome = req.params?.nome;
  const documentos = await  collection.find().toArray();
  const filtro = documentos.filter(item => item.nome === nome);
  const item = (filtro.length > 0)? filtro : `Item: ${nome} não existe no banco de dados`;
  res.send(item);

})

// Endpoint Create -> [POST] /item

app.post("/item", async function (req, res) {
  const item = req.body;
  await collection.insertOne(item);
  res.send(item);
});

// Endpoint Update -> [PUT] /item/:id
app.put("/item/:id", async function (req, res) {
  //const id = +req.params.id - 1; // O operador + converte string -> number
  const id = req.params.id;
  const body = req.body;
  
  await collection.updateOne(
      {_id: new ObjectId(id)}, 
      {$set: body}
  );

  res.send(body);
});

  // Endpoint Delete -> [DELETE] /item/:id
  // Exercício:
  // - pesquisar sobre a operação de remover itens
  // - implementar o endpoint de delete
  // - realizar a operação de excluir item

// Endpoint Delete -> [DELETE] /item/:id
app.delete("/item/:id", async function (req, res) {
  const id = req.params.id;
  await collection.deleteOne({_id: new ObjectId(id)});
  res.send("Item deletado com sucesso!!");
});

//Escutabndo toda a aplicação na porta 
app.listen(3000); 

}


main();