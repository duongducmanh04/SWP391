import { PagePath } from "../enums/page-path.enum";
import useAuthStore from "../features/authentication/hooks/useAuthStore";
import { createContext, useEffect, type PropsWithChildren } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { App } from "antd";

type UserRole = "Customer" | "Manager" | "Staff" | "Therapist" | "Admin";

type AuthGuardContextType = Record<string, unknown>;

type AuthGuardProviderProps = PropsWithChildren;

const AuthGuardContext = createContext<AuthGuardContextType>({});

export function AuthGuardProvider(props: AuthGuardProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();
  const { children } = props;
  const { user } = useAuthStore();

  useEffect(() => {
    const publicPages: PagePath[] = [
      PagePath.LOGIN,
      PagePath.REGISTER,
      PagePath.VERIFY_EMAIL,
      PagePath.VERIFY_OTP,
      PagePath.HOME_PAGE,
      PagePath.ROOT,
      PagePath.BLOG,
      PagePath.SKIN_THERAPIST,
      PagePath.PRICE_SERVICE,
      PagePath.SKIN_SERVICE,
    ];

    if (!user || !user.role) {
      if (!publicPages.includes(location.pathname as PagePath)) {
        navigate(PagePath.LOGIN, { replace: true });
        // message.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
        // message.error("Bạn phải đăng nhập để truy cập trang này");
      }
      return;
    }

    const role = user.role as UserRole;
    const restrictedPages: Record<UserRole, string[]> = {
      Admin: [
        PagePath.USER,
        PagePath.USER_DETAIL,
        PagePath.HOME,
        PagePath.WORK_VOLUME,
        PagePath.APPROVAL_VOLUME,
        PagePath.PROFILE,
        PagePath.PROFILE_DETAIL,
      ],
      Staff: [
        PagePath.SS_HOME,
        PagePath.STAFF_PAGE,
        PagePath.STAFF_UPDATE_BOOKING,
      ],
      Therapist: [PagePath.SS_HOME, PagePath.SKIN_THERAPIST_PAGE],
      Customer: [
        PagePath.BLOG,
        PagePath.BLOG_DETAIL,
        PagePath.RESULT_COMPLETE,
        PagePath.BOOKING_SERVICE,
        PagePath.SKIN_SERVICE,
        PagePath.SKIN_SERVICE_DETAIL.replace(":serviceId", ""),
        PagePath.SKIN_THERAPIST,
        PagePath.PRICE_SERVICE,
        PagePath.QUIZ,
      ],
      Manager: [],
    };

    // const currentPage = location.pathname as PagePath;

    // if (!publicPages.includes(currentPage) && restrictedPages[role]?.length) {
    //   const allowedPages = restrictedPages[role] || [];

    //   if (!allowedPages.includes(currentPage)) {
    //     navigate(PagePath.FORBIDDEN, { replace: true });
    //     // message.error("Bạn không có quyền truy cập trang này");
    //   }
    // }
    const currentPage = location.pathname;

    const isAllowed = restrictedPages[role]?.some((allowedPath) =>
      currentPage.startsWith(allowedPath)
    );

    if (!publicPages.includes(currentPage as PagePath) && !isAllowed) {
      navigate(PagePath.FORBIDDEN, { replace: true });
    }
  }, [user, location, message, navigate]);

  return (
    <AuthGuardContext.Provider value={{}}>{children}</AuthGuardContext.Provider>
  );
}

export default AuthGuardContext;
