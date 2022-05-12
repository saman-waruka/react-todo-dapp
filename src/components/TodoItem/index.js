import React, { useState } from "react";

const TodoItem = ({ id, task, toggleTaskComplete, deleteTask, editTask }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [content, setContent] = useState(task.content);
  return (
    <div>
      <label>
        <input
          type="checkbox"
          name={task.id}
          onClick={() => {
            toggleTaskComplete(task.id);
          }}
          defaultChecked={task.completed}
        />
        <span>{id + 1} .) </span>

        {isEditMode ? (
          <>
            <input
              name={task.id}
              defaultValue={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </>
        ) : (
          <span>{task.content}</span>
        )}
        {isEditMode ? (
          <button
            onClick={() => {
              setIsEditMode(false);
              editTask(task.id, content);
            }}
            disabled={content === task.content}
          >
            save
          </button>
        ) : (
          <button onClick={() => setIsEditMode(true)}>edit</button>
        )}

        <button
          onClick={() => {
            deleteTask(task.id);
          }}
        >
          Delete
        </button>
      </label>
    </div>
  );
};

export default TodoItem;
