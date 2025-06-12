"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/card";

function TipsAndHints({ className }: { className?: string }) {
  return (
    <Card className="p-5 max-w-lg shadow-none 2xl:flex flex-col gap-4 flex-1 w-full hidden">
      <span className="font-semibold text-lg">Tips & Hints</span>
      <AnimatePresence>
        <motion.div
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: 100 },
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex justify-start"
        >
          <ul className="flex list-disc flex-col pl-8 text-xs text-foreground sm:text-sm 2xl:text-sm space-y-2">
            <li>
              Use high-quality, well-lit photos of your property to attract more
              interest
            </li>
            <li>
              Write a detailed, honest description of your property’s features
            </li>

            <li>Update your property listing regularly to keep it current</li>
            <li>
              Be responsive to inquiries and questions from potential renters
            </li>
            <li>
              Provide clear directions and parking information for your property
            </li>

            <li>
              Ensure your contact information is up-to-date for easy
              communication
            </li>
          </ul>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}

export default TipsAndHints;
