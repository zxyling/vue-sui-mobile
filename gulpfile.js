var gulp = require('gulp'),
    minify = require('gulp-uglify'),                 //js压缩
    minifyCss = require('gulp-minify-css'),          //css压缩
    clean = require('gulp-clean'),                   //清空文件夹
    autoprefixer = require('gulp-autoprefixer'),     //css代码前缀自动补全
    connect = require('gulp-connect'),               //web服务器
    imagecache = require('gulp-cache'),              //图片缓存
    imagemin = require('gulp-imagemin'),             //图片压缩
    pngquant = require('imagemin-pngquant'),         //png图片深入压缩
    jshint = require('gulp-jshint'),                 //js语法检查
    livereload = require('gulp-livereload'),         //实时监控页面变化         
    run = require('gulp-run-sequence'),              //gulp任务执行顺序外挂
    concat = require('gulp-concat');                //文件合并   
/*
 * 线上环境 - html
 * @param 压缩合并至新目录
 * */
gulp.task('copyhtml',function(){
   return gulp.src('pages/**/*.html')
   .pipe(gulp.dest('dist/pages'))
   .pipe(connect.reload());
});

/*
 * 线上环境 - js
 * @param 压缩合并至新目录
 * */

gulp.task('minfy',function(){
    return gulp.src('pages/**/*.js')
    .pipe(jshint())
    .pipe(minify())
    .pipe(gulp.dest('dist/pages'))
    .pipe(connect.reload());
});
/*
 * 线上环境 - css
 * @param 压缩pages目录下的所有css文件
 * */
gulp.task('pagesCss',function(){
    return gulp.src('pages/**/*.css')
   .pipe(gulp.dest('dist/pages'))
   .pipe(connect.reload())
   .pipe(connect.reload());
})

/*
 * 线上环境 - image
 * @param 压缩图片
 * */
gulp.task('images',function(){
    return gulp.src('images/**/*.{jpg,png,gif}')
    .pipe(imagecache(imagemin({             //只压缩修改的图片
        optimizationLevel: 7,               //类型：Number  默认：3  取值范围：0-7（优化等级）
        progressive: true,                  //类型：Boolean 默认：false 无损压缩jpg图片
        interlaced: true,                   //类型：Boolean 默认：false 隔行扫描gif进行渲染
        multipass: true,                    //类型：Boolean 默认：false 多次优化svg直到完全优化
        use: [pngquant()]                   //使用pngquant深度压缩png图片的imagemin插件
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe(connect.reload());
})

/*
 * 线上环境 - css
 * @param 压缩vendor目录下的所有css文件
 * */
gulp.task('vendorCss',function(){
    return gulp.src('vendor/**/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/vendor'))
})

/*
 * 线上环境 - js
 * @param 压缩vendor目录下的所有js文件
 * */

gulp.task('vendorJs',function(){
    return gulp.src('vendor/**/*.js')
    .pipe(minify())
    .pipe(gulp.dest('dist/vendor'))
})


//清空文件夹
gulp.task('clean',function(){
    return gulp.src('dist')
    .pipe(clean())
})
//监视文件变化，并执行任务
gulp.task('watch',function(){
    gulp.watch('pages/**/*.html',['copyhtml']);
    gulp.watch('images/**/*.{jpg,png,gif,ico}',['images']);
    gulp.watch('pages/**/*.css',['pagesCss']);
    gulp.watch('pages/**/*.js',['minfy']);
})


//启动本地服务器
gulp.task('server',function(){
    connect.server({
        root:'dist',             //根目录
        livereload:true
    })
})
gulp.task('default',['server','watch'],function(){
    console.log("本地服务已启动")
});

//一键创建本地目录
gulp.task('build',function(){
    run('clean',['copyhtml','pagesCss','minfy','images','vendorJs'],function(){
        setTimeout(function () {
            console.log('\n 线上项目任务已经全部运行完毕 O(∩_∩)O~~');
        }, 100);
    })
});