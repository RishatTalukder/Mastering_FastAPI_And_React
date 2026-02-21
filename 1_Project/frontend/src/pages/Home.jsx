import React, { useEffect, useState } from "react";
import axios from "axios";
import NewTodo from "../components/NewTodo";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/todo/");
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      // always executed
      console.log("done");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      <h1>Home</h1>
      <NewTodo setData={setData}/>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
