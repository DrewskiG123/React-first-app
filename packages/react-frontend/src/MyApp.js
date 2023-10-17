import React, {useState, useEffect} from 'react';
import Table from './Table';
import Form from './Form';

function MyApp() {
  const [characters, setCharacters] = useState([]); // grabbing the list of characters?
  function removeOneCharacter (index) {
    var id = "";
    const updated = characters.filter((character, i) => {// vvv this is actually a very small function
      if(i == index){ // I added this so I could implement a linked delete
        id = character.id} 
      return i !== index}); 
    // using the simple function above, it returns a list of characters that have an index 
    // that DOES NOT match the one provided, which is the one to delete

    deleteUser(id)
      .then((res) => {
        if (res.status === 200) {
          setCharacters(updated) // updates the table with the new list of characters
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function updateList(person) { 
    postUser(person)
      .then((res) => {
        if (res.status === 201){
          return res.json()}
      })
      .then((person) => {
        if (person) {
          setCharacters([...characters, person])
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function deleteUser(id) { // need to implement this
    const promise = fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    });

    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );
    
  return (
    <div className="container">
      <Table characterData={characters} 
        removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  )
}

export default MyApp;