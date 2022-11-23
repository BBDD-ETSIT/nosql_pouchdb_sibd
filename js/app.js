'use strict';
  var ENTER_KEY = 13;
  var newTodoDom = document.getElementById('new-todo');
  //TODO este estado debe ser cambiado por una base de datos pouchdb
  var state = [];

  //TODO añadir la función db.changes(...) 
  //y una function databaseChangeEvent que obtiene todo de la base de datos y redibuja la interfaz de usuario


  //TODO añadir base de datos couchdb remota y función de sincronización 



  //-------------MODIFICADORES DEL ESTADO DE LA APLICACIÓ -> create, edit, delete todo

  // Tenemos que crear un nuevo documento de tareas pendientes e introducirlo en la base de datos
  function addTodo(text) {
    var todo = {
      _id: new Date().toISOString(),
      title: text,
      completed: false
    };
    //TODO en lugar de hacer push al array del estado, añadir la tarea a la base de datos
    //también eliminar el redrawTodosUI, porque con pouchdb la aplicación se redibuja cuando hay un cambio de base de datos
    state.push(todo);
    redrawTodosUI(state);
  }

  //edit Todo. This is not necessary because todo is passed as reference and so when we modify
  //it in the calling method it is modified in the state
  function editTodo(todo){
    //TODO realizar una edición (put) en la base de datos
    //también eliminar el redrawTodosUI, porque con pouchdb la aplicación se redibuja cuando hay un cambio de base de datos
    redrawTodosUI(state);
  }

  //El usuario ha pulsado el botón de borrado de una tarea, la borramos
  function deleteTodo(todo) {
    //TODO realizar una eliminación en la base de datos
    //también eliminar el redrawTodosUI, porque con pouchdb la aplicación se redibuja cuando hay un cambio de base de datos
    state = state.filter((item) => item._id !== todo._id);
    redrawTodosUI(state);
  }

  //------------- MANEJADORES DE EVENTOS

  function checkboxChanged(todo, event) {
    todo.completed = event.target.checked;
    editTodo(todo);
  }

  // El cuadro de entrada al editar una tarea se ha difuminado (blur, ha perdido el foco), 
  //así que guarde el nuevo título o borre la tarea si el título está vacío
  function todoBlurred(todo, event) {
    var trimmedText = event.target.value.trim();
    if (!trimmedText) {
      deleteTodo(todo);
    } else {
      todo.title = trimmedText;
      editTodo(todo);
    }
  }

  function newTodoKeyPressHandler( event ) {
    if (event.keyCode === ENTER_KEY) {
      addTodo(newTodoDom.value);
      newTodoDom.value = '';
    }
  }

  function deleteButtonPressed(todo){
    deleteTodo(todo);
  }

  // El usuario ha hecho doble clic en una tarea, mostramos una entrada para que pueda editar el título
  function todoDblClicked(todo) {
    var div = document.getElementById('li_' + todo._id);
    var inputEditTodo = document.getElementById('input_' + todo._id);
    div.className = 'editing';
    inputEditTodo.focus();
  }

  // Si pulsan enter mientras editan una entrada, la difuminamos (blur) para activar el guardado (o el borrado)
  function todoKeyPressed(todo, event) {
    if (event.keyCode === ENTER_KEY) {
      var inputEditTodo = document.getElementById('input_' + todo._id);
      inputEditTodo.blur();
    }
  }

  //------------- FUNCIONES DE INTERFAZ DE USUARIO

  function redrawTodosUI(todos) {
    var ul = document.getElementById('todo-list');
    ul.innerHTML = '';
    todos.forEach(function(todo) {
      ul.appendChild(createTodoListItem(todo));
    });
  }

  // Dado un objeto que representa un TODO, esto creará un elemento de la lista para mostrarlo y le añadirá los eventos necesarios
  function createTodoListItem(todo) {
    var checkbox = document.createElement('input');
    checkbox.className = 'toggle';
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', ()=> checkboxChanged(todo));

    var label = document.createElement('label');
    label.appendChild( document.createTextNode(todo.title));
    label.addEventListener('dblclick', ()=>todoDblClicked(todo));

    var deleteLink = document.createElement('button');
    deleteLink.className = 'destroy';
    deleteLink.addEventListener( 'click', ()=>deleteButtonPressed(todo));

    var divDisplay = document.createElement('div');
    divDisplay.className = 'view';
    divDisplay.appendChild(checkbox);
    divDisplay.appendChild(label);
    divDisplay.appendChild(deleteLink);

    var inputEditTodo = document.createElement('input');
    inputEditTodo.id = 'input_' + todo._id;
    inputEditTodo.className = 'edit';
    inputEditTodo.value = todo.title;
    inputEditTodo.addEventListener('keypress', ()=>todoKeyPressed(todo));
    inputEditTodo.addEventListener('blur', ()=>todoBlurred(todo));

    var li = document.createElement('li');
    li.id = 'li_' + todo._id;
    li.appendChild(divDisplay);
    li.appendChild(inputEditTodo);

    if (todo.completed) {
      li.className += 'complete';
      checkbox.checked = true;
    }

    return li;
  }

  //función que añade los eventos iniciales
  function addEventListeners() {
    newTodoDom.addEventListener('keypress', newTodoKeyPressHandler, false);
  }

  //-------------INICIAR TODO CUANDO EL DOM ESTÉ LISTO
  document.addEventListener('DOMContentLoaded', (event) => {
    addEventListeners();
    redrawTodosUI(state);
    //TODO add a call to sync method if remotedb exist
  });
