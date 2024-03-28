const { src, dest, watch, parallel } = require("gulp");

//css
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");

//Javascript
const terser = require("gulp-terser-js");

const css = (cb) => {
  src("src/scss/**/*.scss") //Identificar el archivo SASS
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass()) // Compilarlo
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("build/css")); // Almacenarla en el disco duro

  cb(); // Callback que avisa a gulp cuando llegamos al final
};

//imagenes
const cache = require("gulp-cache");
const imagemin = require("gulp-imagemin");
const avif = require("gulp-avif");

function imagenes(cb) {
  const opciones = {
    optimizationLevel: 3,
  };

  src("src/img/**/*.{png,PNG,jpg,JPG}")
    .pipe(cache(imagemin(opciones)))
    .pipe(dest("build/img"));

  cb();
}

function versionAvif(cb) {
  const opciones = {
    quality: 50,
  };

  src("src/img/**/*.{png,PNG,jpg,JPG}") // Busca recursivamente en todos los archivos y carpetas de la carpeta img con los formatos especificados
    .pipe(avif(opciones)) // Los convierte en formato WEBP y les baja la calidad especificada
    .pipe(dest("build/img"));

  cb();
}

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

function javascript(cb) {
  src("src/js/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write("."))
    .pipe(dest("build/js"));

  cb();
}

const dev = (cb) => {
  watch("src/scss/**/*.scss", css);
  watch("src/js/**/*.js", javascript);

  cb();
};

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.dev = parallel(
  imagenes,
  versionWebp,
  versionAvif,
  javascript,
  dev,
  css
);
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
