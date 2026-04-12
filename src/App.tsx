import { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import "react-quill/dist/quill.snow.css";
import SignIn from './pages/Authentication/SignIn';
import Loader from './common/Loader';
import ProtectedRoute from './context/ProtectedRoute';
import DashboardLayout from './layout/DashboardLayout';
import UsersLayout from './layout/UsersLayout';
import AdminLayout from './layout/AdminLayout';
import ContactUsLayout from './layout/ContactUsLayout';
import AddAdminLayout from './layout/AddAdminLayout';
import Unauthorized from './pages/Unauthorized/Unauthorized';
import RedirectPage from './common/RedirectPage';
import AddCollegeLayout from './layout/AddCollegeLayout';
import AddCategoryLayout from './layout/category/AddCategoryLayout';
import EditCategoryLayout from './layout/category/EditCategoryLayout';
import CategoriesLayout from './layout/category/CategoriesLayout';
import AddBlogLayout from './layout/blog/AddBlogLayout';
import EditBlogLayout from './layout/blog/EditBlogLayout';
import BlogsLayout from './layout/blog/BlogsLayout';
import AddExamLayout from './layout/exam/AddExamLayout';
import EditExamLayout from './layout/exam/EditExamLayout';
import ExamsLayout from './layout/exam/ExamsLayout';
import AddNewsLayout from './layout/news/AddNewsLayout';
import EditNewsLayout from './layout/news/EditNewsLayout';
import NewsLayout from './layout/news/NewsLayout';
import AddScholarshipLayout from './layout/scholarship/AddScholarshipLayout';
import EditScholarshipLayout from './layout/scholarship/EditScholarshipLayout';
import ScholarshipsLayout from './layout/scholarship/ScholarshipsLayout';
import InternationalCollegesLayout from './layout/international/InternationalCollegesLayout';
import EditInternationalCollegeLayout from './layout/international/EditInternationalCollegeLayout';
import AddInternationalCollegeLayout from './layout/international/AddInternationalCollegeLayout';
import AddProfessorLayout from './layout/professor/AddProfessorLayout';
import AllProfessorsLayout from './layout/professor/AllProfessorsLayout';
import EditProfessorLayout from './layout/professor/EditProfessorLayout';
import AddPartnerLayout from './layout/partner/AddPartnerLayout';
import AllPartnersLayout from './layout/partner/AllPartnersLayout';
import EditPartnerLayout from './layout/partner/EditPartnerLayout';
import AddTestimonialLayout from './layout/testimonial/AddTestimonialLayout';
import AllTestimonialsLayout from './layout/testimonial/AllTestimonialsLayout';
import EditTestimonialLayout from './layout/testimonial/EditTestimonialLayout';
import OnlineConsultationLayout from './layout/OnlineConsultationLayout';

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />
      <Switch>
        <Route exact path="/" component={RedirectPage} />
        <Route exact path="/auth/signin" component={SignIn} />

        <Route exact path="/unauthorized" component={Unauthorized} />

        <ProtectedRoute
          exact
          path="/dashboard"
          component={DashboardLayout}
          allowedRoles={['admin', 'super']}
        />
        <ProtectedRoute
          exact
          path="/users"
          component={UsersLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/admin"
          component={AdminLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/contact-us"
          component={ContactUsLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/add-admin"
          component={AddAdminLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/college"
          component={AddCollegeLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/add-category"
          component={AddCategoryLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/edit-category/:id"
          component={EditCategoryLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/categories"
          component={CategoriesLayout}
          allowedRoles={['super', 'admin']}
        />

        <ProtectedRoute
          exact
          path="/add-blog"
          component={AddBlogLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/edit-blog/:id"
          component={EditBlogLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/blogs"
          component={BlogsLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/add-exam"
          component={AddExamLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/edit-exam/:id"
          component={EditExamLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/exams"
          component={ExamsLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/add-news"
          component={AddNewsLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/edit-news/:id"
          component={EditNewsLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/news"
          component={NewsLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/add-scholarship"
          component={AddScholarshipLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/edit-scholarship/:id"
          component={EditScholarshipLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/scholarships"
          component={ScholarshipsLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/add-international"
          component={AddInternationalCollegeLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/edit-international/:id"
          component={EditInternationalCollegeLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/international-colleges"
          component={InternationalCollegesLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/add-professor"
          component={AddProfessorLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/edit-professor/:id"
          component={EditProfessorLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/professors"
          component={AllProfessorsLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/add-partner"
          component={AddPartnerLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/edit-partner/:id"
          component={EditPartnerLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/partners"
          component={AllPartnersLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/add-testimonial"
          component={AddTestimonialLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/edit-testimonial/:id"
          component={EditTestimonialLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/testimonials"
          component={AllTestimonialsLayout}
          allowedRoles={['super', 'admin']}
        />
        <ProtectedRoute
          exact
          path="/online"
          component={OnlineConsultationLayout}
          allowedRoles={['super', 'admin']}
        />
        {/* for undefined routed */}
        <Route exact path="*" component={Unauthorized} />
      </Switch>
    </>
  );
}

export default App;
