var gulp   = require('gulp'),
    sass   = require('gulp-sass'),
    rimraf = require('gulp-rimraf')
    concat = require('gulp-concat');

// SCSS
gulp.task('scss', ['clean'], function() {
    return  gulp.src('scss/styles.scss')
            .pipe(sass())
            .pipe(gulp.dest('./css'));
});

// Bootstrap JavaScript
gulp.task('js', ['clean'], function() {
    return  gulp.src([
                "bootstrap/assets/javascripts/bootstrap/modal.js"
            ])
            .pipe(concat('bootstrap.min.js'))
            .pipe(gulp.dest('./js'));
});

// Moving Bootstrap Fonts
gulp.task('fonts', ['clean'], function () {
    return  gulp.src(
                'bootstrap/assets/fonts/bootstrap/*'
            )
            .pipe(gulp.dest('fonts/bootstrap'));
});

// Clean
gulp.task('clean', function() {
    return  gulp.src([
                './css',
                './js',
                './fonts/bootstrap'
            ],{read: false})
            .pipe(rimraf({
                force: true
            }));
});

gulp.task('default', ['clean', 'scss', 'js', 'fonts']);