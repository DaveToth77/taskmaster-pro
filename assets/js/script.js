var tasks = {};

var createTask = function (taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function () {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function (list, arr) {
    // then loop over sub-array
    arr.forEach(function (task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

$(".list-group").on("click", "p", function () {
  let text = $(this)
    .text()
    .trim();



  var textInput = $("<textarea>")
    .addClass("form-control")
    .val(text);

  $(this).replaceWith(textInput);

  textInput.trigger("focus");


});
$('.list-group').on('blur', 'textarea', function () {
  // get the textarea's current value/text
  let text = $(this)
    .val()
    .trim();
  // get the parent ul's id attribute
  let status = $(this)
    .closest('list-group')
    .attr('id')
    .replaceWith('list-', '');

  // get the task's position in thr list of other li elements
  let index = $(this)
    .closest('.list-group-item')
    .index();

  tasks[status][index].text = text;
  saveTasks();

  //recreate p element
  let taskP = $('<p>')
    .addClass('m-1')
    .text(text);

  // replace textarea with p element
  $(this).replaceWith(taskP);

})

//due date was triggered
$('.list-group').on('click', 'span', function () {
  //get current text
  let date = $(this)
    .text()
    .trim();

  // create new input element
  let dateInput = $('<input>')
    .attr('type', 'text')
    .addClass('form-control')
    .val(date);
  var tasks = {};

  var createTask = function (taskText, taskDate, taskList) {
    // create elements that make up a task item
    var taskLi = $("<li>").addClass("list-group-item");
    var taskSpan = $("<span>")
      .addClass("badge badge-primary badge-pill")
      .text(taskDate);
    var taskP = $("<p>")
      .addClass("m-1")
      .text(taskText);

    // append span and p element to parent li
    taskLi.append(taskSpan, taskP);


    // append to ul list on the page
    $("#list-" + taskList).append(taskLi);
  };

  var loadTasks = function () {
    tasks = JSON.parse(localStorage.getItem("tasks"));

    // if nothing in localStorage, create a new object to track all task status arrays
    if (!tasks) {
      tasks = {
        toDo: [],
        inProgress: [],
        inReview: [],
        done: []
      };
    }

    // loop over object properties
    $.each(tasks, function (list, arr) {
      console.log(list, arr);
      // then loop over sub-array
      arr.forEach(function (task) {
        createTask(task.text, task.date, list);
      });
    });
  };

  var saveTasks = function () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };




  // modal was triggered
  $("#task-form-modal").on("show.bs.modal", function () {
    // clear values
    $("#modalTaskDescription, #modalDueDate").val("");
  });

  // modal is fully visible
  $("#task-form-modal").on("shown.bs.modal", function () {
    // highlight textarea
    $("#modalTaskDescription").trigger("focus");
  });

  // save button in modal was clicked
  $("#task-form-modal .btn-primary").click(function () {
    // get form values
    var taskText = $("#modalTaskDescription").val();
    var taskDate = $("#modalDueDate").val();

    if (taskText && taskDate) {
      createTask(taskText, taskDate, "toDo");

      // close modal
      $("#task-form-modal").modal("hide");

      // save in tasks array
      tasks.toDo.push({
        text: taskText,
        date: taskDate
      });

      saveTasks();
    }
  });

  // task text was clicked
  $(".list-group").on("click", "p", function () {
    // get current text of p element
    var text = $(this)
      .text()
      .trim();

    // replace p element with a new textarea
    var textInput = $("<textarea>").addClass("form-control").val(text);
    $(this).replaceWith(textInput);

    // auto focus new element
    textInput.trigger("focus");
  });

  // editable field was un-focused
  $(".list-group").on("blur", "textarea", function () {
    // get current value of textarea
    var text = $(this).val();

    // get status type and position in the list
    var status = $(this)
      .closest(".list-group")
      .attr("id")
      .replace("list-", "");
    var index = $(this)
      .closest(".list-group-item")
      .index();

    // update task in array and re-save to localstorage
    tasks[status][index].text = text;
    saveTasks();

    // recreate p element
    var taskP = $("<p>")
      .addClass("m-1")
      .text(text);

    // replace textarea with new content
    $(this).replaceWith(taskP);
  });

  // due date was clicked
  $(".list-group").on("click", "span", function () {
    // get current text
    var date = $(this)
      .text()
      .trim();

    // create new input element
    var dateInput = $("<input>")
      .attr("type", "text")
      .addClass("form-control")
      .val(date);
    $(this).replaceWith(dateInput);

    // automatically bring up the calendar
    dateInput.trigger("focus");
  });

  // value of due date was changed
  $(".list-group").on("blur", "input[type='text']", function () {
    var date = $(this).val();

    // get status type and position in the list
    var status = $(this)
      .closest(".list-group")
      .attr("id")
      .replace("list-", "");
    var index = $(this)
      .closest(".list-group-item")
      .index();

    // update task in array and re-save to localstorage
    tasks[status][index].date = date;
    saveTasks();

    // recreate span and insert in place of input element
    var taskSpan = $("<span>")
      .addClass("badge badge-primary badge-pill")
      .text(date);
    $(this).replaceWith(taskSpan);
  });

  // remove all tasks
  $("#remove-tasks").on("click", function () {
    for (var key in tasks) {
      tasks[key].length = 0;
      $("#list-" + key).empty();
    }
    saveTasks();
  });

  // load tasks for the first time
  loadTasks();



  //swap out elements
  $(this).replaceWith(dateInput);

  //automatically focus on a new element
  dateInput.trigger('focus');
})

//value of due date was changed
$('.list-group').on('blur', "input[type='text']", function () {
  //get current text
  let date = $(this)
    .val()
    .trim();

  //get the parent ul's id attribute
  let status = $(this)
    .closest('.list-group')
    .attr('id')
    .replace('.list-', '');

  //get the tasks position in the list if other li elements
  let index = $(this)
    .closest('.list-group-item')
    .index();

  // update task in array and re-save to localstorage
  tasks[status][index].date = date;
  saveTasks();

  //recreate span element with bootstrap classes
  let taskSpan = $('<span>')
    .addClass('badge badge-primary badge-pill')
    .text(date);

  //replace input with span element
  $(this).replaceWith(taskSpan);

})

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function () {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function () {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function () {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function () {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();