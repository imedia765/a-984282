import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlayCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DebugConsole } from '../logs/DebugConsole';
import SystemCheckProgress from './SystemCheckProgress';

const TestRunner = () => {
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState('');

  const runTestsMutation = useMutation({
    mutationFn: async () => {
      setIsRunning(true);
      setTestLogs(['Starting test run...']);
      setProgress(0);
      setCurrentTest('Initializing tests...');

      const { data, error } = await supabase.functions.invoke('run-tests', {
        body: { command: 'test' }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setTestLogs(prev => [...prev, 'Tests completed successfully']);
      setProgress(100);
      setCurrentTest('All tests complete');
    },
    onError: (error) => {
      setTestLogs(prev => [...prev, `Error running tests: ${error.message}`]);
      setProgress(0);
      setCurrentTest('Test run failed');
    },
    onSettled: () => {
      setIsRunning(false);
    }
  });

  // Subscribe to real-time test logs
  useQuery({
    queryKey: ['test-logs'],
    queryFn: async () => {
      const channel = supabase
        .channel('test-logs')
        .on('broadcast', { event: 'test-log' }, ({ payload }) => {
          setTestLogs(prev => [...prev, payload.message]);
          setProgress(payload.progress || progress);
          setCurrentTest(payload.currentTest || currentTest);
        })
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    },
    enabled: isRunning
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-white flex items-center gap-2">
          <PlayCircle className="w-5 h-5" />
          Test Runner
        </h2>
        <Button
          onClick={() => runTestsMutation.mutate()}
          disabled={isRunning}
        >
          Run Tests
        </Button>
      </div>

      {isRunning && (
        <SystemCheckProgress
          currentCheck={currentTest}
          progress={progress}
          totalChecks={100}
          completedChecks={Math.floor(progress)}
        />
      )}

      {runTestsMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to run tests: {runTestsMutation.error.message}
          </AlertDescription>
        </Alert>
      )}

      <DebugConsole logs={testLogs} />
    </section>
  );
};

export default TestRunner;