import './globals.css';
import React from 'react';
import PreferencesForm from '../components/PreferencesForm';

export default function PreferencesPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-8">Set your preferences</h1>
      <PreferencesForm />
    </div>
  );
} 