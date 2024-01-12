// если не подходит миксин астро и нужно использовать old style way
// 1. используй миксин @ul/Picture/Picture.astro
// 2. Добавь галп в package.json
// package.json
// {
//   ...
//   "scripts": {
//     ...
//     "build": "astro build && gulp optimizeImages",
//     "webp": "gulp createWebp",
//     "optimizeImage": "gulp optimizeImages",
//   },
//   "devDependencies": {
//     ...
//     "gulp": "^4.0.2",
//     "gulp-webp": "4.0.1",
//     "gulp-imagemin": "7.1.0",
//     "imagemin-mozjpeg": "10.0.0",
//     "imagemin-pngquant": "9.0.2",
//     "del": "6.1.1"
//   }
// }

import gulp from 'gulp'
import webp from 'gulp-webp'
import del from 'del'
import imagemin from 'gulp-imagemin'
import pngQuant from 'imagemin-pngquant'
import mozJpeg from 'imagemin-mozjpeg'

const createWebp = () => {
  const root = ''
  return gulp
    .src('public/**/*.{png,jpg}')
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest(`dist/${root}`))
}

const cleanImages = () => del('dist/images/')
const copyImages = () =>
  gulp
    .src('public/images/**/*.{png,jpg,jpeg,webp}', { base: 'public' })
    .pipe(gulp.dest('dist/'))

const optimizeJpg = () =>
  gulp
    .src('public/images/**/*.{jpg,jpeg}', { base: 'public' })
    .pipe(imagemin([mozJpeg({ quality: 55, progressive: true })]))
    .pipe(gulp.dest('dist/'))

const optimizePng = () =>
  gulp
    .src('public/images/**/*.png', { base: 'public' })
    .pipe(
      imagemin([
        pngQuant({
          speed: 1,
          strip: true,
          dithering: 1,
          quality: [0.5, 0.6]
        })
      ])
    )
    .pipe(gulp.dest('dist/'))

const createBuildWebp = () => {
  return gulp
    .src('public/images/**/*.{png,jpg}')
    .pipe(webp({ quality: 50 }))
    .pipe(gulp.dest('dist/images/'))
}

const optimizeImages = gulp.series(
  cleanImages,
  copyImages,
  optimizePng,
  optimizeJpg,
  createBuildWebp
)

export { createWebp, optimizeImages }
