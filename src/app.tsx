import { Dialog, DialogConfirm, DialogContent, DialogOpen, DialogReset } from './Dialog';
import './app.css'
import { bigintToRoundedPrettyDecimalString, wait } from './utils';

type ConfirmAction = Parameters<typeof Dialog>[0]['onConfirm']

export function App() {
  return (
    <div class='previewer'>
      <div style={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1em', color: '#ffffff80' } }>
        <dt>1000</dt>
        <dd><AbbreviatedValue num={ 1000n } decimals={ 0n } /></dd>
        <dt>1123456n</dt>
        <dd><AbbreviatedValue num={ 1123456n } decimals={ 0n } /></dd>
        <dt>1234567890n</dt>
        <dd><AbbreviatedValue num={ 1234567890n } decimals={ 0n } /></dd>
        <dt>123n</dt>
        <dd><AbbreviatedValue num={ 123n } /></dd>
      </div>
    </div>
  )
}

const AbbreviatedValue = ({ num, decimals = 18n }: { num: bigint, decimals?: bigint }) => {
  const floatString = bigintToRoundedPrettyDecimalString(num, decimals)
  const floatValue = Number.parseFloat(floatString)
  const [beforeDecimal, afterDecimal] = floatString.split('.');

  if ((floatValue % 1) === floatValue) {
    const firstNonZeroIndex = afterDecimal.search(/[^0]/);
    if (firstNonZeroIndex !== -1) {
      return (
          <>{ `${beforeDecimal}.` }<small>{ afterDecimal.slice(0, firstNonZeroIndex) }</small>{ afterDecimal.slice(firstNonZeroIndex) }</>
      )
    }
  }

  return <>{ floatString }</>
}

const AddRpcConnection = () => {
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
