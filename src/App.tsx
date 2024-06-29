import './App.css'
import {SatelliteMap} from './components/SatelliteMap.tsx'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {

    return (
        <QueryClientProvider client={queryClient}>
            <SatelliteMap></SatelliteMap>
        </QueryClientProvider>
    );
}

export default App
