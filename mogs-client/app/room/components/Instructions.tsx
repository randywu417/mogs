import React from "react";

const Key: React.FC<{ char?: string }> = ({ char }) => {
    return (
        <div className="w-8 h-8 rounded-sm bg-slate-200 border-b-2 border-r-2 border-solid border-slate-400 flex justify-center items-center text-stone-500">
            {char}
        </div>
    );
};

const Instructions: React.FC = () => {
    return (
        <div className="absolute bottom-28 right-8 grid grid-rows-3 grid-cols-3 gap-2 opacity-60">
            <Key char="1" />
            <Key char="2" />
            <Key char="3" />
            <div />
            <Key char="W" />
            <div />
            <Key char="A" />
            <Key char="S" />
            <Key char="D" />
        </div>
    );
};

export default Instructions;
