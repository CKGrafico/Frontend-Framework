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
	build: './build',
	css: './css',
	cssBuild: './build/css',
	fonts: './fonts',
	fontsBuild: './build/fonts',
	imagesBuild: './build/images',
	js: './js',
	jsBuild: './build/js',
	lib: './js/vendor'
};

// Compile Sass
gulp.task('sass', function(){
	return gulp.src(files.scss)
		.pipe(plugins.sass())
		.pipe(gulp.dest(paths.css));
});

// Handlebars templates
gulp.task('handlebars', function(){
	return gulp.src([files.templates])
		.pipe(plugins.handlebars())
		.pipe(plugins.declare({
			namespace: 'Handlebars.templates'
		}))
		.pipe(plugins.concat('templates.js'))
		.pipe(gulp.dest(paths.js));
});

// Inject JS & CSS Files
gulp.task('inject', function() {
	return gulp.src([files.js, files.css], {read: false})
		.pipe(plugins.inject(files.index))
		.pipe(gulp.dest('./'));
});

// Minify css
// Deprecated: usemin do it
gulp.task('css', function(){
	return gulp.src(files.css)
		.pipe(plugins.minifyCss())
		.pipe(gulp.dest(paths.cssBuild));
});

// Clean build path
gulp.task('cleanBuild', function() {
	return gulp.src(paths.build, {read: false})
		.pipe(plugins.clean())
		.pipe(gulp.dest('./'))
		.on('end', function(){
			console.log(plugins)
			plugins.runSequence(['default', 'fonts', 'images', 'humans', 'usemin']);
		});
});

// create fonts
gulp.task('fonts', function(){
	/*
	 *TODO: Fix it
	 */
	/*
	gulp.src(files.fontsSVG)
		.pipe(plugins.svg2ttf())
		.pipe(gulp.dest(paths.fonts));

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
	*/

});

// improve images
gulp.task('images', function() {
	return gulp.src(files.images)
		.pipe(plugins.imagemin())
		.pipe(gulp.dest(paths.imagesBuild));
});

// Build html
gulp.task('usemin', function() {
	return gulp.src(files.index)
		.pipe(plugins.usemin(
			{
				css: [plugins.minifyCss()],
				html: [plugins.minifyHtml({empty: true})],
				js: [plugins.uglify(), plugins.rev()]
			}
		))
		.pipe(gulp.dest(paths.build));
});

// build humans.txt
gulp.task('humans', function() {
	return gulp.src('./humans.md')
		.pipe(plugins.rename('humans.txt'))
		.pipe(gulp.dest(paths.build));
});

// Initialize project
gulp.task('initialize', function() {
	return plugins.bowerFiles()
		.pipe(gulp.dest(paths.lib));
});

// Init watch
gulp.task('watch', function () {
	gulp.watch(files.js, ['inject']);
	gulp.watch(files.scss, ['sass', 'inject']);
	gulp.watch(files.templates, ['handlebars']);
});

gulp.task('default', ['sass', 'handlebars', 'inject']);
gulp.task('build', ['cleanBuild']);