import { SignUp } from '@clerk/nextjs';
import { Ripple } from "@/components/ui/ripple";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-800 dark:to-blue-900 p-4 relative overflow-hidden">
      {/* Ripple Background Effect */}
      <Ripple
        mainCircleSize={180}
        mainCircleOpacity={0.12}
        numCircles={7}
        className="absolute inset-0 opacity-40 dark:opacity-60"
      />
      
      {/* Content Container */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
              Z
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Join Zeera
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Create your project management workspace
          </p>
        </div>
        
        {/* Sign Up Component with enhanced styling */}
        <div className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-1">
          <SignUp 
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
}