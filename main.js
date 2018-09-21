var data = {
    general: [
        {
            id: 0,
            deleted: false,
            done: false,
            ceated: '2018-09-18 10:00:00',
            title: 'Data Objekt definieren',
            description: 'Ein Data Objekt definieren, mit welchem man ein DatenModell aufabauen kann',
            tasks: [
                {
                    title: 'Eine Unteraufgabe anlegen',
                    done: true,
                }
            ]
        }
    ]
}

var searchString = "";

const STORAGE_NAME = "ToDo";

/**
 *sucht in ToDoListenArray nach der größten Id und gibt diese wieder. 
 * @param {String} listName
 */
function getLastId(listName) {
    var maxId = -1;
    for (var i = 0; i < data[listName].length; i++) {
        if (data[listName][i].id > maxId) {
            maxId = data[listName][i].id;
        }
    }
    return maxId;
}

/**
 * Erstellt ein neues ToDo
 * @param {String} listName
 * @param {String} title
 * @param {String | undefined} description
 */
function createToDo(listName, title, description) {
    if (!listName) {
        throw new Error("Bitte Listennamen angeben");
    }
    if (!title) {
        throw new Error("Bitte Titel angeben");
    }

    if (!data[listName]) {
        data[listName] = [];
    }
    var ToDo = {
        id: getLastId(listName) + 1,
        deleted: false,
        done: false,
        ceated: new Date(),
        title: title,
        description: description,
        tasks: []
    }
    data[listName].push(ToDo);

    saveDataToLocalStorage();
}

/**
 * Löscht ToDo
 * @param {String} listName
 * @param {Number} id
 */
function deleteToDo(listName, id) {
    if (!listName) {
        throw new Error("Bitte Listennamen angeben");
    }

    if (id === undefined) {
        throw new Error("Bitte ID angeben");
    }

    updateToDo(listName, id, null, null, null, true);

    saveDataToLocalStorage();
}

/**
 * updated ein ToDo
 * @param {String} listName
 * @param {Number} id
 * @param {String | null} title
 * @param {String | null} description
 * @param {Boolean | null} done
 * @param {Boolean | null} deleted
 */
function updateToDo(listName, id, title = null, description = null, done = null, deleted = null) {
    if (!listName) {
        throw new Error("Bitte Listennamen angeben");
    }

    if (id === undefined) {
        throw new Error("Bitte ID angeben");
    }

    if (!data[listName]) {
        throw new Error("Liste nicht vorhanden");
    }

    var found = false;
    for (var i = 0; i < data[listName].length; i++) {
        if (id === data[listName][i].id) {
            found = true;
            data[listName][i].title = title != null ? title : data[listName][i].title;
            data[listName][i].description = description != null ? description : data[listName][i].description;
            data[listName][i].done = done != null ? done : data[listName][i].done;
            data[listName][i].deleted = deleted != null ? deleted : data[listName][i].deleted;
            break;
        }

    }
    if (!found) {
        throw new Error("ToDo nicht vorhanden");
    }

    saveDataToLocalStorage();
}

/**
 * Setzt deleted auf false (stellt ToDo wieder her)
 * @param {String} listName
 * @param {Number} id
 */
function restoreToDo(listName, id) {
    if (!listName) {
        throw new Error("Bitte Listennamen angeben");
    }

    if (!id) {
        throw new Error("Bitte ID angeben");
    }

    updateToDo(listName, id, null, null, null, false);

    saveDataToLocalStorage();
}

/**
 * Erstellt Unteraufgaben
 * @param {String} listName
 * @param {Number} toDoId
 * @param {String} title
 */
function createTask(listName, toDoId, title) {
    if (!listName) {
        throw new Error("Bitte Listennamen angeben");
    }

    if (toDoId === undefined) {
        throw new Error("Bitte ID angeben");
    }
    if (!title) {
        throw new Error("Bitte Titel angeben");
    }

    if (!data[listName]) {
        throw new Error("Liste nicht vorhanden");
    }

    var found = false;
    for (var i = 0; i < data[listName].length; i++) {
        if (toDoId === data[listName][i].id) {
            found = true;
            data[listName][i].tasks.push({
                title: title,
                done: false
            });
            break;
        }
    }
    if (!found) {
        throw new Error("ToDo nicht vorhanden");
    }

    saveDataToLocalStorage();
}

