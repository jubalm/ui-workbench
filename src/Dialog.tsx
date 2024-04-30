import { type Signal, useSignal } from "@preact/signals"
import { type ComponentChildren, createContext, type JSX } from "preact"
import { type Ref, useRef, useContext, useEffect, type EffectCallback } from "preact/hooks"

type DialogContext = {
  ref: Ref<HTMLDialogElement>
  disabled: Signal<boolean>
}

const DialogContext = createContext<DialogContext | undefined>(undefined)

type DialogCallbackPayload = {
  data: FormData
  closeDialog: () => void
  disabled: Signal<boolean>
  event: SubmitEvent
}

type DialogProps = {
  children: ComponentChildren
  onConfirm: (payload: DialogCallbackPayload) => void
}

export const Dialog = ({ children, onConfirm }: DialogProps) => {
  const ref = useRef<HTMLDialogElement>(null)
  const disabled = useSignal(false)

  const closeDialog = () => ref.current?.close()

  const setupEventListeners: EffectCallback = () => {
    const dialogElement = ref.current
    if (!dialogElement) return

    const runConfirmCallback = (event: SubmitEvent) => {
      if (!(event.submitter instanceof HTMLButtonElement)) return
      if (!(event.target instanceof HTMLFormElement)) return

      event.preventDefault()
      const data = new FormData(event.target)

      switch(event.submitter.value) {
        case 'dialog-confirm': {
          onConfirm({ data, closeDialog, disabled, event })
          break;
        }
        case 'dialog-reset': {
          event.target.reset()
          break;
        }
        default: {
          event.target.submit()
        }
      }
    }

    dialogElement.addEventListener('submit', runConfirmCallback)

    return () => {
      dialogElement.removeEventListener('submit', runConfirmCallback)
    }
  }

  useEffect(setupEventListeners, [ref.current])

  return <DialogContext.Provider value={ { ref, disabled } }>{ children }</DialogContext.Provider>
}

export const useDialog = () => {
  const context = useContext(DialogContext)
  if (!context) throw new Error('useDialog can only be used within children of Dialog')
  return context
}


export const DialogContent = ({ children }: { children: ComponentChildren }) => {
  const { ref } = useDialog()

  return (
    <dialog ref={ ref } class='dialog'>
      <form method='dialog'>{ children }</form>
    </dialog>
  )
}

type DialogOpenProps = Pick<JSX.HTMLAttributes<HTMLButtonElement>, 'class' | 'style'> & { children: ComponentChildren }

export const DialogOpen = ({ children, ...props}: DialogOpenProps) => {
  const { ref } = useDialog()
  return <button type='button' {...props} onClick={ () => ref.current?.showModal() }>{ children }</button>
}

type DialogConfirmProps = Pick<JSX.HTMLAttributes<HTMLButtonElement>, 'class' | 'style'> & { children: ComponentChildren }

export const DialogConfirm = ({ children, ...props }: DialogConfirmProps) => {
  const { disabled } = useDialog()
  return <button type='submit' {...props} value='dialog-confirm' disabled={disabled.value}>{ children }</button>
}

type DialogResetProps = Pick<JSX.HTMLAttributes<HTMLButtonElement>, 'class' | 'style'> & { children: ComponentChildren }

export const DialogReset = ({ children, ...props }: DialogResetProps) => {
  const { disabled } = useDialog()
  return <button type='submit' {...props} value='dialog-reset' disabled={disabled.value}>{ children }</button>
}
