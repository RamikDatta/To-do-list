let tasks = [];

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dueDateInput = document.getElementById("dueDateInput");
  const categorySelect = document.getElementById("categorySelect");
  const prioritySelect = document.getElementById("prioritySelect");

  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const category = categorySelect.value;
  const priority = prioritySelect.value;

  if (taskText === "" || dueDate === "" || category === "" || priority === "") {
    alert("Please fill in all the fields.");
    return;
  }

  const newTask = {
    text: taskText,
    dueDate: dueDate,
    category: category,
    priority: priority,
    done: false,
  };

  tasks.push(newTask);
  saveToLocalStorage();
  renderTasks();
  taskInput.value = "";
  dueDateInput.value = "";
  categorySelect.value = "";
  prioritySelect.value = "";
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  saveToLocalStorage();
  renderTasks();
}

function enableEdit(index) {
  const taskElement = document.getElementById(`task_${index}`);
  const task = tasks[index];

  taskElement.innerHTML = `
    <input type="text" value="${task.text}">
    (Due: <input type="date" value="${task.dueDate}">,
    Category: <select>
      <option value="">Select a category</option>
      <option value="work"${task.category === 'work' ? ' selected' : ''}>Work</option>
      <option value="personal"${task.category === 'personal' ? ' selected' : ''}>Personal</option>
      <option value="shopping"${task.category === 'shopping' ? ' selected' : ''}>Shopping</option>
    </select>,
    Priority: <select class="priority">
      <option value="">Select a priority</option>
      <option value="low"${task.priority === 'low' ? ' selected' : ''}>Low</option>
      <option value="medium"${task.priority === 'medium' ? ' selected' : ''}>Medium</option>
      <option value="high"${task.priority === 'high' ? ' selected' : ''}>High</option>
    </select>
    <button onclick="saveEdit(${index})">Save</button>
    <button onclick="cancelEdit(${index})">Cancel</button>
  `;
}

document.getElementById("taskList").addEventListener("click", function(event) {
  const target = event.target;

  if (target.classList.contains("save-button")) {
    const index = parseInt(target.dataset.index);
    saveEdit(index);
  } else if (target.classList.contains("cancel-button")) {
    const index = parseInt(target.dataset.index);
    cancelEdit(index);
  }
});

function saveEdit(index) {
  const taskElement = document.getElementById(`task_${index}`);
  const taskText = taskElement.querySelector("input[type='text']").value;
  const dueDate = taskElement.querySelector("input[type='date']").value;
  const category = taskElement.querySelector("select").value;
  const priority = taskElement.querySelector("select").value; 
  // const prioritySelect = taskElement.querySelector("priority");
  // const priority = prioritySelect.value;

  tasks[index].text = taskText;
  tasks[index].dueDate = dueDate;
  tasks[index].category = category;
  tasks[index].priority = priority;

  renderTasks();
  saveToLocalStorage();
}

function cancelEdit(index) {
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveToLocalStorage();
  renderTasks();
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadFromLocalStorage() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    renderTasks();
  }
}

function renderTasks(filteredTasks) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const tasksToRender = filteredTasks || tasks; // Use filteredTasks if available, otherwise use all tasks

  tasksToRender.forEach((task, index) => {
    // if (isTaskBacklog(task)) {
    //   // Skip rendering backlog tasks if showBacklogs is false
    //   return;
    // }
    const li = document.createElement("li");
    li.setAttribute("id", `task_${index}`);
    // li.setAttribute("draggable", "true");

    const taskCheckbox = document.createElement("input");
    taskCheckbox.setAttribute("type", "checkbox");
    taskCheckbox.checked = task.done;
    taskCheckbox.addEventListener("click", () => toggleDone(index));

    const taskTextSpan = document.createElement("span");
    taskTextSpan.textContent = task.text;
    taskTextSpan.addEventListener("click", () => {
      if (!li.classList.contains("editing")) {
        enableEdit(index);
      }
    });

    li.appendChild(taskCheckbox);
    li.appendChild(taskTextSpan);
    li.innerHTML += ` (Due: ${task.dueDate}, Category: ${task.category}, Priority: ${task.priority})`;

    if (task.done) {
      li.classList.add("done");
    }


    // //Subtask
    // const addButton = document.createElement("button");
    // addButton.textContent = "Add Subtask";
    // addButton.addEventListener("click", () => addSubtask(index));
    // li.appendChild(addButton);
    // // Display subtasks
    // if (task.subtasks.length > 0) {
    //   const subtaskList = document.createElement("ul");
    //   subtaskList.classList.add("subtask-list");

    //   task.subtasks.forEach((subtask, subtaskIndex) => {
    //     const subtaskLi = document.createElement("li");
    //     subtaskLi.textContent = subtask.text;

    //     const subtaskCheckbox = document.createElement("input");
    //     subtaskCheckbox.setAttribute("type", "checkbox");
    //     subtaskCheckbox.checked = subtask.done;
    //     subtaskCheckbox.addEventListener("click", () => toggleSubtaskDone(index, subtaskIndex));

    //     const subtaskDeleteButton = document.createElement("button");
    //     subtaskDeleteButton.textContent = "Delete";
    //     subtaskDeleteButton.addEventListener("click", () => deleteSubtask(index, subtaskIndex));

    //     subtaskLi.appendChild(subtaskCheckbox);
    //     subtaskLi.appendChild(subtaskDeleteButton);
    //     subtaskList.appendChild(subtaskLi);
    //   });

    //   li.appendChild(subtaskList);
    // }

    // Add Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => enableEdit(index));
    li.appendChild(editButton);

    // Add Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteTask(index));
    li.appendChild(deleteButton);

    taskList.appendChild(li);
  });
}

