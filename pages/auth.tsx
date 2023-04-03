import axios from 'axios';
import { useCallback, useState } from 'react';
import { NextPageContext } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import logo from 'public/images/logo.png'
import Input from '@/components/Input';
import Image from 'next/image';

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

const Auth = () => {

  // For router to the another page
  const router = useRouter();

  // For login

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  // toggle method

  const [variant, setVariant] = useState('login');

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
  }, []); // dependency array

  // Login function

  const login = useCallback(async () => {
    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/'
      });

      router.push('/profiles');
    } catch (error) {
      console.log(error);
    }
  }, [email, password, router]);

  // Register function

  const register = useCallback(async () => {
    try {
      await axios.post('/api/register', {
        email,
        name,
        password
      });
      // After register - login
      login();
    } catch (error) {
        console.log(error);
    }
  }, [email, name, password, login]);

  const handleNameBlur = () => {
    if (name.trim() === '') {
      alert('Please enter your name');
    }
  };

  return (
    <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="bg-black w-full h-full bg-opacity-50">
        <nav className="px-12 py-3">
          <Image src={logo} width={200} className="" alt="Logo" />
        </nav>
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-8 self-center h-full lg:w-2/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-white text-3xl xl:text-4xl mb-6 font-semibold">
              {/* Login or register */}
              {variant === 'login' ? 'Sign in' : 'Register'} 
            </h2>
            <div className="flex flex-col gap-4">
              {/* If register, give option to put the name */}
              {variant === 'register' && (
                <Input
                  id="name"
                  type="text"
                  label="Username"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                />
              )}
              <Input
                id="email"
                type="email"
                label="Email address"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)} 
              />
              <Input
                type="password" 
                id="password" 
                label="Password" 
                value={password}
                onChange={(e: any) => setPassword(e.target.value)} 
              />
            </div>

            {/* Button for login, otherwise for register */}
            <button 
            onClick={variant === 'login' ? login : register} className="bg-red-600 py-3 text-white rounded-md w-full mt-6 hover:bg-red-700 transition">
              {/* Login for login, otherwiste sign up */}
              {variant === 'login' ? 'Login' : 'Sign up'}
            </button>
            <div className="flex flex-row items-center gap-4 mt-6 justify-center">
              <div 
              onClick={() => signIn('google', { callbackUrl: '/profiles' })} className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                <FcGoogle size={32} />
              </div>
              <div 
              onClick={() => signIn('github', { callbackUrl: '/profiles' })} className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                <FaGithub size={32} />
              </div>
            </div>
            <p className="text-neutral-500 mt-4">
              {/* For register - first time / for login - already have */}
              {variant === 'login' ? 'First time using Netflix?' : 'Already have an account?'}
              <span 
              onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                {/* Create acount if dont have or login */}
                {variant === 'login' ? 'Create an account' : 'Login'}
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
