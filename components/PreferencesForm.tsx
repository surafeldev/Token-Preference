'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Image from 'next/image';
import CustomSelect from './CustomSelect';

interface Address {
  address: string;
  chain: string;
  isPrimary: boolean;
}

interface ChainFormat {
  id: string;
  name: string;
  logo: string;
  addressPrefix: string;
  validateAddress: (address: string) => boolean;
}

interface Token {
  symbol: string;
  address: string;
  logo: string;
}

export default function PreferencesForm() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');

  const chainFormats: ChainFormat[] = [
    {
      id: 'ethereum-mainnet',
      name: 'Ethereum Mainnet',
      logo: '/images/ethereum.svg',
      addressPrefix: '0x',
      validateAddress: (address: string) => {
        try {
          ethers.getAddress(address);
          return true;
        } catch {
          return false;
        }
      }
    },
    {
      id: 'base-testnet',
      name: 'Base Testnet',
      logo: '/images/base.svg',
      addressPrefix: '0x',
      validateAddress: (address: string) => {
        try {
          ethers.getAddress(address);
          return true;
        } catch {
          return false;
        }
      }
    },
    {
      id: 'solana-testnet',
      name: 'Solana Testnet',
      logo: '/images/solana.svg',
      addressPrefix: '',
      validateAddress: (address: string) => {
        // Solana addresses are 32-44 characters long base58 strings
        return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
      }
    },
    {
      id: 'aptos-testnet',
      name: 'Aptos Testnet',
      logo: '/images/aptos.svg',
      addressPrefix: '0x',
      validateAddress: (address: string) => {
        // Aptos addresses are 0x followed by 64 hex characters
        return /^0x[0-9a-fA-F]{64}$/.test(address);
      }
    },
    {
      id: 'sui-testnet',
      name: 'Sui Testnet',
      logo: '/images/sui.svg',
      addressPrefix: '0x',
      validateAddress: (address: string) => {
        // Sui addresses are 0x followed by 64 hex characters
        return /^0x[0-9a-fA-F]{64}$/.test(address);
      }
    }
  ];

  const [selectedAddressChain, setSelectedAddressChain] = useState(chainFormats[0].id);

  const tokens: Token[] = [
    { 
      symbol: 'ETH', 
      address: '0x0000000000000000000000000000000000000000',
      logo: '/images/eth.svg'
    },
    { 
      symbol: 'USDC', 
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      logo: '/images/usdc.svg'
    },
    { 
      symbol: 'USDT', 
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      logo: '/images/usdt.svg'
    }
  ];

  // Add useEffect to handle wallet changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        handleDisconnect();
      } else {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      // Reload the page when chain changes
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Check if already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setWalletConnected(true);
        } else {
          handleDisconnect();
        }
      }
    };

    checkConnection();

    // Cleanup listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleDisconnect = () => {
    // Reset all states
    setAccount('');
    setWalletConnected(false);
    setAddresses([]);
    setNewAddress('');
    setSelectedChain('');
    setSelectedToken('');
  };

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        // First disconnect if already connected
        handleDisconnect();
        
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setAccount(accounts[0]);
        setWalletConnected(true);
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      handleDisconnect();
    }
  };

  const disconnectWallet = async () => {
    try {
      handleDisconnect();
      
      // For Phantom wallet
      if (window.solana) {
        await window.solana.disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const handleAddAddress = () => {
    if (newAddress) {
      const chainFormat = chainFormats.find(cf => cf.id === selectedAddressChain);
      if (!chainFormat) {
        alert('Please select a valid chain for the address');
        return;
      }

      const cleanAddress = newAddress.trim();

      try {
        if (!chainFormat.validateAddress(cleanAddress)) {
          throw new Error(`Invalid ${chainFormat.name} address format`);
        }

        // Make this address primary if it's the first one
        const isPrimary = addresses.length === 0;

        setAddresses([...addresses, { 
          address: cleanAddress,
          chain: selectedAddressChain,
          isPrimary
        }]);
        setNewAddress('');
      } catch (error) {
        alert(`Please enter a valid ${chainFormat.name} address`);
      }
    }
  };

  const handleRemoveAddress = (indexToRemove: number) => {
    setAddresses(addresses.filter((_, index) => index !== indexToRemove));
  };

  const setPrimaryAddress = (index: number) => {
    setAddresses(addresses.map((addr, i) => ({
      ...addr,
      isPrimary: i === index
    })));
  };

  const savePreferences = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (addresses.length === 0) {
      alert('Please add at least one address');
      return;
    }

    if (!selectedChain) {
      alert('Please select a chain');
      return;
    }

    if (!selectedToken) {
      alert('Please select a token');
      return;
    }

    try {
      // Here we would call the smart contract to save preferences
      console.log('Saving preferences:', {
        addresses: addresses.map(a => a.address),
        chain: selectedChain,
        token: selectedToken
      });
      
      // Mock contract call for now
      alert('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Error saving preferences. Please try again.');
    }
  };

  return (
    <div className="form-container">
      {!walletConnected ? (
        <button onClick={connectWallet} className="button">
          Connect Wallet
        </button>
      ) : (
        <>
          <div className="wallet-header">
            <div className="connected-status">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </div>
            <button 
              onClick={disconnectWallet} 
              className="disconnect-button"
            >
              Disconnect
            </button>
          </div>
          
          <div className="info-box">
            <h3>How it works:</h3>
            <ol>
              <li>Add your receiving addresses for different chains</li>
              <li>Set one address as your primary destination</li>
              <li>Choose your preferred token (ETH, USDC, or USDT)</li>
              <li>When someone sends you tokens on Ethereum mainnet, they'll automatically be bridged to your primary address in your preferred token</li>
            </ol>
          </div>

          <div className="input-group">
            <label className="input-label">Add Receiving Address</label>
            <div className="address-input-container">
              <CustomSelect
                options={chainFormats.map(cf => ({
                  value: cf.id,
                  label: cf.name,
                  logo: cf.logo
                }))}
                value={selectedAddressChain}
                onChange={setSelectedAddressChain}
                placeholder="Select chain"
              />
              <input
                type="text"
                className="input-field"
                placeholder={`Enter ${chainFormats.find(cf => cf.id === selectedAddressChain)?.name} address`}
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </div>
            <button onClick={handleAddAddress} className="button">
              Add Address
            </button>
          </div>

          <div className="input-group">
            <label className="input-label">Your Receiving Addresses</label>
            {addresses.map((addr, index) => (
              <div key={index} className="address-display">
                <div className="address-chain">
                  <Image
                    src={chainFormats.find(cf => cf.id === addr.chain)?.logo || ''}
                    alt={addr.chain}
                    width={20}
                    height={20}
                    className="chain-icon"
                  />
                  <span>{chainFormats.find(cf => cf.id === addr.chain)?.name}</span>
                </div>
                <span className="address-text">{addr.address}</span>
                <div className="address-actions">
                  {!addr.isPrimary && (
                    <button
                      onClick={() => setPrimaryAddress(index)}
                      className="primary-button"
                    >
                      Set as Primary
                    </button>
                  )}
                  {addr.isPrimary && (
                    <span className="primary-badge">Primary</span>
                  )}
                  <button
                    onClick={() => handleRemoveAddress(index)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="input-group">
            <label className="input-label">
              Choose your preferred receiving token
            </label>
            <CustomSelect
              options={tokens.map(token => ({
                value: token.symbol,
                label: token.symbol,
                logo: token.logo
              }))}
              value={selectedToken}
              onChange={setSelectedToken}
              placeholder="Select token"
            />
          </div>

          <button 
            className="button" 
            style={{ width: '100%' }}
            onClick={savePreferences}
            disabled={!addresses.some(addr => addr.isPrimary)}
          >
            Save your preferences on chain
          </button>
        </>
      )}
    </div>
  );
} 