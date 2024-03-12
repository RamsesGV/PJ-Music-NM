const { src, dest, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");

const css = (cb) => {
  src("src/scss/**/*.scss") //Identificar el archivo SASS
    .pipe(plumber())
    .pipe(sass()) // Compilarlo
    .pipe(dest("build/css")); // Almacenarla en el disco duro

  cb(); // Callback que avisa a gulp cuando llegamos al final
};

const dev = (cb) => {
  watch("src/scss/**/*.scss", css);

  cb();
};

exports.css = css;
exports.dev = dev;
