export interface InputProps {
    label: string;
    value: string | number;
    type:string;
    onChange: (newValue: string) => void;
    className?: string;
    placeholder?: string;
    name?: string;
}

export interface ParamsProps {
    params: Promise<{ id: string }>
}

export interface ButtonProps{
    title?:string;
    style?:React.CSSProperties;
    className?:string;
    onClick?:()=>void;
    disabled?:boolean;
    type?:"button" | "submit" | "reset" | undefined;
    leftIcon?:React.ReactNode
}