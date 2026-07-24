// Mock Data for Parvatiya Vahan Admin Panel

export const mockUsers = [
  {
    id: "u1",
    name: "Amit Sharma",
    mobile: "+91 9876543210",
    email: "amit.sharma@gmail.com",
    gender: "MALE",
    profilePhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    roles: ["PASSENGER"],
    accountStatus: "ACTIVE",
    driverStatus: "NOT_APPLIED",
    profileCompleted: true,
    capabilities: { canBookRide: true, canOfferRide: false, canManageRequests: false },
    createdAt: "2026-05-10T12:00:00Z"
  },
  {
    id: "u2",
    name: "Priya Devi",
    mobile: "+91 8765432109",
    email: "priya.devi@yahoo.com",
    gender: "FEMALE",
    profilePhotoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    roles: ["PASSENGER", "DRIVER"],
    accountStatus: "ACTIVE",
    driverStatus: "APPROVED",
    profileCompleted: true,
    capabilities: { canBookRide: true, canOfferRide: true, canManageRequests: true },
    vehicle: {
      registrationNumber: "HP-01-C-1234",
      make: "Toyota",
      model: "Innova Crysta",
      color: "Silver",
      seatCapacity: 7,
      isActive: true
    },
    createdAt: "2026-04-15T09:30:00Z"
  },
  {
    id: "u3",
    name: "Rajesh Kumar",
    mobile: "+91 7654321098",
    email: "rajesh.k@rediffmail.com",
    gender: "MALE",
    profilePhotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    roles: ["PASSENGER"],
    accountStatus: "SUSPENDED",
    driverStatus: "NOT_APPLIED",
    profileCompleted: true,
    capabilities: { canBookRide: false, canOfferRide: false, canManageRequests: false },
    createdAt: "2026-05-01T14:15:00Z"
  },
  {
    id: "u4",
    name: "Sunita Negi",
    mobile: "+91 9543210987",
    email: "sunita.negi@outlook.com",
    gender: "FEMALE",
    profilePhotoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    roles: ["PASSENGER"],
    accountStatus: "ACTIVE",
    driverStatus: "IN_REVIEW",
    profileCompleted: true,
    capabilities: { canBookRide: true, canOfferRide: false, canManageRequests: false },
    vehicle: {
      registrationNumber: "HP-01-A-8888",
      make: "Mahindra",
      model: "Scorpio Classic",
      color: "Black",
      seatCapacity: 7,
      isActive: false
    },
    createdAt: "2026-06-02T10:45:00Z"
  },
  {
    id: "u5",
    name: "Vikram Singh",
    mobile: "+91 9123456789",
    email: "vikram.s@gmail.com",
    gender: "MALE",
    profilePhotoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
    roles: ["PASSENGER", "ADMIN"],
    accountStatus: "ACTIVE",
    driverStatus: "NOT_APPLIED",
    profileCompleted: true,
    capabilities: { canBookRide: true, canOfferRide: false, canManageRequests: false },
    createdAt: "2026-03-01T08:00:00Z"
  },
  {
    id: "u6",
    name: "Ramesh Thapa",
    mobile: "+91 8887776665",
    email: "ramesh.thapa@gmail.com",
    gender: "MALE",
    profilePhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    roles: ["PASSENGER"],
    accountStatus: "ACTIVE",
    driverStatus: "IN_REVIEW",
    profileCompleted: true,
    capabilities: { canBookRide: true, canOfferRide: false, canManageRequests: false },
    vehicle: {
      registrationNumber: "HP-02-B-9999",
      make: "Maruti Suzuki",
      model: "Ertiga VXI",
      color: "White",
      seatCapacity: 6,
      isActive: false
    },
    createdAt: "2026-06-10T11:20:00Z"
  }
];

export const mockDriverApplications = [
  {
    id: "app1",
    userId: "u4",
    user: {
      id: "u4",
      name: "Sunita Negi",
      mobile: "+91 9543210987",
      roles: ["PASSENGER"]
    },
    status: "IN_REVIEW",
    notes: "Applicant wants to drive SUV on Shimla-Manali route.",
    createdAt: "2026-06-02T11:00:00Z",
    updatedAt: "2026-06-12T15:30:00Z",
    documentCount: 8,
    vehicle: {
      id: "v1_mock",
      registrationNumber: "HP-01-A-8888",
      make: "Mahindra",
      model: "Scorpio Classic",
      color: "Black",
      seatCapacity: 7,
      isActive: false
    }
  },
  {
    id: "app2",
    userId: "u6",
    user: {
      id: "u6",
      name: "Ramesh Thapa",
      mobile: "+91 8887776665",
      roles: ["PASSENGER"]
    },
    status: "IN_REVIEW",
    notes: "Experienced driver with hill permit.",
    createdAt: "2026-06-10T11:30:00Z",
    updatedAt: "2026-06-13T10:00:00Z",
    documentCount: 8,
    vehicle: {
      id: "v2_mock",
      registrationNumber: "HP-02-B-9999",
      make: "Maruti Suzuki",
      model: "Ertiga VXI",
      color: "White",
      seatCapacity: 6,
      isActive: false
    }
  }
];

