import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import Hero from './pages/Hero'
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

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignupPage,
})

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, signupRoute])

export const router = createRouter({ routeTree })