/**
 * Löscht Unteraufgabe
 * @param {String} listName
 * @param {Number} toDoId
 * @param {String} title
 */
function deleteTask(listName, toDoId, title) {
    if (!listName) {
        throw new Error("Bitte Listennamen angeben");
    }

    if (toDoId === undefined) {
        throw new Error("Bitte ID angeben");
    }

    if (!title) {
        throw new Error("Bitte Titel angeben");
    }

    if (!data[listName]) {
        throw new Error("Liste nicht vorhanden");
    }

    var foundToDo = false;

    for (var i = 0; i < data[listName].length; i++) {
        if (toDoId !== data[listName][i].id) {
            continue;
        }

        foundToDo = true;

        var foundTask = false;
        var filteredTasks = [];

        for (var x = 0; x < data[listName][i].tasks.length; x++) {
            if (title === data[listName][i].tasks[x].title) {
                foundTask = true;
                continue;
            }

            filteredTasks.push(data[listName][i].tasks[x]);
        }

        if (!foundTask) {
            throw new Error("Unteraufgabe nicht vorhanden");
        }

        data[listName][i].tasks = filteredTasks

    }

    if (!foundToDo) {
        throw new Error("ToDo nicht vorhanden");
    }

    saveDataToLocalStorage();
}

/**
 * Setzt Unteraufgabe erledigt auf true bzw false
 * @param {String} listName
 * @param {Number} toDoId
 * @param {String} title
 */
function toggleTask(listName, toDoId, title) {
    if (!listName) {
        throw new Error("Bitte Listennamen angeben");
    }

    if (toDoId === undefined) {
        throw new Error("Bitte ID angeben");
    }

    if (!title) {
        throw new Error("Bitte Titel angeben");
    }

    if (!data[listName]) {
        throw new Error("Liste nicht vorhanden");
    }

    var foundToDo = false;

    for (var i = 0; i < data[listName].length; i++) {
        if (toDoId !== data[listName][i].id) {
            continue;
        }

        foundToDo = true;

        var foundTask = false;

        for (var x = 0; x < data[listName][i].tasks.length; x++) {
            if (title === data[listName][i].tasks[x].title) {
                data[listName][i].tasks[x].done = !data[listName][i].tasks[x].done;
                foundTask = true;
                break;
            }
        }

        if (!foundTask) {
            throw new Error("Unteraufgabe nicht vorhanden");
        }
    }

    if (!foundToDo) {
        throw new Error("ToDo nicht vorhanden");
    }

    saveDataToLocalStorage();
}

/**Lädt Daten aus LocalStorage */
function loadDataFromLocalStorage() {
    var storage = localStorage.getItem(STORAGE_NAME)

    if (storage === null) {
        data = {};
        return;
    }

    data = JSON.parse(storage);
}

/**Speichert Daten in LocalStorage */
function saveDataToLocalStorage() {
    var dataAsJson = JSON.stringify(data);
    localStorage.setItem(STORAGE_NAME, dataAsJson);
}

/**Schließt details(rechts) */
function closeDetailsHandler() {
    document.getElementsByTagName("body")[0].classList.remove("details-opened");
}

/**öffnet Details */
function openDetails() {
    document.getElementsByTagName("body")[0].classList.add("details-opened");
    document.getElementById("newTaskInput").value = "";
}

/**
 * Erstellt einen ToDo-Div mit Check-Button im LocalStorage
 * @param {object} toDo
 */