export const mockVerificationDocuments = {
  app1: [
    {
      id: "doc1_1",
      uploadId: "up1",
      documentType: "AADHAAR_PAN",
      status: "VERIFIED",
      mimeType: "image/jpeg",
      submittedAt: "2026-06-02T11:05:00Z",
      verifiedAt: "2026-06-12T15:00:00Z",
      upload: {
        originalFileName: "aadhaar_card.jpg",
        privateUrl: "",
        uploadUrl: "https://images.unsplash.com/photo-1633158829585-23bc8f7c6caf?w=600",
        sizeBytes: 154200
      }
    },
    {
      id: "doc1_2",
      uploadId: "up2",
      documentType: "DRIVING_LICENSE",
      status: "PENDING_REVIEW",
      mimeType: "image/jpeg",
      submittedAt: "2026-06-02T11:07:00Z",
      verifiedAt: null,
      upload: {
        originalFileName: "dl_front.jpg",
        privateUrl: "",
        uploadUrl: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=600",
        sizeBytes: 245100
      }
    },
    {
      id: "doc1_3",
      uploadId: "up3",
      documentType: "RC",
      status: "PENDING_REVIEW",
      mimeType: "image/jpeg",
      submittedAt: "2026-06-02T11:10:00Z",
      verifiedAt: null,
      upload: {
        originalFileName: "rc_document.jpg",
        privateUrl: "",
        uploadUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600",
        sizeBytes: 304800
      }
    },
    {
      id: "doc1_4",
      uploadId: "up4",
      documentType: "INSURANCE",
      status: "PENDING_REVIEW",
      mimeType: "image/jpeg",
      submittedAt: "2026-06-02T11:11:00Z",
      verifiedAt: null,
      upload: {
        originalFileName: "insurance_policy.jpg",
        privateUrl: "",
        uploadUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600",
        sizeBytes: 421000
      }
    },
    {
      id: "doc1_5",
      uploadId: "up5",
      documentType: "PERMIT",
      status: "PENDING_REVIEW",
      mimeType: "image/jpeg",
      submittedAt: "2026-06-02T11:12:00Z",
      verifiedAt: null,
      upload: {
        originalFileName: "hill_permit.jpg",
        privateUrl: "",
        uploadUrl: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600",
        sizeBytes: 215400
      }
    },
    {
      id: "doc1_6",
      uploadId: "up6",
      documentType: "PCC",
      status: "VERIFIED",
      mimeType: "image/jpeg",
      submittedAt: "2026-06-02T11:14:00Z",
      verifiedAt: "2026-06-12T15:10:00Z",
      upload: {
        originalFileName: "police_clearance.jpg",
        privateUrl: "",
        uploadUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600",
        sizeBytes: 187000
      }
    },
    {
      id: "doc1_7",
      uploadId: "up7",
      documentType: "FITNESS",
      status: "PENDING_REVIEW",
      mimeType: "image/jpeg",
      submittedAt: "2026-06-02T11:15:00Z",
      verifiedAt: null,
      upload: {
        originalFileName: "fitness_certificate.jpg",
        privateUrl: "",
        uploadUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600",
        sizeBytes: 298300
      }
    },
    {
      id: "doc1_8",
      uploadId: "up8",
      documentType: "PROFILE_PHOTO",
      status: "VERIFIED",
      mimeType: "image/jpeg",
      submittedAt: "2026-06-02T11:05:00Z",
      verifiedAt: "2026-06-12T15:00:00Z",
      upload: {
        originalFileName: "sunita_profile.jpg",
        privateUrl: "",
        uploadUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
        sizeBytes: 94800
      }
    }
  ],
  app2: [
    {
      id: "doc2_1",
      uploadId: "up9",
      documentType: "AADHAAR_PAN",
      status: "PENDING_REVIEW",
      mimeType: "image/jpeg",
      submittedAt: "2026-06-10T11:35:00Z",
      verifiedAt: null,
      upload: {
        originalFileName: "ramesh_aadhar.jpg",
        privateUrl: "",
        uploadUrl: "https://images.unsplash.com/photo-1633158829585-23bc8f7c6caf?w=600",
        sizeBytes: 159000
      }
    },
    {
      id: "doc2_2",
      uploadId: "up10",
      documentType: "DRIVING_LICENSE",
      status: "PENDING_REVIEW",
      mimeType: "image/jpeg",
      submittedAt: "2026-06-10T11:37:00Z",
      verifiedAt: null,
      upload: {
        originalFileName: "ramesh_dl.jpg",
        privateUrl: "",
        uploadUrl: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=600",
        sizeBytes: 232000
      }
    },
    {
      id: "doc2_3",
      uploadId: "up11",
      documentType: "RC",
      status: "PENDING_REVIEW",
      mimeType: "image/jpeg",
      submittedAt: "2026-06-10T11:40:00Z",
      verifiedAt: null,
      upload: {
        originalFileName: "ramesh_rc.jpg",
        privateUrl: "",
        uploadUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600",
        sizeBytes: 310000
      }
    },
    {
      id: "doc2_4",
      uploadId: "up12",
      documentType: "INSURANCE",
      status: "PENDING_REVIEW",
      mimeType: "image/jpeg",
      submittedAt: "2026-06-10T11:41:00Z",
      verifiedAt: null,
      upload: {
        originalFileName: "ramesh_ins.jpg",
        privateUrl: "",
        uploadUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600",
        sizeBytes: 410000
      }
    },
    {
      id: "doc2_5",
      uploadId: "up13",
      documentType: "PERMIT",
      status: "PENDING_REVIEW",
      mimeType: "image/jpeg",
      submittedAt: "2026-06-10T11:42:00Z",
      verifiedAt: null,
      upload: {
        originalFileName: "ramesh_permit.jpg",
        privateUrl: "",
        uploadUrl: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600",
        sizeBytes: 210000
      }
    },
    {
      id: "doc2_6",
      uploadId: "up14",
      documentType: "PCC",
      status: "PENDING_REVIEW",
      mimeType: "image/jpeg",
      submittedAt: "2026-06-10T11:44:00Z",
      verifiedAt: null,
      upload: {
        originalFileName: "ramesh_pcc.jpg",
        privateUrl: "",
        uploadUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600",
        sizeBytes: 191000
      }
    },
    {
      id: "doc2_7",
      uploadId: "up15",
      documentType: "FITNESS",
      status: "PENDING_REVIEW",
      mimeType: "image/jpeg",
      submittedAt: "2026-06-10T11:45:00Z",
      verifiedAt: null,
      upload: {
        originalFileName: "ramesh_fitness.jpg",
        privateUrl: "",
        uploadUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600",
        sizeBytes: 285000
      }
    },
    {
      id: "doc2_8",
      uploadId: "up16",
      documentType: "PROFILE_PHOTO",
      status: "PENDING_REVIEW",
      mimeType: "image/jpeg",
      submittedAt: "2026-06-10T11:35:00Z",
      verifiedAt: null,
      upload: {
        originalFileName: "ramesh_profile.jpg",
        privateUrl: "",
        uploadUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        sizeBytes: 92000
      }
    }
  ]
};

