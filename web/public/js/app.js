var ethBalance = 0;
var akbBalance = 0;

(function(akbABI, ethBalance) {
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  console.log("provider", web3.currentProvider);
  function start() {
    var contractAddress = "0x99acd8758c818dad820b380731c37c0c3ef23163";
    var MyContract = web3.eth.contract(akbABI);
    var contractInstance = MyContract.at(contractAddress);
    console.log("contract", contractInstance);

    contractInstance.firstTimeOffer.call(
      (err, result) => {
        console.log("FTO error", err);
        console.log("First Time offer ", result);
        contractInstance.myBalance.call(
          (err, result) => {
            console.log("AKB Balance ", result);
          }
        );

        // web3.eth.getBalance(web3.eth.accounts[0], function(err, result) {
        //   console.log("ETH BALANCE", err, result)
        // })
      }
    );


  }

  start()
})(akbABI, ethBalance)
