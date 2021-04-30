/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-cssnano gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */

// Load plugins
var gulp = require('gulp'), //基础库
	less = require('gulp-less'), //less解析
	//autoprefixer = require('gulp-autoprefixer'),
	babel = require('gulp-babel'),
	cssnano = require('gulp-cssnano'), //css压缩
	jshint = require('gulp-jshint'), //js检查
	uglify = require('gulp-uglify'), //js压缩
	imagemin = require('gulp-imagemin'), //图片压缩
	rename = require('gulp-rename'), //文件重命名
	concat = require('gulp-concat'), //文件合并
	notify = require('gulp-notify'), //
	plumber = require('gulp-plumber'), //处理所有错误的通用方法
	//cache = require('gulp-cache'),
	//md5 = require('gulp-md5-plus'),
	//gzip = require('gulp-gzip'),
	livereload = require('gulp-livereload'), //实时检测文件改动
	del = require('del'); //
revCollector = require('gulp-rev-collector'),
	minifyHTML   = require('gulp-minify-html'),
	runSequence = require('run-sequence');
//var watchify = require('watchify');
var browserify = require("browserify");
var sourcemaps = require("gulp-sourcemaps");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var glob = require('node-glob');
//var globby = require('globby'); // 匹配文件
//var factor = require('factor-bundle');
//var fs = require('fs');
//var merge = require('merge-stream');
var templateCache = require("gulp-angular-templatecache");
var spritesmith = require('gulp.spritesmith');
var autoprefixer = require('gulp-autoprefixer');
/**
 * Used to concatenate all HTML templates into a single JavaScript module.
 */

gulp.task("templates", function() {
	return gulp.src('templates/**/*.html')
		.pipe(templateCache({'module':'myApp'}))
		//.pipe(templateCache())
		.pipe(gulp.dest("dist/js/templates"));
});

var htmlreplace = require('gulp-html-replace');
gulp.task('maocMin', function() {
	gulp.src(['maoc.html'])
		.pipe(htmlreplace({
			'minJS': 'dist/js/maoc.min.js'
		}))
		.pipe(gulp.dest('build/'));
});

gulp.task('copyIndexHtml', function () {
	gulp.src('index.html')
		.pipe(gulp.dest('build'))
});
/*
*压缩发布版本
*/
var RevAll = require('gulp-rev-all');
var versionInfo = require('./me.json');

gulp.task('copyRelease',['js','maocMin'],function() {
	// var revAll = new RevAll({dontRenameFile:[/^\/.*.html/,/^\/.*.json/,/^\/.*.log/]});
    var revAll = new RevAll({dontRenameFile:[/^\/.*.html/,/^\/.*.json/,/^\/.*.log/,'pdf.min.js','pdf.worker.min.js','wysiwyg.min.js']});
	return gulp.src(['**/*.*','!**/build/**/**','!**/node_modules/**/*.*','!**/templates/**/*.*','!**/src/**/*.*','!**/cache/**/*.*','!*.js','!**/releases/**/*.*','!**/debug/**/*.*','!**/dist/templates/**/*','!**/dist/js-jenkins/**/*','!**/dist/css-jenkins/**/*','!**/dist/js/maoc.js','!**/dist/js/maoc.min.js.map','!*.html','!package.json'])
		.pipe(revAll.revision())
		.pipe(gulp.dest('build'))
		.pipe(revAll.versionFile())
		.pipe(gulp.dest('build'))
		.pipe(revAll.manifestFile())
		.pipe(gulp.dest('build'));
});

gulp.task('md5',function(){

	return gulp.src('build/**/*.*')
		.pipe(revAll.revision())
		.pipe(gulp.dest('build'))
		.pipe(revAll.versionFile())
		.pipe(gulp.dest('build'))
		.pipe(revAll.manifestFile())
		.pipe(gulp.dest('build'));
});
//替换文件为md5的文件/更新引入文件版本
var revReplace = require('gulp-rev-replace');
gulp.task('revJs', function () {
	return gulp.src(['build/maoc.html'])
		.pipe(revReplace({manifest: gulp.src("build/rev-manifest.json")}))
		// .pipe( minifyHTML({
		//             empty:true,
		//             spare:true
		//  }) )
		.pipe(gulp.dest('build'));
});

