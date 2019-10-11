//若想使用gulp提供的功能,首先要将gulp引入到当前文件中
const a_gulp = require('gulp')
 const del = require('del')
 const sprite = require('gulp.spritesmith')

//gulp是一个基于task(任务)的构建工具,我们需要在执行构建步骤时,先创建任务
//a_gulp.task('任务名称',回调函数)

// async function testTask() {
//     console.log('测试环境配置是否成功')
// }
// a_gulp.task('test',testTask)
async function copyIndex(){
    a_gulp.src('./src/index.html')//当前路径
    .pipe(a_gulp.dest('./dist'))//连接管道到文件夹dist
} 
a_gulp.task('copy-index',copyIndex)//任务处理

async function copyHtml() {
    a_gulp.src('./src/html/*.html')
            .pipe(a_gulp.dest('./dist/html') )
}
a_gulp.task('copy-html',copyHtml)

async function copyImg() {
    a_gulp.src('./src/assets/img/**/*.{jpg,gif,png}')//** 意思是img下的所有路径结构整体操作
            .pipe(a_gulp.dest('./dist/assets/img'))

}
a_gulp.task('copy-img',copyImg)

async function copyLib() {
    a_gulp.src('./src/lib/**/*.*')
            .pipe(a_gulp.dest('./dist/lib'))
}
a_gulp.task('copy-lib',copyLib)

// a_gulp.parallel()//返回一个新函数,该新函数会并行的执行被合并的任务
var copyAll = a_gulp.parallel(copyIndex,copyHtml,copyImg,copyLib)
a_gulp.task('copy',copyAll)

//编译sass这件事,gulp自己是无法实现的,需要依赖插件
//gulp-sass gulp-sass要使用nade-sass来编译scss文件
//使用插件的步骤
//1.安装插件 [npm Install 插件名]
//2.将插件引入到gulpfile.js中
var sass = require('gulp-sass');

async function  sassTask() {
    a_gulp.src('./src/style/**/*.scss')
    .pipe(sass({
        outputStyle:"compressed"
    }))
    .pipe(a_gulp.dest('./dist/css/'))
}
    a_gulp.task('sass',sassTask)
//3.使用引入后的插件
const babel = require('gulp-babel')//es6转es5需下载下面这个插件
//npm install gulp-babel @babel/core @babel/preset-env//安装插件
const concat = require('gulp-concat')//整合
 const uglify = require('gulp-uglify')//压成一行
async function homeJS(){
    //将home下的所有js文件进行合并,之后再babel编译
    //合并需要使用插件gulp-concat
    a_gulp.src('./src/js/home/**/*.js')
        .pipe(concat("home.js"))//整合到取的文件名
        .pipe(babel({
            presets:['@babel/env']
            
        }))
        //编译到ES5后要进行压缩
        //借助插件gulp-uglify
          .pipe(uglify())
        .pipe(a_gulp.dest('./dist/js/home'))
}
a_gulp.task('js-home',homeJS)



async function spriteCreate() {
    a_gulp.src('./src/assets/icons/**/*.png')
    .pipe(sprite({
         imgName:"精灵图.png",
         cssName:"精灵图.css"
    }))
    .pipe(a_gulp.dest('./dist/assets/icons'))
}
a_gulp.task('sprite',spriteCreate)



var dist = a_gulp.parallel(homeJS,sassTask,copyAll)
a_gulp.task('dist',dist)

/*function clean() {
    return del(['dist'])
}
var dist = a_gulp.series(clean)
a_gulp.task('dist',dist)*/  //删除，清理
function watch(){
    a_gulp.watch('./src/index.html',copyIndex)
    a_gulp.watch('./src/assets/img/**/*.{jpg,png,gif,jpeg',copyImg)
    a_gulp.watch('./src/html/*.html',copyHtml)
    a_gulp.watch('./src/lib/**/*.*',copyLib)
    a_gulp.watch('./src/style/**/*.scss',sassTask)
    a_gulp.watch('./src/js/home/**/*.js',homeJS)
}
a_gulp.task('watch',watch)
//get三个区域  工作区 暂存区 版本区