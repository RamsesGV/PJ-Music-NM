const { src, dest, watch, parallel } = require("gulp");

//css
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");

const css = (cb) => {
  src("src/scss/**/*.scss") //Identificar el archivo SASS
    .pipe(plumber())
    .pipe(sass()) // Compilarlo
    .pipe(dest("build/css")); // Almacenarla en el disco duro

  cb(); // Callback que avisa a gulp cuando llegamos al final
};

//imagenes

async function versionWebp(done) {
  const webp = await import("gulp-webp"); // Manda a traer la dependencia instalada con "npm install --save-dev gulp-webp" desde la terminal"

  const opciones = {
    quality: 50, // Esto define que tanta calidad se le bajarán a las imágenes
  };

  src("src/img/**/*.{png,PNG,jpg,JPG}") // Busca recursivamente en todos los archivos y carpetas de la carpeta img con los formatos especificados
    .pipe(webp.default(opciones)) // Los convierte en formato WEBP y les baja la calidad especificada
    .pipe(dest("build/img")); // Los guarda en una nueva carpeta

  done(); // Callback que avisa a gulp cuando llegamos al final de la ejecución del script
}

const dev = (cb) => {
  watch("src/scss/**/*.scss", css);

  cb();
};

exports.css = css;
exports.dev = parallel(versionWebp, dev);
exports.versionWebp = versionWebp;
