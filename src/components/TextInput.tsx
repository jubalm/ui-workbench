import { JSX } from 'preact/jsx-runtime'

type TextInputProps = JSX.HTMLAttributes<HTMLInputElement> & {
	label: string
	statusIcon?: JSX.Element
	style?: JSX.HTMLAttributes<HTMLDivElement>['style']
}

export const TextInput = ({ label, name, statusIcon, style, ...props }: TextInputProps) => {
	return (
		<label class = 'text-input' style = { style }>
			<input id={ name } name={ name } placeholder={ label } { ...props } />
			<span>{ label }</span>
			{ statusIcon }
		</label>
	)
}
