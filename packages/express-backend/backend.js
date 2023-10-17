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

// const findUserByName = (name) => { 
//    return users['users_list']
//        .filter( (user) => user['name'] === name); 
// }

// app.get('/users', (req, res) => {
//    const name = req.query.name;
//    if (name != undefined){
//        let result = findUserByName(name);
//        result = {users_list: result};
//        res.send(result);
//    }
//    else{
//        res.status(404).send(users);
//    }
// });

// WIP -------------------------------------------------------------------------
const findUserByNameAndJob = (name, job) => { // can also maybe combine this with find by name and just have separate cases INSIDE of here
   if(job === undefined){
      return users['users_list']
         .filter( (user) => user['name'] === name);
   }
   else if(name === undefined){
      return users['users_list']
         .filter( (user) => user['job'] === job);
   }
   else{
      return users['users_list']
       .filter( (user) => user['name'] === name || user['job'] === job);
   }
}

app.get('/users', (req, res) => { // need to combine the two of these and integrate functionality
   // main issue is that I don't know the formatting of the URL, for name alone it was users?name={name}
   const name = req.query.name;
   const job = req.query.job
   if (name != undefined || job != undefined){
       let result = findUserByNameAndJob(name, job);
       result = {users_list: result};
       res.send(result);
   }
   else if (name === undefined && job === undefined){
       res.status(404).send(users);
   }
});
// -----------------------------------------------------------------------------

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