function createToDoBox(toDo) {
    var el = document.createElement("div");
    el.classList.add("ToDo");
    el.classList.add("clickable");
    if (toDo.done) {
        el.classList.add("done")
    }

    var container = document.createElement("div");
    container.classList.add("button-container");

    var btn = document.createElement("button");
    if (toDo.done) {
        var checkMark = document.createElement('span');
        checkMark.innerHTML = "&#10004;";
        btn.appendChild(checkMark);
    }
    btn.classList.add("ToDoBtn");
    btn.addEventListener("click", () => {

        var currentList = localStorage.getItem("currentList");
        if (currentList === null) {
            currentList = "general";
        }

        updateToDo(currentList, toDo.id, null, null, !toDo.done);
        paintToDos();
    });

    var title = document.createElement("h3");
    title.innerHTML = toDo.title;

    var counter = document.createElement("span");
    counter.classList.add("counter");
    counter.innerHTML = toDo.tasks.filter((t) => t.done).length + "/" + toDo.tasks.length;

    container.appendChild(btn);
    el.appendChild(container);
    el.appendChild(counter);
    el.appendChild(title);
    el.addEventListener("click", (event) => {
        if (event.target.className === "ToDoBtn") {
            return;
        }
        openToDoHandler(toDo.id);
    });
    return el;
}

/**Zieht Info über ToDoBox aus LocalStorage und lässt als Grafik erscheinen */
function paintToDos() {
    var currentList = localStorage.getItem("currentList");
    if (currentList === null) {
        currentList = "general";
    }

    if (!data[currentList] && currentList !== "general") {
        throw new Error("Liste nicht vorhanden");
    } else if (!data[currentList]) {
        data["general"] = [];
    }

    var ToDos = document.getElementById("ToDos");
    var done = 0;
    var total = 0;

    ToDos.innerHTML = "";
    data[currentList].forEach((t) => {
        if (t.deleted) {
            return;
        }
 
        if (searchString) {
            if (t.title.indexOf(searchString) < 0) {
                return;
            }
        }

        total++;
        if (t.done) {
            done++;
        }
        var ToDo = createToDoBox(t);
        ToDos.appendChild(ToDo);
    })
    updateCounter(done, total);
}

/**Speichert Neue ToDos und Änderungen an ToDos  */
function saveToDoHandler() {
    var editor = document.querySelector(".details.section form");

    var ToDo = {
        id: parseInt(editor.elements["id"].value),
        deleted: editor.elements["deleted"].value === "true",
        done: editor.elements["done"].value === "true",
        created: '',
        title: editor.elements["title"].value,
        description: editor.elements["description"].value,
        tasks: []
    };

    var currentList = localStorage.getItem("currentList");
    if (currentList === null) {
        currentList = "general";
    }

    if (ToDo.id === -1) {
        createToDo(currentList, ToDo.title, ToDo.description);
    } else {
        updateToDo(currentList, ToDo.id, ToDo.title, ToDo.description, ToDo.done, ToDo.deleted);
    }

    editor.elements["id"].value = getLastId(currentList);

    paintToDos();
    openToDoHandler(parseInt(editor.elements["id"].value));
}

/**
 * öffnet details rechts
 * @param {Number} id
 */
