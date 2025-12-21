import React from 'react';

interface IPhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  statusColor?: 'black' | 'white';
}

const IPhoneMockup: React.FC<IPhoneMockupProps> = ({ children, className = '', statusColor = 'black' }) => {
  return (
    <div className={`relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[852px] w-[393px] shadow-xl flex flex-col ${className}`}>
      {/* Side Buttons */}
      <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
      <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
      
      {/* Screen */}
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white dark:bg-gray-800 relative flex flex-col">
        {/* Status Bar / Dynamic Island Area */}
        <div className="absolute top-0 w-full h-[54px] z-50 flex justify-center items-start pt-2 pointer-events-none">
             {/* Dynamic Island */}
            <div className="h-[35px] w-[120px] bg-black rounded-[20px] flex items-center justify-center relative">
               <div className="absolute right-3 w-2 h-2 rounded-full bg-[#1e1e1e]/50"></div>
            </div>
            {/* Time (Left) */}
            <div className={`absolute left-8 top-4 text-[15px] font-semibold ${statusColor === 'white' ? 'text-white' : 'text-black'}`}>9:41</div>
            {/* Icons (Right) */}
            <div className={`absolute right-8 top-4 flex gap-1.5 ${statusColor === 'white' ? 'text-white' : 'text-black'}`}>
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" opacity="0.1"/><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/></svg>
               <svg className="w-6 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16,5V19H19V5H16M11,8V19H14V8H11M6,13V19H9V13H6Z"/></svg>
               <svg className="w-6 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16.67,4H7.33C6.6,4 6,4.6 6,5.33V18.67C6,19.4 6.6,20 7.33,20H16.67C17.4,20 18,19.4 18,18.67V5.33C18,4.6 17.4,4 16.67,4M15.33,18H8.67V6H15.33V18Z"/></svg>
            </div>
        </div>
        
        {/* App Content */}
        <div className="w-full h-full bg-gray-50 overflow-hidden relative font-sans">
            {children}
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-[130px] h-[5px] bg-black/20 rounded-full z-50"></div>
      </div>
    </div>
  );
};

export default IPhoneMockup;