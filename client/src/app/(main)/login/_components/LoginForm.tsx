'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  brokerNames: string[];
}

const LoginForm: React.FC<LoginFormProps> = ({ brokerNames }) => {
  const [selectedBroker, setSelectedBroker] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginData = {
      broker: selectedBroker,
      password: password,
    };

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      console.log('Auth Response:', result);

      // Handle success or error based on the response
      if (response.ok) { 
        useRouter().push('/dashboard');
      } else {
        // Authentication failed
        console.error('Authentication failed:', result.message);
        // Show error message to the user
      }

    } catch (error) {
      console.error('Error during authentication:', error);
      // Handle network errors or other exceptions
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="broker-name">Broker Name:</label>
        <select
          id="broker-name"
          value={selectedBroker}
          onChange={(e) => setSelectedBroker(e.target.value)}
          required
        >
          <option value="">Select a Broker</option>
          {brokerNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;