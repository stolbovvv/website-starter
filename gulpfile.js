import gulp from 'gulp';
import path from 'path';
import cssnano from 'cssnano';
import browsersync from 'browser-sync';
import autoprefixer from 'autoprefixer';
import gzip from 'gulp-zip';
import babel from 'gulp-babel';
import terser from 'gulp-terser';
import rename from 'gulp-rename';
import postcss from 'gulp-postcss';
import { deleteAsync } from 'del';

// Setting: dir
const dir = {
  root: path.basename(path.resolve()),
  build: 'dist',
  source: 'src',
};

// Setting: mode
const mode = {
  dev: !process.argv.includes('--production'),
  prod: process.argv.includes('--production'),
};

// Task: handle styles
function handleStyles() {
  return gulp
    .src([`${dir.source}/styles/**/*.css`, `!${dir.source}/styles/**/*.min.css`], { sourcemaps: mode.dev })
    .pipe(postcss([autoprefixer({ cascade: true })]))
    .pipe(gulp.dest(`${dir.build}/styles/`))
    .pipe(postcss([cssnano()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(`${dir.source}/styles/`, { sourcemaps: '.' }))
    .pipe(browsersync.stream());
}

// Tast: handle scripts
function handleScripts() {
  return gulp
    .src([`${dir.source}/scripts/**/*.js`, `!${dir.source}/scripts/**/*.min.js`], { sourcemaps: mode.dev })
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(gulp.dest(`${dir.build}/scripts/`))
    .pipe(terser({ toplevel: true }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(`${dir.source}/scripts/`, { sourcemaps: '.' }))
    .pipe(browsersync.stream());
}

// Task: collect files
function collectFiles() {
  return gulp
    .src(
      [
        `${dir.source}/**/*.html`,
        `${dir.source}/libs/**/*.*`,
        `${dir.source}/fonts/**/*.*`,
        `${dir.source}/images/**/*.*`,
        `${dir.source}/styles/**/*.min.css`,
        `${dir.source}/scripts/**/*.min.js`,
        `${dir.source}/{site.webmanifest,favicon.ico}`,
        `${dir.source}/{favicon*,android*,apple*}.png`,
      ],
      {
        base: `${dir.source}`,
      },
    )
    .pipe(gulp.dest(`${dir.build}/`));
}

// Task: collect archive
function collectAchive() {
  return gulp
    .src(`${dir.build}/**/*`)
    .pipe(gzip(`${dir.root}.zip`))
    .pipe(gulp.dest('.'));
}

// Task: run server
function runServer() {
  browsersync.init({
    ui: false,
    port: 1234,
    open: true,
    online: true,
    notify: false,
    server: {
      baseDir: `${dir.source}`,
    },
  });
}

// Task: run watcher
function runWathcer() {
  gulp.watch([`${dir.source}/styles/**/*.css`, `!${dir.source}/styles/**/*.min.css`], gulp.series(handleStyles));
  gulp.watch([`${dir.source}/scripts/**/*.js`, `!${dir.source}/scripts/**/*.min.js`], gulp.series(handleScripts));
  gulp
    .watch([
      `${dir.source}/**/*.html`,
      `${dir.source}/fonts/**/*`,
      `${dir.source}/images/**/*`,
      `${dir.source}/{site.webmanifest,favicon.ico}`,
      `${dir.source}/{favicon*,android*,apple*}.png`,
    ])
    .on('all', browsersync.reload);
}

// Tasks: clean
const cleanBuild = async () => await deleteAsync([`${dir.build}`]);
const cleanArchive = async () => await deleteAsync([`${dir.root}.zip`]);

// Gulp scripts
export const clean = gulp.series(cleanBuild, cleanArchive);
export const build = gulp.series(cleanBuild, cleanArchive, handleStyles, handleScripts, collectFiles);
export const archive = gulp.series(cleanBuild, cleanArchive, handleStyles, handleScripts, collectFiles, collectAchive);

// Gulp default script
export default gulp.series(gulp.parallel(handleStyles, handleScripts), gulp.parallel(runServer, runWathcer));
