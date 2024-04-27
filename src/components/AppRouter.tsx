import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "../routes";

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const AppRouter = () => <RouterProvider router={router} />
