type ObserverFn = (_data: unknown) => void

export class EventObserver {
  #observers: Array<ObserverFn> = []

  constructor() {
    this.#observers = []
  }

  subscribe(fn: ObserverFn): void {
    this.#observers.push(fn)
  }

  unsubscribe(fn: ObserverFn): void {
    this.#observers = this.#observers.filter(
      (subscriber: ObserverFn) => subscriber !== fn
    )
  }

  fire(data: unknown): void {
    this.#observers.forEach((subscriber) => subscriber(data))
  }
}

const resizeObserver = new EventObserver()
const resizeObserverProto = new ResizeObserver(() =>
  setTimeout(() => resizeObserver.fire('resize'), 10)
)
resizeObserverProto.observe(document.documentElement)

export { resizeObserver }
