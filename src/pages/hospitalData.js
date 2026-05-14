export const mockAppointments = [
  {
    id: 'APT-1001',
    patient: 'Omar Hassan',
    doctor: 'Dr. Mona Adel',
    department: 'Emergency',
    date: '2026-05-16',
    time: '10:30 AM',
    status: 'Confirmed',
    payment: 'Paid',
    refund: 'Not requested',
  },
  {
    id: 'APT-1002',
    patient: 'Sara Ali',
    doctor: 'Dr. Karim Samir',
    department: 'Internal Medicine',
    date: '2026-05-16',
    time: '12:00 PM',
    status: 'Pending',
    payment: 'Unpaid',
    refund: 'Not requested',
  },
  {
    id: 'APT-1003',
    patient: 'Ahmed Tarek',
    doctor: 'Dr. Nada Youssef',
    department: 'Surgery',
    date: '2026-05-17',
    time: '03:15 PM',
    status: 'Cancelled',
    payment: 'Paid',
    refund: 'Processing',
  },
]

export const mockAmbulances = [
  {
    id: 'AMB-01',
    patient: 'Unknown Case',
    location: 'Nasr City',
    eta: '7 min',
    severity: 'Critical',
    status: 'Incoming',
  },
  {
    id: 'AMB-04',
    patient: 'Mahmoud Fathy',
    location: 'Heliopolis',
    eta: '12 min',
    severity: 'Urgent',
    status: 'On route',
  },
  {
    id: 'AMB-07',
    patient: 'Nour Mohamed',
    location: 'Dokki',
    eta: '18 min',
    severity: 'Stable',
    status: 'Waiting',
  },
]

export const mockTriageCases = [
  {
    queue: 'Q-001',
    patient: 'Unknown Case',
    severity: 'Critical',
    symptoms: 'Chest pain, low oxygen',
    priority: 1,
    nurse: 'Nurse Salma',
  },
  {
    queue: 'Q-002',
    patient: 'Mahmoud Fathy',
    severity: 'Urgent',
    symptoms: 'Head injury',
    priority: 2,
    nurse: 'Nurse Yara',
  },
  {
    queue: 'Q-003',
    patient: 'Nour Mohamed',
    severity: 'Stable',
    symptoms: 'Fever and dizziness',
    priority: 3,
    nurse: 'Nurse Ali',
  },
]

export const mockRooms = [
  {
    id: 'R-ICU-01',
    type: 'ICU',
    status: 'Occupied',
    patient: 'Omar Hassan',
    monitor: 'Ventilator active',
  },
  {
    id: 'R-ICU-02',
    type: 'ICU',
    status: 'Free',
    patient: 'None',
    monitor: 'Ready',
  },
  {
    id: 'OR-01',
    type: 'Operation Room',
    status: 'Reserved',
    patient: 'Ahmed Tarek',
    monitor: 'Surgery at 4:00 PM',
  },
  {
    id: 'TR-05',
    type: 'Treatment Room',
    status: 'Free',
    patient: 'None',
    monitor: 'Ready',
  },
]

export const mockDepartments = [
  {
    code: 'ER',
    name: 'Emergency Department',
    chairman: 'Dr. Mona Adel',
    location: 'Ground Floor',
    staff: 18,
    patients: 42,
  },
  {
    code: 'IM',
    name: 'Internal Medicine',
    chairman: 'Dr. Karim Samir',
    location: 'Floor 2',
    staff: 12,
    patients: 31,
  },
  {
    code: 'SUR',
    name: 'Surgery Department',
    chairman: 'Dr. Nada Youssef',
    location: 'Floor 3',
    staff: 15,
    patients: 20,
  },
]

export const mockLocations = [
  {
    id: 'LOC-01',
    name: 'Main Emergency Entrance',
    type: 'Emergency Gate',
    nearestDepartment: 'Emergency Department',
    distance: '0.1 km',
    availability: 'Open 24/7',
  },
  {
    id: 'LOC-02',
    name: 'ICU Wing',
    type: 'Critical Care',
    nearestDepartment: 'ICU',
    distance: '0.3 km',
    availability: 'Limited beds',
  },
  {
    id: 'LOC-03',
    name: 'Operation Building',
    type: 'Surgery',
    nearestDepartment: 'Surgery Department',
    distance: '0.4 km',
    availability: 'Available',
  },
]

export const mockPrescriptions = [
  {
    id: 'RX-501',
    patient: 'Sara Ali',
    doctor: 'Dr. Karim Samir',
    medication: 'Amoxicillin',
    dosage: '500mg',
    directions: 'Twice daily after meals',
    start: '2026-05-14',
    end: '2026-05-20',
    notes: 'Patient should complete the full course.',
  },
  {
    id: 'RX-502',
    patient: 'Omar Hassan',
    doctor: 'Dr. Mona Adel',
    medication: 'Paracetamol',
    dosage: '1g',
    directions: 'Every 8 hours if needed',
    start: '2026-05-14',
    end: '2026-05-17',
    notes: 'Monitor temperature and pain level.',
  },
]

export const mockMedicalFiles = [
  {
    id: 'FILE-01',
    patient: 'Omar Hassan',
    type: 'X-Ray',
    name: 'chest_xray_omar.pdf',
    uploaded: '2026-05-14',
    size: '2.4 MB',
  },
  {
    id: 'FILE-02',
    patient: 'Sara Ali',
    type: 'Blood Report',
    name: 'blood_test_sara.pdf',
    uploaded: '2026-05-13',
    size: '800 KB',
  },
]

export const mockUsers = [
  {
    id: 'USR-01',
    name: 'Admin User',
    role: 'Admin',
    access: 'Full Access',
    status: 'Active',
  },
  {
    id: 'USR-02',
    name: 'Dr. Mona Adel',
    role: 'Doctor',
    access: 'Medical Records',
    status: 'Active',
  },
  {
    id: 'USR-03',
    name: 'Nurse Salma',
    role: 'Nurse',
    access: 'Triage + Rooms',
    status: 'Active',
  },
]

export const mockRoles = [
  {
    role: 'Admin',
    permissions: 'Full system access, reports, users, roles',
  },
  {
    role: 'Doctor',
    permissions: 'Appointments, prescriptions, medical files',
  },
  {
    role: 'Nurse',
    permissions: 'Triage, emergency queue, rooms',
  },
]

export const mockReports = {
  patientsPerDepartment: [
    { name: 'Emergency', patients: 42 },
    { name: 'Internal Med', patients: 31 },
    { name: 'Surgery', patients: 20 },
    { name: 'ICU', patients: 14 },
  ],
  doctorWorkload: [
    { name: 'Dr. Mona', appointments: 16 },
    { name: 'Dr. Karim', appointments: 11 },
    { name: 'Dr. Nada', appointments: 9 },
    { name: 'Dr. Ali', appointments: 7 },
  ],
  icuUsage: [
    { name: 'Occupied', value: 7 },
    { name: 'Free', value: 3 },
    { name: 'Reserved', value: 2 },
  ],
  emergencyTrend: [
    { day: 'Sun', cases: 18 },
    { day: 'Mon', cases: 25 },
    { day: 'Tue', cases: 22 },
    { day: 'Wed', cases: 31 },
    { day: 'Thu', cases: 28 },
  ],
}

export function getStatusClass(value) {
  const styles = {
    Critical: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    Urgent: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    Stable: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    Confirmed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    Cancelled: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    Paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    Unpaid: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    Free: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    Occupied: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    Reserved: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  }

  return styles[value] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
}