pragma solidity ^0.4.19;
import "./Ownable.sol";

contract AKB is Ownable {

  string symbol = "AKB";
  uint limit = 100000000000;
  uint decimals = 18;
  uint rate = 1 wei;
  uint ratedVolume = 100;
  uint currentSupply = 0;

  mapping (address => uint) ownerToBalance;
  event Transfer (address _from, address _to, uint amount);

  function _transfer(address _from, address _to, uint amount) internal {
    ownerToBalance[_from] -= amount;
    ownerToBalance[_to] += amount;
    emit Transfer(_from, _to, amount);
  }

  function transfer(address _to, uint _amount) public {
    require(ownerToBalance[msg.sender] >= _amount);
    _transfer(msg.sender, _to, _amount);
  }

  function setRate(uint _rate) external onlyOwner {
    rate = _rate;
  }

  function buy(uint amount) public payable {
    require(msg.value == ((amount/ratedVolume)*rate));
    require(currentSupply < limit);
    ownerToBalance[msg.sender] += amount;
    currentSupply += amount;
  }

  function firstTimeOffer() public {
    require(ownerToBalance[msg.sender] > 0);
    require(currentSupply < limit);
    ownerToBalance[msg.sender] = 1000;
    currentSupply += 1000;
  }
}
