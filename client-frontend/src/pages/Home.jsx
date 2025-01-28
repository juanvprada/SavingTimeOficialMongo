import React from "react";
import { homeVid, handsImg, breadImg, marketImg, savingTimeImg } from "../utils";
import AuthForm from '../components/AuthForm';
import useStore from '../store/store';
import CookieConsent from '../components/CookieConsent';

const Home = () => {
  const isLoggedIn = useStore((state) => !!state.token);
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Background image section */}
      <div className="relative">
        <div className="w-full h-screen relative">
          <img
            src={savingTimeImg}
            alt="Background"
            className="w-full h-full object-cover absolute inset-0"
          />

          {/* Título y AuthForm */}
          <div className="absolute inset-0 flex flex-col items-center bg-black bg-opacity-70 px-4">
            <h1 className="hidden sm:block text-white text-opacity-30 font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-10xl 2xl:text-11xl mt-4 sm:mt-6 md:mt-8">
              Saving Time
            </h1>
            {!isLoggedIn && (
              <div className="w-full max-w-md -mt-8 sm:mt-0 md:-mt-2 lg:-mt-4">
                <AuthForm textColor="text-white" inputTextColor="text-white" formBackground="bg-transparent" />
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Sección adicional */}
      
      <CookieConsent />
    </div >
  );
};

export default Home;