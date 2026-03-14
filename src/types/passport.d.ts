// Ambient module declarations to satisfy TypeScript during build when @types packages are not installed
// This is safe because the runtime behavior is handled by the actual JS packages (passport and strategies).

declare module 'passport';
declare module 'passport-google-oauth20';
declare module 'passport-facebook';
