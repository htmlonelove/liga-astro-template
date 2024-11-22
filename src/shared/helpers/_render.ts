type InsertPosition =
  | 'beforebegin'
  | 'afterbegin'
  | 'beforeend'
  | 'afterend'
  | 'prepend'
  | 'append'

export const createElement = (template: string): HTMLElement => {
  const newElement = document.createElement('div')

  newElement.innerHTML = template

  return newElement.firstChild as HTMLElement
}

export const renderElement = (
  container: HTMLElement,
  component: HTMLElement,
  place: InsertPosition = 'beforeend'
): void => {
  switch (place) {
    case 'prepend':
      container.prepend(component)
      break
    case 'afterend':
      container.after(component)
      break
    case 'beforeend':
      container.append(component)
      break
  }
}