gulp.task('revCss', function () {
	return gulp.src(['build/dist/css/*.css'])
		.pipe(revReplace({manifest: gulp.src("build/rev-manifest.json")}))
		// .pipe( minifyHTML({
		//             empty:true,
		//             spare:true
		//  }) )
		.pipe(gulp.dest('build/dist/css/'));
});

var zip = require('gulp-zip');
gulp.task('zipSource',function(){
	return gulp.src(['build/**/*.*','!build/debug.log','!build/rev-manifest.json'])
		.pipe(zip('me.zip'))
		.pipe(gulp.dest('releases/'+versionInfo.maocHtmlVersion));
});

gulp.task('copyBuild',function(){
	return gulp.src(['build/**/*.*','!build/debug.log','!build/rev-manifest.json'])
		.pipe(gulp.dest('/Users/lsd/Desktop/casey/MEtdms/me'));
});

gulp.task('release', function (done) {
	runSequence(
		['cleanBuild'],
		['img', 'copyAngularUiCss', 'copyFont'],
		['concatcss'],
		['copyRelease'],
		['revJs','revCss'],
		['copyBuild', 'zipSource'],
		done);
});

gulp.task('debug',['browserify'],function(){
	return gulp.src(['**/*.*','!**/build/**/*.*','!**/node_modules/**/*.*','!**/templates/**/*.*','!**/src/**/*.*','!**/cache/**/*.*','!*.js','!**/releases/**/*.*','!**/debug/**/*.*','!**/dist/templates/**/*','!**/dist/js-jenkins/**/*','!**/dist/css-jenkins/**/*','!**/dist/js/maoc.min.js','!**/dist/js/maoc.min.js.map','!index.html','!me.json','!package.json'])
		.pipe(zip('maoc.zip'))
		.pipe(gulp.dest('debug'));
});

// 编译less
// 在命令行输入 gulp less 启动此任务
gulp.task('less', function() {
	// 1. 找到 less 文件
	return gulp.src('src/less/maoc.less')

		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		// 2. 编译为css
		.pipe(less())
		// 3. 另存文件
		.pipe(gulp.dest('src/css'))
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(cssnano())
		.pipe(gulp.dest('dist/css'));
});

//压缩css
gulp.task('css', function() {
	// 1. 找到 less 文件
	gulp.src('src/css/**.css')

		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(cssnano())
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest('dist/css'))
});

gulp.task('sprite', function () {
	var spriteData = gulp.src(['src/images/icon/*', 'src/images/icon-mobile/*']).pipe(spritesmith({
		retinaSrcFilter: ['src/images/icon/*@2x.png', 'src/images/icon-mobile/*@2x.png'],
		imgName: 'sprite.png',
		retinaImgName: 'sprite@2x.png',
		cssName: 'sprite.css',
		padding: 10,
		algorithm: 'binary-tree'
	}));
	return spriteData.pipe(gulp.dest('src/css'));
});

gulp.task("copyFont", ['less'], function(){
	gulp.src(["src/fonts/*"])
		.pipe(gulp.dest('dist/fonts'))
});

