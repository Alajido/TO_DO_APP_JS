// on app load, get all task from the localStorage
window.onload = loadTasks;

const darkModeToggler = document.querySelector('#dark-mode-toggle');
let darkMode = localStorage.getItem('darkMode');
const icon = document.querySelector('#icon')
console.log(darkModeToggler, icon, darkMode);

const enableDarkMode = () => {
    document.body.classList.add('dark-mode');

    localStorage.setItem('darkMode', 'enabled');
};

const disableDarkMode = () => {
    document.body.classList.remove('dark-mode');

    localStorage.setItem('darkMode', null);
};



if (darkMode === 'enabled') {
    enableDarkMode();
    icon.src ="/images/sun2.png"
};


darkModeToggler.addEventListener('click', () => {
    darkMode = localStorage.getItem('darkMode');
    if (darkMode !== 'enabled'){
        enableDarkMode()
        icon.src ="/images/sun2.png"
    } else {
        disableDarkMode()
        icon.src ="/images/moon.png"
    }
});



// on form Submit, add task
document.querySelector('form').addEventListener('submit', e =>{
    // prevent form from submitting the data
    e.preventDefault();
    // add tasks to the localStorage, either
    addTask();
});

// function to laod tasks on window load
function loadTasks() {
    // check if localStorage has any task
    // if not, then return
    if (localStorage.getItem('tasks') == null)
    return;

    // get task from localStorage and convert them to an array
    let tasks = Array.from(JSON.parse(localStorage.getItem('tasks')));

    // loop through the tasks and add to the list
    tasks.forEach(task => {
        // get the ul fro our html document
        const list = document.querySelector('ul');
        // creating list item
        const li = document.createElement('li');
        // add the li document onto the li element
        li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${task.completed ? 'checked' : ''}>
        <input type="text" value="${task.task}" class="task ${task.completed ? 'completed' : ''}" onfocus="getCurrentTask(this)" onblur="editTask(this)">
        <i class="fa fa-trash" onclick="removeTask(this)"></i>`;

        //inserting the li into the ul at the first position
        list.insertBefore(li, list.children[0]);
    });
};

// add task function
function addTask() {
    // getting the user input
    const task = document.querySelector('form input');
    // getting the ul
    const list = document.querySelector('ul');

    // validating user to make sure something is been entered
    if (task.value.trim() === '') {
        Swal.fire({
            confirmButtonColor: '#ff7733',
            icon: 'error',
            title: 'Oops...',
            text: 'Please Add a Task!',
          })
        return false;
    } else {
        Swal.fire({
            confirmButtonColor: '#ff7733',
            icon: 'success',
            title: '',
            text: 'Task Added',
        })
        console.log(`hello world`)
    };

    // check if task exist
    if (document.querySelector(`input[value = "${task.value}"]`)) {
        // sweet alert
        Swal.fire({
            confirmButtonColor: '#ff7733',
            icon: 'info',
            title: 'Oops...',
            text: 'Task Already Exist!',
          })
        return false;
    };

    // add task to the local storage
    localStorage.setItem('tasks', JSON.stringify([...JSON.parse(localStorage.getItem('tasks') || '[]'), {task: task.value, completed: false }]));
    
    // create li and append to the list
    const li = document.createElement('li');
    // add the value to the li element
    li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${task.completed ? 'checked' : ''}>
    <input type="text" value="${task.value}" class="task ${task.completed ? 'completed' : ''}" onfocus="getCurrentTask(this)" onblur="editTask(this)">
    <i class="fa fa-trash" onclick="removeTask(this)"></i>`;

    // insert the li to our list 
    list.insertBefore(li, list.children[0]);
    // clear the input field
    task.value = '';
};


// mark task as completed function
function taskComplete(e) {
    let tasks = Array.from(JSON.parse(localStorage.getItem('tasks')));

    tasks.forEach(task => {
        if (task.task === e.nextElementSibling.value) {
            task.completed = !task.completed
        }
    });
    
    localStorage.setItem('tasks', JSON.stringify(tasks))
    e.nextElementSibling.classList.toggle('completed')
}

// remove task function
function removeTask(e) {
    let tasks = Array.from(JSON.parse(localStorage.getItem('tasks')));
    // loop through each task 
    tasks.forEach(task => {
        if (task.task === e.parentNode.children[1].value) {
            tasks.splice(tasks.indexOf(task), 1);
        };
    });
    localStorage.setItem('tasks', JSON.stringify(tasks))
    Swal.fire({
        title: 'Are you sure?',
        text: "You want to delete this task",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff7733',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your Task has been deleted.',
            'success',
            e.parentElement.remove()
          )
        }
    });
    // e.parentElement.remove()
   
};

// store current task to track changes
var currentTask = null;

// get current task
function getCurrentTask(e) {
    currentTask = e.value;
};

// function to edit task and get the current task
function editTask(e) {
    let tasks = Array.from(JSON.parse(localStorage.getItem('tasks')));

    // check if user delete the task without typing the updated task
    if (e.value.trim() === '') {
        // sweet alert
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Tasks is Empty',
          })
        e.value === currentTask;
        return;
    };

    // task already exist
    tasks.forEach(task => {
        if (task.task === e.value) {
            // sweet alert
            Swal.fire({
                icon: 'info',
                title: 'Oops...',
                text: 'Task Already Exist!',
              })
            e.value === currentTask;
            return;
        }

    })

    //update task
    tasks.forEach(task => {
        if (task.task === currentTask) {
            task.task =e.value
        };
    });

    // update the local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}