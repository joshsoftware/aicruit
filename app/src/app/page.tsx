import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="flex flex-col w-full h-full justify-between pt-16">
      <div className="flex justify-end p-4 bg-gray-200">
        <Link
          href="/signup"
        >
          <Button>Sign Up</Button>
        </Link>
        <Link
          href="/signin"
        >
          <Button>Sign In</Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row w-full h-full justify-center items-center gap-4 px-4">
        <div className="flex flex-col gap-4 justify-center items-start">
          <h1 className="text-3xl font-bold text-center text-[#8CB369]">
            Landing Page
          </h1>
         
        </div>
      </div>
    </div>
  );
};

export default Home;
