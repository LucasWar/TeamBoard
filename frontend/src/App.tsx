import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router } from './Router'
import { AuthProvider } from './app/contexts/authContext'
import { OrganizationProvider } from './app/contexts/organizationContext'


const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OrganizationProvider>
          <Router />
        </OrganizationProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
