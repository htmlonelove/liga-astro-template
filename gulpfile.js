import gulp from 'gulp'
import webp from 'gulp-webp'

const createWebp = () => {
  const root = ''
  return gulp
      .src('public/**/*.{png,jpg}')
      .pipe(webp({ quality: 90 }))
      .pipe(gulp.dest(`public/${root}`))
}

const webpWatcher = () => gulp.watch('public/images/*.{png, jpg}', createWebp)

export { createWebp }
