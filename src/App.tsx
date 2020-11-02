import React, { useEffect } from 'react'

/** helper hook to create an array of refs with a generic T type */
function useRefs<T>(amount: number): React.RefObject<T>[] {
	return new Array(amount).fill(0).map(() => React.createRef<T>())
}

interface useTokenInputReturn {
	/** onChange fn to attach on each text input field */
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	/** fn to reset all uncontrolled text input fields */
	resetInputs: () => void
	/** fn to get the token value*/
	getInputsValue: () => string
	/** React ref to attach to each of the text input fields */
	tokenInputRefs: React.RefObject<HTMLInputElement>[]
}

function useTokenInput(otpLength: number): useTokenInputReturn {
	const tokenInputRefs = useRefs<HTMLInputElement>(otpLength)

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const id = +e.target.getAttribute('data-id')!
		const currentRef = tokenInputRefs[id].current!
		const regexp = /[^0-9]/gi
		if (regexp.test(e.target.value)) {
			currentRef.value = ''
			return
		}

		if (id < tokenInputRefs.length - 1 && e.target.value !== '') {
			currentRef.value = e.target.value
			const nextInputRef = tokenInputRefs[id + 1]
			nextInputRef?.current?.focus()
		}
	}

	const resetInputs = () => {
		tokenInputRefs.map((ref) => {
			if (ref?.current?.value) {
				ref.current.value = ''
			}
		})
	}

	const getInputsValue = () => {
		let value: string = ''
		tokenInputRefs.forEach((ref) => {
			value += ref.current?.value
		})
		return value
	}
	return {
		tokenInputRefs,
		getInputsValue,
		resetInputs,
		onChange,
	}
}

function App() {
	let { tokenInputRefs, onChange, resetInputs, getInputsValue } = useTokenInput(
		6
	)

	useEffect(() => {
		tokenInputRefs[0].current?.focus()
	}, [])

	return (
		<div>
			{tokenInputRefs.map((ref: any, index: number) => {
				return (
					<input
						type="text"
						ref={ref}
						key={index}
						data-id={index}
						onChange={onChange}
						maxLength={1}
					/>
				)
			})}
			<button onClick={resetInputs}>Reset</button>
			<button onClick={getInputsValue}>Submit</button>
		</div>
	)
}

export default App
