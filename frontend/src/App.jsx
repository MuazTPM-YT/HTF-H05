import Register from './components/auth/Register'
import { AuthLayout } from './components/layouts/auth-layout'

function App() {
  return (
    <>
      <AuthLayout title="Create your account" subtitle="Join HealthChain to securely manage your health records">
        <Register />
      </AuthLayout>
    </>
  )
}

export default App
