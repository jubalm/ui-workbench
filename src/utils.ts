import { useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { ethers } from "ethers";

export const wait = (milliseconds: number) => new Promise((resolve) => {
	setTimeout(resolve, milliseconds);
});

export const isAsync = (fn: object) => {
	return typeof fn === 'function' && fn.constructor.name === 'AsyncFunction'
}

export const bigintToNumberFormatParts = (amount: bigint, decimals = 18n, maximumSignificantDigits = 4) => {
	const floatValue = Number(ethers.formatUnits(amount, decimals))

	let formatterOptions: Intl.NumberFormatOptions = { useGrouping: false, maximumFractionDigits: 3 }

	// maintain accuracy if value is a fraction of 1 ex 0.00001
	if (floatValue % 1 === floatValue) formatterOptions.maximumSignificantDigits = maximumSignificantDigits

	// apply only compacting with prefixes for values >= 10k or values <= -10k
	if (Math.abs(floatValue) >= 1e4) {
		// formatterOptions.maximumSignificantDigits = maximumSignificantDigits
		formatterOptions = { minimumFractionDigits: 0, notation: 'compact' }
	}

	const formatter = new Intl.NumberFormat('en-US', formatterOptions)
	const parts = formatter.formatToParts(floatValue)
	const partsMap = new Map<Intl.NumberFormatPartTypes, string>()

	for (const part of parts) {
		if (part.type === 'compact') {
			// replace American format with Metric prefixes https://www.ibiblio.org/units/prefixes.html
			const prefix = part.value.replace('K', 'k').replace('B', 'G')
			partsMap.set(part.type, prefix)
			continue
		}
		partsMap.set(part.type, part.value)
	}

	return partsMap
}

export const bigintToRoundedPrettyDecimalString = (amount: bigint, decimals?: bigint, maximumSignificantDigits = 4) => {
	const numberParts = bigintToNumberFormatParts(amount, decimals, maximumSignificantDigits)
	let numberString = ''

	for (const [_type, value] of numberParts) numberString += value

	return numberString
}

export function useDebouncedSignal<T extends any>(defaultValue: T) {
	const initialValue = useSignal(defaultValue)
	const debouncedValue = useSignal(defaultValue)
	let timeout: number;

	useSignalEffect(() => {
		const newValue = initialValue.value
		window.clearTimeout(timeout);
		timeout = window.setTimeout(() => {
			debouncedValue.value = newValue
		}, 1000)
	})

	return { initialValue, debouncedValue }
}

export type RpcEntry = {
	readonly name: string;
	readonly chainId: bigint;
	readonly httpsRpc: string;
	readonly currencyName: string;
	readonly currencyTicker: string;
	readonly primary: boolean;
	readonly minimized: boolean;
	readonly weth: bigint;
}

