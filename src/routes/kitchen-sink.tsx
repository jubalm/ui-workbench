import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "../routes"
import { Collapsible } from "../components/Collapsible"

const KitchenSink = () => {
	return (
		<section style={ { padding: '0 1rem' } }>
			<Collapsible summary='Buttons'>
				<div style={ { display: 'grid', gap: 10, placeItems: 'start' } }>
					<button class='btn'>regular</button>
					<button class='btn' disabled>regular disabled</button>
					<button class='btn btn--primary'>primary</button>
					<button class='btn btn--primary' disabled>primary disabled</button>
					<button class='btn btn--destructive'>primary</button>
					<button class='btn btn--destructive' disabled>primary disabled</button>
					<button class='btn btn--outline'>outline</button>
					<button class='btn btn--outline' disabled>outline disabled</button>
				</div>
				<Collapsible summary='Level 2'>
					deeper
				</Collapsible>
			</Collapsible>
			<Collapsible summary='Some Explainer'>
				<p>Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.</p>
			</Collapsible>
		</section>

	)
}

export const kitchenSinkRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/kitchen-sink',
	component: KitchenSink
})
