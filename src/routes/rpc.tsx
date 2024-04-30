import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../routes'
import { Collapsible } from '../components/Collapsible'
import { ConfigureRpcConnection } from '../ConfigureRpcConnection'
import { RpcEntry } from '../utils'

const sampleRpcMeta = {
	name: 'Goerli',
	chainId: 5n,
	httpsRpc: 'https://rpc-goerli.dark.florist/flipcardtrustone',
	currencyName: 'Goerli Testnet ETH',
	currencyTicker: 'GÖETH',
	primary: true,
	minimized: true,
	weth: 0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6n,
}

const RpcSettingsPage = () => {
	return (
		<>
			<Collapsible summary = 'RPC Connections' defaultOpen = { true }>
				<RpcList />
			</Collapsible>
		</>

	)
}

const RpcList = () => {
	return (
		<div class = 'grid' style = '--gap-y:0.5rem'>
			<ul class = 'grid' style = '--gap-y: 0.5rem'>
				<RpcSummary info = { sampleRpcMeta } />
				<RpcSummary info = { sampleRpcMeta } />
				<RpcSummary info = { sampleRpcMeta } />
			</ul>
			<ConfigureRpcConnection />
		</div>
	)
}

const RpcSummary = ({ info }: { info: RpcEntry }) => {
	return (
		<li class = 'grid brief'>
			<div class = 'grid' style = '--grid-cols: 1fr max-content; --text-color: gray'>
				<div style = '--area: 1 / 1'><strong>{info.name}</strong></div>
				<div style = '--area: span 2 / 2'>Ethereum Mainnet</div>
				<div>{info.httpsRpc}</div>
			</div>
			<div class = 'actions'>
				<ConfigureRpcConnection rpcInfo = { sampleRpcMeta } />
			</div>
		</li>
	)
}

export const rpcRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/rpc',
	component: RpcSettingsPage
})
