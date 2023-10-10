import express, { json } from "express";
import cors from "cors";

const app = express();
const port = 8000;
const users = { 
    users_list : [
       { 
          id : 'xyz789',
          name : 'Charlie',
          job: 'Janitor',
       },
       {
          id : 'abc123', 
          name: 'Mac',
          job: 'Bouncer',
       },
       {
          id : 'ppp222', 
          name: 'Mikey',
          job: 'Professor',
       }, 
       {
          id: 'yat999', 
          name: 'Dee',
          job: 'Aspring actress',
       },
       {
          id: 'zap555', 
          name: 'Dennis',
          job: 'Bartender',
       }
    ]
 }

app.use(express.json());
app.use(cors());

app.listen(port, () => {
   console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/', (req, res) => { // default location displaying "Hello, World!"
   res.send('Hello World!');
});

const findUserByName = (name) => { 
   return users['users_list']
       .filter( (user) => user['name'] === name); 
}

app.get('/users', (req, res) => {
   const name = req.query.name;
   if (name != undefined){
       let result = findUserByName(name);
       result = {users_list: result};
       res.send(result);
   }
   else{
       res.status(404).send(users);
   }
});

const findUserById = (id) =>
    users['users_list']
        .find( (user) => user['id'] === id);
    
app.get('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send('Resource not found.');
    } else {
        res.send(result);
    }
});

app.delete('/users/:id', (req, res) => { // working
   const id = req.params['id'];
   let result = findUserById(id);
   if (result === undefined) {
       res.status(404).send('Resource not found. Unable to delete.');
   } else { // if the id is found, remove it from the list
       users['users_list'].splice( (users['users_list'].indexOf(result)), 1);
       res.status(200).send('Successful deletion.');
   }
});

const addUser = (user) => {
   users['users_list'].push(user);
   return user;
}

app.post('/users', (req, res) => {
   const userToAdd = req.body;
   if(userToAdd.id === undefined || userToAdd.id === ""){
       userToAdd.id = String(Math.floor(Math.random() * 1000)); // working, adds a simple unique id
   }
   addUser(userToAdd);
   res.status(201).send(userToAdd); // working, sends json and code
});

// WIP -------------------------------------------------------------------------
const findUserByNameAndJob = (name, job) => { // don't know if this is correct
   return users['users_list']
       .filter( (user) => user['name'] === name && user['job'] === job);
}

app.get('/users', (req, res) => { // this is not working... 
   const name = req.query.name;
   const job = req.query.job
   if (name != undefined && job != undefined){
       let result = findUserByNameAndJob(name, job);
       result = {users_list: result};
       res.send(result);
   }
   else{
       res.status(404).send(users);
   }
});
// -----------------------------------------------------------------------------
