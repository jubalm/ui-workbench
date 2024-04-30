import { type ComponentChildren  } from 'preact'
import { useComputed, useSignal } from '@preact/signals'
import { useRef } from 'preact/hooks'
import { useQueryRpc } from './components/RpcFetcher'
import { AsyncStates } from './lib/preact.utils'
import { TextInput } from './components/TextInput'
import { RpcEntry } from './utils'
import { CHAIN_NAMES } from './lib/chain-names.utils'

type ParsedData = { success: true, value: RpcEntry } | { message: string }

const parseData = (entry: RpcEntry) => {
	return { success: true, value: entry } satisfies ParsedData
}

export const ConfigureRpcConnection = ({ rpcInfo }: { rpcInfo?: RpcEntry | undefined }) => {
	const modalRef = useRef<HTMLDialogElement>(null)
	const formError = useSignal<string | undefined>(undefined)
	const { queryValue, setRpcUrlToQuery } = useQueryRpc()

	const verifyRpcInfoFromInput = (event: InputEvent) => {
		if (!(event.target instanceof HTMLInputElement)) return
		setRpcUrlToQuery(event.target.value)
	}

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
			console.log('form??', event.target)
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
	const clearErrors = () => { formError.value = undefined }

	const isFormBusy = useComputed(() => queryValue.value.state === 'pending')

	const computedChainInfo = useComputed(() => {
		if (queryValue.value.state !== 'resolved') return undefined

		// get chain info from dictionary
		if (!queryValue.value.value) return undefined

		return {
			chainId: BigInt(queryValue.value.value.result),
			networkName: 'Placeholder name',
			currencyName: 'Ether',
			currencyTicker: 'ETH',
		}
	})

	const getChainNameFromId = (chainId: bigint) => {
		return CHAIN_NAMES.get(chainId.toString())
	}

	return (
		<>
			<button type = 'button' onClick = { showSetupInterface } class = 'btn btn--outline'>{ rpcInfo ? 'Edit' : '+ New RPC Connection'}</button>
			<dialog class = 'dialog' ref = { modalRef } onSubmit = { verifyInputsAndSave } >
				<form method = 'dialog' class = 'grid' style = '--gap-y: 1.5rem'>
					<header class = 'grid' style = '--grid-cols: 1fr auto'>
						<span style = { { fontWeight: 'bold', color: 'white' } }>Configure RPC Connection</span>
						<button type = 'submit' formNoValidate value = 'cancel' class = 'btn btn--ghost' aria-label = 'close'>
							<span class = 'button-icon' style = { { fontSize: '1.5em' } }>&times;</span>
						</button>
					</header>

					<main class = 'grid' style = '--gap-y: 0.5rem'>
						<p>Interceptor will automatically verify the RPC URL you provide and attempt to fill relevant information. Feel free to adjust the pre-populated details to your preference.</p>

						<div class = 'grid' style = '--grid-cols: 1fr 1fr; --gap-x: 1rem; --gap-y: 0.5rem;' >
							<TextInput label = 'RPC URL *' name = 'httpsRpc' defaultValue = { rpcInfo?.httpsRpc } onInput = { verifyRpcInfoFromInput } statusIcon = { <StatusIcon state = { queryValue.value.state } /> } autofocus style = '--area: 1 / span 2' required />
							<TextInput label = 'Label *' name = 'name' required defaultValue = { rpcInfo?.name } onInput = { clearErrors } style = '--area: 2 / span 2' />
							<TextInput label = 'Network Name *' name = 'network' defaultValue = { rpcInfo?.chainId ? getChainNameFromId(rpcInfo.chainId) : undefined } onInput = { clearErrors } disabled = { isFormBusy.value } required />
							<TextInput label = 'Chain ID *' name = 'chainId' defaultValue = { computedChainInfo.value?.chainId.toString() || rpcInfo?.chainId.toString() } required onInput = { clearErrors } readOnly />
							<TextInput label = 'Currency Name *' name = 'currencyName' defaultValue = { rpcInfo?.currencyName } onInput = { clearErrors } disabled = { isFormBusy.value } required />
							<TextInput label = 'Currency Ticker *' name = 'currencyTicker' defaultValue = { rpcInfo?.currencyTicker } onInput = { clearErrors } disabled = { isFormBusy.value } required />
						</div>

						<p style = '--text-color: gray'><small>* Fields marked with an asterisk (*) are required.</small></p>
						{ formError.value ? <ErrorInfo>{ formError.value }</ErrorInfo> : <></> }
					</main>

					<footer>
						<div class = 'actions' style = '--btn-text-size: 0.9rem'>
							<button type = 'submit' formNoValidate value = 'cancel' class = 'btn btn--ghost'>Cancel</button>
							<button type = 'submit' value = 'proceed' class = 'btn btn--primary' disabled = { isFormBusy.value }>Save RPC Connection</button>
						</div>
					</footer>
				</form>
			</dialog>
		</>
	)
}

export const StatusIcon = ({ state }: { state: AsyncStates }) => {
	switch (state) {
		case 'inactive': return <></>
		case 'pending': return <Spinner />
		case 'rejected': return <XMark />
		case 'resolved': return <Check />
	}
}


const ErrorInfo = ({ children }: { children: ComponentChildren }) => {
	return (
		<div style = { { background: 'var(--negative-color)', color: 'white', padding: '8px 16px', borderRadius: 6 } }>{ children }</div>
	)
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
