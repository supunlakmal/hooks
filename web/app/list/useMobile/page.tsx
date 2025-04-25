"use client";

import React from 'react';
import useIsMobile from '../../../../src/hooks/use-mobile';

const MobileDetector: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div>
      {isMobile ? 'You are on a mobile device' : 'You are on a desktop device'}
    </div>
  );
};

export default MobileDetector;