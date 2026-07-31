"use client";
import "./globals.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";

type Todo = {
  id: number;
  title: string;
  done: boolean;
};

export default function Home () {
  const [todos, settodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetch("https://todo-be-production-f918.up.railway.app/todos")
      .then((res) => res.json())
      .then((data) => settodos(data));
  }, []);

  const activeCount = todos.filter((todo) => !todo.done).length;

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [newTodo, setNewTodo] = useState("");

  return (
    <main>
      <h1> My Todos</h1>
      <p>{activeCount} {activeCount === 1 ? "item" : "items"} left</p>

      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />

      <button onClick={() => {
        if (newTodo.trim() === "") return;
        // we'll replace this with a real API call in the next step
        settodos([...todos, { id: Date.now(), title: newTodo, done: false }]);
      }}> Add</button>

      <DragDropContext onDragEnd={(result) => {
        const { source, destination } = result;
        if (!destination) return;
        const updatedTodos = Array.from(todos);
        const [movedItem] = updatedTodos.splice(source.index, 1);
        updatedTodos.splice(destination.index, 0, movedItem);
        settodos(updatedTodos);
      }}>
        <Droppable droppableId="todo-list">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={String(todo.id)} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <input
                        type="checkbox"
                        className="todo-checkbox"
                        checked={todo.done}
                        onChange={() => {
                          const updatedTodos = todos.map((t) => {
                            if (t.id === todo.id) {
                              return { ...t, done: !t.done };
                            }
                            return t;
                          });
                          settodos(updatedTodos);
                        }}
                      />

                      {editingId === todo.id ? (
                        <>
                          <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                          />
                          <button onClick={() => {
                            const updatedTodos = todos.map((t) => {
                              if (t.id === todo.id) {
                                return { ...t, title: editText };
                              }
                              return t;
                            });
                            settodos(updatedTodos);
                            setEditingId(null);
                          }}>Save</button>
                        </>
                      ) : (
                        <>
                          <span className={todo.done ? "completed-text" : ""}>
                            {todo.title}
                          </span>
                          <button onClick={() => {
                            setEditingId(todo.id);
                            setEditText(todo.title);
                          }}> Edit</button>
                          <button onClick={() => {
                            const updatedTodos = todos.filter((t) => t.id !== todo.id);
                            settodos(updatedTodos);
                          }}> Delete</button>
                        </>
                      )}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </main>
  );
}
