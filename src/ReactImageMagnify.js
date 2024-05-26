/* eslint-disable import/default */
"use client";
import objectAssign from "object-assign";
import PropTypes from "prop-types";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactCursorPosition from "react-cursor-position";
import * as detectIt from "detect-it";
import RenderEnlargedImage from "./RenderEnlargedImage";
import NegativeSpaceLens from "./lens/negative-space";
import PositiveSpaceLens from "./lens/positive-space";
import DisplayUntilActive from "./hint/DisplayUntilActive";
import Hint from "./hint/DefaultHint";
import { getLensCursorOffset } from "./lib/lens";
import { getEnlargedImageContainerDimension } from "./lib/dimensions";
import { getContainerStyle, getSmallImageStyle } from "./lib/styles";
import { LargeImageShape, SmallImageShape } from "./prop-types/Image";
import {
  EnlargedImagePosition,
  EnlargedImageContainerDimensions,
} from "./prop-types/EnlargedImage";
import { noop } from "./utils";
import { INPUT_TYPE, ENLARGED_IMAGE_POSITION } from "./constants";

const ReactImageMagnify = ({
  enlargedImageContainerDimensions = {
    width: "100%",
    height: "100%",
  },
  isEnlargedImagePortalEnabledForTouch = false,
  fadeDurationInMs = 300,
  shouldHideHintAfterFirstActivation = true,
  isHintEnabled = false,
  hintTextMouse = "Hover to Zoom",
  hintTextTouch = "Long-Touch to Zoom",
  hoverDelayInMs = 250,
  hoverOffDelayInMs = 150,
  shouldUsePositiveSpaceLens = false,
  ...props
}) => {
  const {
    smallImage,
    smallImage: { isFluidWidth },
  } = props;

  const [smallImageDimensions, setSmallImageDimensions] = useState({
    smallImageWidth: 0,
    smallImageHeight: 0,
  });

  const [detectedInputType, setDetectedInputType] = useState({
    isMouseDetected: detectIt.primaryInput === INPUT_TYPE.mouse,
    isTouchDetected: detectIt.primaryInput === INPUT_TYPE.touch,
  });

  const smallImageEl = useRef(null);

  const setSmallImageDimensionState = useCallback(() => {
    if (smallImageEl.current) {
      const { offsetWidth: smallImageWidth, offsetHeight: smallImageHeight } =
        smallImageEl.current;

      setSmallImageDimensions({ smallImageWidth, smallImageHeight });
    }
  }, []);

  useEffect(() => {
    if (isFluidWidth) {
      setSmallImageDimensionState();
      window.addEventListener("resize", setSmallImageDimensionState);
    }

    return () => {
      if (isFluidWidth) {
        window.removeEventListener("resize", setSmallImageDimensionState);
      }
    };
  }, [isFluidWidth, setSmallImageDimensionState]);

  const onSmallImageLoad = useCallback(
    (e) => {
      const { onLoad = noop } = smallImage;
      onLoad(e);

      if (isFluidWidth) {
        setSmallImageDimensionState();
      }
    },
    [smallImage, isFluidWidth, setSmallImageDimensionState]
  );

  const onDetectedInputTypeChanged = useCallback((detectedInputType) => {
    setDetectedInputType(detectedInputType);
  }, []);

  const getSmallImage = useCallback(() => {
    if (!isFluidWidth) {
      return smallImage;
    }

    const { smallImageWidth: fluidWidth, smallImageHeight: fluidHeight } =
      smallImageDimensions;

    return objectAssign({}, smallImage, {
      width: fluidWidth,
      height: fluidHeight,
    });
  }, [isFluidWidth, smallImage, smallImageDimensions]);

  const getEnlargedImagePlacement = useCallback(() => {
    const { enlargedImagePosition: userDefinedEnlargedImagePosition } = props;

    const { isTouchDetected } = detectedInputType;

    const computedEnlargedImagePosition = isTouchDetected
      ? ENLARGED_IMAGE_POSITION.over
      : ENLARGED_IMAGE_POSITION.beside;

    return userDefinedEnlargedImagePosition || computedEnlargedImagePosition;
  }, [props, detectedInputType]);

  const isInPlaceMode = useCallback(() => {
    const { over: OVER } = ENLARGED_IMAGE_POSITION;
    return getEnlargedImagePlacement() === OVER;
  }, [getEnlargedImagePlacement]);

  const getEnlargedImageContainerDimensions = useCallback(() => {
    const {
      enlargedImageContainerDimensions: {
        width: containerWidth,
        height: containerHeight,
      } = {
        width: "100%",
        height: "100%",
      },
    } = props;
    const { width: smallImageWidth, height: smallImageHeight } =
      getSmallImage();
    const isInPlace = isInPlaceMode();

    return {
      width: getEnlargedImageContainerDimension({
        containerDimension: containerWidth,
        smallImageDimension: smallImageWidth,
        isInPlaceMode: isInPlace,
      }),
      height: getEnlargedImageContainerDimension({
        containerDimension: containerHeight,
        smallImageDimension: smallImageHeight,
        isInPlaceMode: isInPlace,
      }),
    };
  }, [props, getSmallImage, isInPlaceMode]);

  const isTouchDetected = detectedInputType.isTouchDetected;

  const shouldShowLens = !isInPlaceMode() && !isTouchDetected;

  const lensComponent = props.lensComponent
    ? props.lensComponent
    : shouldUsePositiveSpaceLens
    ? PositiveSpaceLens
    : NegativeSpaceLens;

  const {
    className,
    style,
    isActivatedOnTouch,
    pressDuration,
    pressMoveThreshold,
    smallImage: { onError = noop },
    imageClassName,
    imageStyle,
    lensStyle,
    largeImage,
    enlargedImageContainerClassName,
    enlargedImageContainerStyle,
    enlargedImageClassName,
    enlargedImageStyle,
    enlargedImagePortalId,
    hintComponent: HintComponent = Hint,
  } = props;

  const smallImg = getSmallImage();

  const cursorOffset = getLensCursorOffset(
    smallImg,
    largeImage,
    getEnlargedImageContainerDimensions()
  );

  const Lens = lensComponent;

  return (
    <ReactCursorPosition
      className={className}
      hoverDelayInMs={hoverDelayInMs}
      hoverOffDelayInMs={hoverOffDelayInMs}
      isActivatedOnTouch={isActivatedOnTouch}
      onDetectedInputTypeChanged={onDetectedInputTypeChanged}
      pressDuration={pressDuration}
      pressMoveThreshold={pressMoveThreshold}
      shouldStopTouchMovePropagation={true}
      style={getContainerStyle(smallImg, style)}
    >
      <img
        src={smallImg.src}
        srcSet={smallImg.srcSet}
        sizes={smallImg.sizes}
        alt={smallImg.alt}
        className={imageClassName}
        style={getSmallImageStyle(smallImg, imageStyle)}
        ref={smallImageEl}
        onLoad={onSmallImageLoad}
        onError={onError}
      />
      {isHintEnabled && (
        <DisplayUntilActive
          shouldHideAfterFirstActivation={shouldHideHintAfterFirstActivation}
        >
          <HintComponent
            isTouchDetected={isTouchDetected}
            hintTextMouse={hintTextMouse}
            hintTextTouch={hintTextTouch}
          />
        </DisplayUntilActive>
      )}
      {shouldShowLens && (
        <Lens
          cursorOffset={cursorOffset}
          fadeDurationInMs={fadeDurationInMs}
          smallImage={smallImg}
          style={lensStyle}
        />
      )}
      <RenderEnlargedImage
        containerClassName={enlargedImageContainerClassName}
        containerDimensions={getEnlargedImageContainerDimensions()}
        containerStyle={enlargedImageContainerStyle}
        cursorOffset={cursorOffset}
        fadeDurationInMs={fadeDurationInMs}
        imageClassName={enlargedImageClassName}
        imageStyle={enlargedImageStyle}
        largeImage={largeImage}
        smallImage={smallImg}
        portalId={enlargedImagePortalId}
        isPortalEnabledForTouch={isEnlargedImagePortalEnabledForTouch}
        isTouchDetected={isTouchDetected}
        isInPlaceMode={isInPlaceMode()}
      />
    </ReactCursorPosition>
  );
};

