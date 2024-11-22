export const astroTemplate = (componentName) => ({
  content: `---
interface Props {
  className?: string
}

const { className } = Astro.props
---

<div class:list={['${componentName.toLowerCase()}', className]}></div>
`,
  filename: `${componentName}.astro`
})

export const scssTemplate = (componentName) => ({
  content: `
@use "@styles/global/variables";
@use "@styles/global/mixins";
@use "@styles/global/functions";

.${componentName.toLowerCase()} {}
`,
  filename: `${componentName}.scss`
})
