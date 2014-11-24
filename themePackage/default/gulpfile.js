var gulp   = require('gulp'),
    sass   = require('gulp-sass'),
    rimraf = require('gulp-rimraf')
    concat = require('gulp-concat');

// SCSS
gulp.task('scss', function() {
    gulp.src('scss/styles.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});

// Bootstrap JavaScript
gulp.task('js', function() {
    return gulp.src([
            "bootstrap/assets/javascript/bootstrap/modal.js"
        ])
        .pipe(concat('bootstrap.min.js'))
        .pipe(gulp.dest('./js'));
});

// Clean
gulp.task('clean', function() {
    gulp.src([
        './css',
        './js'
    ],{read: false})
    .pipe(rimraf({
        force: true
    }));
});

gulp.task('default', ['clean', 'scss', 'js']);