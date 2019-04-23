const { ipcRenderer } = require('electron');

let filename = document.getElementById("filename");
let filename_show = document.getElementById("filename_show");
let text = document.getElementById("text");
let save = document.getElementById("save");
let spinner = document.getElementById("spinner");
let autosave = document.getElementById("autosave-check");
let count = 1;

function SaveFile() {
  let data = text.value
  spinner.classList.add("is-active");
  ipcRenderer.send('save_file', data);
}



/* Evnet Listener */

/* AUTO SAVE */
// autosave.addEventListener('change', () => {
//   if ( autosave.checked) {
//     setTimeout(SaveFile(), 5000)
//   }
// })

filename.addEventListener('click', (event) => {
  event.preventDefault();
  ipcRenderer.send('select_file_main');
})

text.addEventListener('keydown', function(event) {
  // TODO - Habilitar salvar despues de N caracteres
  // TODO - Habilitar salvar despues de N caracteres
  // Mostar fecha/hora de guardado
  //
  if(event.keyCode == 13 && event.ctrlKey) {
	   SaveFile()
	}
  count += 1
  if ( count >= 5 ) {
    save.disabled = false;
  }

});

save.addEventListener('click', (event) => {
  event.preventDefault();
  SaveFile();
})

/* Inter Process Communication */
ipcRenderer.on('filename_show', (event, msg) => {
  filename_show.value = msg;
});

ipcRenderer.on('file_name_render', (event, msg) => {
  text.disabled = false;
  text.value = msg;
  text.focus();
});

ipcRenderer.on('file_saved', (err, msg) => {
  console.log("Saved");
  // Solo para que se vea el spinner
  setTimeout(
    () => {
      save.disabled = true;
      count = 0;
      spinner.classList.remove("is-active");
      text.focus()
    }, 500)
})
