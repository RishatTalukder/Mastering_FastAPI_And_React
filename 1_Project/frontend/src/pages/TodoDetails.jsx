import React, { useEffect } from 'react'
import {useParams, Link} from 'react-router'
import {API} from '../api/api'
import { useState } from "react";
const TodoDetails = () => {
  const {id} = useParams();
  console.log(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [todo, setTodo] = useState(null);

  const fetchTodo = async()=>{
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/todo/${id}`);
      console.log(response.data);
      setTodo(response.data);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      // always executed
      console.log("done");
      setLoading(false);
      console.log(todo);
      
    }
  }

  useEffect(() => {
    fetchTodo();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (!todo) return <div>Todo not found</div>;
  
  return (
    <div>
      <h1>{todo.title}</h1>
      <p>{todo.description}</p>
      <p>{todo.completed ? "Completed" : "Not Completed"}</p>
      <button>
        <Link to={`/edit/${todo.id}`}>
            Edit
          </Link>
      </button>
    </div>
  )
}

export default TodoDetails