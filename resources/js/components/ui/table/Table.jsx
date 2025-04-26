export default function Table({ children, className }) {
  return <table className={`min-w-full ${className}`}>{children}</table>;
}
