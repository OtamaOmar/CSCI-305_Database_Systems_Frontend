import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import Hero from './pages/Hero'
import Dashboard from './pages/Dashboard'
import ContactUs from './pages/ContactUs'
import Charts from './pages/Charts'
import StaffSchedule from './pages/StaffSchedule'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
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

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact-us',
  component: ContactUs,
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

const chartsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/charts',
  component: Charts,
})

const staffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff',
  component: StaffSchedule,
})

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: Notifications,
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  dashboardRoute,
  contactRoute,
  chartsRoute,
  staffRoute,
  notificationsRoute,
  settingsRoute,
  profileRoute,
  patientRoute,
  doctorsRoute,
  emergencyRoute,
])

export const router = createRouter({ routeTree })
