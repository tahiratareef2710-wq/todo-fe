"use client";
import "./globals.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { useEffect } from "react";
type Todo = {
  text: string;
  completed: boolean;
};
export default function Home () {
const [todos, settodos] = useState<Todo[]>(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("todos");
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return [
    { text: "Go through Git and Git hub", completed: false },
    { text: "Go through CI/CD", completed: false },
    { text: "Make an App", completed: false },
  ];
});

useEffect(() => {
  localStorage.setItem("todos", JSON.stringify(todos));
}, [todos]);



const [editingIndex, setEditingIndex] =  useState<number | null>(null);
const [editText, setEditText] = useState("");
  const [newTodo, setNewTodo] = useState("");
  return  (
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
          settodos ([...todos, {text: newTodo, completed: false}])
            }
        
        // when we click the button that change gets added to the list of todos
        }> Add</button>
        <DragDropContext onDragEnd={ (result) => {
         const { source, destination } = result;

         // if dropped outside the list, do nothing
        if (!destination) return;
          //picks up the copy of thr arraay so new array is not affrctes
        const updatedTodos = Array.from(todos);
        //1= move 1 item from the sourse 
        //slipce fills the space
        //moved item has b
        const [movedItem] = updatedTodos.splice(source.index, 1);
        // placing the item 
        updatedTodos.splice(destination.index, 0, movedItem);
          // update 
        settodos(updatedTodos);
        }} >    
        <Droppable droppableId="todo-list">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
       
        { todos.map ((todo, index) => 
        (
          <Draggable key={index} draggableId={String(index)} index={index}>
              {(provided) => (
          <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        > 
         <input
    type="checkbox"
    className="todo-checkbox"

    checked={todo.completed}
    onChange={() => {
      const updatedTodos = todos.map((t, i) => {
        if (i === index) {
          return { ...t, completed: !t.completed };
        }
        return t;
      });
      settodos(updatedTodos);
    }}
  />

        {/* if this todo's index matches the one being edited, show an input+Save
            otherwise, show the normal text + Edit + Delete buttons */}
        { editingIndex === index ? (
          <>
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <button onClick={() => {
              const updatedTodos = todos.map((t, i) => {
                if (i === index) {
                  return { ...t, text: editText };
                }
                return t;
              });
              settodos(updatedTodos);
              setEditingIndex(null);
            }}>Save</button>
          </>
        ) : (
          <>
            <span className={todo.completed ? "completed-text" : ""}>
              {todo.text}
            </span>
            <button onClick={() => {
              setEditingIndex(index);
              setEditText(todo.text);
            }}> Edit</button>
            <button onClick = { () =>
            {
              const updatedTodos = todos.filter((t, i) => i !== index);
              settodos(updatedTodos);
            }}
            > Delete</button>
          </>
        )}
            </li> //we added index for the cases where have the same todos to diffrenciate them apart 
        )}
        </Draggable>
        ))}
        {provided.placeholder}
      </ul>
          )}
      </Droppable>
      </DragDropContext>
      {/* addded the drag and drop fearure after importing the library*/}
    </main>
  );
}

 //.filetr() loops over every todo as map it gets the item and its position for ecvery elemet
          //if index == i then we dep it 
          // true- we keep it
          // false- we drop it
