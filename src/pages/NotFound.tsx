import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-8">
        <h1 className="font-display text-9xl font-bold text-primary/10">404</h1>
        <div className="-mt-20 relative z-10">
          <h2 className="font-display text-4xl font-bold text-foreground">Oops! Page not found</h2>
          <p className="font-sans text-muted-foreground mt-4 max-w-sm mx-auto text-lg leading-relaxed">
            The literary journey you're looking for seems to have taken a different turn.
          </p>
          <a href="/" className="mt-10 inline-flex px-10 py-4 bg-primary text-white rounded-2xl font-sans font-bold hover:brightness-95 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-xs">
            Return to Collection
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
