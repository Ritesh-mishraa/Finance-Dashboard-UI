import React, { useState } from 'react'
import Layout from './components/Layout'
import Overview from './components/Overview'
import Transactions from './components/Transactions'
import Insights from './components/Insights'
import Settings from './components/Settings'

function App() {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <Overview />;
      case 'Transactions':
        return <Transactions />;
      case 'Insights':
        return <Insights />;
      case 'Settings':
        return <Settings />;
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

