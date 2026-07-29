export default function Home () {
  const todos = [ "Go through Git and Git hub", "Go through CI/CD" , "Make an App"]

  return (
    <main>
      <h1> My Todos</h1>
      <ul>
        { todos.map ((todo) => 
        (
          <li key={todo}>{todo}</li>
        ))}
      </ul>
    </main>
  );
}