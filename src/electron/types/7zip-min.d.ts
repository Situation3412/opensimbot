declare module '7zip-min' {
  export function unpack(source: string, destination: string, callback: (error: Error | null) => void): void;
  export function pack(source: string, destination: string, callback: (error: Error | null) => void): void;
  export function list(source: string, callback: (error: Error | null, files: string[]) => void): void;
} 