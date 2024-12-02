// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract OTC{
    //Deposit ethers : done
    //whitelist map to give accrss to withdraw eth  : done
    //evemts and emits : done
    //view fn to get the dATA : done

    mapping (address => uint256)public deposits;
    mapping  (address => bool) public  isWhitelisted;
    event deposited(address indexed from ,address to,uint256 amount);
    event Withdrawn(address indexed from ,address to,uint256 amount);
    event Whitelisted(address indexed by ,address to);
    uint256 public txCount;
    
    struct TxHistory{
        uint8 txType; // 1==> deposit 2==>  withdraw
        address from;
        address to;//who do the action
        uint256 amount; //eth value to deposit or withdraw
    }
    mapping(uint256=>TxHistory) public TxHistoryList;

    function depost(uint256 _amt) public  payable {
        require(_amt >0 && _amt == msg.value,"ETH Amount Error");
        deposits[msg.sender]+= _amt;
        isWhitelisted[msg.sender] = true;
        // appending to txHistory
        TxHistoryList[txCount] = TxHistory(1,msg.sender,address(this),_amt);
        txCount++;
        emit deposited(msg.sender, address(this),_amt);
    }

    function whitelistAddr(address _addr) external  {
        require(deposits[msg.sender]>0,"OTC : You dont have enough finds");
        isWhitelisted[_addr] = true;
        emit Whitelisted(msg.sender, _addr);
    }
    function Withdraw(uint256 _amt,address _to ) external {
        require(isWhitelisted[msg.sender]== true, "Not Whitlisted");
        deposits[_to]-= _amt;
        TxHistoryList[txCount] = TxHistory(2,msg.sender,_to,_amt);
        txCount++;
        payable(_to).transfer(_amt);
        emit Withdrawn(msg.sender,_to , _amt);
    }
    


}