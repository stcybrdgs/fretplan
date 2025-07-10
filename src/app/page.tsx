'use client'

import { useState, useEffect } from 'react'
import {
  Menu,
  Sun,
  Moon,
  Mail,
  Plus,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [expandedCard, setExpandedCard] = useState<string | null>('card-1')

  // Set initial theme on component mount
  useEffect(() => {
    // Check if user has a saved preference or default to light
    const savedTheme = localStorage.getItem('theme')
    const prefersDark =
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)

    setIsDarkMode(prefersDark)
    if (prefersDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)

    // Update the DOM immediately
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }

    console.log('Theme switched to:', newDarkMode ? 'dark' : 'light')
    console.log(
      'HTML class list:',
      document.documentElement.classList.toString()
    )
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId)
  }

  return (
    <div className='bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-screen'>
      {/* Top Navigation */}
      <nav className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 fixed w-full top-0 z-50'>
        <div className='flex items-center justify-between max-w-7xl mx-auto'>
          {/* Logo & Sidebar Toggle */}
          <div className='flex items-center space-x-3'>
            <button
              onClick={toggleSidebar}
              className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white hover:bg-primary-hover transition-colors md:hidden'
            >
              <Menu className='w-4 h-4' />
            </button>
            <h1 className='text-xl font-semibold text-primary-custom'>
              FretPlan
            </h1>
          </div>

          {/* Right side controls */}
          <div className='flex items-center space-x-4'>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className='flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
            >
              {isDarkMode ? (
                <Sun className='w-4 h-4' />
              ) : (
                <Moon className='w-4 h-4' />
              )}
              <span className='text-sm font-medium hidden md:block'>
                {isDarkMode ? 'Light' : 'Dark'}
              </span>
            </button>

            {/* Contact button */}
            <button className='flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'>
              <Mail className='w-4 h-4' />
              <span className='text-sm font-medium hidden md:block'>
                Contact
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className='flex pt-16'>
        {/* Sidebar */}
        <aside
          className={`w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 transform transition-transform duration-300 ease-in-out z-40 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
        >
          <div className='p-4 space-y-2'>
            <div className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between'>
              <span>Practice Areas</span>
              <button className='text-gray-900 dark:text-white p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                <Plus className='w-4 h-4' />
              </button>
            </div>

            <a
              href='#'
              className='flex items-center space-x-3 text-gray-900 dark:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 bg-purple-50 dark:bg-purple-900/20 transition-colors'
            >
              <span className='w-2 h-2 bg-purple-600 rounded-full'></span>
              <span>Daily Practice</span>
            </a>

            <a
              href='#'
              className='flex items-center space-x-3 text-gray-900 dark:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
            >
              <span className='w-2 h-2 bg-green-600 rounded-full'></span>
              <span>Scales & Theory</span>
            </a>

            <a
              href='#'
              className='flex items-center space-x-3 text-gray-900 dark:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
            >
              <span className='w-2 h-2 bg-purple-600 rounded-full'></span>
              <span>Songs & Repertoire</span>
            </a>

            <a
              href='#'
              className='flex items-center space-x-3 text-gray-900 dark:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
            >
              <span className='w-2 h-2 bg-orange-600 rounded-full'></span>
              <span>Technique</span>
            </a>

            <div className='pt-4 mt-4 border-t border-gray-200 dark:border-gray-700'>
              <div className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between'>
                Projects
                <button className='text-gray-900 dark:text-white p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                  <Plus className='w-4 h-4' />
                </button>
              </div>
              <a
                href='#'
                className='flex items-center space-x-3 text-gray-900 dark:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 bg-purple-50 dark:bg-purple-900/20 transition-colors'
              >
                <span className='w-2 h-2 bg-purple-600 rounded-full'></span>
                <span>Original #1</span>
              </a>
            </div>

            <div className='pt-4 mt-4 border-t border-gray-200 dark:border-gray-700'>
              <div className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3'>
                Analyze
              </div>
              <a
                href='#'
                className='flex items-center space-x-3 text-gray-900 dark:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 bg-purple-50 dark:bg-purple-900/20 transition-colors'
              >
                <span className='w-2 h-2 bg-purple-600 rounded-full'></span>
                <span>Dashboard</span>
              </a>
            </div>

            <div className='pt-4 mt-4 border-t border-gray-200 dark:border-gray-700'>
              <div className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3'>
                Manage
              </div>
              <a
                href='#'
                className='flex items-center space-x-3 text-gray-900 dark:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 bg-purple-50 dark:bg-purple-900/20 transition-colors'
              >
                <span className='w-2 h-2 bg-purple-600 rounded-full'></span>
                <span>Tags</span>
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className='flex-1 md:ml-64 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen'>
          <div className='max-w-4xl mx-auto'>
            {/* Page Header */}
            <div className='mb-6'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                Daily Practice
              </h2>
              <p className='text-gray-600 dark:text-gray-400'>
                Plan your practice, track your progress
              </p>
            </div>

            {/* Add New Card Button */}
            <div className='mb-6'>
              <button className='bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors'>
                <Plus className='w-4 h-4' />
                <span>Add Practice Card</span>
              </button>
            </div>

            {/* Practice Cards */}
            <div className='space-y-4'>
              {/* Expanded Card */}
              <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm'>
                <div
                  className='p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 transition-colors'
                  onClick={() => toggleCard('card-1')}
                >
                  <div className='flex items-center space-x-3'>
                    <span className='w-3 h-3 bg-green-500 rounded-full'></span>
                    <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                      G Dominant Scale Ideas
                    </h3>
                  </div>
                  {expandedCard === 'card-1' ? (
                    <ChevronDown className='w-5 h-5 text-gray-500 dark:text-gray-400' />
                  ) : (
                    <ChevronRight className='w-5 h-5 text-gray-500 dark:text-gray-400' />
                  )}
                </div>

                {expandedCard === 'card-1' && (
                  <div className='p-4 space-y-3'>
                    <div className='flex items-center space-x-3'>
                      <input
                        type='checkbox'
                        className='w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500'
                      />
                      <span className='text-gray-900 dark:text-white'>
                        Practice Dm - F - Bb - A progression
                      </span>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <input
                        type='checkbox'
                        defaultChecked
                        className='w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500'
                      />
                      <span className='text-gray-500 dark:text-gray-400 line-through'>
                        Review tritone substitutions
                      </span>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <input
                        type='checkbox'
                        className='w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500'
                      />
                      <span className='text-gray-900 dark:text-white'>
                        Apply to &quot;Autumn Leaves&quot; in Bb
                      </span>
                    </div>

                    {/* Add new task */}
                    <div className='flex items-center space-x-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700'>
                      <input
                        type='text'
                        placeholder='Add new task...'
                        className='flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      />
                      <button className='bg-primary hover:bg-primary-hover text-white px-3 py-2 rounded text-sm transition-colors'>
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Collapsed Card */}
              <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm'>
                <div
                  className='p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between transition-colors'
                  onClick={() => toggleCard('card-2')}
                >
                  <div className='flex items-center space-x-3'>
                    <span className='w-3 h-3 bg-purple-600 rounded-full'></span>
                    <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                      Autumn Leaves - Bb &amp; G Major
                    </h3>
                  </div>
                  <ChevronRight className='w-5 h-5 text-gray-500 dark:text-gray-400' />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden'
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  )
}
