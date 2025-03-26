'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-transparent bg-clip-text">
          Lumia AI
        </h1>

        <p>
          Welcome to our interactive chat platform designed to provide you with
          instant assistance and information.
        </p>
        <p>
          This platform is built with{' '}
          <Link
            className="font-medium underline underline-offset-4 text-purple-600"
            href="https://nextjs.org"
            target="_blank"
          >
            Next.js
          </Link>{' '}
          and leverages advanced AI capabilities to deliver a responsive and
          intuitive chat experience. Our system uses state-of-the-art language
          processing to understand and respond to your queries.
        </p>
        <p>
          Learn more about our technology by visiting our{' '}
          <Link
            className="font-medium underline text-purple-600 underline-offset-4"
            href="https://sdk.vercel.ai/docs"
            target="_blank"
          >
            documentation
          </Link>
          .
        </p>
      </div>
    </motion.div>
  );
};
