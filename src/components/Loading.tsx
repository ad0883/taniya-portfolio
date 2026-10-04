import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

import Marquee from "react-fast-marquee";

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (percent >= 100 && !loaded && !isLoaded) {
      const timer1 = setTimeout(() => {
        setLoaded(true);
        const timer2 = setTimeout(() => {
          setIsLoaded(true);
        }, 500);
        return () => clearTimeout(timer2);
      }, 100);
      return () => clearTimeout(timer1);
    }
  }, [percent, loaded, isLoaded]);

  useEffect(() => {
    let moduleRef: any;
    import("./utils/initialFX").then((module) => {
      moduleRef = module;
      if (isLoaded) {
        setClicked(true);
        const timer = setTimeout(() => {
          if (moduleRef.initialFX) {
            moduleRef.initialFX();
          }
          setIsLoading(false);
        }, 1200); // Matched with CSS transition duration
        return () => clearTimeout(timer);
      }
    });
  }, [isLoaded, setIsLoading]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          TN
        </a>
        <div className={`loaderGame ${clicked && "loader-out"}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index}></div>
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>
      <div className="loading-screen">
        <div className="loading-marquee">
          <Marquee speed={80}>
            <span> Python Developer</span> <span>Machine Learning</span>
            <span> Web Development</span> <span>Data Analysis</span>
          </Marquee>
        </div>
        <div
          className={`loading-wrap ${clicked && "loading-clicked"}`}
          onMouseMove={(e) => handleMouseMove(e)}
        >
          <div className="loading-hover"></div>
          <div className={`loading-button ${loaded && "loading-complete"}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{percent}%</span>
                </div>
              </div>
              <div className="loading-box"></div>
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * 8) + 2; // Faster initial load
      percent = Math.min(percent + rand, 50);
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        let rand = Math.round(Math.random() * 2);
        percent = percent + rand;
        setLoading(percent);
        if (percent >= 98) {
          clearInterval(interval);
        }
      }, 500); // Reduced from 2000ms to 500ms for better responsiveness
    }
  }, 150);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      let fastInterval = setInterval(() => {
        if (percent < 100) {
          percent += 2;
          setLoading(Math.min(percent, 100));
        } else {
          resolve(percent);
          clearInterval(fastInterval);
        }
      }, 10);
    });
  }
  return { loaded, percent, clear };
};
