import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "../routes"

const Home = () => {
	return <div>Home</div>
}

export const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/',
	component: Home
})
