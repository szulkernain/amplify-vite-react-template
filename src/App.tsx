import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create(
      { content: window.prompt("Todo content") }
    );
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete(
      { id }
    )
  }

  return (

    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Real Time Dashboard</h1>
          <button onClick={createTodo}>+ Add a Task</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} onClick={() => deleteTodo(todo.id)}>{todo.content}</li>
            ))}
          </ul>
          <div>
            🥳 Trying something fun!
          </div>

          <button onClick={signOut}>Sign out {user?.signInDetails?.loginId}</button>

        </main>
      )}
    </Authenticator>

  );
}

export default App;
