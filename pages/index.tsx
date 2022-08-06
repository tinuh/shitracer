import Head from 'next/head';

export default function Home() {
  return <>
    <Head>
      <title>next-tailwind-starter</title>
      <meta name="description" content="by @linkai101 on github" />
    </Head>

    <main>
      <div className="container px-8 py-8">
        <h1 className="text-3xl">next-tailwind-starter <span className="text-lg text-gray-400">v1</span></h1>
        <p className="text-md">
          by <a href="https://github.com/linkai101" className="font-bold text-blue-500 hover:underline" target="_blank">@linkai101</a>
        </p>

        <p className="mt-4">
          A starter Next.js project installed with TypeScript and Tailwind.
        </p>
      </div>
    </main>

    <footer>
    </footer>
  </>;
}
