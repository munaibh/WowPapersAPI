// Import Dependencies.
var gulp  = require('gulp'),
    clean = require('gulp-clean'),
    babel = require('gulp-babel'),
    nodemon = require('gulp-nodemon')

// Clean Build Folder.
gulp.task('clean', () => {
  return gulp.src('./build/**')
    .pipe(clean({force: true}))
})

// Transpile ES6 Javascript.
gulp.task('babel', () => {
  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['es2015', 'stage-2']
    }))
    .pipe(gulp.dest('build/'))
})

// Boot up Server.
gulp.task('nodemon', () => {
  nodemon({
    script: 'build/app.js',
    ext: 'js',
    watch: 'src',
    tasks: ['babel'],
    env: { 'NODE_ENV': 'dev' }
  })
})

// Run all tasks on 'gulp'.
gulp.task('default', ['babel', 'nodemon'])
