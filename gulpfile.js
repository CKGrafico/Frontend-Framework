var gulp = require('gulp');
var plugins = require("gulp-load-plugins")();

var files = {
	css: './css/*.css',
	fontsTTF: './fonts/*.ttf',
	fontsSVG: './fonts/*.svg',
	images: './images/**/*.*',
	index: './index.html',
	js: './js/**/*.js',
	scss: './scss/*.scss',
	templates: './templates/*.hbs',
};

var paths = {
	build: './build/',
	css: './css',
	cssBuild: './build/css/',
	fontsBuild: './build/fonts/',
	imagesBuild: './build/images/',
	js: './js/',
	jsBuild: './build/js/',
	lib: './js/vendor/'
};

// Compile Sass
gulp.task('sass', function(){
	gulp.src(files.scss)
		.pipe(plugins.sass())
		.pipe(gulp.dest(paths.css));
});

// Handlebars templates
gulp.task('handlebars', function(){
	gulp.src([files.templates])
		.pipe(plugins.handlebars())
		.pipe(plugins.declare({
		namespace: 'Handlebars.templates'
	}))
	.pipe(plugins.concat('templates.js'))
	.pipe(gulp.dest(paths.js));
});

// Inject JS & CSS Files
gulp.task('inject', function() {
	gulp.src([files.js, files.css], {read: false})
		.pipe(plugins.inject(files.index))
		.pipe(gulp.dest('./'));
});

// Minify css
gulp.task('css', function(){
	gulp.src(files.css)
		.pipe(plugins.minifyCss())
		.pipe(gulp.dest(paths.cssBuild));
});

// create fonts
gulp.task('fonts', function(){
	gulp.src(files.fontsTTF)
		.pipe(plugins.ttf2woff())
		.pipe(gulp.dest(paths.fontsBuild));

	gulp.src(files.fontsTTF)
		.pipe(plugins.ttf2eot())
		.pipe(gulp.dest(paths.fontsBuild));

	gulp.src(files.fontsTTF)
		.pipe(gulp.dest(paths.fontsBuild));

	gulp.src(files.fontsSVG)
		.pipe(gulp.dest(paths.fontsBuild));
});

// improve images
gulp.task('images', function() {
	gulp.src(files.images)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.imagesBuild));
});

// Build html

gulp.task('htmlbuild', function(){
	gulp.src(files.index)
		.pipe(plugins.htmlbuild({
			js: function (files, callback) {
				gulp.src(files)
					.pipe(plugins.concat('all.min.js'))
					.pipe(plugins.uglify())
					.pipe(gulp.dest(paths.jsBuild));
				callback(null, [ 'js/all.min.js' ]);
			},

			css: function (files, callback) {
				gulp.src(files)
					.pipe(plugins.concat('styles.css'))
					.pipe(gulp.dest(paths.cssBuild));
				callback(null, [ 'css/styles.css' ]);
			}
		}))
		.pipe(gulp.dest(paths.build));
});

// build humans.txt
gulp.task('humans', function() {
	gulp.src('./humans.md')
    .pipe(rename('humans.txt'))
    .pipe(gulp.dest(paths.build));
});

// Initialize project
gulp.task('initialize', function() {
	plugins.bowerFiles()
		.pipe(gulp.dest(paths.lib));
});

// Init watch
gulp.task('watch', function () {
	gulp.watch(files.js, ['inject']);
	gulp.watch(files.scss, ['sass', 'inject']);
	gulp.watch(files.templates, ['handlebars']);
});

gulp.task('default', ['sass', 'handlebars', 'inject']);
gulp.task('build', ['fonts', 'images', 'css', 'htmlbuild', 'humans']);