import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "../routes"

const RpcSettingsPage = () => {
	return (
		<div>
			<div class='split-section'><span>RPC Connections</span><hr /></div>
			<RpcList />
			<div style={{ display: 'grid', gap: 10, placeItems: 'start' }}>
				<button class='btn'>regular</button>
				<button class='btn' disabled>regular disabled</button>
				<button class='btn btn--primary'>primary</button>
				<button class='btn btn--primary' disabled>primary disabled</button>
				<button class='btn btn--destructive'>primary</button>
				<button class='btn btn--destructive' disabled>primary disabled</button>
				<button class='btn btn--outline'>outline</button>
				<button class='btn btn--outline' disabled>outline disabled</button>
			</div>
		</div>

	)
}

const RpcList = () => {
	return (
		<ul class='listing listing--rpc'>
			<li>
				<dl>
					<dt>Name</dt>
					<dd>Ethereum Llama</dd>
					<dt>Network</dt>
					<dd>Ethereum Mainnet</dd>
					<dt>RPC URL</dt>
					<dd>https://eth.llamarpc.com</dd>
				</dl>
				<button class='btn btn--outline'>EDIT</button>
			</li>
			<li>
				<dl>
					<dt>Name</dt>
					<dd>Ethereum Llama</dd>
					<dt>Network</dt>
					<dd>Ethereum Mainnet</dd>
					<dt>RPC URL</dt>
					<dd>https://eth.llamarpc.com</dd>
				</dl>
				<button class='btn btn--outline'>EDIT</button>
			</li>
		</ul>
	)
}

export const rpcRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/rpc',
	component: RpcSettingsPage
})