export const mockRides = [
  {
    id: "r1",
    driverId: "u2",
    driverName: "Priya Devi",
    vehicleId: "v1",
    vehicle: {
      registrationNumber: "HP-01-C-1234",
      make: "Toyota",
      model: "Innova Crysta",
      color: "Silver",
      seatCapacity: 7,
      isActive: true
    },
    pickup: "Shimla Mall Road",
    drop: "Manali Bus Stand",
    status: "PUBLISHED",
    departureAt: "2026-06-15T07:00:00Z",
    pricePerSeat: 450,
    totalSeats: 4,
    availableSeats: 2,
    heldSeats: 0,
    bookedSeats: 2,
    createdAt: "2026-06-13T10:00:00Z"
  },
  {
    id: "r2",
    driverId: "u2",
    driverName: "Priya Devi",
    vehicleId: "v1",
    vehicle: {
      registrationNumber: "HP-01-C-1234",
      make: "Toyota",
      model: "Innova Crysta",
      color: "Silver",
      seatCapacity: 7,
      isActive: true
    },
    pickup: "Dharamshala Temple",
    drop: "McLeodganj Market",
    status: "COMPLETED",
    departureAt: "2026-06-14T08:00:00Z",
    pricePerSeat: 120,
    totalSeats: 4,
    availableSeats: 0,
    heldSeats: 0,
    bookedSeats: 4,
    createdAt: "2026-06-13T12:00:00Z"
  },
  {
    id: "r3",
    driverId: "u2",
    driverName: "Priya Devi",
    vehicleId: "v1",
    vehicle: {
      registrationNumber: "HP-01-C-1234",
      make: "Toyota",
      model: "Innova Crysta",
      color: "Silver",
      seatCapacity: 7,
      isActive: true
    },
    pickup: "Dehradun Clock Tower",
    drop: "Mussoorie Mall Road",
    status: "CANCELLED",
    departureAt: "2026-06-12T10:00:00Z",
    pricePerSeat: 300,
    totalSeats: 4,
    availableSeats: 4,
    heldSeats: 0,
    bookedSeats: 0,
    createdAt: "2026-06-11T09:00:00Z"
  }
];

