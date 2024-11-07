// This function temporarily hides and then shows the scrollbar to trigger a repaint on the task container.
function forceScrollbarRepaint() {
  const taskContainer = document.getElementById("taskContainer");
  taskContainer.style.overflow = "hidden"; // Temporarily hide overflow
  taskContainer.offsetHeight; // Trigger reflow for repaint
  taskContainer.style.overflowY = "auto"; // Re-enable vertical scrollbar
}

// Saves all tasks (open and completed) to local storage.
function saveTasks() {
  const allTasks = []; // Array to store task objects

  // Iterate through open tasks and add them to the array
  document.querySelectorAll("#openTaskList li").forEach((task) => {
    allTasks.push({
      text: task.querySelector(".task-text").textContent, // Task text
      completed: false, // Mark as not completed
    });
  });

  // Iterate through completed tasks and add them to the array
  document.querySelectorAll("#completedTaskList li").forEach((task) => {
    allTasks.push({
      text: task.querySelector(".task-text").textContent,
      completed: true, // Mark as completed
    });
  });

  // Save tasks array in local storage as JSON string
  localStorage.setItem("tasks", JSON.stringify(allTasks));
}

// Event listener for search input field to filter tasks by text
document.getElementById("searchInput").addEventListener("input", function() {
  const searchTerm = this.value.toLowerCase(); // Get lowercase search term
  const allTasks = document.querySelectorAll("#openTaskList li, #completedTaskList li");

  // Loop through each task and show/hide based on search match
  allTasks.forEach(task => {
    const taskText = task.querySelector(".task-text").textContent.toLowerCase();
    task.style.display = taskText.includes(searchTerm) ? "flex" : "none";
  });
});

// Adds a new task to the open task list
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim(); // Trim whitespace from input

  // Check if task input is not empty
  if (taskText !== "") {
    const openTaskList = document.getElementById("openTaskList");
    const taskTexts = document.querySelectorAll(".task-text");

    // Check for duplicate task text
    const isDuplicate = Array.from(taskTexts).some(task => task.textContent === taskText);

    if (isDuplicate) {
      showMessage("Duplicate task! Please enter a new task.");
      return;
    }

    // Display success message for task addition
    showMessage("Task added successfully!");

    // Create a new task list item
    const newTask = document.createElement("li");
    newTask.draggable = true; // Enable drag-and-drop for sorting

    // Set up drag-and-drop events
    newTask.ondragstart = function (event) {
      event.dataTransfer.setData("text/plain", event.target.id);
      event.dataTransfer.effectAllowed = "move";
      newTask.classList.add("dragging");
    };

    newTask.ondragend = function () {
      newTask.classList.remove("dragging");
      saveTasks(); // Save new task order
    };

    // Reorder tasks on dragover
    newTask.ondragover = function (event) {
      event.preventDefault();
      const draggingTask = document.querySelector(".dragging");
      const taskItems = Array.from(openTaskList.querySelectorAll("li"));
      const currentHoverIndex = taskItems.indexOf(newTask);
      const draggingIndex = taskItems.indexOf(draggingTask);

      if (currentHoverIndex > draggingIndex) {
        openTaskList.insertBefore(draggingTask, newTask.nextSibling);
      } else {
        openTaskList.insertBefore(draggingTask, newTask);
      }
    };

    // Create a checkbox to mark task as completed
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("complete-checkbox");

    checkbox.onclick = function () {
      newTask.classList.toggle("completed");
      if (newTask.classList.contains("completed")) {
        completedTaskList.appendChild(newTask); // Move to completed list
      } else {
        openTaskList.insertBefore(newTask, openTaskList.firstChild); // Move to open list
      }
      saveTasks();
    };

    // Create a span for the task text
    const taskTextSpan = document.createElement("span");
    taskTextSpan.classList.add("task-text");
    taskTextSpan.textContent = taskText;
    taskTextSpan.title = taskText;

    newTask.appendChild(checkbox);
    newTask.appendChild(taskTextSpan);

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.onclick = function (event) {
      event.stopPropagation();
      newTask.remove();
      saveTasks();
      showMessage("Task removed successfully!");
    };
    newTask.appendChild(deleteButton);

    // Create edit button for editing task text
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");
    editButton.onclick = function () {
      const input = document.createElement("input");
      input.type = "text";
      input.value = taskTextSpan.textContent;
      input.classList.add("edit-input");

      newTask.replaceChild(input, taskTextSpan);

      input.onkeyup = function (event) {
        if (event.key === "Enter") {
          taskTextSpan.textContent = input.value;
          newTask.replaceChild(taskTextSpan, input);
          saveTasks();
        }
      };

      input.onblur = function () {
        taskTextSpan.textContent = input.value;
        newTask.replaceChild(taskTextSpan, input);
        saveTasks();
      };

      input.focus();
    };

    newTask.appendChild(editButton);

    openTaskList.appendChild(newTask);
    taskInput.value = ""; // Clear task input
    forceScrollbarRepaint(); // Repaint scrollbar for smooth scrolling
    saveTasks(); // Save tasks to local storage
  }
}

// Display a temporary message
function showMessage(text) {
  const messageElement = document.getElementById("feedbackMessage");
  messageElement.textContent = text;
  messageElement.classList.add("show");
  setTimeout(() => messageElement.classList.remove("show"), 3000);
}

// Load tasks from local storage and display them on page load
window.onload = function () {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const openTaskList = document.getElementById("openTaskList");
  const completedTaskList = document.getElementById("completedTaskList");

  tasks.forEach((task) => {
    // Repeat similar task item creation logic as in addTask
  });
};

// Add task on button click
document.getElementById("addTaskButton").onclick = addTask;

// Add task on pressing Enter in the input field
document.getElementById("taskInput").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});
