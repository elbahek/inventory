'use strict';

var _ = require('lodash'),
  path = require('path'),
  fs = require('fs'),
  stream = require('stream'),
  gulp = require('gulp'),
  browserSync = require('browser-sync'),
  developServer = require('gulp-develop-server'),
  jshint = require('gulp-jshint'),
  jshintStylish = require('jshint-stylish'),
  jscs = require('gulp-jscs'),
  cache = require('gulp-cached'),
  del = require('del'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  gulpif = require('gulp-if'),
  inject = require('gulp-inject'),
  minify = require('gulp-minify-css'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  gutil = require('gulp-util'),
  ngConstant = require('gulp-ng-constant'),
  advancedWatch = require('gulp-watch');

var config = require('./config')('server');

function transformPaths(filePath) {
  var extension = path.extname(filePath).replace('.', '').toLowerCase();
  var fileName = path.basename(filePath);
  if (['js', 'css'].indexOf(extension) !== -1) {
    filePath = '/' + extension + '/' + fileName;
  }
  if (extension === 'js') {
    filePath = '<script type="text/javascript" src="' + filePath + '"></script>';
  }
  else if (extension === 'css') {
    filePath = '<link rel="stylesheet" href="' + filePath + '">';
  }

  return filePath;
}

// browser sync server
gulp.task('browserSync', function() {
  browserSync.init({
    host: config.ip,
    proxy: 'https://' + config.ip + ':' + config.port,
    notify: false,
    open: false
  });
});

// start development server
gulp.task('developServerStart', function() {
  developServer.listen({
    path: config.serverDir + '/index.js'
  });
});

// copy fonts to dist
gulp.task('copyFonts', function() {
  var fonts = [].concat(
    config.assets.fonts.thirdParty,
    config.assets.fonts.app
  );

  return gulp.src(fonts)
    .pipe(gulp.dest(config.distDir + '/fonts'));
});

// copy misc static files to dist
gulp.task('copyMisc', function() {
  return gulp.src(config.siteDir + '/public/**/*', {base: config.siteDir + '/public'})
    .pipe(gulp.dest(config.distDir));
});

// generate angular app config from server config
gulp.task('generateAppConfig', function() {
  var appConfig = require('./config')('app');
  appConfig = JSON.stringify(appConfig);

  var appConfigSrc = stream.Readable({objectMode: true});
  appConfigSrc._read = function() {
    this.push(new gutil.File({cwd: '', base: '', path: './inventory.config.js', contents: new Buffer(appConfig)}));
    this.push(null);
  };

  return appConfigSrc
    .pipe(ngConstant({
      name: 'InventoryModule',
      deps: false
    }))
    .pipe(gulp.dest(config.buildDir));
});

var jshintedFiles = [
  'gulpfile.js',
  config.serverDir + '/**/*.js',
  config.configDir + '/**/*.js',
  config.appDir + '/**/*.js'
];
jshintedFiles.concat(config.assets.scripts.app);
// check all js files with jshint
gulp.task('jshint', function() {
  return gulp.src(jshintedFiles)
    .pipe(jshint())
    .pipe(jshint.reporter(jshintStylish));
});

// check all js files with jscs
gulp.task('jscs', function() {
  return gulp.src(jshintedFiles)
    .pipe(jscs());
});

// copy views to public dir
gulp.task('copyAppViews', function() {
  return gulp.src(config.inventoryModuleDir + '/views/**/*.html', {base: config.inventoryModuleDir + '/views'})
    .pipe(cache('appViews'))
    .pipe(gulp.dest(config.distDir + '/views'));
});

// copy third-party scripts to public dir
gulp.task('copyThirdPartyScripts', function() {
  return gulp.src(config.assets.scripts.thirdParty)
    .pipe(gulpif(config.environment === 'production', uglify()))
    .pipe(gulpif(config.environment === 'production', concat('third-party.min.js')))
    .pipe(gulp.dest(config.distDir + '/js'));
});

// copy app scripts to public dir
gulp.task('copyAppScripts', ['generateAppConfig'], function() {
  return gulp.src(config.assets.scripts.app)
    .pipe(cache('appScripts'))
    .pipe(gulpif(config.environment === 'production', uglify()))
    .pipe(gulpif(config.environment === 'production', concat('app.min.js')))
    .pipe(gulp.dest(config.distDir + '/js'));
});

// copy third party styles to public dir
gulp.task('copyThirdPartyStyles', function() {
  return gulp.src(config.assets.styles.thirdParty)
    .pipe(gulpif(config.environment === 'production', minify()))
    .pipe(gulpif(config.environment === 'production', concat('third-party.min.css')))
    .pipe(gulp.dest(config.distDir + '/css'));
});

// compile sass and copy to public dir
gulp.task('copyAppStyles', function() {
  return gulp.src(config.assets.styles.app)
    .pipe(gulpif(config.environment === 'development', sourcemaps.init()))
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulpif(config.environment === 'production', minify()))
    .pipe(gulpif(config.environment === 'production', concat('app.min.css')))
    .pipe(gulpif(config.environment === 'development', sourcemaps.write()))
    .pipe(gulp.dest(config.distDir + '/css'))
    .pipe(gulpif(config.environment === 'development', browserSync.stream()));
});

//
gulp.task('inject', [
  'copyThirdPartyScripts',
  'copyAppScripts',
  'copyThirdPartyStyles',
  'copyAppStyles'
], function() {
  var files = null;
  if (config.environment === 'development') {
    var appStylesCompiled = [];
    _.forOwn(config.assets.styles.app, function(asset) {
      var newFile = path.basename(asset).replace('.scss', '.css');
      appStylesCompiled.push(config.distDir + '/css/' + newFile);
    });
    files = [].concat(
      config.assets.styles.thirdParty,
      appStylesCompiled,
      config.assets.scripts.thirdParty,
      config.assets.scripts.app
    );
  }
  else if (config.environment === 'production') {
    files = [
      config.distDir + '/js/third-party.min.js',
      config.distDir + '/js/app.min.js',
      config.distDir + '/css/third-party.min.css',
      config.distDir + '/css/app.min.css'
    ];
  }
  var sources = gulp.src(files, {read: false});

  return gulp.src(config.appDir + '/index.html')
    .pipe(inject(sources, {transform: transformPaths}))
    .pipe(gulp.dest(config.distDir));
});

// ensure browser reload after injecting js/css
gulp.task('browserReloadAfterInject', ['inject'], browserSync.reload);

// ensure browser reload on views change
gulp.task('browserReloadOnAppViews', ['copyAppViews'], browserSync.reload);

// ensure browser reload on app scripts change
gulp.task('browserReloadOnAppScripts', ['copyAppScripts'], browserSync.reload);


// restart server on source change
// check js files with jshint, jscs on source change
gulp.task('watch', function() {
  gulp.watch(config.serverDir + '/**.js', developServer.restart);
  gulp.watch(jshintedFiles, ['jshint', 'jscs']);
  gulp.watch(config.appDir + '/index.html', ['browserReloadAfterInject']);
  advancedWatch(config.inventoryModuleDir + '/views/**/*.html', {usePolling: true}, function() {
    gulp.start('browserReloadOnAppViews');
  });
  advancedWatch(config.inventoryModuleDir + '/**/*.js', {usePolling: true}, function() {
    gulp.start('browserReloadOnAppScripts');
  });
  advancedWatch(config.inventoryModuleDir + '/assets/**/*.scss', {usePolling: true}, function() {
    gulp.start('copyAppStyles');
  });
  advancedWatch(config.publicDir + '/**/*.*', {usePolling: true}, function() {
    gulp.start('copyMisc');
  });
});

// clean task (run to clean public dirs, build dirs etc)
gulp.task('clean', function() {
  del.sync([
    config.siteDir + '/logs/*',
    config.distDir + '/*',
    config.buildDir + '/*'
  ]);
});

// check ssl cert files, config/local.js
gulp.task('checkFiles', function() {
  fs.stat(config.sslKeyFile, function(error) {
    if (error) {
      console.log('SSL key cannot be read', error);
    }
  });
  fs.stat(config.sslCertFile, function(error) {
    if (error) {
      console.log('SSL certificate cannot be read', error);
    }
  });
  fs.stat(config.configDir + '/local.js', function(error) {
    if (error) {
      console.log('config/local.js cannot be read, probably you forgot to add it', error);
    }
  });
});


gulp.task('serve', [
  'developServerStart', // synchronous
  'browserSync', // synchronous
  'jshint',
  'jscs',
  'copyFonts',
  'copyMisc',
  'copyAppViews',
  'inject',
  'watch'
]);

gulp.task('deployStage', [
  'clean', // synchronous
  'checkFiles',
  'copyFonts',
  'copyMisc',
  'copyAppViews',
  'inject'
]);


gulp.task('default', ['serve']);
