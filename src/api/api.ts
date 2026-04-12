import axios from "axios";

export const baseURL = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL,
  withCredentials: true, // ✅ send cookies automatically
});

// 🔹 Request Interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔹 Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error?.response?.data;

    return Promise.reject({
      message:
        data?.errors?.[0]?.msg ||
        data?.error ||
        data?.message ||
        "Something went wrong",
      errors: data?.errors || null,
      status: error?.response?.status,
    });
  }
);

export default API;

// User Routes
export const getAllUsers = () => API.get('/api/auth/all?role=user');
export const getAllAdmins = () => API.get('/api/auth/all?role=admin');
export const createAdmin = (name: any, email: any, password: any) =>
  API.post('/api/a  uth/register', { name, email, password, role: 'admin', isActive: true });
export const updateRole = (userId: any, role: any) =>
  API.put(`/api/auth/updateUser/${userId}`, { role });

// Category Routes
export const getAllCategories = () => API.get('/api/category/all');
export const getCollegeCount = () => API.get('/api/college/count');
export const createCategory = (data: any) => API.post('/api/category/create', data);
export const getCategoryById = (categoryId: any) => API.get(`/api/category/category/${categoryId}`);
export const updateCategory = (categoryId: any, data: any) => API.put(`/api/category/update/${categoryId}`, data);
export const deleteCategory = (categoryId: any) => API.delete(`/api/category/delete/${categoryId}`);

// Blog Routes
export const getAllBlogs = (params: {
  page?: number;
  limit?: number;
  search?: string;
  visible?: boolean;
}) => {
  return API.get('/api/blog/all', { params });
};

