export interface DebounceCallback extends CallableFunction {
  timerId: ReturnType<typeof setTimeout>
}

export function debounce(cb: DebounceCallback, delay: number) {
  clearTimeout(cb.timerId)
  cb.timerId = setTimeout(() => {
    cb()
  }, delay)
}
