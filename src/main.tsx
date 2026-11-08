import React, { Component, ErrorInfo, ReactNode } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class RootErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Credento Application Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white border border-[#e5e1d8] rounded-xl p-8 shadow-sm">
            <h1 className="text-xl font-semibold text-[#1f2923] mb-2 tracking-tight">Credento</h1>
            <p className="text-sm text-[#52635b] mb-6">
              A temporary issue occurred while initializing the session.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem("credento_active_session")
                window.location.reload()
              }}
              className="btn-3d-primary w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Reload Platform
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>,
)
