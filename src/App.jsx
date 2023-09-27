import "./App.css";
import { useState, useEffect } from "react";
import TodoList from "./components/TodoList";
import InputField from "./components/InputField";
import { useDispatch, useSelector } from "react-redux";
import { addNewTodo, fetchTodos } from "./store/todoSlice";

function App() {
  const [text, setText] = useState("");
  const { status, error } = useSelector((state) => state.todosRed);
  const dispatch = useDispatch();

  const handleAction = () => {
    if (text.trim().length) {
      dispatch(addNewTodo(text));
      setText("");
    }
  };

  useEffect(() => {
    dispatch(fetchTodos());
  }, []);

  return (
    <div className="App">
      <InputField
        text={text}
        handleInput={setText}
        handleSubmit={handleAction}
      />

      {status === "loading" && <h2>Load...Bitch</h2>}
      {error && <h2>An error occer: {error}</h2>}
      <TodoList />
    </div>
  );
}

export default App;
