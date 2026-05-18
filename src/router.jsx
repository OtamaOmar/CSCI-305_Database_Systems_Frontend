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
import HospitalOperations from './pages/HospitalOperations'
import LoginPage from './auth/Login'
import OnboardPage from './auth/Onboard'
import SignupPage from './auth/Signup'
import AcceptInvitePage from './auth/AcceptInvite'
import ReportsDashboardPage from './pages/ReportsDashboardPage'
import AppointmentsPage from './pages/AppointmentsPage'
import BookAppointmentPage from './pages/BookAppointmentPage'
import AppointmentDetailsPage from './pages/AppointmentDetailsPage'
import EmergencyOperationsPage from './pages/EmergencyOperationsPage'
import RoomsManagementPage from './pages/RoomsManagementPage'
import DepartmentsPage from './pages/DepartmentsPage'
import HospitalLocationsPage from './pages/HospitalLocationsPage'
import PrescriptionsPage from './pages/PrescriptionsPage'
import MedicalFilesPage from './pages/MedicalFilesPage'
import AdminPanelPage from './pages/AdminPanelPage'
import RequireAuth from './components/RequireAuth'

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

const onboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboard',
  component: OnboardPage,
})

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignupPage,
})

const acceptInviteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accept-invite',
  component: AcceptInvitePage,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  ),
})

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact-us',
  component: () => (
    <RequireAuth>
      <ContactUs />
    </RequireAuth>
  ),
})

const patientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patient',
  component: () => (
    <RequireAuth>
      <Patients />
    </RequireAuth>
  ),
})

const doctorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/doctors',
  component: () => (
    <RequireAuth>
      <Doctors />
    </RequireAuth>
  ),
})

const emergencyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/emergency',
  component: () => (
    <RequireAuth>
      <Emergency />
    </RequireAuth>
  ),
})
const hospitalOperationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/hospital-operations',
  component: () => (
    <RequireAuth>
      <HospitalOperations />
    </RequireAuth>
  ),
})

const chartsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/charts',
  component: () => (
    <RequireAuth>
      <Charts />
    </RequireAuth>
  ),
})

const staffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff',
  component: () => (
    <RequireAuth>
      <StaffSchedule />
    </RequireAuth>
  ),
})

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: () => (
    <RequireAuth>
      <Notifications />
    </RequireAuth>
  ),
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <RequireAuth>
      <Settings />
    </RequireAuth>
  ),
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <RequireAuth>
      <Profile />
    </RequireAuth>
  ),
})
const reportsDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports-dashboard',
  component: () => (
    <RequireAuth>
      <ReportsDashboardPage />
    </RequireAuth>
  ),
})

const appointmentsPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/appointments',
  component: () => (
    <RequireAuth>
      <AppointmentsPage />
    </RequireAuth>
  ),
})

const bookAppointmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/book-appointment',
  component: () => (
    <RequireAuth>
      <BookAppointmentPage />
    </RequireAuth>
  ),
})

const appointmentDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/appointment-details',
  component: () => (
    <RequireAuth>
      <AppointmentDetailsPage />
    </RequireAuth>
  ),
})

const emergencyOperationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/emergency-operations',
  component: () => (
    <RequireAuth>
      <EmergencyOperationsPage />
    </RequireAuth>
  ),
})

const roomsManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rooms-management',
  component: () => (
    <RequireAuth>
      <RoomsManagementPage />
    </RequireAuth>
  ),
})

const departmentsPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/departments-page',
  component: () => (
    <RequireAuth>
      <DepartmentsPage />
    </RequireAuth>
  ),
})

const hospitalLocationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/hospital-locations',
  component: () => (
    <RequireAuth>
      <HospitalLocationsPage />
    </RequireAuth>
  ),
})

const prescriptionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/prescriptions',
  component: () => (
    <RequireAuth>
      <PrescriptionsPage />
    </RequireAuth>
  ),
})

const medicalFilesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/medical-files',
  component: () => (
    <RequireAuth>
      <MedicalFilesPage />
    </RequireAuth>
  ),
})

const adminPanelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin-panel',
  component: () => (
    <RequireAuth>
      <AdminPanelPage />
    </RequireAuth>
  ),
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  onboardRoute,
  signupRoute,
  acceptInviteRoute,
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
  hospitalOperationsRoute,
    reportsDashboardRoute,
  appointmentsPageRoute,
  bookAppointmentRoute,
  appointmentDetailsRoute,
  emergencyOperationsRoute,
  roomsManagementRoute,
  departmentsPageRoute,
  hospitalLocationsRoute,
  prescriptionsRoute,
  medicalFilesRoute,
  adminPanelRoute,
])

export const router = createRouter({ routeTree })
