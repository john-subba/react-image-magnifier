import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  getLensModeEnlargedImageCoordinates,
  getInPlaceEnlargedImageCoordinates,
} from "./lib/imageCoordinates";
import { LargeImageShape } from "./prop-types/Image";
import { ContainerDimensions } from "./prop-types/EnlargedImage";
import { noop } from "./utils";
import Point from "./prop-types/Point";
import {
  getEnlargedImageContainerStyle,
  getEnlargedImageStyle,
} from "./lib/styles";

const EnlargedImage = ({
  containerClassName,
  containerStyle,
  cursorOffset,
  position,
  fadeDurationInMs = 0,
  imageClassName,
  imageStyle,
  isActive,
  isLazyLoaded = true,
  largeImage,
  containerDimensions,
  isPortalRendered,
  isInPlaceMode,
  isPositionOutside,
  smallImage,
}) => {
  const [isTransitionEntering, setIsTransitionEntering] = useState(false);
  const [isTransitionActive, setIsTransitionActive] = useState(false);
  const [isTransitionLeaving, setIsTransitionLeaving] = useState(false);
  const [isTransitionDone, setIsTransitionDone] = useState(false);
  const timersRef = useRef([]);
  const prevIsActiveRef = useRef(isActive);
  const prevIsPositionOutsideRef = useRef(isPositionOutside);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timerId) => {
        clearTimeout(timerId);
      });
    };
  }, []);

  useEffect(() => {
    const scheduleCssTransition = () => {
      const prevIsActive = prevIsActiveRef.current;
      const prevIsPositionOutside = prevIsPositionOutsideRef.current;

      const willIsActiveChange = isActive !== prevIsActive;
      const willIsPositionOutsideChange =
        isPositionOutside !== prevIsPositionOutside;

      if (!willIsActiveChange && !willIsPositionOutsideChange) {
        return;
      }

      if (isActive && !isPositionOutside) {
        setIsTransitionDone(false);
        setIsTransitionEntering(true);

        timersRef.current.push(
          setTimeout(() => {
            setIsTransitionEntering(false);
            setIsTransitionActive(true);
          }, 0)
        );
      } else {
        setIsTransitionLeaving(true);
        setIsTransitionActive(false);

        timersRef.current.push(
          setTimeout(() => {
            setIsTransitionDone(true);
            setIsTransitionLeaving(false);
          }, fadeDurationInMs)
        );
      }

      prevIsActiveRef.current = isActive;
      prevIsPositionOutsideRef.current = isPositionOutside;
    };

    scheduleCssTransition();
  }, [isActive, isPositionOutside, fadeDurationInMs]);

  const getImageCoordinates = () => {
    if (isInPlaceMode) {
      return getInPlaceEnlargedImageCoordinates({
        containerDimensions,
        largeImage,
        position,
      });
    }

    return getLensModeEnlargedImageCoordinates({
      containerDimensions,
      cursorOffset,
      largeImage,
      position,
      smallImage,
    });
  };

  const isVisible =
    isTransitionEntering || isTransitionActive || isTransitionLeaving;

  const containerStyleToUse = getEnlargedImageContainerStyle({
    containerDimensions,
    containerStyle,
    fadeDurationInMs,
    isTransitionActive,
    isInPlaceMode,
    isPortalRendered,
  });

  const imageStyleToUse = getEnlargedImageStyle({
    imageCoordinates: getImageCoordinates(),
    imageStyle,
    largeImage,
  });

  const { alt = "", onLoad = noop, onError = noop } = largeImage;

  const component = (
    <div className={containerClassName} style={containerStyleToUse}>
      <img
        alt={alt}
        className={imageClassName}
        src={largeImage.src}
        srcSet={largeImage.srcSet}
        sizes={largeImage.sizes}
        style={imageStyleToUse}
        onLoad={onLoad}
        onError={onError}
      />
    </div>
  );

  if (isLazyLoaded) {
    return isVisible ? component : null;
  }

  return component;
};

EnlargedImage.propTypes = {
  containerClassName: PropTypes.string,
  containerStyle: PropTypes.object,
  cursorOffset: Point,
  position: Point,
  fadeDurationInMs: PropTypes.number,
  imageClassName: PropTypes.string,
  imageStyle: PropTypes.object,
  isActive: PropTypes.bool,
  isLazyLoaded: PropTypes.bool,
  largeImage: LargeImageShape,
  containerDimensions: ContainerDimensions,
  isPortalRendered: PropTypes.bool,
  isInPlaceMode: PropTypes.bool,
  isPositionOutside: PropTypes.bool.isRequired,
};

export default EnlargedImage;
