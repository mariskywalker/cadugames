'use client'

import { Component, type ReactNode } from 'react'

class ModelErrorBoundaryInner extends Component<
  { children: ReactNode; onError?: (error: unknown) => void },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    this.props.onError?.(error)
  }

  render() {
    return this.state.hasError ? null : this.props.children
  }
}

export function ModelErrorBoundary({ children }: { children: ReactNode }) {
  return <ModelErrorBoundaryInner>{children}</ModelErrorBoundaryInner>
}