function openToDoHandler(id) {

    if (id === undefined) {
        throw new Error("ID muss angegeben werden");
    }

    var ToDo = {
        id: -1,
        deleted: false,
        done: false,
        ceated: '',
        title: '',
        description: '',
        tasks: []
    };

    if (id > -1) {
        var currentList = localStorage.getItem("currentList");
        if (currentList === null) {
            currentList = "general";
        }
        ToDo = data[currentList].find((t) => t.id === id);

        if (ToDo === null) {
            throw new Error("ToDo muss angegeben werden.")
        }
        /*  
         find((t) => t.id === id); 
            
         \/  \/  \/  \/ \/  \/
  
         ToDo = null;
          for (var i = 0; i < data[currentList].length; i++) {
              if (data[currentList][i].id === id) {
                  ToDo = data[currentList][i];
                  break;
              }
          }*/
    }

    var editor = document.querySelector(".details.section form");
    editor.elements["id"].value = id;
    editor.elements["title"].value = ToDo.title;
    editor.elements["description"].value = ToDo.description ? ToDo.description : "";
    editor.elements["done"].value = ToDo.done;
    editor.elements["deleted"].value = ToDo.deleted;
    //TODO: Tasks füllen   

    var taskContainer = document.getElementById("taskContainer");
    taskContainer.innerHTML = "";
    ToDo.tasks.forEach((t) => {
        var button = document.createElement("button");
        button.classList.add("task");

        if (t.done) {
            button.classList.add("done");
        }

        button.setAttribute("type", "button");
        button.innerHTML = t.title;

        button.addEventListener("click", () => {
            toggleTask(currentList, ToDo.id, t.title);
            openToDoHandler(id);
            paintToDos();
        });

        taskContainer.appendChild(button);
    })
    var detailTask = document.getElementById("details-tasks");
    var deleteDetailsButton = document.getElementById("details-delete-button");
    if (id === -1) {
        detailTask.classList.add("hidden");
        deleteDetailsButton.classList.add("hidden");
    } else {
        detailTask.classList.remove("hidden");
        deleteDetailsButton.classList.remove("hidden");
    }
    openDetails();

}

/**
 * Fügt Unteraufgaben hinzu
 * @param {Event} event
 */
function addTaskHandler(event) {
    var currentList = localStorage.getItem("currentList");
    if (currentList === null) {
        currentList = "general";
    }

    var title = event.target.elements["newTask"].value;
    var idInput = document.querySelector(".details.section form").elements["id"];
    var toDoId = parseInt(idInput.value);

    createTask(currentList, toDoId, title);
    openToDoHandler(toDoId);
    paintToDos();
}

/**
 * Counter für erledigte ToDos
 * @param {Number} done
 * @param {Number} total
 */
function updateCounter(done, total) {
    var conuter = document.getElementById("counter");
    counter.innerHTML = done + "/" + total;
}

/**Löscht einen ToDo */
function deleteToDoHandler() {
    var currentList = localStorage.getItem("currentList");
    if (currentList === null) {
        currentList = "general";
    }

    var editor = document.querySelector(".details.section form");
    var id = parseInt(editor.elements["id"].value);

    deleteToDo(currentList, id);
    paintToDos();
    closeDetailsHandler();
}


function paintLists() {
    var listContainer = document.getElementById("list-select");
    listContainer.innerHTML = "";
    var currentList = localStorage.getItem("currentList");

    if (currentList === null) {
        currentList = "general";
    }

    for (var listName in data) {
        if (!data.hasOwnProperty(listName)) {
            continue;
        }

        var li = document.createElement("li");
        li.innerHTML = listName;

        if (listName === currentList) {
            li.classList.add("active")
        }
        li.addEventListener("click", (event) => {
            switchListHandler(event);
        });
        listContainer.appendChild(li);
    }

    var newList = document.getElementById("new-list");
    newList.value = "";

}


function createListHandler() {
    var newList = document.getElementById("new-list");

    try {
        createList(newList.value);
    } catch (e) {
        alert(e.message)
    }



    paintLists();
    newList.value = "";
}


function createList(listName) {

    if (!listName) {
        throw new Error("Bitte Listennamen angeben");
    }

    if (data[listName]) {
         throw new Error ("Liste bereits vorhanden.");
    }
    data[listName] = [];
    saveDataToLocalStorage();

}


function switchList(listName) {
    
    if (!listName) {
        throw new Error ("Listname wurde nicht angegeben.")
    }

    localStorage.setItem("currentList", listName);
}


function switchListHandler(event) {
    switchList(event.target.innerHTML);
    closeDetailsHandler();
    paintToDos();
    paintLists();
}

function searchHandler(event) {
    searchString = event.target.value;
    paintToDos();
}


/**wird ausgeführt bei start der seite (lädt und bildet ToDos ab */
function start() {
    loadDataFromLocalStorage();
    paintToDos();
    paintLists();
}


document.addEventListener("DOMContentLoaded", start);