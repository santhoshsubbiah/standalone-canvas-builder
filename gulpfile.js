const { src, dest, watch, series } = require("gulp");

const prefix = require("gulp-autoprefixer");
const minify = require("gulp-clean-css");
//const imagemin = require("gulp-imagemin");
const sass = require("gulp-sass");
const terser = require("gulp-terser");
const webp = require("gulp-webp");
const concat = require("gulp-concat");

function jsmin() {
    return src("plugins/**/*.js").pipe(concat("min-single.js", { newLine: ";" })).pipe(terser()).pipe(dest("dest/min/js"));
}

function jsunmin() {
    return src("plugins/**/*.js").pipe(concat("unmin-single.js", { newLine: ";" })).pipe(dest("dest/unmin/js"));
}

function watchtask() {
    watch("plugins/**/*.js", jsmin);
    watch("plugins/**/*.js", jsunmin);
}

exports.build = series(jsmin, jsunmin, watchtask);