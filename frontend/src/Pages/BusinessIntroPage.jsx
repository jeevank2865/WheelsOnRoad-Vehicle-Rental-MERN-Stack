import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  MapPin,
  ShieldCheck,
  Volume2,
  VolumeX,
  Video,
  Star,
  Zap,
} from "lucide-react";

export const BusinessIntroPage = ({ onExploreWheelsOnRoad }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);

  const playerRef = useRef(null);

  useEffect(() => {
    const createPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        return;
      }

      if (playerRef.current) {
        return;
      }

      playerRef.current = new window.YT.Player("apexlease-youtube-player", {
        videoId: "rSqmRfKJEJk",

        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: "rSqmRfKJEJk",
          controls: 0,
          rel: 0,
          playsinline: 1,
          modestbranding: 1,
        },

        events: {
          onReady: (event) => {
            setPlayerReady(true);

            event.target.mute();
            event.target.setVolume(100);
            event.target.playVideo();
          },

          onStateChange: (event) => {
            if (window.YT && event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
      return;
    }

    const existingScript = document.getElementById("youtube-iframe-api");

    if (!existingScript) {
      const script = document.createElement("script");

      script.id = "youtube-iframe-api";

      script.src = "https://www.youtube.com/iframe_api";

      document.body.appendChild(script);
    }

    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      if (previousCallback) {
        previousCallback();
      }

      createPlayer();
    };

    return () => {};
  }, []);

  const toggleSound = () => {
    if (!playerRef.current || !playerReady) {
      return;
    }

    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(100);
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  return (
    <>
      <style>{`

        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
        }

        body {
          background: #05070a;
        }

        button {
          font-family: inherit;
        }

        /* ===============================================
           HERO
        =============================================== */

        .apex-intro {
          position: relative;

          width: 100%;

          height: 100vh;

          min-height: 700px;

          overflow: hidden;

          background: #05070a;

          color: #ffffff;

          display: flex;

          align-items: center;

          justify-content: center;

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }


        /* ===============================================
           YOUTUBE BACKGROUND
        =============================================== */

        .apex-youtube-wrapper {
          position: absolute;

          inset: 0;

          overflow: hidden;

          z-index: 0;

          background: #05070a;
        }


        .apex-youtube-player {
          position: absolute;

          top: 50%;

          left: 50%;

          width: 100vw;

          height: 56.25vw;

          min-width: 177.78vh;

          min-height: 100vh;

          transform:
            translate(-50%, -50%)
            scale(1.12);

          border: none;

          pointer-events: none;
        }


        /* ===============================================
           VIDEO OVERLAY
        =============================================== */

        .apex-video-overlay {
          position: absolute;

          inset: 0;

          z-index: 1;

          pointer-events: none;

          background:
            linear-gradient(
              90deg,
              rgba(3, 5, 8, 0.70) 0%,
              rgba(3, 5, 8, 0.32) 45%,
              rgba(3, 5, 8, 0.22) 72%,
              rgba(3, 5, 8, 0.52) 100%
            );
        }


        .apex-bottom-overlay {
          position: absolute;

          inset: 0;

          z-index: 1;

          pointer-events: none;

          background:
            linear-gradient(
              180deg,
              rgba(0,0,0,0.15) 0%,
              transparent 48%,
              rgba(0,0,0,0.72) 100%
            );
        }


        /* ===============================================
           AMBIENT GLOW
        =============================================== */

        .apex-glow {
          position: absolute;

          width: 500px;

          height: 500px;

          right: -250px;

          bottom: -250px;

          z-index: 1;

          border-radius: 50%;

          background:
            rgba(255, 122, 0, 0.10);

          filter: blur(100px);

          pointer-events: none;
        }


        /* ===============================================
           TOP BRAND
        =============================================== */

        .apex-brand {
          position: absolute;

          top: 28px;

          left: 38px;

          z-index: 10;

          display: flex;

          align-items: center;

          gap: 12px;
        }


        .apex-brand-logo {
          width: 44px;

          height: 44px;

          border-radius: 12px;

          display: flex;

          align-items: center;

          justify-content: center;

          background:
            linear-gradient(
              135deg,
              #FF7A00,
              #FF4D00
            );

          color: #05070a;

          font-size: 19px;

          font-weight: 900;

          box-shadow:
            0 10px 35px
            rgba(255, 122, 0, 0.30);
        }


        .apex-brand-text {
          display: flex;

          flex-direction: column;
        }


        .apex-brand-text strong {
          color: #ffffff;

          font-size: 16px;

          letter-spacing: 1px;
        }


        .apex-brand-text span {
          margin-top: 3px;

          color:
            rgba(255,255,255,0.50);

          font-size: 8px;

          letter-spacing: 2px;
        }


        /* ===============================================
           LOCATION
        =============================================== */

        .apex-location {
          position: absolute;

          top: 28px;

          right: 38px;

          z-index: 10;

          display: flex;

          align-items: center;

          gap: 7px;

          padding:
            11px 16px;

          border-radius: 40px;

          background:
            rgba(5,7,10,0.58);

          border:
            1px solid
            rgba(255,255,255,0.18);

          backdrop-filter: blur(16px);

          color:
            rgba(255,255,255,0.78);

          font-size: 11px;
        }


        .apex-location svg {
          color: #FF7A00;
        }


        /* ===============================================
           SOUND CONTROL
        =============================================== */

        .apex-video-control {
          position: absolute;

          top: 85px;

          right: 38px;

          z-index: 10;

          display: flex;

          align-items: center;

          gap: 9px;

          padding: 7px;

          border-radius: 40px;

          background:
            rgba(5,7,10,0.65);

          border:
            1px solid
            rgba(255,255,255,0.18);

          backdrop-filter: blur(15px);
        }


        .apex-live {
          display: flex;

          align-items: center;

          gap: 6px;

          padding-left: 7px;

          color:
            rgba(255,255,255,0.75);

          font-size: 9px;

          font-weight: 800;

          letter-spacing: 1px;
        }


        .apex-live-dot {
          width: 6px;

          height: 6px;

          border-radius: 50%;

          background: #FF7A00;

          box-shadow:
            0 0 10px #FF7A00;
        }


        .apex-sound-button {
          width: 37px;

          height: 37px;

          border: none;

          border-radius: 50%;

          display: flex;

          align-items: center;

          justify-content: center;

          background:
            rgba(255,255,255,0.12);

          color: #ffffff;

          cursor: pointer;

          transition:
            all 0.25s ease;
        }


        .apex-sound-button:hover {
          background:
            rgba(255,122,0,0.22);

          color: #FF7A00;

          transform:
            scale(1.06);
        }


        /* ===============================================
           CONTENT
        =============================================== */

        .apex-content {
          position: relative;

          z-index: 5;

          width: 92%;

          max-width: 1050px;

          text-align: center;

          animation:
            apexAppear
            1.2s
            ease
            forwards;
        }


        /* ===============================================
           BADGE
        =============================================== */

        .apex-badge {
          display: inline-flex;

          align-items: center;

          gap: 9px;

          padding:
            10px 18px;

          border-radius: 40px;

          background:
            rgba(255,122,0,0.10);

          border:
            1px solid
            rgba(255,122,0,0.38);

          color: #FF7A00;

          font-size: 10px;

          font-weight: 800;

          letter-spacing: 2px;

          margin-bottom: 28px;

          backdrop-filter: blur(12px);

          box-shadow:
            0 0 25px
            rgba(255,122,0,0.10);
        }


        /* ===============================================
           LOGO
        =============================================== */

        .apex-title {
          margin: 0;

          font-size:
            clamp(
              4rem,
              9vw,
              8rem
            );

          line-height: 0.88;

          font-weight: 900;

          letter-spacing: -6px;

          color: #ffffff;

          text-shadow:
            0 6px 40px
            rgba(0,0,0,0.90);
        }


        .apex-subtitle {
          margin:
            22px 0 30px;

          color: #FF7A00;

          font-size: 11px;

          font-weight: 800;

          letter-spacing: 6px;

          text-shadow:
            0 2px 15px
            rgba(0,0,0,0.90);
        }


        /* ===============================================
           LINE
        =============================================== */

        .apex-line {
          width: 90px;

          height: 3px;

          margin:
            0 auto 28px;

          border-radius: 20px;

          background:
            linear-gradient(
              90deg,
              #FF7A00,
              #FF4D00
            );

          box-shadow:
            0 0 20px
            rgba(255,122,0,0.45);
        }


        /* ===============================================
           HEADING
        =============================================== */

        .apex-heading {
          margin: 0;

          font-size:
            clamp(
              2rem,
              5vw,
              4.5rem
            );

          line-height: 1.04;

          font-weight: 900;

          letter-spacing: -2px;

          color: #ffffff;

          text-shadow:
            0 5px 25px
            rgba(0,0,0,0.95);
        }


        .apex-heading span {
          background:
            linear-gradient(
              135deg,
              #FF7A00,
              #FF9A3D
            );

          -webkit-background-clip:
            text;

          background-clip: text;

          -webkit-text-fill-color:
            transparent;

          filter:
            drop-shadow(
              0 4px 12px
              rgba(0,0,0,0.40)
            );
        }


        /* ===============================================
           DESCRIPTION
        =============================================== */

        .apex-description {
          max-width: 680px;

          margin:
            27px auto 0;

          color:
            rgba(255,255,255,0.88);

          font-size:
            clamp(
              14px,
              2vw,
              18px
            );

          line-height: 1.7;

          text-shadow:
            0 2px 15px
            rgba(0,0,0,0.95);
        }


        /* ===============================================
           QUOTE
        =============================================== */

        .apex-quote {
          max-width: 600px;

          margin:
            22px auto 30px;

          color:
            rgba(255,255,255,0.72);

          font-size: 13px;

          font-style: italic;

          line-height: 1.6;

          text-shadow:
            0 2px 12px
            rgba(0,0,0,0.95);
        }


        /* ===============================================
           CTA
        =============================================== */

        .apex-cta {
          display: inline-flex;

          align-items: center;

          gap: 12px;

          padding:
            17px 30px;

          border: none;

          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #FF7A00,
              #FF4D00
            );

          color: #05070a;

          font-size: 12px;

          font-weight: 900;

          letter-spacing: 1px;

          cursor: pointer;

          box-shadow:
            0 15px 45px
            rgba(255,122,0,0.35);

          transition:
            all 0.3s ease;
        }


        .apex-cta:hover {
          transform:
            translateY(-4px);

          box-shadow:
            0 20px 55px
            rgba(255,122,0,0.50);
        }


        .apex-cta:hover svg {
          transform:
            translateX(5px);
        }


        .apex-cta svg {
          transition:
            transform 0.3s ease;
        }


        /* ===============================================
           TRUST ITEMS
        =============================================== */

        .apex-trust {
          display: flex;

          align-items: center;

          justify-content: center;

          flex-wrap: wrap;

          gap: 25px;

          margin-top: 38px;

          color:
            rgba(255,255,255,0.80);

          font-size: 10px;

          font-weight: 800;

          letter-spacing: 1px;

          text-shadow:
            0 2px 10px
            rgba(0,0,0,0.90);
        }


        .apex-trust-item {
          display: flex;

          align-items: center;

          gap: 7px;
        }


        .apex-trust-item svg {
          color: #FF7A00;
        }


        /* ===============================================
           BOTTOM
        =============================================== */

        .apex-bottom {
          position: absolute;

          bottom: 22px;

          left: 50%;

          transform:
            translateX(-50%);

          z-index: 6;

          color:
            rgba(255,255,255,0.48);

          font-size: 9px;

          letter-spacing: 2px;

          white-space: nowrap;
        }


        .apex-skip {
          position: absolute;

          right: 38px;

          bottom: 20px;

          z-index: 10;

          border: none;

          background: transparent;

          color:
            rgba(255,255,255,0.55);

          cursor: pointer;

          font-size: 10px;

          letter-spacing: 1px;

          transition:
            color 0.25s ease;
        }


        .apex-skip:hover {
          color: #FF7A00;
        }



        /* ===============================================
           CONTACT DETAILS
        =============================================== */

        .apex-contact {
          position: absolute;
          left: 38px;
          bottom: 58px;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 15px;
          border-radius: 14px;
          background: rgba(5,7,10,0.62);
          border: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(16px);
          box-shadow: 0 12px 35px rgba(0,0,0,0.25);
        }

        .apex-contact-label {
          color: #FF7A00;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .apex-contact-info {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,0.82);
          font-size: 10px;
        }

        .apex-contact-info a {
          color: rgba(255,255,255,0.82);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .apex-contact-info a:hover {
          color: #FF7A00;
        }

        .apex-contact-divider {
          width: 1px;
          height: 16px;
          background: rgba(255,255,255,0.16);
        }

        .apex-contact-icon {
          color: #FF7A00;
          margin-right: 5px;
        }

        @media (max-width: 600px) {
          .apex-contact {
            left: 50%;
            bottom: 43px;
            transform: translateX(-50%);
            width: calc(100% - 36px);
            justify-content: center;
            padding: 9px 10px;
          }

          .apex-contact-label {
            display: none;
          }

          .apex-contact-info {
            gap: 9px;
            font-size: 8px;
          }

          .apex-contact-divider {
            height: 13px;
          }
        }

        /* ===============================================
           ANIMATION
        =============================================== */

        @keyframes apexAppear {

          from {
            opacity: 0;

            transform:
              translateY(30px);
          }

          to {
            opacity: 1;

            transform:
              translateY(0);
          }
        }


        /* ===============================================
           TABLET
        =============================================== */

        @media (max-width: 850px) {

          .apex-title {
            font-size:
              clamp(
                4rem,
                14vw,
                7rem
              );
          }

          .apex-heading {
            font-size:
              clamp(
                2rem,
                7vw,
                4rem
              );
          }

          .apex-description {
            font-size: 15px;
          }

        }


        /* ===============================================
           MOBILE
        =============================================== */

        @media (max-width: 600px) {

          .apex-intro {
            min-height: 700px;

            height: 100svh;
          }


          .apex-youtube-player {
            transform:
              translate(-50%, -50%)
              scale(1.45);
          }


          .apex-brand {
            top: 18px;

            left: 18px;
          }


          .apex-brand-logo {
            width: 37px;

            height: 37px;

            font-size: 16px;
          }


          .apex-brand-text strong {
            font-size: 13px;
          }


          .apex-brand-text span {
            font-size: 7px;
          }


          .apex-location {
            top: 18px;

            right: 18px;

            padding:
              9px 12px;

            font-size: 9px;
          }


          .apex-location svg {
            width: 12px;

            height: 12px;
          }


          .apex-video-control {
            top: 68px;

            right: 18px;
          }


          .apex-live {
            display: none;
          }


          .apex-content {
            width: 91%;

            margin-top: 30px;
          }


          .apex-badge {
            padding:
              8px 12px;

            font-size: 8px;

            letter-spacing: 1.3px;

            margin-bottom: 20px;
          }


          .apex-title {
            font-size: 58px;

            letter-spacing: -4px;
          }


          .apex-subtitle {
            font-size: 8px;

            letter-spacing: 4px;

            margin:
              16px 0 22px;
          }


          .apex-heading {
            font-size: 33px;

            letter-spacing: -1px;
          }


          .apex-description {
            font-size: 13px;

            line-height: 1.6;

            margin-top: 20px;
          }


          .apex-quote {
            font-size: 11px;

            margin:
              18px auto 24px;
          }


          .apex-cta {
            padding:
              15px 23px;

            font-size: 10px;
          }


          .apex-trust {
            gap: 12px;

            margin-top: 25px;

            font-size: 8px;
          }


          .apex-bottom {
            bottom: 15px;

            font-size: 7px;
          }


          .apex-skip {
            right: 18px;

            bottom: 15px;

            font-size: 8px;
          }

        }

      `}</style>

      {}

      <section className="apex-intro">
        {}

        <div className="apex-youtube-wrapper">
          <div id="apexlease-youtube-player" className="apex-youtube-player" />
        </div>

        {}

        <div className="apex-video-overlay" />

        <div className="apex-bottom-overlay" />

        <div className="apex-glow" />

        {}

        <div className="apex-brand">
          <div className="apex-brand-logo">🏍️</div>

          <div className="apex-brand-text">
            <strong>WheelsOnRoad</strong>

            <span>PREMIUM FLEET RENTAL</span>
          </div>
        </div>

        {}

        <div className="apex-location">
          <MapPin size={14} />

          <span>
            <b>Bengaluru</b> • India
          </span>
        </div>

        {}

        <div className="apex-video-control">
          <div className="apex-live">
            <span className="apex-live-dot" />
            VIDEO
          </div>

          <button
            className="apex-sound-button"
            onClick={toggleSound}
            aria-label={isMuted ? "Turn video sound on" : "Mute video sound"}
            title={isMuted ? "Turn sound on" : "Mute sound"}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
        </div>

        {}

        <div className="apex-content">
          {}

          <div className="apex-badge">
            <Video size={14} />
            PREMIUM MOBILITY EXPERIENCE
          </div>

          {}

          <h1 className="apex-title">
            <span style={{ color: "#FFFFFF" }}>Wheels</span>
            <span style={{ color: "#FF7A00" }}>OnRoad</span>
          </h1>

          {}

          <div className="apex-subtitle">PREMIUM FLEET RENTAL</div>

          {}

          <div className="apex-line" />

          {}

          <h2 className="apex-heading">
            Your journey.
            <br />
            <span>Your choice. Your ride.</span>
          </h2>

          {}

          <p className="apex-description">
            Discover premium bikes and luxury cars for city rides, weekend
            escapes and unforgettable journeys.
          </p>

          {}

          <div className="apex-quote">
            “Every road has a story. Choose a ride worth remembering.”
            <br />— ApexLease
          </div>

          {}

          <button className="apex-cta" onClick={onExploreWheelsOnRoad}>
            EXPLORE THE FLEET
            <ArrowRight size={19} />
          </button>

          {}

          <div className="apex-trust">
            <div className="apex-trust-item">
              <ShieldCheck size={15} />
              VERIFIED FLEET
            </div>

            <div className="apex-trust-item">
              <Zap size={15} />
              EASY BOOKING
            </div>

            <div className="apex-trust-item">
              <Star size={15} />
              PREMIUM EXPERIENCE
            </div>
          </div>
        </div>

        {}

        {}

        <div className="apex-contact">
          <span className="apex-contact-label">Contact</span>

          <div className="apex-contact-info">
            <a href="tel:+919876543210">
              <span className="apex-contact-icon">☎</span>
              +91 7777777777
            </a>

            <span className="apex-contact-divider" />

            <a href="mailto:support@wheelsonroad.com">
              <span className="apex-contact-icon">✉</span>
              support@wheelsonroad.com
            </a>
          </div>
        </div>

        <div className="apex-bottom">
          PREMIUM BIKES &nbsp; • &nbsp; LUXURY CARS &nbsp; • &nbsp; SECURE
          BOOKING
        </div>

        {}

        <button className="apex-skip" onClick={onExploreWheelsOnRoad}>
          Skip Intro →
        </button>
      </section>
    </>
  );
};

export default BusinessIntroPage;
