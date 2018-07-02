var gulp = require('gulp');
var pug = require('gulp-pug');
var stylus = require('gulp-stylus');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

var concat = require('gulp-concat');
var del = require('del');

var browserSync = require('browser-sync');
var server = browserSync.create();

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './build'
    }
  });
  done();
}

var pugFiles = [
    'src/**/*.pug',
    '!src/assets/lib/**/*.pug'
];
var stylFiles = 'src/**/*.styl';


var jsFiles = [
	'src/assets/**/*.js',
    '!src/assets/lib/**/*.js',
	'src/blocks/**/*.js'
];

var imgFiles = [
	'src/assets/**/*.{jpg,png,jpeg,svg,gif}',
];

gulp.task('pug', function() {
	return gulp.src(pugFiles)
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('build/'))
});

gulp.task('stylus', function() {
    var postCSSplugins = [
        autoprefixer({browsers: ['last 10 versions']}),
    ];
	return gulp.src(stylFiles)
		.pipe(stylus())
		.pipe(postcss(postCSSplugins))
    	.pipe(concat('assets/app.css'))
		.pipe(gulp.dest('build/'))
		.pipe(server.stream())
});

gulp.task('js', function () {
  return gulp.src(jsFiles)
    .pipe(concat('assets/app.js'))
    .pipe(gulp.dest('build'))
});

gulp.task('js_one_page', function () {
  return gulp.src('src/assets/lib/onepage-scroll-master/**/*.js')
    .pipe(concat('assets/onepage-scroll-master.js'))
    .pipe(gulp.dest('build'))
});

gulp.task('img', function () {
  return gulp.src(imgFiles)
    .pipe(gulp.dest('build/assets'))
});

gulp.task('watch', function(){
	gulp.watch('src/**/*.pug', gulp.series('pug', reload));
	gulp.watch('src/**/*.styl', gulp.series('stylus'));
	gulp.watch('src/**/*.js', gulp.series('js', 'js_one_page', reload));
	gulp.watch(imgFiles, gulp.series('img', reload));
});

gulp.task('clean', function(){
	return del('./build');	
});

gulp.task('build', gulp.parallel('pug', 'stylus', 'js','js_one_page', 'img'));

gulp.task('serve', gulp.parallel('watch', serve));

gulp.task('default', gulp.series('clean','build', 'serve'));