var add_note = document.querySelector(".new_note_content");
var theme = document.querySelector("#themes");
var input_value = document.querySelector(".note_input");
var add_notes = document.querySelector(".apply_btn");
var new_container = document.querySelector(".notes_container");
var search_input = document.querySelector(".search_note");
var notes = [];
var searchQuery = '';
var userOption = 'all';
var type = document.querySelector("select");

search_input?.addEventListener('input', function (e) {
    searchQuery = e.target.value.toLowerCase();
    displayNotes();
});

document.querySelector(".cancel_btn")?.addEventListener("click", remove_modal);
document.querySelector(".add_btn")?.addEventListener("click", function () {
    add_note.style.display = "block";
});

window.addEventListener("click", function (e) {
    if (add_note?.style.display === "block" && e.target.classList.contains("new_note_content")) {
        remove_modal();
    }
});

add_notes?.addEventListener("click", function () {
    if (input_value?.value.trim() !== '') {
        notes.push({ text: input_value.value, done: false });
        saveNotes();
        displayNotes();
        remove_modal();
    }
});

theme?.addEventListener("click", function () {
    var curr = theme.getAttribute('name');
    if (curr === "light") {
        document.documentElement.style.setProperty('--primary-color', '#252525');
        document.documentElement.style.setProperty('--text-color', 'white');
        theme.setAttribute('name', "dark");
    } else {
        document.documentElement.style.setProperty('--primary-color', 'white');
        document.documentElement.style.setProperty('--text-color', '#252525');
        theme.setAttribute('name', "light");
    }
});

type?.addEventListener('change', function (e) {
    userOption = e.target.value;
    displayNotes();
});

function initializeNotes() {
    var saved_notes = localStorage.getItem('notes');
    if (saved_notes && saved_notes !== '[]') {
        notes = JSON.parse(saved_notes);
        displayNotes();
    } else {
        empthyCover();
    }
}

function empthyCover() {
    if (new_container) {
        new_container.innerHTML = '';
        var newNote = document.createElement("div");
        var img = document.createElement("img");
        img.src = "./image/image.jpg";
        var div = document.createElement("h2");
        div.innerHTML = notes.length === 0 ? "Empty...." : userOption === 'active' ? "No active tasks" : userOption === 'completed' ? "No completed tasks" : "Empty....";
        div.style.color = theme?.getAttribute('name') === "light" ? "black" : "white";
        newNote.appendChild(img);
        newNote.appendChild(div);
        new_container.appendChild(newNote);
    }
}

function remove_modal() {
    if (add_note) {
        add_note.style.display = "none";
        if (input_value) input_value.value = "";
    }
}

function displayNotes() {
    if (new_container) {
        new_container.innerHTML = '';
        let filteredNotes = notes;
        if (userOption === 'Incomplete') filteredNotes = notes.filter(note => !note.done);
        else if (userOption === 'Complete') filteredNotes = notes.filter(note => note.done);
        if (searchQuery) filteredNotes = filteredNotes.filter(note => note.text.toLowerCase().includes(searchQuery));
        if (filteredNotes.length === 0) return empthyCover();

        filteredNotes.forEach((note, index) => {
            var newNote = document.createElement("div");
            newNote.className = "newNote";
            newNote.setAttribute('data-index', `${index}`);
            newNote.innerHTML = `
                <div class="notes">
                    <div>
                        <input type="checkbox" class="note-checkbox" ${note.done ? 'checked' : ''}>
                        <label style="text-decoration: ${note.done ? 'line-through' : 'none'}; color: ${note.done ? 'gray' : 'black'}">${note.text}</label>
                    </div>
                    <div class="note_buttons">
                        <button class="delete_btn">🗑️</button>
                        <button class="edit_btn">✏️</button>
                    </div>
                </div>
                <hr>`;

            newNote.querySelector('.note-checkbox')?.addEventListener('change', function () {
                notes[index].done = this.checked;
                saveNotes();
                displayNotes();
            });
            
            newNote.querySelector('.delete_btn')?.addEventListener('click', function () {
                notes.splice(index, 1);
                saveNotes();
                displayNotes();
            });
            
            newNote.querySelector('.edit_btn')?.addEventListener('click', function () {
                var newText = prompt('Edit note:', notes[index].text);
                if (newText?.trim()) {
                    notes[index].text = newText;
                    saveNotes();
                    displayNotes();
                }
            });
            
            new_container.appendChild(newNote);
        });
    }
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

initializeNotes();
