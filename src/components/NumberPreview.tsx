import { AbbreviatedValue } from "./AbbreviatedValue"

export const NumberPreview = () => {
  return (
    <div style={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1em', color: '#ffffff80' } }>
      <dt>1001</dt>
      <dd><AbbreviatedValue amount={ 1001n } decimals={ 0n } /></dd>
      <dt>-1001</dt>
      <dd><AbbreviatedValue amount={ -1001n } decimals={ 0n } /></dd>
      <dt>1000.567890</dt>
      <dd><AbbreviatedValue amount={ 1000567890n } decimals={ 6n } /></dd>
      <dt>-1234567890n</dt>
      <dd><AbbreviatedValue amount={ -1234567890n } decimals={18n} /></dd>
      <dt>10001</dt>
      <dd><AbbreviatedValue amount={ 10001n } decimals={ 0n } /></dd>
      <dt>1123456n</dt>
      <dd><AbbreviatedValue amount={ 1123456n } decimals={ 0n } /></dd>
      <dt>1234567890n</dt>
      <dd><AbbreviatedValue amount={ 1234567890n } decimals={ 0n } /></dd>
      <dt>1234567890n</dt>
      <dd><AbbreviatedValue amount={ 1234567890n } /></dd>
      <dt>10001n (18)</dt>
      <dd><AbbreviatedValue amount={ 10001n } /></dd>
      <dt>-10000n (18)</dt>
      <dd><AbbreviatedValue amount={ -10000n } decimals={0n} /></dd>
      <dt>-10001n (18)</dt>
      <dd><AbbreviatedValue amount={ -10001n } decimals={0n} /></dd>
    </div>
  )
}
