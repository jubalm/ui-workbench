import { Dialog, DialogConfirm, DialogContent, DialogOpen } from './Dialog';
import './app.css'
import { NumberPreview } from './components/NumberPreview';
import { wait } from './utils';

type ConfirmAction = Parameters<typeof Dialog>[0]['onConfirm']

export function App() {
  return (
    <div class='previewer'>
      <NumberPreview />
    </div>
  )
}

export const AddRpcConnection = () => {
  const handleConfirm: ConfirmAction = async (dialog) => {
    console.log(dialog.data.get('hey'))
    dialog.disabled.value = true
    await wait(1000)
    dialog.disabled.value = false
    dialog.closeDialog()
  }

  return (

    <Dialog onConfirm={ handleConfirm }>
      <DialogContent>
        <RpcInfo />
        <br />
        <div class='dialog-actions'>
          <button type='submit' class='btn btn--ghost'>Cancel</button>
          <DialogConfirm class='btn btn--primary'>Confirm</DialogConfirm>
        </div>
      </DialogContent>
      <DialogOpen>Open</DialogOpen>
    </Dialog>
  )
}

const RpcInfo = () => {
  return (
    <dl class='metadata metadata--rpc'>
      <dt>RPC URL</dt>
      <dd>https://gateway.tenderly.co/public/sepolia</dd>
      <dt>Network</dt>
      <dd>Sepolia</dd>
      <dt>Currency Name</dt>
      <dd>Ethers</dd>
      <dt>Chain ID</dt>
      <dd>1 (0x1)</dd>
      <dt>Currency Ticker</dt>
      <dd>ETH</dd>
    </dl>
  )
}
