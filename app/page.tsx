"use client";

import { useState } from "react";

export default function Home () {
  const [todos, settodos] = useState( [ "Go through Git and Git hub", "Go through CI/CD" , "Make an App"] )
  const [newTodo, setNewTodo] = useState("");
  return (
    <main>
      <h1> My Todos</h1>
       {/*so e is refered to what the change is*/}
       { /*whenever there is a change a new todo is added that change is the todo*/}
      <input

        value = {newTodo}
        onChange= { (e) => setNewTodo(e.target.value)}/>
       
        <button onClick= { () => {
          if (newTodo.trim() === "")
            return;
          settodos ([...todos, newTodo])
            }
        
        // when we click the button that change gets added to the list of todos
        }> Add</button>
      <ul>
        { todos.map ((todo) => 
        (
          <li key={todo}>{todo}</li>
        ))}
      </ul>
    </main>
  );
}