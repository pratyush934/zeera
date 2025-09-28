'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* Large 404 with emoji */}
        <div className="space-y-4">
          <div className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            404
          </div>
          <div className="text-6xl animate-bounce">
            🤔
          </div>
        </div>

        {/* Main message */}
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            Looks like you&apos;ve stumbled into the digital void! 🕳️ 
            <br />
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Fun emoji section */}
        <div className="flex justify-center space-x-2 text-3xl">
          <span className="animate-pulse">🔍</span>
          <span className="animate-ping">📍</span>
          <span className="animate-bounce">🗺️</span>
        </div>

        {/* Helpful suggestions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 space-y-4">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <span>💡</span>
            What can you do?
          </h2>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left">
            <li className="flex items-center gap-2">
              <span>🏠</span>
              Go back to the homepage
            </li>
            <li className="flex items-center gap-2">
              <span>🔍</span>
              Check the URL for typos
            </li>
            <li className="flex items-center gap-2">
              <span>⏪</span>
              Use your browser&apos;s back button
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span>
              Contact support if needed
            </li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105">
              <span className="mr-2">🏠</span>
              Back to Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto font-semibold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            <span className="mr-2">⏪</span>
            Go Back
          </Button>
        </div>

        {/* Fun footer message */}
        <div className="text-sm text-gray-500 dark:text-gray-500 italic">
          Lost in space? Don&apos;t worry, even astronauts need GPS! 🚀✨
        </div>
      </div>
    </div>
  )
}