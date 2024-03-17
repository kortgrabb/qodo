// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
struct TodoList {
    todos: Vec<Todo>
}

#[derive(Deserialize, Serialize)]
struct Todo {
    text: String,
    completed: bool,
    due_date: String
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn send_todo_list(todo_list: String) {
    let todo_list: Vec<Todo> = serde_json::from_str(&todo_list).unwrap_or(vec![]);
    // save into a file
    const TODO_PATH: &str = "./todo_list.json";
    let todo_list = TodoList { todos: todo_list };
    let json = serde_json::to_string(&todo_list).unwrap();

    std::fs::write(TODO_PATH, json).unwrap();
}

#[tauri::command]
fn get_todo_list() -> String {
    const TODO_PATH: &str = "./todo_list.json";
    let json = if std::path::Path::new(TODO_PATH).exists() {
        std::fs::read_to_string(TODO_PATH).unwrap()
    } else {
        String::from("[]")
    };

    json
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![send_todo_list, get_todo_list])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
