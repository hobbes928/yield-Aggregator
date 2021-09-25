import Main from '../abis/Main.json' 
import React, { Component } from 'react';
import { depsoit } from './interactions';
import Web3 from 'web3';
import './App.css';

const fromWei = (str) => (+str / 10**18).toString()
const toWei = (str) => (+str * 10**18).toString()



class App extends Component {
  
  constructor(props) {
        super(props)
        this.state = {
          web3: '',
          account: '',
          ethBalance: '0',
          daiBalance: '0',
          aWETHBalances: '0',
          totalETHDeposits: '0',
          totalDAIBorrows: '0',
          safeAmountDAIBorrow: 0,
          daiETHPrice: '0',
          ethDeposit: '0',
          aaveDeFi: '',
          aaveDeFiAddress: '',
          dai: '',
          loading: false,
    }
        
        this.DepositDai = this.DepositDai.bind(this);
        this.reBalance = this.reBalance.bind(this)
        this.WithdrawDai = this.WithdrawDai.bind(this)
      }
  
  
  
  
  async  componentWillMount() {
  
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

    async loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
          this.setState({web3: window.web3})
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
          this.setState({web3: window.web3})
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      }

  async loadBlockchainData() {

        const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
        // Load account
        const networkId = await web3.eth.net.getId()
        await window.ethereum.enable()
        const accounts = await web3.eth.getAccounts()
       
        this.setState({ account: accounts[0] })
        // Network ID
        
    
        const networkData = Main.networks[networkId]
        if(networkData) {
          // set connection to contract in state
          const main = new web3.eth.Contract(Main.abi, networkData.address)
          await this.setState({main: networkData.address })
          await this.setState({ main })
          // set loading false after getting from blockchain
          await this.setState({ loading: false})
        } else {
          window.alert('Main contract not deployed to detected network.')
        }    
    }
  

    async DepositDai() {
        console.log('Deposit DAI')
        const daiAmount = 0
        await this.setState({loading: true})
        this.state.main.methods.DepositDai(daiAmount).send({ from: this.state.account, value: daiAmount }).on('transactionHash', (hash) => {
          this.setState(preveState => ({loading:false}))
          window.location.reload();
          console.log('Successfully completed depsoting DAI')
        })
     

      }

      async reBalance() {
          console.log('reBalance DAI')
          const daiAmount = 0
          await this.setState({loading: true})
          this.state.main.methods.reBalance(daiAmount).send({ from: this.state.account, value: daiAmount }).on('transactionHash', (hash) => {
            this.setState(preveState => ({loading:false}))
            window.location.reload();
            console.log('Successfully reBalanced')
          })
       
  
        }

        async WithdrawDai() {
            console.log('Withdraw DAI')
            const daiAmount = 0
            await this.setState({loading: true})
            this.state.main.methods.WithdrawDai(daiAmount).send({ from: this.state.account, value: daiAmount }).on('transactionHash', (hash) => {
              this.setState(preveState => ({loading:false}))
              window.location.reload();
              console.log('Successfully WithdrawDai')
            })
         
    
          }
  

  

  

     render() {
       return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dapp University
          </a>
        </nav>

        
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Yield Aggregator</h1>
              </div>
            </main>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-sm" onClick={this.DepositDai}>Deposit</button>  &nbsp;&nbsp;
        <button type="submit" className="btn btn-primary btn-sm" onClick={this.reBalance}>Rebalance</button> &nbsp;&nbsp;
        <button type="submit" className="btn btn-primary btn-sm" onClick={this.WithdrawDai}>Withdraw</button> 

        
        </div>

        
    );
  }

}




export default App;