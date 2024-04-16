import Carousel from "@/components/Carousel";
import NavigationBar from "@/components/NavigationBar";

export default function Header() {
  return (
    <header className="">
      <NavigationBar />
      <Carousel />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h2 className="text-8xl font-bold text-white">Beauty in Every Bite</h2>
        <p className="mt-4 text-xl text-white">Taste the difference today.</p>
      </div>
    </header>
  );
}
