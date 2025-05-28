import { Link } from "react-router";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center overflow-hidden">
      <picture className="absolute inset-0 w-full h-full">
        <source
          media="(min-width: 1920px)"
          srcSet="/hero-image.jpg 1x, /hero-image.jpg 2x"
        />
        <source
          media="(min-width: 1024px)"
          srcSet="/hero-image.jpg 1x, /hero-image.jpg 2x"
        />
        <img
          src="/hero-image.jpg"
          alt="Formula One racing car on track"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </picture>

      <div className="absolute inset-0 bg-slate-900 opacity-60"></div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
          <span className="block">FORMULA ONE</span>
          <span className="block text-orange-400">EXPLORER</span>
        </h1>

        <p className="text-xl sm:text-2xl md:text-3xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed">
          Experience the thrill of the fastest motorsport on Earth.
          <span className="block mt-2 text-sky-300 font-semibold">
            "Where legends are born and records are shattered"
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/seasons"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            Explore Seasons
          </Link>
        </div>
      </div>
    </div>
  );
}
