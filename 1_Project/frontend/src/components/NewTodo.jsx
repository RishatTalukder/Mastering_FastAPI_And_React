import axios from "axios";
import React, { useState } from "react";

const NewTodo = ({ setData }) => {
  const handleAddTodo = async (e) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const title = form.get("title");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/todo/new_todo/",
        {
          title: title,
          description: "",
          completed: false,
        },
      );
      const newTodo = response.data;
      console.log(title);
      setData((prev) => {
        return [newTodo,...prev];
      });

      formElement.reset();
    } catch (error) {
      console.log(error);
    } 
  };
  return (
    <div>
      <form onSubmit={handleAddTodo}>
        <input type="text" placeholder="new todo" name="title" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default NewTodo;