function applyFilters() {
  const dueDateFilter = document.getElementById("dueDateFilter").value;
  const categoryFilter = document.getElementById("categoryFilter").value;
  const priorityFilter = document.getElementById("priorityFilter").value;

  const filteredTasks = tasks.filter(task => {
    const dueDateMatch = dueDateFilter === "" || task.dueDate === dueDateFilter;
    const categoryMatch = categoryFilter === "" || task.category === categoryFilter;
    const priorityMatch = priorityFilter === "" || task.priority === priorityFilter;
    return dueDateMatch && categoryMatch && priorityMatch;
  });

  renderTasks(filteredTasks);
}

function resetFilters() {
  document.getElementById("dueDateFilter").value = "";
  document.getElementById("categoryFilter").value = "";
  document.getElementById("priorityFilter").value = "";

  renderTasks();
}



//Sorting

function sortTasksByDueDate() {
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  renderTasks();
}

function sortTasksByPriority() {
  const priorityOrder = { "low": 1, "medium": 2, "high": 3 };
  tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  renderTasks();
}

function sortTasksByText() {
  tasks.sort((a, b) => a.text.localeCompare(b.text));
  renderTasks();
}



document.getElementById("sortByDueDate").addEventListener("click", sortTasksByDueDate);
document.getElementById("sortByPriority").addEventListener("click", sortTasksByPriority);
document.getElementById("sortByText").addEventListener("click", sortTasksByText);



//Drag and Drop





// function enableDragAndDrop() {
//   const taskList = document.getElementById("taskList");

//   let draggedItem = null;

//   function handleDragStart(event) {
//     draggedItem = event.target.closest("li");
//     event.dataTransfer.effectAllowed = "move";
//     event.dataTransfer.setData("text/html", draggedItem.outerHTML);
//     event.dataTransfer.setData("text/plain", draggedItem.dataset.index);
//     draggedItem.classList.add("dragging");
//   }

//   function handleDragOver(event) {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = "move";
//     return false;
//   }

//   function handleDragEnter(event) {
//     event.target.classList.add("drag-over");
//   }

//   function handleDragLeave(event) {
//     event.target.classList.remove("drag-over");
//   }

//   function handleDrop(event) {
//     event.preventDefault();
//     const targetLi = event.target.closest("li");
//     if (draggedItem !== targetLi) {
//       draggedItem.outerHTML = targetLi.outerHTML;
//       targetLi.outerHTML = event.dataTransfer.getData("text/html");

//       const oldIndex = parseInt(draggedItem.dataset.index);
//       const newIndex = parseInt(targetLi.dataset.index);

//       // Rearrange tasks in the tasks array
//       const [removed] = tasks.splice(oldIndex, 1);
//       tasks.splice(newIndex, 0, removed);

//       saveToLocalStorage();
//       renderTasks();
//     }
//     return false;
//   }

//   function handleDragEnd(event) {
//     event.target.classList.remove("dragging");
//     const dragOverItems = document.querySelectorAll(".drag-over");
//     dragOverItems.forEach(item => item.classList.remove("drag-over"));
//   }

//   taskList.addEventListener("dragstart", handleDragStart);
//   taskList.addEventListener("dragenter", handleDragEnter);
//   taskList.addEventListener("dragleave", handleDragLeave);
//   taskList.addEventListener("dragend", handleDragEnd);
// }



// // Load tasks from local storage on page load, enable drag and drop functionality
// loadFromLocalStorage();
// enableDragAndDrop();




//Backlog

// let showBacklogs = false;

// function toggleViewBacklogs() {
//   showBacklogs = !showBacklogs;
//   renderTasks();
// }

// function isTaskBacklog(task) {
//   if (showBacklogs) {
//     if (task.done) {
//       return !task.dueDate;
//     } else {
//       return task.dueDate && new Date(task.dueDate) < new Date();
//     }
//   } else {
//     return !task.done;
//   }
// }



//Subtasks

// function addSubtask(index) {
//   const task = tasks[index];
//   const subtaskText = prompt("Enter subtask:");
//   if (subtaskText) {
//     const newSubtask = {
//       text: subtaskText.trim(),
//       dueDate: "",
//       category: "",
//       priority: "",
//       done: false,
//     };
//     task.subtasks.push(newSubtask);
//     saveToLocalStorage();
//     renderTasks();
//   }
// }

// function deleteSubtask(taskIndex, subtaskIndex) {
//   const task = tasks[taskIndex];
//   task.subtasks.splice(subtaskIndex, 1);
//   saveToLocalStorage();
//   renderTasks();
// }



// Load tasks from local storage on page load
loadFromLocalStorage();
