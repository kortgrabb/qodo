import { invoke } from "@tauri-apps/api";
import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

interface Todo {
  text: string;
  due_date: string;
  completed: boolean;
}

let todoList: Todo[] = [];
function createTodoElement(todo: Todo): HTMLDivElement {
  const container = document.createElement("div");
  container.classList.add("todo");

  const content = document.createElement("div");
  content.classList.add("todo-content");

  const textContainer = document.createElement("div");
  textContainer.classList.add("todo-text-container");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("todo-checkbox");
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => {
    todo.completed = checkbox.checked;

    if (todo.completed) {
      textContainer.classList.add("todo-completed");
    } else {
      textContainer.classList.remove("todo-completed");
    }
    onTodoChange();
  });

  const text = document.createElement("p");
  text.classList.add("todo-text");
  text.textContent = todo.text;

  textContainer.appendChild(checkbox);
  textContainer.appendChild(text);

  const dueDate = document.createElement("p");
  dueDate.classList.add("todo-due");
  dueDate.textContent = todo.due_date;

  content.appendChild(textContainer);
  content.appendChild(dueDate);

  const controls = document.createElement("div");
  controls.classList.add("todo-controls");

  const editButton = document.createElement("button");
  editButton.classList.add("todo-edit");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => editTodo(container, todo));

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("todo-delete");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteTodo(container, todo));

  controls.appendChild(editButton);
  controls.appendChild(deleteButton);

  container.appendChild(content);
  container.appendChild(controls);

  return container;
}

function renderTodos() {
  const todoListElement = document.getElementById("todo-list");
  if (todoListElement) {
    todoListElement.innerHTML = "";

    todoList.forEach((todo) => {
      const todoElement = createTodoElement(todo);
      todoListElement.appendChild(todoElement);
      if (todo.completed) {
        todoElement.classList.add("todo-completed");
      }
    });
  }
}

function onTodoChange() {
  sendTodoList();
}

function addTodo() {
  const newTodo: Todo = {
    text: "New Todo",
    due_date: "Today",
    completed: false,
  };

  todoList.push(newTodo);
  renderTodos();
  onTodoChange();
}

function editTodo(todoElement: HTMLDivElement, todo: Todo) {
  const todoTextElement: any = todoElement.querySelector(".todo-text");
  todoTextElement.contentEditable = true;

  todoTextElement.addEventListener("blur", () => {
    todoTextElement.contentEditable = false;
    todo.text = todoTextElement.textContent;
    renderTodos();
    onTodoChange();
  });

  // set cursor to end using range
  const range = document.createRange();
  range.selectNodeContents(todoTextElement);
  range.collapse(false);

  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }

  todoTextElement.focus();
}

function deleteTodo(todoElement: HTMLDivElement, todo: Todo) {
  const index = todoList.indexOf(todo);
  if (index !== -1) {
    todoList.splice(index, 1);
    todoElement.remove();
  }

  onTodoChange();
}

const newTodoButton = document.getElementById("new-todo");
if (newTodoButton) {
  newTodoButton.addEventListener("click", addTodo);
}
renderTodos();

function sendTodoList() {
  invoke("send_todo_list", { todoList: JSON.stringify(todoList) });
}

function getTodoList() {
  invoke("get_todo_list").then((result: any) => {
    todoList = JSON.parse(result).todos;

    if (todoList) {
      renderTodos();
    } else {
      todoList = [];
      renderTodos();
    }
  });
}

async function exportTodos() {
  // create a new entry in the database and give the user the key
  let entry: any = pb.collection("todo_lists").create({
    todos: JSON.stringify(todoList),
  });

  // get the id of the new entry
  let export_key = (await entry).id;

  alert(`Exported todos with key: ${export_key}`);
  navigator.clipboard.writeText(export_key);
}

function importTodos() {
  // dialog to ask for key
  const key = prompt("Enter key to import");

  if (key) {
    // get the entry from the database
    pb.collection("todo_lists").getOne(key).then((result: any) => {
      if (result) {
        todoList = result.todos;
        renderTodos();
        onTodoChange();
      } else {
        alert("Key not found");
      }
    });
  }
}

getTodoList();
let exportBtn = document.querySelector(".export-btn");
if (exportBtn) {
  exportBtn.addEventListener("click", exportTodos);
}

let importBtn = document.querySelector(".import-btn");
if (importBtn) {
  importBtn.addEventListener("click", importTodos);
}