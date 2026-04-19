import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { MoveLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />

      <div className="container-fluid mx-auto px-4 flex flex-col items-center justify-center relative z-10">
        {/* Animated Number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <h1 className="text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter text-foreground/5 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                Lost in space?
              </h2>
              <p className="mt-4 text-muted-foreground text-lg max-w-[400px] mx-auto">
                The page you're looking for has vanished into the digital void.
                Let's get you back on track.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            className="rounded-full px-8 h-14 text-base font-semibold group border-border/50 hover:bg-muted"
          >
            <MoveLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>

          <Button
            asChild
            size="lg"
            className="rounded-full px-8 h-14 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            <Link to="/">
              <Home className="mr-2 w-4 h-4" />
              Return Home
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Subtle Grid Background (Optional) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-20" />
    </div>
  );
}
