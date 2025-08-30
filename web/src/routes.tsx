import { createBrowserRouter } from "react-router-dom";
import { SignInPage } from "./pages/auth/sign-in/sign-in-page";
import { AuthLayout } from "./pages/_layouts/auth-layout";
import { NotFoundPage } from "./pages/not-found/not-found-page";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <NotFoundPage />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: <SignInPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
