import React from 'react';
import logoImg from '../../assets/phonepe-logo.png';

interface PhonePeLogoProps {
  className?: string;
  size?: number;
}

export const PhonePeLogo: React.FC<PhonePeLogoProps> = ({ className = '', size = 42 }) => {
  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-lg shadow-phonepe-950/60 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={logoImg}
        alt="PhonePe Logo"
        className="w-full h-full object-contain rounded-2xl"
        onError={(e) => {
          // Fallback to public folder path if bundled asset fails
          (e.currentTarget as HTMLImageElement).src = './phonepe-logo.png';
        }}
      />
    </div>
  );
};
