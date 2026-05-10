import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import Hero from './pages/Hero'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import Doctors from './pages/Doctors'
import Emergency from './pages/Emergency'
import LoginPage from './auth/Login'
import SignupPage from './auth/Signup'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Hero,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
})

const patientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patient',
  component: Patients,
})

const doctorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/doctors',
  component: Doctors,
})

const emergencyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/emergency',
  component: Emergency,
})

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignupPage,
})

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, signupRoute, dashboardRoute, patientRoute, doctorsRoute, emergencyRoute])

export const router = createRouter({ routeTree })