export const mockBookings = [
  {
    id: "b1",
    passengerId: "u1",
    passengerName: "Amit Sharma",
    rideId: "r1",
    driverId: "u2",
    driverName: "Priya Devi",
    vehicle: {
      registrationNumber: "HP-01-C-1234",
      make: "Toyota",
      model: "Innova Crysta",
      color: "Silver",
      seatCapacity: 7,
      isActive: true
    },
    status: "CONFIRMED",
    seatsBooked: 2,
    totalPrice: 900,
    route: { pickup: "Shimla Mall Road", drop: "Manali Bus Stand" },
    rideDate: "2026-06-15T07:00:00Z",
    createdAt: "2026-06-13T15:00:00Z"
  },
  {
    id: "b2",
    passengerId: "u3",
    passengerName: "Rajesh Kumar",
    rideId: "r2",
    driverId: "u2",
    driverName: "Priya Devi",
    vehicle: {
      registrationNumber: "HP-01-C-1234",
      make: "Toyota",
      model: "Innova Crysta",
      color: "Silver",
      seatCapacity: 7,
      isActive: true
    },
    status: "COMPLETED",
    seatsBooked: 4,
    totalPrice: 480,
    route: { pickup: "Dharamshala Temple", drop: "McLeodganj Market" },
    rideDate: "2026-06-14T08:00:00Z",
    createdAt: "2026-06-13T16:30:00Z"
  }
];

export const mockPayments = [
  {
    id: "p1",
    bookingId: "b1",
    userId: "u1",
    userName: "Amit Sharma",
    type: "BOOKING",
    status: "SUCCESS",
    amount: 900,
    currency: "INR",
    paymentMethod: "UPI",
    transactionId: "txn_73824194",
    createdAt: "2026-06-13T15:01:00Z"
  },
  {
    id: "p2",
    bookingId: "b2",
    userId: "u3",
    userName: "Rajesh Kumar",
    type: "BOOKING",
    status: "SUCCESS",
    amount: 480,
    currency: "INR",
    paymentMethod: "CARD",
    transactionId: "txn_98241094",
    createdAt: "2026-06-13T16:31:00Z"
  }
];

export const mockPricingSettings = {
  minPricePerSeat: 100,
  maxPricePerSeat: 5000,
  basePricePerKm: 15,
  serviceFeePercent: 10,
  serviceFeeGstPercent: 18,
  peakHourMultiplier: 1.5,
  peakHourStart: 8,
  peakHourEnd: 11,
  surgePricingEnabled: true,
  surgeThreshold: 80,
  cancellationChargePercent: 10
};

export const mockReportSummary = {
  period: { from: "2026-05-15T00:00:00Z", to: "2026-06-14T17:00:00Z" },
  rides: { total: 15, published: 5, completed: 8, cancelled: 2 },
  bookings: { total: 24, confirmed: 6, completed: 15, cancelled: 3 },
  payments: { total: 24, successful: 21, failed: 2, pending: 1, totalAmount: 12450 },
  users: { totalPassengers: 45, totalDrivers: 12, newThisMonth: 8 },
  revenue: {
    totalCollected: 12450,
    totalByPaymentMethod: { UPI: 7800, CARD: 3650, NETBANKING: 1000 },
    topRoutes: [
      { route: "Shimla-Manali", amount: 6200, count: 8 },
      { route: "Dehradun-Mussoorie", amount: 3100, count: 5 },
      { route: "Dharamshala-McLeodganj", amount: 1800, count: 6 }
    ]
  }
};
