import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./features/authentication/components/Login";
import Register from "./features/authentication/components/Register";
import Home from "./Home";
import WorkVolume from "./features/work_volume/WorkVolume";
import ApprovalVolume from "./features/approval_volume/ApprovalVolume";
import UserListPage from "./features/user/pages/UserListPage";
import CourtList from "./pages/CourtPage";
import CourtDetail from "./pages/CourtDetail";
import UserDetail from "./features/user/components/UserListDetail";
import { PagePath } from "./enums/page-path.enum";
import Profile from "./features/authentication/components/Profile";
import SidebarMenu from "./components/SidebarMenu";
import VerifyEmail from "./features/authentication/components/VerifyEmail";
import VerifyOTP from "./features/authentication/components/VerifyOTP";
import QuizTest from "./features/quiz/components/Quiz";
import SkincareServices from "./features/services/components/SkinService";
import BlogPage from "./features/blog/components/Blog";
import BlogDetail from "./features/blog/components/BlogDetail";
import NavbarMenu from "./components/NavBarMenu";
import Complete from "./pages/CompleteResult";
import ServiceDetail from "./features/services/components/SkinServiceDetail";
import SkincareBooking from "./features/services/components/BookingService";
import PricingTable from "./pages/PricingPage";
import HomePage from "./pages/HomePage";
import StaffTherapistPage from "./pages/StaffTherapistPage";
import StaffAppoinmentPage from "./features/booking/page/StaffAppointmentPage";
import SkinTherapistAppoinmentPage from "./features/booking/page/SkinTherapistAppointmentPage";
import NotFoundPage from "./pages/NotFoundPage";
import ForbiddenPage from "./pages/ForbiddenPage";
import { AuthGuardProvider } from "./contexts/AuthGuardContext";
import SkinTherapistListPage from "./features/skin_therapist/page/SkinTherapistListPage";
import SkinTherapistDetailPage from "./features/skin_therapist/page/SkinTherapistDetailPage";
import UpdateBookingServicePage from "./features/booking/page/UpdateBookingServicePage";
import BookingTableForStaff from "./features/booking/components/BookingTableForStaff";

const App = () => {
  return (
    <Router>
      <AuthGuardProvider>
        <Routes>
          <Route
            path={PagePath.ROOT}
            element={<Navigate to={PagePath.HOME_PAGE} />}
          />
          <Route path={PagePath.LOGIN} element={<Login />} />
          <Route path={PagePath.REGISTER} element={<Register />} />
          <Route path={PagePath.VERIFY_EMAIL} element={<VerifyEmail />} />
          <Route path={PagePath.VERIFY_OTP} element={<VerifyOTP />} />
          <Route path={PagePath.ANY} element={<NotFoundPage />} />
          <Route path={PagePath.FORBIDDEN} element={<ForbiddenPage />} />
          <Route element={<SidebarMenu />}>
            <Route path={PagePath.HOME} element={<Home />}></Route>
            <Route path={PagePath.WORK_VOLUME} element={<WorkVolume />} />
            <Route
              path={PagePath.APPROVAL_VOLUME}
              element={<ApprovalVolume />}
            />
            <Route path={PagePath.USER} element={<UserListPage />} />
            <Route path={PagePath.USER_DETAIL} element={<UserDetail />} />
            <Route path={PagePath.PROFILE} element={<Profile />} />
            <Route path={PagePath.BOOKING} element={<BookingTableForStaff />} />
          </Route>
          <Route element={<NavbarMenu />}>
            <Route path={PagePath.HOME_PAGE} element={<HomePage />} />
            <Route path={PagePath.QUIZ} element={<QuizTest />} />
            <Route
              path={PagePath.SKIN_SERVICE}
              element={<SkincareServices />}
            />
            <Route
              path={PagePath.SKIN_SERVICE_DETAIL}
              element={<ServiceDetail />}
            />
            <Route path={PagePath.BLOG} element={<BlogPage />} />
            <Route path={PagePath.BLOG_DETAIL} element={<BlogDetail />} />
            <Route
              path={PagePath.SKIN_THERAPIST}
              element={<SkinTherapistListPage />}
            />
            <Route
              path={PagePath.SKIN_THERAPIST_DETAIL}
              element={<SkinTherapistDetailPage />}
            />
            <Route
              path={PagePath.BOOKING_SERVICE}
              element={<SkincareBooking />}
            />
            <Route path={PagePath.RESULT_COMPLETE} element={<Complete />} />
            <Route path={PagePath.PRICE_SERVICE} element={<PricingTable />} />
            <Route path="Court" element={<CourtList />} />
            <Route path="Court/:id" element={<CourtDetail />} />
            <Route path={PagePath.SS_HOME} element={<StaffTherapistPage />} />
            <Route
              path={PagePath.STAFF_PAGE}
              element={<StaffAppoinmentPage />}
            />
            <Route
              path={PagePath.STAFF_UPDATE_BOOKING}
              element={<UpdateBookingServicePage />}
            />
            <Route
              path={PagePath.SKIN_THERAPIST_PAGE}
              element={<SkinTherapistAppoinmentPage />}
            />
          </Route>
        </Routes>
      </AuthGuardProvider>
    </Router>
  );
};

export default App;
