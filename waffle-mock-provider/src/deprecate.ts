export function deprecate (what: string, message?: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`Deprecation warning: ${what} is deprecated.`, message)
  }
}
