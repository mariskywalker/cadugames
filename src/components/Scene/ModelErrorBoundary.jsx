import { Component } from 'react'
import { useCADUStore } from '../../store/useCADUStore'

class ModelErrorBoundaryInner extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    this.props.onError?.(error)
  }

  render() {
    return this.state.hasError ? null : this.props.children
  }
}

export function ModelErrorBoundary({ children }) {
  const setModelStatus = useCADUStore((s) => s.setModelStatus)

  return (
    <ModelErrorBoundaryInner
      onError={(err) => {
        const message =
          err && typeof err === 'object' && 'message' in err ? err.message : String(err)
        setModelStatus('error', message)
      }}
    >
      {children}
    </ModelErrorBoundaryInner>
  )
}

