// SPDX-License-Identifier: MIT;
pragma solidity ^0.5.16;

import '@aave/protocol-v2/contracts/interfaces/ILendingPoolAddressesProvider.sol';
import '@aave/protocol-v2/contracts/interfaces/ILendingPool.sol';
import 'compound-protocol/contracts/CErc20.sol';
import 'compound-protocol/contracts/CToken.sol';
import 'compound-protocol/tests/Contracts/ERC20.sol';

contract Main {
    
    //stores if address has deposited with Aave or Compound
    mapping (address => bool) public AaveDeposit;
    mapping (address => bool) public CompoundDeposit;
    
    
    //variables
    ILendingPoolAddressesProvider public provider;
    ILendingPool public lendingPool;
    address addressLendingPool;
    address DaiTokenAddress;
    
    
        
    //input variables
    uint256 CompoundAPY;
    uint256 AaveAPY ;
    uint256 ETHMantissa = 1000000000000000000;
    uint256 BlocksPerDay = 6570;
    uint256 DaysPerYear  = 365;
    uint16 referralCode= 0;
    
    
    //AAVE addresses in constructor
     constructor() public {
        
        provider = ILendingPoolAddressesProvider(address(0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5));
        addressLendingPool = provider.getLendingPool();
        lendingPool = ILendingPool(address(addressLendingPool));
        DaiTokenAddress = address(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    }
    
        // Compound addresses
        ERC20 underlying = ERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
        //cDai address for Compound
        CErc20 cToken = CErc20(0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643);

        
        
        function DepositDai(uint256 _amountDai) public payable {
            
            //APY calculation for Compound only could not find out for AAVE
            uint256 _rate = cToken.supplyRatePerBlock();
            CompoundAPY = ((((_rate / ETHMantissa * BlocksPerDay + 1) ** DaysPerYear - 1)) - 1) * 100;
            AaveAPY = 2;
            
            
            //check APY rates
            if (AaveAPY > CompoundAPY) {
                
                lendingPool.deposit(DaiTokenAddress, _amountDai, msg.sender, referralCode);
                AaveDeposit[msg.sender] = true;
                
            }
            
            else if (CompoundAPY > AaveAPY) {
                
                underlying.approve(address(cToken), _amountDai);
                cToken.mint(_amountDai);
                CompoundDeposit[msg.sender] = true;
            } 
            
            else {
                
                revert();
            }
            
        
            
        }
        
        function reBalance(uint256 _reBalanceAmount) public payable {
            
            //APY calculation for Compound only could not find out for AAVE
            uint256 _rate = cToken.supplyRatePerBlock();
            CompoundAPY = ((((_rate / ETHMantissa * BlocksPerDay + 1) ** DaysPerYear - 1)) - 1) * 100;
            AaveAPY = 2;
            
            //check APY rates
            if (AaveAPY > CompoundAPY) {
                
                //check to see if a deposit is made to compound under this address, if true then swap to aave
                require(CompoundDeposit[msg.sender] == true, "No AAVE rebalance needed");
                cToken.redeem(_reBalanceAmount);
                lendingPool.deposit(DaiTokenAddress, _reBalanceAmount, msg.sender, referralCode);
                CompoundDeposit[msg.sender] = false;
                AaveDeposit[msg.sender] = true;
                
                
            }
            
            //check APY rates
            else if (CompoundAPY > AaveAPY) {
                
                //check to see if a deposit is made to aave under this address, if true then swap to compound
                require(AaveDeposit[msg.sender] == true, "No Compound rebalance needed");
                lendingPool.withdraw(DaiTokenAddress, _reBalanceAmount, msg.sender);
                underlying.approve(address(cToken), _reBalanceAmount);
                cToken.mint(_reBalanceAmount);
                AaveDeposit[msg.sender] = false;
                CompoundDeposit[msg.sender] = true;
   
        } 
        
            else {
                
                revert();
            }
     
    
}

        function WithdrawDai(uint256 _withdrawDai) public payable returns(bool) {
            
            if (AaveDeposit[msg.sender] == true) {
                
                lendingPool.withdraw(DaiTokenAddress, _withdrawDai, msg.sender);
                return true;
            }
            
            else if (CompoundDeposit[msg.sender] == true) {
                
                cToken.redeem(_withdrawDai);
                return true;
   
        } 
            
            
        }







}

