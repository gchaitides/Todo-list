function forceScrollbarRepaint() {
  const taskContainer = document.getElementById("taskContainer");
  taskContainer.style.overflow = "hidden"; // Temporarily set to hidden
  taskContainer.offsetHeight; // Trigger a reflow
  taskContainer.style.overflowY = "auto"; // Re-apply auto overflow
}

function saveTasks() {
  const allTasks = [];

  document.querySelectorAll("#openTaskList li").forEach((task) => {
    allTasks.push({
      text: task.querySelector(".task-text").textContent,
      completed: false,
    });
  });

  document.querySelectorAll("#completedTaskList li").forEach((task) => {
    allTasks.push({
      text: task.querySelector(".task-text").textContent,
      completed: true,
    });
  });

  localStorage.setItem("tasks", JSON.stringify(allTasks));
}

document.getElementById("searchInput").addEventListener("input", function() {
  const searchTerm = this.value.toLowerCase();
  const allTasks = document.querySelectorAll("#openTaskList li, #completedTaskList li");

  allTasks.forEach(task => {
      const taskText = task.querySelector(".task-text").textContent.toLowerCase();
      // Show task if it includes the search term, hide otherwise
      task.style.display = taskText.includes(searchTerm) ? "flex" : "none";
  });
});


function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  const feedbackMessage = document.getElementById("feedbackMessage");
  const successMessage = document.getElementById("successMessage");

  if (taskText !== "") {
      const openTaskList = document.getElementById("openTaskList");
      const taskTexts = document.querySelectorAll(".task-text");
      const isDuplicate = Array.from(taskTexts).some(task => task.textContent === taskText);

      if (isDuplicate) {
          feedbackMessage.textContent = "Duplicate task! Please enter a new task.";
          feedbackMessage.classList.add("show");
          setTimeout(() => feedbackMessage.classList.remove("show"), 3000);
          return;
      }

      function showMessage(messageElement, text) {
        // Hide any currently visible message
        document.querySelectorAll('.message').forEach(msg => msg.classList.remove('show'));
    
        // Set the new message text and show it
        messageElement.textContent = text;
        messageElement.classList.add('show');
    }
    // For adding a task
const successMessage = document.getElementById("successMessage");
showMessage(successMessage, "Task added successfully!");

// For deleting a task
const deleteMessage = document.getElementById("deleteMessage");
showMessage(deleteMessage, "Task removed successfully!");


    // Create the list item for the task
    const newTask = document.createElement("li");
    newTask.draggable = true; // Enable dragging

    // Event listeners for drag-and-drop
    newTask.ondragstart = function (event) {
      event.dataTransfer.setData("text/plain", event.target.id);
      event.dataTransfer.effectAllowed = "move";
      newTask.classList.add("dragging");
    };

    newTask.ondragend = function () {
      newTask.classList.remove("dragging");
      saveTasks(); // Save the new order
    };

    newTask.ondragover = function (event) {
      event.preventDefault(); // Allow dropping
      const draggingTask = document.querySelector(".dragging");
      const taskItems = Array.from(openTaskList.querySelectorAll("li"));
      const currentHoverIndex = taskItems.indexOf(newTask);
      const draggingIndex = taskItems.indexOf(draggingTask);

      // Reorder tasks
      if (currentHoverIndex > draggingIndex) {
        openTaskList.insertBefore(draggingTask, newTask.nextSibling);
      } else {
        openTaskList.insertBefore(draggingTask, newTask);
      }
    };

    // Create a checkbox for marking as complete
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("complete-checkbox");

    checkbox.onclick = function () {
      newTask.classList.toggle("completed");
      if (newTask.classList.contains("completed")) {
        completedTaskList.appendChild(newTask);
        checkbox.checked = true;
      } else {
        openTaskList.insertBefore(newTask, openTaskList.firstChild);
        checkbox.checked = false;
      }
      saveTasks();
    };

    // Create a span for the task text
    const taskTextSpan = document.createElement("span");
    taskTextSpan.classList.add("task-text");
    taskTextSpan.textContent = taskText;
    taskTextSpan.title = taskText; // Set tooltip to full task text

    newTask.appendChild(checkbox); // Add checkbox before text
    newTask.appendChild(taskTextSpan);

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");

    deleteButton.onclick = function (event) {
      event.stopPropagation();
      newTask.remove();
      saveTasks();
      showMessage(deleteMessage, "Task removed successfully!");
   };
    newTask.appendChild(deleteButton);

    // Create edit button
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

    openTaskList.appendChild(newTask); // Add new task at the bottom
    showMessage(successMessage, "Task added successfully!");
successMessage.classList.add("show");
setTimeout(() => {
    successMessage.classList.remove("show");
}, 3000);
        taskInput.value = "";
        forceScrollbarRepaint();
        saveTasks();
  }
}

