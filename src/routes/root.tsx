import { Outlet, createRootRoute } from "@tanstack/react-router";
import * as routes from '../routes'

export const rootRoute = createRootRoute({
	component: () => <Outlet />
})

export const routeTree = rootRoute.addChildren([
	routes.numbersRoute,
	routes.indexRoute,
	routes.rpcRoute,
])
