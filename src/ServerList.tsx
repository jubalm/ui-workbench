export const Servers = () => {
  return (
    <div class='info-list info-list--servers'>
      <div class='info-list__item'>
        <div class='data-table'>
          <div>1</div>
          <div>Ethereum Mainnet</div>
          <div>ETH</div>
          <div>0x1</div>
          <div>https://some-domain.io</div>
          <div>Ether</div>
        </div>
        <button type='button' class='button button--ghost'>
          <IconExpand />
        </button>
      </div>
      <div class='info-list__item'>
        <div class='data-table'>
          <div>1</div>
          <div>Ethereum Mainnet</div>
          <div>ETH</div>
          <div>0x1</div>
          <div>https://some-domain.io</div>
          <div>Ether</div>
        </div>
        <button type='button' class='button button--ghost'>
          <IconExpand />
        </button>
      </div>
    </div>
  )
}
export const IconExpand = () => (
  <svg width={ 24 } height={ 24 } viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' alt='Expand'>
    <title>Expand</title>
    <path
      d='M12 16.9075L11.6464 17.2611L12 17.6146L12.3536 17.2611L12 16.9075ZM21.4614 6.73898L11.6464 16.554L12.3536 17.2611L22.1686 7.44608L21.4614 6.73898ZM12.3536 16.554L2.53855 6.73898L1.83144 7.44609L11.6464 17.2611L12.3536 16.554Z'
      fill='currentColor'
    />
  </svg>
)
