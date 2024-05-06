import { createContext, type ComponentChildren } from 'preact'
import { Signal, useComputed, useSignal, useSignalEffect } from '@preact/signals'
import { useContext, useRef } from 'preact/hooks'
import { AsyncStates, useAsyncState } from './lib/preact.utils'
import { TextInput } from './components/TextInput'
import { RpcEntry } from './utils'

type ParsedData = { success: true, value: RpcEntry } | { message: string }

const parseData = (entry: RpcEntry) => {
	return { success: true, value: entry } satisfies ParsedData
}

type EthChainIdResponse = {
	id: string | null,
	jsonrpc: number,
	result: `0x${string}`
}

type ConfigureRpcContext = {
	asyncQueryRpc: ReturnType<typeof useAsyncState<EthChainIdResponse>>['value']
	rpcInfo: Signal<Partial<RpcEntry>>
}

const ConfigureRpcContext = createContext<ConfigureRpcContext | undefined>(undefined)

const ConfigureRpcProvider = ({ children }: { children: ComponentChildren }) => {
	const rpcInfo = useSignal<Partial<RpcEntry>>({})
	const { value: asyncQueryRpc, waitFor, reset } = useAsyncState<EthChainIdResponse>()

	const fetchRpcInfo = (url: string) => waitFor(async () => {
		const requestBody = JSON.stringify({ method: 'eth_chainId', params: [], jsonrpc: '2.0' })
		const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: requestBody })
		if (!response.ok) throw new Error(`Could not connect to RPC server ${url}`)
		return await response.json()
	})

	const rpcUrl = useComputed(() => rpcInfo.value.httpsRpc)

	useSignalEffect(() => {
		if (asyncQueryRpc.value.state !== 'resolved') return
		const chainId = BigInt(asyncQueryRpc.value.value.result)
		rpcInfo.value = { ...rpcInfo.peek(), chainId }
	})

	useSignalEffect(() => {
		if (!rpcUrl.value) { reset(); return }
		fetchRpcInfo(rpcUrl.value)
	})

	return <ConfigureRpcContext.Provider value = { { asyncQueryRpc, rpcInfo } }>{ children }</ConfigureRpcContext.Provider>
}

function useConfigureRpc() {
	const context = useContext(ConfigureRpcContext)
	if (!context) throw new Error('useConfigureRpc can only be used within children of ConfigureRpcProvider')
	return context
}

export const ConfigureRpcConnection = ({ rpcInfo }: { rpcInfo?: RpcEntry | undefined }) => {
	const modalRef = useRef<HTMLDialogElement>(null)

	const verifyInputsAndSave = (event: Event) => {
		// Preact types can't accept a SubmitEvent type for dialog element's onSubmit so we do a check
		if (!(event instanceof SubmitEvent)) return

		// abort if dialog submitter was a cancel request
		if (event.submitter instanceof HTMLButtonElement && event.submitter.value === 'cancel') {
			modalRef.current?.close()
			return
		}

		// a form with `dialog` method within dialog element should have called this event
		if (event.target instanceof HTMLFormElement) {
			const formData = new FormData(event.target)
			const newRpcEntry = {
				name: formData.get('name') as string,
				chainId: BigInt(formData.get('chainId') as string),
				httpsRpc: formData.get('httpsRpc') as string,
				currencyName: formData.get('currencyName') as string,
				currencyTicker: 'ETH',
				minimized: true,
				primary: false,
				weth: BigInt(0x0)
			} satisfies RpcEntry

			const parsedRpcData = parseData(newRpcEntry)


			if (!parsedRpcData.success) {
				event.preventDefault()
				console.log('parse error', parsedRpcData)
				return
			}

			parsedRpcData.value satisfies RpcEntry
			console.log(parsedRpcData.value)

			// update rpc list
		}
	}

	const showSetupInterface = () => modalRef.current?.showModal()

	return (
		<>
			<button type = 'button' onClick = { showSetupInterface } class = 'btn btn--outline'>{ rpcInfo ? 'Edit' : '+ New RPC Connection' }</button>
			<dialog class = 'dialog' ref = { modalRef } onSubmit = { verifyInputsAndSave } >
				<ConfigureRpcProvider>
					<ConfigureRpcForm />
				</ConfigureRpcProvider>
			</dialog>
		</>
	)
}

