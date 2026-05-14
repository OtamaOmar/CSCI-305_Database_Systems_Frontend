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
import SignupPage from './auth/Signup'
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
const hospitalOperationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/hospital-operations',
  component: HospitalOperations,
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
const reportsDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports-dashboard',
  component: ReportsDashboardPage,
})

const appointmentsPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/appointments',
  component: AppointmentsPage,
})

const bookAppointmentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/book-appointment',
  component: BookAppointmentPage,
})

const appointmentDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/appointment-details',
  component: AppointmentDetailsPage,
})

const emergencyOperationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/emergency-operations',
  component: EmergencyOperationsPage,
})

const roomsManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rooms-management',
  component: RoomsManagementPage,
})

const departmentsPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/departments-page',
  component: DepartmentsPage,
})

const hospitalLocationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/hospital-locations',
  component: HospitalLocationsPage,
})

const prescriptionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/prescriptions',
  component: PrescriptionsPage,
})

const medicalFilesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/medical-files',
  component: MedicalFilesPage,
})

const adminPanelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin-panel',
  component: AdminPanelPage,
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
