import React from 'react';
import * as Covalent from './Covalent.js';
import * as Bootstrap from 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.scss';
import { ethers } from "ethers";

const CHAIN_ID = 1;
const SCAN_URL = 'https://etherscan.io/';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.state = { tokenList: [], transactions: [] };
  }

  async search(e) {
    e.preventDefault();

    let address = document.getElementById('input-address').value;
    if (!address) return;

    Covalent.getTokenBalances(CHAIN_ID, address).then(balances => {
      this.setState({tokenList: balances.data.items });
    })

    Covalent.getTransactions(CHAIN_ID, address).then(tx => {
      console.log('tx', tx);
      this.setState({transactions: tx.data.items });
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
    return success ? <span class="badge bg-success">Success</span> : <span class="badge bg-danger">Failure</span>;
  }

  render() {
    return (
      <div className="container py-5">
        <h1 className='mb-4'>My Portfolio with Covalent</h1>
        <form onSubmit={this.search} className="mb-4">
          <div className="mb-3">
            <input type="text" id="input-address" className="form-control" placeholder="Enter portfolio address" autoComplete="off"/>
          </div>
          <button type="submit" className="btn btn-primary"><i className="bi bi-search me-2"></i>Search</button>
        </form>

        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button className="nav-link active" id="nav-wallet-tab" data-bs-toggle="tab" data-bs-target="#nav-wallet" type="button" role="tab" aria-controls="nav-wallet" aria-selected="true">Assets</button>
            <button className="nav-link" id="nav-tx-tab" data-bs-toggle="tab" data-bs-target="#nav-tx" type="button" role="tab" aria-controls="nav-tx" aria-selected="false">Transactions</button>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div className="tab-pane fade show active" id="nav-wallet" role="tabpanel" aria-labelledby="nav-wallet-tab" tabIndex="0">
              <div className="table-responsive">
                <table className="table">
                  <tbody>
                    { this.state.tokenList.map((token, index) => 
                      <tr key={index}>
                        <td id={ 'token-logo-' + index } className="text-center" style={{ width: '2.5rem' }}>
                          <img className="img-fluid" 
                                style={{ width: '1.5rem', height: '1.5rem'  }} 
                                src={ token.logo_url }
                                onError={ () => this.onImageError(index) }
                                alt="" />
                        </td>
                        <td className="fw-bold" style={{ width: '4rem' }}>{ token.contract_ticker_symbol }</td>
                        <td style={{ width: '12rem' }}>{ token.contract_name }</td>
                        <td className='text-muted'>${ token.quote }</td>
                      </tr>
                      ) }
                  </tbody>
                </table>
              </div>
          </div>
          <div className="tab-pane fade" id="nav-tx" role="tabpanel" aria-labelledby="nav-tx-tab" tabIndex="1">
            <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Timestamp</th>
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
                        <td>{ new Date(tx.block_signed_at).toLocaleString() }</td>
                        <td>{ this.status( tx.successful ) }</td>
                        <td><a href={ SCAN_URL + 'tx/' + tx.tx_hash }>{ this.minimize( tx.tx_hash )}</a></td>
                        <td>{ tx.from_address_label} <a href={ SCAN_URL + 'address/' + tx.from_address }>{ this.minimize( tx.from_address ) }</a></td>
                        <td>{ tx.to_address_label}  <a href={ SCAN_URL + 'address/' + tx.to_address }>{ this.minimize( tx.to_address ) }</a></td>
                        <td>{ ethers.utils.formatUnits(ethers.utils.parseUnits(tx.fees_paid, 0)) }</td>
                      </tr>
                    ) }
                  </tbody>
                </table>
              </div>
          </div>
        </div>

      </div>
    );
  }

}

export default App;
