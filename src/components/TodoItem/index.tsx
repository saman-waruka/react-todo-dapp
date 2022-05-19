import { Task } from "../../App";
import { useState } from "react";
import { getOriginalId } from "../../helper/graphql";

interface TodoItemArgs {
  id: number;
  task: Task;
  toggleTaskComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, content: string) => void;
}

const TodoItem = ({
  id,
  task,
  toggleTaskComplete,
  deleteTask,
  editTask,
}: TodoItemArgs) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [content, setContent] = useState(task.content);
  const originalTaskId =   getOriginalId(task.id)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          name={task.id}
          onClick={() => {
            toggleTaskComplete(originalTaskId);
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
              editTask(originalTaskId, content);
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
            deleteTask(originalTaskId);
          }}
        >
          Delete
        </button>
      </label>
    </div>
  );
};

export default TodoItem;
