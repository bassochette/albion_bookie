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

  function getBalance(address _lookup) public view returns (uint balance) {
      return ownerToBalance[_lookup];
  }

  function myBalance() public view returns (uint balance) {
    return ownerToBalance[msg.sender];
  }

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
    require(ownerToBalance[msg.sender] == 0);
    require(currentSupply < limit);
    ownerToBalance[msg.sender] = 1000;
    currentSupply += 1000;
  }
}

contract GvgBet is Ownable, AKB {

  uint _tax = 1;

  struct Team {
    string id;
    string name;
  }

  struct MatchDetails {
    string matchId;
    Team teamA;
    Team teamB;
    string startTime;
    bool isOver;
    Team won;
    uint poolTeamA;
    uint poolTeamB;
    address[] bettersTeamA;
    address[] bettersTeamB;
    mapping (address => uint) betsTeamA;
    mapping (address => uint) betsTeamB;
  }

  mapping (string => MatchDetails) bets;

  event GvgOver(string matchId);
  event NewGvg(string matchId);
  event NewBet(address better, uint amount, string matchId, string TeamId);
  event BetWon(address indexed winner, string matchId);
  event BetLost(address indexed loser, string matchId);

  function placeBet (string matchId, string teamId, uint amount) external {
    MatchDetails storage gvg = bets[matchId];
    string storage teamAId = bets[matchId].teamA.id;
    string storage teamBId = bets[matchId].teamB.id;
    require( keccak256(bytes(teamAId)) == keccak256(bytes(teamId)) || keccak256(bytes(teamBId)) == keccak256(bytes(teamId)) );
    require( amount > 0 );
    require( ownerToBalance[msg.sender] >= amount + _tax);
    transfer(address(this), uint(amount + _tax));
    if (keccak256(bytes(teamAId)) == keccak256(bytes(teamId))) {
      if (gvg.betsTeamA[msg.sender] - amount != 0) {
        gvg.bettersTeamA.push(msg.sender);
      }
      gvg.betsTeamA[msg.sender] += amount;
      gvg.poolTeamA += amount;
      emit NewBet(msg.sender, amount, matchId, gvg.teamA.id);
    } else if (keccak256(bytes(teamId)) == keccak256(bytes(teamBId)) ) {
      if (gvg.betsTeamB[msg.sender] - amount != 0) {
        gvg.bettersTeamB.push(msg.sender);
      }
      gvg.betsTeamB[msg.sender] += amount;
      gvg.poolTeamB += amount;
      emit NewBet(msg.sender, amount, matchId, gvg.teamB.id);
    }

  }

  function _settleBetAWon(string matchId) private {
    MatchDetails storage gvg = bets[matchId];

    uint arrayLengthA = gvg.bettersTeamA.length;
    for (uint i=0; i<arrayLengthA; i++) {
      address _address = gvg.bettersTeamA[i];
      uint _amount = gvg.betsTeamA[_address];
      uint _share = _amount / gvg.poolTeamA;
      uint _winnings = gvg.poolTeamB / _share;

      _transfer(address(this), _address, _winnings);
      emit BetWon(_address, matchId);
    }

    uint arrayLengthB = gvg.bettersTeamB.length;
    for (uint j=0; j < arrayLengthB; j++) {
      emit BetLost(gvg.bettersTeamB[j], matchId);
    }


    gvg.isOver = true;
  }

  function _settleBetBWon(string matchId) private {
    MatchDetails storage gvg = bets[matchId];

    uint arrayLengthB = gvg.bettersTeamB.length;
    for (uint i=0; i<arrayLengthB; i++) {
      address _address = gvg.bettersTeamA[i];
      uint _amount = gvg.betsTeamB[_address];
      uint _share = _amount / gvg.poolTeamB;
      uint _winnings = gvg.poolTeamA / _share;

      _transfer(address(this), _address, _winnings);
      emit BetWon(_address, matchId);
    }

    uint arrayLengthA = gvg.bettersTeamA.length;
    for (uint j=0; j < arrayLengthA; j++) {
      emit BetLost(gvg.bettersTeamA[j], matchId);
    }

    gvg.isOver = true;
  }

  function closeBet (string matchId, string winner) public onlyOwner {
      MatchDetails storage gvg = bets[matchId];
      require(gvg.isOver == false);
      string storage teamAId = bets[matchId].teamA.id;
      string storage teamBId = bets[matchId].teamB.id;

      if (keccak256(bytes(winner)) == keccak256(bytes(teamAId))) {
        Team storage wonA = gvg.teamA;
        gvg.won = wonA;
        _settleBetAWon(matchId);
      }
      if (keccak256(bytes(winner)) == keccak256(bytes(teamBId))) {
        Team storage wonB = gvg.teamB;
        gvg.won = wonB;
        _settleBetBWon(matchId);
      }

      emit GvgOver(matchId);
  }

  function createBet (
    string gvgId,
    string teamAId,
    string teamAName,
    string teamBId,
    string teamBName,
    string startTime
  ) public onlyOwner {
    require(keccak256(bytes(bets[gvgId].matchId)) != keccak256(bytes(gvgId)));

    bets[gvgId] = MatchDetails(
      gvgId,
      Team(
          teamAId,
          teamAName
      ),
      Team(
        teamBId,
        teamBName
      ),
      startTime,
      false,
      Team("unkwown", "unkwown"),
      0,
      0,
      new address[](0),
      new address[](0)
    );
  }

  function setTax (uint amount) public onlyOwner {
    _tax = amount;
  }

}
