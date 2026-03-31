import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoginPage from '@/pages/LoginPage'
import POSPage from '@/pages/POSPage'
import { AuthProvider } from './stores/auth-store'
import ProtectedRoute from './components/ProtectedRoute'
import RootRedirect from './components/RootRedirect'

const queryClient = new QueryClient()

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public */}
                        <Route path='/' element={<RootRedirect />} />
                        <Route path='/login' element={<LoginPage />} />
                        <Route
                            path='/unauthorized'
                            element={
                                <div className='p-8 text-center'>403 – Bạn không có quyền truy cập trang này.</div>
                            }
                        />

                        {/* Any authenticated user */}
                        <Route element={<ProtectedRoute />}>
                            <Route path='/pos' element={<POSPage />} />
                        </Route>

                        <Route path='*' element={<div className='p-8 text-center'>404 – Trang không tồn tại.</div>} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default App
