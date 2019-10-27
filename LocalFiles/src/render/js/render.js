const { ipcRenderer } = require('electron');

let filename = document.getElementById("filename");
let filename_show = document.getElementById("filename_show");
let text = document.getElementById("text");
let save = document.getElementById("save");
let spinner = document.getElementById("spinner");
let autosave = document.getElementById("autosave-check");
let lastsave = document.getElementById("lastsave");
let show_lastsave =  document.getElementById("show_lastsave");
let show_words =  document.getElementById("words");
let text_length = 0;

let lastsave_time = null;

function WordsCount(str) {
  let words = str.split(/[\s,]+/)
  words = words.filter( (value) => { return value != "" })
  console.log(words)
  console.log(words.length)
  return words.length
}

function SaveFile() {
  let data = text.value
  spinner.classList.add("is-active");
  ipcRenderer.send('save_file', data);
}

function IntervalToStr(seconds) {
  // interval esta espresado en milisegundos
  let second = Math.round(seconds % 60)
  let minute = Math.round( ( ( seconds - second) / 60 ) % 60 )
  let hour = Math.round( ( ( seconds - second - (minute * 60 )) / 3600 ) % 60 )

  let h = hour.toString().padStart(2, "0")
  let m = minute.toString().padStart(2, "0")
  let s = second.toString().padStart(2, "0")
  return `${h}:${m}:${s}`
}

function ShowInterval() {
  // https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Date

  if (show_lastsave.classList.contains('hidden') ) {
      show_lastsave.classList.remove('hidden')
  }
  let interval = Math.round((new Date(Date.now()) - lastsave_time)/1000);
  lastsave.textContent = IntervalToStr(interval)
}

/* Auto save */
setInterval(
  () => {
    if (autosave.checked) {
      SaveFile()
    }
  }, 5000
)

/* Actualizo la hora en que se guardo el archivo */
setInterval(
  () => {
      if ( lastsave_time ) { ShowInterval() }
  }, 1000
)

/*** Evnet Listener ***/
/* Selector de archivo */
filename.addEventListener('click', (event) => {
  event.preventDefault();
  // Reset textarea
  text.disabled = true;
  text.value = null;
  show_words.textContent = 0;
  ipcRenderer.send('select_file_main');
})

/* Textarea */
text.addEventListener('keydown', function(event) {

  // TODO - Habilitar salvar despues de N caracteres
  // Mostar fecha/hora de guardado
  //

  // TODO - Habilitar salvar despues de 5 caracteres

  if ( Math.abs( text.value.length - text_length ) >= 5 ) {
    lastsave_time = new Date(Date.now())
    ShowInterval()
    show_words.textContent = WordsCount(text.value)
    save.disabled = false;
  }

  // Ctrl + S para grabar
  if( event.keyCode == 83 && event.ctrlKey ) {
	   SaveFile()
	}

  show_words.textContent = WordsCount(text.value)

});

/* Salvar */
save.addEventListener('click', (event) => {
  event.preventDefault();
  SaveFile();
})

/* Inter Process Communication */
ipcRenderer.on('filename_show', (event, msg) => {
  filename_show.value = msg;
  document.getElementById("show_words").classList.remove('hidden')
});

ipcRenderer.on('file_name_render', (event, msg) => {
  text.disabled = false;
  text.value = msg;
  text_length = text.value.length
  show_words.textContent = WordsCount(text.value)
  text.focus();
  autosave.disabled = false;
});

ipcRenderer.on('file_saved', (err, msg) => {
  console.log("Saved");
  // Solo para que se vea el spinner
  setTimeout(
    () => {
      // Desactivo el boton salbar, paro el spinner y oculto la leyenda de guardado
      save.disabled = true;
      spinner.classList.remove("is-active");
      text.focus()
      text_length = text.value.length
      lastsave_time = null
      show_lastsave.classList.add('hidden')
      show_words.textContent = WordsCount(text.value)
    }, 500)
})
