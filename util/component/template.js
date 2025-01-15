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
@use "@styles/func";
@use "@styles/variables";
@use "@styles/mixins";

.${componentName.toLowerCase()} {}
`,
  filename: `${componentName}.scss`
})
