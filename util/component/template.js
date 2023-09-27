export const astroTemplate = (componentName) =>
  `---
import './${componentName}.scss'
import Container from '@components/Container'

interface Props {

}

const { } = Astro.props
---

`

export const scssTemplate = () =>
  `@import '@styles/mixins.scss';
@import '@styles/variables.scss';
`
