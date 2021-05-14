import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Typography, Button, Container, Box } from "@material-ui/core";
import Slider from "react-slick";

const Banner = (props) => {
  const [bannerSlider, setBannerSlider] = useState([]);

  useEffect(() => {
    setBannerSlider(props.sliders);
  }, [props.sliders]);

  const bannerImages = [
    "../../../../../assets/images/setting/large/slider1.jpg",
    "../../../../../assets/images/setting/large/slider2.jpg",
    "../../../../../assets/images/setting/large/slider3.jpg",
  ];
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, right: "10px" }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, left: "10px" }}
        onClick={onClick}
      />
    );
  }

  const settings = {
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 4000,
    cssEase: "linear",
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <Fragment>
      <Box component="div" className="home-slider-banner">
        <Slider {...settings}>
          {bannerImages.map((image) => (
            <img src={image} alt="slide" className="slide-image" />
          ))}
        </Slider>
      </Box>
      {/* <Box
        component="div"
        className="home-banner"
        display="flex"
        justify="flex-start"
        alignItems="center"
      >
        <Container>
          <Box component="span">
            <Typography variant="h1" component="h2" className="banner-heading">
              New Collection
            </Typography>
          </Box>
          <Button variant="contained" color="primary">
            <Link to="/shop">Shop Now</Link>
          </Button>
        </Container>
      </Box> */}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  settings: state.settings,
});

export default connect(mapStateToProps)(Banner);
