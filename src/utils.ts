import { formatUnits } from "ethers";

export const wait = (milliseconds: number) => new Promise((resolve) => {
	setTimeout(resolve, milliseconds);
});

export const isAsync = (fn: object) => {
	return typeof fn === 'function' && fn.constructor.name === 'AsyncFunction'
}

export const bigintToRoundedPrettyDecimalString = (amount: bigint, decimals?: bigint, max = 4) => {
	const formatter = new Intl.NumberFormat('en-US', { maximumSignificantDigits: max, notation: 'compact' })

	const remapPrefixToMetric = (part: Intl.NumberFormatPart) => {
		// convert American prefix to Metric
		switch (part.value) {
			case 'K': return 'k'
			case 'B': return 'G'
			default: return part.value
		}
	}

	const floatValue = Number(formatUnits(amount, decimals))
	return formatter.formatToParts(floatValue).map(remapPrefixToMetric).filter(Boolean).join('')
}
