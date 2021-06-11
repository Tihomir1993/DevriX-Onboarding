const { src, dest, watch, series, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const gulp = require('gulp');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const sassLint = require('gulp-sass-lint');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
 
const files = {
  scssPath: 'assets/src/sass/**/[^_]*.?(s)css',
  jsPath: 'assets/src/scripts/**/*.js',
  imagesPath: 'assets/src/images/*',
  htmlPath: './index.html'
}

function scssTask() {
  return src(files.scssPath)
      .pipe(sassLint())
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError())
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(postcss([ autoprefixer() ]))
      .pipe(dest('dist/css'))
      .pipe(postcss([cssnano()]))
      .pipe(rename({ extname: '.min.css' }))
      .pipe(sourcemaps.write('.'))
      .pipe(dest('dist/css'));
}


function jsTask() {
  return src(files.jsPath)
      .pipe(babel({
          presets: ['@babel/env']
      }))
      .pipe(concat('bundle.js'))
      .pipe(dest('dist/scripts'))
      .pipe(uglify())
      .pipe(rename({ extname: '.min.js' }))
      .pipe(dest('dist/scripts'));
}

function imagesTask() {
  return src(files.imagesPath)
      .pipe(imagemin())
      .pipe(gulp.dest('dist/images'));
}

function watchTask() {
  browserSync.init({
      server: {
          baseDir: './'
      }
  });

  watch(
      [files.scssPath, files.jsPath, files.imagesPath, files.htmlPath],
      parallel(scssTask, jsTask, imagesTask)
  ).on('change', browserSync.reload);
}

exports.default = series(
  parallel(scssTask, jsTask, imagesTask),
  watchTask
)

