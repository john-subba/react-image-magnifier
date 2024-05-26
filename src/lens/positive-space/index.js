import React, { useMemo } from "react";
import objectAssign from "object-assign";
import LensPropTypes from "../../prop-types/Lens";
import clamp from "clamp";
import dataUri from "./assets/textured-lens-data-uri";

const PositiveSpaceLens = (props) => {
  const dimensions = useMemo(() => {
    const {
      cursorOffset: { x: cursorOffsetX, y: cursorOffsetY },
    } = props;

    return {
      width: cursorOffsetX * 2,
      height: cursorOffsetY * 2,
    };
  }, [props.cursorOffset]);

  const positionOffset = useMemo(() => {
    const {
      cursorOffset: { x: cursorOffsetX, y: cursorOffsetY },
      position: { x: positionX, y: positionY },
      smallImage: { height: imageHeight, width: imageWidth },
    } = props;

    const { width, height } = dimensions;

    const top = positionY - cursorOffsetY;
    const left = positionX - cursorOffsetX;
    const maxTop = imageHeight - height;
    const maxLeft = imageWidth - width;
    const minOffset = 0;

    return {
      top: clamp(top, minOffset, maxTop),
      left: clamp(left, minOffset, maxLeft),
    };
  }, [props, dimensions]);

  const defaultStyle = useMemo(() => {
    const { fadeDurationInMs } = props;

    return {
      transition: `opacity ${fadeDurationInMs}ms ease-in`,
      backgroundImage: `url(${dataUri})`,
    };
  }, [props.fadeDurationInMs]);

  const userSpecifiedStyle = props.style;

  const isVisible = useMemo(() => {
    const { isActive, isPositionOutside } = props;

    return isActive && !isPositionOutside;
  }, [props.isActive, props.isPositionOutside]);

  const priorityStyle = useMemo(() => {
    const { width, height } = dimensions;

    const { top, left } = positionOffset;

    return {
      position: "absolute",
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${height}px`,
      opacity: isVisible ? 1 : 0,
    };
  }, [dimensions, positionOffset, isVisible]);

  const compositStyle = useMemo(() => {
    let obj = {
      ...(defaultStyle || {}),
      ...(userSpecifiedStyle || {}),
      ...(priorityStyle || {}),
    };
    return objectAssign(obj);
  }, [defaultStyle, userSpecifiedStyle, priorityStyle]);

  return <div style={compositStyle} />;
};

PositiveSpaceLens.propTypes = LensPropTypes;

export default PositiveSpaceLens;
