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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600 text-transparent bg-clip-text">
          Lumia AI
        </h1>

        <p>
          Welcome to Lumia AI – a realm where innovation meets intelligence,
          transforming your digital experience into a seamless journey of
          discovery.
        </p>
        <p>
          Our cutting-edge platform is built on the robust{' '}
          <Link
            className="font-medium underline underline-offset-4 text-blue-600"
            href="https://nextjs.org"
            target="_blank"
          >
            Next.js
          </Link>{' '}
          framework and leverages state-of-the-art AI to provide you with
          instant, personalized support.
        </p>
        <p>
          To learn more about the groundbreaking technology behind our service,
          please visit our{' '}
          <Link
            className="font-medium underline text-blue-600 underline-offset-4"
            href="https://docs.aurora.ai"
            target="_blank"
          >
            comprehensive documentation
          </Link>
          .
        </p>
      </div>
    </motion.div>
  );
};
