import { useSignal, useSignalEffect } from '@preact/signals'
import { useAsyncState } from '../lib/preact.utils'

type EthChainIdResponse = {
	id: string | null,
	jsonrpc: number,
	result: `0x${string}`
}

export function useQueryRpc(debounceDelay = 600) {
	const { value:queryValue, waitFor, reset } = useAsyncState<EthChainIdResponse>()
	const timeout = useSignal<ReturnType<typeof setTimeout> | undefined>(undefined)
	const url = useSignal('')

	// debounce fetching rpc info
	const setUrlAfterDelay = (rpcUrl: string, delay = debounceDelay) => {
		if (timeout.value) clearTimeout(timeout.value)
		timeout.value = setTimeout(() => { url.value = rpcUrl }, delay)
	}

	const fetchRpcInfo = () => waitFor(async () => {
		const requestBody = JSON.stringify({ method: 'eth_chainId', params: [], jsonrpc: '2.0' })
		const response = await fetch(url.value, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: requestBody })
		if (!response.ok) throw new Error(`Could not connect to RPC server ${url}`)
		return await response.json()
	})

	useSignalEffect(() => {
		if (url.value === '') { reset(); return }
		fetchRpcInfo()
	})

	return { queryValue, setRpcUrlToQuery: setUrlAfterDelay }
}
