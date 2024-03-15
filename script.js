const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

//Create a taskData constant and set it to an empty array. This array will store all the tasks along with their associated data, including title, due date, and description. This storage will enable you to keep track of tasks, display them on the page, and save them to localStorage.
const taskData = JSON.parse(localStorage.getItem("data")) || [];//If you add, update, or remove a task, it should reflect in the UI. However, that's not happening now because you have yet to retrieve the tasks. To do this, you need to modify your initial taskData to be an empty array.Set taskData to the retrieval of data from local storage or an empty array. Make sure you parse the data coming with JSON.parse() because you saved it as a string.

//Use let to create a currentTask variable and set it to an empty object. This variable will be used to track the state when editing and discarding tasks.
let currentTask = {};

//You can enhance code readability and maintainability by refactoring the submit event listener into two separate functions. The first function can be used to add the input values to taskData, while the second function can be responsible for adding the tasks to the DOM.Use arrow syntax to create an addOrUpdateTask function. Then move the dataArrIndex variable, the taskObj object, and the if statement into the addOrUpdateTask function.
const addOrUpdateTask = () => {
    //If you try to add a new task, edit that task, and then click on the Add New Task button, you will notice a bug.The form button will display the incorrect text of "Update Task" instead of "Add Task". To fix this, you will need to assign the string "Add Task" to addOrUpdateTaskBtn.innerText inside your addOrUpdateTask function.
    addOrUpdateTaskBtn.innerText = "Add Task";

    //Use const to declare a variable called dataArrIndex and assign it the value of taskData.findIndex(). For the findIndex() method, pass in an arrow function with item as the parameter.Within the arrow function, check if the id property of item is strictly equal to the id property of currentTask.
    const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
    //Create a taskObj object with an id property as the first property. For the value of the id property, retrieve the value of the titleInput field, convert it to lowercase, and then use the split() and join() methods to hyphenate it.
    const taskObj = {
        id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,//To make the id more unique, add another hyphen and use Date.now().
        //Retrieve the values from the titleInput, dateInput, and descriptionInput fields, and then save them in the properties title, date, and description of the taskObj object.
        title: titleInput.value,
        date: dateInput.value,
        description: descriptionInput.value,
    }
    //Create an if statement with the condition dataArrIndex === -1. Within the if statement, use the unshift() method to add the taskObj object to the beginning of the taskData array.unshift() is an array method that is used to add one or more elements to the beginning of an array.
    if (dataArrIndex === -1) {
        taskData.unshift(taskObj);
    }//At this point, editing a task won't reflect when you submit the task. To make the editing functional, go back to the if statement inside the addOrUpdateTask function. Create an else block and set taskData[dataArrIndex] to taskObj.
    else {
        taskData[dataArrIndex] = taskObj;
    }

    //Now you should save the task items to local storage when the user adds, updates, or removes a task.Inside the addOrUpdateTask function, use setItem() to save the tasks with a key of data, then pass the taskData array as its argument. Ensure that you stringify the taskData.This would persist data once the user adds or updates tasks.
    localStorage.setItem("data", JSON.stringify(taskData));

    //Inside the addOrUpdateTask function, call the updateTaskContainer and reset functions.
    updateTaskContainer();
    reset();
}

//Use arrow syntax to create an updateTaskContainer function. Then move the taskData.forEach() and its content into it.
const updateTaskContainer = () => {
    //There's a problem. If you add a task, and then add another, the previous task gets duplicated. This means you need to clear out the existing contents of tasksContainer before adding a new task.Set the innerHTML of tasksContainer back to an empty string.
    tasksContainer.innerHTML = "";
    //Use forEach() on taskData, then destructure id, title, date, description as the parameters.
    taskData.forEach(({ id, title, date, description }) => tasksContainer.innerHTML += `
        <div class="task" id="${id}">
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Description:</strong> ${description}</p>
            <button type="button" class="btn" onclick="editTask(this)">Edit</button>
            <button type="button" class="btn" onclick="deleteTask(this)">Delete</button>
        </div>
    `);//Inside the callback function body use an addition assignment to set the innerHTML of tasksContainer to empty backticks.
    //To enable editing and deleting for each task, add an onclick attribute to both buttons. Set the value of the onclick attribute to editTask(this) for the Edit button and deleteTask(this) for the Delete button. The editTask(this) function will handle editing, while the deleteTask(this) function will handle deletion.this is a keyword that refers to the current context. In this case, this points to the element that triggers the event – the buttons.
}

