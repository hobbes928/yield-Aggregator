import Main from '../abis/Main.json' 
import Web3 from 'web3'


export const depsoit = async (dispatch) => {
    try{
        const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
        const networkID = await web3.eth.net.getId()
        await window.ethereum.enable()

        const accounts = await web3.eth.getAccounts()
        const main = new web3.eth.Contract(Main.abi, Main.networks[networkID].address)
        const ethdeposit = await web3.eth.getBalance(accounts[0])
        const daiborrow = '0'
        const amount = web3.utils.fromWei(ethdeposit, 'ether')
        
        console.log(Main)
        console.log(accounts[0])
        console.log(ethdeposit)
        console.log(amount)
        

        await main.methods.DepositDai(daiborrow).send({from: accounts[0]})
    .on('transactionHash', async (r) => {
        //update(dispatch)
        console.log('success')
      })
      .on('error',(error) => {
        console.error(error)
        window.alert(`There was an error!`)
      })
} catch (e){
      console.log('There was another error!`', e)
    }
}
    