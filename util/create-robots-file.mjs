import fs from 'fs'

const OUTPUT_FOLDER = 'dist'

new Promise(() => {
  fs.writeFileSync(
    `${OUTPUT_FOLDER}/robots.txt`,
    'User-agent: *\nDisallow: /'
  )
})
