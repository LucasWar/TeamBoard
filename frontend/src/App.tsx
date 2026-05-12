import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router } from './Router'
import { AuthProvider } from './app/contexts/authContext'
import { OrganizationProvider } from './app/contexts/organizationContext'
import { Toaster } from 'react-hot-toast'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OrganizationProvider>
          <Router />
          <Toaster/>
        </OrganizationProvider>
      </AuthProvider>
      <ReactQueryDevtools buttonPosition="bottom-left"/>
    </QueryClientProvider>
  )
}

export default App
