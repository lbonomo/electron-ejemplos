const { ipcRenderer } = require('electron');

// *** Elementos ***
const text_console = document.getElementById('console');
const file_input_text = document.getElementById('file_input_text');
const btn_proccess = document.getElementById('proccess');
const spinner = document.getElementById('spinner');
const magik_label = document.getElementById("label-file-input");

// *** EventListener ***
// Por problemas de seguridad no conviene ponerlos in-line
magik_label.addEventListener('click', SelectFile);
btn_proccess.addEventListener('click', MakeList);

function Now() {
   let datetime = new Date(Date.now());
   return datetime.toISOString();
}

function SelectFile(event) {
   event.preventDefault();
   btn_proccess.disabled = false;
   ipcRenderer.send('select_file_main');
}

function MakeList(event) {
   event.preventDefault();
   spinner.classList.add("is-active");
   btn_proccess.disabled = true;
   text_console.value += `${Now()} - Inicio del proceso\n`;
   ipcRenderer.send('make_list_main', file_input_text.value );
}

//**** IPC ****//
ipcRenderer.on('file_name_render', (event, msg) => {
   file_input_text.value = msg;
   text_console.value += `${Now()} - ${msg}\n`;
});

ipcRenderer.on('make_list_render', (event, msg) => {
   spinner.classList.remove("is-active");
   btn_proccess.disabled = false;
   text_console.value += `${Now()} - ${msg}\n`;
   text_console.value += `${Now()} - Fin del proceso\n`;
});