const ConfigureRpcForm = () => {
	const { asyncQueryRpc } = useConfigureRpc()

	const chainIdDefault = useComputed(() => {
		if (asyncQueryRpc.value.state !== 'resolved') return ''
		return BigInt(asyncQueryRpc.value.value.result).toString()
	})

	return (
		<form method = 'dialog' class = 'grid' style = '--gap-y: 1.5rem'>
			<header class = 'grid' style = '--grid-cols: 1fr auto'>
				<span style = { { fontWeight: 'bold', color: 'white' } }>Configure RPC Connection</span>
				<button type = 'submit' formNoValidate value = 'cancel' class = 'btn btn--ghost' aria-label = 'close'>
					<span class = 'button-icon' style = { { fontSize: '1.5em' } }>&times;</span>
				</button>
			</header>

			<main class = 'grid' style = '--gap-y: 0.5rem'>
				<p>Interceptor will automatically verify the RPC URL you provide and attempt to fill relevant information. Feel free to adjust the pre-populated details to your preference.</p>

				<div class = 'grid' style = '--grid-cols: 1fr 1fr; --gap-x: 1rem; --gap-y: 0' >
					<RpcUrlField />
					<TextInput label = 'Label *' name = 'name' style = '--area: 3 / span 2' required />
					<TextInput label = 'Network Name *' name = 'network' style = '--area: 5 / span 1' disabled = { asyncQueryRpc.value.state === 'pending' } required />
					<TextInput label = 'Chain ID' name = 'chainId' defaultValue={ chainIdDefault.value } style = '--area: 5 / span 1' required readOnly />
					<TextInput label = 'Currency Name *' name = 'currencyName' style = '--area: 7 / span 1' required />
					<TextInput label = 'Currency Ticker *' name = 'currencyTicker' style = '--area: 7 / span 1' required />
				</div>

				<p style = '--text-color: gray'><small>* Fields marked with an asterisk (*) are required.</small></p>
			</main>

			<footer>
				<div class = 'actions' style = '--btn-text-size: 0.9rem'>
					<button type = 'submit' formNoValidate value = 'cancel' class = 'btn btn--ghost'>Cancel</button>
					<button type = 'submit' value = 'proceed' class = 'btn btn--primary' disabled = { asyncQueryRpc.value.state === 'pending' }>Save RPC Connection</button>
				</div>
			</footer>
		</form>
	)
}

type RpcUrlFieldProps = {
	defaultValue?: string
}

const RpcUrlField = ({ defaultValue }: RpcUrlFieldProps) => {
	const { asyncQueryRpc, rpcInfo } = useConfigureRpc()
	const inputRef = useRef<HTMLInputElement>(null)
	const timeout = useSignal<ReturnType<typeof setTimeout> | undefined>(undefined)

	const verifyUrlFromInput = (event: InputEvent) => {
		if (!(event.target instanceof HTMLInputElement)) return
		if (timeout.value) clearTimeout(timeout.value)
		const httpsRpc = event.target.value
		timeout.value = setTimeout(() => {
			rpcInfo.value = { ...rpcInfo, httpsRpc }
		}, 600)
	}


	useSignalEffect(() => {
		if (!inputRef.current) return
		if (asyncQueryRpc.value.state === 'rejected') {
			inputRef.current.setCustomValidity('RPC URL should be reachable')
			inputRef.current.reportValidity()
			return
		}
		inputRef.current.setCustomValidity('')
	})

	return <TextInput ref = { inputRef } label = 'RPC URL *' name = 'httpsRpc' defaultValue = { defaultValue } onInput = { verifyUrlFromInput } statusIcon = { <StatusIcon state = { asyncQueryRpc.value.state } /> } autofocus style = '--area: 1 / span 2' required />
}

export const StatusIcon = ({ state }: { state: AsyncStates }) => {
	switch (state) {
		case 'inactive': return <></>
		case 'pending': return <Spinner />
		case 'rejected': return <XMark />
		case 'resolved': return <Check />
	}
}

export const Spinner = () => (
	<svg class = 'spin' width = '1em' height = '1em' viewBox = '0 0 16 16' fill = 'none' xmlns = 'http://www.w3.org/2000/svg'>
		<circle cx = '8' cy = '8' r = '6.5' stroke = 'var(--text-color, currentColor)' stroke-opacity = '.5' stroke-width = '3' />
		<path d = 'M8 0a8 8 0 1 0 8 8h-3a5 5 0 1 1-5-5z' fill = 'var(--text-color, currentColor)' fill-opacity = '.4' />
	</svg>
)

export const Check = () => (
	<svg width = '1em' height = '1em' viewBox = '0 0 16 16' fill = 'none' xmlns = 'http://www.w3.org/2000/svg' >
		<path d = 'M15 3L5.64686 12.5524L1 7.84615' stroke = 'var(--positive-color, currentColor)' strokeWidth = { 2 } />
	</svg>
)

export const XMark = () => (
	<svg width = '1em' height = '1em' viewBox = '0 0 16 16' fill = 'none' xmlns = 'http://www.w3.org/2000/svg' >
		<path d = 'M15 1 8 8m0 0L1 1m7 7-7 7m7-7 7 7' stroke = 'var(--negative-color, currentColor)' strokeWidth = { 2 } />
	</svg>
)
