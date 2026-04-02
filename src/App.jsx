import React from 'react'
import Layout from './components/Layout'

function App() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome to Phase 1 Initialization! The foundation is set.
        </p>
      </div>
    </Layout>
  )
}

export default App
