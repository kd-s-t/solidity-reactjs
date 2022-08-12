// Connect to Ganache Make sure you enter the address you noted earlier here //
web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
// getAccount() will get the first account from  ganache and will set it as defaultAccount for our contract operations ////
async function getAccount() {
    let accounts = await web3.eth.getAccounts();
    web3.eth.defaultAccount = accounts[0];
    console.log(web3.eth.defaultAccount + ' account detected');
    return web3.eth.defaultAccount;
}