// Add task on button click
document.getElementById("addTaskButton").onclick = addTask;

// Add task on pressing Enter
document
  .getElementById("taskInput")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });

window.onload = function () {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  console.log(tasks); // Verify task structure
  const openTaskList = document.getElementById("openTaskList");
  const completedTaskList = document.getElementById("completedTaskList");

  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.draggable = true; // Enable dragging

    // Event listeners for drag-and-drop
    taskItem.ondragstart = function (event) {
      event.dataTransfer.setData("text/plain", event.target.id);
      event.dataTransfer.effectAllowed = "move";
      taskItem.classList.add("dragging");
    };

    taskItem.ondragend = function () {
      taskItem.classList.remove("dragging");
      saveTasks();
    };

    taskItem.ondragover = function (event) {
      event.preventDefault();
      const draggingTask = document.querySelector(".dragging");
      const taskItems = Array.from(taskItem.parentElement.querySelectorAll("li"));
      const currentHoverIndex = taskItems.indexOf(taskItem);
      const draggingIndex = taskItems.indexOf(draggingTask);

      if (currentHoverIndex > draggingIndex) {
        taskItem.parentElement.insertBefore(draggingTask, taskItem.nextSibling);
      } else {
        taskItem.parentElement.insertBefore(draggingTask, taskItem);
      }
    };

    // Create a checkbox for marking as complete
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("complete-checkbox");
    checkbox.checked = task.completed;

    checkbox.onclick = function () {
      taskItem.classList.toggle("completed");
      if (taskItem.classList.contains("completed")) {
        completedTaskList.appendChild(taskItem);
        checkbox.checked = true;
      } else {
        openTaskList.insertBefore(taskItem, openTaskList.firstChild);
        checkbox.checked = false;
      }
      saveTasks();
    };

    // Create a span for the task text
    const taskTextSpan = document.createElement("span");
    taskTextSpan.classList.add("task-text");
    taskTextSpan.textContent = task.text;
    taskTextSpan.title = task.text; // Set tooltip to full task text

    taskItem.appendChild(checkbox); // Add checkbox before text
    taskItem.appendChild(taskTextSpan);

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");

    deleteButton.onclick = function (event) {
      event.stopPropagation();
      taskItem.remove();
      saveTasks();
    };

    taskItem.appendChild(deleteButton);

    // Create edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");

    editButton.onclick = function () {
      const input = document.createElement("input");
      input.type = "text";
      input.value = taskTextSpan.textContent;
      input.classList.add("edit-input");

      taskItem.replaceChild(input, taskTextSpan);

      input.onkeyup = function (event) {
        if (event.key === "Enter") {
          taskTextSpan.textContent = input.value;
          taskItem.replaceChild(taskTextSpan, input);
          saveTasks();
        }
      };

      input.onblur = function () {
        taskTextSpan.textContent = input.value;
        taskItem.replaceChild(taskTextSpan, input);
        saveTasks();
      };

      input.focus();
    };

    taskItem.appendChild(editButton);

    if (task.completed) {
      completedTaskList.appendChild(taskItem);
      taskItem.classList.add("completed");
    } else {
      openTaskList.appendChild(taskItem);
    }
  });
};