export const createBlog = (data: any) => API.post('/api/blog/create', data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
export const getBlogById = (blogId: any) => API.get(`/api/blog/blog/${blogId}`);
export const updateBlog = (blogId: any, data: any) => API.put(`/api/blog/update/${blogId}`, data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
export const deleteBlog = (blogId: any) => API.delete(`/api/blog/delete/${blogId}`);

// Exam Routes
export const getAllExams = (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return API.get('/api/exam/all', { params });
};

export const createExam = (data: any) => API.post('/api/exam/create', data);
export const getExamById = (examId: any) => API.get(`/api/exam/exam/${examId}`);
export const updateExam = (examId: any, data: any) => API.put(`/api/exam/update/${examId}`, data);
export const deleteExam = (examId: any) => API.delete(`/api/exam/delete/${examId}`);

// News Routes
export const getAllNews = (page = 1, limit = 10) =>
  API.get(`/api/news/all?page=${page}&limit=${limit}`);
export const createNews = (data: any) => API.post('/api/news/create', data);
export const getNewsById = (newsId: any) => API.get(`/api/news/new/${newsId}`);
export const updateNews = (newsId: any, data: any) => API.put(`/api/news/update/${newsId}`, data);
export const deleteNews = (newsId: any) => API.delete(`/api/news/delete/${newsId}`);

// Scholarship Routes
export const getAllScholarships = (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return API.get('/api/scholarship/all', { params });
};

export const createScholarship = (data: any) => API.post('/api/scholarship/create', data);
export const getScholarshipById = (scholarshipId: any) => API.get(`/api/scholarship/scholarship/${scholarshipId}`);
export const updateScholarship = (scholarshipId: any, data: any) => API.put(`/api/scholarship/update/${scholarshipId}`, data);
export const deleteScholarship = (scholarshipId: any) => API.delete(`/api/scholarship/delete/${scholarshipId}`);

// International College Routes
export const getAllInternationalColleges = () => API.get('/api/international/all');
export const createInternationalCollege = (data: any) => API.post('/api/international/create', data);
export const getInternationalCollegeById = (internationalId: any) => API.get(`/api/international/college/${internationalId}`);
export const updateInternationalCollege = (internationalId: any, data: any) => API.put(`/api/international/update/${internationalId}`, data);
export const deleteInternationalCollege = (internationalId: any) => API.delete(`/api/international/delete/${internationalId}`);

// Colleges Routes
export const getAllColleges = (page = 1, limit = 10) =>
  API.get(`/api/college/all?page=${page}&limit=${limit}`);

export const createCollege = (data: any) => API.post('/api/college/create', data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
export const getCollegeById = (id: any) => API.get(`/api/college/${id}`);
export const updateCollege = (id: any, data: any) => API.put(`/api/college/update/${id}`, data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
export const deleteCollege = (id: any) => API.delete(`/api/college/delete/${id}`);
export const createCourse = (data: any) => API.post('/api/course/create', data);
export const getCoursesByCollege = (collegeId: any) => API.get(`/api/course/college/${collegeId}`);
export const deleteCourse = (courseId: any) => API.delete(`/api/course/delete/${courseId}`);
export const createFee = (data: any) => API.post('/api/fee/create', data);
export const getFeesByCourse = (courseId: any) => API.get(`/api/fee/course/${courseId}`);
export const deleteFee = (feeId: any) => API.delete(`/api/fee/delete/${feeId}`);
export const createAdmission = (data: any) => API.post('/api/admission/create', data);
export const getAdmissionsByCollege = (collegeId: any) => API.get(`/api/admission/college/${collegeId}`);
export const deleteAdmission = (admissionId: any) => API.delete(`/api/admission/delete/${admissionId}`);
export const createCutoff = (data: any) => API.post('/api/cutoff/create', data);
export const getCutoffsByCollege = (collegeId: any) => API.get(`/api/cutoff/college/${collegeId}`);
export const deleteCutoff = (cutoffId: any) => API.delete(`/api/cutoff/delete/${cutoffId}`);
export const createFacility = (data: any) => API.post('/api/facility/create', data);
export const getFacilitiesByCollege = (collegeId: any) => API.get(`/api/facility/college/${collegeId}`);
export const deleteFacility = (facilityId: any) => API.delete(`/api/facility/delete/${facilityId}`);
export const createFaculty = (data: any) => API.post('/api/faculty/create', data);
export const getFacultiesByCollege = (collegeId: any) => API.get(`/api/faculty/college/${collegeId}`);
export const deleteFaculty = (facultyId: any) => API.delete(`/api/faculty/delete/${facultyId}`);
export const createFAQ = (data: any) => API.post('/api/faq/create', data);
export const getFAQsByCollege = (collegeId: any) => API.get(`/api/faq/college/${collegeId}`);
export const deleteFAQ = (faqId: any) => API.delete(`/api/faq/delete/${faqId}`);
export const createGalleryImage = (data: any) => API.post('/api/gallery/create', data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
export const getGalleryByCollege = (collegeId: any) => API.get(`/api/gallery/college/${collegeId}`);
export const deleteGalleryImage = (imageId: any) => API.delete(`/api/gallery/delete/${imageId}`);
export const createReview = (data: any) => API.post('/api/review/create', data);
export const getReviewsByCollege = (collegeId: any) => API.get(`/api/review/college/${collegeId}`);
export const deleteReview = (reviewId: any) => API.delete(`/api/review/delete/${reviewId}`);
export const createPlacement = (data: any) => API.post('/api/placement/create', data);
export const getPlacementsByCollege = (collegeId: any) => API.get(`/api/placement/college/${collegeId}`);
export const deletePlacement = (placementId: any) => API.delete(`/api/placement/delete/${placementId}`);
export const createRecruiter = (data: any) => API.post('/api/recruiter/create', data);
export const getRecruitersByCollege = (collegeId: any) => API.get(`/api/recruiter/college/${collegeId}`);
export const deleteRecruiter = (recruiterId: any) => API.delete(`/api/recruiter/delete/${recruiterId}`);

// Contact Us Routes
export const getAllContactUs = () => API.get('/api/contact/all');
export const DeleteContactUs = (id: any) =>
  API.get(`/api/contactus/delete/${id}`);


// TESTIMONIAL ROUTES
export const getAllTestimonials = () =>
  API.get("/api/testimonial/all");
export const createTestimonial = (data: any) =>
  API.post("/api/testimonial/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const deleteTestimonial = (id: string) =>
  API.delete(`/api/testimonial/delete/${id}`);


// Professor Routes 
export const getAllProfessors = (page = 1, limit = 10) =>
  API.get(`/api/mentor/all?page=${page}&limit=${limit}`).then(res => res.data);
export const getProfessorById = (id: string) =>
  API.get(`/api/mentor/${id}`).then(res => res.data);
export const deleteProfessor = (id: any) =>
  API.delete(`/api/mentor/delete/${id}`);
export const updateProfessor = (id: any, data: any) =>
  API.put(`/api/mentor/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const createProfessor = (data: any) =>
  API.post('/api/mentor/create', data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });


// Eductional Partners 
export const getAllEducationalPartners = (page = 1, limit = 10) =>
  API.get(`/api/partner/all?page=${page}&limit=${limit}`).then(res => res.data);
export const getEducationalPartnerById = (id: any) =>
  API.get(`/api/partner/${id}`);
export const createEducationalPartner = (data: any) =>
  API.post(`/api/partner/create`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updateEducationalPartner = (id: any, data: any) =>
  API.put(`/api/partner/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const deleteEducationalPartner = (id: any) =>
  API.delete(`/api/partner/delete/${id}`);

//Online Consultation 
export const getAllConsultants = (page = 1, limit = 10) =>
  API.get(`/api/consultation/all?page=${page}&limit=${limit}`).then(res => res.data);
export const deleteConsultant = (id: any) =>
  API.delete(`/api/consultation/delete/${id}`);