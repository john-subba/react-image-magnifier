import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import objectAssign from "object-assign";
import EnlargedImage from "./EnlargedImage";

const RenderEnlargedImage = ({
  isPortalEnabledForTouch,
  isTouchDetected,
  portalId,
  ...props
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    setIsMounted(true);

    if (isPortalRendered) {
      setPortalElement(document.getElementById(portalId));
    }
  }, [portalId, isPortalRendered]);

  const isPortalIdImplemented = useMemo(() => !!portalId, [portalId]);

  const isPortalRendered = useMemo(() => {
    if (!isPortalIdImplemented) {
      return false;
    }

    if (!isTouchDetected) {
      return true;
    }

    return isPortalEnabledForTouch;
  }, [isPortalIdImplemented, isTouchDetected, isPortalEnabledForTouch]);

  const compositProps = useMemo(
    () => objectAssign({}, props, { isPortalRendered }),
    [props, isPortalRendered]
  );

  if (!isMounted) {
    return null;
  }

  if (isPortalRendered) {
    return ReactDOM.createPortal(
      <EnlargedImage {...compositProps} />,
      portalElement
    );
  }

  return <EnlargedImage {...compositProps} />;
};

RenderEnlargedImage.propTypes = {
  isPortalEnabledForTouch: PropTypes.bool.isRequired,
  isTouchDetected: PropTypes.bool.isRequired,
  portalId: PropTypes.string,
};

export default RenderEnlargedImage;