ReactImageMagnify.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  hoverDelayInMs: PropTypes.number,
  hoverOffDelayInMs: PropTypes.number,
  fadeDurationInMs: PropTypes.number,
  pressDuration: PropTypes.number,
  pressMoveThreshold: PropTypes.number,
  isActivatedOnTouch: PropTypes.bool,
  imageClassName: PropTypes.string,
  imageStyle: PropTypes.object,
  lensStyle: PropTypes.object,
  lensComponent: PropTypes.func,
  shouldUsePositiveSpaceLens: PropTypes.bool,
  smallImage: SmallImageShape,
  largeImage: LargeImageShape,
  enlargedImageContainerClassName: PropTypes.string,
  enlargedImageContainerStyle: PropTypes.object,
  enlargedImageClassName: PropTypes.string,
  enlargedImageStyle: PropTypes.object,
  enlargedImageContainerDimensions: EnlargedImageContainerDimensions,
  enlargedImagePosition: EnlargedImagePosition,
  enlargedImagePortalId: PropTypes.string,
  isEnlargedImagePortalEnabledForTouch: PropTypes.bool,
  hintComponent: PropTypes.func,
  hintTextMouse: PropTypes.string,
  hintTextTouch: PropTypes.string,
  isHintEnabled: PropTypes.bool,
  shouldHideHintAfterFirstActivation: PropTypes.bool,
};

export default ReactImageMagnify;