gulp.task("copyAngularUiCss", ['less'], function(){
	gulp.src(["src/css/mobile-angular-ui-base.min.css","src/css/font-awesome.min.css","src/css/normalize.css","src/css/wysiwyg.css"])
		.pipe(gulp.dest('dist/css'))
});
//合并css
gulp.task("concatcss", ['less'], function(){
	gulp.src(["src/css/maoc.css", 'src/css/sprite.css'])
		.pipe(concat("maoc.css"))
		.pipe(autoprefixer({
			browsers: ['iOS >= 8', 'Android >= 4.0'],
			cascade: true, //是否美化属性值 默认：true 像这样：
			//-webkit-transform: rotate(45deg);
			//        transform: rotate(45deg);
			remove:true //是否去掉不必要的前缀 默认：true
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(cssnano())
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest('dist/css'))
		.pipe(livereload())
});

// Images图片copy到dist文件夹
gulp.task('img',['sprite'], function() {
	return gulp.src(['src/images/*','src/images/*/*', 'src/css/*.png', '!src/images/{icon, icon/*}'])
	//.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
	/*optimizationLevel: 5, //类型：Number 默认：3 取值范围：0-7（优化等级）
     progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
     interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
     multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化*/
	// .pipe(imagemin({
	// 	optimizationLevel: 5,
	// 	progressive: false,
	// 	interlaced: true
	// }))
		.pipe(gulp.dest('dist/images/'));
	//.pipe(notify({ message: 'Images task complete' }));
});

//开发环境
gulp.task('browserify',['templates','copyGlobalTransfer','copyIndexHtml'], function() {
	return browserify({
		entries: 'src/js/index.js',
		debug: true
	})
		.bundle()
		.on('error', function (err) {
			console.log(err.toString());
			this.emit("end");
		})
		//Pass desired output filename to vinyl-source-stream
		.pipe(source('maoc.js'))
		.pipe(buffer())
		.pipe(gulp.dest('dist/js')) //生成未压缩文件
});

gulp.task('productcss', function() {
	// 1. 找到 less 文件
	gulp.src('dist/css/**.css')
		.pipe(gulp.dest('dist/css-jenkins'))
});
//测试与生产环境
gulp.task('productbs',['productcss'], function() {
	return browserify({
		entries: 'src/js/index.js'
	})
		.bundle()
		.pipe(source('maoc.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'  //copy重命名文件
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist/js-jenkins'));
});
// Scripts
gulp.task('copyGlobalTransfer', function() {
	return gulp.src(['src/js/global-transfer.js','src/js/Umeng.js','src/js/intro.js','src/js/appOpenApi/appOpenApi.js','src/js/lib/pdf.js','src/js/lib/pdf.worker.js','src/js/lib/wysiwyg.js'])

		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))
		.pipe(gulp.dest('dist/js-jenkins'))
	//.pipe(notify({ message: 'Scripts task complete' }));
});
// Scripts
gulp.task('js',['browserify'], function() {
	return gulp.src(['dist/js/**/*.js', '!dist/lib/*.js', '!dist/js/*.min.js','!dist/js/templates/*.*'])
	//.pipe(jshint('.jshintrc'))
	//.pipe(jshint.reporter('default'))
	//.pipe(concat('main.js'))
	//.pipe(gulp.dest('dist/js'))
		.pipe(sourcemaps.init({
			loadMaps: true
		}))

		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(uglify())
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest('dist/js'))
	//.pipe(notify({ message: 'Scripts task complete' }));
});

// Clean
gulp.task('clean', function() {
	return del(['dist/js']);
});

gulp.task('cleanBuild',function(){
	return del(['build', '../../../../../me-dev/me','/Users/lsd/Desktop/casey/MEtdms/me/dist/js/maoc.min.*.js'], {force: true});
});

/*// MD5
gulp.task('md5', function (done) {
    gulp.src('dist/css/*.css')
        .pipe(md5(10, 'dist/app/*.html'))
        .pipe(gulp.dest('dist/css'))
        .on('end', done);
});*/

// Default task
gulp.task('default', ['clean'], function() {
	gulp.start('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', function() {

	// Watch .scss files
	gulp.watch('src/less/**.less', ['concatcss']);

	// Watch .js files
	gulp.watch(['src/js/**/*.js', 'templates/**/*.html', '!src/js/**/*.min.js'], ['browserify']);
	// Watch image files
	//gulp.watch('src/images/**/*', ['img']);
	// Create LiveReload server
	livereload.listen();

	// Watch any files in dist/, reload on change
	gulp.watch(['dist/**']).on('change', livereload.changed);

});