//Create a deleteTask function using arrow syntax. Pass buttonEl as the parameter.
const deleteTask = (buttonEl) => {
    //You need to find the index of the task you want to delete first.Create a dataArrIndex variable and set its value using the findIndex() method on the taskData array. Pass item as the parameter for the arrow callback function, and within the callback, check if the id of item is equal to the id of the parentElement of buttonEl.
    const dataArrIndex = taskData.findIndex((item) => item.id === buttonEl.parentElement.id);
    //Use the remove() method to remove the parentElement of the buttonEl from the DOM. Then use splice() to remove the task from the taskData array. Pass in dataArrIndex and 1 as the arguments of your splice().dataArrIndex is the index to start and 1 is the number of items to remove.
    buttonEl.parentElement.remove();
    taskData.splice(dataArrIndex, 1);

    //You also want a deleted task to be removed from local storage. For this, you don't need the removeItem() or clear() methods. Since you already use splice() to remove the deleted task from taskData, all you need to do now is save taskData to local storage again.Use setItem() to save the taskData array again. Pass in data as the key and ensure that taskData is stringified before saving.
    localStorage.setItem("data", JSON.stringify(taskData));
}

//Use arrow syntax to create an editTask function. Pass in buttonEl as the parameter and add empty curly braces for the body.
const editTask = (buttonEl) => {
    //As you did in the deleteTask function, you need to find the index of the task to be edited.Create a dataArrIndex variable. For its value, utilize the findIndex() method on taskData. Pass item as the parameter to its callback function and check if the id of item is equal to the id of the parentElement of buttonEl.
    const dataArrIndex = taskData.findIndex((item) => item.id === buttonEl.parentElement.id);
    //Use square bracket notation to retrieve the task to be edited from the taskData array using the dataArrIndex. Then, assign it to the currentTask object to keep track of it.
    currentTask = taskData[dataArrIndex];

    //The task to be edited is now in the currentTask object. Stage it for editing inside the input fields by setting the value of titleInput to currentTask.title, dateInput to currentTask.date, and descriptionInput to currentTask.description.
    titleInput.value = currentTask.title;
    dateInput.value = currentTask.date;
    descriptionInput.value = currentTask.description;
    //Set the innerText of the addOrUpdateTaskBtn button to Update Task.
    addOrUpdateTaskBtn.innerText = "Update Task";
    //Finally, display the form modal with the values of the input fields by using classList to toggle the hidden class on taskForm.
    taskForm.classList.toggle("hidden");
}

//If you attempt to add another task now, you'll notice that the input fields retain the values you entered for the previous task. To resolve this, you need to clear the input fields after adding a task.Instead of clearing the input fields one by one, it's a good practice to create a function that handles clearing those fields. You can then call this function whenever you need to clear the input fields again.
const reset = () => {
    //Inside the reset function, set each value of titleInput, dateInput, descriptionInput to an empty string.
    titleInput.value = "";
    dateInput.value = "";
    descriptionInput.value = "";
    //Also, use classList to toggle the class hidden on the taskForm and set currentTask to an empty object. That's because at this point, currentTask will be filled with the task the user might have added.
    taskForm.classList.toggle("hidden");
    currentTask = {};
}

//You've retrieved the task item(s) now, but they still don't reflect in the UI when the page loads. However, they appear when you add a new task.You can check if there's a task inside taskData using the length of the array. Because 0 is a falsy value all you need for the condition is the array length.Check if there's a task inside taskData, then call the updateTaskContainer() inside the if statement block.
if (taskData.length) {
    updateTaskContainer();
}

//Another method to use with the classList property is the toggle method.The toggle method will add the class if it is not present on the element, and remove the class if it is present on the element.Add an event listener to the openTaskFormBtn element and pass in a click event for the first argument and an empty callback function for the second argument.For the callback function, use the classList.toggle() method to toggle the hidden class on the taskForm element.
openTaskFormBtn.addEventListener("click", () => { taskForm.classList.toggle("hidden") });

