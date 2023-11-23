export const astroTemplate = (componentName) =>
  `---
import './${componentName}.scss'

interface Props {

}

const { } = Astro.props
---

`

export const scssTemplate = () =>
  `@import '@styles/global/variables.scss';
@import '@styles/global/mixins.scss';
`
