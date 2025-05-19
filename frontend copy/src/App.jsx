import { Button } from '@/components/ui/button';

function App() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
        <div className="min-h-screen flex items-center justify-center">
      <Button variant="default">Click Me</Button>
    </div>
        <p className="text-lg text-gray-700">
          This is a simple job portal application.
        </p>
      </div>
    </>
  );
}

export default App;