//The HTML dialog element has a showModal() method that can be used to display a modal dialog box on a web page.Add an event listener to the closeTaskFormBtn variable and pass in a click event for the first argument and a callback function for the second argument.For the callback function, call the showModal() method on the confirmCloseDialog element. This will display a modal with the Discard and Cancel buttons.
closeTaskFormBtn.addEventListener("click", () => {
    //You should display the Cancel and Discard buttons to the user only if there is some text present in the input fields.To begin, within the closeTaskFormBtn event listener, create a formInputsContainValues variable to check if there is a value in the titleInput field or the dateInput field or the descriptionInput field.
    const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;

    //If the user attempts to edit a task but decides not to make any changes before closing the form, there is no need to display the modal with the Cancel and Discard buttons.Inside the closeTaskFormBtn event listener, use const to create another variable named formInputValuesUpdated. Check if the user made changes while trying to edit a task by verifying that the titleInput value is not equal to currentTask.title, or the dateInput value is not equal to currentTask.date, or the descriptionInput value is not equal to currentTask.description.
    const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

    //Create an if statement to check if formInputsContainValues is true. If formInputsContainValues is true, indicating that there are changes, use the showModal() method on confirmCloseDialog.
    if (formInputsContainValues && formInputValuesUpdated) {//Now add formInputValuesUpdated as the second mandatory condition in the if statement using the AND operator.This way, the Cancel and Discard buttons in the modal won't be displayed to the user if they haven't made any changes to the input fields while attempting to edit a task.
        confirmCloseDialog.showModal();
    }//Otherwise, if there are no changes, call the reset() function to clear the input fields and hide the form modal.
    else {
        reset();
    }
});

//If the user clicks the Cancel button, you want to cancel the process and close the modal so the user can continue editing. The HTML dialog element has a close() method that can be used to close a modal dialog box on a web page.Add an event listener to the cancelBtn element and pass in a click event for the first argument and a callback function for the second argument.For the callback function, call the close() method on the confirmCloseDialog element.
cancelBtn.addEventListener("click", () => {
    confirmCloseDialog.close();
});

//If the user clicks the Discard button, you want to close the modal showing the Cancel and Discard buttons, then hide the form modal.Add a click event listener to discardBtn.
discardBtn.addEventListener("click", () => {
    //Use the close() method on the confirmCloseDialog variable.
    confirmCloseDialog.close();
    /*//Use classList to toggle the class hidden on taskForm so the form modal will close too.
    taskForm.classList.toggle("hidden");*/

    //Also, remove the existing code toggling the class hidden on taskForm inside the discardBtn event listener and call the reset function instead. That's because when you click the Discard button, everything in the input fields should go away.
    reset();
});

//Add a submit event listener to your taskForm element and pass in e as the parameter of your arrow function. Inside the curly braces, use the preventDefault() method to stop the browser from refreshing the page after submitting the form.
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    /*//After adding the task to the page, you should close the form modal to view the task. To do this, utilize classList to toggle the hidden class on the taskForm element.
    taskForm.classList.toggle("hidden");*/

    /*//Remove the existing code toggling the class of hidden on taskForm and call the reset function instead. This would clear the input fields and also hide the form modal for the user to see the added task.
    reset();*/

    //Now remove the reset() call inside the taskForm submit event listener and call the addOrUpdateTask function instead.
    addOrUpdateTask();
});

/*Remove the myTaskArr array and all of the code for localStorage because you don't need them anymore.

//A myTaskArr array has been provided for you.
const myTaskArr = [
    { task: "Walk the Dog", date: "22-04-2022" },
    { task: "Read some books", date: "02-11-2023" },
    { task: "Watch football", date: "10-08-2021" },
];
//Use the setItem() method to save it with a key of data.After that, open your browser console and go to the Applications tab, select Local Storage, and the freeCodeCamp domain you see.
localStorage.setItem("data", JSON.stringify(myTaskArr));//If you check the Application tab of your browser console, you'll notice a series of [object Object]. This is because everything you save in localStorage needs to be in string format.To resolve the issue, wrap the data you're saving in the JSON.stringify() method. Then, check local storage again to observe the results.

/*
//You can use localStorage.removeItem() to remove a specific item and localStorage.clear() to clear all items in the local storage.Remove the data item from local storage and open the console to observe the result. You should see null.
localStorage.removeItem("data");
*\/

//Using localStorage.clear() won't just delete a single item from local storage but will remove all items.Remove localStorage.removeItem() and use localStorage.clear() instead. You don't need to pass in anything. You should also see null in the console.
localStorage.clear();

//Now that you have the myTaskArr array saved in localStorage correctly, you can retrieve it with getItem() by specifying the key you used to save the item.Use the getItem() method to retrieve the myTaskArr array and assign it to the variable getTaskArr. Then, log the getTaskArr variable to the console to see the result.
const getTaskArr = localStorage.getItem("data");
console.log(getTaskArr);

//The item you retrieve is a string, as you saved it with JSON.stringify(). To view it in its original form before saving, you need to use JSON.parse().Use getItem() to retrieve the myTaskArr array again. This time, wrap it inside JSON.parse(), assign it to the variable getTaskArrObj and log the getTaskArrObj to the console.Check the console to see the difference between getTaskArr and getTaskObj.
const getTaskArrObj = JSON.parse(localStorage.getItem("data"));
console.log(getTaskArrObj);
*/