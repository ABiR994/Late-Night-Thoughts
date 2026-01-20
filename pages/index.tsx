import Head from 'next/head';
import Layout from '../components/Layout';
import PostForm from '../components/PostForm'; // Import PostForm

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Late Night Thoughts</title>
        <meta name="description" content="Anonymous thought journal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center py-2 space-y-8"> {/* Added space-y-8 for spacing */}
        <h1 className="text-6xl font-bold">
          Welcome to <a className="text-blue-600" href="https://nextjs.org">Late Night Thoughts!</a>
        </h1>
        
        {/* Render the PostForm component */}
        <PostForm />
      </main>
    </Layout>
  );
}
