import React from 'react';
import { cn } from '../../lib/utils';

export const Slider = ({ label, value, min, max, step = 1, onChange, formatValue, className }) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    {label}
                </label>
                <span className="text-lg font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-lg border border-teal-100">
                    {formatValue ? formatValue(value) : value}
                </span>
            </div>

            <div className="relative group">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-0 z-10 relative 
                        [&::-webkit-slider-thumb]:appearance-none 
                        [&::-webkit-slider-thumb]:h-5 
                        [&::-webkit-slider-thumb]:w-5 
                        [&::-webkit-slider-thumb]:rounded-full 
                        [&::-webkit-slider-thumb]:bg-white 
                        [&::-webkit-slider-thumb]:border-4 
                        [&::-webkit-slider-thumb]:border-teal-500 
                        [&::-webkit-slider-thumb]:cursor-pointer 
                        [&::-webkit-slider-thumb]:shadow-md 
                        [&::-webkit-slider-thumb]:transition-transform 
                        [&::-webkit-slider-thumb]:duration-100 
                        hover:[&::-webkit-slider-thumb]:scale-110
                        [&::-moz-range-thumb]:h-5
                        [&::-moz-range-thumb]:w-5
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:bg-white
                        [&::-moz-range-thumb]:border-4
                        [&::-moz-range-thumb]:border-teal-500
                        [&::-moz-range-thumb]:cursor-pointer
                        hover:[&::-moz-range-thumb]:scale-110"
                    style={{
                        background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
                    }}
                />
            </div>
        </div>
    );
};
