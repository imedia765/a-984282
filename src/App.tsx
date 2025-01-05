import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import { Session } from "@supabase/supabase-js";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted) {
          console.log('Initial session check:', session?.user?.id);
          setSession(session);
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Session check error:', error);
        if (mounted) {
          handleAuthError(error);
          setLoading(false);
        }
      }
    };

    initializeSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', _event, session?.user?.id);
      
      if (_event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }

      if (_event === 'SIGNED_OUT' || _event === 'USER_DELETED') {
        console.log('User signed out or deleted, clearing session and queries');
        // Clear session immediately
        setSession(null);
        // Reset all queries
        await queryClient.resetQueries();
        // Clear supabase session
        await supabase.auth.signOut();
        // Force a full page reload to clear any remaining state
        window.location.href = '/login';
        return;
      }

      setSession(session);
      
      if (!session) {
        // Clear all queries when the user logs out
        await queryClient.resetQueries();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const handleAuthError = async (error: any) => {
    console.error('Auth error:', error);
    
    const errorMessage = typeof error === 'string' ? error : error.message || error.error_description;
    
    if (errorMessage?.includes('session_not_found') || 
        errorMessage?.includes('JWT expired') ||
        errorMessage?.includes('Invalid Refresh Token') ||
        errorMessage?.includes('refresh_token_not_found')) {
      console.log('Invalid or expired session, signing out...');
      
      // Clear session state immediately
      setSession(null);
      
      // Reset all queries
      await queryClient.resetQueries();
      
      // Clear supabase session
      await supabase.auth.signOut();
      
      toast({
        title: "Session expired",
        description: "Please sign in again",
        variant: "destructive",
      });

      // Force a full page reload to clear any remaining state
      window.location.href = '/login';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              loading ? (
                <div className="flex items-center justify-center min-h-screen">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : session ? (
                <Index />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              loading ? (
                <div className="flex items-center justify-center min-h-screen">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : session ? (
                <Navigate to="/" replace />
              ) : (
                <Login />
              )
            }
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  );
}

export default App;