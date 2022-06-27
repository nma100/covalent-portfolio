import React from 'react';
import Chain from './Chain';
import * as Covalent from './Covalent';
import 'bootstrap-icons/font/bootstrap-icons.scss';
import { ethers } from "ethers";
// eslint-disable-next-line 
import * as Bootstrap from 'bootstrap';

const MODE = { SEARCH: 0, RESULT: 1};
const CHAIN_LIST = [
  new Chain('1', 'Ethereum', 18, 'https://etherscan.io', '/address/{0}', '/tx/{0}'),
  new Chain('56', 'Binance', 18, 'https://bscscan.com', '/address/{0}', '/tx/{0}'),
  new Chain('137', 'Polygon', 18, 'https://polygonscan.com', '/address/{0}', '/tx/{0}'),
  new Chain('43114', 'Avalanche', 18, 'https://avascan.info', '/blockchain/c/address/{0}', '/blockchain/c/tx/{0}'),
  new Chain('42161', 'Arbitrum', 18, 'https://arbiscan.com', '/address/{0}', '/tx/{0}'),
  new Chain('1284', 'Moonbeam', 18, 'https://moonscan.io/', '/address/{0}', '/tx/{0}')
];
const NO_URL = '#';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.state = { 
      tokens: [], 
      transactions: [], 
      mode: MODE.SEARCH, 
      searching: false, 
      error: '' 
    };
  }

  async search(e) {
    e.preventDefault();

    let chain = document.getElementById('select-chain').value;
    let address = document.getElementById('input-address').value;
    if (!address) return;

    this.setState({  
      mode: MODE.SEARCH, 
      chainId: chain, 
      searching: true, 
      error: '' 
    });

    let promise1 = Covalent.getTokenBalances(chain, address);
    let promise2 = Covalent.getTransactions(chain, address);

    Promise.all([promise1, promise2]).then(values => {
      console.log(values[0].data)
      this.setState({ 
        tokens: values[0].data.items, 
        transactions: values[1].data.items,
        mode: MODE.RESULT });
    })
    .catch(e => {
      this.setState({ error: e.toString() });
    })
    .finally(() => {
      this.setState({ searching: false });
    });

  }

  onImageError(index) {
    let noLogo = '<i class="bi bi-question-circle" style="font-size: 1.4rem;"></i>';
    document.getElementById('token-logo-' + index).innerHTML = noLogo;
  }

  minimize(value, len = 5, max = 8) {
    if (value.length <= max) return value;
    return value.substring(0, len) + '...' + value.substring(value.length-len);
  }

  status(success) {
    return success ? 
        <span className="badge bg-success">Success</span> 
      : <span className="badge bg-danger">Failure</span>;
  }

  round(value, precision = 5) {
    return Number(value).toFixed(precision);
  }

  balance(value, decimals) {
    let bigNumberValue = ethers.utils.parseUnits(value, 0);
    return this.round(ethers.utils.formatUnits(bigNumberValue, decimals), 3);
  }

  fees(chainId, value) {
    let chain = CHAIN_LIST.find(c => c.id === chainId);
    let bigNumberValue = ethers.utils.parseUnits(value, 0);
    return this.round(ethers.utils.formatUnits(bigNumberValue, chain.decimal));
  }

  scanAddrUrl(chainId, address) {
    let chain = CHAIN_LIST.find(c => c.id === chainId);
    if (chain) {
      return String.format(chain.scanBase + chain.scanAddrUri, address);
    }
    return NO_URL;
  }

  scanTxUrl(chainId, tx) {
    let chain = CHAIN_LIST.find(c => c.id === chainId);
    if (chain) {
      return String.format(chain.scanBase + chain.scanTxUri, tx);
    }
    return NO_URL;
  }

  render() {
    return (
      <div className="container py-5">
        
        <h1 id='title' className='display-4 mb-5'><i className="bi bi-card-list"></i> Crypto Portfolio</h1>
        <form onSubmit={this.search} className="mb-5">
          <div className="mb-3">
            <input type="text" id="input-address" className="form-control form-control-lg" placeholder="Wallet address" autoComplete="off"/>
          </div>
          <div className="mb-4">
            <label htmlFor="select-chain" className="form-label">Blockchain</label>
            <select id="select-chain" className="form-select" style={{ cursor: 'pointer' }}>
            { CHAIN_LIST.map(chain => 
              <option key={chain.id} value={chain.id}>{chain.name}</option>
            ) }
            </select>
          </div>
          <button type="submit" className="btn btn-dark text-light border me-3"><i className="bi bi-search me-2"></i>Show Portfolio</button>

          {this.state.searching &&
          <div className="spinner-border spinner-border-sm text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          }
        </form>

        {this.state.mode === MODE.RESULT &&
        <>
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button className="nav-link active" id="nav-wallet-tab" data-bs-toggle="tab" data-bs-target="#nav-wallet" type="button" role="tab" aria-controls="nav-wallet" aria-selected="true">Assets</button>
            <button className="nav-link" id="nav-tx-tab" data-bs-toggle="tab" data-bs-target="#nav-tx" type="button" role="tab" aria-controls="nav-tx" aria-selected="false">Transactions</button>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div className="tab-pane fade show active" id="nav-wallet" role="tabpanel" aria-labelledby="nav-wallet-tab" tabIndex="0">
              <div className="table-responsive">
                <table className="table table-dark table-striped">
                  <tbody>
                    { this.state.tokens.map((token, index) => 
                      <tr key={index}>
                        <td id={ 'token-logo-' + index } className="text-center" style={{ width: '2.5rem' }}>
                          <img className="img-fluid" 
                                style={{ width: '1.5rem', height: '1.5rem'  }} 
                                src={ token.logo_url }
                                onError={ () => this.onImageError(index) }
                                alt="" />
                        </td>
                        <td style={{ width: '10rem' }}>{ token.contract_name }</td>
                        <td style={{ width: '10rem' }}>${ this.round(token.quote, 2) }</td>
                        <td className='text-white-50'>{ this.balance(token.balance, token.contract_decimals) } { token.contract_ticker_symbol }</td>
                      </tr>
                      ) }
                  </tbody>
                </table>
              </div>
          </div>
          <div className="tab-pane fade" id="nav-tx" role="tabpanel" aria-labelledby="nav-tx-tab" tabIndex="1">
            <div className="table-responsive">
                <table className="table table-dark table-striped">
                  <thead>
                    <tr>
                      <th scope="col" style={{ width: '10rem' }}>Timestamp</th>
                      <th scope="col">Status</th>
                      <th scope="col">Tx Hash</th>
                      <th scope="col">From</th>
                      <th scope="col">To</th>
                      <th scope="col">Fees</th>
                    </tr>
                  </thead>
                  <tbody>
                  { this.state.transactions.map(tx => 
                      <tr key={tx.tx_hash }>
                        <td><small className='text-white-50'>{ new Date(tx.block_signed_at).toLocaleString() }</small></td>
                        <td>{ this.status( tx.successful ) }</td>
                        <td><a className="text-white" href={ this.scanTxUrl( this.state.chainId, tx.tx_hash ) }>{ this.minimize( tx.tx_hash )}</a></td>
                        <td>{ tx.from_address_label} <a className="text-white" href={ this.scanAddrUrl( this.state.chainId, tx.from_address ) }>{ this.minimize( tx.from_address ) }</a></td>
                        <td>{ tx.to_address_label}  <a className="text-white" href={ this.scanAddrUrl( this.state.chainId, tx.to_address ) }>{ this.minimize( tx.to_address ) }</a></td>
                        <td><small className='text-white-50'>{ this.fees( this.state.chainId, tx.fees_paid) }</small></td>
                      </tr>
                    ) }
                  </tbody>
                </table>
              </div>
          </div>
        </div>
        </>
        }
        <p className='text-danger'>{ this.state.error }</p>
        <hr/>
        <p className='text-center text-white-50 fs-4 pt-2 pb-4'>Powered by : <a href="https://www.covalenthq.com/" className='text-white'>Covalent</a></p>
      </div>
    );
  }

}

export default App;
