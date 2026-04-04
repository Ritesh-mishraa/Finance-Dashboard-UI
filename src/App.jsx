import React, { useState } from 'react'
import Layout from './components/Layout'
import Overview from './components/Overview'
import Transactions from './components/Transactions'

function App() {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <Overview />;
      case 'Transactions':
        return <Transactions />;
      case 'Insights':
        return <div className="p-6 text-gray-500">Insights Section (Phase 5)</div>;
      default:
        return <Overview />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  )
}

export default App

