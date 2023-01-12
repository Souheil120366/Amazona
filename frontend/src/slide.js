import React from "react";
import Slider from "infinite-react-carousel";
import { useState } from 'react';
import telefunken from "./data/telefunken.jpg";
import kent from "./data/kent.jpg";
import filtre from "./data/GREEN-FILTRE-PACK-3.jpg";
import rarrow from "./data/right-arrow.png";
import larrow from "./data/left-arrow.png";
import group from "./data/group.jpg";
import "./slide.css";

function Slide() {
    const [arrow_visibility, setArrow_visibility] = useState("hidden");

    const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
        <div onMouseOver={() => setArrow_visibility("visible")} >
            <img style={{ visibility: arrow_visibility, height: "100px", margin: "200px 10px 20px 20px" }} src={larrow} alt="prevArrow" {...props} />
        </div>
    );
    const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
        <div onMouseOver={() => setArrow_visibility("visible")} >
            <img style={{ visibility: arrow_visibility, height: "100px", margin: "200px 20px 20px 30px" }} src={rarrow} alt="nextArrow" {...props} />
        </div>
    );
    const settings = {
        autoplay: true,
        autoplaySpeed: 5000,
        className: "slide_box",
        dots: true,
        virtualList: true,
        duration: 20,
        arrows: true,
        prevArrow: <SlickArrowLeft />,
        nextArrow: <SlickArrowRight />,
    };
    return (
        <div>

            <Slider {...settings}>


                <div className="row" onMouseOver={() => setArrow_visibility("visible")} onMouseLeave={() => setArrow_visibility("hidden")}>

                    <img
                        src={telefunken}
                        className="slide_img col-12 col-xs-6"
                        alt="Responsive img"
                    />

                </div>


                <div onMouseOver={() => setArrow_visibility("visible")} onMouseLeave={() => setArrow_visibility("hidden")}>
                    <img
                        src={kent}
                        className="slide_img col-lg-12 col-xs-6"
                        alt="Responsive img"
                    />

                </div>

                <div onMouseOver={() => setArrow_visibility("visible")} onMouseLeave={() => setArrow_visibility("hidden")}>
                    <img
                        src={filtre}
                        className="slide_img col-lg-12"
                        alt="Responsive img"
                    />

                </div>
                <div onMouseOver={() => setArrow_visibility("visible")} onMouseLeave={() => setArrow_visibility("hidden")}>
                    <img
                        src={group}
                        className="slide_img col-lg-12"
                        alt="Responsive img"
                    />
                </div>

            </Slider>
        </div>
    );
}

export default Slide;