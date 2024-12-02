// eventEmitter.ts
type Listener<T = unknown> = (_args: T) => void

class EventEmitter<T = unknown> {
  private events: Record<string, Listener<T>[]> = {}

  // Register an event listener
  on(event: string, listener: Listener<T>): void {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(listener)
  }

  // Emit an event to all registered listeners
  emit(event: string, args: T): void {
    if (this.events[event]) {
      this.events[event].forEach((listener) => listener(args))
    }
  }

  // Remove an event listener
  off(event: string, listenerToRemove: Listener<T>): void {
    if (!this.events[event]) return

    this.events[event] = this.events[event].filter(
      (listener) => listener !== listenerToRemove
    )
  }

  // Register a one-time event listener
  once(event: string, listener: Listener<T>): void {
    const onceListener: Listener<T> = (args: T) => {
      listener(args)
      this.off(event, onceListener) // Remove listener after it is called
    }
    this.on(event, onceListener)
  }
}

export const eventEmitter = new EventEmitter()
