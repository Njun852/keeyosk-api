const {initializeApp} = require("firebase/app")
const {getFirestore} = require("firebase/firestore")
const {collection, addDoc} = require("firebase/firestore")

const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const port = process.env.PORT || 4000;

const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(require('cors')()); 
// app.get('/', (req, res) => {
//   res.sendFile(join(__dirname, 'index.html'));
// });

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on("sent order", (order)=>{
    console.log(order);
  })
});

server.listen(port, () => {
  console.log('server running at http://localhost:3000');
});
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtluNJzVU9TGR_EAiZZopSRNuXKbTuSZI",
  authDomain: "keeyosk-302ce.firebaseapp.com",
  projectId: "keeyosk-302ce",
  storageBucket: "keeyosk-302ce.appspot.com",
  messagingSenderId: "440371616564",
  appId: "1:440371616564:web:7e9356abf509bdcdcda361",
  measurementId: "G-BP8F4DWXCX"
};

const firebase = initializeApp(firebaseConfig)
const db = getFirestore(firebase)

async function test() {
    try {
        const docRef = await addDoc(collection(db, "users"), {
          first: "Ada",
          last: "Lovelace",
          born: 1815
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}
// test()

async function addOrder(order) {
    try {
        const docRef = await addDoc(collection(db, "order"), order)
        console.log('written document:', order)
    } catch(e) {
        console.log('something went wrong:', e)
    }
}

//   app.get('/', (req, res) => {
//     res.send('hello')
// })
// app.listen(port, ()=>console.log(`Port open on ${port}...`))